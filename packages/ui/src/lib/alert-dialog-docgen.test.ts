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

const path = (name: string) => fileURLToPath(new URL(`../molecules/alert-dialog/${name}`, import.meta.url));
const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
  ...config.typescript?.reactDocgenTypescriptOptions
});
let docs: ReturnType<typeof parser.parse>;
const expected = {
  alertDialog: { children: false, open: 'boolean', defaultOpen: 'boolean', onOpenChange: false },
  alertDialogTrigger: { children: false, asChild: 'boolean' },
  alertDialogCancel: { children: false, asChild: 'boolean' },
  alertDialogAction: { children: false, asChild: 'boolean' },
  alertDialogContent: { title: 'text', description: 'text', children: false, actions: false, tone: 'select' }
} as const;

describe('AlertDialog Storybook metadata', () => {
  beforeAll(() => {
    docs = parser.parse(path('AlertDialog.tsx'));
  }, 20_000);
  it.each([
    'AlertDialog',
    'AlertDialogTrigger',
    'AlertDialogCancel',
    'AlertDialogAction',
    'AlertDialogContent'
  ] as const)('%s extracts real Controls', (name) => {
    const doc = docs.find((entry) => entry.displayName === name);
    expect(doc).toBeDefined();
    const component = Object.assign((_props: Record<string, unknown>) => null, { __docgenInfo: doc });
    const composed = composeStory({}, { title: `Metadata/${name}`, component }, preview, 'Default');
    const extract = INTERNAL_DEFAULT_PROJECT_ANNOTATIONS.parameters?.docs?.extractArgTypes;
    const extracted: StrictArgTypes = extract(component);
    expect(mapJSDocControls(extracted, component).diagnostics).toEqual([]);
    const key = `${name.charAt(0).toLowerCase()}${name.slice(1)}` as keyof typeof expected;
    for (const [prop, control] of Object.entries(expected[key])) {
      expect(composed.argTypes[prop]?.control, `${name}.${prop}`).toEqual(
        control === false ? false : { type: control }
      );
      expect(doc?.props[prop]?.description, `${name}.${prop}`).toBeTruthy();
    }
    expect(composed.args).toEqual({});
    if (name === 'AlertDialogContent') {
      expect(doc?.props.title?.required).toBe(true);
      expect(doc?.props.description?.required).toBe(true);
      expect(doc?.props.actions?.required).toBe(true);
      expect([...(composed.argTypes.tone?.options ?? [])].sort()).toEqual(['danger', 'neutral']);
      for (const prop of ['role', 'aria-describedby', 'style', 'ref', 'size']) {
        expect(doc?.props[prop], prop).toBeUndefined();
      }
    }
  });
  it('annotates owned props on both button union branches', () => {
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
      }
      ts.forEachChild(node, visit);
    };
    visit(file);
    expect(count).toBe(13);
  });
});
