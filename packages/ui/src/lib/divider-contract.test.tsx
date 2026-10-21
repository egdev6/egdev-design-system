// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { composeStory } from '@storybook/react-vite';
import { withCustomConfig } from 'react-docgen-typescript';
import { renderToString } from 'react-dom/server';
import ts from 'typescript';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { mapJSDocControls } from '../../../../.storybook/jsdoc-controls';
import config from '../../../../.storybook/main';
import preview from '../../../../.storybook/preview';
import { Divider, type DividerOrientation, type DividerProps } from '../index';

const source = (path: string) => fileURLToPath(new URL(path, import.meta.url));

describe('Divider public types, server rendering and metadata', () => {
  it('exposes only the approved own props and passive span attributes', () => {
    expectTypeOf<DividerOrientation>().toEqualTypeOf<'horizontal' | 'vertical'>();
    expectTypeOf<DividerProps>().toExtend<{ orientation?: DividerOrientation; decorative?: boolean }>();
    expectTypeOf<
      | 'ref'
      | 'asChild'
      | 'children'
      | 'role'
      | 'tabIndex'
      | 'aria-hidden'
      | 'aria-orientation'
      | 'dangerouslySetInnerHTML'
    >().not.toExtend<keyof DividerProps>();
    // @ts-expect-error Empty roots do not accept public children.
    const children = <Divider>Unsupported</Divider>;
    // @ts-expect-error Public asChild is absent; span composition is internal and fixed.
    const polymorphic = <Divider asChild={true} />;
    // @ts-expect-error The passive Divider exposes no public ref API.
    const referenced: DividerProps = { ref: null };
    // @ts-expect-error Radix owns semantic roles through decorative.
    const role: DividerProps = { role: 'separator' };
    expect([children, polymorphic, referenced, role]).toHaveLength(4);
  });

  it('renders one empty span with Radix semantics on the server', () => {
    expect(typeof document).toBe('undefined');
    const decorative = renderToString(<Divider />);
    expect(decorative).toMatch(/^<span /);
    expect(decorative).toContain('role="none"');
    expect(decorative).toContain('data-orientation="horizontal"');
    expect(decorative).toMatch(/><\/span>$/);
    const semantic = renderToString(<Divider decorative={false} orientation='vertical' />);
    expect(semantic).toContain('role="separator"');
    expect(semantic).toContain('aria-orientation="vertical"');
    expect(semantic).not.toMatch(/tabindex|data-state/);
  });

  it('annotates each owned prop without inventing controls for native attributes', () => {
    const path = source('../primitives/divider/types.ts');
    const file = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
    const own: ts.PropertySignature[] = [];
    const visit = (node: ts.Node) => {
      if (ts.isPropertySignature(node)) {
        own.push(node);
      }
      ts.forEachChild(node, visit);
    };
    visit(file);
    expect(own.map((prop) => prop.name.getText(file))).toEqual(['orientation', 'decorative']);
    for (const prop of own) {
      const tags = ts.getJSDocTags(prop);
      expect(tags.filter((tag) => tag.tagName.text === 'control')).toHaveLength(1);
      expect(tags.filter((tag) => tag.tagName.text === 'default')).toHaveLength(1);
    }
  });

  it('extracts defaults, enum choices and native props through the registered Controls pipeline', () => {
    const parser = withCustomConfig(source('../../tsconfig.json'), {
      ...config.typescript?.reactDocgenTypescriptOptions
    });
    const doc = parser
      .parse(source('../primitives/divider/Divider.tsx'))
      .find((item) => item.displayName === 'Divider');
    expect(doc).toBeDefined();
    if (!doc) {
      throw new Error('Missing Divider docgen');
    }
    expect(doc.props.orientation?.tags).toMatchObject({ control: 'select' });
    expect(doc.props.decorative?.tags).toMatchObject({ control: 'boolean' });
    expect(doc.props.orientation?.defaultValue?.value).toBe('horizontal');
    expect(doc.props.decorative?.defaultValue?.value).toBe('true');
    expect(doc.props.orientation?.required).toBe(false);
    expect(doc.props.orientation?.type.value?.map((value: { value: string }) => value.value.replace(/"/g, ''))).toEqual(
      ['horizontal', 'vertical']
    );
    for (const prop of ['id', 'title', 'dir', 'aria-label', 'aria-labelledby', 'className', 'style']) {
      expect(doc.props[prop], prop).toBeDefined();
    }
    for (const prop of [
      'children',
      'asChild',
      'ref',
      'role',
      'aria-hidden',
      'aria-orientation',
      'tabIndex',
      'dangerouslySetInnerHTML'
    ]) {
      expect(doc.props[prop], prop).toBeUndefined();
    }
    const component = Object.assign((_props: Record<string, unknown>) => null, { __docgenInfo: doc });
    const story = composeStory({}, { title: 'Primitives/Divider', component }, preview, 'Default');
    const result = mapJSDocControls(story.argTypes, component);
    expect(result.diagnostics).toEqual([]);
    expect(story.argTypes.orientation?.control).toEqual({ type: 'select' });
    expect(story.argTypes.orientation?.options).toEqual(['horizontal', 'vertical']);
    expect(story.argTypes.decorative?.control).toEqual({ type: 'boolean' });
    expect(story.argTypes.orientation?.table?.defaultValue?.summary).toBe('"horizontal"');
    expect(story.argTypes.decorative?.table?.defaultValue?.summary).toBe('true');
  }, 20_000);
});
