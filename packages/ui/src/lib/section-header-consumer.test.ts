// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { expect, it } from 'vitest';

it('typechecks the exact SectionHeader packed fixture against the public source barrel', () => {
  const fixture = readFileSync(new URL('../../../../scripts/package-consumption.test.mjs', import.meta.url), 'utf8');
  const start = fixture.indexOf('// SectionHeader stays outside App');
  const end = fixture.indexOf('// TerminalCard samples stay outside App', start);
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  const code = [
    "import { createElement, createRef } from 'react';",
    "import { SectionHeader, type SectionHeaderProps, type SectionHeaderText, type SectionHeaderTextRun, type SectionHeaderVariant, type SectionHeaderLevel, type SectionHeaderTone } from '../index';",
    fixture.slice(start, end)
  ].join('\n');
  const virtual = fileURLToPath(new URL('./__section_header_consumer__.ts', import.meta.url));
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const config = ts.readConfigFile(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  // Match the packed fixture's strict mode without adding noUnused checks it does not enable.
  const options = { ...parsed.options, noEmit: true, noUnusedLocals: false, noUnusedParameters: false };
  const host = ts.createCompilerHost(options);
  const original = host.getSourceFile;
  host.getSourceFile = (name, languageVersion, onError, shouldCreateNewSourceFile) =>
    name === virtual
      ? ts.createSourceFile(name, code, languageVersion, true)
      : original(name, languageVersion, onError, shouldCreateNewSourceFile);
  const program = ts.createProgram([virtual], options, host);
  expect(
    ts.getPreEmitDiagnostics(program).map((item) => ts.flattenDiagnosticMessageText(item.messageText, '\n'))
  ).toEqual([]);
}, 30_000);
