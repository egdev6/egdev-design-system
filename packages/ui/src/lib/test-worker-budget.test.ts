// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';

it('keeps the public full-suite command bounded to two default Vitest workers', () => {
  const result = spawnSync('pnpm', ['run', 'test', '--help'], {
    cwd: fileURLToPath(new URL('../../../../', import.meta.url)),
    encoding: 'utf8'
  });
  expect(result.error).toBeUndefined();
  expect(result.status).toBe(0);
  expect(result.stderr).toBe('');
  expect(result.stdout).toMatch(/^> vitest run --maxWorkers=2 --help$/m);
  expect(result.stdout).toContain('Usage:');
});
