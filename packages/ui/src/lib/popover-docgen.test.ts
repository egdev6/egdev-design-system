// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { composeStory, INTERNAL_DEFAULT_PROJECT_ANNOTATIONS } from '@storybook/react-vite';
import { withCustomConfig } from 'react-docgen-typescript';
import type { StrictArgTypes } from 'storybook/internal/types';
import ts from 'typescript';
import { beforeAll, describe, expect, it } from 'vitest';
import { mapJSDocControls } from '../../../../.storybook/jsdoc-controls';
import config from '../../../../.storybook/main';
import preview from '../../../../.storybook/preview';

const path = (name: string) => fileURLToPath(new URL(`../molecules/popover/${name}`, import.meta.url));
const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
  ...config.typescript?.reactDocgenTypescriptOptions
});
let docs: ReturnType<typeof parser.parse>;
const expected = {
  popover: { children: false, open: 'boolean', defaultOpen: 'boolean', onOpenChange: false, modal: 'boolean' },
  popovertrigger: { children: false, asChild: 'boolean' },
  popovercontent: { children: false, label: 'text', side: 'select', align: 'select' },
  popoverclose: { children: false, asChild: 'boolean' }
} as const;

describe('Popover Storybook metadata', () => {
  beforeAll(() => {
    docs = parser.parse(path('Popover.tsx'));
  }, 20_000);

  const names = ['Popover', 'PopoverTrigger', 'PopoverContent', 'PopoverClose'] as const;
  it.each(names)('%s preserves real extraction and registered Controls', (name) => {
    const doc = docs.find((entry) => entry.displayName === name);
    expect(doc).toBeDefined();
    const component = Object.assign((_props: Record<string, unknown>) => null, { __docgenInfo: doc });
    const composed = composeStory({}, { title: `Metadata/${name}`, component }, preview, 'Default');
    const extract = INTERNAL_DEFAULT_PROJECT_ANNOTATIONS.parameters?.docs?.extractArgTypes;
    const extracted: StrictArgTypes = extract(component);
    expect(mapJSDocControls(extracted, component).diagnostics).toEqual([]);
    for (const [prop, control] of Object.entries(expected[name.toLowerCase() as keyof typeof expected])) {
      expect(composed.argTypes[prop]?.control, `${name}.${prop}`).toEqual(
        control === false ? false : { type: control }
      );
      expect(composed.argTypes[prop]?.table?.disable).toBeUndefined();
      expect(doc?.props[prop]?.description).toBeTruthy();
    }
    expect(doc?.props.children?.required).toBe(true);
    expect(composed.args).toEqual({});
    if (name === 'Popover') {
      expect(composed.argTypes.defaultOpen?.table?.defaultValue?.summary).toBe('false');
      expect(composed.argTypes.modal?.table?.defaultValue?.summary).toBe('false');
      expect(doc?.props.id).toBeUndefined();
      expect(doc?.props.open?.defaultValue).toBeNull();
    } else if (name === 'PopoverContent') {
      expect(doc?.props.label?.required).toBe(true);
      expect(composed.argTypes.side?.table?.defaultValue?.summary).toBe('"bottom"');
      expect(composed.argTypes.align?.table?.defaultValue?.summary).toBe('"start"');
      expect(composed.argTypes.side?.options).toEqual(['top', 'right', 'bottom', 'left']);
      expect([...(composed.argTypes.align?.options ?? [])].sort()).toEqual(['center', 'end', 'start']);
      expect(composed.argTypes.align?.options).toEqual(
        doc?.props.align?.type.value.map(({ value }: { value: string }) => value.replace(/"/g, ''))
      );
      for (const prop of [
        'id',
        'role',
        'aria-label',
        'aria-labelledby',
        'aria-modal',
        'tabIndex',
        'style',
        'asChild',
        'forceMount',
        'ref'
      ]) {
        expect(doc?.props[prop], prop).toBeUndefined();
      }
      for (const prop of ['title', 'className', 'aria-describedby', 'onClick']) {
        expect(doc?.props[prop], prop).toBeDefined();
      }
    } else {
      expect(composed.argTypes.asChild?.table?.defaultValue?.summary).toBe('false');
      for (const prop of ['disabled', 'aria-label', 'onClick', 'className']) {
        expect(doc?.props[prop], prop).toBeDefined();
      }
      for (const prop of ['type', 'style', 'dangerouslySetInnerHTML']) {
        expect(doc?.props[prop], prop).toBeUndefined();
      }
    }
  });

  it('annotates every owned declaration in both button union branches', () => {
    const file = ts.createSourceFile('types.ts', readFileSync(path('types.ts'), 'utf8'), ts.ScriptTarget.Latest, true);
    let count = 0;
    const visit = (node: ts.Node) => {
      if (ts.isPropertySignature(node)) {
        count++;
        const tags = ts.getJSDocTags(node);
        const controls = tags.filter((tag) => tag.tagName.text === 'control');
        expect(controls, node.name.getText(file)).toHaveLength(1);
        if (ts.getTextOfJSDocComment(controls[0]?.comment) === 'false') {
          expect(tags.some((tag) => tag.tagName.text === 'controlReason' && Boolean(tag.comment))).toBe(true);
        }
        if (!node.questionToken) {
          expect(tags.some((tag) => tag.tagName.text === 'default')).toBe(false);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(file);
    expect(count).toBe(13);
  });

  it('registers static molecule scanning and stories without a new stylesheet or manual argTypes', () => {
    const css = readFileSync(new URL('../styles/compiled.css', import.meta.url), 'utf8');
    expect(css).toContain('@source "../molecules/**/types.ts"');
    const stories = readFileSync(path('Popover.stories.tsx'), 'utf8');
    expect(stories).toContain("title: 'Molecules/Popover'");
    expect(stories).not.toMatch(/argTypes:|play:/);
    const jsx = readFileSync(path('Popover.tsx'), 'utf8');
    expect(jsx).toContain("import * as PopoverPrimitive from '@radix-ui/react-popover'");
    expect(jsx).toContain("<Surface tone='overlay' padding='md' radius='xl'>");
  });
});
