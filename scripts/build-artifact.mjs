import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import docgen from 'react-docgen-typescript';
import ts from 'typescript';
import { extractGroupedDeclarations } from '../packages/tokens/scripts/token-css.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const pathOf = (path) => relative(root, path).replaceAll('\\', '/');
const barrels = ['packages/ui/src/index.ts', 'packages/effects/src/index.ts'];
const config = ts.readConfigFile(resolve(root, 'tsconfig.json'), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(
  barrels.map((path) => resolve(root, path)),
  parsed.options
);
const checker = program.getTypeChecker();
const publicValues = [];
for (const barrel of barrels) {
  const source = program.getSourceFile(resolve(root, barrel));
  const symbol = checker.getSymbolAtLocation(source);
  for (const item of checker.getExportsOfModule(symbol)) {
    const target = item.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(item) : item;
    if (!(target.flags & ts.SymbolFlags.Value)) {
      continue;
    }
    const declaration = target.valueDeclaration ?? target.declarations?.[0];
    const file = declaration?.getSourceFile().fileName;
    const local = file && pathOf(file).startsWith('packages/') ? file : resolve(root, barrel);
    const types = resolve(dirname(local), 'types.ts');
    publicValues.push({
      name: item.name,
      package: barrel.includes('/ui/') ? '@egdev/ui' : '@egdev/effects',
      file: local,
      types: existsSync(types) ? types : null,
      symbol: target,
      declaration
    });
  }
}
// Type aliases have no runtime value for docgen to inspect. A virtual in-memory declaration
// exposes each exported Props alias as a value without writing generated TypeScript to disk.
const virtualPath = resolve(root, '__design_system_props__.ts');
const typeEntries = publicValues.map((entry, index) => {
  const source = entry.types && program.getSourceFile(entry.types);
  const symbol = source && checker.getSymbolAtLocation(source);
  const propName = `${entry.name}Props`;
  const exists = symbol && checker.getExportsOfModule(symbol).some((item) => item.name === propName);
  return exists
    ? `declare const prop${index}: import('./${pathOf(entry.types).replace(/\.ts$/, '')}').${propName};`
    : '';
});
const host = ts.createCompilerHost(parsed.options);
const originalGetSourceFile = host.getSourceFile.bind(host);
host.getSourceFile = (file, languageVersion, ...rest) =>
  file === virtualPath
    ? ts.createSourceFile(file, typeEntries.join('\n'), languageVersion, true)
    : originalGetSourceFile(file, languageVersion, ...rest);
const propProgram = ts.createProgram([virtualPath], parsed.options, host);
const propChecker = propProgram.getTypeChecker();
const parser = new docgen.Parser(propProgram, {
  shouldIncludePropTagMap: true,
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true
});
const propsByIndex = new Map();
for (const statement of propProgram.getSourceFile(virtualPath).statements) {
  if (!ts.isVariableStatement(statement)) {
    continue;
  }
  for (const declaration of statement.declarationList.declarations) {
    const index = Number(declaration.name.getText().replace('prop', ''));
    propsByIndex.set(index, parser.getPropsInfo(propChecker.getSymbolAtLocation(declaration.name)));
  }
}
// Read Storybook's hidden-own-prop table from its source, without evaluating its config.
const storybook = ts.createSourceFile(
  '.storybook/main.ts',
  readFileSync(resolve(root, '.storybook/main.ts'), 'utf8'),
  ts.ScriptTarget.Latest,
  true
);
const hidden = new Map();
for (const statement of storybook.statements) {
  if (!ts.isVariableStatement(statement)) {
    continue;
  }
  for (const declaration of statement.declarationList.declarations) {
    if (
      declaration.name.getText(storybook) !== 'hiddenOwnProps' ||
      !declaration.initializer ||
      !ts.isObjectLiteralExpression(declaration.initializer)
    ) {
      continue;
    }
    for (const property of declaration.initializer.properties) {
      if (ts.isPropertyAssignment(property) && ts.isArrayLiteralExpression(property.initializer)) {
        hidden.set(
          property.name.getText(storybook),
          property.initializer.elements.filter(ts.isStringLiteral).map((item) => item.text)
        );
      }
    }
  }
}
function variants(file) {
  if (!file) {
    return [];
  }
  const source =
    program.getSourceFile(file) ?? ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const result = [];
  for (const statement of source.statements) {
    if (
      !ts.isVariableStatement(statement) ||
      !statement.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      continue;
    }
    for (const declaration of statement.declarationList.declarations) {
      const call = declaration.initializer;
      if (
        !ts.isIdentifier(declaration.name) ||
        !call ||
        !ts.isCallExpression(call) ||
        call.expression.getText(source) !== 'cva'
      ) {
        continue;
      }
      const classes = [];
      const visit = (node) => {
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
          classes.push(node.text);
        } else if (ts.isPropertyAssignment(node)) {
          visit(node.initializer);
        } else {
          ts.forEachChild(node, visit);
        }
      };
      if (call.arguments[0]) {
        visit(call.arguments[0]);
      }
      const options = call.arguments[1];
      if (options && ts.isObjectLiteralExpression(options)) {
        for (const property of options.properties) {
          if (!ts.isPropertyAssignment(property)) {
            continue;
          }
          const key = property.name.getText(source).replace(/^['"]|['"]$/g, '');
          if (key === 'variants') {
            visit(property.initializer);
          }
          if (key === 'compoundVariants' && ts.isArrayLiteralExpression(property.initializer)) {
            for (const compound of property.initializer.elements) {
              if (!ts.isObjectLiteralExpression(compound)) {
                continue;
              }
              for (const field of compound.properties) {
                if (
                  ts.isPropertyAssignment(field) &&
                  ['class', 'className'].includes(field.name.getText(source).replace(/^['"]|['"]$/g, ''))
                ) {
                  visit(field.initializer);
                }
              }
            }
          }
        }
      }
      result.push({ name: declaration.name.text, classes });
    }
  }
  return result.sort((a, b) => compare(a.name, b.name));
}
// Associate only public values declared in the same source file and named for their parent.
// Descriptions and child restrictions remain source facts, not inferred API promises.
function compoundParts(parent) {
  return publicValues
    .filter(
      (part) =>
        part.package === parent.package &&
        part.file === parent.file &&
        part.name !== parent.name &&
        part.name.startsWith(parent.name) &&
        /^[A-Z]/.test(part.name.slice(parent.name.length))
    )
    .map((part) => {
      const propsType = part.declaration?.type?.typeArguments?.[0];
      const alias =
        propsType && checker.getSymbolAtLocation(ts.isTypeReferenceNode(propsType) ? propsType.typeName : propsType);
      const propsSymbol = alias?.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(alias) : alias;
      const propsDescription = propsSymbol ? ts.displayPartsToString(propsSymbol.getDocumentationComment(checker)) : '';
      const type = propsType && checker.getTypeAtLocation(propsType);
      const child = type && checker.getPropertyOfType(type, 'children');
      const childDescription = child ? ts.displayPartsToString(child.getDocumentationComment(checker)) : '';
      return {
        name: part.name,
        source: pathOf(part.file),
        description: ts.displayPartsToString(part.symbol.getDocumentationComment(checker)),
        children: [propsDescription, childDescription].filter(Boolean).join(' ')
      };
    })
    .sort((a, b) => compare(a.name, b.name));
}

// Visual anatomy is deliberately separate from the legacy flattened CVA contract.
const tokenDeclarations = extractGroupedDeclarations(
  readFileSync(resolve(root, 'packages/tokens/src/theme.css'), 'utf8')
);
const tokenNames = new Set(tokenDeclarations.map(({ name }) => name));
const anatomyUtilities = [];
const anatomyUtilityIds = new Map();

function internUtility(fact) {
  if (!anatomyUtilityIds.has(fact.className)) {
    anatomyUtilityIds.set(fact.className, anatomyUtilities.length);
    anatomyUtilities.push(fact);
  }
  return anatomyUtilityIds.get(fact.className);
}

function utilityAnatomy(className) {
  // Colons inside arbitrary selectors and values are not variant separators.
  let depth = 0;
  let start = 0;
  for (let i = 0; i < className.length; i++) {
    if (className[i] === '[' || className[i] === '(') {
      depth++;
    }
    if (className[i] === ']' || className[i] === ')') {
      depth--;
    }
    if (className[i] === ':' && depth === 0) {
      start = i + 1;
    }
  }
  const utility = className.slice(start);
  const match = utility.match(/^(rounded(?:-[a-z]+)?|p[trblxyse]?|gap(?:-[xy])?|shadow|text|font)-(.+)$/);
  if (!match && !utility.startsWith('[box-shadow:') && !utility.startsWith('[font-')) {
    return null;
  }
  const prefix = match?.[1];
  const value = match?.[2];
  let candidates = [];
  if (prefix?.startsWith('rounded')) {
    candidates = [`--radius-${value}`];
  } else if (prefix === 'shadow') {
    candidates = [`--shadow-${value}`];
  } else if (prefix === 'font') {
    candidates = [`--font-${value}`];
  } else if (prefix === 'text') {
    if (tokenNames.has(`--color-${value}`)) {
      return null;
    }
    candidates = [`--text-${value}`];
  } else if (prefix) {
    candidates = [`--spacing-${value}`];
    if (!tokenNames.has(candidates[0]) && /^\d+(?:\.\d+)?$/.test(value)) {
      candidates = ['--spacing'];
    }
  }
  const explicit = [...utility.matchAll(/--[a-zA-Z][\w-]*/g)].map((item) => item[0]);
  if (explicit.length) {
    candidates = explicit;
  }
  return {
    className,
    tokens: [...new Set(candidates.filter((name) => tokenNames.has(name)))],
    unresolved: !candidates.length || candidates.some((name) => !tokenNames.has(name))
  };
}

function anatomyClasses(node, source) {
  const result = [];
  function visit(item) {
    if (ts.isStringLiteral(item) || ts.isNoSubstitutionTemplateLiteral(item)) {
      for (const word of item.text.split(/\s+/).filter(Boolean)) {
        const fact = utilityAnatomy(word);
        if (fact) {
          result.push(internUtility(fact));
        }
      }
    } else if (ts.isArrayLiteralExpression(item)) {
      item.elements.forEach(visit);
    } else if (ts.isTemplateExpression(item) || ts.isIdentifier(item) || ts.isCallExpression(item)) {
      result.push(internUtility({ className: item.getText(source), tokens: [], unresolved: true }));
    }
  }
  if (node) {
    visit(node);
  }
  return result;
}

function visualAnatomy(file) {
  if (!file) {
    return [];
  }
  const source = program.getSourceFile(file);
  if (!source) {
    return [];
  }
  const result = [];
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'cva') {
      const declaration = node.parent;
      const name =
        ts.isVariableDeclaration(declaration) || ts.isPropertyAssignment(declaration)
          ? declaration.name.getText(source).replace(/^['"]|['"]$/g, '')
          : 'anonymous';
      const recipe = { name, base: anatomyClasses(node.arguments[0], source), variants: {}, compounds: [] };
      const options = node.arguments[1];
      if (options && ts.isObjectLiteralExpression(options)) {
        for (const property of options.properties) {
          if (!ts.isPropertyAssignment(property)) {
            continue;
          }
          const key = property.name.getText(source).replace(/^['"]|['"]$/g, '');
          if (key === 'variants' && ts.isObjectLiteralExpression(property.initializer)) {
            for (const axis of property.initializer.properties) {
              if (!ts.isPropertyAssignment(axis) || !ts.isObjectLiteralExpression(axis.initializer)) {
                continue;
              }
              const values = {};
              for (const value of axis.initializer.properties) {
                if (ts.isPropertyAssignment(value)) {
                  values[value.name.getText(source).replace(/^['"]|['"]$/g, '')] = anatomyClasses(
                    value.initializer,
                    source
                  );
                }
              }
              recipe.variants[axis.name.getText(source).replace(/^['"]|['"]$/g, '')] = values;
            }
          }
          if (key === 'compoundVariants' && ts.isArrayLiteralExpression(property.initializer)) {
            for (const compound of property.initializer.elements) {
              if (!ts.isObjectLiteralExpression(compound)) {
                continue;
              }
              const conditions = {};
              let classes = [];
              for (const field of compound.properties) {
                if (!ts.isPropertyAssignment(field)) {
                  continue;
                }
                const fieldName = field.name.getText(source).replace(/^['"]|['"]$/g, '');
                if (fieldName === 'class' || fieldName === 'className') {
                  classes = anatomyClasses(field.initializer, source);
                } else {
                  conditions[fieldName] = ts.isStringLiteral(field.initializer)
                    ? field.initializer.text
                    : field.initializer.getText(source);
                }
              }
              recipe.compounds.push({ conditions, classes });
            }
          }
        }
      }
      result.push(recipe);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return result.sort((a, b) => compare(a.name, b.name));
}

function surfaceUsage(entry) {
  const directory = `${dirname(entry.file).replaceAll('\\\\', '/')}/`;
  return program
    .getSourceFiles()
    .filter(
      (source) =>
        source.fileName.replaceAll('\\\\', '/').startsWith(directory) && !/\.(?:test|stories)\./.test(source.fileName)
    )
    .flatMap((source) => {
      const found = [];
      function visit(node) {
        if (ts.isCallExpression(node) && node.expression.getText(source) === 'surfaceVariants') {
          found.push({
            source: pathOf(source.fileName),
            arguments: node.arguments.map((arg) => arg.getText(source)).join(', ')
          });
        }
        ts.forEachChild(node, visit);
      }
      visit(source);
      return found;
    })
    .sort((a, b) => compare(a.source, b.source) || compare(a.arguments, b.arguments));
}

const components = publicValues
  .map((entry, index) => {
    const hiddenNames = hidden.get(entry.name.charAt(0).toLowerCase() + entry.name.slice(1)) ?? [];
    const props = Object.values(propsByIndex.get(index) ?? {})
      .filter(
        (prop) =>
          !hiddenNames.includes(prop.name) &&
          (!prop.parent || !entry.types || resolve(prop.parent.fileName) === entry.types)
      )
      .map((prop) => ({
        name: prop.name,
        type: prop.type.name,
        required: prop.required,
        default: prop.defaultValue?.value ?? null,
        description: prop.description,
        deprecated: Boolean(prop.tags?.deprecated)
      }))
      .sort((a, b) => compare(a.name, b.name));
    return {
      name: entry.name,
      package: entry.package,
      source: pathOf(entry.types ?? entry.file),
      props,
      variants: variants(entry.types),
      parts: compoundParts(entry),
      anatomy: visualAnatomy(entry.types),
      surfaceUsage: surfaceUsage(entry)
    };
  })
  .sort((a, b) => compare(a.name, b.name) || compare(a.package, b.package));
const registry = read('skills/_shared/prop-naming.json');
const publicNames = new Set(components.map(({ name }) => name));
const typeMap = new Map();
for (const entry of registry) {
  for (const usage of entry.usages) {
    if (publicNames.has(usage.component)) {
      continue;
    }
    const source = usage.source.path;
    const owners = components.filter((component) => component.source === source);
    const matching = owners
      .filter((component) => usage.component.startsWith(component.name.replace(/s$/, '')))
      .sort((a, b) => b.name.length - a.name.length);
    const symbolOwner = usage.source.symbol.match(/^([A-Za-z0-9]+)Props(?:\.|$)/)?.[1];
    const owner = symbolOwner ?? matching[0]?.name ?? null;
    typeMap.set(usage.component, { name: usage.component, owner, source });
  }
}
const artifact = {
  name: 'egdev-design-system',
  schemaVersion: '1.0.0',
  packages: ['effects', 'tokens', 'ui'].map((name) => {
    const manifest = read(`packages/${name}/package.json`);
    return { name: manifest.name, version: manifest.version };
  }),
  catalog: read('docs/catalog.json')
    .filter(({ destino }) => destino === 'ui' || destino === 'effects')
    .map((row) => ({
      name: row.nombre,
      level: row.nivel,
      package: `@egdev/${row.destino}`,
      radix: row.radix,
      composes: row.compone === '—' ? [] : row.compone.split(' + ').map((item) => item.trim()),
      action: row.accion,
      available: row.nombre
        .split(/\s*\/\s*/)
        .every((name) => components.some((item) => item.name === name && item.package === `@egdev/${row.destino}`))
    }))
    .sort((a, b) => compare(a.name, b.name)),
  components,
  anatomyUtilities,
  types: [...typeMap.values()].sort((a, b) => compare(a.name, b.name)),
  tokens: tokenDeclarations.sort((a, b) => compare(a.name, b.name)),
  materialRecipes: [
    {
      id: 'Elevated surface',
      semantics: 'Tonal raised surface with sheen, edge light and two-layer elevation.',
      tokens: ['--color-surface-1', '--gradient-sheen', '--color-border-hairline', '--shadow-edge', '--shadow-elev-1']
    },
    {
      id: 'Overlay',
      semantics: 'Translucent floating surface with solid reduced-transparency fallback.',
      tokens: [
        '--color-surface-overlay',
        '--blur-overlay',
        '--color-border-hairline-strong',
        '--shadow-edge-strong',
        '--shadow-elev-3',
        '--color-surface-2'
      ]
    },
    { id: 'Well', semantics: 'Recessed fill.', tokens: ['--color-surface-0', '--shadow-well'] }
  ].sort((a, b) => compare(a.id, b.id)),
  propNaming: registry
    .map(({ id, name, status, usages }) => ({
      id,
      name,
      status,
      components: [...new Set(usages.map((usage) => usage.component))].sort(compare)
    }))
    .sort((a, b) => compare(a.id, b.id))
};
const output = `${JSON.stringify(artifact, null, 2)}\n`.replace(
  /^( *)("[^"]+": )\[\n((?:\s+(?:"[^\n]*"|\d+)[,]?\n)+)\1\]/gm,
  (block, indent, key, contents) => {
    const line = `${key}[${contents
      .trim()
      .split('\n')
      .map((item) => item.trim().replace(/,$/, ''))
      .join(', ')}]`;
    return indent.length + line.length <= 120 ? indent + line : block;
  }
);
const path = resolve(root, 'packages/system/design-system.json');
if (process.argv[2] === '--write') {
  writeFileSync(path, output);
} else if (process.argv[2] === '--check') {
  if (readFileSync(path, 'utf8') !== output) {
    console.error('design-system.json is stale; run pnpm artifact --write');
    process.exitCode = 1;
  }
} else {
  console.error('Usage: node scripts/build-artifact.mjs --write|--check');
  process.exitCode = 1;
}
