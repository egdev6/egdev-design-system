// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { withCustomConfig } from 'react-docgen-typescript';
import { beforeAll, describe, expect, it } from 'vitest';
import { mapJSDocControls } from '../../../../.storybook/jsdoc-controls';
import config from '../../../../.storybook/main';

// Dedicated Label integration: the installed parser must extract the real public
// Label component through the central configured options, including the shared
// camelCase documentedNativeProps lookup, and the approved central enhancer must
// map the owned metadata without diagnostics.
const normalize = (value: unknown) => String(value).replace(/^['"]+|['"]+$/g, '');
const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
  ...config.typescript?.reactDocgenTypescriptOptions
});
let docs: ReturnType<typeof parser.parse>;

describe('Label Storybook TypeScript docgen integration', () => {
  beforeAll(() => {
    expect(config.typescript?.reactDocgen).toBe('react-docgen-typescript');
    docs = parser.parse(fileURLToPath(new URL('../primitives/label/Label.tsx', import.meta.url)));
  }, 20_000);

  it('discovers the real Label component with exactly the approved documented surface', () => {
    const doc = docs.find((item) => item.displayName === 'Label');
    expect(doc, 'Label must be discovered from its real component and public props alias').toBeDefined();
    if (!doc) {
      throw new Error('Missing docgen for Label');
    }
    // Own props plus the native label attributes approved for documentation; no broad
    // node_modules declaration leak (no handlers, style, title, ref or asChild rows).
    expect(Object.keys(doc.props).sort()).toEqual(['children', 'className', 'htmlFor', 'id', 'variant']);
  });

  it('extracts the required own children with a disabled control and a concrete story reason', () => {
    const doc = docs.find((item) => item.displayName === 'Label');
    if (!doc) {
      throw new Error('Missing docgen for Label');
    }
    const children = doc.props.children;
    expect(children?.required).toBe(true);
    expect(children?.type.name).toBe('ReactNode');
    expect(children?.defaultValue).toBeNull();
    expect(children?.tags).toMatchObject({ control: 'false' });
    const reason = (children?.tags as Record<string, unknown> | undefined)?.controlReason;
    expect(typeof reason).toBe('string');
    // The reason must point to the dedicated wrapping and default story examples.
    expect(reason).toMatch(/Default/);
    expect(reason).toMatch(/WrappingControl/);
  });

  it('extracts the optional variant enum with a select control and the actual field default', () => {
    const doc = docs.find((item) => item.displayName === 'Label');
    if (!doc) {
      throw new Error('Missing docgen for Label');
    }
    const variant = doc.props.variant;
    expect(variant?.required).toBe(false);
    expect(variant?.type.name).toBe('enum');
    expect(variant?.type.value?.map((item: { value: string }) => normalize(item.value))).toEqual(['field', 'choice']);
    expect(normalize(variant?.defaultValue?.value)).toBe('field');
    expect(variant?.tags).toMatchObject({ control: 'select' });
  });

  it('documents the approved native label association and class surface without asChild', () => {
    const doc = docs.find((item) => item.displayName === 'Label');
    if (!doc) {
      throw new Error('Missing docgen for Label');
    }
    const props = doc.props;
    expect(props.htmlFor?.type.name).toBe('string');
    expect(props.id?.type.name).toBe('string');
    expect(props.className?.type.name).toBe('string');
    expect(props.asChild).toBeUndefined();
    for (const prop of Object.values(props)) {
      expect(prop.description).not.toMatch(/@control(?:Reason)?/);
    }
  });

  it('maps owned metadata through the central enhancer with zero diagnostics', () => {
    const doc = docs.find((item) => item.displayName === 'Label');
    if (!doc) {
      throw new Error('Missing docgen for Label');
    }
    // Storybook inference normalizes docgen enum members to primitive options before
    // the central enhancer validates them.
    const inferType = (prop: { type: { name: string; value?: unknown } }) =>
      prop.type.name === 'enum' && Array.isArray(prop.type.value)
        ? {
            name: 'enum',
            value: prop.type.value.map((item) => {
              const value =
                typeof item === 'object' && item !== null && 'value' in item
                  ? (item as { value: unknown }).value
                  : item;
              // savePropValueAsString keeps string members quoted; the installed
              // pipeline treats them as their bare option values.
              return normalize(value);
            })
          }
        : prop.type;
    const argTypes = Object.fromEntries(
      Object.entries(doc.props).map(([name, prop]) => [
        name,
        { type: inferType(prop), ...(prop.defaultValue ? { defaultValue: prop.defaultValue.value } : {}) }
      ])
    );
    const component = { displayName: 'Label', __docgenInfo: doc };
    const { argTypes: mapped, diagnostics } = mapJSDocControls(argTypes as never, component);
    expect(diagnostics).toEqual([]);
    expect(mapped.children?.control).toBe(false);
    expect(mapped.variant?.control).toMatchObject({ type: 'select' });
    expect(mapped.variant?.options).toEqual(['field', 'choice']);
    // Untagged native rows are untouched by the metadata-only enhancer.
    expect(mapped.htmlFor?.control).toBeUndefined();
    expect(mapped.id?.control).toBeUndefined();
    expect(mapped.className?.control).toBeUndefined();
  });
});
