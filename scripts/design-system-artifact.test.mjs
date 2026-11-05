import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import docgen from 'react-docgen-typescript';
import ts from 'typescript';
import { extractGroupedDeclarations } from '../packages/tokens/scripts/token-css.mjs';

const read = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));

test('artifact identifies the design system and its package version set', () => {
  const artifact = read('packages/system/design-system.json');
  assert.equal(artifact.name, 'egdev-design-system');
  assert.equal(artifact.schemaVersion, '1.0.0');
  assert.deepEqual(
    artifact.packages,
    ['effects', 'tokens', 'ui'].map((name) => {
      const manifest = read(`packages/${name}/package.json`);
      return { name: manifest.name, version: manifest.version };
    })
  );
});

test('artifact includes public component exports and their own props', () => {
  const artifact = read('packages/system/design-system.json');
  const gauge = artifact.components.find(({ name }) => name === 'Gauge');
  assert.ok(gauge, 'Gauge is a public export');
  assert.ok(
    gauge.props.some(({ name }) => name === 'value'),
    'Gauge documents its own value prop'
  );
});

test('compound parts expose source descriptions and child constraints', () => {
  const components = read('packages/system/design-system.json').components;
  const part = (parent, name) =>
    components.find((item) => item.name === parent).parts.find((item) => item.name === name);
  const topBar = components.find((item) => item.name === 'TopBar');
  assert.deepEqual(
    topBar.parts.map(({ name }) => name),
    ['TopBarBrand', 'TopBarMobileTrigger', 'TopBarSearchCompact', 'TopBarSearchFull', 'TopBarUserMenu']
  );
  assert.match(
    topBar.props.find(({ name }) => name === 'children').description,
    /direct TopBar parts.*one brand is required/i
  );
  assert.match(part('TopBar', 'TopBarUserMenu').description, /account control/i);
  assert.match(part('TopBar', 'TopBarUserMenu').children, /single consumer-owned named link or control/i);
  assert.match(part('ListItem', 'ListItemActions').description, /independent trailing controls/i);
  assert.match(part('TerminalCard', 'TerminalCardBar').children, /plain text/i);
});

test('Storybook hidden own props do not appear in Chip', () => {
  const chip = read('packages/system/design-system.json').components.find(({ name }) => name === 'Chip');
  assert.ok(!chip.props.some(({ name }) => name === 'type'));
  assert.ok(!chip.props.some(({ name }) => name === 'aria-pressed'));
});

test('CVA recipes include class values, not default variant names', () => {
  const button = read('packages/system/design-system.json').components.find(({ name }) => name === 'Button');
  const recipe = button.variants.find(({ name }) => name === 'buttonVariants');
  assert.ok(recipe.classes.some((value) => value.includes('eg-btn')));
  assert.ok(!recipe.classes.includes('primary'));
  assert.ok(!recipe.classes.includes('md'));
});

test('Button anatomy identifies its shared rounded-md token and size-specific spacing', () => {
  const artifact = read('packages/system/design-system.json');
  const button = artifact.components.find(({ name }) => name === 'Button');
  const recipe = button.anatomy.find(({ name }) => name === 'buttonVariants');
  const facts = (ids) => ids.map((id) => artifact.anatomyUtilities[id]);
  assert.ok(
    facts(recipe.base).some(({ className, tokens }) => className === 'rounded-md' && tokens.includes('--radius-md'))
  );
  assert.ok(
    facts(recipe.variants.size.md).some(
      ({ className, tokens }) => className === 'py-3' && tokens.includes('--spacing-3')
    )
  );
  assert.ok(
    facts(recipe.variants.size.sm).some(
      ({ className, tokens }) => className === 'px-4' && tokens.includes('--spacing-4')
    )
  );
  assert.ok(
    facts(recipe.variants.variant.dark).some(({ className, tokens }) => className === 'shadow-none' && !tokens.length)
  );
});

test('Surface anatomy retains compound conditions and source-proven composition', () => {
  const artifact = read('packages/system/design-system.json');
  const { components } = artifact;
  const surface = components.find(({ name }) => name === 'Surface');
  const recipe = surface.anatomy.find(({ name }) => name === 'surfaceVariants');
  assert.ok(
    recipe.compounds.some(
      ({ conditions, classes }) =>
        conditions.elevation === '1' &&
        classes.some((id) => artifact.anatomyUtilities[id].tokens.includes('--shadow-elev-1'))
    )
  );
  const card = components.find(({ name }) => name === 'CommunityCard');
  assert.ok(card.surfaceUsage.some(({ arguments: args }) => args.includes("tone: 'surface-1'")));
});

test('--check detects Button radius source drift without changing files', () => {
  const result = spawnSync(
    process.execPath,
    ['--import', './scripts/fixtures/design-system-artifact/radius-drift.mjs', 'scripts/build-artifact.mjs', '--check'],
    { encoding: 'utf8', timeout: 120_000 }
  );
  assert.equal(result.status, 1, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'design-system.json is stale; run pnpm artifact --write\n');
});

test('mixed known and unknown token references are explicitly unresolved', () => {
  const result = spawnSync(
    process.execPath,
    ['--import', './scripts/fixtures/design-system-artifact/mixed.mjs', 'scripts/build-artifact.mjs', '--write'],
    { encoding: 'utf8', timeout: 120_000, maxBuffer: 4_000_000 }
  );
  assert.equal(result.status, 0, result.stderr);
  const artifact = JSON.parse(result.stdout);
  const fact = artifact.anatomyUtilities.find(({ className }) => className.includes('--unknown-mixed'));
  assert.deepEqual(fact.tokens, ['--shadow-edge']);
  assert.equal(fact.unresolved, true);
});

test('anatomy utilities are shared and the artifact stays below one MiB', () => {
  const bytes = readFileSync(new URL('../packages/system/design-system.json', import.meta.url));
  const artifact = JSON.parse(bytes);
  assert.ok(bytes.length < 1_048_576, `${bytes.length} bytes`);
  assert.equal(
    new Set(artifact.anatomyUtilities.map(({ className }) => className)).size,
    artifact.anatomyUtilities.length
  );
  assert.ok(artifact.components.find(({ name }) => name === 'Button').anatomy[0].base.every(Number.isInteger));
});

test('all L9 naming types retain their source and owner', () => {
  const artifact = read('packages/system/design-system.json');
  const usages = read('skills/_shared/prop-naming.json').flatMap((entry) => entry.usages);
  const owners = new Map([
    ['CalendarGridEntry', 'CalendarGrid'],
    ['CarouselItem', 'Carousel'],
    ['ChipGroupOption', 'ChipGroup'],
    ['CommandPaletteItem', 'CommandPalette'],
    ['FooterNavigationItem', 'FooterNavigation'],
    ['GaugeGroupRing', 'GaugeGroup'],
    ['MenuEntry', 'Menu'],
    ['MenuSubmenuItem', 'Menu'],
    ['SelectTileOption', 'SelectTile'],
    ['SocialLinkItem', 'SocialLinks'],
    ['TabBarItem', 'TabBar'],
    ['TerminalCardRow', 'TerminalCard'],
    ['Toast', 'Toast']
  ]);
  assert.deepEqual(artifact.types.map(({ name }) => name).sort(), [...owners.keys()].sort());
  for (const entry of artifact.types) {
    assert.equal(entry.owner, owners.get(entry.name), entry.name);
    const sources = usages.filter((usage) => usage.component === entry.name).map((usage) => usage.source.path);
    assert.ok(sources.length > 0);
    assert.ok(
      sources.every((source) => source === entry.source),
      entry.name
    );
    assert.ok(existsSync(resolve(entry.source)), entry.source);
  }
});

test('--check rejects stale artifact bytes without modifying the worktree', () => {
  const result = spawnSync(
    process.execPath,
    ['--import', './scripts/fixtures/design-system-artifact/stale.mjs', 'scripts/build-artifact.mjs', '--check'],
    { encoding: 'utf8', timeout: 120_000 }
  );
  assert.equal(result.status, 1, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'design-system.json is stale; run pnpm artifact --write\n');
});

test('--check detects a part removed from source without writing the artifact', () => {
  const before = readFileSync('packages/system/design-system.json', 'utf8');
  const result = spawnSync(
    process.execPath,
    ['--import', './scripts/fixtures/design-system-artifact/removed-part.mjs', 'scripts/build-artifact.mjs', '--check'],
    { encoding: 'utf8', timeout: 120_000 }
  );
  assert.equal(result.status, 1, result.stderr);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'design-system.json is stale; run pnpm artifact --write\n');
  assert.equal(readFileSync('packages/system/design-system.json', 'utf8'), before);
});

test('artifact schema and total ordering match the contract', () => {
  const artifact = read('packages/system/design-system.json');
  const keys = (item, expected) => assert.deepEqual(Object.keys(item).sort(), expected.slice().sort());
  const sorted = (items, key) =>
    assert.deepEqual(
      items.map((item) => item[key]),
      items.map((item) => item[key]).sort()
    );
  keys(artifact, [
    'name',
    'schemaVersion',
    'packages',
    'catalog',
    'components',
    'anatomyUtilities',
    'types',
    'tokens',
    'materialRecipes',
    'propNaming'
  ]);
  assert.match(artifact.schemaVersion, /^\d+\.\d+\.\d+$/);
  for (const [field, key, fields] of [
    ['packages', 'name', ['name', 'version']],
    ['catalog', 'name', ['name', 'level', 'package', 'radix', 'composes', 'action', 'available']],
    ['components', 'name', ['name', 'package', 'source', 'props', 'variants', 'parts', 'anatomy', 'surfaceUsage']],
    ['types', 'name', ['name', 'owner', 'source']],
    ['tokens', 'name', ['name', 'value', 'group']],
    ['materialRecipes', 'id', ['id', 'semantics', 'tokens']],
    ['propNaming', 'id', ['id', 'name', 'status', 'components']]
  ]) {
    sorted(artifact[field], key);
    for (const item of artifact[field]) {
      keys(item, fields);
    }
  }
  for (const item of artifact.components) {
    sorted(item.parts, 'name');
    for (const part of item.parts) {
      keys(part, ['name', 'source', 'description', 'children']);
    }
    sorted(item.props, 'name');
    sorted(item.variants, 'name');
    for (const prop of item.props) {
      keys(prop, ['name', 'type', 'required', 'default', 'description', 'deprecated']);
    }
    for (const variant of item.variants) {
      keys(variant, ['name', 'classes']);
    }
  }
  assert.throws(() => keys({ ...artifact, unexpected: true }, Object.keys(artifact)));
});

test('every catalog availability is joined to the correct package exports', () => {
  const artifact = read('packages/system/design-system.json');
  const catalog = read('docs/catalog.json').filter((row) => ['ui', 'effects'].includes(row.destino));
  const exports = new Set(artifact.components.map((entry) => `${entry.package}:${entry.name}`));
  const expected = catalog
    .map((row) => ({
      name: row.nombre,
      package: `@egdev/${row.destino}`,
      available: row.nombre.split(/\s*\/\s*/).every((name) => exports.has(`@egdev/${row.destino}:${name}`))
    }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const actual = artifact.catalog.map(({ name, package: pkg, available }) => ({ name, package: pkg, available }));
  assert.deepEqual(actual, expected);
  assert.throws(() =>
    assert.deepEqual([{ ...actual[0], available: !actual[0].available }, ...actual.slice(1)], expected)
  );
});

test('naming usages resolve and recipes are present', () => {
  const artifact = read('packages/system/design-system.json');
  const registry = read('skills/_shared/prop-naming.json');
  const names = new Set([...artifact.components, ...artifact.types].map(({ name }) => name));
  for (const { usages } of registry) {
    for (const usage of usages) {
      assert.ok(names.has(usage.component), `Missing ${usage.component}`);
    }
  }
  assert.ok(artifact.materialRecipes.length > 0);
});

test('public output tracks exports, sources, catalog, recipes and token declarations', () => {
  const artifact = read('packages/system/design-system.json');
  const expectedTokens = extractGroupedDeclarations(
    readFileSync(new URL('../packages/tokens/src/theme.css', import.meta.url), 'utf8')
  );
  const sorted = (items) => [...items].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const assertTokens = (candidate) => assert.deepEqual(candidate.tokens, sorted(expectedTokens));
  assertTokens(artifact);
  assert.throws(() => assertTokens({ ...artifact, tokens: artifact.tokens.slice(1) }));
  const catalog = read('docs/catalog.json').filter((row) => row.destino === 'ui' || row.destino === 'effects');
  const assertCatalog = (candidate) =>
    assert.deepEqual(candidate.catalog.map((row) => row.name).sort(), catalog.map((row) => row.nombre).sort());
  assertCatalog(artifact);
  assert.throws(() => assertCatalog({ ...artifact, catalog: artifact.catalog.slice(1) }));
  const barrels = ['packages/ui/src/index.ts', 'packages/effects/src/index.ts'].map((path) => resolve(path));
  const program = ts.createProgram(barrels, {
    jsx: ts.JsxEmit.ReactJSX,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ESNext,
    skipLibCheck: true
  });
  const checker = program.getTypeChecker();
  const names = barrels
    .flatMap((barrel) =>
      checker
        .getExportsOfModule(checker.getSymbolAtLocation(program.getSourceFile(barrel)))
        .filter((item) => {
          const target = item.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(item) : item;
          return Boolean(target.flags & ts.SymbolFlags.Value);
        })
        .map((item) => item.name)
    )
    .sort();
  const assertExports = (candidate) => assert.deepEqual(candidate.components.map((entry) => entry.name).sort(), names);
  assertExports(artifact);
  assert.throws(() => assertExports({ ...artifact, components: artifact.components.slice(1) }));
  for (const entry of artifact.types) {
    assert.ok(existsSync(resolve(entry.source)), entry.source);
  }
  const material = readFileSync(new URL('../docs/MATERIAL.md', import.meta.url), 'utf8').toLowerCase();
  const tokens = new Set(artifact.tokens.map((entry) => entry.name));
  for (const recipe of artifact.materialRecipes) {
    assert.ok(material.includes(recipe.id.toLowerCase()), recipe.id);
    for (const token of recipe.tokens) {
      assert.ok(tokens.has(token), token);
    }
  }
});

test('own props match docgen for every exported props alias and reject removal or type drift', () => {
  const artifact = read('packages/system/design-system.json');
  const config = ts.readConfigFile(resolve('tsconfig.json'), ts.sys.readFile);
  const options = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd()).options;
  const virtualPath = resolve('__artifact_props_test__.ts');
  const sourceText = artifact.components
    .map((component, index) =>
      component.source.endsWith('/types.ts')
        ? `declare const p${index}: import('./${component.source.replace(/\.ts$/, '')}').${component.name}Props;`
        : ''
    )
    .join('\n');
  const host = ts.createCompilerHost(options);
  const getSource = host.getSourceFile.bind(host);
  host.getSourceFile = (file, version, ...rest) =>
    file === virtualPath ? ts.createSourceFile(file, sourceText, version, true) : getSource(file, version, ...rest);
  const program = ts.createProgram([virtualPath], options, host);
  const checker = program.getTypeChecker();
  const parser = new docgen.Parser(program, {
    shouldIncludePropTagMap: true,
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true
  });
  let checked = 0;
  for (const statement of program.getSourceFile(virtualPath).statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }
    for (const declaration of statement.declarationList.declarations) {
      const index = Number(declaration.name.getText().slice(1));
      const component = artifact.components[index];
      const actual = Object.values(parser.getPropsInfo(checker.getSymbolAtLocation(declaration.name)))
        .filter(
          (prop) =>
            (!prop.parent || resolve(prop.parent.fileName) === resolve(component.source)) &&
            !(component.name === 'Chip' && ['type', 'aria-pressed'].includes(prop.name))
        )
        .map((prop) => ({
          name: prop.name,
          type: prop.type.name,
          required: prop.required,
          default: prop.defaultValue?.value ?? null
        }))
        .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
      const observed = component.props.map(({ name, type, required, default: value }) => ({
        name,
        type,
        required,
        default: value
      }));
      assert.deepEqual(observed, actual, component.name);
      if (actual.length) {
        assert.throws(() => assert.deepEqual(observed.slice(1), actual));
        assert.throws(() => assert.deepEqual([{ ...observed[0], type: 'changed' }, ...observed.slice(1)], actual));
        checked++;
      }
    }
  }
  assert.ok(checked > 0);
});

test('artifact contains the complete token source', () => {
  const artifact = read('packages/system/design-system.json');
  assert.equal(artifact.tokens.length, 292);
  assert.deepEqual(new Set(artifact.tokens.map(({ group }) => group)), new Set(['theme', 'root', 'inline']));
});
