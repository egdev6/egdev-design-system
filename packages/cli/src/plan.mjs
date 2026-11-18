// Output formats (spec §4): text for humans, one versioned JSON document for the skill.

/** @typedef {import('./doctor.mjs').DoctorReport} DoctorReport */
/** @typedef {import('./doctor.mjs').Finding} Finding */
/** @typedef {{ dir: string, commit: string } | null} ReleaseSummary */

/**
 * `DS012 error package-lock.json: Integrity mismatch: …`, or without a location `DS014 skipped …`.
 * @param {Finding} finding
 */
export function formatFinding({ code, severity, message, file, line }) {
  const location = file ? `${file}${line ? `:${line}` : ''}: ` : '';
  return `${code} ${severity} ${location}${message}`;
}

/**
 * @param {number} count
 * @param {string} noun
 */
const plural = (count, noun) => `${count} ${noun}${count === 1 ? '' : 's'}`;

/** @param {readonly Finding[]} findings */
export const hasErrors = (findings) => findings.some((finding) => finding.severity === 'error');

/**
 * @param {{ project: string, report: DoctorReport }} input
 * @returns {string}
 */
export function formatDoctorText({ project, report }) {
  const { packageManager, framework, cssMode, findings } = report;
  /** @param {import('./doctor.mjs').Severity} severity */
  const count = (severity) => findings.filter((finding) => finding.severity === severity).length;
  return [
    `egdev-ds doctor ${project} (${packageManager ?? 'unknown'}, ${framework ?? 'unknown'}, ${cssMode ?? 'unknown'})`,
    ...findings.map(formatFinding),
    `${plural(count('error'), 'error')}, ${plural(count('warning'), 'warning')}, ${count('skipped')} skipped.`,
    ''
  ].join('\n');
}

/**
 * @param {{ project: string, report: DoctorReport, release: ReleaseSummary }} input
 * @returns {string}
 */
export function formatDoctorJson({ project, report, release }) {
  const document = {
    schemaVersion: 1,
    command: 'doctor',
    project,
    packageManager: report.packageManager,
    framework: report.framework,
    cssMode: report.cssMode,
    release,
    actions: [],
    findings: report.findings,
    result: hasErrors(report.findings) ? 'failed' : 'current'
  };
  return `${JSON.stringify(document, null, 2)}\n`;
}
