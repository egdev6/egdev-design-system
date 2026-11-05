const lineAt = (text, offset) => text.slice(0, offset).split('\n').length;
const normalize = (value) => value.trim().replace(/\s+/g, ' ').toLowerCase();

function category(name) {
  if (name.includes('\\')) {
    return 'unknown';
  }
  if (/^--/.test(name)) {
    return 'custom';
  }
  if (name === 'font-family') {
    return 'font';
  }
  if (name === 'font-size') {
    return 'size';
  }
  if (name === 'line-height' || name === 'font-weight') {
    return 'typography';
  }
  if (
    /^(?:margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left|letter-spacing|word-spacing|(?:min-|max-)?(?:width|height|inline-size|block-size))(?:-.+)?$/.test(
      name
    )
  ) {
    return 'spacing';
  }
  if (/^border(?:-.+)?-radius$|^border-radius$/.test(name)) {
    return 'radius';
  }
  if (/^(?:box|text)-shadow$/.test(name)) {
    return 'shadow';
  }
  if (
    /^(?:color|accent-color|scrollbar-color|text-emphasis-color|-webkit-text-fill-color|-webkit-text-stroke(?:-color)?|background(?:-.+)?|border(?:-.+)?|outline(?:-.+)?|text-decoration(?:-.+)?|column-rule(?:-.+)?|caret-color|fill|stroke)$/.test(
      name
    )
  ) {
    return 'color';
  }
  if (name.endsWith('-color')) {
    return 'color';
  }
  if (name === 'font' || name === 'filter') {
    return 'unknown';
  }
  return 'unknown';
}

function notChecked(name, value, kind) {
  if (name.includes('\\')) {
    return false;
  }
  if (/^(?:(?:min-|max-)?(?:width|height)|(?:min-|max-)?(?:inline|block)-size)$/.test(name)) {
    return /^(?:auto|(?:\d+(?:\.\d+)?|\.\d+)%|min-content|max-content|fit-content|none)$/i.test(value);
  }
  if (
    /^(?:display|position|align(?:-.+)?|justify(?:-.+)?|place(?:-.+)?|flex(?:-.+)?|grid(?:-.+)?|overflow(?:-.+)?|z-index|order|float|clear|visibility|box-sizing|object-fit|object-position|text-align|text-transform|text-overflow|white-space|word-break|overflow-wrap|cursor|pointer-events|user-select|background-position(?:-[xy])?|background-repeat|background-size|background-attachment|background-origin|background-clip)$/.test(
      name
    )
  ) {
    return true;
  }
  if (kind === 'typography') {
    return !/var\(/i.test(value);
  }
  if (kind !== 'unknown') {
    return false;
  }
  // Unknown properties remain gaps: even a colour keyword may be unfamiliar.
  return false;
}

function tokenMatchesCategory(name, kind) {
  return (
    {
      color: /^--color-/,
      font: /^--font-/,
      size: /^--text-(?!.*--)/,
      spacing: /^--(?:spacing|space|tracking)-/,
      radius: /^--radius-/,
      shadow: /^--shadow-/
    }[kind]?.test(name) ?? false
  );
}

// Parse declaration lists without splitting strings, comments, or nested functions.
function declarations(css, offset, blocks) {
  const result = [];
  let start = 0;
  let depth = 0;
  let parentheses = 0;
  let quote = '';
  let comment = false;
  const emit = (end) => {
    const segment = css.slice(start, end);
    const match =
      /^(?:\s|\/\*[\s\S]*?\*\/)*((?:[\w-]|[^\p{ASCII}]|\\(?:[a-f\d]{1,6}(?:\r\n|[\t\n\f\r ])?|[^\r\n\fa-f\d]))+)\s*:\s*([\s\S]*?)\s*$/iu.exec(
        segment
      );
    if (!match) {
      if (segment.replace(/\/\*[\s\S]*?\*\//g, '').trim()) {
        throw new Error('Invalid CSS: expected declaration');
      }
      return;
    }
    if (!match[2]) {
      throw new Error('Invalid CSS: empty value');
    }
    result.push({ name: match[1].toLowerCase(), value: match[2], offset: offset + start + segment.indexOf(match[1]) });
  };
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (comment) {
      if (c === '*' && css[i + 1] === '/') {
        comment = false;
        i++;
      }
      continue;
    }
    if (quote) {
      if (c === '\\') {
        i++;
      } else if (c === quote) {
        quote = '';
      }
      continue;
    }
    if (c === '/' && css[i + 1] === '*') {
      comment = true;
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      continue;
    }
    if (c === '\\') {
      if (i + 1 >= css.length || /[\r\n\f]/.test(css[i + 1])) {
        throw new Error('Invalid CSS: invalid escape');
      }
      i++;
      if (/[a-f\d]/i.test(css[i])) {
        let digits = 1;
        while (digits < 6 && /[a-f\d]/i.test(css[i + 1] ?? '')) {
          i++;
          digits++;
        }
        if (/[\t\n\f\r ]/.test(css[i + 1] ?? '')) {
          if (css[i + 1] === '\r' && css[i + 2] === '\n') {
            i++;
          }
          i++;
        }
      }
      continue;
    }
    if (c === '(') {
      parentheses++;
    } else if (c === ')') {
      if (!parentheses) {
        throw new Error('Invalid CSS: unbalanced parentheses');
      }
      parentheses--;
    } else if (!parentheses && c === '{') {
      if (!blocks) {
        throw new Error('Invalid CSS: unexpected block');
      }
      depth++;
      start = i + 1;
    } else if (!parentheses && c === '}') {
      if (!depth) {
        throw new Error('Invalid CSS: unbalanced block');
      }
      emit(i);
      depth--;
      start = i + 1;
    } else if (!parentheses && c === ';') {
      if (!blocks || depth) {
        emit(i);
      } else if (css.slice(start, i).trim()) {
        throw new Error('Invalid CSS: unsupported at-rule');
      }
      start = i + 1;
    }
  }
  if (quote || comment || parentheses) {
    throw new Error('Invalid CSS: unterminated value');
  }
  if (depth) {
    throw new Error('Invalid CSS: unbalanced block');
  }
  if (!blocks) {
    emit(css.length);
  } else if (
    css
      .slice(start)
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim()
  ) {
    throw new Error('Invalid CSS: expected block');
  }
  return result;
}

export function tokensFromSystem(text) {
  const result = [];
  for (const line of text.split('\n')) {
    const match = /^\|\s*(--[\w-]+)\s*\|\s*(.*?)\s*\|\s*(?:theme|root|inline)\s*\|/.exec(line);
    if (match) {
      result.push({ name: match[1], value: match[2].replaceAll('\\|', '|') });
    }
  }
  if (!result.length) {
    throw new Error('Invalid system reference: no token table found');
  }
  return result;
}

export function checkArtboard(html, tokens) {
  if (!Array.isArray(tokens) || !tokens.length) {
    throw new Error('Invalid token source');
  }
  const tokenMap = new Map(tokens.map((t) => [t.name, t.value]));
  const resolve = (name, seen = new Set()) => {
    if (seen.has(name) || !tokenMap.has(name)) {
      return null;
    }
    const value = tokenMap.get(name);
    const alias = /^var\((--[\w-]+)\)$/.exec(value.trim());
    return alias ? resolve(alias[1], new Set([...seen, name])) : normalize(value);
  };
  const found = [];
  // Comments and scripts are excluded before finding style elements and attributes.
  const masked = html.replace(/<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, (m) =>
    m.replace(/[^\n]/g, ' ')
  );
  const ranges = [];
  for (const match of masked.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)) {
    const offset = match.index + match[0].indexOf('>') + 1;
    found.push(...declarations(match[1], offset, true));
    ranges.push([match.index, match.index + match[0].length]);
  }
  if (
    (masked.match(/<style\b/gi) ?? []).length !== ranges.length ||
    (masked.match(/<\/style\s*>/gi) ?? []).length !== ranges.length
  ) {
    throw new Error('Invalid HTML: unclosed style element');
  }
  for (const tag of masked.matchAll(/<[a-z](?:[^"'>]|"[^"]*"|'[^']*')*>/gi)) {
    if (ranges.some(([start, end]) => tag.index >= start && tag.index < end)) {
      continue;
    }
    if (/^<link\b/i.test(tag[0]) && /\brel\s*=\s*(["'])[^"']*\bstylesheet\b[^"']*\1/i.test(tag[0])) {
      throw new Error('Unsupported HTML: external stylesheet');
    }
    for (const attr of tag[0].matchAll(/\sstyle\s*=\s*(["'])([\s\S]*?)\1/gi)) {
      const offset = tag.index + attr.index + attr[0].indexOf(attr[1]) + 1;
      found.push(...declarations(attr[2], offset, false));
    }
    if (/\sstyle\s*=/i.test(tag[0]) && !/\sstyle\s*=\s*["']/i.test(tag[0])) {
      throw new Error('Invalid HTML: style attribute must be quoted');
    }
  }
  found.sort((a, b) => a.offset - b.offset);
  const overridden = new Set();
  for (const item of found.filter((d) => d.name.startsWith('--'))) {
    const expected = resolve(item.name);
    const ref = /^var\((--[\w-]+)\)$/.exec(item.value.trim());
    const actual = ref ? resolve(ref[1]) : normalize(item.value);
    if (!expected || actual !== expected) {
      overridden.add(item.name);
    }
  }
  // An escaped property could spell a custom-property override, so no token is trusted.
  const hasEscapedProperty = found.some((item) => item.name.includes('\\'));
  const trusted = (name, seen = new Set()) => {
    if (hasEscapedProperty || seen.has(name) || overridden.has(name) || !tokenMap.has(name)) {
      return false;
    }
    const alias = /^var\((--[\w-]+)\)$/.exec(tokenMap.get(name).trim());
    return alias ? trusted(alias[1], new Set([...seen, name])) : true;
  };
  const rows = [];
  for (const item of found) {
    const kind = category(item.name);
    if (notChecked(item.name, item.value.trim(), kind)) {
      rows.push({ ...item, trace: 'NOT CHECKED' });
      continue;
    }
    if (kind === 'custom') {
      rows.push({ ...item, trace: trusted(item.name) ? item.name : 'UNTRACED' });
      continue;
    }
    const value = item.value.trim();
    const ref = /^var\((--[\w-]+)\)$/.exec(value);
    const mix = /^color-mix\(in oklab,\s*(.+)\s+(\d+(?:\.\d+)?)%,\s*transparent\)$/i.exec(value);
    const spacingScale = /^calc\(\s*var\(--spacing\)\s*\*\s*[+-]?(?:\d+(?:\.\d+)?|\.\d+)\s*\)$/i.test(value);
    let trace;
    if (ref && kind !== 'unknown' && trusted(ref[1]) && resolve(ref[1])) {
      trace = ref[1];
    } else if (kind === 'spacing' && spacingScale && trusted('--spacing') && resolve('--spacing')) {
      trace = '--spacing';
    } else if (mix && kind === 'color' && Number(mix[2]) <= 100) {
      const mixRef = /^var\((--color-[\w-]+)\)$/.exec(mix[1]);
      trace = mixRef
        ? trusted(mixRef[1]) && resolve(mixRef[1])
          ? mixRef[1]
          : undefined
        : tokens.find(
            (t) => tokenMatchesCategory(t.name, 'color') && trusted(t.name) && resolve(t.name) === normalize(mix[1])
          )?.name;
    } else if (!ref && !mix) {
      trace = tokens.find(
        (t) => tokenMatchesCategory(t.name, kind) && trusted(t.name) && resolve(t.name) === normalize(value)
      )?.name;
    }
    rows.push({ ...item, trace: trace ?? 'UNTRACED' });
  }
  const untraced = rows.filter((row) => row.trace === 'UNTRACED').length;
  const notCheckedCount = rows.filter((row) => row.trace === 'NOT CHECKED').length;
  const clean = (value) => value.replaceAll('|', '\\|').replace(/\s+/g, ' ');
  return {
    output: [
      'Line | Property | Value | Trace',
      ...rows.map((r) => `${lineAt(html, r.offset)} | ${r.name} | ${clean(r.value)} | ${r.trace}`),
      `Untraced: ${untraced}`,
      ...(notCheckedCount ? [`Not checked: ${notCheckedCount}`] : []),
      ''
    ].join('\n'),
    untraced
  };
}
