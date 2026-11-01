// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { composeStory } from '@storybook/react-vite';
import { withCustomConfig } from 'react-docgen-typescript';
import { expect, it } from 'vitest';
import { mapJSDocControls } from '../../../../.storybook/jsdoc-controls';
import config from '../../../../.storybook/main';
import preview from '../../../../.storybook/preview';
import type { SidebarProps } from '../organisms/sidebar';
import { Sidebar } from '../organisms/sidebar';
import meta, { Default } from '../organisms/sidebar/Sidebar.stories';

it('extracts Sidebar metadata and applies registered Controls without diagnostics', () => {
  const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
    ...config.typescript?.reactDocgenTypescriptOptions
  });
  const path = fileURLToPath(new URL('../organisms/sidebar/Sidebar.tsx', import.meta.url));
  const doc = parser.parse(path).find((item) => item.displayName === 'Sidebar');
  expect(doc).toBeDefined();
  const component = Object.assign(Sidebar, { __docgenInfo: doc });
  const story = composeStory<SidebarProps>(
    Default,
    { title: meta.title, component, args: meta.args, tags: meta.tags },
    preview,
    'Default'
  );
  for (const name of ['product', 'children', 'footer'] as const) {
    expect(story.argTypes[name]?.control).toBe(false);
    expect(story.argTypes[name]?.table?.disable).not.toBe(true);
    expect(doc?.props[name]?.defaultValue).toBeNull();
  }
  expect(doc?.props.children?.required).toBe(true);
  expect(mapJSDocControls(story.argTypes, component).diagnostics).toEqual([]);
});
