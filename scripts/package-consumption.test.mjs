import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
import type { ChangeEvent, ComponentProps, ComponentPropsWithoutRef, ComponentRef } from 'react';
import { AspectRatio, Avatar, Badge, Button, Checkbox, Cluster, Divider, Dropzone, Gauge, Heading, Icon, IconButton, Input, Kbd, Label, Link, Logo, ProductMark, ProgressBar, RadioGroup, Select, Skeleton, Slider, Slot, Slottable, Spinner, Stack, StatusDot, Surface, Switch, Text, Textarea, Toggle, Tooltip, VisuallyHidden, badgeVariants, dropzoneVariants, progressBarVariants, radioGroupVariants, sliderVariants, surfaceVariants, tooltipVariants } from '@egdev/ui';
import type {
  AspectRatioProps,
  AvatarProps,
  AvatarSize,
  BadgeProps,
  BadgeTone,
  BadgeVariant,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  CheckboxCheckedState,
  CheckboxProps,
  DividerOrientation,
  DividerProps,
  DropzoneProps,
  GaugeProps,
  GaugeState,
  GaugeSize,
  IconButtonProps,
  IconButtonVariant,
  IconButtonSize,
  IconName,
  IconProps,
  IconSize,
  InputProps,
  InputSize,
  InputType,
  InputVariant,
  KbdProps,
  LabelProps,
  LabelVariant,
  LinkProps,
  SliderProps,
  LogoProps,
  LogoSize,
  LogoVariant,
  ProductMarkProps,
  ProgressBarProps,
  ProgressBarSize,
  ProgressBarVariant,
  RadioGroupOption,
  RadioGroupOrientation,
  RadioGroupProps,
  SelectProps,
  SelectOption,
  SelectSize,
  SkeletonProps,
  SkeletonSize,
  SkeletonVariant,
  SlotProps,
  SpinnerProps,
  SpinnerSize,
  StatusDotProps,
  StatusDotState,
  ClusterProps,
  LayoutGap,
  StackProps,
  HeadingLevel,
  HeadingProps,
  TextProps,
  TextTone,
  TextVariant,
  TitleVariant,
  ToggleProps,
  ToggleSize,
  SurfaceElevation,
  SurfacePadding,
  SurfaceProps,
  SurfaceRadius,
  SurfaceTone,
  SwitchProps,
  TextareaProps,
  TextareaVariant,
  TooltipProps,
  VisuallyHiddenProps
} from '@egdev/ui';
const buttonVariant: ButtonVariant = 'secondary';
const buttonSize: ButtonSize = 'sm';
export const buttonRef = createRef<HTMLButtonElement>();
export const buttonLinkRef = createRef<HTMLButtonElement>();
export const buttonProps: ButtonProps = { children: 'Save draft', icon: createElement(Icon, { name: 'check' }), variant: buttonVariant, size: buttonSize };
export function ButtonSamples() {
  return createElement('section', { 'aria-label': 'Actions' },
    createElement(Button, { ...buttonProps, id: 'button-native', ref: buttonRef }),
    createElement(Button, { children: 'Saving draft', loading: true, id: 'button-loading' }),
    createElement(Button, { children: 'Unavailable', disabled: true, id: 'button-disabled' }),
    createElement(Button, { asChild: true, ref: buttonLinkRef, iconPosition: 'start', icon: createElement(Icon, { name: 'arrow-right' }),
      children: createElement('a', { href: '#projects', id: 'button-link' }, 'View projects') }));
}
// @ts-expect-error Button requires a visible label.
const missingButtonLabel: ButtonProps = {};
// @ts-expect-error Navigation composes a child anchor, never a Button href prop.
const buttonHref: ButtonProps = { children: 'Projects', href: '#projects' };
// @ts-expect-error Icon-only size treatments belong to IconButton.
const buttonIconVariant: ButtonProps = { children: 'Save', variant: 'icon' };
// @ts-expect-error Button dimensions are only md and sm presets.
const buttonNumericSize: ButtonProps = { children: 'Save', size: 48 };
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
export const checkboxRef = createRef<HTMLButtonElement>();
export const checkboxDefaults: CheckboxProps = { 'aria-label': 'Notify subscribers' };
export function CheckboxSamples() {
  const mixed: CheckboxCheckedState = 'indeterminate';
  return createElement('section', { 'aria-label': 'Form options' },
    createElement(Checkbox, { ...checkboxDefaults, ref: checkboxRef, id: 'checkbox-default' }),
    createElement(Checkbox, { checked: mixed, id: 'checkbox-mixed', 'aria-label': 'Select all' }),
    createElement(Checkbox, { defaultChecked: true, disabled: true, id: 'checkbox-disabled', 'aria-label': 'Unavailable option' }),
    createElement('form', { id: 'checkbox-form' },
      createElement(Checkbox, { id: 'checkbox-form-control', name: 'notify', value: 'yes', required: true, 'aria-describedby': 'checkbox-hint', className: 'ms-1 ms-2' }),
      createElement('label', { htmlFor: 'checkbox-form-control' }, 'Email notifications'),
      createElement('p', { id: 'checkbox-hint' }, 'Saved with the form')));
}
// @ts-expect-error Checkbox has no asChild composition API.
const slottedCheckbox: CheckboxProps = { asChild: true };
// @ts-expect-error Checkbox owns its internal indicator; children are not public.
const checkboxChildren: CheckboxProps = { children: 'Option' };
// @ts-expect-error Checkbox is a fixed 18px control, with no size axis.
const checkboxSize: CheckboxProps = { size: 'sm' };
// @ts-expect-error Mixed state is indeterminate, never the ARIA string mixed.
const invalidCheckboxState: CheckboxProps = { checked: 'mixed' };
// @ts-expect-error Native onChange is replaced by checked-change notification.
const checkboxChange: CheckboxProps = { onChange: () => undefined };
// @ts-expect-error Button type is owned by Radix Checkbox.
const checkboxType: CheckboxProps = { type: 'submit' };
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
export const statusDotPlaced: StatusDotProps = {
  state: 'error', id: 'rail-dot', title: 'Error', lang: 'en', className: 'absolute top-1 consumer-dot'
};
export function StatusDotSamples({ pulse }: { pulse?: boolean }) {
  const states: StatusDotState[] = ['running', 'idle', 'warning', 'error', 'stopped'];
  // The dot is decorative: each state word stays in adjacent text.
  return createElement('ul', { 'aria-label': 'Module states' },
    states.map((state) => createElement('li', { key: state }, createElement(StatusDot, { state, id: 'dot-' + state }), state)),
    createElement('li', null, createElement(StatusDot, { state: 'live', id: 'dot-live', pulse }), 'Live now'),
    createElement('li', null, createElement(StatusDot, { state: 'standby', id: 'dot-standby', pulse: false }), 'Upcoming live'),
    createElement('li', null, createElement(StatusDot, { id: 'dot-default' }), 'Default'),
    createElement('li', { style: { position: 'relative' } }, createElement(StatusDot, statusDotPlaced), 'egdev-sync'));
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
// Dropzone stays outside App so earlier components' focus harness remains unchanged.
export const receivedFiles: File[][] = [];
export const dropzoneRecipe: string = dropzoneVariants({ variant: 'inline' });
export const dropzoneProps: DropzoneProps = {
  onFiles: (files) => receivedFiles.push(files), accept: 'image/*', multiple: true,
  label: 'Add media', dropLabel: 'Release media', variant: 'inline', id: 'file-target', className: 'mt-2'
};
export function DropzoneSamples({ disabled = false }: { disabled?: boolean }) {
  return createElement(Dropzone, { ...dropzoneProps, disabled });
}
// @ts-expect-error onFiles is required; there is no uncontrolled form-file value.
const missingFilesCallback: DropzoneProps = {};
// @ts-expect-error Dropzone owns the button type.
const submittingDropzone: DropzoneProps = { ...dropzoneProps, type: 'submit' };
// @ts-expect-error No ref API on either React major.
const referencedDropzone: DropzoneProps = { ...dropzoneProps, ref: createRef<HTMLButtonElement>() };
// @ts-expect-error The button content is owned: upload icon and visible label.
const childDropzone: DropzoneProps = { ...dropzoneProps, children: 'Upload' };
// @ts-expect-error No asChild composition API.
const composedDropzone: DropzoneProps = { ...dropzoneProps, asChild: true };
// @ts-expect-error Drag state is internal, not a public over prop.
const forcedDropzone: DropzoneProps = { ...dropzoneProps, over: true };
// @ts-expect-error Drop handling is owned by the hook.
const interceptedDropzone: DropzoneProps = { ...dropzoneProps, onDrop: () => undefined };
// @ts-expect-error Paste handling is owned by the hook.
const interceptedPaste: DropzoneProps = { ...dropzoneProps, onPaste: () => undefined };
// @ts-expect-error No other visual treatments exist.
const invalidDropzone: DropzoneProps = { ...dropzoneProps, variant: 'solid' };

export const linkNativeRef = createRef<HTMLAnchorElement>();
export const linkSlotRef = createRef<HTMLAnchorElement>();
export const linkChildRef = createRef<HTMLAnchorElement>();
const RouterLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>((props, ref) =>
  createElement('a', { ...props, ref })
);
export const linkDefaults: LinkProps = { href: '#docs', children: 'Documentation' };
export function LinkSamples({ external = true }: { external?: boolean }) {
  return createElement('section', { 'aria-label': 'Text navigation' },
    createElement(Link, { ...linkDefaults, id: 'link-native', ref: linkNativeRef, className: 'mt-2 mt-4 self-start' }),
    createElement(Link, { href: '#external', external, rel: 'author noopener', id: 'link-external', children: 'Repository' }),
    createElement(Link, { href: '#legal', arrow: false, id: 'link-plain', children: 'Legal information' }),
    createElement(Link, { asChild: true, external, rel: 'author', ref: linkSlotRef, newTabText: '(new window)',
      children: createElement(RouterLink, { href: '#router', id: 'link-router', ref: linkChildRef, target: '_self', rel: 'help' }, 'Router documentation') }));
}
// @ts-expect-error A native link requires its destination.
const missingLinkDestination: LinkProps = { children: 'Docs' };
// @ts-expect-error asChild delegates href to the child, never to Link.
const slottedLinkDestination: LinkProps = { asChild: true, href: '#docs', children: createElement('a', { href: '#docs' }) };
// @ts-expect-error Descriptive children remain required.
const missingLinkContent: LinkProps = { href: '#docs' };
// @ts-expect-error Disabled links are not supported; use plain text without a destination.
const disabledLink: LinkProps = { href: '#docs', children: 'Docs', disabled: true };
// @ts-expect-error Link v0.1 has no visual variants.
const variantLink: LinkProps = { href: '#docs', children: 'Docs', variant: 'primary' };
// @ts-expect-error The public ref is an anchor ref, never a button ref.
const wrongLinkRef: ComponentProps<typeof Link> = { href: '#docs', children: 'Docs', ref: createRef<HTMLButtonElement>() };

const badgeTones: BadgeTone[] = ['neutral', 'info', 'success', 'warning', 'danger', 'brand'];
const badgeTreatments: BadgeVariant[] = ['soft', 'solid'];
export const badgeDefaults: BadgeProps = { children: 'Draft' };
export const badgeRecipe: string = badgeVariants({ tone: 'brand', variant: 'solid' });
export function BadgeSamples() {
  return createElement('section', { 'aria-label': 'Static labels' },
    createElement(Badge, { ...badgeDefaults, id: 'badge-default', title: 'Publication', className: 'mt-1 mt-2 consumer-badge' }),
    badgeTones.flatMap((tone) => badgeTreatments.map((variant) => createElement(Badge, {
      key: tone + '-' + variant, tone, variant, id: 'badge-' + tone + '-' + variant,
      icon: createElement(Icon, { name: 'check', className: 'size-3.5' }), children: 'Published'
    }))));
}
// @ts-expect-error Badge requires visible text content.
const missingBadgeText: BadgeProps = {};
// @ts-expect-error Badge has no ref API on either React major.
const referencedBadge: BadgeProps = { children: 'Draft', ref: createRef<HTMLSpanElement>() };
// @ts-expect-error Badge is not polymorphic.
const slottedBadge: BadgeProps = { children: 'Draft', asChild: true };
// @ts-expect-error The tone family is closed.
const invalidBadgeTone: BadgeProps = { children: 'Draft', tone: 'critical' };
// @ts-expect-error Only soft and solid treatments exist.
const invalidBadgeVariant: BadgeProps = { children: 'Draft', variant: 'outline' };
// @ts-expect-error Badge has no size axis in v0.1.
const sizedBadge: BadgeProps = { children: 'Draft', size: 'sm' };

export const sliderSample: SliderProps = {
  label: 'Volume', defaultValue: 40, name: 'volume', id: 'packed-slider',
  'aria-describedby': 'slider-hint', className: 'w-48 w-64 consumer-slider',
  valueText: (value) => value + ' percent'
};
export const sliderRecipe: string = sliderVariants();
export const sliderEvents: number[] = [];
export const sliderCommits: number[] = [];
export function SliderSamples() {
  return createElement('form', { id: 'slider-form' },
    createElement('p', { id: 'slider-hint' }, 'Applies to overlays'),
    createElement(Slider, { ...sliderSample,
      onValueChange: (value) => sliderEvents.push(value),
      onValueCommit: (value) => sliderCommits.push(value) }),
    createElement(Slider, { label: 'Fixed threshold', value: 120, id: 'packed-controlled-slider' }),
    createElement(Slider, { label: 'Disabled volume', disabled: true, defaultValue: 25, id: 'packed-disabled-slider',
      onValueChange: (value) => sliderEvents.push(value) }));
}

// RadioGroup: data-driven options named by label, inside a form for submission (D2-D5, AC-07).
export const radioOptions: RadioGroupOption[] = [
  { value: 'public', label: 'Public' },
  { value: 'unlisted', label: 'Unlisted' },
  { value: 'private', label: 'Private', disabled: true }
];
const radioOrientation: RadioGroupOrientation = 'horizontal';
export const radioNative: RadioGroupProps = {
  label: 'Native visibility', options: radioOptions, id: 'radio-native', 'aria-describedby': 'radio-hint',
  className: 'ms-1 ms-2 consumer-radio'
};
export const radioItemRecipe: string = radioGroupVariants.item();
type RadioSampleProps = { format?: string; onFormatChange?: (value: string) => void };
export function RadioGroupSamples({ format = 'video', onFormatChange }: RadioSampleProps) {
  return createElement('form', { id: 'radio-form' },
    createElement(RadioGroup, { label: 'Visibility', options: radioOptions, name: 'visibility', required: true, id: 'radio-visibility' }),
    createElement(RadioGroup, {
      label: 'Format', id: 'radio-format', name: 'format', orientation: radioOrientation, value: format,
      onValueChange: onFormatChange,
      options: [{ value: 'video', label: 'Video' }, { value: 'live', label: 'Live' }]
    }),
    createElement(RadioGroup, { label: 'Locked', id: 'radio-locked', options: radioOptions, defaultValue: 'public', disabled: true }),
    createElement('p', { id: 'radio-hint' }, 'Applies to new uploads.'),
    createElement(RadioGroup, radioNative));
}
// Switch: bare track named by a native label or aria-label, inside a form for submission (D2, AC-08).
export const switchRef = createRef<HTMLButtonElement>();
export const switchNative: SwitchProps = {
  id: 'switch-native', 'aria-label': 'Native switch', 'aria-describedby': 'switch-hint', className: 'ms-1 ms-2 consumer-switch'
};
type SwitchSampleProps = { overlay?: boolean; onOverlayChange?: (checked: boolean) => void };
export function SwitchSamples({ overlay = true, onOverlayChange }: SwitchSampleProps) {
  return createElement('form', { id: 'switch-form' },
    createElement('label', { htmlFor: 'switch-alerts' }, 'Stream alerts'),
    createElement(Switch, { id: 'switch-alerts', name: 'alerts', required: true, ref: switchRef }),
    createElement(Switch, {
      id: 'switch-overlay', 'aria-label': 'Overlay visible', name: 'overlay', value: 'visible',
      checked: overlay, onCheckedChange: onOverlayChange
    }),
    createElement(Switch, { id: 'switch-locked', 'aria-label': 'Locked', disabled: true, defaultChecked: true }),
    createElement('p', { id: 'switch-hint' }, 'Applies immediately.'),
    createElement(Switch, switchNative));
}
export function verifySwitchRefType(host: ComponentRef<typeof Switch>) {
  const button: HTMLButtonElement = host;
  return button;
}
export const switchRefProps: ComponentProps<typeof Switch> = { ref: createRef<HTMLButtonElement>(), 'aria-label': 'Ref' };
// Tooltip wraps one consumer trigger; samples render outside App so its focus harness stays unchanged.
export const tooltipRecipe: string = tooltipVariants();
export const tooltipSearch: TooltipProps = {
  content: 'Search the catalogue',
  children: createElement('button', { type: 'button', 'aria-label': 'Search', id: 'tooltip-search' }, '⌕')
};
export function TooltipSamples() {
  return createElement('div', { id: 'tooltip-host' },
    createElement(Tooltip, tooltipSearch),
    createElement(Tooltip, { content: 'egdev-publish, running', side: 'right', className: 'text-center consumer-tooltip',
      children: createElement('button', { type: 'button', id: 'tooltip-module' }, 'Publish') }));
}
export const progressAnnounced: ProgressBarProps = { label: 'Upload progress', value: 45, id: 'progress-upload' };
export const progressNative: ProgressBarProps = {
  value: 10, id: 'progress-native', title: 'Scroll position', className: 'w-full w-48 consumer-progress'
};
const progressGoalSize: ProgressBarSize = 'lg';
const progressSeries: ProgressBarVariant = 'muted';
export const progressEdgeRecipe: string = progressBarVariants({ size: 'sm', edge: true });
export function ProgressBarSamples({ value = 45 }: { value?: number }) {
  return createElement('section', { 'aria-label': 'Progress indicators' },
    createElement(ProgressBar, { ...progressAnnounced, value }),
    // Decorative: the visible counter carries the progress as text (D4).
    createElement('p', { id: 'progress-counter' }, '03/12', createElement(ProgressBar, { value: 25, id: 'progress-decorative' })),
    createElement(ProgressBar, { size: progressGoalSize, label: 'Subscriber goal', value: 74, valueText: '37 of 50 subscribers', id: 'progress-goal' }),
    createElement(ProgressBar, { variant: progressSeries, label: 'Last week', value: 140, id: 'progress-muted' }),
    createElement('span', { id: 'progress-edge-host', className: 'relative overflow-hidden' }, '03 Think',
      createElement(ProgressBar, { edge: true, label: 'Section progress', value: 40, id: 'progress-edge' })),
    createElement(ProgressBar, progressNative));
}
// Textarea: a bare native control; the consumer names it and owns value state (D1, D9).
export const textareaRef = createRef<HTMLTextAreaElement>();
export const textareaChanges: string[] = [];
const textareaVariant: TextareaVariant = 'code';
const recordTextareaChange: TextareaProps['onChange'] = (event) => {
  textareaChanges.push(event.target.value);
};
export const textareaNative: TextareaProps = {
  id: 'textarea-notes', name: 'notes', rows: 3, maxLength: 1250, placeholder: 'Write a note',
  'aria-describedby': 'textarea-hint', className: 'mt-2 mt-4 consumer-textarea'
};
export function TextareaSamples() {
  return createElement('section', { 'aria-label': 'Text entry' },
    createElement('label', { htmlFor: 'textarea-notes' }, 'First comment'),
    createElement(Textarea, {
      ...textareaNative, ref: textareaRef, defaultValue: 'Draft',
      onChange: recordTextareaChange
    }),
    createElement('p', { id: 'textarea-hint' }, 'Shown below the post'),
    createElement(Textarea, { id: 'textarea-code', 'aria-label': 'Custom CSS', variant: textareaVariant }),
    createElement(Textarea, { id: 'textarea-prose', 'aria-label': 'Long-form draft', variant: 'prose' }),
    createElement(Textarea, { id: 'textarea-invalid', 'aria-label': 'Invalid notes', 'aria-invalid': true }),
    createElement(Textarea, { id: 'textarea-disabled', 'aria-label': 'Archived notes', disabled: true }),
    createElement(Textarea, { id: 'textarea-readonly', 'aria-label': 'Published notes', readOnly: true, defaultValue: 'Published' }));
}
export const inputRef = createRef<HTMLInputElement>();
export const inputChanges: string[] = [];
const inputSize: InputSize = 'sm';
const inputVariant: InputVariant = 'code';
const inputType: InputType = 'search';
export const inputNative: InputProps = {
  id: 'input-native', name: 'slug', placeholder: 'project-slug', autoComplete: 'off', required: true,
  'aria-describedby': 'input-native-hint', className: 'w-64 w-80 consumer-input'
};
export function InputSamples({ inputValue = 'Launch notes' }: { inputValue?: string }) {
  // Field-style composition: the consumer owns the label, hint and error text (D1, D7).
  return createElement('section', { 'aria-label': 'Text entry' },
    createElement('label', { htmlFor: 'input-title' }, 'Post title'),
    createElement(Input, { id: 'input-title', ref: inputRef, value: inputValue,
      onChange: (event: ChangeEvent<HTMLInputElement>) => { inputChanges.push(event.target.value); } }),
    createElement(Input, inputNative),
    createElement('p', { id: 'input-native-hint' }, 'Lowercase letters only.'),
    createElement(Input, { id: 'input-search', 'aria-label': 'Search', type: inputType, size: inputSize, variant: inputVariant, icon }),
    createElement(Input, { id: 'input-invalid', 'aria-label': 'Post text', 'aria-invalid': true, 'aria-describedby': 'input-error' }),
    createElement('p', { id: 'input-error' }, 'Keep the post under 280 characters.'),
    createElement(Input, { id: 'input-disabled', 'aria-label': 'Locked', disabled: true, defaultValue: 'fixed' }),
    createElement(Input, { id: 'input-readonly', 'aria-label': 'Token', readOnly: true, defaultValue: 'abc123' }));
}
export const logoHome: LogoProps = { href: '#home', label: 'egdev, home', id: 'logo-home', rel: 'home' };
export const logoNative: LogoProps = { id: 'consumer-logo', title: 'egdev', lang: 'en', className: 'ms-2 consumer-logo' };
export function LogoSamples() {
  const sizes: LogoSize[] = ['sm', 'md', 'lg'];
  const variant: LogoVariant = 'mark';
  return createElement('section', { 'aria-label': 'Brand logos' },
    createElement(Logo, { id: 'logo-default' }),
    sizes.map((size) => createElement(Logo, { key: size, variant, size, id: 'logo-mark-' + size })),
    createElement(Logo, logoHome),
    createElement(Logo, logoNative));
}
export const productMarkImage: ProductMarkProps = { monogram: 'M', label: 'Mando', id: 'mark-mando' };
export const productMarkLink: ProductMarkProps = {
  monogram: 'M', label: 'Mando home', href: '#home', id: 'mark-home', target: '_self'
};
export function ProductMarkSamples() {
  // Passive product images and one home link; router wrapping stays the consumer's (D5).
  return createElement('nav', { 'aria-label': 'Product marks' },
    createElement(ProductMark, productMarkImage),
    createElement(ProductMark, { monogram: 'Cr', label: 'Criterio', id: 'mark-criterio', className: 'mb-1 mb-3 consumer-mark' }),
    createElement(ProductMark, productMarkLink));
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
const titleVariant: TitleVariant = 'hero';
const textVariant = 'eyebrow' satisfies TextVariant;
const raisedTone: TextTone = 'raised';
export const headingHero: HeadingProps = { children: 'Build ', variant: titleVariant, accent: 'in public', id: 'title-hero' };
export const textRaised: TextProps = { children: 'Ship ', variant: 'section', tone: raisedTone, accent: 'today', accentBreak: false };
type TypographySampleProps = { headingLevel?: HeadingLevel };
export function TypographySamples({ headingLevel = 1 }: TypographySampleProps) {
  return createElement('section', { 'aria-labelledby': 'title-hero' },
    createElement(Text, { variant: textVariant, id: 'title-eyebrow', children: 'Weekly stream' }),
    createElement(Heading, { ...headingHero, level: headingLevel }),
    createElement(Heading, { variant: 'display', accent: '.', accentBreak: false, id: 'title-punctuation', children: 'Talk' }),
    createElement(Heading, { variant: 'inverse', accent: 'time', id: 'title-inverse', children: 'Show ' }),
    createElement(Text, { ...textRaised, id: 'title-raised' }),
    createElement(Text, { variant: 'section', accent: 'inline', accentBreak: false, asChild: true,
      children: createElement('span', { id: 'title-slotted', className: 'consumer-span' }, 'Slotted ') }));
}
export const avatarDefaults: AvatarProps = { label: 'Example channel' };
export function AvatarSamples() {
  const sizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl'];
  return createElement('section', { 'aria-label': 'Identities' },
    sizes.map((size) => createElement(Avatar, { ...avatarDefaults, key: size, size, id: 'avatar-' + size })),
    createElement(Avatar, { id: 'avatar-decorative' }),
    createElement(Avatar, { label: 'Channel on LinkedIn, paused', id: 'avatar-paused', size: 'xl',
      paused: true, badgeIcon: 'linkedin', className: 'ms-1 ms-2 [--eg-avatar-ring:var(--color-bg-canvas)]' }));
}
// @ts-expect-error Avatar owns its internal content.
const avatarChildren: AvatarProps = { children: 'AB' };
// @ts-expect-error Avatar has no public ref API.
const avatarRef: AvatarProps = { ref: createRef<HTMLSpanElement>() };
// @ts-expect-error Avatar has no asChild API.
const avatarSlotted: AvatarProps = { asChild: true };
// @ts-expect-error Naming is through label, not a native role override.
const avatarRole: AvatarProps = { role: 'button' };
// @ts-expect-error Naming attributes are component-owned.
const avatarLabel: AvatarProps = { 'aria-label': 'Wrong' };
// @ts-expect-error The image part has an empty alt; name the root through label.
const avatarAlt: AvatarProps = { alt: 'Wrong' };
// @ts-expect-error No arbitrary dimensions.
const avatarSize: AvatarProps = { size: 30 };
// @ts-expect-error Badges use the closed IconName set.
const avatarBadge: AvatarProps = { badgeIcon: 'unknown' };
export const iconDefaults: IconProps = { name: 'plus' };
const iconPreset: IconSize = 'lg';
type IconSampleProps = { iconName?: IconName };
export function IconSamples({ iconName = 'plus' }: IconSampleProps) {
  return createElement('section', { 'aria-label': 'Glyphs' },
    createElement(Icon, { ...iconDefaults, name: iconName, id: 'icon-decorative' }),
    createElement('p', { id: 'icon-labelled-host' },
      createElement(Icon, { name: 'search', label: 'Search status', size: 'sm', filled: true })),
    createElement(Icon, { name: 'check', size: iconPreset, id: 'icon-override', className: 'size-4.5 text-fg-brand-default' }));
}
// Surface: a div ref by default; an HTMLElement ref on the actual slotted host with asChild.
export const iconButtonRef = createRef<HTMLButtonElement>();
export const iconButtonLinkRef = createRef<HTMLButtonElement>();
export const iconButtonCalls: string[] = [];
const iconButtonBase: IconButtonProps = { label: 'Search', icon: createElement(Icon, { name: 'search' }) };
export function IconButtonSamples() {
  const variants: IconButtonVariant[] = ['ghost', 'outline', 'primary', 'secondary'];
  const sizes: IconButtonSize[] = ['sm', 'md', 'lg'];
  return createElement('section', { 'aria-label': 'Icon actions' },
    variants.flatMap((variant) => sizes.map((size) => createElement(IconButton, {
      ...iconButtonBase, key: variant + size, variant, size, id: 'icon-button-' + variant + '-' + size,
      ref: variant === 'ghost' && size === 'md' ? iconButtonRef : undefined,
      onClick: () => iconButtonCalls.push('button')
    }))),
    createElement(IconButton, { ...iconButtonBase, id: 'icon-button-disabled', disabled: true,
      onClick: () => iconButtonCalls.push('disabled') }),
    createElement(IconButton, { ...iconButtonBase, asChild: true, ref: iconButtonLinkRef,
      onClick: (event) => { event.preventDefault(); iconButtonCalls.push('root'); },
      children: createElement('a', { id: 'icon-button-link', href: '#search', target: '_blank', rel: 'noreferrer',
        onClick: () => iconButtonCalls.push('child') }) }),
    createElement(IconButton, { ...iconButtonBase, asChild: true, disabled: true,
      onClick: () => iconButtonCalls.push('disabled-root'),
      children: createElement('a', { id: 'icon-button-disabled-link', href: '#search', tabIndex: 0,
        onClick: () => iconButtonCalls.push('disabled-child') }) }));
}
// @ts-expect-error IconButton always requires a non-empty naming input through label.
const unnamedIconButton: IconButtonProps = { icon: createElement(Icon, { name: 'search' }) };
// @ts-expect-error A label does not replace the required decorative ReactElement.
const missingIconButtonGlyph: IconButtonProps = { label: 'Search' };
// @ts-expect-error IconButton icon must be one ReactElement, not text.
const textIconButton: IconButtonProps = { ...iconButtonBase, icon: 'Search' };
// @ts-expect-error AccessibleIcon supplies hidden text; duplicate aria-label naming is excluded.
const ariaNamedIconButton: IconButtonProps = { ...iconButtonBase, 'aria-label': 'Search' };
// @ts-expect-error IconButton has no pressed API; use Toggle.
const pressedIconButton: IconButtonProps = { ...iconButtonBase, pressed: true };
// @ts-expect-error IconButton has no loading API; use Button with visible text.
const loadingIconButton: IconButtonProps = { ...iconButtonBase, loading: true };
// @ts-expect-error IconButton links compose with asChild; href belongs to the child.
const linkedIconButton: IconButtonProps = { ...iconButtonBase, href: '#search' };
// @ts-expect-error IconButton has no dark treatment.
const darkIconButton: IconButtonProps = { ...iconButtonBase, variant: 'dark' };
// @ts-expect-error IconButton geometry is preset-only.
const numericIconButton: IconButtonProps = { ...iconButtonBase, size: 44 };
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
const selectOptions: SelectOption[] = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'archived', label: 'Archived', disabled: true }
];
const selectSize: SelectSize = 'sm';
export const selectRef = createRef<HTMLButtonElement>();
export const selectDefaults: SelectProps = { options: selectOptions, 'aria-label': 'Visibility' };
export function SelectSamples() {
  return createElement('form', { id: 'visibility-form' },
    createElement('label', { htmlFor: 'select-default' }, 'Visibility'),
    createElement(Select, { ...selectDefaults, id: 'select-default', name: 'visibility', required: true,
      defaultValue: 'public', ref: selectRef, className: 'w-auto mb-1 mb-3' }),
    createElement(Select, { options: selectOptions, id: 'select-compact', size: selectSize,
      'aria-label': 'Compact visibility', placeholder: 'Choose visibility' }),
    createElement(Select, { options: selectOptions, id: 'select-disabled', disabled: true, name: 'disabled-visibility',
      'aria-label': 'Disabled visibility', defaultValue: 'private' }));
}
// @ts-expect-error Select requires its options data.
const missingSelectOptions: SelectProps = {};
// @ts-expect-error Select accepts string option labels, not React elements.
const richSelectOption: SelectOption = { value: 'rich', label: createElement('span', null, 'Rich') };
// @ts-expect-error Select has no public open-state API.
const openSelect: SelectProps = { options: selectOptions, open: true };
// @ts-expect-error Select has no compound-child API.
const childrenSelect: SelectProps = { options: selectOptions, children: 'Public' };
// @ts-expect-error Select has no asChild API.
const slottedSelect: SelectProps = { options: selectOptions, asChild: true };
// @ts-expect-error Select only supports md and sm.
const largeSelect: SelectProps = { options: selectOptions, size: 'lg' };
const toggleSize: ToggleSize = 'sm';
export const toggleRef = createRef<HTMLButtonElement>();
export const toggleDefaults: ToggleProps = { children: 'Show grid' };
export function ToggleSamples() {
  return createElement('section', { 'aria-label': 'Toggle samples' },
    createElement(Toggle, { ...toggleDefaults, id: 'toggle-default', ref: toggleRef }),
    createElement(Toggle, { id: 'toggle-controlled', pressed: true, children: 'Pin', icon: createElement(Icon, { name: 'bookmark' }) }),
    createElement(Toggle, { id: 'toggle-disabled', size: toggleSize, defaultPressed: true, disabled: true, label: 'Pin layer', icon }));
}
// @ts-expect-error Icon-only content requires an accessible label.
const unnamedToggle: ToggleProps = { icon };
// @ts-expect-error Visible text and the icon-only label are mutually exclusive.
const ambiguousToggle: ToggleProps = { children: 'Pin', label: 'Pin', icon };
// @ts-expect-error Toggle always renders a button; asChild is not public.
const slottedToggle: ToggleProps = { children: 'Pin', asChild: true };
// @ts-expect-error aria-pressed is owned by Radix, not an incoming override.
const overriddenToggle: ToggleProps = { children: 'Pin', 'aria-pressed': 'mixed' };
// @ts-expect-error Only preset dimensions are public.
const numericToggle: ToggleProps = { children: 'Pin', size: 40 };
// @ts-expect-error Toggle does not expose private CVA recipes.
import type { toggleVariants } from '@egdev/ui';
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
export function App({ gaugeValue, wideRatio, stackGap, surfaceElevation, dividerSemantic, headingLevel, iconName, spinnerLoading, linkExternal, statusDotPulse, inputValue, progressValue }: { gaugeValue?: number; wideRatio?: number; stackGap?: LayoutGap; surfaceElevation?: SurfaceElevation; dividerSemantic?: boolean; headingLevel?: HeadingLevel; iconName?: IconName; spinnerLoading?: boolean; linkExternal?: boolean; statusDotPulse?: boolean; inputValue?: string; progressValue?: number } = {}) {
  // Intrinsic controls are consumer harness elements, not additional SDK components.
  return createElement('main', null,
    createElement('button', { type: 'button' }, 'Before measurements'),
    createElement('input', { id: 'consumer-email', type: 'email' }),
    createElement(GaugeSamples, { value: gaugeValue }),
    createElement(AspectSamples, { wideRatio }),
    createElement(LayoutSamples, { stackGap }),
    createElement(TypographySamples, { headingLevel }),
    createElement(SurfaceSamples, { surfaceElevation }),
    createElement(VisuallyHiddenSamples),
    createElement(DividerSamples, { semantic: dividerSemantic }),
    createElement(LabelSamples),
    createElement(SkeletonSamples),
    createElement(IconSamples, { iconName }),
    createElement(IconButtonSamples),
    createElement(CheckboxSamples),
    createElement(AvatarSamples),
    createElement(SpinnerSamples, { loading: spinnerLoading }),
    createElement(StatusDotSamples, { pulse: statusDotPulse }),
    createElement(KbdSamples),
    createElement(ButtonSamples),
    createElement(LinkSamples, { external: linkExternal }),
    createElement(BadgeSamples),
    createElement(SliderSamples),
    createElement(ProgressBarSamples, { value: progressValue }),
    createElement(TextareaSamples),
    createElement(InputSamples, { inputValue }),
    createElement(LogoSamples),
    createElement(ProductMarkSamples),
    createElement(SelectSamples),
    createElement(ToggleSamples),
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
// @ts-expect-error Logo artwork is component-owned: no children.
const logoChildren: LogoProps = { children: 'egdev' };
// @ts-expect-error The image role is component-owned.
const logoRole: LogoProps = { role: 'presentation' };
// @ts-expect-error The accessible name comes from label, not aria-label.
const logoAriaLabel: LogoProps = { 'aria-label': 'egdev' };
// @ts-expect-error The accessible name comes from label, not aria-labelledby.
const logoLabelledBy: LogoProps = { href: '/', 'aria-labelledby': 'brand' };
// @ts-expect-error The image is always exposed; it cannot be hidden.
const logoHidden: LogoProps = { 'aria-hidden': true };
// @ts-expect-error Anchor attributes exist only in link mode, with href.
const logoTarget: LogoProps = { target: '_blank' };
// @ts-expect-error Logo has no public ref API (D8).
const referencedLogo: LogoProps = { ref: createRef<HTMLSpanElement>() };
// @ts-expect-error Router links wrap an unlinked Logo; there is no asChild (D4).
const slottedLogo: LogoProps = { href: '/', asChild: true };
// @ts-expect-error Heights are sm, md and lg presets only.
const numericLogo: LogoProps = { size: 32 };
// @ts-expect-error Only the mark and wordmark artwork exist.
const invalidLogo: LogoProps = { variant: 'icon' };
// @ts-expect-error The artwork is never recolored: there is no tone prop (D3).
const tonedLogo: LogoProps = { tone: 'brand' };
// @ts-expect-error StatusDot is an empty decorative marker; it never accepts content.
const statusDotChildren: StatusDotProps = { children: 'Running' };
// @ts-expect-error StatusDot is always hidden; consumers cannot assign a role.
const statusDotRole: StatusDotProps = { role: 'img' };
// @ts-expect-error Hiddenness is component-owned (D8).
const statusDotHidden: StatusDotProps = { 'aria-hidden': false };
// @ts-expect-error The state word lives in adjacent text, not an aria-label (D8).
const statusDotLabel: StatusDotProps = { 'aria-label': 'Running' };
// @ts-expect-error The dot has no accessible name relationship.
const statusDotLabelledBy: StatusDotProps = { 'aria-labelledby': 'module-name' };
// @ts-expect-error StatusDot has no public ref API.
const referencedStatusDot: StatusDotProps = { ref: createRef<HTMLSpanElement>() };
// @ts-expect-error StatusDot cannot delegate its root to a child.
const slottedStatusDot: StatusDotProps = { asChild: true };
// @ts-expect-error Only the seven documented states exist.
const invalidStatusDot: StatusDotProps = { state: 'paused' };
// @ts-expect-error The free ring colour prop was dropped: the ring always uses the surface token (D5).
const ringedStatusDot: StatusDotProps = { ring: 'red' };
// @ts-expect-error pulse is a boolean switch, not a string.
const stringPulseStatusDot: StatusDotProps = { pulse: 'false' };
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
// @ts-expect-error Slider requires a thumb accessible name.
const unnamedSlider: SliderProps = { value: 30 };
// @ts-expect-error The public API is scalar, not Radix's array shape.
const rangeSlider: SliderProps = { label: 'Range', value: [20, 80] };
// @ts-expect-error Slider has no vertical orientation API.
const verticalSlider: SliderProps = { label: 'Volume', orientation: 'vertical' };
// @ts-expect-error Slider has no asChild API.
const slottedSlider: SliderProps = { label: 'Volume', asChild: true };
// @ts-expect-error Slider exposes no ref API on either React major.
const referencedSlider: SliderProps = { label: 'Volume', ref: createRef<HTMLSpanElement>() };
// @ts-expect-error Track, range and thumb content are internal.
const childSlider: SliderProps = { label: 'Volume', children: 'Not permitted' };
// @ts-expect-error Direction is not public in v0.1.
const directedSlider: SliderProps = { label: 'Volume', dir: 'rtl' };
// @ts-expect-error Use onValueChange, not native onChange.
const nativeChangeSlider: SliderProps = { label: 'Volume', onChange: () => {} };
// @ts-expect-error RadioGroup requires its accessible group name (D4).
const unnamedRadio: RadioGroupProps = { options: radioOptions };
// @ts-expect-error RadioGroup renders its options from data; children are not accepted (D2).
const childRadio: RadioGroupProps = { label: 'Visibility', options: radioOptions, children: 'Public' };
// @ts-expect-error Options carry text labels only in v0.1 (D3).
const richRadio: RadioGroupProps = { label: 'Visibility', options: [{ value: 'a', label: createElement('b', null, 'A') }] };
// @ts-expect-error Options have no per-option description in v0.1 (D3).
const describedRadio: RadioGroupProps = { label: 'Visibility', options: [{ value: 'a', label: 'A', description: 'Hint' }] };
// @ts-expect-error Orientation is vertical or horizontal only (D5).
const diagonalRadio: RadioGroupProps = { label: 'Visibility', options: radioOptions, orientation: 'diagonal' };
// @ts-expect-error RadioGroup has no size axis in v0.1 (D8).
const sizedRadio: RadioGroupProps = { label: 'Visibility', options: radioOptions, size: 'sm' };
// @ts-expect-error Selection is reported through onValueChange, not onChange.
const changeRadio: RadioGroupProps = { label: 'Visibility', options: radioOptions, onChange: () => undefined };
// @ts-expect-error The group name comes from label; aria-label is owned.
const ariaRadio: RadioGroupProps = { label: 'Visibility', options: radioOptions, 'aria-label': 'Other' };
// @ts-expect-error RadioGroup cannot delegate its root to a child.
const slottedRadio: RadioGroupProps = { label: 'Visibility', options: radioOptions, asChild: true };
// @ts-expect-error RadioGroup makes no ref promise.
const referencedRadio: ComponentProps<typeof RadioGroup> = { label: 'Visibility', options: radioOptions, ref: createRef<HTMLDivElement>() };
// @ts-expect-error Switch is a bare track; the visible text is a consumer label (D2).
const labelledSwitch: SwitchProps = { label: 'Stream alerts' };
// @ts-expect-error Switch renders only its thumb; children are not accepted.
const childSwitch: SwitchProps = { children: 'On' };
// @ts-expect-error Switch has a single 36x20 size in v0.1 (D5).
const sizedSwitch: SwitchProps = { size: 'sm' };
// @ts-expect-error Switch cannot delegate its root to a child.
const slottedSwitch: SwitchProps = { asChild: true };
// @ts-expect-error Changes are reported through onCheckedChange, not onChange (D3).
const changeSwitch: SwitchProps = { onChange: () => undefined };
// @ts-expect-error The submitted value is a string.
const numericSwitch: SwitchProps = { value: 1 };
// @ts-expect-error onCheckedChange receives the next boolean, not a string.
const stringChangeSwitch: SwitchProps = { onCheckedChange: (checked: 'on') => checked };
// @ts-expect-error The ref targets the root button, not a div (D9).
const divRefSwitch: ComponentProps<typeof Switch> = { ref: createRef<HTMLDivElement>() };
// @ts-expect-error Tooltip content is required.
const missingTooltipContent: TooltipProps = { children: createElement('button') };
// @ts-expect-error Tooltip content is plain text, not rich content (D4).
const richTooltip: TooltipProps = { content: createElement('kbd', null, 'K'), children: createElement('button') };
// @ts-expect-error The trigger is one element, not text (D2).
const textTrigger: TooltipProps = { content: 'Hint', children: 'Trigger' };
// @ts-expect-error Visibility is uncontrolled in v0.1 (D7).
const controlledTooltip: TooltipProps = { content: 'Hint', children: createElement('button'), open: true };
// @ts-expect-error Radix default delays are fixed; there are no delay props (D6).
const delayedTooltip: TooltipProps = { content: 'Hint', children: createElement('button'), delayDuration: 0 };
// @ts-expect-error Only the four sides are supported; align is fixed to center (D5).
const cornerTooltip: TooltipProps = { content: 'Hint', children: createElement('button'), side: 'top-start' };
// @ts-expect-error Tooltip exposes no ref or asChild of its own.
const slottedTooltip: TooltipProps = { content: 'Hint', children: createElement('button'), asChild: true };
// @ts-expect-error ProgressBar value is required.
const missingProgressValue: ProgressBarProps = { label: 'Upload' };
// @ts-expect-error ProgressBar value is a number in percent, not text.
const textProgressValue: ProgressBarProps = { value: '45' };
// @ts-expect-error D7: the lg goal bar cannot be pinned to an edge.
const edgeGoal: ProgressBarProps = { value: 45, size: 'lg', edge: true };
// @ts-expect-error Only sm and lg presets exist.
const mediumProgress: ProgressBarProps = { value: 45, size: 'md' };
// @ts-expect-error Only default and muted treatments exist.
const brandProgress: ProgressBarProps = { value: 45, variant: 'brand' };
// @ts-expect-error D2: the scale is fixed to 0–100; there is no max prop.
const maxProgress: ProgressBarProps = { value: 37, max: 50 };
// @ts-expect-error ProgressBar renders its own fill; it accepts no children.
const childProgress: ProgressBarProps = { value: 45, children: 'Fill' };
// @ts-expect-error Radix owns the progressbar role.
const roleProgress: ProgressBarProps = { value: 45, role: 'meter' };
// @ts-expect-error Radix owns aria-valuenow; value drives it.
const valueNowProgress: ProgressBarProps = { value: 45, 'aria-valuenow': 45 };
// @ts-expect-error label owns the accessible name and decorative state (D4).
const hiddenProgress: ProgressBarProps = { value: 45, 'aria-hidden': false };
// @ts-expect-error ProgressBar has no public ref API.
const referencedProgress: ProgressBarProps = { value: 45, ref: createRef<HTMLDivElement>() };
// @ts-expect-error ProgressBar cannot delegate its root to a child.
const slottedProgress: ProgressBarProps = { value: 45, asChild: true };
// @ts-expect-error Textarea renders its value, never children (D9).
const childrenTextarea: TextareaProps = { children: 'Draft' };
// @ts-expect-error Only default, code and prose treatments exist (D2).
const richTextarea: TextareaProps = { variant: 'rich' };
// @ts-expect-error There is no size axis in v0.1 (D4).
const sizedTextarea: TextareaProps = { size: 'sm' };
// @ts-expect-error Textarea cannot delegate its native root to a child.
const slottedTextarea: TextareaProps = { asChild: true };
// @ts-expect-error The forwarded ref targets an HTMLTextAreaElement, not a div.
const divTextareaRef: ComponentProps<typeof Textarea> = { ref: createRef<HTMLDivElement>() };
// @ts-expect-error Choice, range and file inputs have their own components (D6).
const checkboxInput: InputProps = { type: 'checkbox' };
// @ts-expect-error The own size axis replaces the native size attribute (D5).
const nativeSizeInput: InputProps = { size: 20 };
// @ts-expect-error Only md and sm presets exist (D4).
const largeInput: InputProps = { size: 'lg' };
// @ts-expect-error The code treatment is named code, not mono (D8).
const monoInput: InputProps = { variant: 'mono' };
// @ts-expect-error Invalid is the native aria-invalid attribute, not an own prop (D7).
const invalidPropInput: InputProps = { invalid: true };
// @ts-expect-error Change notification is native onChange only (D11).
const valueChangeInput: InputProps = { onValueChange: () => {} };
// @ts-expect-error A void input element never accepts children.
const childInput: InputProps = { children: 'Text' };
// @ts-expect-error Input has no asChild delegation.
const slottedInput: InputProps = { asChild: true };
// @ts-expect-error The forwarded ref targets the native input, not a generic div (D12).
const wrongInputRef: ComponentProps<typeof Input> = { ref: createRef<HTMLDivElement>() };
export const inputElementRef: ComponentProps<typeof Input> = { ref: createRef<HTMLInputElement>() };
// @ts-expect-error ProductMark requires its accessible label (D6).
const unnamedMark: ProductMarkProps = { monogram: 'M' };
// @ts-expect-error ProductMark requires its visible monogram (D1).
const emptyMark: ProductMarkProps = { label: 'Mando' };
// @ts-expect-error The monogram prop is the only content; children are rejected.
const childMark: ProductMarkProps = { monogram: 'M', label: 'Mando', children: 'M' };
// @ts-expect-error The link is named by label, never by aria-label.
const ariaNamedMark: ProductMarkProps = { monogram: 'M', label: 'Mando home', href: '/', 'aria-label': 'Home' };
// @ts-expect-error The link is named by label, never by aria-labelledby.
const labelledMark: ProductMarkProps = { monogram: 'M', label: 'Mando home', href: '/', 'aria-labelledby': 'home' };
// @ts-expect-error ProductMark has no public ref API (D9).
const referencedMark: ProductMarkProps = { monogram: 'M', label: 'Mando', ref: createRef<HTMLElement>() };
// @ts-expect-error Router integration wraps the mark; there is no asChild.
const slottedMark: ProductMarkProps = { monogram: 'M', label: 'Mando', asChild: true };
// @ts-expect-error v0.1 has one 40px size (D2).
const sizedMark: ProductMarkProps = { monogram: 'M', label: 'Mando', size: 'lg' };
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
// @ts-expect-error Eyebrow is not a heading recipe.
const eyebrowHeading: HeadingProps = { children: 'Not a heading', variant: 'eyebrow' };
// @ts-expect-error Heading semantics come from level only, never asChild.
const slottedHeading: HeadingProps = { children: 'Slotted', asChild: true };
// @ts-expect-error Text never takes a heading level.
const leveledText: TextProps = { children: 'Copy', level: 2 };
// @ts-expect-error The eyebrow has no accent.
const accentedEyebrow: TextProps = { children: 'Weekly', accent: 'stream' };
// @ts-expect-error Inverse has no tone choice.
const tonedInverse: HeadingProps = { children: 'Show', variant: 'inverse', tone: 'raised' };
// @ts-expect-error Neither export accepts HTML injection.
const injectedText: TextProps = { children: 'Copy', dangerouslySetInnerHTML: { __html: '<b>x</b>' } };
// @ts-expect-error Heading owns its native level; aria-level is excluded.
const ariaLevelHeading: HeadingProps = { children: 'Title', 'aria-level': 3 };
// @ts-expect-error The glyph set is closed; unknown names have no runtime fallback.
const unknownGlyph: IconProps = { name: 'sparkles' };
// @ts-expect-error Icon sizes are presets; containers use size-* utilities instead.
const numericIconSize: IconProps = { name: 'plus', size: 18 };
// @ts-expect-error Naming goes through label and AccessibleIcon, never a manual role.
const iconRole: IconProps = { name: 'plus', role: 'img' };
// @ts-expect-error Geometry attributes stay component-owned.
const iconWidth: IconProps = { name: 'plus', width: 24 };
// @ts-expect-error Paint attributes stay component-owned; color comes from currentColor.
const iconFill: IconProps = { name: 'plus', fill: 'red' };
// @ts-expect-error Icon draws only internal path data.
const iconChildren: IconProps = { name: 'plus', children: null };
// @ts-expect-error Icon exposes no ref on either React major.
const referencedIcon: IconProps = { name: 'plus', ref: unsupportedGaugeRef };
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

function assertToggleCSS(css) {
  for (const selector of [
    String.raw`.data-\[state\=on\]\:bg-surface-3`,
    String.raw`.data-\[state\=on\]\:bg-\[image\:var\(--gradient-sheen\)\]`,
    String.raw`.data-\[state\=on\]\:border-border-hairline-strong`,
    String.raw`.group-data-\[state\=on\]\/toggle\:text-fg-brand-raised`,
    String.raw`.active\:scale-97`,
    String.raw`.data-disabled\:opacity-45`,
    String.raw`.motion-reduce\:active\:scale-100`,
    String.raw`.motion-reduce\:transition-none`
  ]) {
    assert.ok(css.includes(selector), 'Missing Toggle selector ' + selector);
  }
  for (const token of [
    'gradient-sheen',
    'shadow-edge-strong',
    'shadow-elev-1',
    'shadow-focus',
    'duration-fast',
    'duration-press',
    'ease-out',
    'ease-snappy'
  ]) {
    assert.ok(css.includes('var(--' + token + ')'), 'Missing Toggle token ' + token);
  }
  assert.match(css, /--tw-scale-x:\s*97%/);
  assert.match(css, /--tw-scale-y:\s*97%/);
  assert.match(css, /scale:\s*var\(--tw-scale-x\)\s+var\(--tw-scale-y\)/);
  assert.match(css, /box-sizing:\s*border-box/);
  assert.doesNotMatch(css, /\.eg-toggle\s*[,{]/);
}

// Checkbox ships only its fixed geometry and Radix-state token recipes, never a marker rule.
function assertCheckboxCSS(css) {
  for (const selector of [
    String.raw`.size-4\.5`,
    '.size-3',
    '.inline-grid',
    '.place-items-center',
    String.raw`.disabled\:opacity-45`,
    String.raw`.aria-invalid\:data-\[state\=unchecked\]\:border-status-danger`,
    String.raw`.data-\[state\=checked\]\:\[\&\>svg\:last-child\]\:hidden`,
    String.raw`.data-\[state\=indeterminate\]\:\[\&\>svg\:first-child\]\:hidden`
  ]) {
    assert.ok(css.includes(selector), 'Missing Checkbox utility ' + selector);
  }
  for (const state of ['checked', 'indeterminate']) {
    const prefix = `.data-\\[state\\=${state}\\]\\:`;
    for (const suffix of [
      String.raw`bg-\[image\:var\(--gradient-btn-primary\)\]`,
      String.raw`shadow-\[var\(--shadow-btn-primary\)\]`,
      String.raw`focus-visible\:shadow-\[var\(--shadow-focus\)\]`
    ]) {
      assert.ok(css.includes(prefix + suffix), 'Missing Checkbox state utility ' + prefix + suffix);
    }
  }
  assert.match(css, /\.size-4\\\.5\s*\{[^}]*width:\s*calc\(var\(--space-1\)\s*\*\s*4\.5\)/);
  assert.match(css, /\.inline-grid\s*\{[^}]*display:\s*inline-grid/);
  assert.doesNotMatch(css, /\.eg-checkbox\s*[,{]/, 'Checkbox has no hand-authored stylesheet');
}

function assertButtonCSS(css) {
  for (const selector of [
    '.box-border',
    '.border-solid',
    '.min-h-12',
    '.min-h-10',
    '.text-cta-label',
    '.text-label-default'
  ]) {
    assert.ok(css.includes(selector), 'Missing Button utility ' + selector);
  }
  for (const token of [
    'gradient-btn-primary',
    'gradient-btn-primary-hover',
    'gradient-btn-secondary',
    'gradient-btn-secondary-hover',
    'shadow-btn-primary',
    'shadow-btn-primary-hover',
    'shadow-btn-pressed',
    'shadow-focus',
    'duration-press',
    'ease-snappy'
  ]) {
    assert.ok(css.includes('var(--' + token + ')'), 'Missing Button binding ' + token);
  }
  assert.ok(css.includes('data-state=loading') || css.includes('data-state="loading"'));
  assert.match(css, /--tw-translate-y:\s*1px\s*;/);
  assert.match(css, /translate:\s*var\(--tw-translate-x\) var\(--tw-translate-y\)/);
  assert.match(css, /--tw-scale-x:\s*97%\s*;/);
  assert.match(css, /scale:\s*var\(--tw-scale-x\) var\(--tw-scale-y\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
}

// Surface ships no stylesheet: only token-backed CVA utilities, including fallback variants.
function assertSelectCSS(css) {
  for (const utility of [
    String.raw`.min-h-11`,
    String.raw`.min-h-9`,
    String.raw`.py-1\.5`,
    String.raw`.border-\(length\:--border-width\)`,
    String.raw`.min-w-\[var\(--radix-select-trigger-width\)\]`,
    String.raw`.max-h-\[var\(--radix-select-content-available-height\)\]`,
    String.raw`.data-\[state\=open\]\:shadow-\[var\(--shadow-well\)\,var\(--shadow-ring-brand\)\]`,
    String.raw`.data-highlighted\:bg-fg-default\/6`,
    String.raw`.data-disabled\:opacity-45`,
    String.raw`.data-placeholder\:text-fg-muted`,
    String.raw`.focus-visible\:ring-\[length\:var\(--focus-width\)\]`,
    String.raw`.focus-visible\:ring-focus-ring-inverse`,
    String.raw`.aria-invalid\:border-status-danger`,
    String.raw`.transition-colors`
  ]) {
    assert.ok(css.includes(utility), 'Missing Select utility ' + utility);
  }
  for (const token of [
    '--shadow-well',
    '--shadow-ring-brand',
    '--shadow-edge-strong',
    '--shadow-elev-3',
    '--blur-overlay',
    '--focus-width'
  ]) {
    assert.ok(css.includes('var(' + token + ')'), 'Select must consume ' + token);
  }
  assert.match(css, /min-height:\s*calc\(var\(--space-1\) \* 11\)/);
  assert.match(css, /min-height:\s*calc\(var\(--space-1\) \* 9\)/);
  assert.match(css, /prefers-reduced-transparency:\s*reduce/);
  assert.match(css, /backdrop-filter:\s*none/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.ok(css.includes(String.raw`.motion-reduce\:transition-none`));
  assert.doesNotMatch(css, /\.eg-select(?:-content)?\s*\{/, 'Select has no stylesheet');
}

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

// Avatar's additive utilities must work without changing prior component guards.
function assertAvatarCSS(css) {
  for (const selector of [
    '.inline-grid',
    '.bg-linear-135',
    '.from-bg-deep',
    '.to-primitive-red-neon',
    '.object-cover',
    String.raw`.size-2\.75`,
    String.raw`.size-3\.25`,
    String.raw`.size-5\.5`,
    String.raw`.size-7\.5`
  ]) {
    assert.ok(css.includes(selector), 'Missing Avatar utility ' + selector);
  }
  assert.match(css, /--tw-gradient-position:\s*135deg/);
  assert.match(css, /--tw-gradient-from:\s*var\(--color-bg-deep[,)]/);
  assert.match(css, /--tw-gradient-to:\s*var\(--color-primitive-red-neon[,)]/);
  assert.match(css, /--tw-ring-color:\s*var\(--eg-avatar-ring,\s*var\(--color-bg-surface\)\)/);
  assert.match(css, /opacity-60\[data-state="paused"\]\s*\{\s*opacity:\s*60%/);
  assert.match(css, /grayscale\[data-state="paused"\]\s*\{\s*--tw-grayscale:\s*grayscale\(100%\)/);
  assert.match(css, /object-fit:\s*cover/);
}

// Icon's static utilities must work in shipped CSS and both consumer build paths.
function assertIconButtonCSS(css) {
  for (const selector of [
    '.inline-grid',
    '.place-items-center',
    '.size-8',
    '.size-10',
    '.size-12',
    '.border-solid',
    '.p-0',
    '.transition-colors'
  ]) {
    assert.ok(css.includes(selector), 'Missing IconButton selector ' + selector);
  }
  for (const token of [
    '--gradient-btn-primary-hover',
    '--gradient-btn-secondary-hover',
    '--gradient-sheen',
    '--color-alpha-red-65',
    '--duration-press',
    '--ease-spring'
  ]) {
    assert.ok(css.includes('var(' + token), 'IconButton must consume ' + token);
  }
  assert.ok(
    /--tw-scale-x:\s*94%/.test(css) && /--tw-scale-y:\s*94%/.test(css),
    'Pressed icon actions must scale to .94 on both axes'
  );
  assert.ok(/scale:\s*var\(--tw-scale-x\) var\(--tw-scale-y\)/.test(css), 'Tailwind composes individual scale axes');
  assert.match(css, /prefers-reduced-motion:\s*no-preference/, 'Transforms only run when motion is safe');
  assert.match(css, /prefers-reduced-motion:\s*reduce/, 'Reduced motion has explicit resets');
  assert.ok(css.includes('data-disabled'), 'Disabled styles must follow the attribute');
  assert.ok(css.includes('focus-visible'), 'Icon actions ship a visible focus treatment');
}

function assertIconCSS(css) {
  for (const [selector, declarations] of [
    ['.inline-block', [/display:\s*inline-block\s*;/]],
    ['.shrink-0', [/flex-shrink:\s*0\s*;/]],
    ['.align-middle', [/vertical-align:\s*middle\s*;/]],
    ['.stroke-current', [/stroke:\s*currentcolor\s*;/i]],
    [String.raw`.stroke-\(length\:--icon-stroke\)`, [/stroke-width:\s*var\(--icon-stroke\)\s*;/]],
    ['.fill-none', [/fill:\s*none\s*;/]],
    ['.fill-current', [/fill:\s*currentcolor\s*;/i]],
    ['.size-4', [/width:\s*var\(--space-4\)\s*;/, /height:\s*var\(--space-4\)\s*;/]],
    [String.raw`.size-\(--icon-size\)`, [/width:\s*var\(--icon-size\)\s*;/, /height:\s*var\(--icon-size\)\s*;/]],
    ['.size-7', [/width:\s*var\(--space-7\)\s*;/, /height:\s*var\(--space-7\)\s*;/]]
  ]) {
    const blocks = css
      .split(selector + ' {')
      .slice(1)
      .map((rest) => rest.slice(0, rest.indexOf('}')));
    assert.ok(blocks.length > 0, 'Missing Icon utility ' + selector);
    for (const declaration of declarations) {
      assert.ok(
        blocks.some((block) => declaration.test(block)),
        selector + ' must ship ' + declaration
      );
    }
  }
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

// All Slider parts ship token-backed utilities, with no extra stylesheet or app Tailwind requirement.
function assertSliderCSS(css) {
  for (const utility of [
    '.touch-none',
    '.select-none',
    '.h-6',
    '.h-1',
    '.grow',
    '.size-4',
    '.bg-surface-0',
    '.bg-fg-brand-default',
    '.bg-fg-default',
    '.transition-shadow',
    String.raw`.pointer-coarse\:h-11`,
    String.raw`.data-\[disabled\]\:opacity-45`,
    String.raw`.focus-visible\:shadow-\[var\(--shadow-focus\)\]`,
    String.raw`.shadow-\[var\(--shadow-well\)\]`,
    String.raw`.shadow-\[var\(--shadow-elev-1\)\]`,
    String.raw`.motion-reduce\:transition-none`
  ]) {
    assert.ok(css.includes(utility), 'Missing Slider utility ' + utility);
  }
  assert.match(css, /@media\s*\(pointer:\s*coarse\)/, 'Slider touch target needs a coarse-pointer query');
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/, 'Slider respects reduced motion');
  assert.doesNotMatch(css, /\.eg-slider[^{]*\{/, 'Slider marker must not introduce an appearance rule');
}

// StatusDot ships ring/glow geometry, token fills and its motion-safe pulse with top-level keyframes.
function assertStatusDotCSS(css) {
  for (const utility of [
    '.inline-block',
    '.rounded-full',
    '.size-2',
    '.size-2\\.5',
    '.ring-2',
    '.ring-bg-surface',
    '.shadow-glow-hot',
    '.bg-status-success',
    '.bg-status-info',
    '.bg-status-warning',
    '.bg-status-danger',
    '.bg-primitive-neutral-600',
    '.bg-fg-brand-default',
    '.bg-primitive-white'
  ]) {
    assert.ok(css.includes(utility), 'Missing StatusDot utility ' + utility);
  }
  assert.match(
    css,
    /\.ring-bg-surface\s*\{[^}]*--tw-ring-color:\s*var\(--color-bg-surface[,)]/,
    'Ring must use the surface token'
  );
  assert.match(
    css,
    /prefers-reduced-motion:\s*no-preference\)\s*\{\s*\.motion-safe\\:animate-\\\[eg-status-dot-pulse_2\\\.4s_var\\\(--ease-out\\\)_infinite\\\]\s*\{\s*animation:\s*eg-status-dot-pulse 2\.4s var\(--ease-out\) infinite/,
    'The pulse must only run without a reduced-motion preference'
  );
  assert.match(
    css,
    /@keyframes eg-status-dot-pulse\s*\{[^@]*scale\(0?\.72\)[^@]*opacity:\s*(?:75%|0?\.75)/,
    'StatusDot pulse keyframes must ship'
  );
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

// Switch ships its well/checked/thumb token utilities and Tailwind's translate initial values; no Switch stylesheet.
function assertSwitchCSS(css) {
  for (const utility of [
    '.box-border',
    '.border-border-control',
    '.bg-surface-0',
    '.bg-fg-secondary',
    '.rounded-full',
    '.shadow-\\[var\\(--shadow-well\\)\\]',
    '.data-\\[state\\=checked\\]\\:bg-\\[image\\:var\\(--gradient-btn-primary\\)\\]',
    '.data-\\[state\\=checked\\]\\:shadow-\\[var\\(--shadow-btn-primary\\)\\]',
    '.data-\\[state\\=checked\\]\\:bg-action-primary-solid-fg',
    '.data-\\[state\\=checked\\]\\:focus-visible\\:shadow-\\[var\\(--shadow-focus\\)\\]',
    '.disabled\\:opacity-45',
    '.motion-reduce\\:transition-none'
  ]) {
    assert.ok(css.includes(utility), 'Missing Switch utility ' + utility);
  }
  assert.match(css, /\.w-9\s*\{[^}]*width:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*9\)/, 'Switch track width');
  assert.match(
    css,
    /\.size-3\\\.5\s*\{[^}]*width:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*3\.5\)/,
    'Switch thumb size'
  );
  assert.match(
    css,
    /\.data-\\\[state\\=checked\\\]\\:translate-x-4\[data-state="checked"\]\s*\{[^}]*translate:\s*var\(--tw-translate-x\)/,
    'Switch thumb travel'
  );
  assert.match(
    css,
    /transition-property:\s*translate,\s*background-color/,
    'The thumb animates the translate property'
  );
  assert.match(css, /--tw-translate-y:\s*0/, 'The translate pair must resolve without Tailwind');
  assert.doesNotMatch(css, /\.eg-switch[^{]*\{/, 'Switch has no stylesheet: its marker carries no rule');
}

// Tooltip ships the Material overlay recipe, its fallbacks and the enter fade as utilities; no Tooltip stylesheet.
function assertTooltipCSS(css) {
  for (const utility of [
    '.bg-surface-overlay',
    '.backdrop-saturate-150',
    '.border-border-hairline-strong',
    '.text-fg-default',
    '.transition-opacity',
    '.starting\\:opacity-0',
    '.motion-reduce\\:transition-none'
  ]) {
    assert.ok(css.includes(utility), 'Missing Tooltip utility ' + utility);
  }
  assert.match(
    css,
    /backdrop-blur-\\\[var\\\(--blur-overlay\\\)\\\]\s*\{[^}]*blur\(var\(--blur-overlay\)\)/,
    'Tooltip blur'
  );
  assert.match(css, /--tw-shadow:\s*var\(--shadow-edge-strong\),\s*var\(--shadow-elev-3\)/, 'Tooltip two-layer shadow');
  assert.match(css, /max-width:\s*var\(--radix-tooltip-content-available-width\)/, 'Tooltip width follows Radix');
  assert.match(css, /transition-duration:\s*var\(--duration-fast\)/, 'Tooltip fade duration token');
  assert.match(css, /@starting-style\s*\{\s*\.starting\\:opacity-0\s*\{\s*opacity:\s*0%?/, 'Tooltip enter fade');
  assert.match(
    css,
    /prefers-reduced-transparency\\:reduce\\\)\\\]\\:bg-surface-2\s*\{[^}]*background-color:\s*var\(--color-surface-2/,
    'Tooltip solid fallback'
  );
  assert.doesNotMatch(css, /\.eg-tooltip[^{]*\{/, 'Tooltip marker must not become a shipped CSS rule');
}

// ProgressBar ships token tracks/fills, the static scale utility and token motion; no ProgressBar stylesheet.
function assertProgressBarCSS(css) {
  for (const utility of [
    '.bg-border-subtle',
    '.bg-surface-0',
    '.shadow-well',
    '.bg-bg-glass',
    '.inset-x-0',
    '.bottom-0',
    '.pointer-events-none',
    '.bg-fg-brand-default',
    '.bg-fg-muted',
    '.shadow-edge-strong',
    '.origin-left',
    '.transition-transform',
    'motion-reduce\\:transition-none'
  ]) {
    assert.ok(css.includes(utility), 'Missing ProgressBar utility ' + utility);
  }
  assert.match(
    css,
    /\.h-0\\\.5\s*\{[^}]*height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*0\.5\)/,
    'sm hairline height'
  );
  assert.match(css, /\.h-2\\\.5\s*\{[^}]*height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*2\.5\)/, 'lg goal height');
  assert.match(
    css,
    /\.bg-\\\[image\\:var\\\(--gradient-progress\\\)\\\]\s*\{[^}]*background-image:\s*var\(--gradient-progress\)/,
    'lg gradient fill'
  );
  assert.match(
    css,
    /\.scale-x-\\\[var\\\(--eg-progress-value\\\)\\\]\s*\{[^}]*--tw-scale-x:\s*var\(--eg-progress-value\)[^}]*scale:\s*var\(--tw-scale-x\)\s+var\(--tw-scale-y\)/,
    'The fill scale must read --eg-progress-value'
  );
  assert.match(css, /--tw-scale-y:\s*1/, 'The y scale must resolve without Tailwind');
  assert.match(
    css,
    /\.duration-\\\[var\\\(--duration-base\\\)\\\]\s*\{[^}]*transition-duration:\s*var\(--duration-base\)/
  );
  assert.match(css, /\.ease-\\\[var\\\(--ease-out\\\)\\\]\s*\{[^}]*transition-timing-function:\s*var\(--ease-out\)/);
  assert.doesNotMatch(
    css,
    /\.eg-progress-fill[^{]*\{/,
    'ProgressBar has no stylesheet: its fill marker carries no rule'
  );
}
// Textarea ships its well, sheet and state utilities from the token theme; no Textarea stylesheet.
function assertTextareaCSS(css) {
  for (const utility of [
    '.resize-y',
    '.box-border',
    '.rounded-md',
    '.bg-surface-0',
    '.bg-surface-1',
    '.bg-primitive-neutral-950',
    '.border-border-control',
    '.border-border-hairline',
    '.font-mono',
    '.text-code',
    '.text-body-default',
    '.text-fg-default'
  ]) {
    assert.ok(css.includes(utility), 'Missing Textarea utility ' + utility);
  }
  assert.match(
    css,
    /\.min-h-30\s*\{[^}]*min-height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*30\)/,
    'Textarea well minimum'
  );
  assert.match(
    css,
    /\.min-h-70\s*\{[^}]*min-height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*70\)/,
    'Textarea prose minimum'
  );
  assert.match(
    css,
    /\.shadow-\\\[var\\\(--shadow-well\\\)\\\]\s*\{[^}]*--tw-shadow:\s*var\(--shadow-well\)/,
    'Textarea well shadow'
  );
  assert.match(
    css,
    /\.bg-\\\[image\\:var\\\(--gradient-sheen\\\)\\\]\s*\{[^}]*background-image:\s*var\(--gradient-sheen\)/,
    'Prose sheen'
  );
  assert.match(
    css,
    /\.aria-invalid\\:border-status-danger\[aria-invalid="true"\]\s*\{[^}]*border-color:\s*var\(--color-status-danger/,
    'Invalid border'
  );
  assert.match(css, /\.disabled\\:opacity-45:disabled\s*\{[^}]*opacity:\s*45%/, 'Disabled opacity');
  assert.ok(css.includes('.motion-reduce\\:transition-none'), 'Reduced motion removes the transition');
  assert.doesNotMatch(css, /\.eg-textarea[^{]*\{/, 'Textarea marker must not become a shipped CSS rule');
}

// Input ships its Material well, state variants and presets as token utilities; no Input stylesheet.
function assertInputCSS(css) {
  for (const utility of [
    '.border-border-control',
    '.bg-primitive-neutral-950',
    '.font-mono',
    '.text-code',
    '.text-body-default',
    '.placeholder\\:text-fg-muted',
    '.hover\\:border-fg-muted',
    '.focus-visible\\:border-border-brand-strong',
    '.aria-invalid\\:border-status-danger',
    '.read-only\\:hover\\:border-border-control',
    '.disabled\\:cursor-not-allowed',
    '.motion-reduce\\:transition-none'
  ]) {
    assert.ok(css.includes(utility), 'Missing Input utility ' + utility);
  }
  assert.match(css, /--tw-shadow:\s*var\(--shadow-well\),\s*var\(--shadow-ring-brand\)/, 'Input focus ring must ship');
  assert.match(
    css,
    /\.min-h-11\s*\{[^}]*min-height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*11\)/,
    'Input md height'
  );
  assert.match(
    css,
    /\.min-h-9\s*\{[^}]*min-height:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*9\)/,
    'Input sm height'
  );
  assert.match(
    css,
    /\.pl-9\s*\{[^}]*padding-left:\s*calc\(var\(--(?:space-1|spacing)\)\s*\*\s*9\)/,
    'Input icon offset'
  );
  assert.match(css, /:has\(:is\(:disabled\)\)\s*\{[^}]*opacity:\s*45%/, 'Input disabled dimming');
  assert.match(css, /transition-duration:\s*var\(--duration-fast\)/, 'Input transition duration token');
  assert.doesNotMatch(css, /\.eg-input[^{]*\{/, 'Input has no stylesheet: its marker carries no rule');
}

// ProductMark ships the product-mark Material and link focus utilities from the token theme; no stylesheet.
// Dropzone utilities ship for native CSS consumers without enabling Tailwind preflight.
function assertDropzoneCSS(css) {
  for (const selector of [
    '.min-w-24',
    '.min-h-24',
    '.min-h-14',
    '.border-dashed',
    '.transition-colors',
    String.raw`.gap-1\.5`,
    String.raw`.gap-2\.5`,
    String.raw`.data-\[state\=over\]\:bg-alpha-red-07`,
    String.raw`.data-\[state\=over\]\:border-border-brand`,
    String.raw`.data-\[state\=over\]\:text-fg-default`,
    String.raw`.focus-visible\:shadow-focus`,
    String.raw`.disabled\:opacity-45`,
    String.raw`.disabled\:pointer-events-none`,
    String.raw`.disabled\:cursor-not-allowed`,
    String.raw`.motion-reduce\:transition-none`
  ]) {
    assert.ok(css.includes(selector), 'Missing Dropzone utility ' + selector);
  }
  assert.match(css, /min-width:\s*var\(--space-24\)/);
  assert.match(css, /min-height:\s*var\(--space-14\)/);
  assert.match(css, /transition-property:[^;]*background-color[^;]*border-color[^;]*;/);
  assert.match(css, /background-image:\s*none/);
  assert.match(css, /box-shadow:\s*none/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
}

function assertProductMarkCSS(css) {
  for (const utility of [
    '.size-10',
    '.rounded-md',
    '.shadow-btn-primary',
    '.text-action-primary-solid-fg',
    '.font-display',
    '.text-heading-small',
    '.no-underline',
    '.focus-visible\\:outline-none',
    '.focus-visible\\:shadow-focus'
  ]) {
    assert.ok(css.includes(utility), 'Missing ProductMark utility ' + utility);
  }
  assert.match(
    css,
    /\.bg-\\\(image\\:--gradient-btn-primary\\\)\s*\{[^}]*background-image:\s*var\(--gradient-btn-primary\)/,
    'The product-mark fill must use the gradient-btn-primary token'
  );
  assert.match(css, /\.size-10\s*\{[^}]*width:\s*var\(--space-10\)/, 'The tile must be 40px through --space-10');
  assert.doesNotMatch(css, /\.eg-product-mark[^{]*\{/, 'ProductMark has no stylesheet: its marker carries no rule');
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

// Assert the same static recipe in packed native and Tailwind consumer builds.
function assertBadgeCSS(css) {
  const rule = (utility) => {
    const selector = `.${utility.replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`)}`;
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = new RegExp(`${escaped}\\s*\\{([^}]+)`).exec(css);
    assert.ok(match, `Missing Badge utility ${utility}`);
    return match[1];
  };
  for (const tone of ['fg-secondary', 'status-info', 'status-success', 'status-warning', 'status-danger']) {
    assert.ok(rule(`text-${tone}`).includes(`var(--color-${tone}`));
    assert.ok(rule(`bg-${tone}`).includes(`var(--color-${tone}`));
    for (const [prefix, opacity] of [
      ['border', '30%'],
      ['bg', '8%']
    ]) {
      const body = rule(`${prefix}-${tone}/${prefix === 'border' ? 30 : 8}`);
      assert.ok(body.includes(`var(--color-${tone}`) && body.includes(opacity), `${tone} ${opacity}`);
    }
  }
  for (const [utility, token] of [
    ['text-primitive-red-200', 'color-primitive-red-200'],
    ['border-alpha-red-22', 'color-alpha-red-22'],
    ['bg-alpha-red-12', 'color-alpha-red-12'],
    ['bg-action-primary-solid-bg', 'color-action-primary-solid-bg'],
    ['text-action-primary-solid-fg', 'color-action-primary-solid-fg'],
    ['text-fg-on-status', 'color-fg-on-status']
  ]) {
    assert.ok(rule(utility).includes(`var(--${token}`), utility);
  }
  for (const [utility, factor] of [
    ['size-3.5', '3.5'],
    ['gap-1.5', '1.5'],
    ['py-1.5', '1.5'],
    ['px-2.5', '2.5']
  ]) {
    assert.ok(rule(utility).includes(`calc(var(--space-1) * ${factor})`), utility);
  }
  for (const utility of [
    'inline-flex',
    'items-center',
    'shrink-0',
    'rounded-full',
    'border',
    'border-transparent',
    'whitespace-nowrap',
    'font-sans',
    'text-label-default',
    'shadow-none'
  ]) {
    rule(utility);
  }
  const theme = readFileSync(fileURLToPath(import.meta.resolve('@egdev/tokens/theme.css')), 'utf8');
  const edge = /--shadow-edge:\s*([^;]+);/.exec(theme)?.[1];
  assert.ok(edge);
  assert.ok(
    rule('shadow-edge').includes(`--tw-shadow: ${edge.replace(/(rgba\([^)]+\))/, 'var(--tw-shadow-color, $1)')};`)
  );
  assert.match(rule('shadow-none'), /--tw-shadow:\s*0 0 #0000\s*;/);
  assert.doesNotMatch(css, /\.eg-badge\s*[,{]/, 'Badge has no stylesheet');
}

function assertBadgeDOM(document) {
  const badges = [...document.querySelectorAll('section[aria-label="Static labels"] > .eg-badge')];
  assert.equal(badges.length, 13, 'Default plus twelve tone/treatment combinations');
  const plain = document.getElementById('badge-default');
  assert.equal(plain.textContent, 'Draft');
  assert.equal(plain.childElementCount, 0, 'No automatic icon');
  assert.equal(plain.getAttribute('data-tone'), 'neutral');
  assert.equal(plain.getAttribute('data-variant'), 'soft');
  assert.equal(plain.getAttribute('title'), 'Publication');
  assert.ok(plain.classList.contains('mt-2') && !plain.classList.contains('mt-1'));
  for (const badge of badges) {
    assert.equal(badge.tagName, 'SPAN');
    for (const attribute of ['role', 'tabindex', 'aria-live', 'data-state', 'tone', 'variant', 'icon']) {
      assert.equal(badge.hasAttribute(attribute), false, attribute);
    }
    assert.ok(badge.classList.contains('text-label-default'), 'Typography survives foreground merging');
    const tone = badge.getAttribute('data-tone');
    const solid = badge.getAttribute('data-variant') === 'solid';
    const color = tone === 'neutral' ? 'fg-secondary' : 'status-' + tone;
    assert.ok(badge.classList.contains(solid ? 'shadow-none' : 'shadow-edge'));
    if (solid) {
      assert.ok(badge.classList.contains('border-transparent'));
      assert.ok(badge.classList.contains(tone === 'brand' ? 'bg-action-primary-solid-bg' : 'bg-' + color));
      assert.ok(badge.classList.contains(tone === 'brand' ? 'text-action-primary-solid-fg' : 'text-fg-on-status'));
    } else {
      assert.ok(badge.classList.contains(tone === 'brand' ? 'bg-alpha-red-12' : 'bg-' + color + '/8'));
      assert.ok(badge.classList.contains(tone === 'brand' ? 'border-alpha-red-22' : 'border-' + color + '/30'));
      assert.ok(badge.classList.contains(tone === 'brand' ? 'text-primitive-red-200' : 'text-' + color));
    }
    if (badge !== plain) {
      const wrapper = badge.firstElementChild;
      assert.equal(wrapper.getAttribute('aria-hidden'), 'true');
      assert.ok(wrapper.classList.contains('size-3.5') && wrapper.classList.contains('shrink-0'));
      assert.ok(wrapper.querySelector('svg.eg-icon').classList.contains('size-3.5'));
      assert.equal(badge.lastChild.textContent, 'Published');
    }
  }
}

// RadioGroup ships its row, well/checked radio and indicator token utilities; no RadioGroup stylesheet.
function assertRadioGroupCSS(css) {
  for (const utility of [
    '.min-h-10',
    '.size-5',
    '.size-2',
    '.gap-x-6',
    '.gap-y-1',
    '.place-items-center',
    '.border-border-control',
    '.bg-surface-0',
    '.bg-action-primary-solid-fg',
    '.shadow-\\[var\\(--shadow-well\\)\\]',
    '.has-\\[\\[data-state\\=checked\\]\\]\\:text-fg-default',
    '.has-\\[\\[data-disabled\\]\\]\\:opacity-45',
    '.hover\\:border-fg-muted',
    '.data-\\[state\\=checked\\]\\:border-action-primary-solid-bg',
    '.data-\\[state\\=checked\\]\\:bg-\\[image\\:var\\(--gradient-btn-primary\\)\\]',
    '.data-\\[state\\=checked\\]\\:shadow-\\[var\\(--shadow-btn-primary\\)\\]',
    '.data-\\[state\\=checked\\]\\:focus-visible\\:shadow-\\[var\\(--shadow-focus\\)\\]',
    '.disabled\\:pointer-events-none',
    '.cursor-pointer'
  ]) {
    assert.ok(css.includes(utility), 'Missing RadioGroup utility ' + utility);
  }
  assert.match(css, /\.min-h-10\s*\{[^}]*min-height:\s*var\(--space-10\)/, 'RadioGroup 40px row');
  assert.match(css, /\.size-5\s*\{[^}]*width:\s*var\(--space-5\)/, 'RadioGroup 20px radio');
  assert.match(css, /transition-property:\s*border-color,\s*box-shadow/, 'The radio animates border and shadow only');
  assert.doesNotMatch(css, /\.eg-radio-group[^{]*\{/, 'RadioGroup has no stylesheet: its marker carries no rule');
}

// Logo ships token heights, the logo-token inks and the link focus ring; its legacy marker stays in components.
function assertLogoCSS(css) {
  for (const utility of ['.inline-block', '.leading-none', '.rounded-sm', '.h-7', '.h-8', '.h-full', '.w-auto']) {
    assert.ok(css.includes(utility), 'Missing Logo utility ' + utility);
  }
  assert.match(css, /\.h-9\s*\{[^}]*height:\s*calc\(var\(--space-1\)\s*\*\s*9\)/, 'lg must be 9 spacing steps');
  assert.match(css, /\.fill-\\\(--logo-red\\\)\s*\{[^}]*fill:\s*var\(--logo-red\)/, 'Light face must use --logo-red');
  assert.match(css, /\.fill-\\\(--logo-red-shade\\\)\s*\{[^}]*fill:\s*var\(--logo-red-shade\)/, 'Shade face token');
  assert.match(css, /\.fill-primitive-white\s*\{[^}]*fill:\s*var\(--color-primitive-white/, 'White name primitive');
  assert.match(css, /\.focus-visible\\:shadow-focus:focus-visible\s*\{[^}]*#ff0036/i, 'Link focus ring');
  assert.match(
    css,
    /\.focus-visible\\:outline-none:focus-visible\s*\{[^}]*outline-style:\s*none/,
    'Link outline reset'
  );
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
for (const utility of ['.text-title-section', '.text-title-hero', '.text-title-show', '.text-title-display', '.text-fg-brand-raised', '.text-fg-on-flood', 'text-shadow: var(--text-shadow-title-hero)', '.before\\\\:rotate-45']) {
  assert.ok(shippedStyles.includes(utility), 'Packed styles must retain typography utility ' + utility);
}
assert.doesNotMatch(shippedStyles, /\\.eg-(?:text|heading)\\s*[,{]/, 'Text/Heading markers must not become shipped CSS rules');
${assertSurfaceCSS.toString()}
assertSurfaceCSS(shippedStyles);
${assertLinkCSS.toString()}
assertLinkCSS(shippedStyles);
assert.deepEqual(Object.keys(await import('@egdev/ui')).sort(), [
  'AspectRatio',
  'Avatar',
  'Badge',
  'Button',
  'Checkbox',
  'Cluster',
  'Divider',
  'Dropzone',
  'Gauge',
  'Heading',
  'Icon',
  'IconButton',
  'Input',
  'Kbd',
  'Label',
  'Link',
  'Logo',
  'Portal',
  'ProductMark',
  'ProgressBar',
  'RadioGroup',
  'Select',
  'Skeleton',
  'Slider',
  'Slot',
  'Slottable',
  'Spinner',
  'Stack',
  'StatusDot',
  'Surface',
  'Switch',
  'Text',
  'Textarea',
  'Toggle',
  'Tooltip',
  'VisuallyHidden',
  'badgeVariants',
  'cn',
  'dropzoneVariants',
  'labelVariants',
  'progressBarVariants',
  'radioGroupVariants',
  'sliderVariants',
  'statusDotVariants',
  'surfaceVariants',
  'tooltipVariants'
]);
${assertCheckboxCSS.toString()}
assertCheckboxCSS(shippedStyles);
${assertButtonCSS.toString()}
${assertBadgeCSS.toString()}
assertBadgeCSS(shippedStyles);
${assertGaugeCSS.toString()}
${assertDividerCSS.toString()}
${assertSkeletonCSS.toString()}
${assertIconCSS.toString()}
${assertIconButtonCSS.toString()}
${assertSpinnerCSS.toString()}
${assertLogoCSS.toString()}
${assertStatusDotCSS.toString()}
${assertKbdCSS.toString()}
${assertAvatarCSS.toString()}
${assertSliderCSS.toString()}
${assertRadioGroupCSS.toString()}
${assertSwitchCSS.toString()}
${assertTooltipCSS.toString()}
${assertProgressBarCSS.toString()}
${assertTextareaCSS.toString()}
${assertInputCSS.toString()}
${assertDropzoneCSS.toString()}
${assertProductMarkCSS.toString()}
assertDropzoneCSS(shippedStyles);
assertIconButtonCSS(shippedStyles);
${assertToggleCSS.toString()}
${assertSelectCSS.toString()}
assertSelectCSS(shippedStyles);
assertButtonCSS(shippedStyles);
assertAvatarCSS(shippedStyles);
assertGaugeCSS(shippedStyles);
assertIconCSS(shippedStyles);
assertDividerCSS(shippedStyles, readFileSync(fileURLToPath(import.meta.resolve('@egdev/ui')), 'utf8'));
assertSkeletonCSS(shippedStyles);
assertSpinnerCSS(shippedStyles);
assertLogoCSS(shippedStyles);
assertStatusDotCSS(shippedStyles);
assertKbdCSS(shippedStyles);
assertSliderCSS(shippedStyles);
assertRadioGroupCSS(shippedStyles);
assertSwitchCSS(shippedStyles);
assertTooltipCSS(shippedStyles);
assertProgressBarCSS(shippedStyles);
assertTextareaCSS(shippedStyles);
assertInputCSS(shippedStyles);
assertProductMarkCSS(shippedStyles);
assertToggleCSS(shippedStyles);
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

function assertLinkCSS(css) {
  for (const selector of [
    '.border-b',
    '.border-border-brand',
    '.text-label-default',
    '.no-underline',
    '.cursor-pointer',
    '.transform-none',
    String.raw`.pb-0\.5`,
    String.raw`.transition-\[border-color\,color\]`,
    String.raw`.transition-\[translate\]`,
    String.raw`.duration-\(--duration-fast\)`,
    String.raw`.duration-\(--duration-base\)`,
    String.raw`.hover\:border-fg-brand-default`,
    String.raw`.hover\:text-primitive-red-200`,
    String.raw`.group-hover\/link\:translate-x-0\.5`,
    String.raw`.group-hover\/link\:-translate-y-0\.5`,
    String.raw`.motion-reduce\:translate-none`,
    String.raw`.motion-reduce\:transition-none`,
    String.raw`.focus-visible\:\[box-shadow\:var\(--shadow-focus\)\]`,
    String.raw`.focus-visible\:rounded-sm`
  ]) {
    assert.ok(css.includes(selector), 'Missing Link utility ' + selector);
  }
  assert.match(css, /\.transform-none\s*\{[^}]*transform:\s*none/);
  assert.match(css, /translate:\s*var\(--tw-translate-x\) var\(--tw-translate-y\)/);
  assert.match(css, /transition-property:\s*border-color,\s*color/);
  assert.match(css, /transition-property:\s*translate/);
  assert.match(css, /transition-duration:\s*var\(--duration-fast\)/);
  assert.match(css, /transition-duration:\s*var\(--duration-base\)/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
}

const ssr = `
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { JSDOM } from ${JSON.stringify(import.meta.resolve('jsdom'))};
import { AspectRatio, Divider, Gauge } from '@egdev/ui';
import { App, DropzoneSamples, RadioGroupSamples, SlotSample, SwitchSamples, TooltipSamples, progressEdgeRecipe } from './consumer.ts';
const dropzoneDocument = new JSDOM(renderToString(createElement(DropzoneSamples)));
try {
  const body = dropzoneDocument.window.document.body;
  const button = body.firstElementChild;
  const input = button.nextElementSibling;
  assert.equal(body.children.length, 2, 'Dropzone renders a fragment without a wrapper');
  assert.equal(button.tagName, 'BUTTON');
  assert.equal(button.type, 'button');
  assert.equal(button.textContent, 'Add media');
  assert.equal(button.getAttribute('data-state'), 'idle');
  assert.ok(button.classList.contains('eg-dropzone') && button.classList.contains('flex-row'));
  assert.equal(button.querySelector('svg').getAttribute('aria-hidden'), 'true');
  assert.equal(input.tagName, 'INPUT');
  assert.equal(input.type, 'file');
  assert.equal(input.hidden, true);
  assert.equal(input.tabIndex, -1);
  assert.equal(input.accept, 'image/*');
  assert.equal(input.multiple, true);
  assert.equal(input.hasAttribute('name'), false);
  assert.equal(input.hasAttribute('required'), false);
} finally {
  dropzoneDocument.window.close();
}
// RadioGroup SSR: named Radix radiogroups; without a DOM, Radix always emits each hidden radio input.
const radioDocument = new JSDOM(renderToString(createElement(RadioGroupSamples)));
try {
  const radioForm = radioDocument.window.document.getElementById('radio-form');
  const groups = [...radioForm.querySelectorAll('div.eg-radio-group')];
  assert.equal(groups.length, 4, 'One root per RadioGroup');
  for (const group of groups) {
    assert.equal(group.getAttribute('role'), 'radiogroup');
    assert.ok(group.getAttribute('aria-label'), 'Each group is named by its label');
    for (const control of group.querySelectorAll('button[role="radio"]')) {
      assert.equal(control.getAttribute('type'), 'button');
      assert.equal(control.nextElementSibling?.getAttribute('type'), 'radio', 'Radix hidden input follows the radio');
      const label = control.nextElementSibling.nextElementSibling;
      assert.equal(label?.tagName, 'LABEL');
      assert.equal(label.getAttribute('for'), control.id, 'The visible label names its radio');
    }
  }
  const visibility = radioDocument.window.document.getElementById('radio-visibility');
  assert.equal(visibility.getAttribute('aria-label'), 'Visibility');
  assert.equal(visibility.getAttribute('aria-required'), 'true');
  assert.equal(visibility.getAttribute('aria-orientation'), 'vertical');
  assert.equal(visibility.querySelectorAll('input[name="visibility"][required]').length, 3);
  assert.equal(visibility.querySelector('button[value="private"]').hasAttribute('disabled'), true);
  const format = radioDocument.window.document.getElementById('radio-format');
  assert.equal(format.getAttribute('aria-orientation'), 'horizontal');
  assert.ok(format.className.includes('flex-wrap'), 'Horizontal groups wrap');
  assert.equal(format.querySelector('button[value="video"]').getAttribute('aria-checked'), 'true');
  assert.equal(format.querySelector('button[value="video"]').children.length, 1, 'The checked radio shows its indicator');
  assert.equal(format.querySelector('button[value="live"]').children.length, 0);
  const locked = radioDocument.window.document.getElementById('radio-locked');
  assert.equal(locked.hasAttribute('data-disabled'), true);
  assert.equal(locked.querySelectorAll('button[disabled]').length, 3);
  const nativeGroup = radioDocument.window.document.getElementById('radio-native');
  assert.equal(nativeGroup.getAttribute('aria-describedby'), 'radio-hint');
  assert.ok(nativeGroup.className.startsWith('eg-radio-group '), 'The public marker leads the root classes');
  assert.ok(nativeGroup.className.endsWith(' ms-2 consumer-radio'), 'Consumer layout classes merge last');
  assert.ok(!nativeGroup.className.split(' ').includes('ms-1'), 'Conflicting margin utilities resolve through cn()');
  assert.ok(!nativeGroup.querySelector('.consumer-radio'), 'Rows and radios take no consumer classes');
  const ids = [...radioForm.querySelectorAll('button[role="radio"]')].map((control) => control.id);
  assert.equal(new Set(ids).size, ids.length, 'Item ids are unique across instances');
} finally {
  radioDocument.window.close();
}

// Switch SSR: Radix switch buttons with thumbs; without a DOM, Radix always emits its hidden form input.
const switchDocument = new JSDOM(renderToString(createElement(SwitchSamples)));
try {
  const switchForm = switchDocument.window.document.getElementById('switch-form');
  const switches = [...switchForm.querySelectorAll('button.eg-switch')];
  assert.equal(switches.length, 4, 'One root button per Switch');
  for (const control of switches) {
    assert.equal(control.getAttribute('role'), 'switch');
    assert.equal(control.getAttribute('type'), 'button');
    assert.equal(control.children.length, 1, 'Each Switch renders exactly its thumb');
    assert.equal(control.firstElementChild.tagName, 'SPAN');
    assert.equal(control.firstElementChild.getAttribute('data-state'), control.getAttribute('data-state'));
    assert.equal(control.nextElementSibling?.getAttribute('type'), 'checkbox', 'Radix bubble input follows the button');
    assert.equal(control.nextElementSibling?.getAttribute('aria-hidden'), 'true');
  }
  const alerts = switchDocument.window.document.getElementById('switch-alerts');
  assert.equal(alerts.getAttribute('aria-checked'), 'false');
  assert.equal(alerts.getAttribute('aria-required'), 'true');
  assert.equal(alerts.getAttribute('value'), 'on');
  assert.equal(alerts.nextElementSibling.getAttribute('name'), 'alerts');
  assert.equal(switchForm.querySelector('label').getAttribute('for'), 'switch-alerts');
  const overlay = switchDocument.window.document.getElementById('switch-overlay');
  assert.equal(overlay.getAttribute('aria-checked'), 'true');
  assert.equal(overlay.getAttribute('data-state'), 'checked');
  assert.equal(overlay.nextElementSibling.getAttribute('value'), 'visible');
  const locked = switchDocument.window.document.getElementById('switch-locked');
  assert.equal(locked.hasAttribute('disabled'), true);
  assert.equal(locked.hasAttribute('data-disabled'), true);
  assert.equal(locked.getAttribute('aria-checked'), 'true');
  const nativeSwitch = switchDocument.window.document.getElementById('switch-native');
  assert.equal(nativeSwitch.getAttribute('aria-describedby'), 'switch-hint');
  assert.ok(nativeSwitch.className.startsWith('eg-switch '), 'The public marker leads the root classes');
  assert.ok(nativeSwitch.className.endsWith(' ms-2 consumer-switch'), 'Consumer layout classes merge last');
  assert.ok(!nativeSwitch.className.split(' ').includes('ms-1'), 'Conflicting margin utilities resolve through cn()');
  assert.ok(!nativeSwitch.firstElementChild.className.includes('consumer-switch'), 'The thumb takes no consumer classes');
} finally {
  switchDocument.window.close();
}

// Tooltips are closed on the server: only the consumer triggers render, with Radix's closed state.
const tooltipDocument = new JSDOM(renderToString(createElement(TooltipSamples)));
try {
  const host = tooltipDocument.window.document.getElementById('tooltip-host');
  assert.equal(host.children.length, 2, 'Each Tooltip renders only its trigger, without a wrapper');
  const search = tooltipDocument.window.document.getElementById('tooltip-search');
  assert.equal(search.getAttribute('aria-label'), 'Search', 'The trigger keeps its own name');
  assert.equal(search.getAttribute('data-state'), 'closed');
  assert.equal(search.hasAttribute('aria-describedby'), false);
  assert.ok(tooltipDocument.window.document.querySelector('[role="tooltip"], .eg-tooltip') === null);
  assert.ok(!tooltipDocument.serialize().includes('Search the catalogue'), 'Closed content is not server-rendered');
} finally {
  tooltipDocument.window.close();
}
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
const toggleDocument = new JSDOM(html);
try {
  const document = toggleDocument.window.document;
  const toggle = document.getElementById('toggle-default');
  assert.equal(toggle.tagName, 'BUTTON');
  assert.ok(toggle.classList.contains('eg-toggle'));
  assert.equal(toggle.getAttribute('aria-pressed'), 'false');
  assert.equal(document.getElementById('toggle-controlled').getAttribute('data-state'), 'on');
  assert.equal(document.getElementById('toggle-disabled').textContent, 'Pin layer');
  assert.ok(document.getElementById('toggle-disabled').disabled);
} finally {
  toggleDocument.window.close();
}
for (const text of ['eg-gauge', '<svg', 'role="meter"', 'aria-label="Capacity"', 'Review capacity', 'eg-aspect-ratio', 'min-w-0', 'padding-bottom:100%', 'Email address', 'eg-stack', 'flex-col', 'flex-nowrap', 'gap-4', 'eg-cluster', 'flex-row', 'flex-wrap', 'gap-6', 'items-start', 'justify-between', 'eg-icon', 'viewBox="0 0 24 24"', 'Search status', 'eg-surface', 'bg-surface-1', 'bg-surface-overlay', 'shadow-[var(--shadow-well)]']) {
  assert.ok(html.includes(text), 'SSR must render ' + text);
}
const dom = new JSDOM(html);
try {
  const document = dom.window.document;
  const iconButtons = document.querySelectorAll('.eg-icon-btn');
  assert.equal(iconButtons.length, 15, 'All IconButton treatments/sizes, disabled button and two slotted links render');
  for (const button of iconButtons) {
    assert.equal(button.textContent, 'Search');
    assert.equal(button.hasAttribute('aria-label'), false, 'AccessibleIcon hidden text supplies the name');
    assert.equal(button.querySelector('svg').getAttribute('aria-hidden'), 'true');
    assert.equal(button.querySelector('svg').getAttribute('focusable'), 'false');
    assert.equal(button.querySelector('span').style.position, 'absolute', 'Radix owns the hidden label');
    assert.equal(button.hasAttribute('aria-pressed'), false);
    if (button.tagName === 'BUTTON') assert.equal(button.getAttribute('type'), 'button');
  }
  const iconLink = document.getElementById('icon-button-link');
  assert.equal(iconLink.tagName, 'A');
  assert.equal(iconLink.getAttribute('href'), '#search');
  assert.equal(iconLink.hasAttribute('type'), false);
  assert.equal(document.getElementById('icon-button-disabled-link').getAttribute('tabindex'), '-1');
  const select = document.getElementById('select-default');
  assert.equal(select.tagName, 'BUTTON');
  assert.equal(select.getAttribute('role'), 'combobox');
  assert.equal(select.getAttribute('aria-expanded'), 'false');
  assert.ok(select.classList.contains('eg-select') && select.classList.contains('min-h-11'));
  assert.ok(select.classList.contains('w-auto') && select.classList.contains('mb-3'));
  assert.ok(!select.classList.contains('w-full') && !select.classList.contains('mb-1'));
  assert.ok(select.querySelector('svg.eg-icon[aria-hidden="true"]'), 'Select composes the decorative Icon');
  assert.ok(document.getElementById('select-compact').textContent.includes('Choose visibility'));
  assert.ok(document.getElementById('select-compact').classList.contains('min-h-9'));
  assert.ok(document.getElementById('select-disabled').disabled);
  const checkbox = document.getElementById('checkbox-default');
  assert.ok(checkbox?.classList.contains('eg-checkbox'), 'SSR must retain Checkbox');
  assert.equal(checkbox.tagName, 'BUTTON');
  assert.equal(checkbox.getAttribute('role'), 'checkbox');
  assert.equal(checkbox.getAttribute('aria-checked'), 'false');
  const mixedCheckbox = document.getElementById('checkbox-mixed');
  assert.equal(mixedCheckbox.getAttribute('aria-checked'), 'mixed');
  assert.equal(mixedCheckbox.querySelector('span').getAttribute('data-state'), 'indeterminate');
  assert.equal(mixedCheckbox.querySelectorAll('svg[aria-hidden="true"]').length, 2);
  assert.equal(document.getElementById('checkbox-form').querySelector('input').getAttribute('name'), 'notify');
  const link = document.getElementById('link-native');
  assert.equal(link.tagName, 'A');
  assert.equal(link.getAttribute('href'), '#docs');
  assert.ok(link.classList.contains('eg-link') && link.classList.contains('mt-4') && !link.classList.contains('mt-2'));
  assert.equal(link.textContent, 'Documentation');
  assert.equal(link.querySelector('svg').getAttribute('aria-hidden'), 'true');
  assert.ok(link.querySelector('svg').classList.contains('size-4'));
  assert.ok(link.querySelector('svg').classList.contains('transform-none'));
  assert.ok(document.getElementById('link-plain').querySelector('svg') === null);
  for (const id of ['link-external', 'link-router']) {
    const external = document.getElementById(id);
    assert.equal(external.tagName, 'A');
    assert.equal(external.getAttribute('target'), '_blank');
    assert.ok(external.rel.split(' ').includes('noopener') && external.rel.split(' ').includes('noreferrer'));
    assert.ok(external.rel.split(' ').includes('author'));
    assert.equal(external.querySelector('span').style.position, 'absolute');
    assert.equal(external.querySelector('span').textContent, id === 'link-router' ? '(new window)' : '(opens in a new tab)');
    assert.ok(external.querySelector('svg').innerHTML.includes('M7 17 17 7'));
  }
  assert.equal(document.getElementById('link-router').getAttribute('href'), '#router');
  ${assertBadgeDOM.toString()}
  assertBadgeDOM(document);
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
  const sliderRoot = document.getElementById('packed-slider');
  assert.ok(sliderRoot, 'SSR renders Slider root');
  const sliderThumb = sliderRoot.querySelector('[role="slider"]');
  assert.equal(sliderThumb.getAttribute('aria-label'), 'Volume');
  assert.equal(sliderThumb.getAttribute('aria-valuemin'), '0');
  assert.equal(sliderThumb.getAttribute('aria-valuemax'), '100');
  assert.equal(sliderThumb.getAttribute('aria-valuetext'), '40 percent');
  assert.equal(sliderThumb.getAttribute('aria-describedby'), 'slider-hint');
  assert.equal(sliderRoot.hasAttribute('aria-describedby'), false);
  assert.equal(sliderThumb.style.display, 'none', 'Radix reveals the thumb after its collection mounts');
  assert.equal(sliderRoot.querySelector('input').name, 'volume');
  assert.ok(sliderRoot.classList.contains('w-64') && !sliderRoot.classList.contains('w-full'));
  const moduleStates = document.querySelector('ul[aria-label="Module states"]');
  assert.ok(moduleStates, 'SSR must render StatusDot samples');
  const dots = [...moduleStates.querySelectorAll('.eg-status-dot')];
  assert.equal(dots.length, 9, 'Five status, live, standby, default and placed StatusDots must render');
  for (const dot of dots) {
    assert.equal(dot.tagName, 'SPAN');
    assert.equal(dot.getAttribute('aria-hidden'), 'true', 'StatusDot is always decorative');
    assert.equal(dot.childNodes.length, 0, 'StatusDot never renders content');
    for (const attribute of ['role', 'aria-label', 'aria-labelledby', 'tabindex', 'state', 'pulse']) {
      assert.equal(dot.hasAttribute(attribute), false, 'StatusDot must not render ' + attribute);
    }
  }
  for (const [state, fill] of [['running', 'bg-status-success'], ['idle', 'bg-status-info'], ['warning', 'bg-status-warning'], ['error', 'bg-status-danger'], ['stopped', 'bg-primitive-neutral-600']]) {
    const dot = document.getElementById('dot-' + state);
    assert.equal(dot.getAttribute('data-state'), state);
    for (const utility of ['size-2', 'ring-2', 'ring-bg-surface', fill]) {
      assert.ok(dot.classList.contains(utility), 'StatusDot ' + state + ' must carry ' + utility);
    }
    assert.ok(!dot.className.includes('animate') && !dot.className.includes('shadow-glow-hot'), state + ' never glows or pulses');
    assert.equal(dot.parentElement.textContent, state, 'The adjacent text carries the state word');
  }
  const liveDot = document.getElementById('dot-live');
  assert.equal(liveDot.getAttribute('data-state'), 'live');
  assert.ok(['size-2.5', 'shadow-glow-hot', 'bg-fg-brand-default'].every((utility) => liveDot.classList.contains(utility)));
  assert.ok(liveDot.className.includes('motion-safe:animate-[eg-status-dot-pulse_2.4s_var(--ease-out)_infinite]'), 'Live pulses by default');
  assert.ok(!liveDot.className.includes('ring-'), 'Signal dots have no ring');
  const standbyDot = document.getElementById('dot-standby');
  assert.ok(standbyDot.classList.contains('bg-primitive-white') && !standbyDot.className.includes('animate'), 'pulse:false standby is static');
  assert.equal(document.getElementById('dot-default').getAttribute('data-state'), 'stopped');
  const placedDot = document.getElementById('rail-dot');
  assert.equal(placedDot.getAttribute('title'), 'Error');
  assert.equal(placedDot.getAttribute('lang'), 'en');
  assert.ok(placedDot.className.startsWith('eg-status-dot '), 'The public marker stays first');
  assert.ok(placedDot.className.endsWith('absolute top-1 consumer-dot'), 'Consumer layout classes merge last');
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
    assert.ok(plain.querySelector('[aria-hidden]') === null);
  }
  for (const key of keys) {
    assert.equal(key.getAttribute('role'), null);
    assert.equal(key.getAttribute('aria-label'), null);
    assert.equal(key.getAttribute('tabindex'), null);
    assert.equal(key.hasAttribute('data-state'), false);
  }
  const nativeButton = document.getElementById('button-native');
  assert.equal(nativeButton.tagName, 'BUTTON');
  assert.equal(nativeButton.getAttribute('type'), 'button');
  assert.ok(nativeButton.classList.contains('eg-btn') && nativeButton.classList.contains('min-h-10'));
  assert.equal(nativeButton.querySelector('.eg-btn__icon').getAttribute('aria-hidden'), 'true');
  const loadingButton = document.getElementById('button-loading');
  assert.equal(loadingButton.getAttribute('aria-busy'), 'true');
  assert.equal(loadingButton.getAttribute('aria-disabled'), 'true');
  assert.ok(!loadingButton.hasAttribute('disabled') && loadingButton.querySelector('.eg-spinner'));
  assert.ok(document.getElementById('button-disabled').hasAttribute('disabled'));
  const buttonLink = document.getElementById('button-link');
  assert.equal(buttonLink.tagName, 'A');
  assert.equal(buttonLink.getAttribute('href'), '#projects');
  assert.equal(buttonLink.hasAttribute('type'), false);
  assert.ok(buttonLink.firstElementChild.classList.contains('eg-btn__icon'));
  const nativeKbd = document.getElementById('kbd-native');
  assert.equal(nativeKbd.getAttribute('title'), 'Close dialog');
  assert.ok(nativeKbd.className.startsWith('eg-kbd '), 'The public marker leads the root classes');
  assert.ok(nativeKbd.className.endsWith(' ms-2 consumer-kbd'), 'Consumer layout classes merge last');
  assert.ok(!nativeKbd.className.split(' ').includes('ms-1'), 'Conflicting margin utilities resolve through cn()');
  const bars = [...document.querySelectorAll('.eg-progress')];
  assert.equal(bars.length, 6, 'SSR must render ProgressBar samples');
  for (const bar of bars) {
    assert.equal(bar.getAttribute('role'), 'progressbar', 'Radix owns the progressbar role');
    assert.equal(bar.getAttribute('aria-valuemin'), '0');
    assert.equal(bar.getAttribute('aria-valuemax'), '100');
    assert.equal(bar.children.length, 1, 'One fill per bar');
    assert.ok(bar.firstElementChild.classList.contains('eg-progress-fill'));
    assert.equal(bar.hasAttribute('tabindex'), false);
  }
  const upload = document.getElementById('progress-upload');
  assert.equal(upload.getAttribute('aria-label'), 'Upload progress');
  assert.equal(upload.getAttribute('aria-valuenow'), '45');
  assert.equal(upload.getAttribute('aria-valuetext'), '45%');
  assert.equal(upload.getAttribute('data-state'), 'loading');
  assert.equal(upload.hasAttribute('aria-hidden'), false);
  assert.equal(upload.firstElementChild.getAttribute('style'), '--eg-progress-value:0.45', 'Only the geometry custom property is inline');
  const decorativeBar = document.getElementById('progress-decorative');
  assert.equal(decorativeBar.getAttribute('aria-hidden'), 'true', 'Without a label the bar is decorative');
  assert.equal(decorativeBar.hasAttribute('aria-label'), false);
  assert.equal(document.getElementById('progress-counter').textContent, '03/12');
  const goal = document.getElementById('progress-goal');
  assert.equal(goal.getAttribute('aria-valuetext'), '37 of 50 subscribers');
  for (const name of ['h-2.5', 'rounded-full', 'bg-surface-0', 'shadow-well']) assert.ok(goal.classList.contains(name), 'lg well ' + name);
  for (const name of ['bg-[image:var(--gradient-progress)]', 'shadow-edge-strong', 'rounded-[inherit]']) {
    assert.ok(goal.firstElementChild.classList.contains(name), 'lg fill ' + name);
  }
  const mutedBar = document.getElementById('progress-muted');
  assert.equal(mutedBar.getAttribute('aria-valuenow'), '100', 'Out-of-range values clamp to 100');
  assert.equal(mutedBar.getAttribute('data-state'), 'complete');
  assert.ok(mutedBar.firstElementChild.classList.contains('bg-fg-muted'));
  assert.ok(!mutedBar.firstElementChild.classList.contains('bg-fg-brand-default'));
  const edgeBar = document.getElementById('progress-edge');
  assert.equal(edgeBar.className, progressEdgeRecipe, 'The edge strip renders the public recipe');
  const nativeBar = document.getElementById('progress-native');
  assert.equal(nativeBar.getAttribute('title'), 'Scroll position');
  assert.ok(nativeBar.className.startsWith('eg-progress '), 'The public marker leads the root classes');
  assert.ok(nativeBar.className.endsWith(' w-48 consumer-progress'), 'Consumer layout classes merge last');
  assert.ok(!nativeBar.className.split(' ').includes('w-full'), 'Conflicting width utilities resolve through cn()');
  const notes = document.getElementById('textarea-notes');
  assert.ok(notes, 'SSR must render Textarea samples');
  assert.equal(notes.tagName, 'TEXTAREA', 'Textarea renders one native textarea root');
  assert.equal(notes.value, 'Draft');
  assert.equal(notes.getAttribute('rows'), '3');
  assert.equal(notes.getAttribute('maxlength'), '1250');
  assert.equal(notes.getAttribute('aria-describedby'), 'textarea-hint');
  assert.ok(notes.className.startsWith('eg-textarea '), 'The public marker leads the root classes');
  assert.ok(notes.className.endsWith(' mt-4 consumer-textarea'), 'Consumer layout classes merge last');
  assert.ok(!notes.className.split(' ').includes('mt-2'), 'Conflicting margin utilities resolve through cn()');
  assert.equal(document.querySelector('label[for="textarea-notes"]').textContent, 'First comment');
  for (const [id, utility] of [['textarea-notes', 'bg-surface-0'], ['textarea-code', 'bg-primitive-neutral-950'], ['textarea-prose', 'bg-surface-1']]) {
    assert.ok(document.getElementById(id).classList.contains(utility), id + ' must render ' + utility);
  }
  assert.equal(document.getElementById('textarea-invalid').getAttribute('aria-invalid'), 'true');
  assert.equal(document.getElementById('textarea-disabled').hasAttribute('disabled'), true);
  assert.equal(document.getElementById('textarea-readonly').hasAttribute('readonly'), true);
  for (const node of document.querySelectorAll('textarea.eg-textarea')) {
    assert.equal(node.hasAttribute('variant'), false);
    assert.equal(node.hasAttribute('data-state'), false);
    assert.equal(node.getAttribute('role'), null);
  }
  const titleInput = document.getElementById('input-title');
  assert.ok(titleInput, 'SSR must render Input samples');
  assert.equal(titleInput.tagName, 'INPUT');
  assert.equal(titleInput.getAttribute('type'), 'text', 'Input defaults to type text');
  assert.equal(titleInput.getAttribute('value'), 'Launch notes');
  assert.equal(titleInput.parentElement.tagName, 'SPAN');
  assert.ok(titleInput.parentElement.className.startsWith('eg-input '), 'The public marker leads the root classes');
  assert.equal(titleInput.parentElement.children.length, 1, 'No icon wrapper without an icon');
  assert.equal(document.querySelector('label[for="input-title"]').textContent, 'Post title');
  for (const name of ['min-h-11', 'px-3', 'py-2', 'text-body-default', 'bg-surface-0', 'border-border-control', 'shadow-[var(--shadow-well)]']) {
    assert.ok(titleInput.classList.contains(name), 'Default Input must carry ' + name);
  }
  const nativeInput = document.getElementById('input-native');
  for (const [attribute, value] of [['name', 'slug'], ['placeholder', 'project-slug'], ['autocomplete', 'off'], ['aria-describedby', 'input-native-hint']]) {
    assert.equal(nativeInput.getAttribute(attribute), value, 'Input must forward ' + attribute);
  }
  assert.equal(nativeInput.hasAttribute('required'), true);
  assert.ok(nativeInput.parentElement.className.endsWith(' w-80 consumer-input'), 'Consumer layout classes merge last on the root');
  assert.ok(!nativeInput.parentElement.classList.contains('w-64') && !nativeInput.parentElement.classList.contains('w-full'));
  assert.ok(!nativeInput.classList.contains('w-80') && !nativeInput.classList.contains('consumer-input'), 'className never reaches the control');
  const searchInput = document.getElementById('input-search');
  assert.equal(searchInput.getAttribute('type'), 'search');
  assert.equal(searchInput.hasAttribute('size'), false, 'The own size axis never reaches the native size attribute');
  const searchIcon = searchInput.previousElementSibling;
  assert.equal(searchIcon.getAttribute('aria-hidden'), 'true', 'The leading icon is decorative');
  assert.equal(searchIcon.firstElementChild.tagName.toLowerCase(), 'svg');
  for (const name of ['min-h-9', 'pl-9', 'font-mono', 'text-code', 'bg-primitive-neutral-950']) {
    assert.ok(searchInput.classList.contains(name), 'sm/code/icon Input must carry ' + name);
  }
  for (const name of ['font-sans', 'bg-surface-0', 'text-label-default']) {
    assert.ok(!searchInput.classList.contains(name), 'The code treatment must replace ' + name);
  }
  assert.equal(document.getElementById('input-invalid').getAttribute('aria-invalid'), 'true');
  assert.equal(document.getElementById('input-disabled').hasAttribute('disabled'), true);
  assert.equal(document.getElementById('input-readonly').hasAttribute('readonly'), true);
  for (const control of document.querySelectorAll('.eg-input > input')) {
    assert.equal(control.hasAttribute('data-state'), false, 'Input states stay native, never mirrored');
    assert.equal(control.getAttribute('role'), null);
  }
  const brand = document.querySelector('section[aria-label="Brand logos"]');
  assert.ok(brand, 'SSR must render Logo samples');
  const logos = [...brand.querySelectorAll('.eg-logo')];
  assert.equal(logos.length, 6, 'Default, three mark presets, home link and native Logos must render');
  const defaultLogo = document.getElementById('logo-default');
  assert.equal(defaultLogo.tagName, 'SPAN');
  assert.equal(defaultLogo.getAttribute('role'), 'img');
  assert.equal(defaultLogo.getAttribute('aria-label'), 'egdev');
  assert.ok(defaultLogo.className.split(' ').includes('h-8'), 'The default Logo is 32px high');
  assert.equal(defaultLogo.querySelector('svg').getAttribute('viewBox'), '0 0 653 258', 'The default is the wordmark');
  assert.equal(defaultLogo.querySelectorAll('path').length, 8);
  for (const [size, utility] of [['sm', 'h-7'], ['md', 'h-8'], ['lg', 'h-9']]) {
    const sized = document.getElementById('logo-mark-' + size);
    assert.ok(sized.className.split(' ').includes(utility), 'Logo ' + size + ' must carry ' + utility);
    assert.equal(sized.querySelectorAll('polygon').length, 7, 'The mark draws the seven V4 polygons');
  }
  const homeLogo = document.getElementById('logo-home');
  assert.equal(homeLogo.tagName, 'A');
  assert.equal(homeLogo.getAttribute('href'), '#home');
  assert.equal(homeLogo.getAttribute('rel'), 'home');
  assert.equal(homeLogo.getAttribute('aria-label'), 'egdev, home');
  assert.equal(homeLogo.getAttribute('role'), null, 'The link keeps its native role');
  for (const logo of logos) {
    const art = logo.querySelector('svg');
    assert.equal(art.getAttribute('aria-hidden'), 'true', 'Logo artwork is always hidden');
    assert.equal(art.getAttribute('focusable'), 'false');
    assert.equal(logo.textContent, '', 'The accessible name is the only name');
    assert.equal(logo.hasAttribute('data-state'), false);
  }
  const nativeLogo = document.getElementById('consumer-logo');
  assert.equal(nativeLogo.getAttribute('title'), 'egdev');
  assert.equal(nativeLogo.getAttribute('lang'), 'en');
  assert.ok(nativeLogo.className.endsWith('ms-2 consumer-logo'), 'Consumer layout classes merge last');
  const markNav = document.querySelector('nav[aria-label="Product marks"]');
  assert.ok(markNav, 'SSR must render ProductMark samples');
  const mandoMark = document.getElementById('mark-mando');
  assert.equal(mandoMark.tagName, 'SPAN');
  assert.equal(mandoMark.getAttribute('role'), 'img', 'Image mode is a passive named image');
  assert.equal(mandoMark.getAttribute('aria-label'), 'Mando');
  assert.equal(mandoMark.children.length, 1);
  assert.equal(mandoMark.children[0].getAttribute('aria-hidden'), 'true', 'The monogram is hidden from assistive technology');
  assert.equal(mandoMark.textContent, 'M');
  assert.ok(mandoMark.className.startsWith('eg-product-mark '), 'The public marker leads the root classes');
  const criterioMark = document.getElementById('mark-criterio');
  assert.equal(criterioMark.textContent, 'Cr');
  assert.ok(criterioMark.className.endsWith(' mb-3 consumer-mark'), 'Consumer layout classes merge last');
  assert.ok(!criterioMark.className.split(' ').includes('mb-1'), 'Conflicting margin utilities resolve through cn()');
  const homeMark = document.getElementById('mark-home');
  assert.equal(homeMark.tagName, 'A');
  assert.equal(homeMark.getAttribute('href'), '#home');
  assert.equal(homeMark.getAttribute('target'), '_self');
  assert.equal(homeMark.getAttribute('aria-label'), 'Mando home');
  assert.equal(homeMark.hasAttribute('role'), false, 'Link mode keeps native link semantics');
  assert.ok(homeMark.className.includes(' focus-visible:shadow-focus'), 'Link focus replaces the material shadow');
  for (const mark of markNav.querySelectorAll('.eg-product-mark')) {
    assert.equal(mark.hasAttribute('data-state'), false);
    assert.equal(mark.getAttribute('tabindex'), null);
  }
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
  // Text/Heading: native semantics, level independent of recipe, accent placement and tone.
  const eyebrow = document.getElementById('title-eyebrow');
  assert.equal(eyebrow.tagName, 'P');
  assert.ok(eyebrow.classList.contains('eg-text') && eyebrow.classList.contains('text-label-eyebrow'));
  const hero = document.getElementById('title-hero');
  assert.equal(hero.tagName, 'H1', 'Heading level must select the native element');
  assert.ok(hero.classList.contains('eg-heading') && hero.classList.contains('text-title-hero'));
  assert.equal(hero.textContent, 'Build in public', 'Accent must stay in the accessible text, in order');
  const heroAccent = hero.querySelector('.eg-heading__accent');
  assert.ok(heroAccent.classList.contains('block') && heroAccent.className.includes('[text-shadow:var(--text-shadow-title-hero)]'));
  assert.equal(heroAccent.getAttribute('aria-hidden'), null);
  assert.equal(document.getElementById('title-punctuation').textContent, 'Talk.', 'No separator is injected');
  const inverse = document.getElementById('title-inverse');
  assert.equal(inverse.tagName, 'H2', 'Heading defaults to h2');
  assert.ok(inverse.classList.contains('text-title-display') && inverse.classList.contains('text-fg-on-flood'));
  assert.ok(inverse.querySelector('.eg-heading__accent').classList.contains('text-fg-on-flood'));
  const raised = document.getElementById('title-raised').querySelector('.eg-text__accent');
  assert.ok(raised.classList.contains('text-fg-brand-raised') && raised.classList.contains('inline'));
  assert.ok(raised.className.includes('[text-shadow:none]'));
  const slotted = document.getElementById('title-slotted');
  assert.equal(slotted.tagName, 'SPAN', 'asChild must render the single slotted element');
  assert.ok(slotted.classList.contains('eg-text') && slotted.classList.contains('consumer-span'));
  assert.equal(slotted.lastElementChild.className.includes('eg-text__accent'), true, 'Accent must land inside the slotted root');
  assert.equal(slotted.textContent, 'Slotted inline');
  for (const node of [eyebrow, hero, inverse, slotted]) {
    assert.equal(node.getAttribute('role'), null);
    assert.equal(node.hasAttribute('tabindex') || node.hasAttribute('aria-live') || node.hasAttribute('aria-level'), false);
  }
  for (const [size, disc, glyph] of [
    ['sm', 'size-6', 'size-3.25'], ['md', 'size-7.5', 'size-4'],
    ['lg', 'size-10', 'size-(--icon-size)'], ['xl', 'size-12', 'size-6']
  ]) {
    const identity = document.getElementById('avatar-' + size);
    assert.equal(identity.getAttribute('role'), 'img');
    assert.equal(identity.getAttribute('aria-label'), 'Example channel');
    assert.ok(identity.classList.contains(disc));
    assert.ok(identity.querySelector('svg').classList.contains(glyph));
    assert.equal(identity.querySelector('img') === null, true, 'SSR must render fallback, not an unloaded image');
  }
  const decorativeAvatar = document.getElementById('avatar-decorative');
  assert.equal(decorativeAvatar.getAttribute('aria-hidden'), 'true');
  assert.equal(decorativeAvatar.getAttribute('role'), null);
  const pausedAvatar = document.getElementById('avatar-paused');
  assert.equal(pausedAvatar.getAttribute('data-state'), 'paused');
  assert.equal(pausedAvatar.getAttribute('aria-label'), 'Channel on LinkedIn, paused');
  assert.equal(pausedAvatar.querySelector('.eg-avatar__badge').getAttribute('aria-hidden'), 'true');
  assert.equal(pausedAvatar.querySelector('.eg-avatar__badge svg').getAttribute('aria-hidden'), 'true');
  assert.equal(pausedAvatar.hasAttribute('tabindex'), false);
  const decorativeIcon = document.getElementById('icon-decorative');
  assert.ok(decorativeIcon, 'SSR must render the decorative Icon');
  assert.equal(decorativeIcon.tagName.toLowerCase(), 'svg');
  assert.equal(decorativeIcon.getAttribute('aria-hidden'), 'true');
  assert.equal(decorativeIcon.getAttribute('focusable'), 'false');
  assert.equal(decorativeIcon.getAttribute('role'), null);
  assert.ok(decorativeIcon.classList.contains('eg-icon') && decorativeIcon.classList.contains('size-(--icon-size)'));
  assert.ok(decorativeIcon.classList.contains('fill-none') && decorativeIcon.classList.contains('stroke-current'));
  assert.equal(decorativeIcon.querySelectorAll('path').length, 2, 'plus must render its two Lucide paths');
  const labelledHost = document.getElementById('icon-labelled-host');
  assert.ok(labelledHost, 'SSR must render the labelled Icon host');
  const labelledIcon = labelledHost.querySelector('svg.eg-icon');
  assert.ok(labelledIcon, 'SSR must render the labelled Icon');
  assert.equal(labelledIcon.getAttribute('aria-hidden'), 'true', 'AccessibleIcon hides the svg itself');
  assert.ok(labelledIcon.classList.contains('size-4') && labelledIcon.classList.contains('fill-current'));
  assert.equal(labelledHost.textContent, 'Search status', 'AccessibleIcon must supply exactly one visually hidden name');
  assert.ok(labelledHost.querySelector('title') === null);
  const overrideIcon = document.getElementById('icon-override');
  assert.ok(overrideIcon, 'SSR must render the consumer-sized Icon');
  assert.ok(overrideIcon.classList.contains('size-4.5') && overrideIcon.classList.contains('text-fg-brand-default'));
  assert.ok(!overrideIcon.classList.contains('size-7'), 'twMerge must let the consumer size-* win over the preset');
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
console.log(JSON.stringify({ ssr: ['Gauge finite, bounded and unavailable', 'decorative centers', 'visible conditions', 'Checkbox binary/mixed ARIA, Icon indicator and form input', 'Badge defaults and twelve passive tone/treatment combinations with decorative icons', 'Slider bounds, formatted name and Radix server-hidden thumb'], bytes: html.length }));
`;

const csr = `
import assert from 'node:assert/strict';
import { JSDOM } from ${JSON.stringify(import.meta.resolve('jsdom'))};
const stage = (csrStage) => console.log(JSON.stringify({ csrStage }));
stage('setup:start');
const dom = new JSDOM('<div id="app"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'Event', 'CustomEvent', 'MutationObserver', 'HTMLFormElement', 'HTMLSelectElement', 'HTMLInputElement', 'DocumentFragment', 'NodeFilter', 'KeyboardEvent', 'FormData', 'File']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
}
for (const name of ['getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame']) {
  globalThis[name] = dom.window[name].bind(dom.window);
}
// jsdom has no layout observers; Radix Slider and Tooltip measure through ResizeObserver.
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
// Geometry-only jsdom shims; real Radix interaction remains installed and unmocked.
HTMLElement.prototype.scrollIntoView = () => {};
HTMLElement.prototype.hasPointerCapture = () => false;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
stage('setup:complete');
const { act, createElement, createRef } = await import('react');
const { Avatar, Badge, Button, Icon, Label, Link, Slot, Slottable } = await import('@egdev/ui');
const { createRoot } = await import('react-dom/client');
const { App, DropzoneSamples, RadioGroupSamples, SwitchSamples, TooltipSamples, buttonRef, buttonLinkRef, aspectWideRef, checkboxRef, hiddenNoteRef, iconButtonCalls, iconButtonRef, iconButtonLinkRef, inputChanges, inputRef, linkNativeRef, linkSlotRef, linkChildRef, receivedFiles, selectRef, slottedHeadingRef, surfaceArticleChildRef, surfaceArticleRef, surfaceDivRef, surfaceSectionRef, sliderEvents, sliderCommits, switchRef, textareaChanges, textareaRef, toggleRef, tooltipRecipe } = await import('./consumer.ts');
stage('imports:complete');
const root = createRoot(document.getElementById('app'));
try {
  stage('mount:start');
  await act(async () => root.render(createElement(App)));
  stage('mount:complete');
  ${assertBadgeDOM.toString()}
  assertBadgeDOM(document);
  assert.ok(hiddenNoteRef.current instanceof HTMLElement, 'The public ref must expose an HTMLElement');
  assert.equal(hiddenNoteRef.current?.tagName, 'SPAN');
  assert.ok(slottedHeadingRef.current instanceof HTMLElement);
  assert.equal(slottedHeadingRef.current?.tagName, 'H2', 'The slotted ref must expose the h2 host');
  const buttons = [...document.querySelectorAll('button:not(.eg-checkbox)')];
  assert.equal(buttons.length, 26, 'Existing harness controls plus three Button hosts, three Select triggers, three Toggle controls and thirteen native IconButton hosts');
  assert.ok(buttonRef.current === document.getElementById('button-native'), 'Native Button ref reaches the button on both React majors');
  assert.ok(buttonLinkRef.current === document.getElementById('button-link'), 'Slotted Button ref reaches the anchor on both React majors');
  const toggle = document.getElementById('toggle-default');
  assert.ok(toggleRef.current === toggle, 'Toggle ref targets the actual button on this React major');
  assert.equal(toggle.tagName, 'BUTTON');
  assert.equal(toggle.getAttribute('aria-pressed'), 'false');
  await act(async () => toggle.click());
  assert.equal(toggle.getAttribute('aria-pressed'), 'true');
  assert.equal(toggle.getAttribute('data-state'), 'on');
  const controlledToggle = document.getElementById('toggle-controlled');
  await act(async () => controlledToggle.click());
  assert.equal(controlledToggle.getAttribute('aria-pressed'), 'true', 'Controlled state needs incoming updates');
  const disabledToggle = document.getElementById('toggle-disabled');
  await act(async () => disabledToggle.click());
  assert.equal(disabledToggle.getAttribute('aria-pressed'), 'true');
  assert.ok(disabledToggle.disabled);
  assert.equal(disabledToggle.textContent, 'Pin layer');
  buttons[0].focus();
  assert.ok(document.activeElement === buttons[0], 'First intrinsic button must receive focus');
  buttons[1].focus();
  assert.ok(document.activeElement === buttons[1], 'Last intrinsic button must receive focus');
  stage('icon-button:activation:start');
  const iconAction = document.getElementById('icon-button-ghost-md');
  const iconLink = document.getElementById('icon-button-link');
  assert.ok(iconButtonRef.current === iconAction, 'IconButton native ref must reach the button on each React major');
  assert.ok(iconButtonLinkRef.current === iconLink, 'IconButton asChild ref must reach the anchor');
  iconAction.focus();
  assert.ok(document.activeElement === iconAction, 'Native icon action accepts focus');
  await act(async () => { iconAction.click(); iconLink.click(); document.getElementById('icon-button-disabled').click(); });
  assert.deepEqual(iconButtonCalls, ['button', 'child', 'root']);
  const disabledIconLink = document.getElementById('icon-button-disabled-link');
  assert.equal(disabledIconLink.tabIndex, -1);
  assert.equal(disabledIconLink.getAttribute('aria-disabled'), 'true');
  const disabledClick = new dom.window.MouseEvent('click', { bubbles: true, cancelable: true });
  await act(async () => disabledIconLink.dispatchEvent(disabledClick));
  assert.equal(disabledClick.defaultPrevented, true, 'Disabled anchor blocks navigation');
  assert.deepEqual(iconButtonCalls, ['button', 'child', 'root'], 'Neither disabled root nor child may activate');
  stage('icon-button:activation:complete');
  stage('checkbox:interaction:start');
  const checkbox = document.getElementById('checkbox-default');
  assert.ok(checkboxRef.current === checkbox, 'Checkbox ref must target the button on both React majors');
  assert.equal(checkbox.tagName, 'BUTTON');
  assert.equal(checkbox.getAttribute('aria-checked'), 'false');
  await act(async () => checkbox.click());
  assert.equal(checkbox.getAttribute('aria-checked'), 'true');
  assert.equal(checkbox.querySelector('span').getAttribute('data-state'), 'checked');
  assert.equal(document.getElementById('checkbox-mixed').getAttribute('aria-checked'), 'mixed');
  const disabledCheckbox = document.getElementById('checkbox-disabled');
  await act(async () => disabledCheckbox.click());
  assert.equal(disabledCheckbox.getAttribute('aria-checked'), 'true');
  assert.equal(disabledCheckbox.disabled, true);
  const form = document.getElementById('checkbox-form');
  const field = document.getElementById('checkbox-form-control');
  assert.equal(form.querySelector('input').required, true);
  assert.equal(new dom.window.FormData(form).get('notify'), null);
  await act(async () => form.querySelector('label').click());
  assert.equal(field.getAttribute('aria-checked'), 'true');
  assert.equal(new dom.window.FormData(form).get('notify'), 'yes');
  assert.ok(field.classList.contains('ms-2') && !field.classList.contains('ms-1'));
  await act(async () => form.reset());
  assert.equal(field.getAttribute('aria-checked'), 'false');
  stage('checkbox:interaction:complete');
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
  assert.ok(separations.children[2] === rerenderRule, 'Rerender must preserve the divider host');
  assert.equal(rerenderRule.getAttribute('role'), 'separator', 'Semantic rerender must delegate to Radix');
  assert.equal(rerenderRule.getAttribute('aria-orientation'), 'vertical');
  assert.equal(rerenderRule.getAttribute('data-orientation'), 'vertical');
  assert.equal(rerenderRule.className, rerenderRecipe, 'Orientation semantics must never mirror into classes');
  await act(async () => root.render(createElement(App)));
  assert.ok(separations.children[2] === rerenderRule, 'Restoring defaults must preserve the divider host');
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
    assert.ok(shape.querySelector('button, a, input, [tabindex]') === null);
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
  assert.equal(document.querySelectorAll('section[aria-label="Activity indicators"] .eg-spinner').length, 6, 'Standalone consumer Spinners must mount; Button owns another decorative Spinner');
  assert.equal(busyHost().querySelectorAll('.eg-spinner').length, 1);
  await act(async () => root.render(createElement(App, { gaugeValue: 42.5, spinnerLoading: false })));
  assert.equal(busyHost().getAttribute('aria-busy'), 'false');
  assert.ok(busyHost().querySelector('.eg-spinner') === null, 'The decorative Spinner must unmount with loading');
  assert.equal(busyHost().textContent, 'Saving draft');
  assert.equal(document.getElementById('spinner-status').getAttribute('role'), 'status', 'Status Spinner persists');
  stage('spinner:rerender:complete');
  stage('status-dot:rerender:start');
  const liveDot = () => document.getElementById('dot-live');
  assert.equal(document.querySelectorAll('.eg-status-dot').length, 9, 'Consumer StatusDots must mount');
  assert.ok(liveDot().className.includes('motion-safe:animate-'), 'The CSR live dot must pulse by default');
  const liveNode = liveDot();
  await act(async () => root.render(createElement(App, { gaugeValue: 42.5, statusDotPulse: false })));
  assert.ok(liveDot() === liveNode, 'Toggling pulse must keep the same dot node');
  assert.ok(!liveDot().className.includes('animate'), 'pulse:false must stop the CSR live dot');
  assert.equal(liveDot().getAttribute('aria-hidden'), 'true');
  assert.equal(liveDot().getAttribute('data-state'), 'live');
  stage('status-dot:rerender:complete');
  stage('kbd:passive:start');
  const csrKeys = document.querySelectorAll('#kbd-hint kbd.eg-kbd');
  assert.equal(csrKeys.length, 4, 'Consumer Kbds must mount');
  for (const key of csrKeys) {
    assert.equal(key.tabIndex, -1, 'A passive key must never become a Tab stop');
    assert.equal(key.getAttribute('role'), null);
  }
  assert.equal(document.getElementById('kbd-command').children[0].getAttribute('aria-hidden'), 'true');
  stage('kbd:passive:complete');
  stage('slider:keyboard:start');
  const sliderRoot = document.getElementById('packed-slider');
  const sliderThumb = sliderRoot.querySelector('[role="slider"]');
  assert.equal(sliderThumb.getAttribute('aria-label'), 'Volume');
  assert.equal(sliderThumb.getAttribute('aria-describedby'), 'slider-hint');
  assert.equal(sliderRoot.hasAttribute('aria-describedby'), false);
  assert.equal(sliderThumb.getAttribute('aria-valuenow'), '40');
  assert.equal(sliderThumb.getAttribute('aria-valuetext'), '40 percent');
  assert.equal(sliderThumb.tabIndex, 0);
  assert.ok(sliderRoot.classList.contains('eg-slider') && sliderRoot.classList.contains('w-64'));
  assert.ok(!sliderRoot.classList.contains('w-full') && !sliderRoot.classList.contains('w-48'));
  await act(async () => {
    sliderThumb.focus();
    sliderThumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  });
  assert.ok(document.activeElement === sliderThumb, 'Radix keeps focus on the thumb');
  assert.equal(sliderThumb.getAttribute('aria-valuenow'), '41');
  assert.equal(sliderThumb.getAttribute('aria-valuetext'), '41 percent');
  assert.deepEqual(sliderEvents, [41], 'The callback is scalar on both React majors');
  assert.deepEqual(sliderCommits, [41]);
  assert.equal(new dom.window.FormData(document.getElementById('slider-form')).get('volume'), '41');
  const fixedSlider = document.querySelector('#packed-controlled-slider [role="slider"]');
  assert.equal(fixedSlider.getAttribute('aria-valuenow'), '100', 'Controlled values clamp without incoming callbacks');
  const disabledSlider = document.querySelector('#packed-disabled-slider [role="slider"]');
  assert.equal(disabledSlider.hasAttribute('tabindex'), false);
  assert.equal(disabledSlider.hasAttribute('data-disabled'), true);
  await act(async () => disabledSlider.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true })));
  assert.equal(disabledSlider.getAttribute('aria-valuenow'), '25');
  assert.deepEqual(sliderEvents, [41], 'Disabled interaction must not emit');
  stage('slider:keyboard:complete');
  stage('progress:rerender:start');
  const upload = () => document.getElementById('progress-upload');
  assert.equal(document.querySelectorAll('.eg-progress').length, 6, 'Consumer ProgressBars must mount');
  assert.equal(upload().tabIndex, -1, 'A passive progressbar must never become a Tab stop');
  await act(async () => root.render(createElement(App, { gaugeValue: 42.5, progressValue: 100 })));
  assert.equal(upload().getAttribute('aria-valuenow'), '100');
  assert.equal(upload().getAttribute('data-state'), 'complete');
  assert.equal(upload().firstElementChild.getAttribute('data-state'), 'complete', 'Radix mirrors state on the fill');
  assert.equal(upload().firstElementChild.style.getPropertyValue('--eg-progress-value'), '1');
  await act(async () => root.render(createElement(App, { gaugeValue: 42.5, progressValue: NaN })));
  assert.equal(upload().getAttribute('data-state'), 'indeterminate', 'Non-finite values are indeterminate');
  assert.equal(upload().hasAttribute('aria-valuenow'), false);
  assert.equal(upload().hasAttribute('aria-valuetext'), false);
  assert.equal(upload().firstElementChild.style.getPropertyValue('--eg-progress-value'), '0', 'Indeterminate fill stays empty');
  await act(async () => root.render(createElement(App, { gaugeValue: 42.5, progressValue: -5 })));
  assert.equal(upload().getAttribute('aria-valuenow'), '0', 'Negative values clamp to 0');
  assert.equal(upload().getAttribute('data-state'), 'loading');
  stage('progress:rerender:complete');
  stage('textarea:native:start');
  const notesNode = document.getElementById('textarea-notes');
  assert.ok(textareaRef.current === notesNode, 'Textarea must forward its HTMLTextAreaElement ref');
  notesNode.focus();
  assert.ok(document.activeElement === notesNode, 'Textarea must be focusable');
  const setValue = Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, 'value').set;
  await act(async () => {
    setValue.call(notesNode, 'Draft\\nSecond line');
    notesNode.dispatchEvent(new Event('input', { bubbles: true }));
  });
  assert.deepEqual(textareaChanges, ['Draft\\nSecond line'], 'Native onChange must report the multi-line value');
  assert.equal(document.getElementById('textarea-disabled').disabled, true, 'Disabled Textarea leaves the Tab order');
  const readOnlyNode = document.getElementById('textarea-readonly');
  readOnlyNode.focus();
  assert.ok(document.activeElement === readOnlyNode, 'Read-only Textarea stays focusable');
  stage('textarea:native:complete');
  stage('input:controlled:start');
  const titleControl = () => document.getElementById('input-title');
  assert.ok(inputRef.current instanceof dom.window.HTMLInputElement, 'The forwarded ref must expose an HTMLInputElement');
  assert.ok(inputRef.current === titleControl(), 'The ref must target the native input, not the root');
  assert.equal(titleControl().value, 'Launch notes');
  await act(async () => root.render(createElement(App, { gaugeValue: 42.5, inputValue: 'Release notes' })));
  assert.ok(inputRef.current === titleControl(), 'Controlled updates must preserve the same input');
  assert.equal(titleControl().value, 'Release notes', 'Controlled value must follow the consumer');
  titleControl().focus();
  assert.ok(document.activeElement === titleControl(), 'The text control must be focusable');
  const disabledControl = document.getElementById('input-disabled');
  disabledControl.focus();
  assert.ok(document.activeElement !== disabledControl, 'A disabled Input must not take focus');
  const readOnlyControl = document.getElementById('input-readonly');
  readOnlyControl.focus();
  assert.ok(document.activeElement === readOnlyControl, 'A read-only Input stays focusable');
  assert.equal(inputChanges.length, 0, 'Rerendering a controlled value emits no change events');
  stage('input:controlled:complete');
  const homeLink = document.getElementById('logo-home');
  homeLink.focus();
  assert.ok(document.activeElement === homeLink, 'The linked Logo must be a native tab stop');
  assert.equal(document.querySelectorAll('[role="img"].eg-logo').length, 5, 'Unlinked Logos remain named images');
  stage('product-mark:focus:start');
  const linkedMark = document.getElementById('mark-home');
  linkedMark.focus();
  assert.ok(document.activeElement === linkedMark, 'The linked ProductMark must receive focus');
  assert.equal(document.getElementById('mark-mando').tabIndex, -1, 'An image ProductMark must never become a Tab stop');
  stage('product-mark:focus:complete');
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
  stage('typography:rerender:start');
  await act(async () => root.render(createElement(App, { gaugeValue: 42.5, headingLevel: 3 })));
  const rerankedHero = document.getElementById('title-hero');
  assert.equal(rerankedHero.tagName, 'H3', 'Level updates must swap the native heading element');
  assert.ok(rerankedHero.classList.contains('text-title-hero'), 'Level updates must not resize the recipe');
  assert.equal(rerankedHero.textContent, 'Build in public');
  stage('typography:rerender:complete');
  stage('icon:rerender:start');
  const glyphRoot = () => document.getElementById('icon-decorative');
  const glyphBefore = glyphRoot();
  assert.ok(glyphBefore, 'CSR must mount the decorative Icon');
  await act(async () => root.render(createElement(App, { iconName: 'minus' })));
  assert.ok(glyphRoot() === glyphBefore, 'Glyph changes must keep the same svg root');
  assert.equal(glyphRoot().querySelectorAll('path').length, 1, 'minus must replace the plus paths');
  assert.equal(glyphRoot().querySelector('path')?.getAttribute('d'), 'M5 12h14');
  assert.equal(glyphRoot().getAttribute('tabindex'), null, 'Default Icons never enter the tab order');
  stage('icon:rerender:complete');
  stage('select:interaction:start');
  const selectTrigger = document.getElementById('select-default');
  assert.ok(selectRef.current === selectTrigger, 'Select forwards the HTMLButtonElement ref');
  assert.equal(selectTrigger.textContent, 'Public');
  assert.equal(new dom.window.FormData(document.getElementById('visibility-form')).get('visibility'), 'public');
  assert.equal(new dom.window.FormData(document.getElementById('visibility-form')).has('disabled-visibility'), false);
  assert.equal(document.getElementById('select-disabled').disabled, true);
  assert.ok(selectTrigger.classList.contains('mb-3') && !selectTrigger.classList.contains('mb-1'));
  const key = async (target, key) => {
    await act(async () => {
      target.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    });
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 20)); });
  };
  selectTrigger.focus();
  await key(selectTrigger, 'Enter');
  const listbox = document.querySelector('[role="listbox"]');
  assert.ok(listbox?.classList.contains('eg-select-content'), 'Select opens its portalled listbox');
  assert.ok(!document.getElementById('app').contains(listbox), 'Popup must be outside the application root');
  const archivedOption = document.querySelector('[role="option"][aria-disabled="true"]');
  assert.equal(archivedOption.textContent, 'Archived');
  await key(document.activeElement, 'End');
  assert.equal(document.activeElement.textContent, 'Private', 'End skips the disabled final option');
  await key(document.activeElement, 'Enter');
  assert.ok(!document.querySelector('[role="listbox"]'), 'Selection closes the popup');
  assert.ok(document.activeElement === selectTrigger, 'Selection restores trigger focus');
  assert.equal(selectTrigger.textContent, 'Private');
  assert.equal(new dom.window.FormData(document.getElementById('visibility-form')).get('visibility'), 'private');
  await key(selectTrigger, 'Enter');
  assert.ok(document.querySelector('[role="option"][data-state="checked"] svg[aria-hidden="true"]'), 'Selection has a non-color check');
  await key(document.activeElement, 'Escape');
  assert.ok(!document.querySelector('[role="listbox"]'));
  assert.equal(selectTrigger.textContent, 'Private');
  stage('select:interaction:complete');
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
  stage('link:refs:start');
  assert.ok(linkNativeRef.current === document.getElementById('link-native'), 'Native Link ref targets the anchor');
  assert.ok(linkSlotRef.current === document.getElementById('link-router'), 'Slotted Link ref targets the child anchor');
  assert.ok(linkChildRef.current === linkSlotRef.current, 'Link and child refs compose on the same anchor');
  await act(async () => root.render(createElement(App, { linkExternal: false })));
  assert.equal(document.getElementById('link-external').hasAttribute('target'), false);
  assert.ok(document.getElementById('link-external').querySelector('span') === null);
  assert.equal(document.getElementById('link-router').getAttribute('target'), '_self');
  assert.equal(document.getElementById('link-router').getAttribute('rel'), 'help');
  assert.ok(document.getElementById('link-router').querySelector('span') === null);
  stage('link:refs:complete');
  const avatar = document.getElementById('avatar-paused');
  assert.equal(avatar.getAttribute('data-state'), 'paused');
  assert.equal(avatar.querySelector('.eg-avatar__badge').getAttribute('aria-hidden'), 'true');
  assert.ok(avatar.classList.contains('ms-2') && !avatar.classList.contains('ms-1'));
  const preloads = [];
  const BrowserImage = window.Image;
  window.Image = function () {
    const image = document.createElement('img');
    preloads.push(image);
    return image;
  };
  try {
    await act(async () => root.render(createElement(Avatar, { label: 'Loaded identity', src: 'portrait.png' })));
    const identity = document.querySelector('.eg-avatar');
    assert.ok(identity.querySelector('svg'), 'Radix fallback must show while loading');
    const image = preloads.at(-1);
    Object.defineProperties(image, { complete: { value: true }, naturalWidth: { value: 100 } });
    await act(async () => image.dispatchEvent(new window.Event('load')));
    assert.equal(identity.querySelector('img').getAttribute('alt'), '');
    assert.equal(identity.querySelector('img').getAttribute('src'), 'portrait.png');
    assert.equal(identity.querySelector('svg') === null, true);
    assert.equal(identity.getAttribute('aria-label'), 'Loaded identity');
    await act(async () => root.render(createElement(Avatar, { label: 'Paused identity', src: 'broken.png', paused: true })));
    await act(async () => preloads.at(-1).dispatchEvent(new window.Event('error')));
    assert.ok(identity.querySelector('svg'), 'Radix fallback must recover after a changed src fails');
    assert.equal(identity.getAttribute('data-state'), 'paused');
    await act(async () => root.render(createElement(Avatar)));
    assert.equal(identity.getAttribute('aria-hidden'), 'true');
    assert.equal(identity.getAttribute('role'), null);
    assert.equal(identity.getAttribute('aria-label'), null);
    assert.equal(identity.getAttribute('data-state'), 'active');
    assert.equal(identity.getAttribute('tabindex'), null);
  } finally {
    window.Image = BrowserImage;
  }
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
  assert.ok(selectRef.current === null, 'Select cleans its trigger ref up on unmount');
  await act(async () => target.click());
  assert.deepEqual(calls, ['child', 'slot']);
  await act(async () => root.render(null));
  assert.ok(slotRef.current === null, 'Slot ref must be cleaned up on unmount');
  assert.ok(childRef.current === null, 'Child ref must be cleaned up on unmount');
  assert.ok(linkNativeRef.current === null && linkSlotRef.current === null && linkChildRef.current === null, 'All Link refs clean up when App unmounts');
  const nativeLinkRef = createRef();
  const slottedLinkRef = createRef();
  const linkEvents = [];
  await act(async () => root.render(createElement(Link, { href: '#native', ref: nativeLinkRef,
    onClick: (event) => { event.preventDefault(); linkEvents.push('native'); } }, 'Native docs')));
  const nativeLink = document.querySelector('a');
  assert.ok(nativeLinkRef.current === nativeLink);
  nativeLink.focus();
  assert.ok(document.activeElement === nativeLink, 'Native Link can receive focus');
  await act(async () => nativeLink.click());
  assert.deepEqual(linkEvents, ['native']);
  await act(async () => root.render(createElement(Link, { asChild: true, external: true, ref: slottedLinkRef,
    onClick: () => linkEvents.push('parent'), children: createElement('a', {
      href: '#router', target: '_self', rel: 'help', onClick: (event) => { event.preventDefault(); linkEvents.push('child'); }
    }, 'Router docs') })));
  const routerLink = document.querySelector('a');
  assert.ok(slottedLinkRef.current === routerLink);
  assert.equal(routerLink.getAttribute('target'), '_blank');
  assert.equal(routerLink.getAttribute('rel'), 'help noopener noreferrer');
  await act(async () => routerLink.click());
  assert.deepEqual(linkEvents, ['native', 'child', 'parent']);
  await act(async () => root.render(null));
  assert.ok(nativeLinkRef.current === null && slottedLinkRef.current === null, 'Native and slotted Link refs clean up');
  stage('tooltip:focus:start');
  await act(async () => root.render(createElement(TooltipSamples)));
  const tooltipTrigger = document.getElementById('tooltip-search');
  await act(async () => tooltipTrigger.focus());
  const bubble = document.querySelector('[role="tooltip"]');
  assert.ok(bubble, 'Keyboard focus must open the tooltip without a provider');
  assert.equal(bubble.textContent, 'Search the catalogue');
  assert.equal(bubble.getAttribute('data-state'), 'instant-open');
  assert.equal(tooltipTrigger.getAttribute('aria-describedby'), bubble.id, 'The trigger is described by the tooltip');
  assert.equal(tooltipTrigger.getAttribute('aria-label'), 'Search', 'The trigger keeps its own name');
  assert.ok(!document.getElementById('app').contains(bubble), 'The bubble renders in a portal');
  assert.ok(bubble.closest('[data-radix-popper-content-wrapper]').parentElement === document.body);
  assert.ok(bubble.className.startsWith('eg-tooltip '), 'The public marker leads the bubble classes');
  assert.equal(bubble.className, tooltipRecipe, 'The bubble carries the public overlay recipe');
  await act(async () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
  assert.ok(document.querySelector('[role="tooltip"]') === null, 'Escape closes the tooltip');
  assert.ok(document.activeElement === tooltipTrigger, 'Focus stays on the trigger');
  const moduleTrigger = document.getElementById('tooltip-module');
  await act(async () => moduleTrigger.focus());
  const moduleBubble = document.querySelector('[role="tooltip"]');
  assert.equal(moduleBubble.textContent, 'egdev-publish, running');
  assert.ok(moduleBubble.className.endsWith(' text-center consumer-tooltip'), 'Consumer layout classes merge last');
  await act(async () => root.render(null));
  assert.ok(document.querySelector('[role="tooltip"]') === null, 'Unmount removes the portaled bubble');
  stage('tooltip:focus:complete');
  stage('dropzone:files:start');
  await act(async () => root.render(createElement(DropzoneSamples)));
  const fileTarget = document.getElementById('file-target');
  const fileInput = fileTarget.nextElementSibling;
  assert.equal(fileTarget.type, 'button');
  assert.equal(fileInput.hidden, true);
  let pickerClicks = 0;
  fileInput.addEventListener('click', () => { pickerClicks += 1; });
  await act(async () => fileTarget.click());
  assert.equal(pickerClicks, 1, 'Native activation opens the sibling picker');
  const rejectedByPicker = new window.File(['notes'], 'notes.txt', { type: 'text/plain' });
  const acceptedImage = new window.File(['image'], 'photo.png', { type: 'image/png' });
  const files = [rejectedByPicker, acceptedImage];
  const sendFiles = async (kind, target = fileTarget) => {
    const event = new Event(kind, { bubbles: true, cancelable: true });
    Object.defineProperty(event, kind === 'paste' ? 'clipboardData' : 'dataTransfer', { value: { types: ['Files'], files } });
    await act(async () => target.dispatchEvent(event));
    return event;
  };
  await sendFiles('dragenter');
  await sendFiles('dragenter', fileTarget.querySelector('span'));
  await sendFiles('dragleave', fileTarget.querySelector('span'));
  assert.equal(fileTarget.getAttribute('data-state'), 'over');
  assert.equal(fileTarget.textContent, 'Release media');
  assert.equal((await sendFiles('drop')).defaultPrevented, true);
  assert.equal(receivedFiles.length, 1);
  assert.ok(receivedFiles[0][0] === rejectedByPicker && receivedFiles[0][1] === acceptedImage, 'Drop does not filter by accept');
  assert.equal(fileTarget.getAttribute('data-state'), 'idle');
  await sendFiles('paste');
  assert.equal(receivedFiles.length, 1, 'Unfocused synthetic paste is ignored');
  fileTarget.focus();
  assert.ok(document.activeElement === fileTarget, 'Native button receives focus');
  assert.equal((await sendFiles('paste')).defaultPrevented, true);
  assert.equal(receivedFiles.length, 2);
  Object.defineProperty(fileInput, 'files', { configurable: true, value: files });
  for (let pick = 0; pick < 2; pick += 1) {
    await act(async () => fileInput.dispatchEvent(new Event('change', { bubbles: true })));
    assert.equal(fileInput.value, '');
  }
  assert.equal(receivedFiles.length, 4, 'Repeated picker delivery remains possible after reset');
  await act(async () => root.render(createElement(DropzoneSamples, { disabled: true })));
  assert.ok(document.getElementById('file-target') === fileTarget, 'Disabled rerender keeps button identity');
  assert.equal(fileTarget.disabled, true);
  assert.equal(fileInput.disabled, true);
  await sendFiles('dragenter');
  await sendFiles('drop');
  await sendFiles('paste');
  await act(async () => fileTarget.click());
  assert.equal(receivedFiles.length, 4, 'Disabled paths deliver no files');
  assert.equal(pickerClicks, 1, 'Disabled activation opens no picker');
  assert.equal(fileTarget.getAttribute('data-state'), 'idle');
  await act(async () => root.render(null));
  stage('dropzone:files:complete');
  // Native label activation: clicking the associated label focuses the named control.
  assert.ok(toggleRef.current === null, 'Toggle ref cleans up when App unmounts');
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
  // Badge changes remain passive; the host owns any announcement of new text.
  await act(async () => root.render(createElement(Badge, { tone: 'danger', variant: 'solid', icon: createElement(Icon, { name: 'alert', className: 'size-3.5' }) }, 'Failed')));
  assert.ok(document.querySelector('.eg-badge').classList.contains('bg-status-danger'));
  await act(async () => root.render(createElement(Badge, null, 'Draft')));
  const badge = document.querySelector('.eg-badge');
  assert.equal(badge.getAttribute('data-tone'), 'neutral');
  assert.ok(badge.classList.contains('bg-fg-secondary/8') && !badge.classList.contains('bg-status-danger'));
  assert.equal(badge.childElementCount, 0, 'Removed decorative icon leaves no stale wrapper');
  assert.equal(badge.hasAttribute('aria-live'), false);
  // Label forwards its HTMLLabelElement ref and cleans it up on unmount.
  const labelRef = createRef();
  await act(async () => root.render(createElement(Label, { htmlFor: 'consumer-email', ref: labelRef }, 'Email address')));
  const labelNode = document.querySelector('label[for="consumer-email"]');
  assert.ok(labelNode, 'Label scene must render a native label');
  assert.ok(labelRef.current === labelNode, 'Label must forward its HTMLLabelElement ref');
  await act(async () => root.render(null));
  assert.ok(labelRef.current === null, 'Label ref must be cleaned up on unmount');
  assert.ok(checkboxRef.current === null, 'Checkbox ref must be cleaned up after the App unmounts');
  console.log(JSON.stringify({ checkbox: ['button ref and cleanup', 'uncontrolled click', 'controlled mixed state', 'disabled activation', 'label activation', 'required and checked-only FormData', 'form reset', 'layout merge'] }));
  stage('button:activation:start');
  let buttonCalls = 0;
  const clickButton = () => { buttonCalls += 1; };
  await act(async () => root.render(createElement(Button, { onClick: clickButton, children: 'Save' })));
  const actionButton = document.querySelector('.eg-btn');
  actionButton.focus();
  await act(async () => root.render(createElement(Button, { loading: true, onClick: clickButton, children: 'Save' })));
  assert.ok(document.activeElement === actionButton, 'Loading keeps the native Button focus');
  await act(async () => actionButton.click());
  assert.equal(buttonCalls, 0, 'Loading blocks repeated activation');
  await act(async () => root.render(createElement(Button, { onClick: clickButton, children: 'Save' })));
  await act(async () => actionButton.click());
  assert.equal(buttonCalls, 1, 'Activation returns when loading ends');
  await act(async () => root.render(createElement(Button, { asChild: true, disabled: true, onClick: clickButton,
    children: createElement('a', { href: '#save', onClick: clickButton }, 'Save') })));
  const disabledLink = document.querySelector('a.eg-btn');
  assert.equal(disabledLink.getAttribute('tabindex'), '-1');
  const blockedEvent = new dom.window.MouseEvent('click', { bubbles: true, cancelable: true });
  await act(async () => disabledLink.dispatchEvent(blockedEvent));
  assert.equal(blockedEvent.defaultPrevented, true);
  assert.equal(buttonCalls, 1, 'Disabled Slot blocks child and Button handlers');
  stage('button:activation:complete');
  stage('radio-group:start');
  const radioCalls = [];
  const onFormatChange = (next) => radioCalls.push(next);
  await act(async () => root.render(createElement(RadioGroupSamples, { format: 'video', onFormatChange })));
  const radioForm = document.getElementById('radio-form');
  const visibilityGroup = document.getElementById('radio-visibility');
  const unlisted = visibilityGroup.querySelector('button[value="unlisted"]');
  assert.equal(new dom.window.FormData(radioForm).get('visibility'), null, 'Nothing is submitted before a choice');
  await act(async () => document.querySelector('label[for="' + unlisted.id + '"]').click());
  assert.equal(unlisted.getAttribute('aria-checked'), 'true', 'The associated label selects its radio');
  assert.equal(unlisted.firstElementChild?.getAttribute('data-state'), 'checked', 'The indicator appears when checked');
  assert.equal(new dom.window.FormData(radioForm).get('visibility'), 'unlisted', 'The checked value is submitted');
  await act(async () => visibilityGroup.querySelector('button[value="private"]').click());
  assert.equal(unlisted.getAttribute('aria-checked'), 'true', 'A disabled option cannot be selected');
  await act(async () => radioForm.reset());
  assert.equal(unlisted.getAttribute('aria-checked'), 'false', 'A form reset restores the initial value');
  assert.equal(new dom.window.FormData(radioForm).get('visibility'), null);
  const live = document.getElementById('radio-format').querySelector('button[value="live"]');
  const liveRecipe = live.className;
  await act(async () => live.click());
  assert.deepEqual(radioCalls, ['live'], 'onValueChange receives the selected value');
  assert.equal(live.getAttribute('aria-checked'), 'false', 'A controlled group waits for its consumer');
  await act(async () => root.render(createElement(RadioGroupSamples, { format: 'live', onFormatChange })));
  assert.ok(document.getElementById('radio-format').querySelector('button[value="live"]') === live, 'Controlled updates preserve the radio');
  assert.equal(live.getAttribute('aria-checked'), 'true');
  assert.equal(live.className, liveRecipe, 'Radix state never mirrors into classes');
  assert.equal(new dom.window.FormData(radioForm).get('format'), 'live');
  const lockedPrivate = document.getElementById('radio-locked').querySelector('button[value="unlisted"]');
  await act(async () => lockedPrivate.click());
  assert.equal(lockedPrivate.disabled, true);
  assert.equal(lockedPrivate.getAttribute('aria-checked'), 'false', 'A disabled group cannot change');
  await act(async () => root.render(null));
  stage('radio-group:complete');
  stage('switch:start');
  const switchCalls = [];
  const onOverlayChange = (next) => switchCalls.push(next);
  await act(async () => root.render(createElement(SwitchSamples, { overlay: true, onOverlayChange })));
  const switchForm = document.getElementById('switch-form');
  const alertsSwitch = document.getElementById('switch-alerts');
  assert.ok(switchRef.current === alertsSwitch, 'Switch must forward its ref to the root button');
  assert.equal(alertsSwitch.getAttribute('aria-checked'), 'false');
  assert.equal(new dom.window.FormData(switchForm).get('alerts'), null, 'An off switch submits nothing');
  await act(async () => document.querySelector('label[for="switch-alerts"]').click());
  assert.equal(alertsSwitch.getAttribute('aria-checked'), 'true', 'The associated label toggles the switch');
  assert.equal(alertsSwitch.firstElementChild.getAttribute('data-state'), 'checked');
  assert.equal(new dom.window.FormData(switchForm).get('alerts'), 'on', 'An on switch submits its default value');
  await act(async () => switchForm.reset());
  assert.equal(alertsSwitch.getAttribute('aria-checked'), 'false', 'A form reset restores the initial state');
  assert.equal(new dom.window.FormData(switchForm).get('alerts'), null);
  const overlaySwitch = document.getElementById('switch-overlay');
  const overlayRecipe = overlaySwitch.className;
  await act(async () => overlaySwitch.click());
  assert.deepEqual(switchCalls, [false], 'onCheckedChange receives the next boolean');
  assert.equal(overlaySwitch.getAttribute('aria-checked'), 'true', 'A controlled switch waits for its consumer');
  await act(async () => root.render(createElement(SwitchSamples, { overlay: false, onOverlayChange })));
  assert.ok(document.getElementById('switch-overlay') === overlaySwitch, 'Controlled updates preserve the root');
  assert.equal(overlaySwitch.getAttribute('aria-checked'), 'false');
  assert.equal(overlaySwitch.className, overlayRecipe, 'Radix state never mirrors into classes');
  assert.equal(new dom.window.FormData(switchForm).get('overlay'), null);
  const lockedSwitch = document.getElementById('switch-locked');
  await act(async () => lockedSwitch.click());
  assert.equal(lockedSwitch.disabled, true);
  assert.equal(lockedSwitch.getAttribute('aria-checked'), 'true', 'A disabled switch cannot toggle');
  assert.deepEqual(switchCalls, [false], 'A disabled switch emits nothing');
  await act(async () => root.render(null));
  assert.ok(switchRef.current === null, 'Switch ref must be cleaned up on unmount');
  stage('switch:complete');
  console.log(JSON.stringify({ csr: ['Button refs, focus retention, loading recovery and disabled Slot activation', 'intrinsic consumer focus harness', 'Gauge rerender, passivity and non-finite recovery', 'Slot/Slottable target, composed refs, child-first events and ref cleanup', 'VisuallyHidden HTMLElement refs', 'Skeleton passive placeholders and AspectRatio rerender', 'Spinner status/decorative semantics and host-owned unmount', 'StatusDot decorative states and pulse toggle', 'Kbd passive keys outside the Tab order', 'Avatar image loading/error recovery and naming modes', 'Link native/slotted refs, external safety, child-first events and cleanup', 'Badge defaults, twelve combinations and passive icon/tone reset', 'Slider keyboard scalar change/commit, form submission, controlled clamp and disabled inactivity', 'ProgressBar clamped, complete and indeterminate rerenders', 'Textarea forwarded ref, focus and native onChange', 'Input forwarded ref, controlled value and native focus', 'Logo image/link semantics and native link focus', 'ProductMark link focus and passive image', 'Select portal, keyboard selection, disabled option, native forms, focus and ref cleanup', 'Tooltip focus, Escape, portal and unmount', 'Dropzone native picker, drag depth, accept bypass, focused paste, reset and disabled paths', 'IconButton native/slotted refs, focus, child-first activation and disabled navigation guards', 'Label activation, forwarded ref and cleanup', 'RadioGroup label selection, disabled options, controlled updates, form submission and reset', 'Switch label toggle, controlled updates, form submission, disabled, form reset and ref cleanup', 'Toggle pressed state, controlled/disabled behavior, button refs and cleanup'] }));
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
  'code',
  'title-section',
  'title-hero',
  'title-show',
  'title-display'
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
  'size-4.5',
  'text-fg-brand-default',
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
${assertButtonCSS.toString()}
${assertBadgeCSS.toString()}
assertBadgeCSS(emitted);
${assertGaugeCSS.toString()}
${assertDividerCSS.toString()}
${assertSkeletonCSS.toString()}
${assertIconCSS.toString()}
${assertIconButtonCSS.toString()}
${assertSpinnerCSS.toString()}
${assertLogoCSS.toString()}
${assertStatusDotCSS.toString()}
${assertKbdCSS.toString()}
${assertAvatarCSS.toString()}
${assertSliderCSS.toString()}
${assertRadioGroupCSS.toString()}
${assertSwitchCSS.toString()}
${assertTooltipCSS.toString()}
${assertProgressBarCSS.toString()}
${assertTextareaCSS.toString()}
${assertInputCSS.toString()}
${assertDropzoneCSS.toString()}
${assertProductMarkCSS.toString()}
assertIconButtonCSS(emitted);
${assertToggleCSS.toString()}
${assertSelectCSS.toString()}
assertSelectCSS(emitted);
${assertCheckboxCSS.toString()}
assertCheckboxCSS(emitted);
assertButtonCSS(emitted);
assertAvatarCSS(emitted);
assertGaugeCSS(emitted);
assertDividerCSS(emitted, readFileSync(fileURLToPath(import.meta.resolve('@egdev/ui')), 'utf8'));
assert.match(
  emitted,
  /\\.min-w-0\\s*\\{[^}]*min-width:\\s*(?:0|0px|var\\(--space-0\\))\\s*;/,
  'Native consumer build must emit the AspectRatio min-width guard without Tailwind'
);
assertSkeletonCSS(emitted);
assertIconCSS(emitted);
assertSpinnerCSS(emitted);
assertLogoCSS(emitted);
assertStatusDotCSS(emitted);
assertKbdCSS(emitted);
assertSliderCSS(emitted);
assertRadioGroupCSS(emitted);
assertSwitchCSS(emitted);
assertTooltipCSS(emitted);
assertProgressBarCSS(emitted);
assertTextareaCSS(emitted);
assertInputCSS(emitted);
assertDropzoneCSS(emitted);
assertProductMarkCSS(emitted);
assertToggleCSS(emitted);
${assertLabelCSS.toString()}
assertLabelCSS(emitted);
${assertSurfaceCSS.toString()}
assertSurfaceCSS(emitted);
${assertLinkCSS.toString()}
assertLinkCSS(emitted);
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
assert.equal(names.length, 255, 'Packed native artifact must expose 255 variables');
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
assertCheckboxCSS(twCss);
assertButtonCSS(twCss);
assertBadgeCSS(twCss);
assertAvatarCSS(twCss);
assertGaugeCSS(twCss);
assertDividerCSS(twCss, readFileSync(fileURLToPath(import.meta.resolve('@egdev/ui')), 'utf8'));
assert.match(
  twCss,
  /\\.min-w-0\\s*\\{[^}]*min-width:\\s*(?:0|0px|var\\(--space-0\\))\\s*;/,
  'Tailwind consumer must retain the AspectRatio min-width guard'
);
assertSkeletonCSS(twCss);
assertIconCSS(twCss);
assertIconButtonCSS(twCss);
assert.ok(twCss.includes('.size-4\\\\.5'), 'Tailwind consumer must emit the supported container size override');
assert.match(twCss, /width:\\s*calc\\(var\\(--space-1\\)\\s*\\*\\s*4\\.5\\)/, 'Container size must use the spacing scale');
assert.ok(twCss.includes('.text-fg-brand-default'), 'Tailwind consumer must emit the supported inherited color');
assertSpinnerCSS(twCss);
assertLogoCSS(twCss);
assertStatusDotCSS(twCss);
assertKbdCSS(twCss);
assertSliderCSS(twCss);
assertRadioGroupCSS(twCss);
assertSwitchCSS(twCss);
assertTooltipCSS(twCss);
assertProgressBarCSS(twCss);
assertTextareaCSS(twCss);
assertInputCSS(twCss);
assertDropzoneCSS(twCss);
assertProductMarkCSS(twCss);
assertToggleCSS(twCss);
assertSelectCSS(twCss);
for (const utility of ['.flex-col', '.flex-nowrap', '.flex-row', '.flex-wrap', '.gap-0', '.gap-4', '.gap-6', '.gap-8', '.items-stretch', '.items-start', '.justify-between']) {
  assert.ok(twCss.includes(utility), 'Tailwind consumer must retain layout utility ' + utility);
}
assertSurfaceCSS(twCss);
assertLinkCSS(twCss);
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
