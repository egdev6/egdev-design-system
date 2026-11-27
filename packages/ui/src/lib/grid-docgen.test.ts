// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { composeStory, INTERNAL_DEFAULT_PROJECT_ANNOTATIONS } from '@storybook/react-vite';
import { withCustomConfig } from 'react-docgen-typescript';
import ts from 'typescript';
import { beforeAll, describe, expect, it } from 'vitest';
import { mapJSDocControls } from '../../../../.storybook/jsdoc-controls';
import config from '../../../../.storybook/main';
import preview from '../../../../.storybook/preview';
import { layoutGapClasses } from '../primitives/stack/types';

const path = (name: string) => fileURLToPath(new URL(`../primitives/grid/${name}`, import.meta.url));

type OwnProp = {
  control: 'select' | 'boolean';
  /** The bare `@default` tag value; present only for constants the hook applies. */
  tagDefault?: string;
  /** The Controls table summary of that constant. */
  summary?: string;
  /** The declared union members; compared as a set, never as an order (see the extraction test). */
  members?: readonly (number | string)[];
};

const parts = [
  {
    name: 'Grid',
    alias: 'GridOwnProps',
    own: {
      columnCount: { control: 'select', tagDefault: '1', summary: '1', members: [1, 2, 3, 4, 12] },
      gap: {
        control: 'select',
        tagDefault: '4',
        summary: '4',
        members: Object.keys(layoutGapClasses).map(Number)
      },
      alignItems: {
        control: 'select',
        tagDefault: 'stretch',
        summary: '"stretch"',
        members: ['start', 'center', 'end', 'stretch', 'baseline']
      },
      collapseBelow: { control: 'select', members: [860, 1080] },
      asChild: { control: 'boolean', tagDefault: 'false', summary: 'false' }
    }
  },
  {
    name: 'GridItem',
    alias: 'GridItemOwnProps',
    own: {
      span: { control: 'select', members: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
      rowSpan: { control: 'select', members: [1, 2, 3, 4] },
      asChild: { control: 'boolean', tagDefault: 'false', summary: 'false' }
    }
  }
] as const satisfies readonly {
  name: string;
  alias: string;
  own: Record<string, OwnProp>;
}[];

/** The native rows `.storybook/main.ts` re-exposes for both parts; nothing else from node_modules reaches the docs. */
const nativeRows = ['aria-describedby', 'className', 'id', 'style', 'title'];

/** A literal union member as docgen prints it: `1` for numbers and `"center"` for strings. */
const literal = (raw: string): number | string => JSON.parse(raw) as number | string;
const ascending = (values: readonly (number | string)[]) =>
  [...values].sort((first, second) =>
    typeof first === 'number' && typeof second === 'number'
      ? first - second
      : String(first).localeCompare(String(second))
  );

describe('Grid and GridItem Storybook contract', () => {
  it('documents every own prop of both parts with one explicit control and a default only for constants', () => {
    const file = ts.createSourceFile('types.ts', readFileSync(path('types.ts'), 'utf8'), ts.ScriptTarget.Latest, true);
    const tags = (property: ts.PropertySignature, name: string) =>
      ts
        .getJSDocTags(property)
        .filter((tag) => tag.tagName.text === name)
        .map((tag) => ts.getTextOfJSDocComment(tag.comment));
    const declared = (alias: string): ts.PropertySignature[] => {
      const declaration = file.statements.find(
        (statement): statement is ts.TypeAliasDeclaration =>
          ts.isTypeAliasDeclaration(statement) && statement.name.text === alias
      );
      expect(declaration, `${alias} must exist in types.ts`).toBeDefined();
      return declaration && ts.isTypeLiteralNode(declaration.type)
        ? declaration.type.members.filter(ts.isPropertySignature)
        : [];
    };
    let total = 0;
    for (const { alias, own } of parts) {
      const properties = declared(alias);
      total += properties.length;
      // Exactly the planned props, in order: `children` and every native attribute stay inherited, not redeclared.
      expect(
        properties.map((property) => property.name.getText(file)),
        alias
      ).toEqual(Object.keys(own));
      for (const property of properties) {
        const name = property.name.getText(file);
        const expected: OwnProp = own[name as keyof typeof own];
        expect(property.questionToken, `${alias}.${name} is optional`).toBeDefined();
        expect(tags(property, 'control'), `${alias}.${name}`).toEqual([expected.control]);
        expect(tags(property, 'default'), `${alias}.${name}`).toEqual(expected.tagDefault ? [expected.tagDefault] : []);
        // No `false` control exists, so no reason tag either.
        expect(tags(property, 'controlReason'), `${alias}.${name}`).toEqual([]);
      }
    }
    expect(total).toBe(8);
  });

  it('keeps the stories on Primitives/Grid with the nine planned examples, no manual argTypes and no play', () => {
    const stories = readFileSync(path('Grid.stories.tsx'), 'utf8');
    expect(stories).toContain("title: 'Primitives/Grid'");
    expect(stories).toContain("tags: ['autodocs']");
    // GridItem has no story of its own, so the Docs page lists it as a subcomponent of Grid.
    expect(stories).toContain('subcomponents: { gridItem: GridItem }');
    expect(stories).not.toMatch(/\bargTypes\s*:|\bplay\s*:/);
    expect([...stories.matchAll(/^export const (\w+): Story/gm)].map((match) => match[1])).toEqual([
      'Default',
      'Columns',
      'Gaps',
      'Alignment',
      'Collapse',
      'Spans',
      'AboutSplit',
      'BuildThreeColumns',
      'AsChildList'
    ]);
    expect(config.stories).toContain('../packages/*/src/**/*.stories.@(ts|tsx)');
  });

  describe('through the real parser, the registered enhancer and native inference', () => {
    const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
      ...config.typescript?.reactDocgenTypescriptOptions
    });
    let docs: ReturnType<typeof parser.parse>;

    beforeAll(() => {
      // Both parts live in Grid.tsx, so one parse yields both component docs.
      docs = parser.parse(path('Grid.tsx'));
    }, 60_000);

    it('discovers exactly the two exported parts', () => {
      expect(docs.map((doc) => doc.displayName).sort()).toEqual(['Grid', 'GridItem']);
    });

    it.each(parts)('extracts $name with every own prop typed, defaulted and tagged as specified', ({ name, own }) => {
      const doc = docs.find((entry) => entry.displayName === name);
      if (!doc) {
        throw new Error(`Missing docgen for ${name}`);
      }
      // The own props plus the allowlisted native rows, and nothing else: no own `children` row, no ref, no handlers.
      // The parser drops an undocumented `children` by default, so the AST test guards a silent redeclaration and this
      // one guards a documented one.
      expect(Object.keys(doc.props).sort()).toEqual([...Object.keys(own), ...nativeRows].sort());
      expect(doc.props.children).toBeUndefined();
      for (const [prop, expected] of Object.entries(own) as [string, OwnProp][]) {
        const row = doc.props[prop];
        expect(row, `${name}.${prop}`).toBeDefined();
        expect(row?.required, `${name}.${prop} is optional`).toBe(false);
        expect((row?.description ?? '').length, `${name}.${prop} is described`).toBeGreaterThan(0);
        // A constant default is documented as a bare tag value; every other prop has none.
        expect(row?.tags, `${name}.${prop}`).toMatchObject({
          control: expected.control,
          ...(expected.tagDefault ? { default: expected.tagDefault } : {})
        });
        if (!expected.tagDefault) {
          expect(Object.keys(row?.tags ?? {}), `${name}.${prop} carries no default tag`).not.toContain('default');
        }
        expect(row?.defaultValue, `${name}.${prop}`).toEqual(
          expected.tagDefault ? { value: expected.tagDefault } : null
        );
        if (expected.members) {
          expect(row?.type.name).toBe('enum');
          const extracted = (row?.type.value ?? []).map((item: { value: string }) => literal(item.value));
          // The exact union, whatever order the type checker lists it in.
          expect(ascending(extracted), `${name}.${prop} members`).toEqual(ascending(expected.members));
        } else {
          expect(row?.type.name).toBe('boolean');
        }
      }
      for (const prop of nativeRows) {
        expect(doc.props[prop], `${name} native ${prop} stays in autodocs`).toBeDefined();
      }
    });

    it.each(parts)(
      'maps $name through the enhancer without diagnostics, injected args or reordering',
      ({ name, own }) => {
        const doc = docs.find((entry) => entry.displayName === name);
        expect(doc, `Missing docgen for ${name}`).toBeDefined();
        const component = Object.assign((_props: Record<string, unknown>) => null, { __docgenInfo: doc });
        const extract = INTERNAL_DEFAULT_PROJECT_ANNOTATIONS.parameters?.docs?.extractArgTypes;
        const mapped = mapJSDocControls(extract(component), component);
        expect(mapped.diagnostics).toEqual([]);
        const installed = composeStory({}, { title: `Metadata/${name}`, component }, preview, 'Default');
        const native = composeStory({}, { title: `Metadata/${name}`, component }, {}, 'Default');
        for (const [prop, expected] of Object.entries(own) as [string, OwnProp][]) {
          const row = installed.argTypes[prop];
          expect(row?.control, `${name}.${prop}`).toEqual({ type: expected.control });
          expect(row?.table?.disable, `${name}.${prop} keeps its documented row`).not.toBe(true);
          expect(row?.type?.required, `${name}.${prop}`).not.toBe(true);
          // The Docs default column documents constants only; Controls may stay unset for the rest.
          expect(row?.table?.defaultValue?.summary, `${name}.${prop}`).toBe(expected.summary);
          if (expected.members) {
            // The same members as the declared union, and the enhancer keeps the extractor's values and order.
            expect(ascending(row?.options ?? []), `${name}.${prop} options`).toEqual(ascending(expected.members));
            expect(row?.options, `${name}.${prop} order`).toEqual(native.argTypes[prop]?.options);
          } else {
            expect(row?.options, `${name}.${prop} has no options`).toBeUndefined();
          }
        }
        // Documentation must not initialize optional Controls args just to fill the UI.
        expect(installed.args).toEqual({});
      }
    );
  });
});
