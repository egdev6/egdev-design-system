// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { composeStory } from '@storybook/react-vite';
import { withCustomConfig } from 'react-docgen-typescript';
import { compile } from 'tailwindcss';
import ts from 'typescript';
import { beforeAll, describe, expect, it } from 'vitest';
import { mapJSDocControls } from '../../../../.storybook/jsdoc-controls';
import config from '../../../../.storybook/main';
import preview from '../../../../.storybook/preview';
import * as api from '../index';
import { listItemPartVariants, listItemVariants } from '../molecules/list-item/types';
import { surfaceVariants } from '../primitives/surface';
import { cn } from './cn';

const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));
const source = path('../molecules/list-item/ListItem.tsx');
const parser = withCustomConfig(path('../../tsconfig.json'), { ...config.typescript?.reactDocgenTypescriptOptions });
let docs: ReturnType<typeof parser.parse>;

beforeAll(() => {
  docs = parser.parse(source);
}, 60_000);

describe('ListItem delivery contract', () => {
  it('exports exactly the approved compound API, with no public recipes or hook', () => {
    expect(
      Object.keys(api)
        .filter((key) => /listitem/i.test(key))
        .sort()
    ).toEqual([
      'ListItem',
      'ListItemActions',
      'ListItemBody',
      'ListItemContent',
      'ListItemFooter',
      'ListItemLeading',
      'ListItemMedia',
      'ListItemMeta',
      'ListItemTitle',
      'ListItemTrailing'
    ]);
  });

  it('publishes the editorial part and size types without exposing recipes', () => {
    const typeNames = readFileSync(path('../molecules/list-item/index.ts'), 'utf8');
    for (const name of [
      'ListItemPartProps',
      'ListItemProps',
      'ListItemSize',
      'ListItemStatus',
      'ListItemTitleProps',
      'ListItemVariant'
    ]) {
      expect(typeNames, name).toContain(name);
    }
    expect(Object.keys(api)).not.toContain('listItemVariants');
    expect(Object.keys(api)).not.toContain('listItemPartVariants');
  });

  it('annotates every own declaration in all three public union branches', () => {
    const filename = path('../molecules/list-item/types.ts');
    const file = ts.createSourceFile(filename, readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
    const properties: ts.PropertySignature[] = [];
    function visit(node: ts.Node) {
      if (ts.isPropertySignature(node)) {
        properties.push(node);
      }
      ts.forEachChild(node, visit);
    }
    const alias = file.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'ListItemProps');
    expect(alias).toBeDefined();
    if (alias) {
      visit(alias);
    }
    expect(properties).toHaveLength(15);
    const expected: Record<string, string> = {
      status: 'select',
      variant: 'select',
      size: 'select',
      asChild: 'boolean',
      children: 'false'
    };
    for (const property of properties) {
      const tags = ts.getJSDocTags(property);
      expect(tags.filter((tag) => tag.tagName.text === 'control').map((tag) => tag.comment)).toEqual([
        expected[property.name.getText(file)]
      ]);
      if (property.name.getText(file) === 'children') {
        expect(tags.find((tag) => tag.tagName.text === 'controlReason')?.comment).toMatch(/not serializable; see/);
      }
      if (!property.questionToken) {
        expect(tags.some((tag) => tag.tagName.text === 'default')).toBe(false);
      }
    }
  });

  it('extracts all compound components and the real union/defaults/protected native API', () => {
    expect(docs.map((doc) => doc.displayName).sort()).toEqual([
      'ListItem',
      'ListItemActions',
      'ListItemBody',
      'ListItemContent',
      'ListItemFooter',
      'ListItemLeading',
      'ListItemMedia',
      'ListItemMeta',
      'ListItemTitle',
      'ListItemTrailing'
    ]);
    const doc = docs.find((item) => item.displayName === 'ListItem');
    expect(doc?.props.children?.required).toBe(true);
    expect(doc?.props.status?.defaultValue?.value).toBe('default');
    expect(doc?.props.variant?.defaultValue?.value).toBe('card');
    expect(doc?.props.size?.defaultValue?.value).toBe('md');
    expect(doc?.props.asChild?.defaultValue?.value).toBe('false');
    expect(doc?.props.variant?.type.value.map(({ value }: { value: string }) => value.replaceAll('"', ''))).toEqual([
      'card',
      'compact',
      'row',
      'editorial',
      'editorial-divided'
    ]);
    expect(doc?.props.status?.type.value.map(({ value }: { value: string }) => value.replaceAll('"', ''))).toEqual([
      'default',
      'new',
      'failed',
      'done',
      'empty',
      'dragging',
      'off'
    ]);
    for (const name of ['id', 'title', 'aria-describedby', 'aria-labelledby', 'className']) {
      expect(doc?.props[name], name).toBeDefined();
    }
    for (const name of [
      'ref',
      'role',
      'tabIndex',
      'aria-disabled',
      'aria-selected',
      'aria-pressed',
      'dangerouslySetInnerHTML'
    ]) {
      expect(doc?.props[name], name).toBeUndefined();
    }
  });

  it('annotates the title part level and non-serializable children', () => {
    const filename = path('../molecules/list-item/types.ts');
    const file = ts.createSourceFile(filename, readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
    const properties: ts.PropertySignature[] = [];
    function visit(node: ts.Node) {
      if (ts.isPropertySignature(node)) {
        properties.push(node);
      }
      ts.forEachChild(node, visit);
    }
    const alias = file.statements.find(
      (node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'ListItemTitleProps'
    );
    expect(alias).toBeDefined();
    if (alias) {
      visit(alias);
    }
    const own = properties.filter((property) => ['level', 'children'].includes(property.name.getText(file)));
    expect(own.map((property) => property.name.getText(file)).sort()).toEqual(['children', 'level']);
    const byName = Object.fromEntries(own.map((property) => [property.name.getText(file), property]));
    const tagsOf = (name: string) => ts.getJSDocTags(byName[name] as ts.PropertySignature);
    expect(
      tagsOf('level')
        .filter((tag) => tag.tagName.text === 'control')
        .map((tag) => tag.comment)
    ).toEqual(['select']);
    expect(
      tagsOf('level')
        .filter((tag) => tag.tagName.text === 'default')
        .map((tag) => tag.comment)
    ).toEqual(['3']);
    expect(
      tagsOf('children')
        .filter((tag) => tag.tagName.text === 'control')
        .map((tag) => tag.comment)
    ).toEqual(['false']);
    expect(tagsOf('children').find((tag) => tag.tagName.text === 'controlReason')?.comment).toMatch(
      /not serializable; see/
    );
  });

  it('uses installed extraction, registered enhancement and native inference with zero diagnostics', () => {
    const doc = docs.find((item) => item.displayName === 'ListItem');
    const component = Object.assign((_props: Record<string, unknown>) => null, { __docgenInfo: doc });
    const story = composeStory({}, { title: 'Molecules/ListItem', component }, preview, 'Default');
    const mapped = mapJSDocControls(story.argTypes, component);
    expect(mapped.diagnostics).toEqual([]);
    for (const name of ['status', 'variant', 'size']) {
      expect(story.argTypes[name]?.control).toEqual({ type: 'select' });
    }
    expect(story.argTypes.asChild?.control).toEqual({ type: 'boolean' });
    expect(story.argTypes.children?.control).toBe(false);
    expect(story.argTypes.status?.options).toContain('empty');
    expect(story.argTypes.variant?.options).toEqual(['card', 'compact', 'row', 'editorial', 'editorial-divided']);
    expect(story.argTypes.size?.options).toEqual(['md', 'sm']);
    expect(story.argTypes.status?.table?.defaultValue?.summary).toBe('"default"');
    expect(story.argTypes.size?.table?.defaultValue?.summary).toBe('"md"');
    const title = docs.find((item) => item.displayName === 'ListItemTitle');
    const titleComponent = Object.assign((_props: Record<string, unknown>) => null, { __docgenInfo: title });
    const titleStory = composeStory({}, { title: 'Molecules/ListItem', component: titleComponent }, preview, 'Default');
    expect(mapJSDocControls(titleStory.argTypes, titleComponent).diagnostics).toEqual([]);
    expect(titleStory.argTypes.level?.control).toEqual({ type: 'select' });
    expect(titleStory.argTypes.level?.options).toEqual([2, 3, 4, 5, 6]);
    expect(titleStory.argTypes.level?.table?.defaultValue?.summary).toBe('3');
    expect(titleStory.argTypes.children?.control).toBe(false);
  });

  it('compiles every state/part utility against real tokens without writing build artifacts', async () => {
    const scan = readFileSync(path('../styles/compiled.css'), 'utf8');
    expect(scan).toContain('@source "../molecules/list-item/types.ts"');
    const candidates = [
      surfaceVariants({ padding: 'none', radius: 'lg' }),
      surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }),
      listItemVariants(),
      ...(['body', 'content', 'media', 'footer', 'meta', 'actions', 'leading', 'title', 'trailing'] as const).map(
        (part) => listItemPartVariants({ part })
      )
    ]
      .join(' ')
      .split(/\s+/)
      .filter((candidate) => !candidate.startsWith('eg-') && candidate !== 'group/list-item');
    const compiler = await compile(
      `${readFileSync(path('../../../tokens/src/theme.css'), 'utf8')}\n@tailwind utilities;`
    );
    for (const candidate of candidates) {
      const css = compiler.build([candidate]);
      const escaped = candidate.replace(/([^a-zA-Z0-9_-])/g, '\\$1');
      expect(css, candidate).toContain(`.${escaped}`);
    }
  });

  it('composes every linked list example with the anchor as the row element', () => {
    const stories = readFileSync(path('../molecules/list-item/ListItem.stories.tsx'), 'utf8');
    const file = ts.createSourceFile('ListItem.stories.tsx', stories, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const offenders: string[] = [];
    function visit(node: ts.Node) {
      if (ts.isJsxElement(node)) {
        const tag = node.openingElement.tagName.getText(file);
        const attributes = node.openingElement.attributes.properties.filter(ts.isJsxAttribute);
        const asChild = attributes.some((attribute) => attribute.name.getText(file) === 'asChild');
        if (tag === 'ListItem' && asChild) {
          const children = node.children
            .filter(ts.isJsxElement)
            .map((child) => child.openingElement.tagName.getText(file));
          if (children.some((child) => child !== 'a' && child !== 'button' && child !== 'article')) {
            offenders.push(`${tag} asChild receives ${children.join(', ')}`);
          }
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(file);
    expect(offenders).toEqual([]);
    const consumption = readFileSync(path('../../../../scripts/package-consumption.test.mjs'), 'utf8');
    const start = consumption.indexOf('export function EditorialRowSamples');
    const sample = consumption.slice(start, consumption.indexOf('export function DividedRowSamples'));
    expect(start).toBeGreaterThan(-1);
    expect(sample).toContain("children: createElement('a'");
    expect(sample).not.toContain("createElement('li', null, createElement('a'");
  });

  it('keeps every editorial recipe on existing tokens with no hand-written paint', () => {
    const types = readFileSync(path('../molecules/list-item/types.ts'), 'utf8');
    expect(types).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(types).not.toMatch(/rgba?\(/);
    expect(types).not.toMatch(/\b\d+ms\b/);
    const recipe = cn(listItemVariants());
    for (const utility of [
      'data-[variant=editorial]:flex-row',
      'data-[variant=editorial]:min-h-11',
      'data-[variant=editorial-divided]:data-[state=default]:bg-none',
      'data-[variant=editorial-divided]:data-[state=default]:shadow-none',
      'data-[variant=editorial-divided]:data-[state=default]:rounded-none',
      'data-[variant=editorial-divided]:data-[state=default]:border-b',
      'data-[variant=editorial-divided]:data-[state=default]:border-border-hairline',
      'data-[state=default]:data-[variant=editorial]:[&:is(a)]:hover:border-border-brand',
      'data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:bg-surface-2',
      'data-[variant=editorial]:[&:is(a)]:focus-visible:shadow-focus',
      'data-[variant=editorial]:[&:is(a)]:no-underline',
      'data-[variant=editorial-divided]:[&:is(a)]:no-underline',
      'data-[variant=editorial]:duration-(--duration-fast)',
      'data-[variant=editorial]:ease-(--ease-out)',
      'data-[variant=editorial]:motion-reduce:transition-none'
    ]) {
      expect(recipe, utility).toContain(utility);
    }
    expect(recipe.split(/\s+/)).not.toContain('text-fg-brand');
  });
});
