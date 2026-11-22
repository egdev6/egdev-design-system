// DS046/DS047: relate static JSX classes to app CSS rules. This module uses the guard's injected
// parsers and source-path patterns; it never resolves packages or walks the disk.

/** @typedef {import('./guard.mjs').GuardEngine} GuardEngine */
/** @typedef {import('./guard.mjs').GuardSource} GuardSource */
/** @typedef {import('./guard.mjs').PostcssRule} PostcssRule */
/** @typedef {{ file: string, line: number, snippet: string, component: string, properties: string[] }} AppearanceViolation */
/** @typedef {{ file: string, line: number, snippet: string, component: string, selectors: string[] }} StructuralViolation */
/** @typedef {{ tsx: RegExp, css: RegExp, test: RegExp }} SourcePatterns */
/** @typedef {{ component?: string, ancestor?: string, owned: boolean, internal: boolean }} SelectorState */

/** @type {WeakMap<object, number>} */
export const ruleOffsets = new WeakMap();

const CONDITIONAL_RULES = new Set(['media', 'supports', 'container', 'layer', 'scope', 'starting-style']);
const CSS_LENGTH_UNITS = new Set([
  'px',
  'em',
  'rem',
  'ex',
  'ch',
  'cap',
  'ic',
  'lh',
  'rlh',
  'vw',
  'vh',
  'vi',
  'vb',
  'vmin',
  'vmax',
  'svw',
  'svh',
  'lvw',
  'lvh',
  'dvw',
  'dvh',
  'cqw',
  'cqh',
  'cqi',
  'cqb',
  'cqmin',
  'cqmax',
  'cm',
  'mm',
  'q',
  'in',
  'pt',
  'pc',
  '%'
]);
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
    // PostCSS removes !important from the value; accept only a literal zero and a real length unit or %.
    const zero = value.trim().toLowerCase();
    return zero === '0' || (zero.startsWith('0') && CSS_LENGTH_UNITS.has(zero.slice(1)));
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
export function cssIdentifier(text, start) {
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
 * Split one selector into top-level compounds and the combinator preceding each. Punctuation in
 * strings, comments, attributes, pseudo arguments and CSS escapes does not separate compounds.
 * @param {string} selector
 * @returns {{ text: string, before: string }[]}
 */
function compounds(selector) {
  /** @type {{ text: string, before: string }[]} */
  const parts = [];
  let start = -1;
  let before = '';
  let quote = '';
  let brackets = 0;
  let parentheses = 0;
  /** @param {number} end */
  const flush = (end) => {
    if (start !== -1) {
      parts.push({ text: selector.slice(start, end), before });
      start = -1;
      before = '';
    }
  };
  for (let i = 0; i < selector.length; i++) {
    const char = selector[i] ?? '';
    if (char === '\\') {
      if (start === -1) {
        start = i;
      }
      let count = 0;
      while (count < 6 && /[0-9a-f]/i.test(selector[i + 1] ?? '')) {
        i++;
        count++;
      }
      if (count && /\s/.test(selector[i + 1] ?? '')) {
        i++;
      } else if (!count) {
        i++;
      }
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
    if (
      !brackets &&
      !parentheses &&
      (/\s/.test(char) || char === '>' || char === '+' || char === '~' || char === '|')
    ) {
      flush(i);
      if (/\s/.test(char)) {
        before ||= ' ';
      } else {
        before = char;
      }
      continue;
    }
    if (start === -1) {
      start = i;
    }
    if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '[') {
      brackets++;
    } else if (char === ']' && brackets) {
      brackets--;
    } else if (!brackets && char === '(') {
      parentheses++;
    } else if (!brackets && char === ')' && parentheses) {
      parentheses--;
    }
  }
  flush(selector.length);
  return parts;
}

/** @param {string} text */
function containsNesting(text) {
  let quote = '';
  let brackets = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i] ?? '';
    if (char === '\\') {
      i++;
    } else if (quote) {
      if (char === quote) {
        quote = '';
      }
    } else if (char === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      if (end === -1) {
        return false;
      }
      i = end + 1;
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '[') {
      brackets++;
    } else if (char === ']' && brackets) {
      brackets--;
    } else if (!brackets && char === '&') {
      return true;
    }
  }
  return false;
}

/** Return the selector list after an nth-child formula's `of`, ignoring comments. @param {string} body */
function nthSelectorList(body) {
  for (let i = 0; i < body.length; i++) {
    if (body[i] === '/' && body[i + 1] === '*') {
      const end = body.indexOf('*/', i + 2);
      if (end === -1) {
        return undefined;
      }
      i = end + 1;
    } else if (
      body.slice(i, i + 2).toLowerCase() === 'of' &&
      /\s/.test(body[i - 1] ?? '') &&
      /\s/.test(body[i + 2] ?? '')
    ) {
      return body.slice(i + 2);
    }
  }
  return undefined;
}

/**
 * Extract positive selector-list pseudos from a compound, leaving negative and relational pseudos
 * opaque. Their alternatives describe the subject, unlike :not() and :has().
 * @param {string} text
 * @returns {{ outer: string, lists: string[] }}
 */
function positivePseudos(text) {
  let outer = '';
  /** @type {string[]} */
  const lists = [];
  let start = 0;
  let quote = '';
  let brackets = 0;
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i] ?? '';
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
    if (char === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      if (end === -1) {
        break;
      }
      i = end + 1;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '[') {
      brackets++;
    } else if (char === ']' && brackets) {
      brackets--;
    } else if (!brackets && !depth && char === ':') {
      const prefix = text.slice(i, i + 17).match(/^:(?:is|where|nth-child|nth-last-child)\(/i)?.[0];
      if (!prefix) {
        continue;
      }
      const open = i + prefix.length - 1;
      let end = open;
      let innerDepth = 1;
      let innerQuote = '';
      let innerBrackets = 0;
      while (++end < text.length) {
        const inner = text[end] ?? '';
        if (inner === '\\') {
          end++;
        } else if (innerQuote) {
          if (inner === innerQuote) {
            innerQuote = '';
          }
        } else if (inner === '/' && text[end + 1] === '*') {
          const close = text.indexOf('*/', end + 2);
          if (close === -1) {
            break;
          }
          end = close + 1;
        } else if (inner === '"' || inner === "'") {
          innerQuote = inner;
        } else if (inner === '[') {
          innerBrackets++;
        } else if (inner === ']' && innerBrackets) {
          innerBrackets--;
        } else if (!innerBrackets && inner === '(') {
          innerDepth++;
        } else if (!innerBrackets && inner === ')') {
          innerDepth--;
          if (!innerDepth) {
            break;
          }
        }
      }
      if (innerDepth) {
        break;
      }
      const body = text.slice(open + 1, end);
      const list = prefix.toLowerCase().startsWith(':nth-') ? nthSelectorList(body) : body;
      outer += text.slice(start, i);
      if (list === undefined) {
        outer += text.slice(i, end + 1);
      } else {
        lists.push(list);
      }
      start = end + 1;
      i = end;
    } else if (!brackets && char === '(') {
      depth++;
    } else if (!brackets && char === ')' && depth) {
      depth--;
    }
  }
  return { outer: outer + text.slice(start), lists };
}

/**
 * Extract only literal text from a string or template, leaving template expressions to the caller.
 * @param {import('./guard.mjs').TypeScript} ts
 * @param {import('typescript').Node} node
 * @returns {(import('typescript').StringLiteral | import('typescript').TemplateLiteralLikeNode)[]}
 */
export function staticStringParts(ts, node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return [node];
  }
  if (ts.isTemplateExpression(node)) {
    return [node.head, ...node.templateSpans.map((span) => span.literal)];
  }
  return [];
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
   * @param {Map<GuardSource, import('typescript').SourceFile>} sourceFiles
   * @returns {{ classes: Map<string, string>, appClasses: Set<string> }}
   */
  function collectClasses(files, sourceDirectory, sourceFiles) {
    /** @type {Map<string, string>} */
    const classes = new Map();
    /** @type {Set<string>} */
    const appClasses = new Set();
    const pattern = patterns(sourceDirectory);
    /** @type {Map<string, import('typescript').SourceFile>} */
    const sources = new Map();
    for (const input of files) {
      const parsed = sourceFiles.get(input);
      if (parsed && pattern.tsx.test(input.file) && !pattern.test.test(input.file)) {
        sources.set(`/${input.file}`, parsed);
      }
    }
    if (sources.size === 0) {
      return { classes, appClasses };
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
      /** @param {string} text @param {string | undefined} component */
      const add = (text, component) => {
        for (const name of text.split(/\s+/)) {
          if (name) {
            appClasses.add(name);
            if (component && !classes.has(name)) {
              classes.set(name, component);
            }
          }
        }
      };
      /** @param {import('typescript').Node} node @param {string | undefined} component */
      const addStatic = (node, component) => {
        if (ts.isComputedPropertyName(node) || ts.isTypeNode(node)) {
          return;
        }
        const parts = staticStringParts(ts, node);
        if (ts.isTemplateExpression(node)) {
          add(parts[0]?.text ?? '', component);
          for (const [index, span] of node.templateSpans.entries()) {
            addStatic(span.expression, component);
            add(parts[index + 1]?.text ?? '', component);
          }
        } else if (parts.length) {
          add(parts[0]?.text ?? '', component);
        } else if (ts.isObjectLiteralExpression(node)) {
          for (const property of node.properties) {
            if ('name' in property && property.name && ts.isIdentifier(property.name)) {
              add(property.name.text, component);
            }
            ts.forEachChild(property, (child) => addStatic(child, component));
          }
        } else {
          ts.forEachChild(node, (child) => addStatic(child, component));
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
          for (const attribute of node.attributes.properties) {
            if (!ts.isJsxAttribute(attribute) || attribute.name.getText(source) !== 'className') {
              continue;
            }
            const value = attribute.initializer;
            const owner = imported ? component : undefined;
            if (value && ts.isStringLiteral(value)) {
              add(value.text, owner);
            } else if (value && ts.isJsxExpression(value) && value.expression) {
              addStatic(value.expression, owner);
            }
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
    return { classes, appClasses };
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
        const offset = rule.source?.start?.offset ?? 0;
        const violation = {
          file,
          line: content.slice(0, offset).split('\n').length,
          snippet: normalize(rule.raws.selector?.raw ?? rule.selector),
          component,
          properties
        };
        ruleOffsets.set(violation, offset);
        found.push(violation);
      }
    });
    return found;
  }

  /**
   * Declarations in conditional at-rules belong to their enclosing rule, but declarations in a
   * nested selector do not. This is the same rule boundary DS046 uses for properties.
   * @param {PostcssRule} rule
   */
  function hasDeclarations(rule) {
    const pending = [...(rule.nodes ?? [])];
    while (pending.length) {
      const node = pending.pop();
      if (node?.type === 'decl') {
        return true;
      }
      if (node?.type === 'atrule' && CONDITIONAL_RULES.has(node.name?.toLowerCase() ?? '')) {
        pending.push(...(node.nodes ?? []));
      }
    }
    return false;
  }

  /**
   * @param {GuardSource} source
   * @param {string} themeDirectory
   * @param {string} sourceDirectory
   * @param {Map<string, string>} classes
   * @param {Set<string>} appClasses
   * @returns {StructuralViolation[]}
   */
  function findStructuralViolations({ file, content }, themeDirectory, sourceDirectory, classes, appClasses) {
    if (classes.size === 0 || !patterns(sourceDirectory).css.test(file) || file.startsWith(themeDirectory)) {
      return [];
    }
    /** @type {StructuralViolation[]} */
    const found = [];
    /** @type {WeakMap<PostcssRule, SelectorState[]>} */
    const cache = new WeakMap();
    /** @type {SelectorState} */
    const empty = { owned: false, internal: false };
    /**
     * Keep distinct selector alternatives without expanding nested selector lists exponentially:
     * only their subject ownership and the first qualifying component matter for this check.
     * @param {PostcssRule} rule
     * @returns {SelectorState[]}
     */
    function states(rule) {
      const cached = cache.get(rule);
      if (cached) {
        return cached;
      }
      /** @type {import('./guard.mjs').PostcssContainer | undefined} */
      let parent = rule.parent;
      while (parent && parent.type !== 'rule') {
        parent = parent.parent;
      }
      const parents = parent?.type === 'rule' ? states(/** @type {PostcssRule} */ (parent)) : [empty];
      /** @type {Map<string, SelectorState>} */
      const distinct = new Map();
      for (const selector of postcss.list.comma(rule.selector)) {
        for (const state of selectorStates(selector, parents, parent?.type === 'rule')) {
          distinct.set(JSON.stringify(state), state);
        }
      }
      const result = [...distinct.values()];
      cache.set(rule, result);
      return result;
    }
    /**
     * @param {string} selector
     * @param {SelectorState[]} parents
     * @param {boolean} nested
     * @param {boolean} [implicitParent]
     * @returns {SelectorState[]}
     */
    function selectorStates(selector, parents, nested, implicitParent = true) {
      const parts = compounds(selector).map(({ text, before }) => {
        const { outer, lists } = positivePseudos(text);
        return {
          ...lastCompound(outer),
          before,
          lists,
          parent: lastCompound(text).parent,
          nesting: containsNesting(text)
        };
      });
      const hasParent = parts.some((part) => part.nesting);
      return parents.flatMap((parent) => {
        /** @type {SelectorState[]} */
        let current = [nested && implicitParent && !hasParent ? parent : empty];
        for (const [index, part] of parts.entries()) {
          const combinator = part.before || (nested && implicitParent && !hasParent && index === 0 ? ' ' : '');
          const component =
            part.classes.map((name) => classes.get(name)).find(Boolean) ??
            (part.parent && nested ? parent.component : undefined);
          const owned =
            part.classes.some((name) => appClasses.has(name)) || Boolean(part.parent && nested && parent.owned);
          const internal =
            part.classes.some((name) => name.startsWith('eg-')) || Boolean(part.parent && nested && parent.internal);
          current = current.map((state) => {
            let ancestor = state.ancestor;
            if ((combinator === ' ' || combinator === '>') && state.component) {
              ancestor ||= state.component;
            }
            if (part.parent && nested) {
              ancestor ||= parent.ancestor;
            }
            return { ...(component ? { component } : {}), ...(ancestor ? { ancestor } : {}), owned, internal };
          });
          for (const list of part.lists) {
            const alternatives = postcss.list
              .comma(list)
              .flatMap((item) => selectorStates(item, [parent], nested, false));
            /** @type {Map<string, SelectorState>} */
            const distinct = new Map();
            for (const state of current) {
              for (const alternative of alternatives) {
                const subject = state.component ?? alternative.component;
                const ancestor = state.ancestor ?? alternative.ancestor;
                const combined = {
                  ...(subject ? { component: subject } : {}),
                  ...(ancestor ? { ancestor } : {}),
                  owned: state.owned || alternative.owned,
                  internal: state.internal || alternative.internal
                };
                distinct.set(JSON.stringify(combined), combined);
              }
            }
            current = [...distinct.values()];
          }
        }
        return current;
      });
    }
    postcss.parse(content, { from: file }).walkRules((rule) => {
      if (!hasDeclarations(rule)) {
        return;
      }
      /** @type {import('./guard.mjs').PostcssContainer | undefined} */
      let parent = rule.parent;
      while (parent && parent.type !== 'rule') {
        parent = parent.parent;
      }
      const nested = parent?.type === 'rule';
      const parents = nested ? states(/** @type {PostcssRule} */ (parent)) : [empty];
      const selector = rule.raws.selector?.raw ?? rule.selector;
      /** @type {string[]} */
      const selectors = [];
      let component;
      for (const part of postcss.list.comma(selector)) {
        const match = selectorStates(part, parents, nested).find(
          (state) => state.ancestor && !state.owned && !state.internal
        );
        if (match?.ancestor) {
          selectors.push(normalize(part));
          component ||= match.ancestor;
        }
      }
      if (component) {
        const offset = rule.source?.start?.offset ?? 0;
        const violation = {
          file,
          line: content.slice(0, offset).split('\n').length,
          snippet: normalize(selector),
          component,
          selectors
        };
        ruleOffsets.set(violation, offset);
        found.push(violation);
      }
    });
    return found;
  }

  return { collectClasses, findAppearanceViolations, findStructuralViolations };
}
