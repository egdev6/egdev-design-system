// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { composeStory } from '@storybook/react-vite';
import { withCustomConfig } from 'react-docgen-typescript';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { mapJSDocControls } from '../../../../.storybook/jsdoc-controls';
import config from '../../../../.storybook/main';
import preview from '../../../../.storybook/preview';
import type { NavListProps } from '../molecules/nav-list';
import { NavList } from '../molecules/nav-list';
import meta, { Default } from '../molecules/nav-list/NavList.stories';

const source = (file: string) => fileURLToPath(new URL(`../molecules/nav-list/${file}`, import.meta.url));

describe('NavList public metadata', () => {
  it('annotates every schema declaration with a valid control and preserves constant-only defaults', () => {
    const path = source('types.ts');
    const ast = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
    const properties: ts.PropertySignature[] = [];
    function visit(node: ts.Node) {
      if (ts.isPropertySignature(node)) {
        properties.push(node);
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
    expect(properties).toHaveLength(26);
    for (const property of properties) {
      const tags = ts.getJSDocTags(property);
      const controls = tags.filter((tag) => tag.tagName.text === 'control');
      expect(controls, property.name.getText(ast)).toHaveLength(1);
      const directive = ts.getTextOfJSDocComment(controls[0]?.comment);
      expect(['text', 'number', 'boolean', 'select', 'false']).toContain(directive);
      if (directive === 'false') {
        expect(ts.getTextOfJSDocComment(tags.find((tag) => tag.tagName.text === 'controlReason')?.comment)).toMatch(
          /see /
        );
      }
      if (!property.questionToken) {
        expect(tags.some((tag) => tag.tagName.text === 'default')).toBe(false);
      }
    }
  });

  it('extracts the real component and runs registered Storybook Controls with zero diagnostics', () => {
    const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
      ...config.typescript?.reactDocgenTypescriptOptions
    });
    const doc = parser.parse(source('NavList.tsx')).find((item) => item.displayName === 'NavList');
    expect(doc).toBeDefined();
    const component = Object.assign(NavList, { __docgenInfo: doc });
    const story = composeStory<NavListProps>(
      Default,
      {
        title: meta.title,
        component,
        args: meta.args,
        tags: meta.tags
      },
      preview,
      'Default'
    );
    expect(story.argTypes.label).toMatchObject({ control: { type: 'text' }, type: { required: true } });
    for (const name of ['items', 'onNavigate'] as const) {
      expect(story.argTypes[name]?.control).toBe(false);
      expect(story.argTypes[name]?.table?.disable).not.toBe(true);
    }
    expect(doc?.props.items?.required).toBe(true);
    expect(doc?.props.onNavigate?.required).toBe(false);
    for (const name of ['label', 'items', 'onNavigate']) {
      expect(doc?.props[name]?.defaultValue).toBeNull();
    }
    for (const name of ['id', 'title', 'dir', 'lang', 'aria-describedby', 'className', 'onClick']) {
      expect(doc?.props[name], name).toBeDefined();
    }
    for (const name of ['role', 'aria-label', 'aria-labelledby', 'children', 'ref', 'asChild']) {
      expect(doc?.props[name], name).toBeUndefined();
    }
    expect(mapJSDocControls(story.argTypes, component).diagnostics).toEqual([]);
    expect(story.args).toEqual(Default.args ?? meta.args);
    const stories = readFileSync(source('NavList.stories.tsx'), 'utf8');
    expect(stories).not.toMatch(/argTypes\s*:|\bplay\s*:/);
    for (const name of [
      'Default',
      'CurrentPage',
      'StaticGroups',
      'CollapsibleGroups',
      'ControlledGroups',
      'CountsAndTags',
      'GroupSignals',
      'Warning',
      'LongLabels',
      'Empty'
    ]) {
      expect(stories).toContain(`export const ${name}: Story`);
    }
  });
});
