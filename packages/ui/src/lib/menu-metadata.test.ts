// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { withCustomConfig } from 'react-docgen-typescript';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import config from '../../../../.storybook/main';

const source = (file: string) => fileURLToPath(new URL(`../molecules/menu/${file}`, import.meta.url));
const ast = (file: string) => ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);

// Installed extraction/enhancement/inference is additionally covered by storybook-controls.test.ts.
describe('Menu public metadata and static composition', () => {
  it('annotates every public schema field and union branch without fabricated required defaults', () => {
    const file = ast(source('types.ts'));
    let fields = 0;
    for (const node of file.statements) {
      if (
        !ts.isTypeAliasDeclaration(node) ||
        !/^Menu(?:Props|ActionItem|LinkItem|SeparatorItem|LabelItem|SubmenuItem)$/.test(node.name.text)
      ) {
        continue;
      }
      const visit = (child: ts.Node) => {
        if (ts.isPropertySignature(child)) {
          fields++;
          const tags = ts.getJSDocTags(child);
          const controls = tags.filter((tag) => tag.tagName.text === 'control');
          expect(controls, `${node.name.text}.${child.name.getText(file)}`).toHaveLength(1);
          const control = ts.getTextOfJSDocComment(controls[0]?.comment);
          expect(['text', 'select', 'boolean', 'false']).toContain(control);
          if (control === 'false') {
            const reason = tags.find((tag) => tag.tagName.text === 'controlReason');
            expect(ts.getTextOfJSDocComment(reason?.comment)).toMatch(/see /);
          }
          if (!child.questionToken) {
            expect(tags.some((tag) => tag.tagName.text === 'default')).toBe(false);
          }
          if (child.name.getText(file) === 'kind') {
            expect(control).toBe('select');
          }
        }
        ts.forEachChild(child, visit);
      };
      visit(node.type);
    }
    expect(fields).toBe(36);
  });

  it('extracts the real Menu props, enums, requiredness and defaults without native forwarding', () => {
    const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
      ...config.typescript?.reactDocgenTypescriptOptions
    });
    const doc = parser.parse(source('Menu.tsx')).find((item) => item.displayName === 'Menu');
    expect(doc).toBeDefined();
    const props = doc?.props ?? {};
    expect(Object.keys(props).sort()).toEqual([
      'align',
      'children',
      'className',
      'defaultOpen',
      'header',
      'items',
      'onNavigate',
      'onOpenChange',
      'open',
      'side'
    ]);
    for (const prop of ['children', 'items']) {
      expect(props[prop]).toMatchObject({ required: true, defaultValue: null });
    }
    expect(props.side).toMatchObject({ defaultValue: { value: 'bottom' }, tags: { control: 'select' } });
    expect(props.align).toMatchObject({ defaultValue: { value: 'start' }, tags: { control: 'select' } });
    expect(props.defaultOpen).toMatchObject({ defaultValue: { value: 'false' }, tags: { control: 'boolean' } });
    for (const prop of ['open', 'header', 'onNavigate', 'onOpenChange']) {
      expect(props[prop]?.defaultValue).toBeNull();
    }
    expect(props.side?.type.value.map(({ value }: { value: string }) => value.replaceAll('"', ''))).toEqual([
      'top',
      'right',
      'bottom',
      'left'
    ]);
    expect(props.align?.type.value.map(({ value }: { value: string }) => value.replaceAll('"', ''))).toEqual([
      'start',
      'center',
      'end'
    ]);
  }, 20_000);

  it('keeps utilities in types.ts, composes Surface without elevation and adds no keyboard/focus adapter', () => {
    const hook = readFileSync(source('useMenu.ts'), 'utf8');
    const jsx = readFileSync(source('Menu.tsx'), 'utf8');
    const types = readFileSync(source('types.ts'), 'utf8');
    expect(hook).toMatch(/surfaceVariants\(\{ tone: 'overlay', padding: 'none', radius: 'xl' \}\)/);
    expect(hook).not.toMatch(/elevation:|onKeyDown|onEscapeKeyDown|\.focus\(/);
    expect(jsx).not.toMatch(/className=['"]|onKeyDown|onEscapeKeyDown|\.focus\(/);
    expect(types).not.toMatch(/bg-surface-overlay|shadow-elev-3|backdrop-blur-overlay/);
    expect(types).toContain('pointer-coarse:min-h-11');
    const stories = ast(source('Menu.stories.tsx'));
    const names = stories.statements.flatMap((node) =>
      ts.isVariableStatement(node) && node.modifiers?.some((item) => item.kind === ts.SyntaxKind.ExportKeyword)
        ? node.declarationList.declarations.map((item) => item.name.getText(stories))
        : []
    );
    expect(names).toEqual([
      'Default',
      'WithIconsAndShortcuts',
      'Danger',
      'Submenu',
      'Links',
      'Header',
      'Controlled',
      'Disabled'
    ]);
    expect(stories.getText()).toContain("title: 'Molecules/Menu'");
    expect(stories.getText()).not.toMatch(/argTypes\s*:|\bplay\s*:/);
    const sources = readFileSync(fileURLToPath(new URL('../styles/compiled.css', import.meta.url)), 'utf8');
    expect(sources).toContain('@source "../molecules/menu/types.ts"');
    expect(sources).not.toContain('Menu.stories.tsx');
  });
});
