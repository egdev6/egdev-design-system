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
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../molecules/hover-card';
import meta, * as stories from '../molecules/hover-card/HoverCard.stories';

const directory = '../molecules/hover-card/';
const source = (name: string) => fileURLToPath(new URL(directory + name, import.meta.url));
const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
  ...config.typescript?.reactDocgenTypescriptOptions
});
let docs: ReturnType<typeof parser.parse>;
const controls: Record<string, Record<string, string | false>> = {
  hoverCard: { children: false, open: 'boolean', defaultOpen: 'boolean', onOpenChange: false },
  hoverCardTrigger: { children: false, asChild: 'boolean', href: 'text' },
  hoverCardContent: { children: false, side: 'select', align: 'select' }
};

beforeAll(() => {
  docs = parser.parse(source('HoverCard.tsx'));
}, 30_000);

describe('HoverCard public metadata', () => {
  it('documents every own declaration in every union branch without invented defaults', () => {
    const file = ts.createSourceFile(
      'types.ts',
      readFileSync(source('types.ts'), 'utf8'),
      ts.ScriptTarget.Latest,
      true
    );
    const declarations: ts.PropertySignature[] = [];
    const visit = (node: ts.Node) => {
      if (ts.isPropertySignature(node)) {
        declarations.push(node);
      }
      ts.forEachChild(node, visit);
    };
    visit(file);
    expect(declarations).toHaveLength(13);
    for (const declaration of declarations) {
      const tags = ts.getJSDocTags(declaration);
      const control = tags.filter((tag) => tag.tagName.text === 'control');
      expect(control, declaration.name.getText(file)).toHaveLength(1);
      if (control[0]?.comment === 'false') {
        expect(tags.some((tag) => tag.tagName.text === 'controlReason' && tag.comment)).toBe(true);
      }
      if (!declaration.questionToken) {
        expect(tags.some((tag) => tag.tagName.text === 'default')).toBe(false);
      }
    }
  });

  it.each([
    ['HoverCard', HoverCard],
    ['HoverCardTrigger', HoverCardTrigger],
    ['HoverCardContent', HoverCardContent]
  ] as const)('extracts %s through installed Controls with zero diagnostics', (name, component) => {
    const doc = docs.find((entry) => entry.displayName === name);
    expect(doc).toBeDefined();
    const documented = Object.assign(component, { __docgenInfo: doc });
    const extract = INTERNAL_DEFAULT_PROJECT_ANNOTATIONS.parameters?.docs?.extractArgTypes;
    const extracted: StrictArgTypes = extract(documented);
    expect(mapJSDocControls(extracted, documented).diagnostics).toEqual([]);
    const composed = composeStory({}, { title: `Metadata/${name}`, component: documented }, preview, 'Default');
    for (const [prop, control] of Object.entries(controls[name.charAt(0).toLowerCase() + name.slice(1)] ?? {})) {
      expect(composed.argTypes[prop]?.control, `${name}.${prop}`).toEqual(
        control === false ? false : { type: control }
      );
      expect(composed.argTypes[prop]?.table?.disable).not.toBe(true);
    }
    expect(doc?.props.children?.required).toBe(true);
  });

  it('retains bare defaults, exact placement choices and compatible native props only', () => {
    const root = docs.find((doc) => doc.displayName === 'HoverCard');
    const trigger = docs.find((doc) => doc.displayName === 'HoverCardTrigger');
    const content = docs.find((doc) => doc.displayName === 'HoverCardContent');
    expect(root?.props.defaultOpen?.defaultValue).toEqual({ value: 'false' });
    expect(root?.props.open?.defaultValue).toBeNull();
    expect(trigger?.props.asChild?.defaultValue).toEqual({ value: 'false' });
    expect(content?.props.side?.defaultValue).toEqual({ value: 'top' });
    expect(content?.props.align?.defaultValue).toEqual({ value: 'start' });
    expect(content?.props.side?.type.value.map((entry: { value: string }) => entry.value)).toEqual([
      '"top"',
      '"right"',
      '"bottom"',
      '"left"'
    ]);
    expect(content?.props.align?.type.value.map((entry: { value: string }) => entry.value)).toEqual([
      '"center"',
      '"start"',
      '"end"'
    ]);
    for (const name of ['href', 'id', 'target', 'rel', 'onClick', 'className']) {
      expect(trigger?.props[name], name).toBeDefined();
    }
    for (const name of ['id', 'aria-label', 'className']) {
      expect(content?.props[name], name).toBeDefined();
    }
    for (const name of ['role', 'tabIndex', 'aria-live', 'contentEditable', 'asChild', 'forceMount', 'ref']) {
      expect(content?.props[name], name).toBeUndefined();
    }
    for (const name of ['openDelay', 'closeDelay', 'className', 'ref']) {
      expect(root?.props[name], name).toBeUndefined();
    }
  });

  it('registers the molecule without story-local controls or optional Default overrides', () => {
    expect(meta.title).toBe('Molecules/HoverCard');
    expect(meta.tags).toContain('autodocs');
    expect(Object.keys(meta.args ?? {})).toEqual(['children']);
    expect(stories.Default.args).toBeUndefined();
    const text = readFileSync(source('HoverCard.stories.tsx'), 'utf8');
    expect(text).not.toMatch(/argTypes\s*:|play\s*:/);
    expect(text).toContain('separate persistent details link for touch users');
    expect(config.stories).toContain('../packages/*/src/**/*.stories.@(ts|tsx)');
  });
});
