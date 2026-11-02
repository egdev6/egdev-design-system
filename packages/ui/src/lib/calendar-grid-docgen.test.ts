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
import type { CalendarGridProps } from '../organisms/calendar-grid';
import { CalendarGrid } from '../organisms/calendar-grid';
import meta, { Default } from '../organisms/calendar-grid/CalendarGrid.stories';

const source = (file: string) => fileURLToPath(new URL(`../organisms/calendar-grid/${file}`, import.meta.url));
describe('CalendarGrid metadata', () => {
  it('documents every own field with a control directive', () => {
    const ast = ts.createSourceFile(
      source('types.ts'),
      readFileSync(source('types.ts'), 'utf8'),
      ts.ScriptTarget.Latest,
      true
    );
    const properties: ts.PropertySignature[] = [];
    function visit(node: ts.Node) {
      if (ts.isPropertySignature(node)) {
        properties.push(node);
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
    expect(properties).toHaveLength(27);
    for (const property of properties) {
      const tags = ts.getJSDocTags(property);
      const controls = tags.filter((tag) => tag.tagName.text === 'control');
      expect(controls, property.name.getText(ast)).toHaveLength(1);
      const directive = ts.getTextOfJSDocComment(controls[0]?.comment);
      expect(['text', 'number', 'select', 'boolean', 'false']).toContain(directive);
      if (directive === 'false') {
        expect(ts.getTextOfJSDocComment(tags.find((tag) => tag.tagName.text === 'controlReason')?.comment)).toMatch(
          /see /
        );
      }
    }
  });
  it('extracts real docgen and registered Controls without diagnostics', () => {
    const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
      ...config.typescript?.reactDocgenTypescriptOptions
    });
    const doc = parser.parse(source('CalendarGrid.tsx')).find((item) => item.displayName === 'CalendarGrid');
    expect(doc).toBeDefined();
    const component = Object.assign(CalendarGrid, { __docgenInfo: doc });
    const story = composeStory<CalendarGridProps>(
      Default,
      { title: meta.title, component, args: meta.args, tags: meta.tags },
      preview,
      'Default'
    );
    expect(story.argTypes.label).toMatchObject({ control: { type: 'text' }, type: { required: true } });
    for (const name of ['items', 'onAdd', 'onMove', 'onNavigate', 'messages'] as const) {
      expect(story.argTypes[name]?.control).toBe(false);
    }
    expect(story.argTypes.level).toMatchObject({ control: { type: 'select' } });
    expect(mapJSDocControls(story.argTypes, component).diagnostics).toEqual([]);
    for (const name of ['id', 'title', 'dir', 'lang', 'aria-describedby', 'className', 'onClick']) {
      expect(doc?.props[name], name).toBeDefined();
    }
    for (const name of ['role', 'aria-label', 'aria-labelledby', 'children', 'ref', 'asChild']) {
      expect(doc?.props[name], name).toBeUndefined();
    }
    const stories = readFileSync(source('CalendarGrid.stories.tsx'), 'utf8');
    expect(stories).not.toMatch(/argTypes\s*:|\bplay\s*:/);
    for (const name of [
      'Default',
      'TodayAndPast',
      'EmptyDays',
      'AddIntent',
      'MoveMenu',
      'NonAcceptingDays',
      'WorkWeek',
      'Stacked',
      'LocalizedMessages'
    ]) {
      expect(stories).toContain(`export const ${name}: Story`);
    }
  });
});
