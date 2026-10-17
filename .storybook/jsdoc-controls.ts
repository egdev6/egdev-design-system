import type { ReactRenderer } from '@storybook/react-vite';
import type { ArgTypesEnhancer, StrictArgTypes } from 'storybook/internal/types';

type ControlMapping = { argTypes: StrictArgTypes; diagnostics: string[] };
type Primitive = string | number | boolean;

function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && (typeof value === 'object' || typeof value === 'function') && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function ownRecord(value: Record<string, unknown> | undefined, key: string): Record<string, unknown> | undefined {
  return value && Object.hasOwn(value, key) ? record(value[key]) : undefined;
}

function nativeDeclaration(prop: Record<string, unknown>): boolean {
  const parent = record(prop.parent);
  const declarations = Array.isArray(prop.declarations) ? prop.declarations : [];
  const sources = parent ? [parent, ...declarations] : declarations;
  return (
    sources.length > 0 &&
    sources.every((source) => {
      const file = record(source)?.fileName;
      return typeof file === 'string' && /(?:^|[/\\])node_modules[/\\]/.test(file);
    })
  );
}

function enumOptions(type: Record<string, unknown> | undefined): Primitive[] | undefined {
  if (type?.name !== 'enum' || !Array.isArray(type.value) || type.value.length === 0) {
    return undefined;
  }
  const values: unknown[] = type.value;
  return values.every(
    (value): value is Primitive =>
      typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))
  )
    ? values
    : undefined;
}

/**
 * Map only existing, tagged own prop rows. Invalid metadata is returned as diagnostics,
 * never thrown or logged in the render loop; owned-component tests must require none.
 * Extracted types win over comments. Defaults, args and documentation are not synthesized.
 */
export function mapJSDocControls(argTypes: StrictArgTypes, component: unknown): ControlMapping {
  const info = ownRecord(record(component), '__docgenInfo');
  const props = ownRecord(info, 'props');
  const componentRecord = record(component);
  const name = info?.displayName ?? componentRecord?.displayName ?? componentRecord?.name;
  const componentName = typeof name === 'string' && name ? name : 'Component';
  const diagnostics: string[] = [];
  const mapped = { ...argTypes };
  for (const [propName, argType] of Object.entries(argTypes)) {
    const prop = ownRecord(props, propName);
    if (!prop || nativeDeclaration(prop)) {
      continue;
    }
    const tags = ownRecord(prop, 'tags');
    if (!tags || !Object.hasOwn(tags, 'control')) {
      continue;
    }
    const reject = (reason: string) => diagnostics.push(`${componentName}.${propName}: ${reason}`);
    const raw = tags.control;
    const directives =
      typeof raw === 'string'
        ? [
            ...new Set(
              raw
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean)
            )
          ]
        : [];
    if (directives.length !== 1) {
      reject('expected one unambiguous @control directive');
      continue;
    }
    const directive = directives[0];
    const type = record(argType.type);
    const options = enumOptions(type);
    const booleanEnum = options?.length === 2 && options.includes(false) && options.includes(true);
    let control: false | { type: 'text' | 'number' | 'boolean' | 'select' };
    switch (directive) {
      case 'text':
      case 'number':
        if (type?.name !== (directive === 'text' ? 'string' : 'number')) {
          reject(`@control ${directive} is incompatible with the extracted type`);
          continue;
        }
        control = { type: directive };
        break;
      case 'boolean':
        if (type?.name !== 'boolean' && !booleanEnum) {
          reject('@control boolean requires a boolean type or the primitive false/true enum');
          continue;
        }
        control = { type: 'boolean' };
        break;
      case 'select':
        if (!options) {
          reject('@control select requires a finite extracted primitive enum');
          continue;
        }
        control = { type: 'select' };
        break;
      case 'false':
        if (typeof tags.controlReason !== 'string' || !tags.controlReason.trim()) {
          reject('@control false requires a concrete @controlReason');
          continue;
        }
        control = false;
        break;
      default:
        reject(`unsupported @control ${directive}`);
        continue;
    }
    // Story/preview overrides remain authoritative, including control: false.
    if (argType.control !== undefined) {
      continue;
    }
    if (
      directive === 'select' &&
      argType.options !== undefined &&
      (!Array.isArray(argType.options) ||
        argType.options.length !== options?.length ||
        !argType.options.every((option, index) => option === options?.[index]))
    ) {
      reject('@control select conflicts with existing options');
      continue;
    }
    mapped[propName] = {
      ...argType,
      control,
      ...(directive === 'select' && argType.options === undefined ? { options } : {})
    };
  }
  return { argTypes: mapped, diagnostics };
}

// First pass: React has extracted the rows; later inferControls preserves explicit controls.
export const jsdocControlsEnhancer: ArgTypesEnhancer<ReactRenderer> = (context) =>
  mapJSDocControls(context.argTypes, context.component).argTypes;
