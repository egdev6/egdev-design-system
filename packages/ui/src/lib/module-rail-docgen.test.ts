// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { composeStory } from '@storybook/react-vite';
import { withCustomConfig } from 'react-docgen-typescript';
import { expect, it } from 'vitest';
import { mapJSDocControls } from '../../../../.storybook/jsdoc-controls';
import config from '../../../../.storybook/main';
import preview from '../../../../.storybook/preview';
import type { ModuleRailProps } from '../organisms/module-rail';
import { ModuleRail } from '../organisms/module-rail';
import meta, { Default } from '../organisms/module-rail/ModuleRail.stories';

// Real react-docgen-typescript extraction parses the TypeScript program and can exceed Vitest's
// default 5s under load, so only these heavy extraction tests get an explicit longer timeout.
const heavyDocgenTimeoutMs = 20_000;

it('extracts ModuleRail metadata and applies registered Controls without diagnostics', {
  timeout: heavyDocgenTimeoutMs
}, () => {
  const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
    ...config.typescript?.reactDocgenTypescriptOptions
  });
  const path = fileURLToPath(new URL('../organisms/module-rail/ModuleRail.tsx', import.meta.url));
  const doc = parser.parse(path).find((item) => item.displayName === 'ModuleRail');
  expect(doc).toBeDefined();
  const component = Object.assign(ModuleRail, { __docgenInfo: doc });
  const story = composeStory<ModuleRailProps>(
    Default,
    { title: meta.title, component, args: meta.args, tags: meta.tags },
    preview,
    'Default'
  );
  expect(story.argTypes.label?.control).toEqual({ type: 'text' });
  for (const name of ['items', 'product', 'endItems', 'onNavigate', 'onAdd', 'messages'] as const) {
    expect(story.argTypes[name]?.control).toBe(false);
    expect(story.argTypes[name]?.table?.disable).not.toBe(true);
  }
  expect(mapJSDocControls(story.argTypes, component).diagnostics).toEqual([]);
});
