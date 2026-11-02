// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { composeStory } from '@storybook/react-vite';
import { withCustomConfig } from 'react-docgen-typescript';
import { expect, it } from 'vitest';
import { mapJSDocControls } from '../../../../.storybook/jsdoc-controls';
import config from '../../../../.storybook/main';
import preview from '../../../../.storybook/preview';
import type { AppShellProps } from '../templates/app-shell';
import { AppShell } from '../templates/app-shell';
import meta, { SidebarAndTabBar } from '../templates/app-shell/AppShell.stories';

it('extracts AppShell metadata and applies registered Controls without diagnostics', () => {
  const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
    ...config.typescript?.reactDocgenTypescriptOptions
  });
  const path = fileURLToPath(new URL('../templates/app-shell/AppShell.tsx', import.meta.url));
  const doc = parser.parse(path).find((item) => item.displayName === 'AppShell');
  expect(doc).toBeDefined();
  const component = Object.assign(AppShell, { __docgenInfo: doc });
  const story = composeStory<AppShellProps>(
    SidebarAndTabBar,
    { title: meta.title, component, args: meta.args, tags: meta.tags },
    preview,
    'SidebarAndTabBar'
  );
  const argTypes = story.argTypes as Record<string, { control?: unknown; table?: { disable?: boolean } } | undefined>;
  for (const name of ['sideNavigation', 'bottomNavigation', 'children', 'messages'] as const) {
    expect(argTypes[name]?.control).toBe(false);
    expect(argTypes[name]?.table?.disable).not.toBe(true);
    expect(doc?.props[name]?.defaultValue).toBeNull();
  }
  expect(doc?.props.children?.required).toBe(true);
  expect(story.args.sideNavigation).toBeDefined();
  expect(story.args.bottomNavigation).toBeDefined();
  expect(mapJSDocControls(story.argTypes, component).diagnostics).toEqual([]);
  for (const name of ['id', 'title', 'dir', 'lang', 'aria-describedby', 'className', 'onClick']) {
    expect(argTypes[name], name).toBeDefined();
  }
  expect(argTypes.role).toBeUndefined();
  expect(argTypes.asChild).toBeUndefined();
  expect(argTypes.ref).toBeUndefined();
});
