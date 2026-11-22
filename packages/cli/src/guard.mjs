// The design-system guard, moved from the egdev-design-system skill (assets/guard/
// design-system-guard.ts) with DS040–DS045 parity, and extended for DS046. `typescript` and
// `postcss` are injected from the consumer project (Q4); the tree follows `sourceDirectory`.
import { createAppearanceGuard } from './appearance-guard.mjs';

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
 * An exact, whitespace-normalized opening tag or individual CSS selector, not a regex. Non-guarded
 * markup awaiting a DS capability is tracked by its opening tag and TODO (`kind: 'component-gap'`).
 * Declared once in the package's public type entry (S6, #488); doctor validates the same shape (DS042).
 * @typedef {import('../types/index.d.ts').GuardAllowlistEntry} GuardAllowlistEntry
 */
/** @typedef {{ file: string, line: number, snippet: string }} GuardViolation */
/** @typedef {{ violations: GuardViolation[], appearanceViolations: import('./appearance-guard.mjs').AppearanceViolation[], errors: string[], pendingIssueCount: number }} GuardResult */
/**
 * `localRepo`: repository name used for local issue references (`<localRepo>#N`, `<localRepo>#TBD-slug`).
 * `themeDirectory`: app theme layer, the only place where CSS may target DS internals.
 * `sourceDirectory`: guarded tree, without a trailing slash.
 * @typedef {{ localRepo?: string, themeDirectory?: string, sourceDirectory?: string }} GuardOptions
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
      test: /(?:^|\/)__tests__\/|\.(?:test|spec)\.tsx$/
    };
  };

  const { collectClasses, findAppearanceViolations } = createAppearanceGuard({ ts, postcss }, patterns, normalize);

  /**
   * @param {GuardSource} source
   * @param {string} themeDirectory
   * @param {string} sourceDirectory
   * @returns {GuardViolation[]}
   */
  function findViolations({ file, content }, themeDirectory, sourceDirectory) {
    /** @type {GuardViolation[]} */
    const found = [];
    /**
     * @param {number} offset
     * @param {string} snippet
     */
    const add = (offset, snippet) =>
      found.push({
        file,
        line: content.slice(0, offset).split('\n').length,
        snippet: normalize(snippet)
      });
    const pattern = patterns(sourceDirectory);
    if (pattern.tsx.test(file) && !pattern.test.test(file)) {
      const source = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      /** @param {TsNode} node */
      const visit = (node) => {
        if (
          (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
          ts.isIdentifier(node.tagName) &&
          ['button', 'input', 'a', 'label'].includes(node.tagName.text) &&
          !isSlotChild(node)
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
            add((rule.source?.start?.offset ?? 0) + start, part);
          }
        }
      });
    }
    return found;
  }

  /**
   * @param {GuardSource} source
   * @param {string} sourceDirectory
   * @returns {{ tags: string[], comments: string[] }}
   */
  function componentGapAnchors({ file, content }, sourceDirectory) {
    const pattern = patterns(sourceDirectory);
    if (!pattern.tsx.test(file) || pattern.test.test(file)) {
      return { tags: [], comments: [] };
    }
    const source = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
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
    { localRepo = 'nexo', themeDirectory = 'src/theme/', sourceDirectory = 'src' } = {}
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
    const classes = collectClasses(files, sourceDirectory);
    for (const source of files) {
      // One existing CSS exception also covers DS046 on the same selector occurrence.
      const allowedSelectors = new Map();
      /** @param {{ file: string, line: number, snippet: string }} item */
      const selectorKey = (item) => JSON.stringify([item.file, item.line, item.snippet]);
      if (allowlist.some((entry) => entry.kind === 'component-gap' && entry.file === source.file)) {
        const { tags, comments } = componentGapAnchors(source, sourceDirectory);
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
      for (const violation of findViolations(source, themeDirectory, sourceDirectory)) {
        if (!consumeAllowlistEntry(violation)) {
          violations.push(violation);
        } else if (source.file.endsWith('.css')) {
          const key = selectorKey(violation);
          allowedSelectors.set(key, (allowedSelectors.get(key) ?? 0) + 1);
        }
      }
      for (const violation of findAppearanceViolations(source, themeDirectory, sourceDirectory, classes)) {
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
    }
    allowlist.forEach((entry, i) => {
      if (!used[i]) {
        errors.push(`${entry.file}: stale allowlist entry ${entry.pattern}; remove it`);
      }
    });
    return {
      violations,
      appearanceViolations,
      errors,
      pendingIssueCount: allowlist.filter((entry) => pendingIssuePattern.test(entry.issue)).length
    };
  }

  return { checkDesignSystem };
}
