// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { composeStory, INTERNAL_DEFAULT_PROJECT_ANNOTATIONS } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { withCustomConfig } from 'react-docgen-typescript';
import type { StrictArgTypes } from 'storybook/internal/types';
import ts from 'typescript';
import { build } from 'vite';
import { beforeAll, describe, expect, it } from 'vitest';
import { mapJSDocControls } from '../../../../.storybook/jsdoc-controls';
import config from '../../../../.storybook/main';
import preview from '../../../../.storybook/preview';
import { dialogBodyVariants, dialogOverlayVariants } from '../molecules/dialog/types';

const path = (name: string) => fileURLToPath(new URL(`../molecules/dialog/${name}`, import.meta.url));
const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
  ...config.typescript?.reactDocgenTypescriptOptions
});
let docs: ReturnType<typeof parser.parse>;
const expected = {
  dialog: { children: false, open: 'boolean', defaultOpen: 'boolean', onOpenChange: false },
  dialogTrigger: { children: false, asChild: 'boolean' },
  dialogClose: { children: false, asChild: 'boolean' },
  dialogContent: {
    title: 'text',
    description: 'text',
    statusText: 'text',
    children: false,
    actions: false,
    dismissLabel: 'text',
    variant: 'select',
    size: 'select',
    container: false,
    overlayScope: 'select',
    bodyPadding: 'select',
    headerLayout: 'select'
  }
} as const;

describe('Dialog Storybook metadata and CSS', () => {
  beforeAll(() => {
    docs = parser.parse(path('Dialog.tsx'));
  }, 20_000);
  it.each(['Dialog', 'DialogTrigger', 'DialogClose', 'DialogContent'] as const)(
    '%s extracts real controls through the registered pipeline',
    (name) => {
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
        expect(composed.argTypes[prop]?.table?.disable).toBeUndefined();
        expect(doc?.props[prop]?.description, `${name}.${prop}`).toBeTruthy();
      }
      expect(composed.args).toEqual({});
      if (name === 'DialogContent') {
        expect(doc?.props.title?.required).toBe(true);
        expect(doc?.props.children?.required).toBe(true);
        expect(doc?.props.container?.required).toBe(false);
        expect(doc?.props.container?.tags).toMatchObject({ controlReason: expect.any(String) });
        expect(doc?.props.overlayScope?.defaultValue).toBeNull();
        expect(composed.argTypes.overlayScope?.table?.defaultValue).toBeUndefined();
        expect([...(composed.argTypes.overlayScope?.options ?? [])].sort()).toEqual(['container', 'viewport']);
        expect([...(composed.argTypes.bodyPadding?.options ?? [])].sort()).toEqual(['compact', 'default']);
        expect(doc?.props.bodyPadding?.defaultValue?.value).toBe('default');
        expect(composed.argTypes.bodyPadding?.table?.defaultValue?.summary).toBe('"default"');
        expect([...(composed.argTypes.headerLayout?.options ?? [])].sort()).toEqual(['inline', 'stacked']);
        expect(doc?.props.headerLayout?.defaultValue?.value).toBe('inline');
        expect(composed.argTypes.headerLayout?.table?.defaultValue?.summary).toBe('"inline"');
        for (const prop of ['role', 'aria-labelledby', 'aria-describedby', 'aria-modal', 'style', 'ref']) {
          expect(doc?.props[prop], prop).toBeUndefined();
        }
        for (const prop of ['id', 'className', 'onClick']) {
          expect(doc?.props[prop], prop).toBeDefined();
        }
      }
    }
  );

  it('annotates every owned declaration on each union branch', () => {
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
    expect(count).toBe(29);
  });

  it('scans and emits container positioning and compact padding from production CVA', async () => {
    const entry = fileURLToPath(new URL('../styles/compiled.css', import.meta.url));
    expect(readFileSync(entry, 'utf8')).toContain('@source "../molecules/**/types.ts"');
    expect(dialogOverlayVariants({ scope: 'container' })).toContain('absolute');
    expect(dialogOverlayVariants()).toContain('fixed');
    expect(dialogBodyVariants({ bodyPadding: 'compact' })).toContain('p-[var(--space-3)]');
    const result = await build({
      configFile: false,
      envDir: false,
      plugins: [tailwindcss({ optimize: false })],
      logLevel: 'warn',
      build: { write: false, minify: false, cssMinify: false, rolldownOptions: { input: entry } }
    });
    const assets = (Array.isArray(result) ? result : [result]).flatMap((output) =>
      'output' in output ? output.output : []
    );
    const asset = assets.find((output) => output.type === 'asset' && output.fileName.endsWith('.css'));
    if (asset?.type !== 'asset') {
      throw new Error('Missing production CSS output');
    }
    const css = String(asset.source);
    expect(css).toMatch(/\.absolute\s*\{[^}]*position:\s*absolute/);
    expect(css).toMatch(/\.p-\\\[var\\\(--space-3\\\)\\\]\s*\{[^}]*padding:\s*var\(--space-3\)/);
  }, 30_000);
});
