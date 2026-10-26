import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import manifest from '../package.json' with { type: 'json' };

// Build first. Network installs are isolated; allow up to six minutes per React version.
// No workspace links, source aliases, skipped declaration checks, or permanent dependencies.
const root = fileURLToPath(new URL('../', import.meta.url));
const versions = {
  '18.3.1': ['18.3.12', '18.3.1'],
  '19.3.0': [manifest.devDependencies['@types/react'], manifest.devDependencies['@types/react-dom']]
};
function run(cwd, command, args, timeout) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', timeout, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(
    result.status,
    0,
    `${command} ${args.join(' ')} failed (${result.error ?? result.signal}):\n${result.stdout}\n${result.stderr}`
  );
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
  return result.stdout.trim();
}

const consumer = `
import { createElement, createRef, forwardRef } from 'react';
import type { ComponentProps, ComponentPropsWithoutRef, ComponentRef } from 'react';
import { AspectRatio, Cluster, Divider, Gauge, Kbd, Label, Skeleton, Slot, Slottable, Spinner, Stack, Surface, VisuallyHidden, surfaceVariants } from '@egdev/ui';
import type {
  AspectRatioProps,
  DividerOrientation,
  DividerProps,
  GaugeProps,
  GaugeState,
  GaugeSize,
  KbdProps,
  LabelProps,
  LabelVariant,
  SkeletonProps,
  SkeletonSize,
  SkeletonVariant,
  SlotProps,
  SpinnerProps,
  SpinnerSize,
  ClusterProps,
  LayoutGap,
  StackProps,
  SurfaceElevation,
  SurfacePadding,
  SurfaceProps,
  SurfaceRadius,
  SurfaceTone,
  VisuallyHiddenProps
} from '@egdev/ui';
const slotProps: SlotProps = { 'aria-label': 'Composed documentation' };
export function SlotSample() {
  return createElement(Slot, slotProps,
    createElement('span', { 'aria-hidden': true }, '→'),
    createElement(Slottable, null, createElement('a', { href: '#composition' }, 'Documentation')));
}
export const slotReference = createElement(Slot, { ref: createRef<HTMLElement>() },
  createElement('a', { ref: createRef<HTMLAnchorElement>(), href: '#composition' }, 'Reference'));
// @ts-expect-error Slot itself does not expose an asChild prop.
const unsupportedSlotComposition: SlotProps = { asChild: true };
const unsupportedGaugeRef = createRef<HTMLDivElement>();
const icon = createElement('svg', { viewBox: '0 0 24 24' }, createElement('path', { d: 'M1 1h2v2H1z' }));
const gaugeState: GaugeState = 'warning';
const gaugeSize: GaugeSize = 'sm';
export const aspectWideRef = createRef<HTMLDivElement>();
export const aspectDefaults: AspectRatioProps = {};
export const aspectWide: AspectRatioProps = {
  ratio: 16 / 9, className: 'grid', id: 'media-wide', title: 'Wide media'
};
export function AspectSamples({ wideRatio = 16 / 9 }: { wideRatio?: number }) {
  return createElement('section', { 'aria-label': 'Media frames' },
    createElement(AspectRatio, { id: 'media-square', 'aria-label': 'Square media' }, 'Square content'),
    createElement(AspectRatio, { ...aspectWide, ratio: wideRatio, ref: aspectWideRef },
      createElement('img', { alt: 'Wide media', src: 'wide.png' })));
}
// The public ref is HTMLElement: it hosts the default span or the slotted HTML element, never an inference.
export const hiddenNoteRef = createRef<HTMLElement>();
export const slottedHeadingRef = createRef<HTMLElement>();
// A compliant custom child forwards props and its ref to one non-focusable HTML host.
const HiddenHeading = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<'h2'>>((headingProps, ref) =>
  createElement('h2', { ...headingProps, ref })
);
const labelVariant: LabelVariant = 'choice';
export const labelDefaults: LabelProps = { children: 'Email address', htmlFor: 'consumer-email' };
export const labelChoice: LabelProps = {
  children: 'Choose a plan',
  htmlFor: 'consumer-plan',
  id: 'consumer-plan-label',
  variant: labelVariant
};
// The forwarded ref targets the native label element.
export const labelReference = createElement(Label, { ...labelDefaults, ref: createRef<HTMLLabelElement>() });
export function LabelSamples() {
  return createElement('div', { 'aria-label': 'Label samples' }, createElement(Label, labelDefaults), createElement(Label, labelChoice));
}
export const gaugeDefaults: GaugeProps = { label: 'Capacity', value: 42.5 };
export const gaugeWarning: GaugeProps = {
  label: 'Warning capacity', value: 42.5, state: gaugeState, stateText: 'Review capacity',
  valueText: '42.5 capacity units', size: 64.5, center: 0
};
export function GaugeSamples({ value = 42.5 }: { value?: number }) {
  return createElement('section', { 'aria-label': 'Measurements' },
    createElement(Gauge, { ...gaugeDefaults, value }),
    createElement(Gauge, gaugeWarning),
    createElement(Gauge, { label: 'Small capacity', value: 25, size: gaugeSize, center: icon }),
    createElement(Gauge, { label: 'Named capacity', value: 25, center: 'OK' })
  );
}
export const hiddenNote: VisuallyHiddenProps = {
  id: 'capacity-hint', className: 'consumer-hint', title: 'Screen reader hint', lang: 'en',
  children: 'All capacity values are percentages'
};
const skeletonVariant: SkeletonVariant = 'circle';
const skeletonSize: SkeletonSize = 'lg';
export const skeletonDefaults: SkeletonProps = { variant: 'line', size: 'md' };
export const skeletonStatic: SkeletonProps = { variant: 'line', size: 'md', pulse: false };
export const skeletonNative: SkeletonProps = {
  id: 'consumer-skeleton', title: 'Decorative placeholder', lang: 'en', className: 'consumer-skeleton'
};
export function SkeletonSamples() {
  const geometry: [SkeletonVariant, SkeletonSize][] = [
    ['line', 'sm'], ['line', 'md'], ['line', 'lg'],
    ['block', 'sm'], ['block', 'md'], ['block', 'lg'],
    ['circle', 'sm'], ['circle', 'md'], ['circle', 'lg']
  ];
  return createElement('section', { 'aria-label': 'Loading placeholders' },
    geometry.map(([variant, size]) => createElement(Skeleton, { key: variant + '-' + size, variant, size })),
    createElement(Skeleton, { variant: 'line', size: 'md', id: 'line-width', title: 'Line width override', className: 'w-3/4' }),
    createElement(Skeleton, { variant: 'block', size: 'md', id: 'block-width', className: 'w-1/2' }),
    createElement(Skeleton, { variant: 'line', size: 'md', id: 'pulse-default' }),
    createElement(Skeleton, { variant: 'line', size: 'md', id: 'pulse-static', pulse: false }),
    createElement(Skeleton, skeletonNative));
}
export const spinnerStatus: SpinnerProps = { label: 'Loading results', id: 'spinner-status' };
export const spinnerNative: SpinnerProps = {
  id: 'consumer-spinner', title: 'Uploading', lang: 'en', className: 'ms-2 consumer-spinner'
};
export function SpinnerSamples({ loading = true }: { loading?: boolean }) {
  const sizes: SpinnerSize[] = ['sm', 'md', 'lg'];
  return createElement('section', { 'aria-label': 'Activity indicators' },
    createElement(Spinner, spinnerStatus),
    sizes.map((size) => createElement(Spinner, { key: size, size, id: 'spinner-' + size })),
    // The host owns busy state; its spinner stays decorative and unmounts with loading.
    createElement('p', { id: 'busy-save', 'aria-busy': loading },
      loading ? createElement(Spinner, { size: 'sm' }) : null, 'Saving draft'),
    createElement(Spinner, spinnerNative));
}
export const kbdSymbol: KbdProps = { children: '⌘K', label: 'Command K', id: 'kbd-command' };
export const kbdNative: KbdProps = {
  children: 'Esc', id: 'kbd-native', title: 'Close dialog', className: 'ms-1 ms-2 consumer-kbd'
};
export function KbdSamples() {
  // One Kbd per key; the consumer composes combos with plain text separators (D3).
  return createElement('p', { id: 'kbd-hint' },
    'Press ', createElement(Kbd, kbdSymbol), ' or ',
    createElement(Kbd, { children: 'Ctrl', id: 'kbd-ctrl' }), ' + ',
    createElement(Kbd, { children: 'K', label: '', id: 'kbd-k' }), ' to search. ',
    createElement(Kbd, kbdNative));
}
export function VisuallyHiddenSamples() {
  return createElement('section', { 'aria-label': 'Hidden support content' },
    createElement(VisuallyHidden, { ...hiddenNote, ref: hiddenNoteRef }),
    createElement(VisuallyHidden, { asChild: true, ref: slottedHeadingRef,
      children: createElement('h2', { id: 'hidden-heading' }, 'Measurement details') }),
    createElement(VisuallyHidden, { asChild: true,
      children: createElement(HiddenHeading, { id: 'forwarded-heading' }, 'Forwarded details') }));
}
export const stackDefaults: StackProps = { gap: 4 };
export const clusterRow: ClusterProps = { gap: 6, alignItems: 'start', justifyContent: 'between' };
type LayoutSampleProps = { stackGap?: LayoutGap };
export function LayoutSamples({ stackGap = 4 }: LayoutSampleProps) {
  return createElement('section', { 'aria-label': 'Layout containers' },
    createElement(Stack, { ...stackDefaults, gap: stackGap, 'aria-label': 'Token sections' },
      createElement('p', { id: 'stack-first' }, 'First section'),
      createElement('p', { id: 'stack-second' }, 'Second section')),
    createElement(Cluster, { ...clusterRow, 'aria-label': 'Token actions' },
      createElement('button', { type: 'button' }, 'Action one'),
      createElement('button', { type: 'button' }, 'Action two')));
}
// Surface: a div ref by default; an HTMLElement ref on the actual slotted host with asChild.
export const surfaceDivRef = createRef<HTMLDivElement>();
export const surfaceSectionRef = createRef<HTMLElement>();
export const surfaceArticleRef = createRef<HTMLElement>();
export const surfaceArticleChildRef = createRef<HTMLElement>();
const SurfaceArticle = forwardRef<HTMLElement, ComponentPropsWithoutRef<'article'>>((articleProps, ref) =>
  createElement('article', { ...articleProps, ref })
);
const surfaceTone: SurfaceTone = 'surface-2';
const surfacePadding: SurfacePadding = 'sm';
const surfaceRadius: SurfaceRadius = 'none';
export const surfaceBand: SurfaceProps = { tone: surfaceTone, elevation: 0, radius: surfaceRadius, padding: surfacePadding };
export const surfaceBandRecipe: string = surfaceVariants({ tone: 'surface-2', elevation: 0, radius: 'none' });
export function SurfaceSamples({ surfaceElevation = 1 }: { surfaceElevation?: SurfaceElevation }) {
  return createElement('section', { 'aria-label': 'Material surfaces' },
    createElement(Surface, { 'aria-label': 'Material card', elevation: surfaceElevation, ref: surfaceDivRef }, 'Card'),
    createElement(Surface, { ...surfaceBand, 'aria-label': 'Header band', className: 'w-full' }, 'Band'),
    createElement(Surface, { tone: 'overlay', 'aria-label': 'Glass panel' }, 'Glass'),
    // The slotted branch requires its single element child in props, as for VisuallyHidden.
    createElement(Surface, { tone: 'well', asChild: true, ref: surfaceSectionRef,
      children: createElement('section', { 'aria-label': 'Recessed section' }, 'Well') }),
    createElement(Surface, { tone: 'surface-3', asChild: true, ref: surfaceArticleRef,
      children: createElement(SurfaceArticle, { 'aria-label': 'Article surface', ref: surfaceArticleChildRef }, 'Entry') }));
}
export const dividerDefaults: DividerProps = {};
export const dividerSemanticVertical: DividerProps = {
  orientation: 'vertical', decorative: false, className: 'consumer-rule'
};
const dividerOrientation: DividerOrientation = 'vertical';
export function DividerSamples({ semantic }: { semantic?: boolean }) {
  return createElement('section', { 'aria-label': 'Separations' },
    // Fixed empty span: no children, no ref and no ARIA overrides reach the host.
    createElement(Divider, dividerDefaults),
    createElement(Divider, dividerSemanticVertical),
    createElement(Divider, semantic
      ? { orientation: dividerOrientation, decorative: false, className: 'consumer-rule' }
      : { className: 'consumer-rule' }));
}
export function App({ gaugeValue, wideRatio, stackGap, surfaceElevation, dividerSemantic, spinnerLoading }: { gaugeValue?: number; wideRatio?: number; stackGap?: LayoutGap; surfaceElevation?: SurfaceElevation; dividerSemantic?: boolean; spinnerLoading?: boolean } = {}) {
  // Intrinsic controls are consumer harness elements, not additional SDK components.
  return createElement('main', null,
    createElement('button', { type: 'button' }, 'Before measurements'),
    createElement('input', { id: 'consumer-email', type: 'email' }),
    createElement(GaugeSamples, { value: gaugeValue }),
    createElement(AspectSamples, { wideRatio }),
    createElement(LayoutSamples, { stackGap }),
    createElement(SurfaceSamples, { surfaceElevation }),
    createElement(VisuallyHiddenSamples),
    createElement(DividerSamples, { semantic: dividerSemantic }),
    createElement(LabelSamples),
    createElement(SkeletonSamples),
    createElement(SpinnerSamples, { loading: spinnerLoading }),
    createElement(KbdSamples),
    createElement('button', { type: 'button' }, 'After measurements'));
}
// @ts-expect-error Skeleton is decorative: it never accepts content.
const skeletonChildren: SkeletonProps = { children: 'Not permitted' };
// @ts-expect-error Skeleton never renders markup; hidden actions stay impossible.
const skeletonMarkup: SkeletonProps = { dangerouslySetInnerHTML: { __html: '<button>Hidden action</button>' } };
// @ts-expect-error Skeleton has no public ref API on either React major.
const referencedSkeleton: SkeletonProps = { ref: createRef<HTMLSpanElement>() };
// @ts-expect-error Skeleton cannot delegate its decorative span to a child.
const slottedSkeleton: SkeletonProps = { asChild: true };
// @ts-expect-error Skeleton owns decorative semantics; status regions are host decisions.
const semanticSkeleton: SkeletonProps = { role: 'status' };
// @ts-expect-error Hiddenness is component-owned and always true.
const overriddenSkeleton: SkeletonProps = { 'aria-hidden': false };
// @ts-expect-error Decorative placeholders never announce or report busy state.
const liveSkeleton: SkeletonProps = { 'aria-live': 'polite', 'aria-busy': true };
// @ts-expect-error Placeholders are not interactive or labelled.
const actionableSkeleton: SkeletonProps = { 'aria-label': 'Loading', tabIndex: 0, contentEditable: true };
// @ts-expect-error Placeholder geometry is preset-owned; numeric sizes are not supported.
const numericSkeleton: SkeletonProps = { variant: 'circle', size: 16 };
// @ts-expect-error pulse is a boolean switch, not a preset string.
const skeletonPulsePreset: SkeletonProps = { pulse: 'false' };
// @ts-expect-error Arbitrary silhouettes and presets are not part of Skeleton's API.
const invalidSkeleton: SkeletonProps = { variant: 'xl', size: 'xl' };
// @ts-expect-error Spinner content is component-owned: the arc and optional label only.
const spinnerChildren: SpinnerProps = { children: 'Loading' };
// @ts-expect-error Spinner derives status or decorative semantics from label.
const spinnerRole: SpinnerProps = { role: 'alert' };
// @ts-expect-error Hiddenness follows the label; consumers cannot override it.
const spinnerHidden: SpinnerProps = { 'aria-hidden': false };
// @ts-expect-error The status region is polite by role; live politeness is not configurable.
const spinnerLive: SpinnerProps = { 'aria-live': 'assertive' };
// @ts-expect-error Spinner has no public ref API (D10).
const referencedSpinner: SpinnerProps = { ref: createRef<HTMLSpanElement>() };
// @ts-expect-error Spinner cannot delegate its root to a child.
const slottedSpinner: SpinnerProps = { asChild: true };
// @ts-expect-error Sizes are Icon-scale presets; numeric sizes are not supported.
const numericSpinner: SpinnerProps = { size: 24 };
// @ts-expect-error Only sm, md and lg presets exist.
const invalidSpinner: SpinnerProps = { size: 'xl' };
// @ts-expect-error Color is inherited through currentColor; there is no tone prop (D5).
const tonedSpinner: SpinnerProps = { tone: 'brand' };
// @ts-expect-error Kbd key text is required.
const missingKbdText: KbdProps = { label: 'Command K' };
// @ts-expect-error Kbd children are plain text, not elements.
const elementKbd: KbdProps = { children: createElement('span', null, 'K') };
// @ts-expect-error Kbd never renders markup.
const markupKbd: KbdProps = { children: 'K', dangerouslySetInnerHTML: { __html: '<b>K</b>' } };
// @ts-expect-error Kbd has no public ref API (D5).
const referencedKbd: KbdProps = { children: 'K', ref: createRef<HTMLElement>() };
// @ts-expect-error Kbd cannot delegate its root to a child.
const slottedKbd: KbdProps = { children: 'K', asChild: true };
// @ts-expect-error Kbd has a single flat treatment; there are no variants (D4).
const variantKbd: KbdProps = { children: 'K', variant: 'raised' };
// @ts-expect-error Hidden content is required, not optional.
const missingHiddenChildren: VisuallyHiddenProps = { id: 'orphan-hint' };
// @ts-expect-error VisuallyHidden inherits span props; the anchor-only href is rejected.
const anchorHiddenProps: VisuallyHiddenProps = { href: '#capacity', children: 'Skip to capacity' };
export function verifyHiddenRefType(host: ComponentRef<typeof VisuallyHidden>) {
  const htmlHost: HTMLElement = host;
  // @ts-expect-error The public ref is HTMLElement; an h2-specific host is never inferred.
  const headingHost: HTMLHeadingElement = host;
  return htmlHost;
}
// @ts-expect-error A passive measurement still requires an accessible name.
const unnamedGauge: GaugeProps = { value: 42 };
// @ts-expect-error A label does not replace the controlled measurement.
const missingGaugeValue: GaugeProps = { label: 'Capacity' };
// @ts-expect-error Non-normal conditions require visible stateText.
const unexplainedWarning: GaugeProps = { label: 'Capacity', value: 42, state: 'warning' };
// @ts-expect-error Critical conditions also require visible stateText.
const unexplainedCritical: GaugeProps = { label: 'Capacity', value: 42, state: 'critical' };
// @ts-expect-error Muted is a condition, not disabled semantics, and requires stateText.
const unexplainedMuted: GaugeProps = { label: 'Capacity', value: 42, state: 'muted' };
// @ts-expect-error Gauge has no public ref API on either React major.
const referencedGauge: GaugeProps = { label: 'Capacity', value: 42, ref: unsupportedGaugeRef };
// @ts-expect-error Gauge cannot delegate its meter semantics to a child.
const slottedGauge: GaugeProps = { label: 'Capacity', value: 42, asChild: true };
// @ts-expect-error A passive measurement does not expose click actions.
const actionableGauge: GaugeProps = { label: 'Capacity', value: 42, onClick: () => {} };
// @ts-expect-error Arbitrary presets are not part of Gauge's size API.
const invalidGaugeSize: GaugeProps = { label: 'Capacity', value: 42, size: 'xl' };
// @ts-expect-error Gauge owns passive meter semantics.
const interactiveGauge: GaugeProps = { label: 'Capacity', value: 42, role: 'button' };
// @ts-expect-error AspectRatio never delegates its element to a child.
const slottedAspect: AspectRatioProps = { asChild: true };
// @ts-expect-error Ratio must be a number, not a preset string.
const stringAspectRatio: AspectRatioProps = { ratio: '16 / 9' };
// @ts-expect-error Divider owns its separator semantics.
const dividerRole: DividerProps = { role: 'separator' };
// @ts-expect-error Divider renders a fixed empty span; children are not public.
const dividerChildren: DividerProps = { children: null };
// @ts-expect-error Composition through asChild is not public.
const dividerAsChild: DividerProps = { asChild: true };
// @ts-expect-error Hiding a boundary is not a consumer decision.
const dividerAriaHidden: DividerProps = { 'aria-hidden': true };
// @ts-expect-error Radix derives ARIA orientation from the orientation prop.
const dividerAriaOrientation: DividerProps = { 'aria-orientation': 'vertical' };
// @ts-expect-error A passive rule never becomes a Tab stop.
const dividerTabIndex: DividerProps = { tabIndex: 0 };
// @ts-expect-error Divider owns its empty rule content.
const dividerHtml: DividerProps = { dangerouslySetInnerHTML: { __html: '<hr />' } };
// @ts-expect-error Divider has no public ref API on either React major.
const referencedDivider: DividerProps = { ref: unsupportedGaugeRef };
// @ts-expect-error Only horizontal and vertical axes exist.
const diagonalDivider: DividerProps = { orientation: 'diagonal' };

// @ts-expect-error A visible label requires content.
const emptyLabel: LabelProps = { htmlFor: 'consumer-email' };
// @ts-expect-error Arbitrary typography presets are not part of the Label API.
const invalidLabelVariant: LabelProps = { children: 'Email address', htmlFor: 'consumer-email', variant: 'compact' };
// @ts-expect-error Label composes native content and has no asChild delegation.
const slottedLabel: LabelProps = { children: 'Email address', htmlFor: 'consumer-email', asChild: true };
// @ts-expect-error Gap keys are exact spacing tokens, not arbitrary pixel lengths.
const arbitraryStackGap: StackProps = { gap: 9 };
// @ts-expect-error Unsupported alignment choices are rejected by the union type.
const invalidClusterAlignment: ClusterProps = { alignItems: 'around' };
// @ts-expect-error A well is always recessed; it rejects elevation.
const elevatedWell: SurfaceProps = { tone: 'well', elevation: 2 };
// @ts-expect-error An overlay always floats at level 3; it rejects elevation.
const elevatedOverlay: SurfaceProps = { tone: 'overlay', elevation: 0 };
// @ts-expect-error Material levels are the approved tones only.
const brandSurface: SurfaceProps = { tone: 'brand' };
// @ts-expect-error asChild needs exactly one element child, not text.
const slottedSurfaceText: SurfaceProps = { asChild: true, children: 'Text' };
// @ts-expect-error The default div promises only an HTMLDivElement ref.
const wideSurfaceRef: ComponentProps<typeof Surface> = { ref: createRef<HTMLElement>() };
`;

// Surface ships no stylesheet: only token-backed CVA utilities, including fallback variants.
function assertSurfaceCSS(css) {
  for (const selector of [
    '.bg-surface-0',
    '.bg-surface-overlay',
    '.border-border-hairline-strong',
    '.backdrop-blur-overlay',
    '.backdrop-saturate-150',
    '.shadow-edge'
  ]) {
    assert.ok(css.includes(selector), 'Missing Surface utility ' + selector);
  }
  for (const value of [
    'background-image: var(--gradient-sheen)',
    '--tw-shadow: var(--shadow-well)',
    '--tw-shadow: var(--shadow-edge), var(--shadow-elev-1)',
    '--tw-shadow: var(--shadow-edge-strong), var(--shadow-elev-3)'
  ]) {
    assert.ok(css.includes(value), 'Surface recipe must emit ' + value);
  }
  assert.match(css, /prefers-reduced-transparency:\s*reduce\)\s*\{\s*\.\\\[\\@media[^{]*bg-surface-2\s*\{/);
  assert.match(
    css,
    /@supports not \(backdrop-filter:[^{]+\{\s*\.not-supports-\\\[backdrop-filter\\\]\\:bg-surface-2\s*\{/
  );
  assert.doesNotMatch(css, /\.eg-surface\s*[,{]/, 'Surface marker must not become a shipped CSS rule');
}

// Reused inside the installed fixture, against shipped CSS and both consumer build paths.
function assertGaugeCSS(css) {
  for (const selector of ['.eg-gauge-arc', '.eg-gauge-center', '.inline-flex', '.gap-2', '.text-label-default']) {
    assert.ok(css.includes(selector), 'Missing Gauge selector ' + selector);
  }
  assert.match(css, /conic-gradient\(var\(--eg-gauge-fill\) calc\(var\(--eg-gauge-value\) \* 1%\)/);
  assert.match(css, /mask:\s*radial-gradient\(/);
  assert.match(css, /\.eg-gauge-center\s*\{[^}]*inset:\s*30%/);
  for (const size of ['space-4', 'space-10', 'space-14', 'space-20', 'eg-gauge-size']) {
    for (const [prefix, property] of [
      ['w', 'width'],
      ['h', 'height']
    ]) {
      assert.ok(
        css.includes('.' + prefix + '-\\[var\\(--' + size + '\\)\\]'),
        'Missing static Gauge dimension ' + size
      );
      assert.ok(css.includes(property + ': var(--' + size + ')'), 'Missing Gauge geometry binding ' + size);
    }
  }
  for (const stroke of ['3px', '4px', '6px']) {
    assert.ok(css.includes('--eg-gauge-stroke: ' + stroke), 'Missing preset stroke ' + stroke);
  }
  assert.match(css, /--eg-gauge-stroke:\s*calc\(var\(--eg-gauge-size\)\s*\/\s*14\)/);
  assert.match(css, /--eg-gauge-track:\s*color-mix\(in oklab,\s*var\(--color-fg-default\)\s*10%,\s*transparent\)/);
  assert.doesNotMatch(css, /--alpha\s*\(/);
  for (const [state, token] of [
    ['warning', 'status-warning'],
    ['critical', 'status-danger'],
    ['muted', 'fg-muted']
  ]) {
    assert.ok(
      css.includes('data-state=' + state) || css.includes('data-state="' + state + '"'),
      'Missing state ' + state
    );
    assert.ok(css.includes('--eg-gauge-fill: var(--color-' + token + ')'), 'Missing state token ' + token);
  }
  for (const selector of [
    '.bg-transparent',
    '.bg-none',
    String.raw`.\[box-shadow\:none\]`,
    String.raw`.rounded-\[var\(--radius-full\)\]`,
    '.border-0',
    '.p-0'
  ]) {
    assert.ok(css.includes(selector), 'Missing native transparent-frame utility ' + selector);
  }
  assert.match(css, /\.bg-transparent\s*\{[^}]*background-color:\s*(?:transparent|#0000(?:0000)?)\s*;/);
  assert.match(css, /\.bg-none\s*\{[^}]*background-image:\s*none\s*;/);
  assert.match(css, /\.\\\[box-shadow\\:none\\\]\s*\{[^}]*box-shadow:\s*none\s*;/);
  assert.match(css, /@layer components\s*\{/);
  assert.match(css, /@layer utilities\s*\{/);
  for (const token of ['space-2', 'font-sans', 'text-label-default', 'color-fg-brand-default', 'radius-full']) {
    assert.ok(css.includes('var(--' + token), 'Gauge must consume token ' + token);
  }
}

// Reused inside the installed fixture, against shipped CSS and both consumer build paths.
function assertDividerCSS(css, bundle) {
  // eg-divider is a stable public marker, not a utility: with no stylesheet the CSS
  // must carry the data-orientation recipes only, and the JS bundle the marker.
  assert.doesNotMatch(css, /\.eg-divider\s*[,{]/, 'Divider marker must not become a CSS rule');
  assert.ok(bundle.includes('eg-divider'), 'Divider JS bundle must carry the stable marker');
  assert.ok(css.includes(String.raw`min-w-0`), 'Missing Divider base guard utility');
  // The horizontal rule fades physically to the right from the brand border token to a 0% stop.
  assert.ok(css.includes(String.raw`bg-linear-to-r`), 'Missing Divider gradient direction');
  assert.match(css, /--tw-gradient-position:\s*to\s+right/, 'Divider fade must be physical to the right');
  assert.match(
    css,
    /--tw-gradient-from:\s*var\(--color-border-brand(?:,\s*[^)]+)?\)/,
    'Divider fade must start at the brand border token'
  );
  assert.match(
    css,
    /--tw-gradient-to:\s*color-mix\([^;]*--color-border-brand[^;]*0%[^;]*transparent\)/,
    'Divider fade must end at a 0% brand stop'
  );
  // Tailwind escapes the data-orientation variant selector; locate the utility
  // class prefix first, then bind the rule body to its attribute selector.
  const rule = (orientation, property, value) => {
    const escaped = `.data-\\[orientation\\=${orientation}\\]\\:`;
    const literal = escaped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const ruleBody = new RegExp(
      literal + '[^\\n]*\\[data-orientation="' + orientation + '"\\]\\s*\\{[^}]*' + property + ':\\s*' + value + '\\s*;'
    );
    // Consumer builds interleave imported layers; test every utility-prefix occurrence.
    let from = 0;
    while (true) {
      const start = css.indexOf(escaped, from);
      if (start === -1) {
        return false;
      }
      if (ruleBody.test(css.slice(start, start + 4000))) {
        return true;
      }
      from = start + escaped.length;
    }
  };
  assert.match(
    css,
    /--tw-gradient-from:\s*var\(--color-border-brand(?:,\s*[^)]+)?\)/,
    'Divider fade must start at the brand border token'
  );
  assert.match(
    css,
    /--tw-gradient-to:\s*color-mix\([^;]*--color-border-brand[^;]*0%[^;]*transparent\)/,
    'Divider fade must end at a 0% brand stop'
  );
  assert.match(css, /--tw-gradient-position:\s*to\s+right/, 'Divider fade must be physical to the right');
  assert.ok(css.includes(String.raw`h-\[var\(--border-width\)\]`), 'Missing horizontal hairline height class');
  assert.ok(css.includes(String.raw`w-\[var\(--border-width\)\]`), 'Missing vertical hairline width class');
  assert.ok(
    rule('horizontal', 'height', 'var\\(--border-width\\)'),
    'Horizontal rule must bind the border-width token'
  );
  assert.ok(rule('vertical', 'width', 'var\\(--border-width\\)'), 'Vertical rule must bind the border-width token');
  assert.ok(rule('horizontal', 'min-width', 'var\\(--space-6\\)'), 'Horizontal rule must keep the space-6 minimum');
  assert.ok(
    rule('vertical', 'min-width', '(?:var\\(--space-0\\)|0px?|0)'),
    'Vertical rule must keep the space-0 minimum'
  );
  assert.ok(rule('horizontal', 'flex', '(?:1\\s+1\\s+auto|auto)'), 'Horizontal rule must flex to available length');
  assert.ok(rule('vertical', 'flex', '(?:none|0\\s+0\\s+auto)'), 'Vertical rule must not flex');
  assert.ok(rule('vertical', 'align-self', 'center'), 'Vertical rule must center on the cross axis');
  assert.ok(
    rule('vertical', 'height', 'calc\\(var\\(--space-1\\)\\s*\\*\\s*4\\.5\\)'),
    'Vertical rule height must derive from space-1'
  );
  assert.ok(
    rule('vertical', 'background-color', 'var\\(--color-border-brand(?:,\\s*var\\(--[a-z0-9-]+\\)\\)?)'),
    'Vertical rule must paint solid brand'
  );
}

function assertLabelCSS(css) {
  for (const selector of ['.text-label-default', '.text-fg-secondary', '.font-sans']) {
    assert.ok(css.includes(selector), 'Missing Label selector ' + selector);
  }
  assert.ok(/var\(--text-label-default--font-weight(?:,\s*600)?\)/.test(css), 'Missing Label base recipe weight token');
  assert.ok(/var\(--text-label-default--line-height(?:,\s*1\.2)?\)/.test(css), 'Missing Label line height token');
  assert.ok(
    css.includes('.font-\\[var\\(--text-body-default--font-weight\\)\\]'),
    'Missing Label choice weight utility'
  );
  assert.match(css, /font-weight:\s*var\(--text-body-default--font-weight\)/, 'Missing Label choice weight binding');
}

// Skeleton ships token-backed silhouette utilities plus the approved pulse animation: no dynamic geometry.
function assertSkeletonCSS(css) {
  for (const dimension of ['h-3', 'h-4', 'h-5', 'h-12', 'h-20', 'h-24', 'size-8', 'size-12', 'size-16']) {
    assert.ok(css.includes('.' + dimension), 'Missing Skeleton geometry utility ' + dimension);
  }
  for (const radius of ['rounded-sm', 'rounded-md', 'rounded-full']) {
    assert.ok(css.includes('.' + radius), 'Missing Skeleton radius utility ' + radius);
  }
  for (const base of ['.block', '.box-border', '.shrink-0', '.w-full', '.bg-border-default', '.border-0', '.p-0']) {
    assert.ok(css.includes(base), 'Missing Skeleton base utility ' + base);
  }
  assert.ok(
    css.includes('background-color: var(--color-border-default, var(--color-primitive-graphite-800))'),
    'Skeleton surface must consume the border token with its exact packed fallback'
  );
  // The v0.2 pulse consumes the canonical --animate-pulse token and stops under reduced motion.
  assert.match(
    css,
    /\.animate-pulse\s*\{[^}]*animation:\s*var\(--animate-pulse[,)]/,
    'Missing the pulse utility bound to the canonical --animate-pulse token'
  );
  assert.ok(css.includes('motion-reduce\\:animate-none'), 'Missing the reduced-motion static override utility');
  // The eg-skeleton marker itself never carries an animation rule; the utility class does.
  assert.doesNotMatch(css, /\.eg-skeleton[^{]*\{[^}]*(?:animation|transition):/, 'Skeleton marker must stay static');
}

// Kbd ships its flat token utilities and the hairline border-style initial value; no Kbd stylesheet.
function assertKbdCSS(css) {
  for (const utility of [
    '.inline-block',
    '.whitespace-nowrap',
    '.rounded-sm',
    '.border-border-subtle',
    '.font-sans',
    '.text-label-default',
    '.text-fg-secondary'
  ]) {
    assert.ok(css.includes(utility), 'Missing Kbd utility ' + utility);
  }
  assert.match(css, /\.border\s*\{[^}]*border-width:\s*1px/, 'Kbd hairline must ship');
  assert.match(
    css,
    /\.px-1\\\.5\s*\{[^}]*padding-inline:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*1\.5\)/,
    'Kbd inline padding'
  );
  assert.match(
    css,
    /\.py-0\\\.5\s*\{[^}]*padding-block:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*0\.5\)/,
    'Kbd block padding'
  );
  assert.match(css, /--tw-border-style:\s*solid/, 'The hairline border style must resolve without Tailwind');
}

// Spinner ships Icon-scale presets, inherited stroke utilities and the canonical spin token with keyframes.
function assertSpinnerCSS(css) {
  for (const utility of [
    '.inline-flex',
    '.shrink-0',
    '.size-4',
    '.size-7',
    '.size-full',
    '.fill-none',
    '.stroke-current'
  ]) {
    assert.ok(css.includes(utility), 'Missing Spinner utility ' + utility);
  }
  assert.match(css, /\.size-\\\(--icon-size\\\)\s*\{[^}]*width:\s*var\(--icon-size\)/, 'md must use --icon-size');
  assert.match(
    css,
    /\.stroke-\\\(length\\:--icon-stroke\\\)\s*\{[^}]*stroke-width:\s*var\(--icon-stroke\)/,
    'Arc stroke must use --icon-stroke'
  );
  assert.match(
    css,
    /\.animate-spin\s*\{[^}]*animation:\s*var\(--animate-spin[,)]/,
    'Missing the spin utility bound to the canonical --animate-spin token'
  );
  assert.match(css, /@keyframes spin\s*\{\s*to\s*\{\s*transform:\s*rotate\(360deg\)/, 'Spin keyframes must ship');
  assert.ok(css.includes('motion-reduce\\:animate-none'), 'Reduced motion must stop the rotation');
  assert.doesNotMatch(css, /\.eg-spinner[^{]*\{/, 'Spinner has no stylesheet: its marker carries no rule');
}

const entries = `
import assert from 'node:assert/strict';
import { readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
const entry = fileURLToPath(import.meta.resolve('@egdev/ui'));
assert.ok(!realpathSync(entry).startsWith(${JSON.stringify(root)}), 'UI must be installed outside the workspace');
const ui = JSON.parse(readFileSync(resolve(dirname(entry), '../package.json'), 'utf8'));
assert.equal(ui.exports['.'].import, './dist/index.js');
assert.equal(ui.exports['.'].types, './dist/index.d.ts');
assert.equal(ui.types, ui.exports['.'].types);
assert.ok(readFileSync(resolve(dirname(entry), 'index.d.ts'), 'utf8').trim(), 'Public declaration must be reachable');
assert.equal(ui.exports['./styles.css'], './dist/styles.css');
const styles = fileURLToPath(import.meta.resolve('@egdev/ui/styles.css'));
assert.ok(!realpathSync(styles).startsWith(${JSON.stringify(root)}), 'CSS must resolve outside the workspace');
const shippedStyles = readFileSync(styles, 'utf8');
assert.doesNotMatch(shippedStyles, /@(import|reference|source|tailwind|theme|custom-variant|apply)\\b/, 'Packed CSS must be ready for native consumption');
assert.ok(shippedStyles.includes('.eg-gauge-arc'), 'Packed styles must retain Gauge geometry');
assert.ok(shippedStyles.includes('.min-w-0'), 'Packed styles must retain the AspectRatio min-width guard');
assert.ok(readFileSync(fileURLToPath(import.meta.resolve('@egdev/ui')), 'utf8').includes('eg-divider'), 'Packed JS must retain the Divider marker');
assert.doesNotMatch(shippedStyles, /\.eg-divider\s*[,{]/, 'Divider marker must not become a shipped CSS rule');
assert.ok(!shippedStyles.includes('.eg-visually-hidden'), 'VisuallyHidden must not add shipped CSS; Radix hides inline');
for (const utility of ['.flex-col', '.flex-nowrap', '.flex-row', '.flex-wrap', '.gap-0', '.gap-4', '.gap-6', '.items-stretch', '.items-start', '.justify-between']) {
  assert.ok(shippedStyles.includes(utility), 'Packed styles must retain layout utility ' + utility);
}
${assertSurfaceCSS.toString()}
assertSurfaceCSS(shippedStyles);
assert.deepEqual(Object.keys(await import('@egdev/ui')).sort(), [
  'AspectRatio',
  'Cluster',
  'Divider',
  'Gauge',
  'Kbd',
  'Label',
  'Portal',
  'Skeleton',
  'Slot',
  'Slottable',
  'Spinner',
  'Stack',
  'Surface',
  'VisuallyHidden',
  'cn',
  'labelVariants',
  'surfaceVariants'
]);
${assertGaugeCSS.toString()}
${assertDividerCSS.toString()}
${assertSkeletonCSS.toString()}
${assertSpinnerCSS.toString()}
${assertKbdCSS.toString()}
assertGaugeCSS(shippedStyles);
assertDividerCSS(shippedStyles, readFileSync(fileURLToPath(import.meta.resolve('@egdev/ui')), 'utf8'));
assertSkeletonCSS(shippedStyles);
assertSpinnerCSS(shippedStyles);
assertKbdCSS(shippedStyles);
${assertLabelCSS.toString()}
assertLabelCSS(shippedStyles);
const theme = readFileSync(fileURLToPath(import.meta.resolve('@egdev/tokens/theme.css')), 'utf8');
for (const [, token] of theme.matchAll(/(--[\\w-]+)\\s*:/g)) {
  assert.doesNotMatch(shippedStyles, new RegExp(token + '\\\\s*:'), 'UI must not redefine canonical token ' + token);
}
const local = createRequire(import.meta.url);
const fromUI = createRequire(entry);
for (const name of ['react', 'react-dom']) {
  assert.equal(realpathSync(local.resolve(name)), realpathSync(fromUI.resolve(name)), name + ' must have one physical instance');
}
assert.ok(ts.preProcessFile(readFileSync(entry, 'utf8')).importedFiles.some(({ fileName }) => /^react($|\\/)/.test(fileName)), 'UI must import external React');
const map = JSON.parse(readFileSync(entry + '.map', 'utf8'));
assert.ok(map.sources.length > 0, 'React exclusion needs a nonempty library source map');
for (const source of map.sources) {
  assert.doesNotMatch(source, /(?:^|\\/)(?:react|react-dom)\\/(?:cjs|index|jsx)/, 'UI must not bundle React implementation');
}
console.log(JSON.stringify({ ui: ui.version, react: (await import('react')).version, dedup: ['react', 'react-dom'], externalReact: true }));
`;

const ssr = `
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { JSDOM } from ${JSON.stringify(import.meta.resolve('jsdom'))};
import { AspectRatio, Divider, Gauge } from '@egdev/ui';
import { App, SlotSample } from './consumer.ts';
const slotDocument = new JSDOM(renderToString(createElement(SlotSample)));
try {
  const target = slotDocument.window.document.body;
  assert.equal(target.children.length, 1);
  assert.equal(target.firstElementChild.tagName, 'A');
  assert.equal(target.firstElementChild.getAttribute('aria-label'), 'Composed documentation');
  assert.equal(target.firstElementChild.textContent, '→Documentation');
  assert.equal(target.firstElementChild.hasAttribute('class'), false);
} finally {
  slotDocument.window.close();
}
const decorativeDivider = new JSDOM(renderToString(createElement(Divider)));
try {
  const host = decorativeDivider.window.document.body;
  assert.equal(host.children.length, 1, 'Divider must render exactly one element');
  const rule = host.firstElementChild;
  assert.equal(rule.tagName, 'SPAN', 'Divider must own one empty span host');
  assert.equal(rule.textContent, '');
  assert.equal(rule.childElementCount, 0, 'Divider must render a fixed empty span');
  assert.ok(rule.className.includes('eg-divider'), 'Divider must keep its stable marker');
  assert.equal(rule.getAttribute('data-orientation'), 'horizontal');
  assert.equal(rule.getAttribute('role'), 'none', 'Decorative default must be Radix role none');
  assert.equal(rule.hasAttribute('aria-orientation'), false);
  assert.equal(rule.hasAttribute('aria-hidden'), false);
  assert.equal(rule.hasAttribute('tabindex'), false);
  assert.equal(rule.hasAttribute('data-state'), false);
} finally {
  decorativeDivider.window.close();
}
const semanticDivider = new JSDOM(renderToString(createElement(Divider, { orientation: 'vertical', decorative: false })));
try {
  const rule = semanticDivider.window.document.body.firstElementChild;
  assert.equal(rule.tagName, 'SPAN');
  assert.equal(rule.textContent, '');
  assert.equal(rule.getAttribute('role'), 'separator', 'Meaningful boundaries must delegate to Radix separator semantics');
  assert.equal(rule.getAttribute('aria-orientation'), 'vertical');
  assert.equal(rule.getAttribute('data-orientation'), 'vertical');
} finally {
  semanticDivider.window.close();
}
const html = renderToString(createElement(App));
for (const text of ['eg-gauge', '<svg', 'role="meter"', 'aria-label="Capacity"', 'Review capacity', 'eg-aspect-ratio', 'min-w-0', 'padding-bottom:100%', 'Email address', 'eg-stack', 'flex-col', 'flex-nowrap', 'gap-4', 'eg-cluster', 'flex-row', 'flex-wrap', 'gap-6', 'items-start', 'justify-between', 'eg-surface', 'bg-surface-1', 'bg-surface-overlay', 'shadow-[var(--shadow-well)]']) {
  assert.ok(html.includes(text), 'SSR must render ' + text);
}
const dom = new JSDOM(html);
try {
  const document = dom.window.document;
  const normal = document.querySelector('.eg-gauge[aria-label="Capacity"]');
  assert.equal(normal.getAttribute('role'), 'meter');
  assert.equal(normal.getAttribute('data-state'), 'normal');
  assert.equal(normal.getAttribute('aria-valuenow'), '42.5');
  assert.equal(normal.getAttribute('aria-valuetext'), '42.5 / 100');
  assert.ok(normal.querySelector('[class*="--space-14"]'), 'Default size must use the md token');
  assert.ok(normal.querySelector('.eg-gauge-center') === null, 'Default center must be absent');
  const warning = document.querySelector('.eg-gauge[aria-label="Warning capacity"]');
  assert.equal(warning.getAttribute('data-state'), 'warning');
  assert.equal(warning.style.getPropertyValue('--eg-gauge-size'), '64.5px');
  assert.equal(warning.getAttribute('aria-valuetext'), '42.5 capacity units');
  assert.equal(document.getElementById(warning.getAttribute('aria-describedby')).textContent, 'Review capacity');
  assert.equal(warning.querySelector('.eg-gauge-center').textContent, '0');
  for (const gauge of document.querySelectorAll('.eg-gauge')) {
    assert.equal(gauge.getAttribute('aria-valuemin'), '0');
    assert.equal(gauge.getAttribute('aria-valuemax'), '100');
    assert.ok(Number.isFinite(Number(gauge.getAttribute('aria-valuenow'))));
    assert.ok(gauge.querySelector('[aria-live], button, a, input, [tabindex]') === null, 'Gauge must stay passive');
    assert.equal(gauge.hasAttribute('aria-live'), false);
    const center = gauge.querySelector('.eg-gauge-center');
    if (center) assert.equal(center.getAttribute('aria-hidden'), 'true');
  }
  const separations = document.querySelector('section[aria-label="Separations"]');
  assert.ok(separations, 'SSR must render the Divider samples section');
  assert.equal(separations.children.length, 3, 'Each Divider usage must render exactly one element');
  assert.equal(separations.children[0].getAttribute('role'), 'none', 'Decorative default must be Radix role none');
  assert.equal(separations.children[0].getAttribute('data-orientation'), 'horizontal');
  assert.equal(separations.children[1].getAttribute('role'), 'separator', 'Meaningful boundaries must delegate to Radix separator semantics');
  assert.equal(separations.children[1].getAttribute('aria-orientation'), 'vertical');
  assert.equal(separations.children[1].getAttribute('data-orientation'), 'vertical');
  assert.ok(separations.children[2].className.includes('eg-divider'), 'Divider must keep its stable marker');
  assert.ok(separations.children[2].className.includes('consumer-rule'), 'Native className must survive');
const square = document.querySelector('#media-square');
const wide = document.querySelector('#media-wide');
assert.ok(square && wide, 'SSR must render AspectRatio samples');
assert.equal(square.tagName, 'DIV');
assert.ok(square.classList.contains('eg-aspect-ratio'), 'AspectRatio must carry its stable marker');
assert.ok(square.classList.contains('min-w-0'), 'AspectRatio must carry its CVA base guard');
assert.equal(square.getAttribute('aria-label'), 'Square media');
assert.equal(square.textContent, 'Square content');
assert.equal(square.style.getPropertyValue('position'), 'absolute', 'The marker div is Radix inner generic div');
const squareFrame = square.parentElement;
assert.equal(squareFrame.getAttribute('data-radix-aspect-ratio-wrapper'), '');
assert.equal(squareFrame.style.getPropertyValue('padding-bottom'), '100%', 'Default ratio must be a square');
assert.equal(wide.parentElement.style.getPropertyValue('padding-bottom'), '56.25%', '16/9 must derive its geometry');
assert.equal(wide.getAttribute('id'), 'media-wide');
assert.equal(wide.parentElement.getAttribute('data-radix-aspect-ratio-wrapper'), '');
assert.equal(wide.querySelector('img')?.getAttribute('alt'), 'Wide media');
for (const frame of [square, wide]) {
  assert.equal(frame.getAttribute('role'), null);
  assert.equal(frame.hasAttribute('aria-live'), false);
  assert.ok(frame.querySelector('[aria-live], button, a, input, [tabindex]') === null, 'Frame must stay passive');
}
  const hiddenNote = document.querySelector('span.eg-visually-hidden');
  assert.ok(hiddenNote, 'Default VisuallyHidden must render the stable span marker');
  assert.equal(hiddenNote.id, 'capacity-hint');
  assert.ok(hiddenNote.className.includes('consumer-hint'), 'Native span attributes must survive');
  for (const decl of ['position:absolute', 'clip:rect(0, 0, 0, 0)', 'width:1px', 'overflow:hidden']) {
    assert.ok(hiddenNote.getAttribute('style').includes(decl), 'Hidden note must carry inline geometry ' + decl);
  }
  assert.equal(hiddenNote.textContent, 'All capacity values are percentages');
  const slottedHeading = document.getElementById('hidden-heading');
  assert.equal(slottedHeading.tagName, 'H2', 'asChild must slot the hiding geometry onto the h2 host');
  assert.ok(slottedHeading.className.includes('eg-visually-hidden'));
  assert.ok(slottedHeading.getAttribute('style').includes('clip:rect(0, 0, 0, 0)'));
  const forwardedHeading = document.getElementById('forwarded-heading');
  assert.equal(forwardedHeading.tagName, 'H2', 'A forwarding child must reach one HTML host');
  assert.ok(forwardedHeading.className.includes('eg-visually-hidden'));
  assert.ok(document.querySelector('.eg-visually-hidden span') === null, 'No nested wrapper span may remain');
  const shapes = [...document.querySelectorAll('section[aria-label="Loading placeholders"] > .eg-skeleton')];
  assert.equal(shapes.length, 14, 'All nine presets, two width overrides, two pulse samples and the native sample must render');
  const expectedGeometry = [
    ['h-3', 'rounded-sm'],
    ['h-4', 'rounded-sm'],
    ['h-5', 'rounded-sm'],
    ['h-12', 'rounded-md'],
    ['h-20', 'rounded-md'],
    ['h-24', 'rounded-md'],
    ['size-8', 'rounded-full'],
    ['size-12', 'rounded-full'],
    ['size-16', 'rounded-full']
  ];
  expectedGeometry.forEach(([dimension, radius], index) => {
    const classes = shapes[index].className.split(' ');
    assert.ok(classes.includes(dimension), 'Skeleton ' + index + ' must carry ' + dimension);
    assert.ok(classes.includes(radius), 'Skeleton ' + index + ' must carry ' + radius);
  });
  for (const shape of shapes) {
    assert.equal(shape.tagName, 'SPAN');
    assert.equal(shape.getAttribute('aria-hidden'), 'true');
    assert.equal(shape.textContent, '');
    assert.equal(shape.getAttribute('role'), null);
    assert.equal(shape.getAttribute('tabindex'), null);
    assert.equal(shape.hasAttribute('aria-live'), false);
    assert.equal(shape.hasAttribute('data-state'), false);
    assert.equal(shape.className.includes('animate-pulse'), shape.id !== 'pulse-static', 'Skeleton pulse state mismatch');
    assert.equal(shape.hasAttribute('pulse'), false, 'The pulse switch must never reach the DOM');
  }
  // Class-string comparison only: never pass DOM nodes to deep equality.
  const pulseDefault = document.getElementById('pulse-default');
  const pulseStatic = document.getElementById('pulse-static');
  assert.ok(pulseDefault && pulseStatic, 'Missing pulse samples');
  assert.ok(
    pulseDefault.className.includes('animate-pulse') && pulseDefault.className.includes('motion-reduce:animate-none'),
    'The default Skeleton must pulse with the reduced-motion opt-out'
  );
  const pulsingClasses = pulseDefault.className
    .split(' ')
    .filter((name) => name !== 'animate-pulse' && name !== 'motion-reduce:animate-none')
    .sort()
    .join(' ');
  assert.equal(
    pulseStatic.className.split(' ').sort().join(' '),
    pulsingClasses,
    'pulse:false must render exactly the static v0.1 class string'
  );
  for (const [id, override] of [['line-width', 'w-3/4'], ['block-width', 'w-1/2']]) {
    const shape = document.getElementById(id);
    assert.ok(shape, 'Missing width override sample ' + id);
    assert.ok(shape.className.includes(override), id + ' must keep the consumer width');
    assert.ok(!shape.className.includes('w-full'), id + ' must replace the preset full width');
  }
  const nativeSkeleton = document.getElementById('consumer-skeleton');
  assert.equal(nativeSkeleton.getAttribute('title'), 'Decorative placeholder');
  assert.ok(nativeSkeleton.className.includes('consumer-skeleton'), 'Native span class merge must survive');
  assert.equal(nativeSkeleton.getAttribute('lang'), 'en');
  const indicators = document.querySelector('section[aria-label="Activity indicators"]');
  assert.ok(indicators, 'SSR must render Spinner samples');
  const spinners = [...indicators.querySelectorAll('.eg-spinner')];
  assert.equal(spinners.length, 6, 'Status, three presets, busy-host and native Spinners must render');
  const spinnerStatus = document.getElementById('spinner-status');
  assert.equal(spinnerStatus.getAttribute('role'), 'status');
  assert.equal(spinnerStatus.hasAttribute('aria-hidden'), false);
  assert.equal(spinnerStatus.textContent, 'Loading results', 'The label is the only text of the status');
  assert.equal(indicators.querySelectorAll('[role="status"]').length, 1, 'Only the labelled Spinner is a live region');
  for (const [size, utility] of [['sm', 'size-4'], ['md', 'size-(--icon-size)'], ['lg', 'size-7']]) {
    const sized = document.getElementById('spinner-' + size);
    assert.ok(sized.className.split(' ').includes(utility), 'Spinner ' + size + ' must carry ' + utility);
    assert.equal(sized.getAttribute('aria-hidden'), 'true', 'Unlabelled Spinners are decorative');
    assert.equal(sized.getAttribute('role'), null);
  }
  for (const spinner of spinners) {
    const arc = spinner.querySelector('svg');
    assert.equal(arc.getAttribute('aria-hidden'), 'true');
    assert.ok(arc.getAttribute('class').includes('animate-spin motion-reduce:animate-none'), 'Arc must rotate via the token');
    assert.equal(spinner.getAttribute('tabindex'), null);
    assert.equal(spinner.hasAttribute('aria-live'), false);
    assert.equal(spinner.hasAttribute('data-state'), false);
  }
  const busyHost = document.getElementById('busy-save');
  assert.equal(busyHost.getAttribute('aria-busy'), 'true', 'The host owns busy state');
  assert.equal(busyHost.querySelector('.eg-spinner').getAttribute('aria-hidden'), 'true');
  const nativeSpinner = document.getElementById('consumer-spinner');
  assert.equal(nativeSpinner.getAttribute('title'), 'Uploading');
  assert.equal(nativeSpinner.getAttribute('lang'), 'en');
  assert.ok(nativeSpinner.className.endsWith('ms-2 consumer-spinner'), 'Consumer layout classes merge last');
  const kbdHint = document.getElementById('kbd-hint');
  assert.ok(kbdHint, 'SSR must render Kbd samples');
  const keys = [...kbdHint.querySelectorAll('kbd.eg-kbd')];
  assert.equal(keys.length, 4, 'One native kbd per key');
  assert.equal(kbdHint.textContent, 'Press ⌘KCommand K or Ctrl + K to search. Esc');
  const commandKey = document.getElementById('kbd-command');
  assert.equal(commandKey.children.length, 2, 'A labelled key renders a hidden glyph and hidden spoken text');
  assert.equal(commandKey.children[0].getAttribute('aria-hidden'), 'true');
  assert.equal(commandKey.children[0].textContent, '⌘K');
  assert.equal(commandKey.children[1].textContent, 'Command K');
  assert.equal(commandKey.children[1].hasAttribute('aria-hidden'), false);
  assert.ok(commandKey.children[1].getAttribute('style').includes('clip:rect(0, 0, 0, 0)'), 'Spoken name is visually hidden');
  for (const id of ['kbd-ctrl', 'kbd-k']) {
    const plain = document.getElementById(id);
    assert.equal(plain.children.length, 0, 'Plain and empty-label keys read their text as-is');
    assert.equal(plain.querySelector('[aria-hidden]'), null);
  }
  for (const key of keys) {
    assert.equal(key.getAttribute('role'), null);
    assert.equal(key.getAttribute('aria-label'), null);
    assert.equal(key.getAttribute('tabindex'), null);
    assert.equal(key.hasAttribute('data-state'), false);
  }
  const nativeKbd = document.getElementById('kbd-native');
  assert.equal(nativeKbd.getAttribute('title'), 'Close dialog');
  assert.ok(nativeKbd.className.startsWith('eg-kbd '), 'The public marker leads the root classes');
  assert.ok(nativeKbd.className.endsWith(' ms-2 consumer-kbd'), 'Consumer layout classes merge last');
  assert.ok(!nativeKbd.className.split(' ').includes('ms-1'), 'Conflicting margin utilities resolve through cn()');
  const tokenStack = document.querySelector('.eg-stack[aria-label="Token sections"]');
  assert.ok(tokenStack, 'SSR must render Stack samples');
  assert.ok(tokenStack.classList.contains('flex-col') && tokenStack.classList.contains('flex-nowrap'));
  assert.ok(tokenStack.classList.contains('gap-4') && tokenStack.classList.contains('items-stretch'));
  assert.equal(tokenStack.tagName, 'DIV');
  assert.equal(tokenStack.children.length, 2, 'No phantom flex items for null children');
  const tokenCluster = document.querySelector('.eg-cluster[aria-label="Token actions"]');
  assert.ok(tokenCluster, 'SSR must render Cluster samples');
  assert.ok(tokenCluster.classList.contains('flex-row') && tokenCluster.classList.contains('flex-wrap'));
  assert.ok(tokenCluster.classList.contains('gap-6') && tokenCluster.classList.contains('items-start') && tokenCluster.classList.contains('justify-between'));
  const card = document.querySelector('.eg-surface[aria-label="Material card"]');
  assert.ok(card, 'SSR must render the default Surface');
  assert.equal(card.tagName, 'DIV');
  for (const name of ['bg-surface-1', 'bg-[image:var(--gradient-sheen)]', 'p-6', 'rounded-xl', 'text-fg-default']) {
    assert.ok(card.classList.contains(name), 'Default Surface must carry ' + name);
  }
  const band = document.querySelector('.eg-surface[aria-label="Header band"]');
  assert.ok(band.classList.contains('shadow-edge') && band.classList.contains('rounded-none') && band.classList.contains('p-3'));
  assert.ok(band.className.endsWith('w-full'), 'Layout className merges last on the Surface root');
  const glass = document.querySelector('.eg-surface[aria-label="Glass panel"]');
  assert.ok(glass.classList.contains('not-supports-[backdrop-filter]:bg-surface-2'), 'Overlay must keep its solid fallback');
  const recessed = document.querySelector('section[aria-label="Recessed section"]');
  assert.ok(recessed && recessed.classList.contains('eg-surface'), 'asChild must merge onto the section without a wrapper');
  assert.equal(recessed.parentElement.getAttribute('aria-label'), 'Material surfaces');
  assert.equal(document.querySelector('article[aria-label="Article surface"]')?.classList.contains('bg-surface-3'), true);
  for (const surface of [card, band, glass, recessed]) {
    assert.equal(surface.getAttribute('role'), null);
    assert.equal(surface.hasAttribute('tabindex'), false);
    assert.equal(surface.hasAttribute('style'), false);
  }
  for (const layout of [tokenStack, tokenCluster]) {
    assert.equal(layout.getAttribute('role'), null);
    assert.equal(layout.hasAttribute('aria-live'), false);
    assert.ok(layout.className.includes('min-w-0'));
  }
  // Native for/id named association and the approved typography recipe classes.
  const emailLabel = document.querySelector('label[for="consumer-email"]');
  assert.ok(emailLabel, 'Label must associate natively through for');
  assert.ok(emailLabel.className.includes('eg-label'), 'Label must expose its public marker');
  assert.ok(emailLabel.className.includes('text-label-default'), 'Label must render its base recipe');
  assert.equal(document.getElementById('consumer-email').tagName, 'INPUT');
  const planLabel = document.getElementById('consumer-plan-label');
  assert.equal(planLabel.getAttribute('for'), 'consumer-plan');
  assert.ok(planLabel.className.includes('text-fg-secondary'), 'Label choice must keep the foreground color');
  assert.ok(
    planLabel.className.includes('font-[var(--text-body-default--font-weight)]'),
    'Label choice must carry the token-backed weight utility'
  );
} finally {
  dom.window.close();
}
for (const ratio of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
  const fallback = renderToString(createElement(AspectRatio, { ratio }, 'Fallback'));
  assert.ok(fallback.includes('padding-bottom:100%'), 'Invalid ratio ' + ratio + ' must fall back to a square');
  assert.ok(fallback.includes('eg-aspect-ratio') && fallback.includes('Fallback'));
}
for (const [value, normalized] of [[-1, 0], [42.5, 42.5], [101, 100]]) {
  const rendered = renderToString(createElement(Gauge, { label: 'Bounded capacity', value }));
  assert.ok(rendered.includes('aria-valuenow="' + normalized + '"'));
  assert.ok(rendered.includes('aria-valuetext="' + normalized + ' / 100"'));
  assert.ok(rendered.includes('--eg-gauge-value:' + normalized));
}
for (const value of [NaN, Infinity, -Infinity]) {
  const rendered = renderToString(createElement(Gauge, {
    label: 'Disconnected capacity', value, state: 'critical', stateText: 'Hidden condition', center: 'Hidden center'
  }));
  assert.ok(rendered.includes('Disconnected capacity') && rendered.includes('Data unavailable'));
  assert.doesNotMatch(rendered, /role="meter"|aria-value(?:now|min|max|text)=|eg-gauge-arc|--eg-gauge-value|Hidden condition|Hidden center|aria-live=|<button|tabindex=/);
}
console.log(JSON.stringify({ ssr: ['Gauge finite, bounded and unavailable', 'decorative centers', 'visible conditions'], bytes: html.length }));
`;

const csr = `
import assert from 'node:assert/strict';
import { JSDOM } from ${JSON.stringify(import.meta.resolve('jsdom'))};
const stage = (csrStage) => console.log(JSON.stringify({ csrStage }));
stage('setup:start');
const dom = new JSDOM('<div id="app"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'Event', 'CustomEvent', 'MutationObserver']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
}
for (const name of ['getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame']) {
  globalThis[name] = dom.window[name].bind(dom.window);
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
stage('setup:complete');
const { act, createElement, createRef } = await import('react');
const { Label, Slot, Slottable } = await import('@egdev/ui');
const { createRoot } = await import('react-dom/client');
const { App, aspectWideRef, hiddenNoteRef, slottedHeadingRef, surfaceArticleChildRef, surfaceArticleRef, surfaceDivRef, surfaceSectionRef } = await import('./consumer.ts');
stage('imports:complete');
const root = createRoot(document.getElementById('app'));
try {
  stage('mount:start');
  await act(async () => root.render(createElement(App)));
  stage('mount:complete');
  assert.ok(hiddenNoteRef.current instanceof HTMLElement, 'The public ref must expose an HTMLElement');
  assert.equal(hiddenNoteRef.current?.tagName, 'SPAN');
  assert.ok(slottedHeadingRef.current instanceof HTMLElement);
  assert.equal(slottedHeadingRef.current?.tagName, 'H2', 'The slotted ref must expose the h2 host');
  const buttons = [...document.querySelectorAll('button')];
  assert.equal(buttons.length, 4, 'Only intrinsic consumer and Cluster harness controls may be focusable');
  buttons[0].focus();
  assert.ok(document.activeElement === buttons[0], 'First intrinsic button must receive focus');
  buttons[1].focus();
  assert.ok(document.activeElement === buttons[1], 'Last intrinsic button must receive focus');
  stage('gauge:rerender:start');
  const measurement = () => document.querySelector('section[aria-label="Measurements"] > .eg-gauge');
  assert.equal(measurement().getAttribute('aria-valuenow'), '42.5');
  await act(async () => root.render(createElement(App, { gaugeValue: 101 })));
  assert.equal(measurement().getAttribute('aria-valuenow'), '100');
  assert.equal(measurement().style.getPropertyValue('--eg-gauge-value'), '100');
  await act(async () => root.render(createElement(App, { gaugeValue: NaN })));
  assert.equal(measurement().hasAttribute('role'), false);
  assert.ok(measurement().querySelector('[aria-valuenow], .eg-gauge-arc') === null, 'Unavailable gauge must drop meter parts');
  assert.ok(measurement().textContent.includes('Data unavailable'));
  await act(async () => root.render(createElement(App, { gaugeValue: 0 })));
  assert.equal(measurement().getAttribute('aria-valuenow'), '0');
  assert.equal(measurement().textContent.includes('Data unavailable'), false);
  assert.ok(measurement().querySelector('[aria-live], button, a, input, [tabindex]') === null, 'Recovered gauge must stay passive');
  assert.equal(measurement().hasAttribute('aria-live'), false);
  stage('gauge:rerender:complete');
  stage('aspect:rerender:start');
  const mediaSquare = () => document.querySelector('#media-square');
  const mediaWide = () => document.querySelector('#media-wide');
  assert.ok(mediaSquare() && mediaWide(), 'CSR must mount AspectRatio samples');
  assert.ok(aspectWideRef.current === mediaWide(), 'Ref must target the inner generic div');
  assert.equal(mediaWide().style.getPropertyValue('position'), 'absolute');
  assert.equal(mediaWide().parentElement.style.getPropertyValue('padding-bottom'), '56.25%');
  assert.equal(mediaWide().getAttribute('id'), 'media-wide');
  assert.ok(mediaWide().classList.contains('eg-aspect-ratio'), 'CSR must keep the stable marker');
  assert.ok(mediaWide().classList.contains('min-w-0'), 'CSR must keep the CVA base guard');
  assert.equal(mediaSquare().textContent, 'Square content');
  assert.equal(mediaWide().querySelector('img')?.getAttribute('alt'), 'Wide media');
  const originalRoot = mediaWide();
  const originalChild = mediaWide().querySelector('img');
  await act(async () => root.render(createElement(App, { gaugeValue: 42.5, wideRatio: 4 })));
  assert.ok(mediaWide() === originalRoot, 'Ratio updates must preserve the same root element');
  assert.ok(mediaWide().querySelector('img') === originalChild, 'Ratio updates must preserve descendant identity');
  assert.equal(mediaWide().parentElement.style.getPropertyValue('padding-bottom'), '25%');
  assert.ok(aspectWideRef.current === mediaWide(), 'Rerender must preserve the inner ref target');
  assert.equal(mediaWide().querySelector('img')?.getAttribute('alt'), 'Wide media', 'Rerender must preserve children');
  assert.equal(mediaWide().getAttribute('id'), 'media-wide');
  await act(async () => root.render(createElement(App, { gaugeValue: 42.5, wideRatio: -1 })));
  assert.equal(mediaWide().parentElement.style.getPropertyValue('padding-bottom'), '100%', 'Invalid ratio must fall back to a square');
  assert.ok(aspectWideRef.current === mediaWide(), 'Invalid ratio rerender must preserve the inner ref target');
  assert.ok(aspectWideRef.current === mediaWide(), 'Invalid-ratio rerender must preserve the inner ref target');
  stage('aspect:rerender:complete');
  stage('divider:rerender:start');
  const separations = document.querySelector('section[aria-label="Separations"]');
  assert.ok(separations, 'Divider samples must render inside the consumer app');
  assert.equal(separations.children.length, 3, 'Each Divider usage must render exactly one element');
  const decorativeRule = separations.children[0];
  const semanticRule = separations.children[1];
  const rerenderRule = separations.children[2];
  assert.equal(decorativeRule.tagName, 'SPAN', 'Divider must own one empty span host');
  assert.equal(decorativeRule.textContent, '');
  assert.equal(decorativeRule.childElementCount, 0, 'Divider must render a fixed empty span');
  assert.ok(decorativeRule.className.includes('eg-divider'), 'Divider must keep its stable marker');
  assert.equal(decorativeRule.getAttribute('data-orientation'), 'horizontal');
  assert.equal(decorativeRule.getAttribute('role'), 'none', 'Decorative default must be Radix role none');
  assert.equal(decorativeRule.hasAttribute('aria-orientation'), false);
  assert.equal(decorativeRule.hasAttribute('aria-hidden'), false);
  assert.equal(decorativeRule.hasAttribute('data-state'), false);
  assert.equal(decorativeRule.getAttribute('tabindex'), null);
  assert.equal(decorativeRule.tabIndex, -1, 'A passive rule must never become a Tab stop');
  assert.equal(semanticRule.getAttribute('role'), 'separator');
  assert.equal(semanticRule.getAttribute('aria-orientation'), 'vertical');
  assert.equal(semanticRule.getAttribute('data-orientation'), 'vertical');
  assert.equal(semanticRule.textContent, '');
  assert.equal(semanticRule.tabIndex, -1);
  assert.ok(semanticRule.className.includes('consumer-rule'), 'Native className must survive');
  const rerenderRecipe = rerenderRule.className;
  assert.equal(rerenderRule.getAttribute('role'), 'none');
  assert.equal(rerenderRule.getAttribute('data-orientation'), 'horizontal');
  await act(async () => root.render(createElement(App, { dividerSemantic: true })));
  assert.equal(separations.children[2], rerenderRule, 'Rerender must preserve the divider host');
  assert.equal(rerenderRule.getAttribute('role'), 'separator', 'Semantic rerender must delegate to Radix');
  assert.equal(rerenderRule.getAttribute('aria-orientation'), 'vertical');
  assert.equal(rerenderRule.getAttribute('data-orientation'), 'vertical');
  assert.equal(rerenderRule.className, rerenderRecipe, 'Orientation semantics must never mirror into classes');
  await act(async () => root.render(createElement(App)));
  assert.equal(separations.children[2], rerenderRule);
  assert.equal(rerenderRule.getAttribute('role'), 'none');
  assert.equal(rerenderRule.hasAttribute('aria-orientation'), false);
  assert.equal(rerenderRule.getAttribute('data-orientation'), 'horizontal');
  assert.equal(rerenderRule.className, rerenderRecipe);
  for (const rule of separations.querySelectorAll('.eg-divider')) {
    assert.equal(rule.getAttribute('tabindex'), null);
    assert.equal(rule.tabIndex, -1, 'No divider may add a Tab stop');
  }
  stage('divider:rerender:complete');
  const skeletons = document.querySelectorAll('.eg-skeleton');
  assert.equal(skeletons.length, 14, 'Consumer Skeletons must mount behind the intrinsic controls');
  for (const shape of skeletons) {
    assert.equal(shape.getAttribute('aria-hidden'), 'true');
    assert.equal(shape.textContent, '');
    assert.equal(shape.querySelector('button, a, input, [tabindex]'), null);
  }
  // Class-string comparison only: never pass DOM nodes to deep equality.
  const csrPulseDefault = document.getElementById('pulse-default');
  const csrPulseStatic = document.getElementById('pulse-static');
  assert.ok(csrPulseDefault && csrPulseStatic, 'Missing CSR pulse samples');
  assert.ok(
    csrPulseDefault.className.includes('animate-pulse') && csrPulseDefault.className.includes('motion-reduce:animate-none'),
    'The CSR default Skeleton must pulse'
  );
  assert.ok(!csrPulseStatic.className.includes('animate-pulse'), 'The CSR pulse:false Skeleton must stay static');
  stage('spinner:rerender:start');
  const busyHost = () => document.getElementById('busy-save');
  assert.equal(document.querySelectorAll('.eg-spinner').length, 6, 'Consumer Spinners must mount');
  assert.equal(busyHost().querySelectorAll('.eg-spinner').length, 1);
  await act(async () => root.render(createElement(App, { gaugeValue: 42.5, spinnerLoading: false })));
  assert.equal(busyHost().getAttribute('aria-busy'), 'false');
  assert.equal(busyHost().querySelector('.eg-spinner'), null, 'The decorative Spinner must unmount with loading');
  assert.equal(busyHost().textContent, 'Saving draft');
  assert.equal(document.getElementById('spinner-status').getAttribute('role'), 'status', 'Status Spinner persists');
  stage('spinner:rerender:complete');
  stage('kbd:passive:start');
  const csrKeys = document.querySelectorAll('#kbd-hint kbd.eg-kbd');
  assert.equal(csrKeys.length, 4, 'Consumer Kbds must mount');
  for (const key of csrKeys) {
    assert.equal(key.tabIndex, -1, 'A passive key must never become a Tab stop');
    assert.equal(key.getAttribute('role'), null);
  }
  assert.equal(document.getElementById('kbd-command').children[0].getAttribute('aria-hidden'), 'true');
  stage('kbd:passive:complete');
  stage('layout:rerender:start');
  const layoutStack = () => document.querySelector('.eg-stack[aria-label="Token sections"]');
  const layoutCluster = () => document.querySelector('.eg-cluster[aria-label="Token actions"]');
  assert.ok(layoutStack() && layoutCluster(), 'CSR must mount layout samples');
  const layoutRootId = layoutStack().id || 'unnamed-stack-root';
  const layoutFirstId = layoutStack().querySelector('#stack-first')?.id;
  await act(async () => root.render(createElement(App, { gaugeValue: 42.5, stackGap: 8 })));
  assert.ok(layoutStack().querySelector('#stack-first')?.id === layoutFirstId, 'Gap updates must preserve the same root and children');
  assert.ok(layoutStack().className.includes(layoutRootId === 'unnamed-stack-root' ? 'eg-stack' : layoutRootId), 'Stack root identity must persist');
  assert.ok(layoutStack().classList.contains('gap-8'), 'Gap updates must resolve the new token class');
  assert.ok(!layoutStack().classList.contains('gap-4'), 'twMerge must drop the replaced gap utility');
  assert.ok(layoutCluster().classList.contains('flex-wrap'), 'Cluster keeps wrapping behavior across renders');
  stage('layout:rerender:complete');
  stage('surface:refs:start');
  const surfaceCard = () => document.querySelector('.eg-surface[aria-label="Material card"]');
  assert.equal(surfaceDivRef.current?.tagName, 'DIV', 'The default Surface ref must expose the div');
  assert.ok(surfaceDivRef.current === surfaceCard(), 'The default ref must target the rendered card');
  assert.equal(surfaceSectionRef.current?.tagName, 'SECTION', 'The slotted ref must expose the section host');
  assert.ok(surfaceArticleRef.current === surfaceArticleChildRef.current, 'Surface and child refs must compose on the article');
  assert.equal(surfaceArticleRef.current?.tagName, 'ARTICLE');
  await act(async () => root.render(createElement(App, { gaugeValue: 42.5, stackGap: 8, surfaceElevation: 3 })));
  assert.ok(surfaceDivRef.current === surfaceCard(), 'Elevation updates must preserve the same Surface root');
  assert.ok(surfaceCard().classList.contains('shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]'), 'Elevation 3 must resolve its recipe');
  assert.ok(surfaceCard().classList.contains('border-border-hairline-strong'), 'Elevation 3 must use the strong hairline');
  assert.ok(!surfaceCard().classList.contains('shadow-[var(--shadow-edge),var(--shadow-elev-1)]'), 'The replaced elevation recipe must be gone');
  stage('surface:refs:complete');
  console.log(JSON.stringify({ csr: ['intrinsic consumer focus harness', 'Gauge rerender, passivity and non-finite recovery'] }));
  const slotRef = createRef();
  const childRef = createRef();
  const calls = [];
  await act(async () => root.render(createElement(Slot, {
    ref: slotRef, onClick: () => calls.push('slot'), 'aria-label': 'Composed documentation'
  }, createElement('span', { 'aria-hidden': true }, '→'),
  createElement(Slottable, null, createElement('a', {
    ref: childRef, href: '#composition', onClick: (event) => { event.preventDefault(); calls.push('child'); }
  }, 'Documentation')))));
  const target = document.querySelector('a');
  assert.equal(document.getElementById('app').children.length, 1);
  assert.equal(target.textContent, '→Documentation');
  assert.equal(target.getAttribute('aria-label'), 'Composed documentation');
  assert.equal(target.hasAttribute('class'), false);
  assert.ok(slotRef.current === target, 'Slot ref must target the slotted anchor');
  assert.ok(childRef.current === target, 'Child ref must target the slotted anchor');
  await act(async () => target.click());
  assert.deepEqual(calls, ['child', 'slot']);
  await act(async () => root.render(null));
  assert.ok(slotRef.current === null, 'Slot ref must be cleaned up on unmount');
  assert.ok(childRef.current === null, 'Child ref must be cleaned up on unmount');
  // Native label activation: clicking the associated label focuses the named control.
  // The Slot scene unmounted App, so remount it before exercising LabelSamples.
  await act(async () => root.render(createElement(App)));
  // The label click must activate the associated control: jsdom forwards the click
  // to the labeled input, which is the spec promise (focus stays covered by unit tests).
  const emailInput = document.getElementById('consumer-email');
  let activated = 0;
  emailInput.addEventListener('click', () => {
    activated += 1;
  });
  await act(async () => document.querySelector('label[for="consumer-email"]').click());
  assert.equal(activated, 1, 'Label click must activate the associated input exactly once');
  // Label forwards its HTMLLabelElement ref and cleans it up on unmount.
  const labelRef = createRef();
  await act(async () => root.render(createElement(Label, { htmlFor: 'consumer-email', ref: labelRef }, 'Email address')));
  const labelNode = document.querySelector('label[for="consumer-email"]');
  assert.ok(labelNode, 'Label scene must render a native label');
  assert.ok(labelRef.current === labelNode, 'Label must forward its HTMLLabelElement ref');
  await act(async () => root.render(null));
  assert.ok(labelRef.current === null, 'Label ref must be cleaned up on unmount');
  console.log(JSON.stringify({ csr: ['intrinsic consumer focus harness', 'Gauge rerender, passivity and non-finite recovery', 'Slot/Slottable target, composed refs, child-first events and ref cleanup', 'VisuallyHidden HTMLElement refs', 'Skeleton passive placeholders and AspectRatio rerender', 'Spinner status/decorative semantics and host-owned unmount', 'Kbd passive keys outside the Tab order', 'Label activation, forwarded ref and cleanup'] }));
} finally {
  stage('unmount:start');
  await act(async () => root.unmount());
  stage('unmount:complete');
  dom.window.close();
  stage('dom:closed');
}
`;

const typographyNames = [
  'display-hero',
  'display-show',
  'display-pro',
  'heading-section',
  'heading-small',
  'body-large',
  'body-default',
  'body-muted',
  'label-default',
  'label-eyebrow',
  'meta',
  'cta-label',
  'code'
];
const spacingClasses = [
  'p-0',
  'p-1',
  'p-2',
  'p-3',
  'p-4',
  'p-5',
  'p-6',
  'p-7',
  'p-8',
  'p-10',
  'p-12',
  'p-14',
  'p-16',
  'p-20',
  'p-24',
  'p-0.5',
  'p-9'
];
// Test-only class list: it drives @source scanning and carries no production values.
const tailwindClasses = [
  'text-fg-secondary',
  'bg-bg-surface',
  'rounded-xl',
  'shadow-edge',
  'font-display',
  ...typographyNames.map((name) => `text-${name}`),
  ...spacingClasses
].join(' ');

const css = `
import assert from 'node:assert/strict';
import { readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { build, version } from 'vite';
import tailwindcss from '@tailwindcss/vite';
const instances = { react: new Set(), 'react-dom': new Set() };
const result = await build({ configFile: false, logLevel: 'error', build: { cssMinify: false }, plugins: [{
  name: 'consumer-react-instances',
  generateBundle() {
    for (const id of this.getModuleIds()) {
      const match = id.replaceAll('\\\\', '/').match(/^(.*\\/node_modules\\/(react|react-dom))\\//);
      if (match) instances[match[2]].add(realpathSync(match[1]));
    }
  }
}] });
const assets = [result].flat().flatMap((bundle) => bundle.output).filter((asset) => asset.type === 'asset' && asset.fileName.endsWith('.css'));
const emitted = assets.map((asset) => String(asset.source)).join('\\n');
assert.ok(assets.length > 0, 'Vite must emit consumer CSS');
assert.ok(!emitted.includes('@theme'), 'Native consumption must not need Tailwind to interpret @theme');
${assertGaugeCSS.toString()}
${assertDividerCSS.toString()}
${assertSkeletonCSS.toString()}
${assertSpinnerCSS.toString()}
${assertKbdCSS.toString()}
assertGaugeCSS(emitted);
assertDividerCSS(emitted, readFileSync(fileURLToPath(import.meta.resolve('@egdev/ui')), 'utf8'));
assert.match(
  emitted,
  /\\.min-w-0\\s*\\{[^}]*min-width:\\s*(?:0|0px|var\\(--space-0\\))\\s*;/,
  'Native consumer build must emit the AspectRatio min-width guard without Tailwind'
);
assertSkeletonCSS(emitted);
assertSpinnerCSS(emitted);
assertKbdCSS(emitted);
${assertLabelCSS.toString()}
assertLabelCSS(emitted);
${assertSurfaceCSS.toString()}
assertSurfaceCSS(emitted);
for (const selector of ['.eg-gauge-arc', '.eg-gauge-center']) assert.ok(emitted.includes(selector), 'Missing shipped selector ' + selector);
const shipped = readFileSync(new URL('./node_modules/@egdev/tokens/dist/tokens.css', import.meta.url), 'utf8');
const names = shipped
  .split(String.fromCharCode(10))
  .flatMap((line) => {
    const at = line.indexOf('--');
    if (at === -1) return [];
    const name = line.slice(at).split(':')[0].trim();
    return name.startsWith('--') ? [name] : [];
  });
const typography = ${JSON.stringify(typographyNames)};
assert.equal(names.length, 238, 'Packed native artifact must expose 238 variables');
for (const token of names) assert.ok(emitted.includes(token + ':'), 'Missing shipped token definition ' + token);
for (const token of ['--color-surface-0', '--radius-full', '--shadow-well']) assert.ok(emitted.includes('var(' + token + ')'), 'UI must consume shipped token ' + token);
for (const name of typography) {
  for (const field of ['--line-height', '--font-weight', '--letter-spacing']) assert.ok(emitted.includes('--text-' + name + field + ':'), 'Native artifact must expose --text-' + name + field);
}
assert.ok(emitted.includes('--effect-grid-size: 40px'), 'Native artifact must emit unused effect spacing');
assert.ok(emitted.includes('--spacing-16: var(--space-16)'), 'Native artifact must emit unused spacing aliases');
for (const [name, paths] of Object.entries(instances)) assert.equal(paths.size, 1, 'Consumer bundle must contain one physical ' + name);
const tailwind = await build({ configFile: false, logLevel: 'error', plugins: [tailwindcss({ optimize: false })], build: { cssMinify: false, emptyOutDir: true, outDir: 'dist-tw', rolldownOptions: { input: 'tailwind.css', output: { assetFileNames: 'tailwind.css' } } } });
const twAssets = [tailwind].flat().flatMap((bundle) => bundle.output).filter((asset) => asset.type === 'asset' && asset.fileName.endsWith('.css'));
const twCss = twAssets.map((asset) => String(asset.source)).join(' ');
assert.ok(twAssets.length > 0, 'Tailwind build must emit CSS');
assertGaugeCSS(twCss);
assertDividerCSS(twCss, readFileSync(fileURLToPath(import.meta.resolve('@egdev/ui')), 'utf8'));
assert.match(
  twCss,
  /\\.min-w-0\\s*\\{[^}]*min-width:\\s*(?:0|0px|var\\(--space-0\\))\\s*;/,
  'Tailwind consumer must retain the AspectRatio min-width guard'
);
assertSkeletonCSS(twCss);
assertSpinnerCSS(twCss);
assertKbdCSS(twCss);
for (const utility of ['.flex-col', '.flex-nowrap', '.flex-row', '.flex-wrap', '.gap-0', '.gap-4', '.gap-6', '.gap-8', '.items-stretch', '.items-start', '.justify-between']) {
  assert.ok(twCss.includes(utility), 'Tailwind consumer must retain layout utility ' + utility);
}
assertSurfaceCSS(twCss);
assertLabelCSS(twCss);
for (const selector of ['.eg-gauge-arc', '.eg-gauge-center']) {
  assert.ok(twCss.includes(selector), 'Tailwind consumer must retain shipped UI selector ' + selector);
}
for (const selector of ['.text-fg-secondary', '.bg-bg-surface', '.rounded-xl', '.shadow-edge', '.font-display']) assert.ok(twCss.includes(selector), 'Missing generated utility ' + selector);
for (const name of typography) {
  assert.ok(twCss.includes('.text-' + name), 'Tailwind must emit the text-' + name + ' utility');
  assert.ok(twCss.includes('--tw-leading, var(--text-' + name + '--line-height)'), 'text-' + name + ' must carry line-height');
  assert.ok(twCss.includes('--tw-font-weight, var(--text-' + name + '--font-weight)'), 'text-' + name + ' must carry font-weight');
  assert.ok(twCss.includes('--tw-tracking, var(--text-' + name + '--letter-spacing)'), 'text-' + name + ' must carry letter-spacing');
}
assert.ok(twCss.includes('padding: var(--space-4)'), 'Tailwind must bind p-4 to --space-4');
assert.ok(twCss.includes('padding: var(--space-16)'), 'Tailwind must bind p-16 to --space-16');
assert.ok(twCss.includes('calc(var(--space-1) * 0.5)'), 'Fractional spacing must derive from --space-1');
assert.ok(twCss.includes('calc(var(--space-1) * 9)'), 'Unlisted spacing steps must derive from the base --spacing token');
assert.ok(twCss.includes('--color-ambient-bg:'), 'Static theme must emit unused variables');
assert.ok(!twCss.includes('--color-red-500'), 'Color reset must remove the default palette');
assert.ok(twCss.includes('@layer'), 'Tailwind cascade layers must be present');
console.log(JSON.stringify({ vite: version, cssAssets: assets.length, cssBytes: emitted.length, nativeTokens: names.length, tailwindAssets: twAssets.length, bundleInstances: { react: 1, 'react-dom': 1 } }));
`;

for (const [react, [types, domTypes]] of Object.entries(versions)) {
  test(`packed UI consumer with React ${react}`, { timeout: 360_000 }, async (context) => {
    const temporary = mkdtempSync(join(tmpdir(), 'egdev-package-consumption-'));
    try {
      const tarballs = {};
      for (const name of ['tokens', 'ui']) {
        run(join(root, 'packages', name), 'pnpm', ['pack', '--pack-destination', temporary], 30_000);
        const file = readdirSync(temporary).find(
          (entry) => entry.startsWith(`egdev-${name}-`) && entry.endsWith('.tgz')
        );
        assert.ok(file, `pnpm pack must produce the ${name} tarball`);
        tarballs[name] = `file:${join(temporary, file)}`;
      }
      const fixture = join(temporary, 'consumer');
      mkdirSync(fixture);
      const write = (name, content) => writeFileSync(join(fixture, name), content);
      const writeJSON = (name, content) => write(name, JSON.stringify(content));
      writeJSON('package.json', {
        private: true,
        type: 'module',
        packageManager: manifest.packageManager,
        dependencies: {
          '@egdev/ui': tarballs.ui,
          '@egdev/tokens': tarballs.tokens,
          '@tailwindcss/vite': manifest.devDependencies['@tailwindcss/vite'],
          tailwindcss: manifest.devDependencies.tailwindcss,
          react,
          'react-dom': react,
          '@types/react': types,
          '@types/react-dom': domTypes,
          typescript: manifest.devDependencies.typescript,
          vite: manifest.devDependencies.vite
        }
      });
      write('pnpm-workspace.yaml', `overrides:\n  '@egdev/tokens': ${JSON.stringify(tarballs.tokens)}\n`);
      writeJSON('tsconfig.json', {
        compilerOptions: {
          strict: true,
          noEmit: true,
          skipLibCheck: false,
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          types: ['react', 'react-dom']
        },
        include: ['consumer.ts']
      });
      write('consumer.ts', consumer);
      for (const [name, source] of Object.entries({ entries, ssr, csr, css })) {
        write(`${name}.mjs`, source);
      }
      write('index.html', '<div id="app"></div><script type="module" src="/main.ts"></script>');
      write('tailwind.classes.html', `<div class="${tailwindClasses}"></div>`);
      write(
        'tailwind.css',
        '@import "tailwindcss";\n@import "@egdev/tokens/theme.css";\n@import "@egdev/ui/styles.css";\n@source "./tailwind.classes.html";\n'
      );
      write(
        'main.ts',
        `import '@egdev/tokens/tokens.css';\nimport '@egdev/ui/styles.css';\nimport { createElement } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport { App } from './consumer';\ncreateRoot(document.getElementById('app')!).render(createElement(App));\n`
      );
      // Keep temporary consumers on the repository's managed pnpm, not the global version/store.
      const expectedPnpmVersion = manifest.packageManager.match(/^pnpm@([^+]+)(?:\+.*)?$/)?.[1];
      assert.ok(expectedPnpmVersion, 'Root packageManager must pin pnpm');
      assert.equal(
        run(fixture, 'pnpm', ['--version'], 30_000),
        expectedPnpmVersion,
        'Fixture pnpm must match the root packageManager pin before installing dependencies'
      );
      const install = ['install', '--ignore-scripts', '--no-frozen-lockfile', '--strict-peer-dependencies'];
      if (process.env.EGDEV_CONSUMER_OFFLINE === '1') {
        install.push('--offline');
      }
      run(fixture, 'pnpm', install, 120_000);
      const timeouts = { entries: 20_000, types: 30_000, ssr: 20_000, csr: 60_000, css: 60_000 };
      for (const [name, timeout] of Object.entries(timeouts)) {
        await context.test(name, () => {
          const output =
            name === 'types'
              ? run(fixture, 'pnpm', ['exec', 'tsc', '-p', 'tsconfig.json'], timeout)
              : run(fixture, process.execPath, [`${name}.mjs`], timeout);
          context.diagnostic(output || 'Strict public types compiled, including negative prop checks');
        });
      }
    } finally {
      // Only remove the unique directory owned by this invocation, including on failure.
      rmSync(temporary, { recursive: true, force: true });
    }
  });
}
