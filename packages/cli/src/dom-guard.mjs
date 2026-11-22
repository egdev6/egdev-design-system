// DS048 checks static DOM queries without evaluating app code or resolving its types.
import { cssIdentifier, staticStringParts } from './appearance-guard.mjs';

/** @typedef {import('./guard.mjs').TypeScript} TypeScript */
/** @typedef {import('./guard.mjs').GuardSource} GuardSource */
/** @typedef {{ file: string, line: number, snippet: string, call: string, marker: string }} DomViolation */

const SELECTOR_METHODS = new Set(['querySelector', 'querySelectorAll', 'closest', 'matches']);
const CLASS_LIST_METHODS = new Set(['contains', 'add', 'remove', 'toggle']);

/**
 * Find a class selector, ignoring CSS comments, strings and attribute values. Keep the lexical
 * context across a template's static parts without evaluating its substitutions.
 * @param {string} selector
 * @param {{ quote: string, brackets: number, comment: boolean }} state
 */
function selectorMarker(selector, state) {
  for (let i = 0; i < selector.length; i++) {
    const char = selector[i] ?? '';
    if (state.comment) {
      if (char === '*' && selector[i + 1] === '/') {
        state.comment = false;
        i++;
      }
    } else if (char === '\\') {
      i++;
    } else if (state.quote) {
      if (char === state.quote) {
        state.quote = '';
      }
    } else if (char === '/' && selector[i + 1] === '*') {
      state.comment = true;
      i++;
    } else if (char === '"' || char === "'") {
      state.quote = char;
    } else if (char === '[') {
      state.brackets++;
    } else if (char === ']' && state.brackets) {
      state.brackets--;
    } else if (char === '.' && !state.brackets) {
      const identifier = cssIdentifier(selector, i + 1);
      if (identifier.value.startsWith('eg-') && identifier.value.length > 3) {
        return `.${identifier.value}`;
      }
      i = identifier.end - 1;
    }
  }
  return undefined;
}

/**
 * Find a DS class at a known token boundary. A part after a substitution can start inside a token.
 * @param {string} text
 * @param {boolean} initial
 */
function classMarker(text, initial) {
  const name = text
    .split(/\s+/)
    .find((part, index) => (initial || index > 0) && part.startsWith('eg-') && part.length > 3);
  return name ? `.${name}` : undefined;
}

/**
 * @param {TypeScript} ts
 * @param {(sourceDirectory: string) => { code: RegExp, codeTest: RegExp }} patterns
 * @param {(text: string) => string} normalize
 */
export function createDomGuard(ts, patterns, normalize) {
  /** @param {import('typescript').Node} node */
  function propertyName(node) {
    if (ts.isPropertyAccessExpression(node)) {
      return node.name.text;
    }
    if (ts.isElementAccessExpression(node)) {
      const argument = node.argumentExpression;
      if (argument && (ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument))) {
        return argument.text;
      }
    }
    return undefined;
  }

  /**
   * @param {GuardSource} input
   * @param {string} sourceDirectory
   * @returns {DomViolation[]}
   */
  function findDomViolations({ file, content }, sourceDirectory) {
    const pattern = patterns(sourceDirectory);
    if (!pattern.code.test(file) || pattern.codeTest.test(file)) {
      return [];
    }
    const source = ts.createSourceFile(
      file,
      content,
      ts.ScriptTarget.Latest,
      true,
      file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    );
    /** @type {DomViolation[]} */
    const found = [];
    /** @param {import('typescript').Node} node */
    const visit = (node) => {
      if (ts.isCallExpression(node)) {
        const expression = node.expression;
        const method = propertyName(expression);
        const selector = method !== undefined && SELECTOR_METHODS.has(method);
        const classList =
          method !== undefined &&
          CLASS_LIST_METHODS.has(method) &&
          (ts.isPropertyAccessExpression(expression) || ts.isElementAccessExpression(expression)) &&
          propertyName(expression.expression) === 'classList';
        const classes = method === 'getElementsByClassName' || classList;
        if (method && (selector || classes)) {
          const args = selector ? node.arguments.slice(0, 1) : node.arguments;
          let match;
          for (const argument of args) {
            const state = { quote: '', brackets: 0, comment: false };
            for (const [index, part] of staticStringParts(ts, argument).entries()) {
              const marker = selector ? selectorMarker(part.text, state) : classMarker(part.text, index === 0);
              if (marker) {
                // Preserve escapes and the literal static part as written, without quotes or template delimiters.
                const raw = part.getText(source);
                const end =
                  part.kind === ts.SyntaxKind.TemplateHead || part.kind === ts.SyntaxKind.TemplateMiddle ? -2 : -1;
                match = { marker, snippet: normalize(raw.slice(1, end)) };
                break;
              }
            }
            if (match) {
              break;
            }
          }
          if (match) {
            found.push({
              file,
              line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1,
              snippet: match.snippet,
              call: normalize(method + content.slice(expression.end, node.end)),
              marker: match.marker
            });
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
    return found;
  }
  return { findDomViolations };
}
