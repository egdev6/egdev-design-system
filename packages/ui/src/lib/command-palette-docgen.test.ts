// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { composeStory, INTERNAL_DEFAULT_PROJECT_ANNOTATIONS } from '@storybook/react-vite';
import { withCustomConfig } from 'react-docgen-typescript';
import type { StrictArgTypes } from 'storybook/internal/types';
import { describe, expect, it } from 'vitest';
import { mapJSDocControls } from '../../../../.storybook/jsdoc-controls';
import config from '../../../../.storybook/main';
import preview from '../../../../.storybook/preview';

const source = fileURLToPath(new URL('../molecules/command-palette/CommandPalette.tsx', import.meta.url));
describe('CommandPalette Controls', () => {
  it('extracts owned props and maps the actual Controls without diagnostics', () => {
    const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
      ...config.typescript?.reactDocgenTypescriptOptions
    });
    const doc = parser.parse(source).find((entry) => entry.displayName === 'CommandPalette');
    expect(doc).toBeDefined();
    const component = Object.assign((_props: Record<string, unknown>) => null, { __docgenInfo: doc });
    const story = composeStory({}, { title: 'Metadata/CommandPalette', component }, preview, 'Default');
    const extract = INTERNAL_DEFAULT_PROJECT_ANNOTATIONS.parameters?.docs?.extractArgTypes;
    const extracted: StrictArgTypes = extract(component);
    expect(mapJSDocControls(extracted, component).diagnostics).toEqual([]);
    for (const [name, control] of Object.entries({
      items: false,
      label: 'text',
      dismissLabel: 'text',
      messages: false,
      filtering: 'select',
      busy: 'boolean',
      onQueryChange: false,
      open: 'boolean',
      defaultOpen: 'boolean',
      onOpenChange: false,
      children: false,
      className: 'text'
    })) {
      expect(story.argTypes[name]?.control, name).toEqual(control === false ? false : { type: control });
    }
    expect(doc?.props.items?.required).toBe(true);
    expect(doc?.props.filtering?.type.value.map(({ value }: { value: string }) => value.replaceAll('"', ''))).toEqual([
      'builtin',
      'none'
    ]);
  }, 20_000);
});
