import { readFileSync } from 'node:fs';

export type Component = { name: string; package: string; source: string; props: unknown[]; variants: unknown[] };
export type CatalogEntry = { name: string; package: string; level: string; available: boolean; [key: string]: unknown };
export type Token = { name: string; value: string; group: string };
export type Recipe = { id: string; semantics: string; tokens: string[] };
export type Artifact = {
  name: string;
  schemaVersion: string;
  packages: { name: string; version: string }[];
  catalog: CatalogEntry[];
  components: Component[];
  types: unknown[];
  tokens: Token[];
  materialRecipes: Recipe[];
  propNaming: unknown[];
};

export function loadArtifact(
  path: string | URL,
  read: (path: string | URL) => string = (p) => readFileSync(p, 'utf8')
): Artifact {
  try {
    const data: unknown = JSON.parse(read(path));
    if (!data || typeof data !== 'object') {
      throw new Error('expected an object');
    }
    const record = data as Record<string, unknown>;
    for (const key of ['name', 'schemaVersion']) {
      if (typeof record[key] !== 'string') {
        throw new Error(`missing or invalid ${key}`);
      }
    }
    for (const key of ['packages', 'catalog', 'components', 'types', 'tokens', 'materialRecipes', 'propNaming']) {
      if (!Array.isArray(record[key])) {
        throw new Error(`missing or invalid ${key}`);
      }
    }
    return data as Artifact;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`${path}: ${reason.replace(/[\r\n]+/g, ' ')}`);
  }
}

export function versionBlock(data: Artifact) {
  return { name: data.name, schemaVersion: data.schemaVersion, packages: data.packages };
}
