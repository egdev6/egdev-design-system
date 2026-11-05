import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import React from 'react';
import docgen from 'react-docgen-typescript';
import { renderToStaticMarkup } from 'react-dom/server';
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

// Only public components actually used as JSX in the implementation are recorded.
// Consumer-supplied slots and indirect runtime composition cannot be inferred here.
function composedOf(entry) {
  const source = program.getSourceFile(entry.file);
  const found = new Map();
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName;
      if (ts.isIdentifier(tag)) {
        const symbol = checker.getSymbolAtLocation(tag);
        const target = symbol?.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
        const match = publicValues.find((item) => item.symbol === target && item.name !== entry.name);
        if (match) {
          found.set(match.name, { name: match.name, source: pathOf(source.fileName) });
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  if (source) {
    visit(source);
  }
  return [...found.values()].sort((a, b) => compare(a.name, b.name));
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

// Layout utilities are extracted separately from the general visual CVA vocabulary.
function layoutUtility(className) {
  const utility = className.replace(/^(?:[^:[\]]+|\[[^\]]+\]):/g, '');
  if (
    !/^(?:max-w-|min-w-|w-|h-|min-h-|max-h-|bg-|grid|col-|row-|flex|items-|justify-|place-|gap-|p[trblxyse]?-|m[trblxyse]?-|space-|block$|hidden$|sticky$|relative$|absolute$|inset-|top-|bottom-|left-|right-|overflow-|isolate$|box-border$)/.test(
      utility
    )
  ) {
    return null;
  }
  const explicit = [...utility.matchAll(/--[a-zA-Z][\w-]*/g)].map((item) => item[0]);
  const spacing = utility.match(/^(?:p[trblxyse]?|m[trblxyse]?|gap(?:-[xy])?)-(\d+(?:\.\d+)?)$/);
  const color = utility.match(/^bg-([\w-]+)(?:\/\d+)?$/);
  const candidates = explicit.length
    ? explicit
    : spacing
      ? [tokenNames.has(`--spacing-${spacing[1]}`) ? `--spacing-${spacing[1]}` : '--spacing']
      : color && !['transparent', 'none'].includes(color[1])
        ? [`--color-${color[1]}`]
        : [];
  return {
    className,
    tokens: [...new Set(candidates.filter((name) => tokenNames.has(name)))],
    unresolved: candidates.some((name) => !tokenNames.has(name)) || (!candidates.length && /\[/.test(utility))
  };
}

function anatomyClasses(node, source, layout = false) {
  const result = [];
  function visit(item) {
    if (ts.isStringLiteral(item) || ts.isNoSubstitutionTemplateLiteral(item)) {
      for (const word of item.text.split(/\s+/).filter(Boolean)) {
        const fact = utilityAnatomy(word) ?? (layout ? layoutUtility(word) : null);
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

function visualAnatomy(file, layout = false) {
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
      const recipe = { name, base: anatomyClasses(node.arguments[0], source, layout), variants: {}, compounds: [] };
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
                    source,
                    layout
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
                  classes = anatomyClasses(field.initializer, source, layout);
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

// CSS facts keep their surrounding selectors/at-rules; this is not a computed cascade.
function layoutStylesheet(file) {
  if (!existsSync(file)) {
    return [];
  }
  const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const result = [];
  const scopes = [];
  let start = 0;
  let quote = '';
  let parens = 0;
  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    if (quote) {
      if (char === quote && css[i - 1] !== '\\') {
        quote = '';
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '(') {
      parens++;
    }
    if (char === ')') {
      parens--;
    }
    if (parens) {
      continue;
    }
    if (char === '{') {
      scopes.push(css.slice(start, i).trim());
      start = i + 1;
    } else if (char === ';' || char === '}') {
      const declaration = css.slice(start, i).trim();
      const match = declaration.match(
        /^(width|height|min-width|max-width|min-height|max-height|padding(?:-[\w-]+)?|margin(?:-[\w-]+)?|gap|row-gap|column-gap|background(?:-[\w-]+)?|grid(?:-[\w-]+)?|display|flex(?:-[\w-]+)?|align-[\w-]+|justify-[\w-]+|place-[\w-]+|position|inset(?:-[\w-]+)?|top|left|right|bottom)\s*:\s*([\s\S]+)$/
      );
      if (match) {
        const expression = `${scopes.join(' > ')} { ${declaration}; }`;
        const refs = [...match[2].matchAll(/var\(\s*(--[\w-]+)/g)].map((item) => item[1]);
        result.push({
          source: pathOf(file),
          expression,
          classes: [
            internUtility({
              className: declaration,
              tokens: [...new Set(refs.filter((name) => tokenNames.has(name)))],
              unresolved: refs.some((name) => !tokenNames.has(name))
            })
          ]
        });
      }
      if (char === '}') {
        scopes.pop();
      }
      start = i + 1;
    }
  }
  return result;
}

// Record literal JSX slot expressions and hook slot arrays as source, not runtime claims.
// Non-CVA class expressions and custom properties are retained when they cannot be evaluated.
function layoutAnatomy(entry) {
  if (!/\/templates\//.test(entry.file) && !/\/organisms\/[^/]*section[^/]*\//.test(entry.file)) {
    return [];
  }
  const directory = `${dirname(entry.file)}/`;
  const result = layoutStylesheet(resolve(dirname(entry.file), `${basename(dirname(entry.file))}.css`));
  const unresolved = (node, source) => internUtility({ className: node.getText(source), tokens: [], unresolved: true });
  for (const source of program
    .getSourceFiles()
    .filter((item) => item.fileName.startsWith(directory) && !/\.(?:test|stories)\./.test(item.fileName))) {
    function visit(node) {
      if (
        (ts.isJsxExpression(node) &&
          node.expression &&
          (ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent))) ||
        (ts.isPropertyAssignment(node) &&
          node.name.getText(source) === 'slots' &&
          ts.isArrayLiteralExpression(node.initializer))
      ) {
        result.push({
          source: pathOf(source.fileName),
          expression: node.getText(source).replace(/\s+/g, ' '),
          classes: []
        });
      } else if (
        ts.isJsxAttribute(node) &&
        node.name.getText(source) === 'className' &&
        node.initializer &&
        ts.isStringLiteral(node.initializer)
      ) {
        const classes = anatomyClasses(node.initializer, source, true);
        if (classes.length) {
          result.push({ source: pathOf(source.fileName), expression: node.getText(source), classes });
        }
      } else if (
        ts.isJsxAttribute(node) &&
        node.name.getText(source) === 'className' &&
        node.initializer &&
        ts.isJsxExpression(node.initializer) &&
        node.initializer.expression
      ) {
        result.push({
          source: pathOf(source.fileName),
          expression: node.getText(source),
          classes: [unresolved(node.initializer.expression, source)]
        });
      } else if (
        ts.isPropertyAssignment(node) &&
        node.name.getText(source) === 'className' &&
        !(ts.isCallExpression(node.initializer) && node.initializer.expression.getText(source) === 'cn')
      ) {
        const value = node.initializer;
        const classes =
          ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)
            ? anatomyClasses(value, source, true)
            : [unresolved(value, source)];
        if (classes.length) {
          result.push({ source: pathOf(source.fileName), expression: node.getText(source), classes });
        }
      } else if (
        ts.isPropertyAssignment(node) &&
        /^--eg-/.test(node.name.getText(source).replace(/^[\['"]+|[\]'" ]+$/g, ''))
      ) {
        const expression = node.getText(source);
        const refs = [...expression.matchAll(/--[\w-]+/g)].map((item) => item[0]);
        result.push({
          source: pathOf(source.fileName),
          expression,
          classes: [
            internUtility({
              className: expression,
              tokens: [...new Set(refs.filter((name) => tokenNames.has(name)))],
              unresolved:
                !(
                  ts.isStringLiteral(node.initializer) ||
                  ts.isNoSubstitutionTemplateLiteral(node.initializer) ||
                  ts.isNumericLiteral(node.initializer)
                ) || refs.slice(1).some((name) => !tokenNames.has(name))
            })
          ]
        });
      } else if (ts.isCallExpression(node) && node.expression.getText(source) === 'cn') {
        const classes = node.arguments.flatMap((arg) =>
          ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg)
            ? anatomyClasses(arg, source, true)
            : [unresolved(arg, source)]
        );
        if (classes.length) {
          result.push({
            source: pathOf(source.fileName),
            expression: node.getText(source).replace(/\s+/g, ' '),
            classes
          });
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  return result;
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
      composedOf: composedOf(entry),
      anatomy: visualAnatomy(
        entry.types,
        /\/templates\//.test(entry.file) || /\/organisms\/[^/]*section[^/]*\//.test(entry.file)
      ),
      layout: layoutAnatomy(entry),
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
// Representative roles are anchored to named source recipes, not inferred CSS inheritance.
function typographyRoles() {
  const text = 'packages/ui/src/primitives/text/types.ts';
  const specs = [
    ['Heading section', text, 'headingVariants', 'titleRootClasses', 'section'],
    ['Heading hero', text, 'headingVariants', 'titleRootClasses', 'hero'],
    ['Heading show', text, 'headingVariants', 'titleRootClasses', 'show'],
    ['Heading display', text, 'headingVariants', 'titleRootClasses', 'display'],
    ['Eyebrow', text, 'textVariants', 'textVariantClasses', 'eyebrow'],
    ['SectionHeader lede', 'packages/ui/src/molecules/section-header/types.ts', 'sectionHeaderLedeVariants'],
    ['Hero lede', 'packages/ui/src/organisms/hero/types.ts', 'heroLedeVariants'],
    ['ProjectCard code', 'packages/ui/src/molecules/project-card/types.ts', 'projectCardCodeVariants']
  ];
  return specs
    .map(([name, sourcePath, recipe, object, property]) => {
      const source = program.getSourceFile(resolve(root, sourcePath));
      const declarations = new Map();
      function visit(node) {
        if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
          declarations.set(node.name.text, node.initializer);
        }
        ts.forEachChild(node, visit);
      }
      visit(source);
      const call = declarations.get(recipe);
      const base =
        call && ts.isCallExpression(call) && ts.isStringLiteral(call.arguments[0]) ? call.arguments[0].text : '';
      let extra = '';
      let initializer = declarations.get(object);
      while (initializer && (ts.isAsExpression(initializer) || ts.isSatisfiesExpression(initializer))) {
        initializer = initializer.expression;
      }
      if (initializer && ts.isObjectLiteralExpression(initializer)) {
        const field = initializer.properties.find(
          (item) => ts.isPropertyAssignment(item) && item.name.getText(source) === property
        );
        if (field && ts.isStringLiteral(field.initializer)) {
          extra = field.initializer.text;
        }
      }
      const classes = `${base} ${extra}`.split(/\s+/);
      const familyClass = classes.find((item) => /^font-(display|sans|mono)$/.test(item));
      const family = familyClass ? `--${familyClass}` : null;
      const sizeClass = classes.find(
        (item) => item.startsWith('text-') && tokenNames.has(`--${item}`) && tokenNames.has(`--${item}--line-height`)
      );
      const size = sizeClass ? `--${sizeClass}` : null;
      const token = (suffix) => (size && tokenNames.has(`${size}--${suffix}`) ? `${size}--${suffix}` : null);
      return {
        name,
        source: sourcePath,
        family: tokenNames.has(family) ? family : null,
        size,
        lineHeight: token('line-height'),
        weight: token('font-weight'),
        tracking: token('letter-spacing')
      };
    })
    .sort((a, b) => compare(a.name, b.name));
}

// Compile the actual Logo source in memory so --check observes source changes, not a stale build.
// Resolve the small, explicit source graph without writing build products into the worktree.
async function logoAssets() {
  const directory = 'packages/ui/src/atoms/logo/';
  const require = createRequire(resolve(root, 'packages/ui/package.json'));
  const moduleUrl = (code) => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
  const compile = (path, imports) => {
    let code = ts.transpileModule(readFileSync(resolve(root, path), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX }
    }).outputText;
    for (const [specifier, url] of Object.entries(imports)) {
      code = code.replaceAll(`from '${specifier}'`, `from '${url}'`).replaceAll(`from "${specifier}"`, `from "${url}"`);
    }
    return moduleUrl(code);
  };
  const external = (name) => {
    const url = pathToFileURL(require.resolve(name)).href;
    const names = { 'class-variance-authority': ['cva'], clsx: ['clsx'], 'tailwind-merge': ['extendTailwindMerge'] }[
      name
    ];
    return names
      ? moduleUrl(
          `import value from '${url}'; ${names.map((item) => `export const ${item} = value.${item};`).join(' ')}`
        )
      : url;
  };
  const cn = compile('packages/ui/src/lib/cn.ts', {
    clsx: external('clsx'),
    'tailwind-merge': external('tailwind-merge')
  });
  const artwork = compile(`${directory}logo-artwork.ts`, {});
  const types = compile(`${directory}types.ts`, { 'class-variance-authority': external('class-variance-authority') });
  const hook = compile(`${directory}useLogo.ts`, { '@/lib/cn': cn, './logo-artwork': artwork, './types': types });
  const component = compile(`${directory}Logo.tsx`, {
    './useLogo': hook,
    'react/jsx-runtime': external('react/jsx-runtime')
  });
  const { Logo } = await import(component);
  const { logoInkClasses } = await import(types);
  const inks = Object.fromEntries(
    Object.values(logoInkClasses).map((className) => {
      const direct = className.match(/^fill-\((--[\w-]+)\)$/);
      const named = className.match(/^fill-([\w-]+)$/);
      const token = direct?.[1] ?? (named ? `--color-${named[1]}` : null);
      if (!token || !tokenNames.has(token)) {
        throw new Error(`Unresolved Logo ink: ${className}`);
      }
      return [className, token];
    })
  );
  const sources = ['Logo.tsx', 'useLogo.ts', 'logo-artwork.ts', 'types.ts'].map((name) => `${directory}${name}`);
  return ['mark', 'wordmark'].map((variant) => {
    const rendered = renderToStaticMarkup(React.createElement(Logo, { variant }));
    let svg = rendered.slice(rendered.indexOf('<svg'), rendered.indexOf('</svg>') + 6);
    const tokens = new Set();
    svg = svg.replace(/<svg[^>]*>/, (tag) =>
      tag
        .replace(/ class="[^"]*"/, '')
        .replace(' aria-hidden="true" focusable="false"', ' role="img" aria-label="egdev"')
    );
    svg = svg.replace(/ class="([^"]+)"/g, (_, className) => {
      const token = inks[className];
      if (!token) {
        throw new Error(`Unresolved Logo shape class: ${className}`);
      }
      tokens.add(token);
      return ` fill="var(${token})"`;
    });
    return {
      component: 'Logo',
      variant,
      sources,
      tokens: [...tokens].sort(compare),
      svgGzipBase64: gzipSync(svg).toString('base64')
    };
  });
}

// Curated recommendations are checked against the same public export set as the artifact.
function compositionRecipes() {
  const recipes = read('packages/system/src/composition-recipes.json');
  const names = new Set(components.filter((entry) => entry.package === '@egdev/ui').map((entry) => entry.name));
  for (const recipe of recipes) {
    for (const name of recipe.components) {
      if (!names.has(name)) {
        throw new Error(`Non-exported component: ${name}`);
      }
    }
  }
  return recipes;
}

const artifact = {
  name: 'egdev-design-system',
  assets: await logoAssets(),
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
  typographyRoles: typographyRoles(),
  compositionRecipes: compositionRecipes(),
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
