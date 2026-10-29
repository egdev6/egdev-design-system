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

const source = (file: string) => fileURLToPath(new URL(`../molecules/chip-group/${file}`, import.meta.url));

describe('ChipGroup approved v0.1 + A1 metadata', () => {
  it('typechecks the exact packed ChipGroup fixture positives and negatives against the public source barrel', () => {
    const fixture = readFileSync(
      fileURLToPath(new URL('../../../../scripts/package-consumption.test.mjs', import.meta.url)),
      'utf8'
    );
    const start = fixture.indexOf('const chipGroupType: ChipGroupType');
    const end = fixture.indexOf('export const chipChanges: boolean[]', start);
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    const code = [
      "import { createElement, createRef } from 'react';",
      "import { ChipGroup, type ChipGroupProps, type ChipGroupType, type ChipGroupOption } from '../index';",
      fixture.slice(start, end).replaceAll("'@egdev/ui'", "'../index'")
    ].join('\n');
    const virtual = fileURLToPath(new URL('./__chip_group_consumer__.ts', import.meta.url));
    const configPath = fileURLToPath(new URL('../../tsconfig.json', import.meta.url));
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      fileURLToPath(new URL('../../', import.meta.url))
    );
    const options = { ...parsed.options, noEmit: true };
    const host = ts.createCompilerHost(options);
    const original = host.getSourceFile;
    host.getSourceFile = (name, languageVersion, onError, shouldCreateNewSourceFile) =>
      name === virtual
        ? ts.createSourceFile(name, code, languageVersion, true)
        : original(name, languageVersion, onError, shouldCreateNewSourceFile);
    const program = ts.createProgram([virtual], options, host);
    expect(
      ts
        .getPreEmitDiagnostics(program)
        .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    ).toEqual([]);
  }, 30_000);
  it('annotates every public option, common prop and discriminated branch, including A1', () => {
    const file = ts.createSourceFile(
      'types.ts',
      readFileSync(source('types.ts'), 'utf8'),
      ts.ScriptTarget.Latest,
      true
    );
    const properties: ts.PropertySignature[] = [];
    const visit = (node: ts.Node) => {
      if (ts.isPropertySignature(node)) {
        properties.push(node);
      }
      ts.forEachChild(node, visit);
    };
    visit(file);
    expect(properties).toHaveLength(16);
    for (const property of properties) {
      const name = property.name.getText(file);
      const tags = ts.getJSDocTags(property);
      const controls = tags.filter((tag) => tag.tagName.text === 'control');
      expect(controls, name).toHaveLength(1);
      if (['value', 'defaultValue'].includes(name) && property.questionToken) {
        expect(controls[0]?.comment).toBe('false');
        expect(tags.find((tag) => tag.tagName.text === 'controlReason')?.comment).toMatch(
          /Mode-dependent string \/ string\[\].*Single and Multiple/
        );
      }
      if (controls[0]?.comment === 'false') {
        expect(tags.find((tag) => tag.tagName.text === 'controlReason')?.comment, name).toBeTruthy();
      }
      if (!property.questionToken) {
        expect(
          tags.some((tag) => tag.tagName.text === 'default'),
          name
        ).toBe(false);
      }
    }
  });

  it('extracts the real union and applies the installed registered enhancer without diagnostics', () => {
    const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
      ...config.typescript?.reactDocgenTypescriptOptions
    });
    const doc = parser.parse(source('ChipGroup.tsx')).find((item) => item.displayName === 'ChipGroup');
    expect(doc).toBeDefined();
    const props = doc?.props ?? {};
    for (const name of ['type', 'label', 'options']) {
      expect(props[name]?.required, name).toBe(true);
    }
    for (const name of ['value', 'defaultValue', 'onValueChange', 'disabled', 'dir']) {
      expect(props[name]?.required, name).toBe(false);
    }
    expect(props.type?.type.value.map(({ value }: { value: string }) => value.replaceAll('"', ''))).toEqual([
      'single',
      'multiple'
    ]);
    expect(props.dir?.type.value.map(({ value }: { value: string }) => value.replaceAll('"', ''))).toEqual([
      'ltr',
      'rtl'
    ]);
    expect(props.disabled?.defaultValue?.value).toBe('false');
    expect(props.dir?.defaultValue?.value).toBe('ltr');
    for (const name of ['value', 'defaultValue']) {
      expect(props[name]?.defaultValue).toBeNull();
      expect(props[name]?.type.name).toMatch(/string/);
      const tags = props[name]?.tags as Record<string, string> | undefined;
      expect(tags?.control?.split('\n').every((tag) => tag === 'false')).toBe(true);
    }
    for (const name of ['id', 'title', 'onClick', 'aria-describedby', 'className', 'style']) {
      expect(props[name], name).toBeDefined();
    }
    for (const name of [
      'ref',
      'asChild',
      'children',
      'name',
      'required',
      'role',
      'aria-label',
      'aria-labelledby',
      'onChange',
      'orientation',
      'loop',
      'tabIndex'
    ]) {
      expect(props[name], name).toBeUndefined();
    }
    const component = Object.assign((_props: Record<string, unknown>) => null, { __docgenInfo: doc });
    const story = composeStory({}, { title: 'Metadata/ChipGroup', component }, preview, 'Multiple');
    expect(mapJSDocControls(story.argTypes, component).diagnostics).toEqual([]);
    for (const name of ['options', 'value', 'defaultValue', 'onValueChange']) {
      expect(story.argTypes[name]?.control, name).toBe(false);
      expect(story.argTypes[name]?.table?.disable, name).toBeUndefined();
    }
    expect(story.argTypes.type?.control).toEqual({ type: 'select' });
    expect(story.argTypes.type?.options).toEqual(['single', 'multiple']);
    expect(story.argTypes.label?.control).toEqual({ type: 'text' });
    expect(story.argTypes.dir?.control).toEqual({ type: 'select' });
    expect(story.argTypes.disabled?.control).toEqual({ type: 'boolean' });
    expect(story.args).toEqual({});
  });
});
