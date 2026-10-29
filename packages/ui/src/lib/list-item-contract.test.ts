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
      'ListItemMedia',
      'ListItemMeta'
    ]);
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
    expect(properties).toHaveLength(12);
    const expected: Record<string, string> = {
      status: 'select',
      variant: 'select',
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
      'ListItemMedia',
      'ListItemMeta'
    ]);
    const doc = docs.find((item) => item.displayName === 'ListItem');
    expect(doc?.props.children?.required).toBe(true);
    expect(doc?.props.status?.defaultValue?.value).toBe('default');
    expect(doc?.props.variant?.defaultValue?.value).toBe('card');
    expect(doc?.props.asChild?.defaultValue?.value).toBe('false');
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

  it('uses installed extraction, registered enhancement and native inference with zero diagnostics', () => {
    const doc = docs.find((item) => item.displayName === 'ListItem');
    const component = Object.assign((_props: Record<string, unknown>) => null, { __docgenInfo: doc });
    const story = composeStory({}, { title: 'Molecules/ListItem', component }, preview, 'Default');
    const mapped = mapJSDocControls(story.argTypes, component);
    expect(mapped.diagnostics).toEqual([]);
    for (const name of ['status', 'variant']) {
      expect(story.argTypes[name]?.control).toEqual({ type: 'select' });
    }
    expect(story.argTypes.asChild?.control).toEqual({ type: 'boolean' });
    expect(story.argTypes.children?.control).toBe(false);
    expect(story.argTypes.status?.options).toContain('empty');
    expect(story.argTypes.status?.table?.defaultValue?.summary).toBe('"default"');
  });

  it('compiles every state/part utility against real tokens without writing build artifacts', async () => {
    const scan = readFileSync(path('../styles/compiled.css'), 'utf8');
    expect(scan).toContain('@source "../molecules/list-item/types.ts"');
    const candidates = [
      surfaceVariants({ padding: 'none', radius: 'lg' }),
      surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }),
      listItemVariants(),
      ...(['body', 'content', 'media', 'footer', 'meta', 'actions'] as const).map((part) =>
        listItemPartVariants({ part })
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
});
