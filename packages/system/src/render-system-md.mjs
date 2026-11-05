const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const sorted = (items, key) => [...(items ?? [])].sort((a, b) => compare(key(a), key(b)));
const cell = (value) =>
  String(value ?? '')
    .replaceAll('|', '\\|')
    .replaceAll('\n', ' ');
const tokenSource = 'tokens[] · packages/tokens/src/theme.css';
const recipeSource = 'materialRecipes[] · docs/MATERIAL.md';
const namingSource = 'propNaming[] · skills/_shared/prop-naming.json';

/** Render the artifact without reading the environment or filesystem. */
export function renderSystemMd(artifact) {
  const tokens = artifact.tokens ?? [];
  const recipes = sorted(artifact.materialRecipes, (item) => item.id);
  const sections = [];
  const section = (name, lines) => sections.push(`## ${name}\n\n${lines.length ? lines.join('\n') : 'Empty.'}`);
  const packages = sorted(artifact.packages, (item) => item.name);
  section('Header', [
    `# ${cell(artifact.name)}`,
    '<!-- Generated from design-system.json. Do not edit. -->',
    `Schema: ${cell(artifact.schemaVersion)} (schemaVersion)`,
    '| Package | Version | Source |',
    '| --- | --- | --- |',
    ...packages.map(
      (p) =>
        `| ${cell(p.name)} | ${cell(p.version)} | packages[] · ${cell(`packages/${p.name.split('/').at(-1)}/package.json`)} |`
    ),
    'Re-run: `pnpm exec egdev-system-md --write`'
  ]);
  const groups = [
    ['Colours', ['--color-']],
    ['Typography', ['--font-', '--text-', '--leading-', '--tracking-']],
    ['Spacing', ['--spacing-']],
    ['Radius', ['--radius-']],
    ['Shadows and effects', ['--shadow-', '--gradient-', '--blur-', '--ease-', '--duration-']]
  ];
  const table = (items) =>
    items.length
      ? [
          '| Name | Value | Group | Usage | Source |',
          '| --- | --- | --- | --- | --- |',
          ...items.map(
            (t) =>
              `| ${cell(t.name)} | ${cell(t.value)} | ${cell(t.group)} | ${cell(
                recipes
                  .filter((r) => (r.tokens ?? []).includes(t.name))
                  .map((r) => r.id)
                  .join(', ')
              )} | ${tokenSource} |`
          )
        ]
      : [];
  for (const [name, prefixes] of groups) {
    section(
      name,
      table(
        prefixes.flatMap((prefix) =>
          sorted(
            tokens.filter((t) => t.name.startsWith(prefix)),
            (t) => t.name
          )
        )
      )
    );
  }
  section(
    'Material rules',
    recipes.map((r) => {
      const values = (r.tokens ?? [])
        .map((name) => {
          const token = tokens.find((t) => t.name === name);
          return token ? `${name}: ${token.value}` : null;
        })
        .filter(Boolean)
        .join(', ');
      return `- ${r.id}: ${r.semantics} ${values} (${recipeSource}; ${tokenSource})`;
    })
  );
  const catalog = sorted(artifact.catalog, (row) => `${row.name}\0${row.package ?? ''}`);
  const componentLines = [];
  for (const row of catalog.filter((item) => item.available)) {
    const matches = (artifact.components ?? []).filter(
      (c) => row.name.split(/\s*\/\s*/).includes(c.name) && c.package === row.package
    );
    componentLines.push(
      `### ${row.name}`,
      `catalog[] · docs/catalog.json · ${cell(row.package)} · ${cell(row.level)} · ${cell(row.radix)}`
    );
    for (const component of sorted(matches, (item) => item.name)) {
      componentLines.push(`- ${component.name} (components[] · ${component.source})`);
      for (const prop of sorted(component.props, (item) => item.name)) {
        componentLines.push(
          `  - ${prop.name}: ${cell(prop.type)}; ${cell(prop.description)} (components[] · ${component.source})`
        );
      }
    }
  }
  const unavailable = catalog.filter((row) => !row.available);
  if (unavailable.length) {
    componentLines.push('Not exported:', ...unavailable.map((row) => `- ${row.name} (catalog[] · docs/catalog.json)`));
  }
  section('Components', componentLines);
  section(
    'Usage rules',
    sorted(artifact.propNaming, (item) => item.id).map(
      (p) => `- ${p.id}: ${p.name}; ${p.status}; ${(p.components ?? []).join(', ')} (${namingSource})`
    )
  );
  const prefixes = groups.flatMap(([, values]) => values);
  section(
    'Other tokens',
    table(
      sorted(
        tokens.filter((t) => !prefixes.some((prefix) => t.name.startsWith(prefix))),
        (t) => t.name
      )
    )
  );
  return `${sections.join('\n\n')}\n`;
}
