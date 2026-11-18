// Minimal range check for packed peers (spec §2): exact versions, `^` ranges and `||` unions.
// Anything else is reported as unsupported instead of guessed.

/** @param {string} text */
function parse(text) {
  const match = text.trim().match(/^=?(\d+)\.(\d+)\.(\d+)$/);
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : null;
}

/**
 * @param {number[]} a
 * @param {number[]} b
 */
function compare(a, b) {
  for (let index = 0; index < 3; index++) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0);
    if (difference !== 0) {
      return difference;
    }
  }
  return 0;
}

/**
 * @param {number[]} version
 * @param {string} part
 * @returns {boolean | null}
 */
function satisfiesPart(version, part) {
  const trimmed = part.trim();
  if (trimmed.startsWith('^')) {
    const base = parse(trimmed.slice(1));
    if (!base) {
      return null;
    }
    const [major = 0, minor = 0] = base;
    if (compare(version, base) < 0) {
      return false;
    }
    if (major > 0) {
      return version[0] === major;
    }
    if (minor > 0) {
      return version[0] === 0 && version[1] === minor;
    }
    return compare(version, base) === 0;
  }
  const exact = parse(trimmed);
  return exact ? compare(version, exact) === 0 : null;
}

/**
 * Orders two exact `major.minor.patch` versions; null when either is outside that syntax.
 * @param {string} a
 * @param {string} b
 * @returns {number | null}
 */
export function compareVersions(a, b) {
  const left = parse(a);
  const right = parse(b);
  return left && right ? compare(left, right) : null;
}

/**
 * Whether `version` satisfies `range`; `null` when either is outside the supported syntax.
 * @param {string} version
 * @param {string} range
 * @returns {boolean | null}
 */
export function satisfies(version, range) {
  const parsed = parse(version);
  if (!parsed) {
    return null;
  }
  let supported = true;
  for (const part of range.split('||')) {
    const result = satisfiesPart(parsed, part);
    if (result === true) {
      return true;
    }
    if (result === null) {
      supported = false;
    }
  }
  return supported ? false : null;
}
