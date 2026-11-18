// `package.json` edits for init (spec §6.2-§6.4, §9.6-§9.7). The CLI owns exactly these keys: a
// different user value is a conflict, and `--force` replaces only that value (Q8). Key order is
// kept and new keys are appended.
import { RefusedError } from './args.mjs';
import { DEPENDENCY_FIELDS, field } from './detect.mjs';
import { isRecord } from './release.mjs';

/** @typedef {'create' | 'edit' | 'copy' | 'remove' | 'run' | 'keep'} Verb */
/** @typedef {{ verb: Verb, path: string, detail: string }} Action */
/** @typedef {{ file: string, key: string, current: string, wanted: string }} Conflict */
/** @typedef {{ actions: Action[], conflicts: Conflict[] }} Ledger */
/**
 * @typedef {{
 *   pkg: string,
 *   name: string,
 *   spec: string,
 *   packed: Record<string, unknown>
 * }} SelectedPackage
 */

export const MANIFEST_FILE = 'package.json';
export const DOCTOR_SCRIPT = 'egdev-ds doctor .';
export const PNPM_PIN = 'pnpm@10.34.6';
/** Versions the install guide tests, added only when the app lacks the peer (spec §6.2). */
export const EXTERNAL_PEERS = { react: '19.3.0', 'react-dom': '19.3.0', three: '0.160.0' };
const RUNTIME_PACKAGES = new Set(['tokens', 'ui', 'effects']);

/** @returns {Ledger} */
export const createLedger = () => ({ actions: [], conflicts: [] });

/**
 * Sets an owned key: added when absent, kept when equal, otherwise a conflict that `force`
 * resolves by replacing only that value. npm override objects compare and replace their `.` value.
 * @param {Ledger} ledger
 * @param {{ file: string, object: Record<string, unknown>, key: string, value: string, label: string, force: boolean }} input
 */
export function own(ledger, { file, object, key, value, label, force }) {
  const detail = `${label} = ${value}`;
  if (!Object.hasOwn(object, key)) {
    object[key] = value;
    ledger.actions.push({ verb: 'edit', path: file, detail });
    return;
  }
  const holder = object[key];
  const current = isRecord(holder) && Object.hasOwn(holder, '.') ? holder['.'] : holder;
  if (current === value) {
    ledger.actions.push({ verb: 'keep', path: file, detail });
    return;
  }
  const shown = JSON.stringify(current) ?? String(current);
  ledger.conflicts.push({ file, key: label, current: shown, wanted: JSON.stringify(value) });
  if (force) {
    if (isRecord(holder) && Object.hasOwn(holder, '.')) {
      holder['.'] = value;
    } else {
      object[key] = value;
    }
    ledger.actions.push({ verb: 'edit', path: file, detail: `${detail} (replaces ${shown})` });
  }
}

/**
 * Plans every owned `package.json` key for the selected packages.
 * @param {{
 *   manifest: Record<string, unknown>,
 *   packageManager: 'npm' | 'pnpm',
 *   selected: readonly SelectedPackage[],
 *   force: boolean
 * }} input
 * @returns {{ manifest: Record<string, unknown>, ledger: Ledger, manifestOverrides: boolean }}
 */
export function planManifest({ manifest, packageManager, selected, force }) {
  /** @type {Record<string, unknown>} */
  const next = structuredClone(manifest);
  const ledger = createLedger();
  /**
   * @param {string} key
   * @returns {Record<string, unknown>}
   */
  const record = (key) => {
    if (next[key] === undefined) {
      next[key] = {};
    }
    const value = next[key];
    if (!isRecord(value)) {
      throw new RefusedError(`${MANIFEST_FILE} ${key} is not an object.`);
    }
    return value;
  };
  /**
   * @param {string} where
   * @param {string} key
   * @param {string} value
   */
  const set = (where, key, value) =>
    own(ledger, { file: MANIFEST_FILE, object: record(where), key, value, label: `${where}.${key}`, force });

  for (const { pkg, name, spec } of selected) {
    const elsewhere = ['optionalDependencies', 'peerDependencies'].find((key) => Object.hasOwn(field(next, key), name));
    if (elsewhere) {
      throw new RefusedError(`${name} is declared in ${elsewhere}; init edits only dependencies and devDependencies.`);
    }
    const declared = ['dependencies', 'devDependencies'].find((key) => Object.hasOwn(field(next, key), name));
    set(declared ?? (RUNTIME_PACKAGES.has(pkg) ? 'dependencies' : 'devDependencies'), name, spec);
  }

  const peers = [...new Set(selected.flatMap(({ packed }) => Object.keys(field(packed, 'peerDependencies'))))].filter(
    /** @returns {name is keyof EXTERNAL_PEERS} */ (name) => Object.hasOwn(EXTERNAL_PEERS, name)
  );
  for (const peer of peers) {
    const where = DEPENDENCY_FIELDS.find((key) => Object.hasOwn(field(next, key), peer));
    if (peer === 'three' || !where) {
      set(where ?? 'dependencies', peer, EXTERNAL_PEERS[peer]);
    } else {
      // An existing react range is the app's choice; doctor checks the installed version (DS021).
      ledger.actions.push({
        verb: 'keep',
        path: MANIFEST_FILE,
        detail: `${where}.${peer} = ${field(next, where)[peer]}`
      });
    }
  }

  set('scripts', 'ds:doctor', DOCTOR_SCRIPT);

  let manifestOverrides = false;
  if (packageManager === 'npm') {
    const internal = new Set(
      selected.flatMap(({ packed }) =>
        Object.keys(field(packed, 'dependencies')).filter((name) => name.startsWith('@egdev/'))
      )
    );
    for (const dependency of internal) {
      own(ledger, {
        file: MANIFEST_FILE,
        object: record('overrides'),
        key: dependency,
        value: `$${dependency}`,
        label: `overrides.${dependency}`,
        force
      });
    }
  } else {
    if (typeof next.packageManager === 'string') {
      ledger.actions.push({ verb: 'keep', path: MANIFEST_FILE, detail: `packageManager = ${next.packageManager}` });
    } else {
      next.packageManager = PNPM_PIN;
      ledger.actions.push({ verb: 'edit', path: MANIFEST_FILE, detail: `packageManager = ${PNPM_PIN}` });
    }
    const pnpm = field(next, 'pnpm');
    const overrides = pnpm.overrides;
    if (isRecord(overrides)) {
      manifestOverrides = true;
      for (const { name, spec } of selected) {
        own(ledger, {
          file: MANIFEST_FILE,
          object: overrides,
          key: name,
          value: spec,
          label: `pnpm.overrides.${name}`,
          force
        });
      }
    }
  }
  return { manifest: next, ledger, manifestOverrides };
}
