// Pure expectation and reconciliation helpers for the Storybook MCP docs toolset (#344).
// The live smoke (scripts/storybook-mcp.test.mjs) fetches `docs-list` and uses these
// functions, so the contract is derived from the public barrels, the story metas and the
// MDX guides instead of a second hand-maintained component list.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import ts from 'typescript';

export const EXCEPTIONS_FILE = 'scripts/storybook-mcp-exceptions.json';
export const PUBLIC_BARRELS = ['packages/ui/src/index.ts', 'packages/effects/src/index.ts'];

const SKIP_DIRECTORIES = new Set(['node_modules', 'dist', 'storybook-static', 'coverage']);
const STORY_FILE = /\.stories\.tsx?$/;
const MDX_FILE = /\.mdx$/;
const COMPONENT_NAME = /^[A-Z]/;

/** Storybook derives ids from titles by lowercasing and dash-normalising `Foundations/Scene recipes`. */
export function slugifyTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Docs entries are the standalone MDX guides: `<Meta title>` slug plus the `--docs` suffix. */
export function docsPageId(title) {
  return `${slugifyTitle(title)}--docs`;
}

/** Docgen display names may carry generic parameters (`Table<Row>`); the export name never does. */
export function normalizeComponentName(name) {
  const generic = name.indexOf('<');
  return (generic === -1 ? name : name.slice(0, generic)).trim();
}

/**
 * Parse the markdown that `docs-list` returns, without a second format:
 * `- Name (id)` component headers, `  - Story (story-id)` lines and the `# Docs` section.
 */
export function parseDocsList(markdown) {
  const components = [];
  const docs = [];
  let section = '';
  let current;
  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^#\s+(.+?)\s*$/);
    if (heading) {
      section = heading[1];
      current = undefined;
      continue;
    }
    if (section === 'Components') {
      const story = line.match(/^ {2}- (.+?) \(([^()\s]+)\)\s*$/);
      if (story && current) {
        current.stories.push({ name: story[1], id: story[2] });
        continue;
      }
    }
    const entry = line.match(/^- (.+?) \(([^()\s]+)\)(?::.*)?$/);
    if (!entry) {
      continue;
    }
    if (section === 'Components') {
      current = { name: entry[1], id: entry[2], stories: [] };
      components.push(current);
    } else if (section === 'Docs') {
      docs.push({ name: entry[1], id: entry[2] });
      current = undefined;
    }
  }
  return { components, docs };
}

/** Read the meta object of one story file: title, component and declared subcomponents. */
export function readStoryMeta(file, source) {
  const title = source.match(/\btitle:[ \t]*(["'])([^"'\n]+)\1/)?.[2];
  const component = source.match(/\bcomponent:[ \t]*([A-Za-z_$][\w$]*)/)?.[1];
  const subcomponents = [
    ...(source.match(/\bsubcomponents:[ \t]*\{([\s\S]*?)\}/)?.[1] ?? '').matchAll(/:[ \t]*([A-Za-z_$][\w$]*)/g)
  ]
    .map((match) => match[1])
    .filter((name) => COMPONENT_NAME.test(name));
  return { file, title, id: title ? slugifyTitle(title) : undefined, component, subcomponents };
}

/** Every story file of the workspace, in a stable order. */
export function readStoryMetas(rootDir) {
  return listFiles(rootDir, 'packages', STORY_FILE).map((file) =>
    readStoryMeta(file, readFileSync(join(rootDir, file), 'utf8'))
  );
}

/** The `<Meta title>` of a standalone MDX page. */
export function parseMdxTitle(source) {
  return source.match(/<Meta\b[^>]*?\btitle=(["'])([^"']+)\1/)?.[2];
}

/** Every standalone MDX page under `docs/`, addressed the way `/index.json` addresses it. */
export function readMdxDocs(rootDir) {
  return listFiles(rootDir, 'docs', MDX_FILE)
    .map((file) => {
      const title = parseMdxTitle(readFileSync(join(rootDir, file), 'utf8'));
      return { file: `./${file}`, title, id: title ? docsPageId(title) : undefined };
    })
    .sort((left, right) => left.file.localeCompare(right.file));
}

/**
 * Public component exports of both barrels through the installed TypeScript checker:
 * uppercase value exports, so type-only exports and helpers such as `cn` never qualify.
 */
export function enumeratePublicComponents(rootDir) {
  const barrels = PUBLIC_BARRELS.map((barrel) => join(rootDir, barrel));
  const program = ts.createProgram(barrels, {
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ESNext,
    skipLibCheck: true
  });
  const checker = program.getTypeChecker();
  const names = new Set();
  for (const barrel of barrels) {
    const source = program.getSourceFile(barrel);
    if (!source) {
      throw new Error(`Cannot read public barrel: ${barrel}`);
    }
    for (const symbol of checker.getExportsOfModule(checker.getSymbolAtLocation(source))) {
      if (!COMPONENT_NAME.test(symbol.name)) {
        continue;
      }
      const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
      if (target.flags & ts.SymbolFlags.Value) {
        names.add(symbol.name);
      }
    }
  }
  return [...names].sort();
}

/** Every exception needs a reviewed reason, so the registry stays a decision log. */
export function validateExceptions(data) {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`The exception registry must be an object: ${EXCEPTIONS_FILE}`);
  }
  const lists = { manifestOnly: 'id', undocumented: 'name' };
  const result = {};
  for (const [section, key] of Object.entries(lists)) {
    const entries = data[section] ?? [];
    if (!Array.isArray(entries)) {
      throw new Error(`"${section}" must be an array in ${EXCEPTIONS_FILE}`);
    }
    result[section] = entries.map((entry) => {
      if (entry === null || typeof entry !== 'object') {
        throw new Error(`Every "${section}" entry must be an object in ${EXCEPTIONS_FILE}`);
      }
      if (typeof entry[key] !== 'string' || entry[key].trim() === '') {
        throw new Error(`Every "${section}" entry needs a "${key}" in ${EXCEPTIONS_FILE}`);
      }
      if (typeof entry.reason !== 'string' || entry.reason.trim() === '') {
        throw new Error(`Every "${section}" entry needs a "reason" in ${EXCEPTIONS_FILE}`);
      }
      return { ...entry };
    });
  }
  return result;
}

export function readExceptions(file) {
  return validateExceptions(JSON.parse(readFileSync(file, 'utf8')));
}

/**
 * Reconcile the manifest an agent reads (`docs-list`, optionally `/index.json`) with the
 * workspace sources and the exception registry. Returns every violation, never throws.
 */
export function reconcile(input) {
  const { exports, stories, docs, exceptions, manifest, index } = input;
  const problems = [];
  const exportNames = new Set(exports);
  const undocumented = new Map((exceptions?.undocumented ?? []).map((entry) => [entry.name, entry]));
  const manifestOnly = new Map((exceptions?.manifestOnly ?? []).map((entry) => [entry.id, entry]));

  const storiesById = new Map();
  for (const story of stories) {
    if (!story.title) {
      problems.push(`Story file ${story.file} has no Meta title, so its component id cannot be derived`);
      continue;
    }
    const previous = storiesById.get(story.id);
    if (previous) {
      problems.push(`Story files ${previous.file} and ${story.file} share the component id ${story.id}`);
      continue;
    }
    storiesById.set(story.id, story);
  }

  const documentedNames = new Set();
  for (const story of storiesById.values()) {
    if (!story.component) {
      continue;
    }
    const name = normalizeComponentName(story.component);
    documentedNames.add(name);
    if (!exportNames.has(name)) {
      problems.push(`Story file ${story.file} declares component ${story.component}, which no barrel exports`);
    }
    for (const part of story.subcomponents ?? []) {
      documentedNames.add(part);
      if (!exportNames.has(part)) {
        problems.push(`Story file ${story.file} declares subcomponent ${part}, which no barrel exports`);
      }
    }
  }

  const docsById = new Map();
  for (const doc of docs) {
    if (!doc.title) {
      problems.push(`Docs source ${doc.file} has no <Meta title>, so its docs id cannot be derived`);
      continue;
    }
    const previous = docsById.get(doc.id);
    if (previous) {
      problems.push(`Docs sources ${previous.file} and ${doc.file} share the docs id ${doc.id}`);
      continue;
    }
    docsById.set(doc.id, doc);
  }

  const listed = new Map();
  let visibleNames = documentedNames;
  if (manifest) {
    for (const component of manifest.components) {
      if (listed.has(component.id)) {
        problems.push(`docs-list lists component ${component.id} more than once`);
        continue;
      }
      listed.set(component.id, component);
      if (!storiesById.has(component.id)) {
        problems.push(`docs-list lists component ${component.id} ("${component.name}"), which no story file produces`);
      }
    }
    for (const [id, story] of storiesById) {
      if (!listed.has(id)) {
        problems.push(`Component ${id} from ${story.file} is missing from docs-list`);
      }
    }
    for (const [id, component] of listed) {
      const story = storiesById.get(id);
      const name = normalizeComponentName(component.name);
      if (story?.component) {
        const expected = normalizeComponentName(story.component);
        if (name !== expected) {
          problems.push(
            `docs-list lists ${id} as "${component.name}" but ${story.file} declares component ${story.component}`
          );
        }
        if (!exportNames.has(name)) {
          problems.push(`docs-list lists ${id} as "${component.name}", which no barrel exports`);
        }
      } else if (story) {
        const entry = manifestOnly.get(id);
        if (!entry) {
          problems.push(
            `docs-list lists ${id} as "${component.name}", whose story file declares no component; register it in ${EXCEPTIONS_FILE}`
          );
        } else if (entry.name !== undefined && normalizeComponentName(entry.name) !== name) {
          problems.push(
            `Exception ${id} is registered as "${entry.name}" but docs-list lists it as "${component.name}"`
          );
        }
      }
      if (component.stories.length === 0) {
        problems.push(`Component ${id} advertises no story ids; call docs-list with withStoryIds: true`);
      }
    }
    visibleNames = new Set([...listed.values()].map((component) => normalizeComponentName(component.name)));
    for (const [id, story] of storiesById) {
      if (story.component && listed.has(id)) {
        for (const part of story.subcomponents ?? []) {
          visibleNames.add(part);
        }
      }
    }

    const statedDocs = new Map();
    for (const doc of manifest.docs) {
      if (statedDocs.has(doc.id)) {
        problems.push(`docs-list lists docs page ${doc.id} more than once`);
        continue;
      }
      statedDocs.set(doc.id, doc);
    }
    for (const [id, doc] of docsById) {
      if (!statedDocs.has(id)) {
        problems.push(`Docs page ${id} (${doc.title} from ${doc.file}) is missing from docs-list`);
      }
    }
    for (const [id, doc] of statedDocs) {
      const source = docsById.get(id);
      if (!source) {
        problems.push(`docs-list lists docs page ${id} ("${doc.name}"), which has no MDX source under docs/`);
      } else if (doc.name !== source.title) {
        problems.push(
          `docs-list lists docs page ${id} as "${doc.name}" but ${source.file} declares <Meta title="${source.title}">`
        );
      }
    }

    if (index) {
      const entries = index.entries ?? {};
      for (const [id, component] of listed) {
        for (const story of component.stories) {
          const entry = entries[story.id];
          if (!entry) {
            problems.push(`Story id ${story.id} of ${id} is missing from /index.json`);
          } else if (entry.type !== 'story') {
            problems.push(`Story id ${story.id} of ${id} is not a story entry in /index.json (type: ${entry.type})`);
          } else if (!story.id.startsWith(`${id}--`)) {
            problems.push(`Story id ${story.id} does not belong to component ${id}`);
          }
        }
      }
      for (const id of docsById.keys()) {
        const entry = entries[id];
        if (!entry) {
          problems.push(`Docs id ${id} is missing from /index.json`);
        } else if (entry.type !== 'docs') {
          problems.push(`Docs id ${id} is not a docs entry in /index.json (type: ${entry.type})`);
        }
      }
    }
  }

  for (const [name] of undocumented) {
    if (!exportNames.has(name)) {
      problems.push(`Exception ${name} is registered as undocumented but no barrel exports it; remove the entry`);
    } else if (visibleNames.has(name)) {
      problems.push(
        `Exception ${name} is registered as undocumented but ${manifest ? 'a listed story now documents it' : 'a story now documents it'}; remove the entry`
      );
    }
  }
  for (const id of manifestOnly.keys()) {
    const story = storiesById.get(id);
    if (!story) {
      problems.push(`Exception ${id} is registered as manifest-only but no story file produces that id`);
    } else if (story.component) {
      problems.push(
        `Exception ${id} is registered as manifest-only but ${story.file} declares component ${story.component}`
      );
    }
    if (manifest && !listed.has(id)) {
      problems.push(`Exception ${id} is registered as manifest-only but docs-list no longer lists it`);
    }
  }
  for (const name of exportNames) {
    if (visibleNames.has(name) || undocumented.has(name)) {
      continue;
    }
    problems.push(
      `Public export ${name} is ${
        manifest ? 'missing from docs-list' : 'not documented by any story component'
      }; document it with a story component or declared subcomponent, or register it in ${EXCEPTIONS_FILE}`
    );
  }

  return problems;
}

/** Live-test entry point: fail once with every violation, so the offending entries are named. */
export function assertContract(input) {
  const problems = reconcile(input);
  if (problems.length > 0) {
    throw new Error(
      `Storybook MCP contract violations (${problems.length}):\n${problems.map((problem) => `  - ${problem}`).join('\n')}`
    );
  }
  return input;
}

function listFiles(rootDir, entryPoint, pattern) {
  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (SKIP_DIRECTORIES.has(entry.name)) {
        continue;
      }
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(path);
      } else if (pattern.test(entry.name)) {
        files.push(relative(rootDir, path).split(sep).join('/'));
      }
    }
  };
  visit(join(rootDir, entryPoint));
  return files.sort();
}
