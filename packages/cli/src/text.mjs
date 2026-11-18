// Text helpers shared by the CLI surface and doctor findings.

/**
 * Collapses every line break and the whitespace around it into one space, in linear time.
 * Same result as replacing each whitespace-newline-whitespace run with a space, without the polynomial
 * backtracking of that regular expression (CodeQL js/polynomial-redos).
 * @param {string} text
 * @returns {string}
 */
export function flattenMessage(text) {
  const lines = text.split('\n');
  const last = lines.length - 1;
  /** @type {string[]} */
  const parts = [];
  lines.forEach((line, index) => {
    const start = index === 0 ? line : line.trimStart();
    const trimmed = index === last ? start : start.trimEnd();
    if (trimmed !== '' || index === 0 || index === last) {
      parts.push(trimmed);
    }
  });
  return parts.join(' ');
}
