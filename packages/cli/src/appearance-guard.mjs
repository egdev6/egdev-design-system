// DS046: relate static classes on @egdev/ui JSX elements to app CSS rules. This module uses the
// guard's injected parsers and source-path patterns; it never resolves packages or walks the disk.

/** @typedef {import('./guard.mjs').GuardEngine} GuardEngine */
/** @typedef {import('./guard.mjs').GuardSource} GuardSource */
/** @typedef {import('./guard.mjs').PostcssRule} PostcssRule */
/** @typedef {{ file: string, line: number, snippet: string, component: string, properties: string[] }} AppearanceViolation */
/** @typedef {{ tsx: RegExp, css: RegExp, test: RegExp }} SourcePatterns */

const CONDITIONAL_RULES = new Set(['media', 'supports', 'container', 'layer', 'scope', 'starting-style']);
const PLACEMENT = new Set([
  'margin',
  'align-self',
  'justify-self',
  'place-self',
  'flex',
  'flex-grow',
  'flex-shrink',
  'flex-basis',
  'order',
  'grid-area'
]);

/** @param {string} property @param {string} value */
function isPlacement(property, value) {
  const name = property.toLowerCase();
  if (name === 'min-width' || name === 'min-height') {
    // PostCSS removes !important from the value; accept only a literal zero and optional unit.
    return /^0(?:[a-z]+|%)?$/i.test(value.trim());
  }
  return (
    name.startsWith('--') ||
    PLACEMENT.has(name) ||
    name.startsWith('margin-') ||
    name.startsWith('grid-column') ||
    name.startsWith('grid-row')
  );
}

/**
 * Read a CSS identifier, decoding escapes so `.some\\:class` matches `some:class` in JSX. Stop
 * without consuming selector punctuation. Hex escapes may include one terminating whitespace.
 * @param {string} text
 * @param {number} start
 * @returns {{ value: string, end: number }}
 */
function cssIdentifier(text, start) {
  let value = '';
  let i = start;
  while (i < text.length) {
    const char = text[i] ?? '';
    if (char === '\\') {
      i++;
      let hex = '';
      while (hex.length < 6 && i < text.length && /[0-9a-f]/i.test(text[i] ?? '')) {
        hex += text[i++];
      }
      if (hex) {
        const code = Number.parseInt(hex, 16);
        value +=
          code === 0 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff) ? '\ufffd' : String.fromCodePoint(code);
        if (/\s/.test(text[i] ?? '')) {
          i++;
        }
      } else if (i < text.length) {
        value += text[i++];
      }
    } else if (/[a-z0-9_-]/i.test(char) || char.charCodeAt(0) >= 0x80) {
      value += char;
      i++;
    } else {
      break;
    }
  }
  return { value, end: i };
}

/** @typedef {{ classes: string[], alternatives: string[], parent: boolean, alternativeParent: boolean, ignored: boolean }} SelectorFrame */

/**
 * Extract subject classes from the last compound, ignoring strings, comments, attributes and
 * pseudos such as :has() and :not() that do not positively identify the subject. Selector-list
 * pseudos :is(), :where() and :nth-child(... of ...) can identify the subject; an `&` refers to the enclosing rule.
 * @param {string} selector one selector, not a comma list
 * @returns {{ classes: string[], parent: boolean }}
 */
function lastCompound(selector) {
  /** @type {SelectorFrame[]} */
  const frames = [{ classes: [], alternatives: [], parent: false, alternativeParent: false, ignored: false }];
  let quote = '';
  let brackets = 0;
  for (let i = 0; i < selector.length; i++) {
    const char = selector[i] ?? '';
    if (char === '\\') {
      i++;
      continue;
    }
    if (quote) {
      if (char === quote) {
        quote = '';
      }
      continue;
    }
    if (char === '/' && selector[i + 1] === '*') {
      const end = selector.indexOf('*/', i + 2);
      if (end === -1) {
        break;
      }
      i = end + 1;
      continue;
    }
    const frame = frames[frames.length - 1];
    if (!frame) {
      break;
    }
    if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '[') {
      brackets++;
    } else if (char === ']' && brackets) {
      brackets--;
    } else if (!brackets && char === '(') {
      let start = i - 1;
      while (start >= 0 && /[a-z-]/i.test(selector[start] ?? '')) {
        start--;
      }
      const name = selector.slice(start + 1, i).toLowerCase();
      const subjectPseudo = selector[start] === ':' && ['is', 'where', 'nth-child', 'nth-last-child'].includes(name);
      frames.push({
        classes: [],
        alternatives: [],
        parent: false,
        alternativeParent: false,
        ignored: frame.ignored || !subjectPseudo
      });
    } else if (!brackets && char === ')' && frames.length > 1) {
      const child = frames.pop();
      const outer = frames[frames.length - 1];
      if (child && outer && !child.ignored) {
        outer.classes.push(...child.alternatives, ...child.classes);
        outer.parent ||= child.alternativeParent || child.parent;
      }
    } else if (!brackets && !frame.ignored) {
      if (char === ',') {
        frame.alternatives.push(...frame.classes);
        frame.alternativeParent ||= frame.parent;
        frame.classes = [];
        frame.parent = false;
      } else if (/\s/.test(char) || char === '>' || char === '+' || char === '~' || char === '|') {
        frame.classes = [];
        frame.parent = false;
      } else if (char === '&') {
        frame.parent = true;
      } else if (char === '.') {
        const identifier = cssIdentifier(selector, i + 1);
        if (identifier.value) {
          frame.classes.push(identifier.value);
          i = identifier.end - 1;
        }
      }
    }
  }
  const root = frames[0];
  return { classes: root?.classes ?? [], parent: root?.parent ?? false };
}

/**
 * @param {GuardEngine} engine
 * @param {(sourceDirectory: string) => SourcePatterns} patterns
 * @param {(text: string) => string} normalize
 */
export function createAppearanceGuard({ ts, postcss }, patterns, normalize) {
  /**
   * @param {readonly GuardSource[]} files
   * @param {string} sourceDirectory
   * @returns {Map<string, string>} class to the first JSX component using it
   */
  function collectClasses(files, sourceDirectory) {
    /** @type {Map<string, string>} */
    const classes = new Map();
    const pattern = patterns(sourceDirectory);
    const sources = new Map(
      files
        .filter(({ file }) => pattern.tsx.test(file) && !pattern.test.test(file))
        .map(({ file, content }) => {
          const name = `/${file}`;
          return [name, ts.createSourceFile(name, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)];
        })
    );
    if (sources.size === 0) {
      return classes;
    }
    // An in-memory, no-resolution program distinguishes imports from local shadowing. It cannot
    // read the consumer's filesystem or load its types, and uses the source files already parsed.
    /** @type {import('typescript').CompilerHost} */
    const host = {
      getSourceFile: (name) => sources.get(name),
      getDefaultLibFileName: () => '',
      writeFile: () => {
        throw new Error('DS046 is read-only.');
      },
      getCurrentDirectory: () => '/',
      getDirectories: () => [],
      fileExists: (name) => sources.has(name),
      readFile: (name) => sources.get(name)?.text,
      directoryExists: () => false,
      getCanonicalFileName: (name) => name,
      useCaseSensitiveFileNames: () => true,
      getNewLine: () => '\n'
    };
    const program = ts.createProgram([...sources.keys()], { noLib: true, noResolve: true, types: [] }, host);
    const checker = program.getTypeChecker();
    for (const source of sources.values()) {
      /** @type {Set<import('typescript').Symbol>} */
      const named = new Set();
      /** @type {Set<import('typescript').Symbol>} */
      const namespaces = new Set();
      for (const statement of source.statements) {
        if (
          !ts.isImportDeclaration(statement) ||
          !ts.isStringLiteral(statement.moduleSpecifier) ||
          statement.moduleSpecifier.text !== '@egdev/ui' ||
          statement.importClause?.isTypeOnly
        ) {
          continue;
        }
        const bindings = statement.importClause?.namedBindings;
        if (bindings && ts.isNamespaceImport(bindings)) {
          const symbol = checker.getSymbolAtLocation(bindings.name);
          if (symbol) {
            namespaces.add(symbol);
          }
        } else if (bindings && ts.isNamedImports(bindings)) {
          for (const binding of bindings.elements) {
            const symbol = checker.getSymbolAtLocation(binding.name);
            if (!binding.isTypeOnly && symbol) {
              named.add(symbol);
            }
          }
        }
      }
      /** @param {string} text @param {string} component */
      const add = (text, component) => {
        for (const name of text.split(/\s+/)) {
          if (name && !classes.has(name)) {
            classes.set(name, component);
          }
        }
      };
      /** @param {import('typescript').Expression} expression @param {string} component */
      const addStatic = (expression, component) => {
        if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
          add(expression.text, component);
        } else if (ts.isTemplateExpression(expression)) {
          add(expression.head.text, component);
          for (const span of expression.templateSpans) {
            add(span.literal.text, component);
          }
        } else if (ts.isCallExpression(expression)) {
          for (const argument of expression.arguments) {
            addStatic(argument, component);
          }
        } else if (
          ts.isParenthesizedExpression(expression) ||
          ts.isAsExpression(expression) ||
          ts.isSatisfiesExpression(expression) ||
          ts.isNonNullExpression(expression)
        ) {
          addStatic(expression.expression, component);
        }
      };
      /** @param {import('typescript').Node} node */
      const visit = (node) => {
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
          const tag = node.tagName;
          const component = tag.getText(source);
          const identifier = ts.isIdentifier(tag)
            ? tag
            : ts.isPropertyAccessExpression(tag) && ts.isIdentifier(tag.expression)
              ? tag.expression
              : undefined;
          const symbol = identifier ? checker.getSymbolAtLocation(identifier) : undefined;
          const imported = symbol && (ts.isIdentifier(tag) ? named.has(symbol) : namespaces.has(symbol));
          if (imported) {
            for (const attribute of node.attributes.properties) {
              if (!ts.isJsxAttribute(attribute) || attribute.name.getText(source) !== 'className') {
                continue;
              }
              const value = attribute.initializer;
              if (value && ts.isStringLiteral(value)) {
                add(value.text, component);
              } else if (value && ts.isJsxExpression(value) && value.expression) {
                addStatic(value.expression, component);
              }
            }
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
    return classes;
  }

  /**
   * @param {PostcssRule} rule
   * @param {Map<string, string>} classes
   * @returns {string | undefined}
   */
  function matchedComponent(rule, classes) {
    /** @type {PostcssRule | undefined} */
    let current = rule;
    while (current) {
      let usesParent = false;
      for (const selector of postcss.list.comma(current.selector)) {
        const compound = lastCompound(selector);
        for (const name of compound.classes) {
          const component = classes.get(name);
          if (component) {
            return component;
          }
        }
        usesParent ||= compound.parent;
      }
      if (!usesParent) {
        return undefined;
      }
      /** @type {import('./guard.mjs').PostcssContainer | undefined} */
      let parent = current.parent;
      while (parent && parent.type !== 'rule') {
        parent = parent.parent;
      }
      current = parent?.type === 'rule' ? /** @type {PostcssRule} */ (parent) : undefined;
    }
    return undefined;
  }

  /**
   * Include declarations inside conditional at-rules belonging to this rule, but not declarations
   * of nested selectors: each nested selector is checked independently by postcss.walkRules.
   * @param {PostcssRule} rule
   * @returns {string[]}
   */
  function offendingProperties(rule) {
    /** @type {Set<string>} */
    const properties = new Set();
    const pending = [...(rule.nodes ?? [])].reverse();
    while (pending.length) {
      const node = pending.pop();
      if (!node) {
        continue;
      }
      if (node.type === 'decl' && typeof node.prop === 'string' && !isPlacement(node.prop, node.value ?? '')) {
        properties.add(node.prop);
      } else if (node.type === 'atrule' && CONDITIONAL_RULES.has(node.name?.toLowerCase() ?? '')) {
        pending.push(...[...(node.nodes ?? [])].reverse());
      }
    }
    return [...properties];
  }

  /**
   * @param {GuardSource} source
   * @param {string} themeDirectory
   * @param {string} sourceDirectory
   * @param {Map<string, string>} classes
   * @returns {AppearanceViolation[]}
   */
  function findAppearanceViolations({ file, content }, themeDirectory, sourceDirectory, classes) {
    if (classes.size === 0 || !patterns(sourceDirectory).css.test(file) || file.startsWith(themeDirectory)) {
      return [];
    }
    /** @type {AppearanceViolation[]} */
    const found = [];
    postcss.parse(content, { from: file }).walkRules((rule) => {
      const properties = offendingProperties(rule);
      if (!properties.length) {
        return;
      }
      const component = matchedComponent(rule, classes);
      if (component) {
        found.push({
          file,
          line: content.slice(0, rule.source?.start?.offset ?? 0).split('\n').length,
          snippet: normalize(rule.raws.selector?.raw ?? rule.selector),
          component,
          properties
        });
      }
    });
    return found;
  }

  return { collectClasses, findAppearanceViolations };
}
