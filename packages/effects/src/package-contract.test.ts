import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const manifest = JSON.parse(readFileSync(resolve(process.cwd(), 'packages/effects/package.json'), 'utf8'));

describe('@egdev/effects package contract', () => {
  it('exposes only its built root and stylesheet and publishes dist', () => {
    expect(manifest.main).toBe('./dist/index.js');
    expect(manifest.types).toBe('./dist/index.d.ts');
    expect(manifest.exports).toEqual({
      '.': { types: './dist/index.d.ts', import: './dist/index.js' },
      './styles.css': './dist/styles.css'
    });
    expect(manifest.files).toEqual(['dist']);
    expect(manifest.sideEffects).toEqual(['**/*.css']);
  });

  it('retains the approved dependency and required-peer boundaries', () => {
    expect(manifest.dependencies).toEqual({ '@egdev/ui': 'workspace:*', 'class-variance-authority': '0.7.1' });
    expect(manifest.peerDependencies).toEqual({
      '@egdev/tokens': 'workspace:*',
      react: '>=18.0.0',
      'react-dom': '>=18.0.0',
      three: '0.160.0'
    });
    expect(manifest.devDependencies).toEqual({
      '@types/react': '19.3.0',
      '@types/react-dom': '19.3.0',
      '@types/three': '0.160.0',
      react: '19.3.0',
      'react-dom': '19.3.0',
      three: '0.160.0'
    });
  });
});
