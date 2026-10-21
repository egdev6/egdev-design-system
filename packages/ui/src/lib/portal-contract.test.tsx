// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { composeStory } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { createRef } from 'react';
import { withCustomConfig } from 'react-docgen-typescript';
import { renderToString } from 'react-dom/server';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { mapJSDocControls } from '../../../../.storybook/jsdoc-controls';
import config from '../../../../.storybook/main';
import preview from '../../../../.storybook/preview';
import { Portal, type PortalProps } from '../index';

describe('Portal server, public types and metadata', () => {
  it('renders no default portal markup without browser globals', () => {
    expect(typeof document).toBe('undefined');
    expect(renderToString(<Portal>Server content</Portal>)).toBe('');
    expect(renderToString(<Portal container={null}>Server content</Portal>)).toBe('');
  });

  it('requires children, excludes asChild and accepts div refs at the public barrel', () => {
    expectTypeOf<PortalProps>().toExtend<{ children: unknown }>();
    expectTypeOf<'asChild'>().not.toExtend<keyof PortalProps>();
    expectTypeOf<ComponentProps<typeof Portal>>().toExtend<{ ref?: React.Ref<HTMLDivElement> }>();
    const valid = <Portal ref={createRef<HTMLDivElement>()}>Content</Portal>;
    expect(valid).toBeDefined();
    // @ts-expect-error The public contract requires the children property.
    const missing = <Portal />;
    // @ts-expect-error The portal always renders its container div; asChild is not public.
    const polymorphic = <Portal asChild={true}>Content</Portal>;
    expect(missing).toBeDefined();
    expect(polymorphic).toBeDefined();
  });

  it('extracts required children and DOM container metadata through installed Controls', () => {
    const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
      ...config.typescript?.reactDocgenTypescriptOptions
    });
    const docs = parser.parse(fileURLToPath(new URL('../primitives/portal/Portal.tsx', import.meta.url)));
    const doc = docs.find((item) => item.displayName === 'Portal');
    expect(doc).toBeDefined();
    if (!doc) {
      throw new Error('Missing Portal metadata');
    }
    expect(doc.props.children?.required).toBe(true);
    expect(doc.props.container?.required).toBe(false);
    expect(doc.props.asChild).toBeUndefined();
    for (const name of ['children', 'container']) {
      expect(doc.props[name]?.tags).toMatchObject({
        control: 'false',
        controlReason: expect.stringMatching(/Default|CustomContainer/)
      });
      expect(doc.props[name]?.defaultValue).toBeNull();
    }
    const component = Object.assign((_props: Record<string, unknown>) => null, { __docgenInfo: doc });
    const story = composeStory({}, { title: 'Primitives/Portal', component }, preview, 'Default');
    const mapped = mapJSDocControls(story.argTypes, component);
    expect(mapped.diagnostics).toEqual([]);
    for (const name of ['children', 'container']) {
      expect(story.argTypes[name]?.control).toBe(false);
      expect(story.argTypes[name]?.table?.disable).toBeUndefined();
    }
  }, 20_000);
});
