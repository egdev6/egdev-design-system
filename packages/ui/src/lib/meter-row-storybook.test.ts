// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { withCustomConfig } from 'react-docgen-typescript';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import config from '../../../../.storybook/main';

const source = (name: string) => fileURLToPath(new URL(`../molecules/meter-row/${name}`, import.meta.url));
const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
  ...config.typescript?.reactDocgenTypescriptOptions
});

// The registered extraction/enhancer/inference pipeline is covered by storybook-controls.test.ts.
describe('MeterRow Storybook contract', () => {
  it('annotates every own declaration, including dictionary entries, without fabricated defaults', () => {
    const file = ts.createSourceFile(
      source('types.ts'),
      readFileSync(source('types.ts'), 'utf8'),
      ts.ScriptTarget.Latest,
      true
    );
    const controls: Record<string, string> = {
      indeterminate: 'text',
      label: 'text',
      value: 'number',
      valueText: 'text',
      help: 'text',
      variant: 'select',
      messages: 'false'
    };
    const seen: string[] = [];
    function visit(node: ts.Node) {
      if (ts.isPropertySignature(node)) {
        const name = node.name.getText(file);
        seen.push(name);
        const tags = ts.getJSDocTags(node);
        const values = (key: string) =>
          tags.filter((tag) => tag.tagName.text === key).map((tag) => ts.getTextOfJSDocComment(tag.comment));
        expect(values('control'), name).toEqual([controls[name]]);
        expect(values('default'), name).toEqual(name === 'variant' ? ['default'] : []);
        if (name === 'messages') {
          expect(values('controlReason')[0]).toMatch(/dictionary.*Localized story/);
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(file);
    expect(seen).toEqual(Object.keys(controls));
  });

  it('extracts required inputs, finite choices, dictionary reason and only compatible native rows', () => {
    const doc = parser.parse(source('MeterRow.tsx')).find((item) => item.displayName === 'MeterRow');
    expect(doc).toBeDefined();
    const props = doc?.props ?? {};
    expect(props.label).toMatchObject({ required: true, type: { name: 'string' }, defaultValue: null });
    expect(props.value).toMatchObject({ required: true, type: { name: 'number' }, defaultValue: null });
    expect(props.variant).toMatchObject({
      required: false,
      tags: { control: 'select' },
      defaultValue: { value: 'default' }
    });
    expect(props.variant?.type.value.map((item: { value: string }) => item.value.replaceAll('"', ''))).toEqual([
      'default',
      'muted'
    ]);
    expect(props.messages).toMatchObject({ required: false, tags: { control: 'false' }, defaultValue: null });
    for (const name of ['help', 'valueText']) {
      expect(props[name]).toMatchObject({ tags: { control: 'text' }, defaultValue: null });
    }
    expect(Object.keys(props).sort()).toEqual(
      [
        'label',
        'value',
        'valueText',
        'help',
        'variant',
        'messages',
        'id',
        'title',
        'dir',
        'lang',
        'className',
        'style'
      ].sort()
    );
  }, 20_000);

  it('registers production CVA and story sources without a local stylesheet or manual controls', () => {
    const compiled = readFileSync(fileURLToPath(new URL('../styles/compiled.css', import.meta.url)), 'utf8');
    expect(compiled).toContain('@source "../molecules/meter-row/types.ts";');
    const stories = readFileSync(source('MeterRow.stories.tsx'), 'utf8');
    expect(stories).toContain("title: 'Molecules/MeterRow'");
    expect(stories).not.toMatch(/argTypes:|\bplay:/);
    for (const name of [
      'Default',
      'ValueLimits',
      'Decimal',
      'CountEquivalent',
      'Indeterminate',
      'Recovery',
      'WithHelp',
      'WithoutHelp',
      'MultipleInstances',
      'Localized',
      'ComparisonTask',
      'PassiveUpdates',
      'LongText',
      'Narrow',
      'RTL',
      'ReducedMotion',
      'ConsumerLayout'
    ]) {
      expect(stories).toContain(`export const ${name}: Story`);
    }
  });
});
