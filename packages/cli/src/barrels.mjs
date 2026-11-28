// Barrels (#582, odd/tasks/doctor-barrels-582.md S2 and S3): a local file that re-exports design-system components.
// DS046 and DS047 follow its named re-exports one hop, syntactically, over the files the guard already scanned. Nothing
// here uses TypeScript module resolution or reads the disk: the project's tsconfig `paths` arrive as data.
import { dirname, join } from 'node:path/posix';

/** @typedef {import('./guard.mjs').TypeScript} TypeScript */
/** @typedef {{ exportName: string, packageName: string }} BarrelExport */
/**
 * `names` maps each name the barrel exports to the export and package it re-exports from a guarded package;
 * `unfollowable` lists the value re-exports from a guarded package the guard cannot follow, in source order.
 * @typedef {{ names: Map<string, BarrelExport>, unfollowable: { line: number, snippet: string }[] }} Barrel
 */
/**
 * `compilerOptions.paths` of `<project>/tsconfig.json`, read by doctor. `baseDirectory` is the directory the targets are
 * relative to (`compilerOptions.baseUrl`, else the tsconfig directory), project-relative with forward slashes; `''` is
 * the project root.
 * @typedef {{ baseDirectory: string, paths: ReadonlyMap<string, readonly string[]> }} PathMappings
 */
/**
 * A barrel the guard cannot follow (DS049): `reexports` holds the text of each unfollowable re-export, `unreached`
 * says that no scanned import resolves to the file, and `line` is the first unfollowable re-export.
 * @typedef {{ file: string, line?: number, reexports: string[], unreached: boolean }} BarrelWarning
 */

/**
 * Read the value re-exports of a file from the guarded packages. A type-only declaration or specifier is ignored. A
 * named re-export (`export { X } from`, `export { X as Y } from`) is followable; `export *`, `export * as NS` and a
 * local re-export of an imported binding (`import { X } from '@egdev/ui'; export { X }`) are not.
 * @param {TypeScript} ts
 * @param {readonly string[]} packages the guarded packages
 * @param {(text: string) => string} normalize
 * @param {import('typescript').SourceFile} source
 * @returns {Barrel | undefined} undefined when the file re-exports no value from a guarded package
 */
export function readBarrel(ts, packages, normalize, source) {
  /** @param {import('typescript').Expression | undefined} specifier */
  const guardedPackage = (specifier) =>
    specifier && ts.isStringLiteral(specifier) && packages.includes(specifier.text) ? specifier.text : undefined;
  // Top-level names are unique, so the local names a file binds with value imports from a guarded package are enough
  // to tell a local re-export of one of them from an export of the file's own declaration.
  /** @type {Set<string>} */
  const imported = new Set();
  for (const statement of source.statements) {
    const clause =
      ts.isImportDeclaration(statement) && guardedPackage(statement.moduleSpecifier)
        ? statement.importClause
        : undefined;
    const bindings = clause && !clause.isTypeOnly ? clause.namedBindings : undefined;
    if (bindings && ts.isNamespaceImport(bindings)) {
      imported.add(bindings.name.text);
    } else if (bindings && ts.isNamedImports(bindings)) {
      for (const binding of bindings.elements) {
        if (!binding.isTypeOnly) {
          imported.add(binding.name.text);
        }
      }
    }
  }
  /** @type {Map<string, BarrelExport>} */
  const names = new Map();
  /** @type {{ line: number, snippet: string }[]} */
  const unfollowable = [];
  /** @param {import('typescript').Statement} statement */
  const unfollow = (statement) =>
    unfollowable.push({
      line: source.getLineAndCharacterOfPosition(statement.getStart(source)).line + 1,
      snippet: normalize(statement.getText(source)).replace(/;$/, '')
    });
  for (const statement of source.statements) {
    if (ts.isExportAssignment(statement)) {
      if (ts.isIdentifier(statement.expression) && imported.has(statement.expression.text)) {
        unfollow(statement);
      }
      continue;
    }
    if (!ts.isExportDeclaration(statement) || statement.isTypeOnly) {
      continue;
    }
    const clause = statement.exportClause;
    if (!statement.moduleSpecifier) {
      const reexports =
        clause &&
        ts.isNamedExports(clause) &&
        clause.elements.some(
          (element) => !element.isTypeOnly && imported.has((element.propertyName ?? element.name).text)
        );
      if (reexports) {
        unfollow(statement);
      }
      continue;
    }
    const packageName = guardedPackage(statement.moduleSpecifier);
    if (packageName === undefined) {
      continue;
    }
    if (!clause || ts.isNamespaceExport(clause)) {
      unfollow(statement);
      continue;
    }
    for (const element of clause.elements) {
      if (!element.isTypeOnly) {
        names.set(element.name.text, { exportName: (element.propertyName ?? element.name).text, packageName });
      }
    }
  }
  return names.size > 0 || unfollowable.length > 0 ? { names, unfollowable } : undefined;
}

/**
 * The module paths an import specifier can mean, in the order TypeScript tries them: a relative specifier is joined to
 * the importing file's directory and never uses `paths`; any other specifier uses the matching `paths` key, an exact
 * key over a `*` pattern and, among patterns, the longest prefix, with each target in order and its `*` replaced by the
 * text the pattern's `*` matched. The base of the targets is `baseDirectory`.
 * @param {string} importer
 * @param {string} specifier
 * @param {PathMappings | undefined} mappings
 * @returns {string[]}
 */
function modulePaths(importer, specifier, mappings) {
  if (/^\.\.?(?:\/|$)/.test(specifier)) {
    return [join(dirname(importer), specifier)];
  }
  /** @type {{ targets: readonly string[], star: string | undefined, prefix: number } | undefined} */
  let best;
  for (const [pattern, targets] of mappings?.paths ?? []) {
    const star = pattern.indexOf('*');
    if (star === -1) {
      if (pattern === specifier) {
        best = { targets, star: undefined, prefix: Number.POSITIVE_INFINITY };
        break;
      }
      continue;
    }
    const prefix = pattern.slice(0, star);
    const suffix = pattern.slice(star + 1);
    if (
      specifier.length >= prefix.length + suffix.length &&
      specifier.startsWith(prefix) &&
      specifier.endsWith(suffix) &&
      prefix.length > (best?.prefix ?? -1)
    ) {
      best = { targets, star: specifier.slice(prefix.length, specifier.length - suffix.length), prefix: prefix.length };
    }
  }
  if (!mappings || !best) {
    return [];
  }
  const { star } = best;
  return best.targets.map((target) =>
    join(mappings.baseDirectory, star === undefined ? target : target.replace('*', () => star))
  );
}

const SUFFIXES = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];

/**
 * Resolve an import specifier to one of the scanned files without TypeScript module resolution: each module path is
 * tried as written, then with `.ts`, `.tsx`, `/index.ts` and `/index.tsx`, and the first scanned file wins.
 * @param {string} importer project-relative path of the importing file
 * @param {string} specifier
 * @param {ReadonlySet<string>} files the scanned non-test `.ts` and `.tsx` files, project-relative
 * @param {PathMappings | undefined} mappings
 * @returns {string | undefined}
 */
export function resolveImport(importer, specifier, files, mappings) {
  for (const path of modulePaths(importer, specifier, mappings)) {
    const stem = path.replace(/\/+$/, '');
    for (const suffix of SUFFIXES) {
      if (files.has(`${stem}${suffix}`)) {
        return `${stem}${suffix}`;
      }
    }
  }
  return undefined;
}
