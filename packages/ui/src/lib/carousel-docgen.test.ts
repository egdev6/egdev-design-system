// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { composeStory, INTERNAL_DEFAULT_PROJECT_ANNOTATIONS } from '@storybook/react-vite';
import { withCustomConfig } from 'react-docgen-typescript';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { mapJSDocControls } from '../../../../.storybook/jsdoc-controls';
import config from '../../../../.storybook/main';
import preview from '../../../../.storybook/preview';

const path = (name: string) => fileURLToPath(new URL(`../molecules/carousel/${name}`, import.meta.url));

describe('Carousel Storybook contract', () => {
  it('documents every own item, dictionary and root property with explicit controls and no fake defaults', () => {
    const file = ts.createSourceFile('types.ts', readFileSync(path('types.ts'), 'utf8'), ts.ScriptTarget.Latest, true);
    const declarations: ts.PropertySignature[] = [];
    const visit = (node: ts.Node) => {
      if (ts.isPropertySignature(node)) {
        declarations.push(node);
      }
      ts.forEachChild(node, visit);
    };
    file.statements.forEach((node) => {
      if (
        ts.isTypeAliasDeclaration(node) &&
        ['CarouselItem', 'CarouselMessages', 'CarouselProps'].includes(node.name.text)
      ) {
        visit(node);
      }
    });
    expect(declarations).toHaveLength(16);
    for (const property of declarations) {
      const tags = ts.getJSDocTags(property);
      const controls = tags.filter((tag) => tag.tagName.text === 'control');
      expect(controls, property.name.getText(file)).toHaveLength(1);
      expect(tags.some((tag) => tag.tagName.text === 'default')).toBe(false);
      if (ts.getTextOfJSDocComment(controls[0]?.comment) === 'false') {
        expect(tags.some((tag) => tag.tagName.text === 'controlReason' && tag.comment)).toBe(true);
      }
    }
    const stories = readFileSync(path('Carousel.stories.tsx'), 'utf8');
    expect(stories).toContain("title: 'Molecules/Carousel'");
    expect(stories).not.toMatch(/\bargTypes\s*:|\bplay\s*:/);
    expect(config.stories).toContain('../packages/*/src/**/*.stories.@(ts|tsx)');
  });

  it('passes real extraction, registered enhancement and native inference without owned diagnostics', () => {
    const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
      ...config.typescript?.reactDocgenTypescriptOptions
    });
    const doc = parser.parse(path('Carousel.tsx')).find((entry) => entry.displayName === 'Carousel');
    expect(doc).toBeDefined();
    const component = Object.assign((_props: Record<string, unknown>) => null, { __docgenInfo: doc });
    const extract = INTERNAL_DEFAULT_PROJECT_ANNOTATIONS.parameters?.docs?.extractArgTypes;
    const mapped = mapJSDocControls(extract(component), component);
    expect(mapped.diagnostics).toEqual([]);
    const installed = composeStory({}, { title: 'Metadata/Carousel', component }, preview, 'Default');
    for (const name of ['label', 'value', 'defaultValue']) {
      expect(installed.argTypes[name]?.control).toEqual({ type: 'text' });
      expect(doc?.props[name]?.defaultValue).toBeNull();
    }
    for (const name of ['items', 'messages', 'onValueChange']) {
      expect(installed.argTypes[name]?.control).toBe(false);
      expect(installed.argTypes[name]?.table?.disable).not.toBe(true);
      const tags = doc?.props[name]?.tags as Record<string, string> | undefined;
      expect(tags?.controlReason).toBeTruthy();
    }
    expect(doc?.props.items?.required).toBe(true);
    expect(doc?.props.label?.required).toBe(true);
    for (const name of ['id', 'dir', 'className', 'onKeyDown', 'aria-describedby']) {
      expect(doc?.props[name]).toBeDefined();
    }
    for (const name of ['role', 'tabIndex', 'aria-label', 'aria-labelledby', 'asChild', 'ref', 'children']) {
      expect(doc?.props[name], name).toBeUndefined();
    }
    expect(installed.args).toEqual({});
  });
});
