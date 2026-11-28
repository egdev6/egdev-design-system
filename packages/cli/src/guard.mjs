// The design-system guard, moved from the egdev-design-system skill (assets/guard/
// design-system-guard.ts) with DS040–DS045 parity, and extended for DS046–DS048. `typescript` and
// `postcss` are injected from the consumer project (Q4); the tree follows `sourceDirectory`.
import { createAppearanceGuard, ruleOffsets } from './appearance-guard.mjs';
import { createDomGuard } from './dom-guard.mjs';

/** @typedef {typeof import('typescript')} TypeScript */
/** @typedef {import('typescript').Node} TsNode */
/** @typedef {import('typescript').JsxOpeningElement | import('typescript').JsxSelfClosingElement} JsxTag */

/**
 * The part of the postcss API the guard uses, typed here so the CLI needs no postcss types.
 * @typedef {{ type: string, parent?: PostcssContainer }} PostcssContainer
 * @typedef {{ type: string, name?: string, prop?: string, value?: string, nodes?: PostcssNode[] }} PostcssNode
 * @typedef {{
 *   type: string,
 *   selector: string,
 *   raws: { selector?: { raw?: string } },
 *   source?: { start?: { offset?: number } },
 *   parent?: PostcssContainer,
 *   nodes?: PostcssNode[]
 * }} PostcssRule
 * @typedef {{
 *   parse: (css: string, options: { from: string }) => { walkRules: (callback: (rule: PostcssRule) => void) => unknown },
 *   list: { comma: (value: string) => string[] }
 * }} Postcss
 */

/** @typedef {{ ts: TypeScript, postcss: Postcss }} GuardEngine */
/** @typedef {{ file: string, content: string }} GuardSource */
/**
 * An exact, whitespace-normalized opening tag, CSS selector or DOM query string, not a regex. Non-guarded
 * markup awaiting a DS capability is tracked by its opening tag and TODO (`kind: 'component-gap'`).
 * Declared once in the package's public type entry (S6, #488); doctor validates the same shape (DS042).
 * @typedef {import('../types/index.d.ts').GuardAllowlistEntry} GuardAllowlistEntry
 */
/** @typedef {{ file: string, line: number, snippet: string }} GuardViolation */
/** @typedef {{ violations: GuardViolation[], appearanceViolations: import('./appearance-guard.mjs').AppearanceViolation[], structuralViolations?: import('./appearance-guard.mjs').StructuralViolation[], domViolations?: import('./dom-guard.mjs').DomViolation[], errors: string[], pendingIssueCount: number }} GuardResult */
/**
 * `localRepo`: repository name used for local issue references (`<localRepo>#N`, `<localRepo>#TBD-slug`).
 * `themeDirectory`: app theme layer, the only place where CSS may target DS internals.
 * `sourceDirectory`: guarded tree, without a trailing slash.
 * `classNameAllows`: per-component properties supplied by the consumer's installed system artifact, keyed
 * `<package>:<export>` (`allowanceKey`) so an allowance applies only to imports from its own package.
 * @typedef {{ localRepo?: string, themeDirectory?: string, sourceDirectory?: string, classNameAllows?: ReadonlyMap<string, ReadonlySet<string>> }} GuardOptions
 */

/** @param {string} text */
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** @param {string} text */
const normalize = (text) => text.trim().replace(/\s+/g, ' ');

/**
 * Only inspect selector syntax, not comments, strings or attribute values containing `.eg-`.
 * @param {string} selector
 */
function targetsInternal(selector) {
  for (let i = 0; i < selector.length; i++) {
    if (selector[i] === '\\') {
      i++;
      continue;
    }
    if (selector[i] === '/' && selector[i + 1] === '*') {
      const end = selector.indexOf('*/', i + 2);
      if (end === -1) {
        return false;
      }
      i = end + 1;
      continue;
    }
    if (selector[i] === '"' || selector[i] === "'") {
      const quote = selector[i];
      while (++i < selector.length) {
        if (selector[i] === '\\') {
          i++;
        } else if (selector[i] === quote) {
          break;
        }
      }
      continue;
    }
    if (selector[i] === '[') {
      const start = i;
      let quote = '';
      while (++i < selector.length) {
        if (selector[i] === '\\') {
          i++;
        } else if (quote && selector[i] === quote) {
          quote = '';
        } else if (!quote && (selector[i] === '"' || selector[i] === "'")) {
          quote = selector[i] ?? '';
        } else if (!quote && selector[i] === ']') {
          break;
        }
      }
      const attribute = selector.slice(start, i + 1);
      if (/^\[\s*role\s*=\s*(?:'tab'|"tab"|tab)\s*\]$/i.test(attribute)) {
        return true;
      }
      continue;
    }
    if (selector.startsWith('.eg-', i)) {
      return true;
    }
  }
  return false;
}

/**
 * @param {GuardEngine} engine
 * @returns {{ checkDesignSystem: (files: readonly GuardSource[], allowlist: readonly GuardAllowlistEntry[], options?: GuardOptions) => GuardResult }}
 */
export function createGuard({ ts, postcss }) {
  // Radix Slot composition documented by the DS (for example ListItem editorial `asChild` with one
  // anchor child): the raw element is the only JSX child of a component that sets `asChild` to true.
  /** @param {JsxTag} node */
  function isSlotChild(node) {
    const element = ts.isJsxOpeningElement(node) ? node.parent : node;
    const parent = element.parent;
    if (!parent || !ts.isJsxElement(parent)) {
      return false;
    }
    const opening = parent.openingElement;
    if (!/^[A-Z]/.test(opening.tagName.getText())) {
      return false;
    }
    const asChild = opening.attributes.properties.find(
      /** @returns {attribute is import('typescript').JsxAttribute} */
      (attribute) => ts.isJsxAttribute(attribute) && attribute.name.getText() === 'asChild'
    );
    if (!asChild) {
      return false;
    }
    const value = asChild.initializer;
    if (value && !(ts.isJsxExpression(value) && value.expression?.kind === ts.SyntaxKind.TrueKeyword)) {
      return false;
    }
    const children = parent.children.filter((child) => !(ts.isJsxText(child) && child.containsOnlyTriviaWhiteSpaces));
    return children.length === 1 && children[0] === element;
  }

  /** @param {string} sourceDirectory */
  const patterns = (sourceDirectory) => {
    const root = escapeRegExp(sourceDirectory);
    return {
      tsx: new RegExp(`^${root}\\/.+\\.tsx$`),
      css: new RegExp(`^${root}\\/.+\\.css$`),
      test: /(?:^|\/)__tests__\/|\.(?:test|spec)\.tsx$/,
      code: new RegExp(`^${root}\\/.+\\.tsx?$`),
      codeTest: /(?:^|\/)__tests__\/|\.(?:test|spec)\.tsx?$/
    };
  };

  const { collectClasses, findAppearanceViolations, findStructuralViolations } = createAppearanceGuard(
    { ts, postcss },
    patterns,
    normalize
  );
  const { findDomViolations } = createDomGuard(ts, patterns, normalize);

  /**
   * @param {GuardSource} input
   * @param {string} themeDirectory
   * @param {string} sourceDirectory
   * @param {import('typescript').SourceFile | undefined} source
   * @param {ReadonlySet<import('typescript').SourceFile>} proseSources files that render `Prose` (S1, #580)
   * @returns {GuardViolation[]}
   */
  function findViolations(input, themeDirectory, sourceDirectory, source, proseSources) {
    const { file, content } = input;
    /** @type {GuardViolation[]} */
    const found = [];
    /**
     * @param {number} offset
     * @param {string} snippet
     * @param {number} [ruleOffset]
     */
    const add = (offset, snippet, ruleOffset) => {
      const violation = {
        file,
        line: content.slice(0, offset).split('\n').length,
        snippet: normalize(snippet)
      };
      if (ruleOffset !== undefined) {
        ruleOffsets.set(violation, ruleOffset);
      }
      found.push(violation);
    };
    const pattern = patterns(sourceDirectory);
    if (source && pattern.tsx.test(file) && !pattern.test.test(file)) {
      // S1 (#580): the bare anchor is a supported child of Prose, which styles it at the reading size; DS `Link`
      // would read smaller there. The rendered tree is unknown, so the unit is the file that renders `Prose`.
      const anchorsExempt = proseSources.has(source);
      /** @param {TsNode} node */
      const visit = (node) => {
        if (
          (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
          ts.isIdentifier(node.tagName) &&
          ['button', 'input', 'a', 'label'].includes(node.tagName.text) &&
          !isSlotChild(node) &&
          !(anchorsExempt && node.tagName.text === 'a')
        ) {
          add(node.getStart(source), node.getText(source));
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    } else if (pattern.css.test(file) && !file.startsWith(themeDirectory)) {
      postcss.parse(content, { from: file }).walkRules((rule) => {
        const selector = rule.raws.selector?.raw ?? rule.selector;
        let cursor = 0;
        for (const part of postcss.list.comma(selector)) {
          const start = selector.indexOf(part, cursor);
          cursor = start + part.length;
          if (part && targetsInternal(part)) {
            const offset = rule.source?.start?.offset ?? 0;
            add(offset + start, part, offset);
          }
        }
      });
    }
    return found;
  }

  /**
   * @param {GuardSource} input
   * @param {string} sourceDirectory
   * @param {import('typescript').SourceFile | undefined} source
   * @returns {{ tags: string[], comments: string[] }}
   */
  function componentGapAnchors(input, sourceDirectory, source) {
    const { file, content } = input;
    const pattern = patterns(sourceDirectory);
    if (!source || !pattern.tsx.test(file) || pattern.test.test(file)) {
      return { tags: [], comments: [] };
    }
    /** @type {string[]} */
    const tags = [];
    /** @param {TsNode} node */
    const visit = (node) => {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        tags.push(normalize(node.getText(source)));
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
    // Read comments from the trivia between parsed tokens: a bare scanner loses its place after
    // template literal substitutions or apostrophes in JSX text and swallows later comments.
    /** @type {string[]} */
    const comments = [];
    let end = 0;
    /** @param {TsNode} node */
    const leaves = (node) => {
      const children = node.getChildren(source);
      if (children.length) {
        children.forEach(leaves);
        return;
      }
      const start = node.kind === ts.SyntaxKind.JsxText ? node.getFullStart() : node.getStart(source);
      for (const [text] of content.slice(end, start).matchAll(/\/\/[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$)/g)) {
        if (text.startsWith('//')) {
          comments.push(text);
        }
      }
      end = Math.max(end, node.getEnd());
    };
    leaves(source);
    return { tags, comments };
  }

  /**
   * Pure: callers supply source text and the issue-backed exception data.
   * @param {readonly GuardSource[]} files
   * @param {readonly GuardAllowlistEntry[]} allowlist
   * @param {GuardOptions} [options]
   * @returns {GuardResult}
   */
  function checkDesignSystem(
    files,
    allowlist,
    { localRepo = 'nexo', themeDirectory = 'src/theme/', sourceDirectory = 'src', classNameAllows = new Map() } = {}
  ) {
    const local = escapeRegExp(localRepo);
    const issuePattern = new RegExp(
      `^(?:egdev6\\/egdev-design-system#\\d+|${local}#\\d+|${local}#TBD-[a-z0-9]+(?:-[a-z0-9]+)*)$`
    );
    const pendingIssuePattern = new RegExp(`^${local}#TBD-[a-z0-9]+(?:-[a-z0-9]+)*$`);
    /** @type {string[]} */
    const errors = [];
    const used = allowlist.map(() => false);
    /** @param {{ file: string, snippet: string }} violation */
    const consumeAllowlistEntry = (violation) => {
      const index = allowlist.findIndex(
        (entry, i) =>
          !used[i] &&
          entry.kind !== 'component-gap' &&
          entry.file === violation.file &&
          entry.pattern === violation.snippet
      );
      if (index === -1) {
        return false;
      }
      used[index] = true;
      return true;
    };
    for (const entry of allowlist) {
      if (!issuePattern.test(entry.issue)) {
        errors.push(`${entry.file}: invalid issue for allowlist entry ${entry.pattern}`);
      }
      if (!entry.reason.trim()) {
        errors.push(`${entry.file}: empty reason for allowlist entry ${entry.pattern}`);
      }
      if (entry.kind === 'component-gap') {
        const reference = entry.comment?.match(
          /^\/\/ TODO\(egdev-design-system#(TBD-[a-z0-9]+(?:-[a-z0-9]+)*|\d+)\):\s*\S/
        );
        const id = reference?.[1];
        const issue = id && (id.startsWith('TBD-') ? `${localRepo}#${id}` : `egdev6/egdev-design-system#${id}`);
        if (!issue || issue !== entry.issue) {
          errors.push(`${entry.file}: invalid TODO for allowlist entry ${entry.pattern}`);
        }
      }
    }
    /** @type {GuardViolation[]} */
    const violations = [];
    /** @type {import('./appearance-guard.mjs').AppearanceViolation[]} */
    const appearanceViolations = [];
    /** @type {import('./appearance-guard.mjs').StructuralViolation[]} */
    const structuralViolations = [];
    /** @type {import('./dom-guard.mjs').DomViolation[]} */
    const domViolations = [];
    // All checks share the same parsed node tree. Key by input object to preserve independent
    // occurrences even if a caller supplies two entries with the same file name.
    /** @type {Map<GuardSource, import('typescript').SourceFile>} */
    const sourceFiles = new Map();
    const pattern = patterns(sourceDirectory);
    for (const input of files) {
      if (pattern.code.test(input.file) && !pattern.codeTest.test(input.file) && !sourceFiles.has(input)) {
        sourceFiles.set(
          input,
          ts.createSourceFile(
            `/${input.file}`,
            input.content,
            ts.ScriptTarget.Latest,
            true,
            input.file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
          )
        );
      }
    }
    const { classes, owners, appClasses, proseSources } = collectClasses(files, sourceDirectory, sourceFiles);
    for (const source of files) {
      // Preserve the existing DS041/DS046 matching, and share any DS047 exception only with
      // checks on the exact same rule offset (not another identical rule on the same line).
      const allowedSelectors = new Map();
      const allowedRules = new Set();
      const checkedRules = new Set();
      const structural = findStructuralViolations(source, themeDirectory, sourceDirectory, classes, appClasses);
      const structuralByOffset = new Map(structural.map((item) => [ruleOffsets.get(item), item]));
      /** @param {{ file: string, line: number, snippet: string }} item */
      const selectorKey = (item) => JSON.stringify([item.file, item.line, item.snippet]);
      if (allowlist.some((entry) => entry.kind === 'component-gap' && entry.file === source.file)) {
        const { tags, comments } = componentGapAnchors(source, sourceDirectory, sourceFiles.get(source));
        allowlist.forEach((entry, i) => {
          if (used[i] || entry.kind !== 'component-gap' || entry.file !== source.file) {
            return;
          }
          const tag = tags.indexOf(entry.pattern);
          const comment = comments.indexOf(entry.comment ?? '');
          if (tag !== -1 && comment !== -1) {
            used[i] = true;
            tags.splice(tag, 1);
            comments.splice(comment, 1);
          }
        });
      }
      const rawViolations = findViolations(
        source,
        themeDirectory,
        sourceDirectory,
        sourceFiles.get(source),
        proseSources
      );
      for (const violation of rawViolations) {
        const offset = ruleOffsets.get(violation);
        const structuralRule = structuralByOffset.get(offset);
        if (structuralRule) {
          // DS041 entries match individual selector parts. Only a full-rule entry can also
          // suppress DS046/DS047; keep consuming individual matches even if that entry exists.
          if (consumeAllowlistEntry(violation)) {
            if (violation.snippet === structuralRule.snippet) {
              allowedRules.add(offset);
            }
          } else {
            if (!allowedRules.has(offset) && !checkedRules.has(offset)) {
              checkedRules.add(offset);
              if (consumeAllowlistEntry(structuralRule)) {
                allowedRules.add(offset);
              }
            }
            if (!allowedRules.has(offset)) {
              violations.push(violation);
            }
          }
        } else if (!consumeAllowlistEntry(violation)) {
          violations.push(violation);
        } else if (source.file.endsWith('.css')) {
          const key = selectorKey(violation);
          allowedSelectors.set(key, (allowedSelectors.get(key) ?? 0) + 1);
        }
      }
      for (const violation of findAppearanceViolations(
        source,
        themeDirectory,
        sourceDirectory,
        owners,
        classNameAllows
      )) {
        const offset = ruleOffsets.get(violation);
        if (allowedRules.has(offset)) {
          continue;
        }
        if (structuralByOffset.has(offset)) {
          if (consumeAllowlistEntry(violation)) {
            allowedRules.add(offset);
          } else {
            appearanceViolations.push(violation);
          }
          continue;
        }
        const key = selectorKey(violation);
        const alreadyAllowed = allowedSelectors.get(key) ?? 0;
        if (alreadyAllowed > 0) {
          allowedSelectors.set(key, alreadyAllowed - 1);
          continue;
        }
        if (!consumeAllowlistEntry(violation)) {
          appearanceViolations.push(violation);
        }
      }
      for (const violation of structural) {
        if (!allowedRules.has(ruleOffsets.get(violation)) && !consumeAllowlistEntry(violation)) {
          structuralViolations.push(violation);
        }
      }
      for (const violation of findDomViolations(source, sourceDirectory, sourceFiles.get(source))) {
        if (!consumeAllowlistEntry(violation)) {
          domViolations.push(violation);
        }
      }
    }
    allowlist.forEach((entry, i) => {
      if (!used[i]) {
        errors.push(`${entry.file}: stale allowlist entry ${entry.pattern}; remove it`);
      }
    });
    return {
      violations,
      appearanceViolations,
      ...(structuralViolations.length ? { structuralViolations } : {}),
      ...(domViolations.length ? { domViolations } : {}),
      errors,
      pendingIssueCount: allowlist.filter((entry) => pendingIssuePattern.test(entry.issue)).length
    };
  }

  return { checkDesignSystem };
}
