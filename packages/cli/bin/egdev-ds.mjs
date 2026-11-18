#!/usr/bin/env node
import { run } from '../src/cli.mjs';

// Loading the consumer allowlist with type stripping (Q5) can warn about a typeless package.json;
// stderr is reserved for errors (spec §4), so only those expected warnings are dropped.
process.removeAllListeners('warning');
process.on('warning', (warning) => {
  const code = 'code' in warning ? warning.code : undefined;
  const typeStripping = warning.name === 'ExperimentalWarning' && /type strip/i.test(warning.message);
  if (code !== 'MODULE_TYPELESS_PACKAGE_JSON' && !typeStripping) {
    process.stderr.write(`${warning.name}: ${warning.message}\n`);
  }
});

process.exitCode = await run(process.argv.slice(2), {
  cwd: process.cwd(),
  stdout: (text) => process.stdout.write(text),
  stderr: (text) => process.stderr.write(text)
});
