// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { withCustomConfig } from 'react-docgen-typescript';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import config from '../../../../.storybook/main';

const path = (file: string) => fileURLToPath(new URL(`../molecules/timeline/${file}`, import.meta.url));
const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
  ...config.typescript?.reactDocgenTypescriptOptions
});

describe('Timeline metadata', () => {
  it('annotates every own declaration, including both union branches and nested entry data', () => {
    const file = ts.createSourceFile(
      path('types.ts'),
      readFileSync(path('types.ts'), 'utf8'),
      ts.ScriptTarget.Latest,
      true
    );
    let count = 0;
    const visit = (node: ts.Node) => {
      if (ts.isPropertySignature(node)) {
        count++;
        const tags = ts.getJSDocTags(node);
        const controls = tags.filter((tag) => tag.tagName.text === 'control');
        expect(controls, node.getText(file)).toHaveLength(1);
        const directive = ts.getTextOfJSDocComment(controls[0]?.comment)?.trim();
        expect(['text', 'boolean', 'select', 'false']).toContain(directive);
        if (directive === 'false') {
          expect(tags.find((tag) => tag.tagName.text === 'controlReason')?.comment).toBeTruthy();
        }
        if (!node.questionToken) {
          expect(
            tags.filter((tag) => tag.tagName.text === 'default'),
            node.getText(file)
          ).toHaveLength(0);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(file);
    expect(count).toBeGreaterThan(30);
  });

  it('extracts required name/items, finite enums, constants and protected native omissions', () => {
    const doc = parser.parse(path('Timeline.tsx')).find((entry) => entry.displayName === 'Timeline');
    expect(doc).toBeDefined();
    if (!doc) {
      throw new Error('Timeline docgen missing');
    }
    expect(doc.props.label).toMatchObject({ required: true, type: { name: 'string' }, defaultValue: null });
    expect(doc.props.items?.required).toBe(true);
    expect(doc.props.variant?.defaultValue?.value).toBe('events');
    expect(doc.props.size?.defaultValue?.value).toBe('md');
    const values = (name: string) =>
      doc.props[name]?.type.value.map((value: { value: string }) => value.value.replace(/['"]/g, ''));
    expect(values('variant')).toEqual(['events', 'chat']);
    expect(values('size')).toEqual(['sm', 'md', 'lg']);
    expect(values('aria-live')).toEqual(['off', 'polite']);
    expect(doc.props.messages?.defaultValue).toBeNull();
    for (const name of ['id', 'title', 'aria-describedby', 'aria-busy', 'className', 'style', 'onClick', 'dir']) {
      expect(doc.props[name], name).toBeDefined();
    }
    for (const name of [
      'ref',
      'asChild',
      'children',
      'role',
      'tabIndex',
      'contentEditable',
      'aria-label',
      'aria-labelledby',
      'aria-atomic',
      'aria-relevant',
      'aria-selected',
      'aria-pressed',
      'dangerouslySetInnerHTML'
    ]) {
      expect(doc.props[name], name).toBeUndefined();
    }
    // Real installed extraction/enhancement/inference and zero diagnostics are covered
    // by the Timeline entry in storybook-controls.test.ts, not a synthetic SBType cast.
  });
});
