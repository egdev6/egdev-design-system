import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as props from './prop-naming.mjs';

const { renderRegistry, runCli, validateRegistry } = props;
const root = fileURLToPath(new URL('../', import.meta.url));
const sourcePath = 'scripts/prop-naming.test.mjs';
// Reviewed implementation usages added after the immutable naming receipts.
const postReceiptUsages = [
  ...[
    'accessible-name',
    'primary-value',
    'initial-uncontrolled-value',
    'interactive-value-change',
    'choice-options',
    'selection-cardinality'
  ].map((conventionId) => ({
    conventionId,
    source: 'packages/ui/src/molecules/chip-group/types.ts#ChipGroupProps'
  })),
  ...['accessible-name', 'primary-value', 'leading-icon'].map((conventionId) => ({
    conventionId,
    source: 'packages/ui/src/molecules/chip-group/types.ts#ChipGroupOption'
  })),
  ...['visual-treatment', 'slot-composition', 'item-presentation-status'].map((conventionId) => ({
    conventionId,
    source: 'packages/ui/src/molecules/list-item/types.ts#ListItemProps'
  })),
  ...[
    'accessible-name',
    'collection-items',
    'primary-value',
    'initial-uncontrolled-value',
    'interactive-value-change',
    'visual-treatment',
    'preset-dimensions'
  ].map((conventionId) => ({
    conventionId,
    source: 'packages/ui/src/molecules/tabs/types.ts#TabsProps'
  })),
  { conventionId: 'surface-material-tone', source: 'packages/ui/src/molecules/tabs/types.ts#TabsItem' },
  ...['surface-material-tone', 'preset-dimensions', 'leading-icon', 'message-summary', 'trailing-actions'].map(
    (conventionId) => ({
      conventionId,
      source: 'packages/ui/src/molecules/notice/types.ts#NoticeProps'
    })
  ),
  ...['accessible-name', 'visual-treatment'].map((conventionId) => ({
    conventionId,
    source: 'packages/ui/src/molecules/button-group/types.ts#ButtonGroupProps'
  })),
  ...['accessible-name', 'leading-icon', 'visual-treatment', 'preset-dimensions', 'slot-composition'].map(
    (conventionId) => ({
      conventionId,
      source: 'packages/ui/src/atoms/icon-button/types.ts#IconButtonProps'
    })
  ),
  { conventionId: 'checked-change', source: 'packages/ui/src/atoms/checkbox/types.ts#CheckboxProps' },
  { conventionId: 'preset-dimensions', source: 'packages/ui/src/atoms/avatar/types.ts#AvatarProps' },
  { conventionId: 'accessible-name', source: 'packages/ui/src/atoms/avatar/types.ts#AvatarProps' },
  { conventionId: 'corner-badge-icon', source: 'packages/ui/src/atoms/avatar/types.ts#AvatarProps' },
  { conventionId: 'paused-presentation', source: 'packages/ui/src/atoms/avatar/types.ts#AvatarProps' },
  { conventionId: 'visual-treatment', source: 'packages/ui/src/atoms/button/types.ts#ButtonProps' },
  { conventionId: 'preset-dimensions', source: 'packages/ui/src/atoms/button/types.ts#ButtonProps' },
  { conventionId: 'leading-icon', source: 'packages/ui/src/atoms/button/types.ts#ButtonProps' },
  { conventionId: 'icon-placement', source: 'packages/ui/src/atoms/button/types.ts#ButtonProps' },
  { conventionId: 'pending-activity', source: 'packages/ui/src/atoms/button/types.ts#ButtonProps' },
  { conventionId: 'slot-composition', source: 'packages/ui/src/atoms/button/types.ts#ButtonProps' },
  { conventionId: 'surface-material-tone', source: 'packages/ui/src/atoms/badge/types.ts#BadgeProps' },
  { conventionId: 'visual-treatment', source: 'packages/ui/src/atoms/badge/types.ts#BadgeProps' },
  { conventionId: 'leading-icon', source: 'packages/ui/src/atoms/badge/types.ts#BadgeProps' },
  { conventionId: 'accessible-name', source: 'packages/ui/src/atoms/slider/types.ts#SliderProps' },
  { conventionId: 'primary-value', source: 'packages/ui/src/atoms/slider/types.ts#SliderProps' },
  { conventionId: 'initial-uncontrolled-value', source: 'packages/ui/src/atoms/slider/types.ts#SliderProps' },
  { conventionId: 'interactive-value-change', source: 'packages/ui/src/atoms/slider/types.ts#SliderProps' },
  { conventionId: 'committed-value-change', source: 'packages/ui/src/atoms/slider/types.ts#SliderProps' },
  { conventionId: 'measurement-text-equivalent', source: 'packages/ui/src/atoms/slider/types.ts#SliderProps' },
  ...[
    'accessible-name',
    'initial-uncontrolled-pressed',
    'leading-icon',
    'preset-dimensions',
    'pressed-change',
    'pressed-state'
  ].map((conventionId) => ({
    conventionId,
    source: 'packages/ui/src/atoms/toggle/types.ts#ToggleProps'
  })),
  ...['initial-uncontrolled-pressed', 'leading-icon', 'pressed-change', 'pressed-state'].map((conventionId) => ({
    conventionId,
    source: 'packages/ui/src/atoms/chip/types.ts#ChipProps'
  })),
  { conventionId: 'accessible-name', source: 'packages/ui/src/atoms/dropzone/types.ts#DropzoneProps' },
  { conventionId: 'visual-treatment', source: 'packages/ui/src/atoms/dropzone/types.ts#DropzoneProps' },
  { conventionId: 'files-received', source: 'packages/ui/src/atoms/dropzone/types.ts#DropzoneProps' },
  { conventionId: 'drop-target-label', source: 'packages/ui/src/atoms/dropzone/types.ts#DropzoneProps' },
  { conventionId: 'accessible-name', source: 'packages/ui/src/atoms/stat/types.ts#StatProps' },
  { conventionId: 'primary-value', source: 'packages/ui/src/atoms/stat/types.ts#StatProps' },
  { conventionId: 'value-context', source: 'packages/ui/src/atoms/stat/types.ts#StatProps' },
  { conventionId: 'transient-highlight', source: 'packages/ui/src/atoms/stat/types.ts#StatProps' },
  { conventionId: 'preset-dimensions', source: 'packages/ui/src/atoms/stat/types.ts#StatProps' },
  { conventionId: 'unavailable-measurement-message', source: 'packages/ui/src/atoms/stat/types.ts#StatProps' },
  ...['accessible-name', 'keyboard-shortcut-hint', 'compact-presentation'].map((conventionId) => ({
    conventionId,
    source: 'packages/ui/src/atoms/search-trigger/types.ts#SearchTriggerProps'
  })),
  ...['quotation-text', 'trailing-text-accent', 'quotation-source', 'visual-treatment', 'surface-material-tone'].map(
    (conventionId) => ({
      conventionId,
      source: 'packages/ui/src/atoms/pull-quote/types.ts#PullQuoteProps'
    })
  ),
  {
    conventionId: 'aspect-ratio',
    source: 'packages/ui/src/primitives/aspect-ratio/types.ts#AspectRatioProps'
  },
  {
    conventionId: 'slot-composition',
    source: 'packages/ui/src/primitives/visually-hidden/types.ts#VisuallyHiddenProps'
  },
  { conventionId: 'layout-orientation', source: 'packages/ui/src/primitives/divider/types.ts#DividerProps' },
  { conventionId: 'decorative-separation', source: 'packages/ui/src/primitives/divider/types.ts#DividerProps' },
  { conventionId: 'portal-container', source: 'packages/ui/src/primitives/portal/types.ts#PortalProps' },
  { conventionId: 'visual-treatment', source: 'packages/ui/src/primitives/label/types.ts#LabelProps' },
  { conventionId: 'visual-treatment', source: 'packages/ui/src/primitives/skeleton/types.ts#SkeletonProps' },
  { conventionId: 'preset-dimensions', source: 'packages/ui/src/primitives/skeleton/types.ts#SkeletonProps' },
  { conventionId: 'signal-pulse', source: 'packages/ui/src/primitives/skeleton/types.ts#SkeletonProps' },
  { conventionId: 'layout-gap', source: 'packages/ui/src/primitives/stack/types.ts#StackProps' },
  { conventionId: 'layout-gap', source: 'packages/ui/src/primitives/stack/types.ts#ClusterProps' },
  { conventionId: 'cross-axis-alignment', source: 'packages/ui/src/primitives/stack/types.ts#StackProps' },
  { conventionId: 'cross-axis-alignment', source: 'packages/ui/src/primitives/stack/types.ts#ClusterProps' },
  { conventionId: 'main-axis-distribution', source: 'packages/ui/src/primitives/stack/types.ts#StackProps' },
  { conventionId: 'main-axis-distribution', source: 'packages/ui/src/primitives/stack/types.ts#ClusterProps' },
  { conventionId: 'slot-composition', source: 'packages/ui/src/primitives/stack/types.ts#StackProps' },
  { conventionId: 'slot-composition', source: 'packages/ui/src/primitives/stack/types.ts#ClusterProps' },
  { conventionId: 'visual-treatment', source: 'packages/ui/src/primitives/text/types.ts#TextProps' },
  { conventionId: 'visual-treatment', source: 'packages/ui/src/primitives/text/types.ts#HeadingProps' },
  { conventionId: 'surface-material-tone', source: 'packages/ui/src/primitives/text/types.ts#TextProps' },
  { conventionId: 'surface-material-tone', source: 'packages/ui/src/primitives/text/types.ts#HeadingProps' },
  { conventionId: 'slot-composition', source: 'packages/ui/src/primitives/text/types.ts#TextProps' },
  { conventionId: 'heading-level', source: 'packages/ui/src/primitives/text/types.ts#HeadingProps' },
  { conventionId: 'trailing-text-accent', source: 'packages/ui/src/primitives/text/types.ts#TextProps' },
  { conventionId: 'trailing-text-accent', source: 'packages/ui/src/primitives/text/types.ts#HeadingProps' },
  { conventionId: 'accent-line-break', source: 'packages/ui/src/primitives/text/types.ts#TextProps' },
  { conventionId: 'accent-line-break', source: 'packages/ui/src/primitives/text/types.ts#HeadingProps' },
  { conventionId: 'icon-glyph-name', source: 'packages/ui/src/atoms/icon/types.ts#IconProps' },
  { conventionId: 'preset-dimensions', source: 'packages/ui/src/atoms/icon/types.ts#IconProps' },
  { conventionId: 'filled-glyph', source: 'packages/ui/src/atoms/icon/types.ts#IconProps' },
  { conventionId: 'accessible-name', source: 'packages/ui/src/atoms/icon/types.ts#IconProps' },
  { conventionId: 'surface-material-tone', source: 'packages/ui/src/primitives/surface/types.ts#SurfaceProps' },
  { conventionId: 'surface-elevation', source: 'packages/ui/src/primitives/surface/types.ts#SurfaceProps' },
  { conventionId: 'inner-padding', source: 'packages/ui/src/primitives/surface/types.ts#SurfaceProps' },
  { conventionId: 'corner-radius', source: 'packages/ui/src/primitives/surface/types.ts#SurfaceProps' },
  { conventionId: 'slot-composition', source: 'packages/ui/src/primitives/surface/types.ts#SurfaceProps' },
  { conventionId: 'accessible-name', source: 'packages/ui/src/atoms/spinner/types.ts#SpinnerProps' },
  { conventionId: 'preset-dimensions', source: 'packages/ui/src/atoms/spinner/types.ts#SpinnerProps' },
  { conventionId: 'accessible-name', source: 'packages/ui/src/atoms/radio-group/types.ts#RadioGroupProps' },
  { conventionId: 'choice-options', source: 'packages/ui/src/atoms/radio-group/types.ts#RadioGroupProps' },
  { conventionId: 'primary-value', source: 'packages/ui/src/atoms/radio-group/types.ts#RadioGroupProps' },
  { conventionId: 'initial-uncontrolled-value', source: 'packages/ui/src/atoms/radio-group/types.ts#RadioGroupProps' },
  { conventionId: 'interactive-value-change', source: 'packages/ui/src/atoms/radio-group/types.ts#RadioGroupProps' },
  { conventionId: 'layout-orientation', source: 'packages/ui/src/atoms/radio-group/types.ts#RadioGroupProps' },
  { conventionId: 'checked-change', source: 'packages/ui/src/atoms/switch/types.ts#SwitchProps' },
  { conventionId: 'tooltip-content', source: 'packages/ui/src/atoms/tooltip/types.ts#TooltipProps' },
  { conventionId: 'floating-side', source: 'packages/ui/src/atoms/tooltip/types.ts#TooltipProps' },
  { conventionId: 'primary-value', source: 'packages/ui/src/atoms/progress-bar/types.ts#ProgressBarProps' },
  { conventionId: 'accessible-name', source: 'packages/ui/src/atoms/progress-bar/types.ts#ProgressBarProps' },
  {
    conventionId: 'measurement-text-equivalent',
    source: 'packages/ui/src/atoms/progress-bar/types.ts#ProgressBarProps'
  },
  { conventionId: 'preset-dimensions', source: 'packages/ui/src/atoms/progress-bar/types.ts#ProgressBarProps' },
  { conventionId: 'visual-treatment', source: 'packages/ui/src/atoms/progress-bar/types.ts#ProgressBarProps' },
  { conventionId: 'container-edge-placement', source: 'packages/ui/src/atoms/progress-bar/types.ts#ProgressBarProps' },
  { conventionId: 'visual-treatment', source: 'packages/ui/src/atoms/textarea/types.ts#TextareaProps' },
  { conventionId: 'preset-dimensions', source: 'packages/ui/src/atoms/input/types.ts#InputProps' },
  { conventionId: 'visual-treatment', source: 'packages/ui/src/atoms/input/types.ts#InputProps' },
  { conventionId: 'leading-icon', source: 'packages/ui/src/atoms/input/types.ts#InputProps' },
  { conventionId: 'pending-activity', source: 'packages/ui/src/atoms/input/types.ts#InputProps' },
  { conventionId: 'visual-treatment', source: 'packages/ui/src/atoms/logo/types.ts#LogoProps' },
  { conventionId: 'preset-dimensions', source: 'packages/ui/src/atoms/logo/types.ts#LogoProps' },
  { conventionId: 'accessible-name', source: 'packages/ui/src/atoms/logo/types.ts#LogoProps' },
  {
    conventionId: 'consumer-selected-condition',
    source: 'packages/ui/src/atoms/status-dot/types.ts#StatusDotProps'
  },
  { conventionId: 'signal-pulse', source: 'packages/ui/src/atoms/status-dot/types.ts#StatusDotProps' },
  { conventionId: 'accessible-name', source: 'packages/ui/src/atoms/kbd/types.ts#KbdProps' },
  { conventionId: 'slot-composition', source: 'packages/ui/src/atoms/link/types.ts#LinkProps' },
  { conventionId: 'new-tab-navigation', source: 'packages/ui/src/atoms/link/types.ts#LinkProps' },
  { conventionId: 'new-tab-notice', source: 'packages/ui/src/atoms/link/types.ts#LinkProps' },
  { conventionId: 'trailing-arrow', source: 'packages/ui/src/atoms/link/types.ts#LinkProps' },
  { conventionId: 'primary-value', source: 'packages/ui/src/atoms/select/types.ts#SelectProps' },
  { conventionId: 'initial-uncontrolled-value', source: 'packages/ui/src/atoms/select/types.ts#SelectProps' },
  { conventionId: 'interactive-value-change', source: 'packages/ui/src/atoms/select/types.ts#SelectProps' },
  { conventionId: 'preset-dimensions', source: 'packages/ui/src/atoms/select/types.ts#SelectProps' },
  { conventionId: 'choice-options', source: 'packages/ui/src/atoms/select/types.ts#SelectProps' },
  { conventionId: 'selection-placeholder', source: 'packages/ui/src/atoms/select/types.ts#SelectProps' },
  ...[
    'accessible-name',
    'preset-dimensions',
    'surface-material-tone',
    'unavailable-measurement-message',
    'deadline-instant',
    'absolute-deadline-text',
    'time-unit-labels',
    'deadline-expiration',
    'clock-initialization-message',
    'expired-deadline-message'
  ].map((conventionId) => ({
    conventionId,
    source: 'packages/ui/src/atoms/countdown/types.ts#CountdownProps'
  }))
];
function historicalRegistry(registry, reviewedUsages = postReceiptUsages) {
  return registry.map((entry) => ({
    ...entry,
    usages: entry.usages.filter(
      (usage) =>
        !reviewedUsages.some(
          (reviewed) =>
            reviewed.conventionId === entry.id && reviewed.source === `${usage.source.path}#${usage.source.symbol}`
        )
    )
  }));
}

test('post-receipt usages exist with valid source evidence', () => {
  const actual = JSON.parse(fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json'), 'utf8'));
  validate(actual);
  for (const reviewed of postReceiptUsages) {
    const current = actual.find(({ id }) => id === reviewed.conventionId);
    assert.ok(current, reviewed.conventionId);
    const matching = current.usages.filter(
      (usage) => `${usage.source.path}#${usage.source.symbol}` === reviewed.source
    );
    assert.equal(matching.length, 1, reviewed.source);
    assert.ok(fs.statSync(resolve(root, matching[0].source.path)).isFile());
    assert.equal(matching[0].source.revision, digest(fs.readFileSync(resolve(root, matching[0].source.path))));
    const filtered = historicalRegistry([current], [reviewed])[0].usages;
    assert.ok(
      filtered.every((usage) => `${usage.source.path}#${usage.source.symbol}` !== reviewed.source),
      reviewed.source
    );
    assert.deepEqual(
      filtered,
      current.usages.filter((usage) => usage !== matching[0])
    );
  }
});
test('historical registry removes only exact reviewed convention and source pairs', () => {
  const reviewed = [{ conventionId: 'example', source: 'example.ts#ExampleProps' }];
  const accepted = { source: { path: 'example.ts', symbol: 'ExampleProps' } };
  const otherSymbol = { source: { path: 'example.ts', symbol: 'Unreviewed' } };
  const otherPath = { source: { path: 'other.ts', symbol: 'ExampleProps' } };
  const fixture = [
    { id: 'example', usages: [accepted, otherSymbol, otherPath], meaning: 'Unchanged' },
    { id: 'another', usages: [accepted] }
  ];
  assert.deepEqual(historicalRegistry(fixture, reviewed), [
    { ...fixture[0], usages: [otherSymbol, otherPath] },
    fixture[1]
  ]);
  assert.throws(() => assert.deepEqual(historicalRegistry(fixture, reviewed)[0].usages, []));
  assert.deepEqual(historicalRegistry(fixture, []), fixture);
});
const digest = (bytes) => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const source = () => ({
  path: sourcePath,
  symbol: 'seed',
  revision: digest(fs.readFileSync(resolve(root, sourcePath)))
});
const seed = () => [
  {
    id: 'selected-value',
    name: 'value',
    meaning: 'Selected or displayed value.',
    whenToUse: 'Selection or measurement.',
    avoid: 'Visual treatment.',
    status: 'proposed',
    approval: null,
    aliases: [],
    exceptions: [],
    usages: [{ component: 'Example', type: 'string', status: 'existing', source: source() }]
  }
];
const validate = (registry, options = {}) => validateRegistry(registry, { root, ...options });
const entry = (overrides) => [{ ...seed()[0], ...overrides }];
const second = (overrides) => [...seed(), { ...seed()[0], id: 'other', name: 'other', usages: [], ...overrides }];
const usage = (overrides) => entry({ usages: [{ ...seed()[0].usages[0], ...overrides }] });
const evidence = (overrides) => usage({ source: { ...source(), ...overrides } });
const pendingException = (overrides = {}) => ({
  scope: 'Example',
  propName: 'selectedValue',
  reason: 'A separately reviewed component responsibility.',
  approval: null,
  ...overrides
});
const approval = (scope, contentHash) => ({
  reference: 'https://example.test/reviews/1#decision',
  scope,
  contentHash
});
function approve(entry, status = 'approved') {
  entry.status = status;
  entry.approval = approval(`convention:${entry.id}`, props.conventionHash(entry));
}
// Delegated receipts in order; each later receipt is accepted only when it pins its predecessor's exact bytes.
const receiptChain = [
  'docs/decisions/prop-naming-molecule-specs-approval.json',
  'docs/decisions/prop-naming-organism-specs-approval.json',
  'docs/decisions/prop-naming-template-specs-approval.json',
  'docs/decisions/prop-naming-isotipo3d-approval.json',
  'docs/decisions/prop-naming-skeleton-v0.2-approval.json',
  'docs/components/button/v0.1/prop-naming-approval.json',
  'docs/components/toggle/v0.1/prop-naming-approval-leading-icon-combined.json',
  'docs/components/icon-button/v0.1/prop-naming-approval-leading-icon-combined.json'
];
function laterReceipts(reference) {
  const later = new Map();
  for (let index = receiptChain.indexOf(reference) + 1; index > 0 && index < receiptChain.length; index += 1) {
    const previous = receiptChain[index - 1];
    const current = JSON.parse(fs.readFileSync(resolve(root, receiptChain[index]), 'utf8'));
    assert.equal(
      current.priorReceipts.find(({ path }) => path === previous)?.wholeFileSHA256,
      digest(fs.readFileSync(resolve(root, previous))),
      receiptChain[index]
    );
    later.set(receiptChain[index], current);
  }
  return later;
}
// Semantic amendments from receipts later than `afterReference` are projected back onto the
// current registry so a historical whole-registry snapshot stays reconstructable, the same way
// laterReceipts/superseded projections resolve amended entries for earlier receipt tests. The
// pre-image convention and approval come from the pinned previousReference receipt record and
// are bound by amendment.previousContentHash, never by editing receipts or hash literals.
function registryBeforeSemanticAmendments(registry, afterReference) {
  const reverted = new Map();
  for (const laterReceipt of laterReceipts(afterReference).values()) {
    const history = new Map();
    for (const prior of laterReceipt.priorReceipts) {
      history.set(prior.path, JSON.parse(fs.readFileSync(resolve(root, prior.path), 'utf8')));
    }
    for (const amendment of laterReceipt.semanticAmendments) {
      const previous = history
        .get(amendment.previousReference)
        ?.entries.find(({ convention }) => convention.id === amendment.id);
      assert.ok(previous, amendment.id);
      assert.equal(previous.contentHash, amendment.previousContentHash, amendment.id);
      assert.equal(previous.contentHash, props.conventionHash(previous.convention), amendment.id);
      // The earliest later amendment holds the pre-image as of afterReference.
      if (reverted.has(amendment.id)) {
        continue;
      }
      reverted.set(amendment.id, {
        ...previous.convention,
        approval: {
          reference: amendment.previousReference,
          scope: previous.scope,
          contentHash: previous.contentHash
        }
      });
    }
  }
  return registry.map((entry) => {
    const previous = reverted.get(entry.id);
    return previous ? { ...entry, ...previous, usages: entry.usages } : entry;
  });
}
function approveException(entry, exception) {
  exception.approval = approval(
    `exception:${entry.id}:${exception.scope}:${exception.propName}`,
    props.exceptionHash(exception)
  );
}

const iconButtonReference = 'docs/components/icon-button/v0.1/prop-naming-approval.json';
test('IconButton alone permits required decorative icon-only content without rewriting approval history', () => {
  const receipt = JSON.parse(fs.readFileSync(resolve(root, iconButtonReference), 'utf8'));
  const actual = JSON.parse(fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json'), 'utf8'));
  validate(actual);
  assert.equal(receipt.nativeReviewApproval, false);
  assert.equal(receipt.authority, 'assistant-recorded-forwarded-owner-approval');
  assert.equal(receipt.evidence.ownerChoice, 'Aprobar excepción para IconButton');
  assert.deepEqual(receipt.previouslyProposedNowApproved, []);
  assert.equal(receipt.semanticAmendments.length, 1);
  const [amendment] = receipt.semanticAmendments;
  assert.equal(amendment.id, 'leading-icon');
  assert.deepEqual(amendment.changedFields, ['meaning', 'whenToUse', 'avoid']);
  const previousReceipt = JSON.parse(fs.readFileSync(resolve(root, amendment.previousReference), 'utf8'));
  const previous = previousReceipt.entries.find(({ convention }) => convention.id === amendment.id);
  assert.equal(previous.contentHash, amendment.previousContentHash);
  assert.equal(previous.contentHash, props.conventionHash(previous.convention));
  // The combined receipt supersedes this parallel branch; check its recorded state, not the current text.
  const current = {
    ...actual.find(({ id }) => id === amendment.id),
    ...receipt.entries[0].convention,
    approval: {
      reference: iconButtonReference,
      scope: receipt.entries[0].scope,
      contentHash: receipt.entries[0].contentHash
    }
  };
  const { approval, usages: _usages, ...convention } = current;
  assert.deepEqual(receipt.entries, [
    { scope: 'convention:leading-icon', contentHash: props.conventionHash(current), convention }
  ]);
  assert.deepEqual(approval, {
    reference: iconButtonReference,
    scope: 'convention:leading-icon',
    contentHash: props.conventionHash(current)
  });
  assert.deepEqual(current.exceptions, [], 'Same-name semantic amendments are not alternative-name exceptions');
  for (const field of amendment.changedFields) {
    assert.equal(amendment.before[field], previous.convention[field]);
    assert.equal(amendment.after[field], current[field]);
  }
  assert.equal(
    current.meaning,
    previous.convention.meaning +
      ' IconButton alone requires one decorative ReactElement icon, named separately by its required label.'
  );
  assert.equal(
    current.whenToUse,
    previous.convention.whenToUse +
      ' IconButton alone also permits required decorative icon-only content with a separate required label.'
  );
  assert.equal(
    current.avoid,
    previous.convention.avoid +
      ' The icon-only exclusion has one exception: IconButton.icon with required label; no other component gains icon-only permission.'
  );
  assert.equal(receipt.priorReceipts.length, 8);
  for (const prior of receipt.priorReceipts) {
    assert.equal(digest(fs.readFileSync(resolve(root, prior.path))), prior.wholeFileSHA256, prior.path);
  }
  const before = registryBeforeSemanticAmendments(
    historicalRegistry(actual),
    'docs/decisions/prop-naming-skeleton-v0.2-approval.json'
  );
  assert.deepEqual(
    before.find(({ id }) => id === amendment.id),
    {
      ...previous.convention,
      approval: { reference: amendment.previousReference, scope: previous.scope, contentHash: previous.contentHash },
      usages: []
    }
  );
  assert.deepEqual(
    actual
      .filter((entry) => entry.usages.some(({ component }) => component === 'IconButton'))
      .map(({ id }) => id)
      .sort(),
    ['accessible-name', 'leading-icon', 'preset-dimensions', 'slot-composition', 'visual-treatment']
  );
  const broadened = structuredClone(actual);
  const icon = broadened.find(({ id }) => id === amendment.id);
  icon.avoid = 'All components may use icon-only or trailing icons.';
  assert.throws(() => validate(broadened), /approval/i);
  icon.approval.contentHash = props.conventionHash(icon);
  assert.doesNotThrow(() => validate(broadened), 'Schema validation cannot grant semantic approval');
  assert.notEqual(
    icon.approval.contentHash,
    receipt.entries[0].contentHash,
    'Rehashing cannot authorize other components'
  );
  assert.notDeepEqual(icon.avoid, convention.avoid);
});

const toggleReference = 'docs/components/toggle/v0.1/prop-naming-approval.json';
test('Toggle alone permits required icon-only content without widening other components or rewriting history', () => {
  const receipt = JSON.parse(fs.readFileSync(resolve(root, toggleReference), 'utf8'));
  const actual = JSON.parse(fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json'), 'utf8'));
  validate(actual);
  assert.equal(receipt.nativeReviewApproval, false);
  assert.equal(receipt.authority, 'assistant-recorded-forwarded-owner-approval');
  assert.equal(receipt.evidence.ownerChoice, 'Aprobar excepción para Toggle');
  assert.deepEqual(receipt.previouslyProposedNowApproved, []);
  assert.equal(receipt.semanticAmendments.length, 1);
  const [amendment] = receipt.semanticAmendments;
  assert.equal(amendment.id, 'leading-icon');
  assert.deepEqual(amendment.changedFields, ['meaning', 'whenToUse', 'avoid']);
  const previousReceipt = JSON.parse(fs.readFileSync(resolve(root, amendment.previousReference), 'utf8'));
  const previous = previousReceipt.entries.find(({ convention }) => convention.id === amendment.id);
  assert.equal(amendment.previousContentHash, previous.contentHash);
  assert.equal(previous.contentHash, props.conventionHash(previous.convention));
  // The combined receipt supersedes this parallel branch; check its recorded state, not the current text.
  const current = {
    ...actual.find(({ id }) => id === amendment.id),
    ...receipt.entries[0].convention,
    approval: {
      reference: toggleReference,
      scope: receipt.entries[0].scope,
      contentHash: receipt.entries[0].contentHash
    }
  };
  const { approval, usages: _usages, ...convention } = current;
  assert.deepEqual(current.exceptions, [], 'Same-name semantic permissions are not alternative-name exceptions');
  assert.deepEqual(receipt.entries, [
    { scope: 'convention:leading-icon', contentHash: props.conventionHash(current), convention }
  ]);
  assert.deepEqual(approval, {
    reference: toggleReference,
    scope: 'convention:leading-icon',
    contentHash: props.conventionHash(current)
  });
  const additions = {
    meaning:
      ' Toggle alone also accepts a required decorative icon as its sole visible content, with a required accessible label.',
    whenToUse: ' Toggle alone permits its icon-only branch when icon and accessible label are both required.',
    avoid:
      ' The icon-only exclusion has one exception: Toggle with a required icon and accessible label; no other component gains icon-only permission. Trailing and interactive icons remain excluded.'
  };
  for (const field of amendment.changedFields) {
    assert.equal(amendment.before[field], previous.convention[field]);
    assert.equal(amendment.after[field], previous.convention[field] + additions[field]);
    assert.equal(current[field], amendment.after[field]);
  }
  assert.equal(receipt.priorReceipts.length, 8);
  for (const prior of receipt.priorReceipts) {
    assert.equal(digest(fs.readFileSync(resolve(root, prior.path))), prior.wholeFileSHA256, prior.path);
  }
  assert.deepEqual(
    registryBeforeSemanticAmendments(historicalRegistry(actual), skeletonReference).find(
      ({ id }) => id === amendment.id
    ),
    {
      ...previous.convention,
      approval: { reference: amendment.previousReference, scope: previous.scope, contentHash: previous.contentHash },
      usages: []
    }
  );
  const changed = structuredClone(actual);
  const broadened = changed.find(({ id }) => id === amendment.id);
  broadened.avoid = 'Icon-only controls are permitted everywhere.';
  assert.throws(() => validate(changed), /approval/i);
  broadened.approval.contentHash = props.conventionHash(broadened);
  assert.doesNotThrow(() => validate(changed), 'Schema validation cannot prove owner consent');
  assert.notEqual(broadened.approval.contentHash, receipt.entries[0].contentHash);
  assert.notDeepEqual(broadened.avoid, convention.avoid);
  assert.deepEqual(
    actual
      .filter((entry) => entry.usages.some(({ component }) => component === 'Toggle'))
      .map(({ id }) => id)
      .sort(),
    [
      'accessible-name',
      'initial-uncontrolled-pressed',
      'leading-icon',
      'preset-dimensions',
      'pressed-change',
      'pressed-state'
    ]
  );
});

const buttonReference = 'docs/components/button/v0.1/prop-naming-approval.json';
test('Button alone permits trailing decorative icons through a bounded semantic amendment', () => {
  const receipt = JSON.parse(fs.readFileSync(resolve(root, buttonReference), 'utf8'));
  const actual = JSON.parse(fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json'), 'utf8'));
  validate(actual);
  assert.equal(receipt.nativeReviewApproval, false);
  assert.equal(receipt.authority, 'assistant-recorded-forwarded-owner-approval');
  assert.equal(receipt.evidence.ownerChoice, 'Aprobar excepción para Button');
  assert.deepEqual(receipt.previouslyProposedNowApproved, []);
  assert.equal(receipt.semanticAmendments.length, 1);
  const [amendment] = receipt.semanticAmendments;
  assert.equal(amendment.id, 'leading-icon');
  assert.deepEqual(amendment.changedFields, ['meaning', 'whenToUse', 'avoid']);
  const previousReceipt = JSON.parse(fs.readFileSync(resolve(root, amendment.previousReference), 'utf8'));
  const previous = previousReceipt.entries.find(({ convention }) => convention.id === 'leading-icon');
  assert.equal(previous.contentHash, amendment.previousContentHash);
  assert.equal(previous.contentHash, props.conventionHash(previous.convention));
  // The combined receipt is a later linear amendment; project the registry back to this receipt.
  const current = registryBeforeSemanticAmendments(actual, buttonReference).find(({ id }) => id === 'leading-icon');
  const { approval, usages: _usages, ...convention } = current;
  assert.deepEqual(receipt.entries, [
    { scope: 'convention:leading-icon', contentHash: props.conventionHash(current), convention }
  ]);
  assert.deepEqual(approval, {
    reference: buttonReference,
    scope: 'convention:leading-icon',
    contentHash: props.conventionHash(current)
  });
  assert.deepEqual(
    current.exceptions,
    [],
    'Registry exceptions rename props; this same-name semantic exception uses an amendment'
  );
  for (const field of amendment.changedFields) {
    assert.equal(amendment.before[field], previous.convention[field]);
    assert.equal(amendment.after[field], current[field]);
  }
  assert.equal(
    current.meaning,
    previous.convention.meaning + ' Button alone may place this icon before or after its label, after it by default.'
  );
  assert.equal(
    current.whenToUse,
    previous.convention.whenToUse + ' Button alone also permits its iconPosition start/end slot, default end.'
  );
  assert.equal(
    current.avoid,
    previous.convention.avoid +
      ' The trailing-icon exclusion has one exception: Button with iconPosition; no other component gains trailing-icon permission.'
  );
  for (const prior of receipt.priorReceipts) {
    assert.equal(digest(fs.readFileSync(resolve(root, prior.path))), prior.wholeFileSHA256, prior.path);
  }
  const changed = structuredClone(actual);
  changed.find(({ id }) => id === 'leading-icon').avoid = 'Trailing icons are permitted everywhere.';
  assert.throws(() => validate(changed), /approval/i);
  const broadened = changed.find(({ id }) => id === 'leading-icon');
  broadened.approval.contentHash = props.conventionHash(broadened);
  assert.doesNotThrow(() => validate(changed), 'Schema validation is not semantic approval');
  assert.notEqual(broadened.approval.contentHash, receipt.entries[0].contentHash);
  assert.notDeepEqual(
    broadened.avoid,
    convention.avoid,
    'A refreshed hash cannot authorize trailing icons for other components'
  );
  assert.deepEqual(
    actual
      .filter((entry) => entry.usages.some(({ component }) => component === 'Button'))
      .map(({ id }) => id)
      .sort(),
    ['icon-placement', 'leading-icon', 'pending-activity', 'preset-dimensions', 'slot-composition', 'visual-treatment']
  );
  assert.equal(receipt.priorReceipts.length, 8);
  const before = registryBeforeSemanticAmendments(
    historicalRegistry(actual),
    'docs/decisions/prop-naming-skeleton-v0.2-approval.json'
  );
  const restored = before.find(({ id }) => id === 'leading-icon');
  assert.deepEqual(restored, {
    ...previous.convention,
    approval: { reference: amendment.previousReference, scope: previous.scope, contentHash: previous.contentHash },
    usages: []
  });
});

const combinedReference = 'docs/components/toggle/v0.1/prop-naming-approval-leading-icon-combined.json';
test('combined leading-icon receipt keeps Button and Toggle grants scoped and pins both prior approvals', () => {
  const receipt = JSON.parse(fs.readFileSync(resolve(root, combinedReference), 'utf8'));
  const actual = JSON.parse(fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json'), 'utf8'));
  validate(actual);
  assert.equal(receipt.nativeReviewApproval, false);
  assert.equal(receipt.authority, 'assistant-recorded-forwarded-owner-approval');
  assert.equal(receipt.evidence.ownerChoice, 'Texto combinado + nueva aprobación (recomendado); Aprobado tal cual');
  assert.deepEqual(receipt.previouslyProposedNowApproved, []);
  assert.ok(laterReceipts(buttonReference).has(combinedReference), 'The combined receipt pins Button bytes');
  assert.ok(!receiptChain.includes(toggleReference), 'The parallel Toggle receipt is not spliced into the chain');
  const pins = new Map(receipt.priorReceipts.map(({ path, wholeFileSHA256 }) => [path, wholeFileSHA256]));
  assert.equal(pins.size, 10);
  for (const [path, pin] of pins) {
    assert.equal(digest(fs.readFileSync(resolve(root, path))), pin, path);
  }
  assert.ok(pins.has(buttonReference) && pins.has(toggleReference));
  assert.equal(receipt.semanticAmendments.length, 1);
  const [amendment] = receipt.semanticAmendments;
  assert.equal(amendment.id, 'leading-icon');
  assert.equal(amendment.previousReference, buttonReference);
  assert.deepEqual(amendment.changedFields, ['meaning', 'whenToUse', 'avoid']);
  const previous = JSON.parse(fs.readFileSync(resolve(root, buttonReference), 'utf8')).entries[0];
  assert.equal(amendment.previousContentHash, previous.contentHash);
  // The IconButton combined receipt is a later linear amendment; project the registry back to this receipt.
  const current = registryBeforeSemanticAmendments(actual, combinedReference).find(({ id }) => id === 'leading-icon');
  const { approval, usages: _usages, ...convention } = current;
  assert.deepEqual(receipt.entries, [
    { scope: 'convention:leading-icon', contentHash: props.conventionHash(current), convention }
  ]);
  assert.deepEqual(approval, {
    reference: combinedReference,
    scope: 'convention:leading-icon',
    contentHash: props.conventionHash(current)
  });
  for (const field of amendment.changedFields) {
    assert.equal(amendment.before[field], previous.convention[field]);
    assert.equal(amendment.after[field], current[field]);
  }
  assert.equal(
    current.meaning,
    "Optional decorative icon rendered beside a component's text label (before it by default) and hidden from assistive technology. Button alone may place this icon before or after its label, after it by default. Toggle alone also accepts a required decorative icon as its sole visible content, with a required accessible label."
  );
  assert.equal(
    current.whenToUse,
    'A labelled component offers a leading pictogram that repeats or decorates meaning already present in its text. Button alone also permits its iconPosition start/end slot, default end. Toggle alone permits its icon-only branch when icon and accessible label are both required.'
  );
  assert.equal(
    current.avoid,
    'Icon-only controls (their accessible name is a separate required prop), trailing or interactive icons, or the sole carrier of meaning. Two scoped exceptions apply: Button with iconPosition may place the icon after its label, and Toggle with a required icon and accessible label may render icon-only. No other component gains trailing-icon or icon-only permission, and interactive icons remain excluded.'
  );
  assert.deepEqual(current.exceptions, []);
  const changed = structuredClone(actual);
  const broadened = changed.find(({ id }) => id === 'leading-icon');
  broadened.avoid = 'Trailing and icon-only icons are permitted everywhere.';
  assert.throws(() => validate(changed), /approval/i);
});

const iconButtonCombinedReference = 'docs/components/icon-button/v0.1/prop-naming-approval-leading-icon-combined.json';
test('IconButton combined leading-icon receipt keeps Button, Toggle and IconButton grants scoped and pins prior approvals', () => {
  const receipt = JSON.parse(fs.readFileSync(resolve(root, iconButtonCombinedReference), 'utf8'));
  const actual = JSON.parse(fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json'), 'utf8'));
  validate(actual);
  assert.equal(receipt.nativeReviewApproval, false);
  assert.equal(receipt.authority, 'assistant-recorded-forwarded-owner-approval');
  assert.equal(
    receipt.evidence.channel,
    'Interactive owner decision on 2026-10-26 in the parent session, forwarded by the parent task'
  );
  assert.equal(receipt.evidence.ownerChoice, 'Aprobado tal cual');
  assert.deepEqual(receipt.previouslyProposedNowApproved, []);
  assert.ok(
    laterReceipts(combinedReference).has(iconButtonCombinedReference),
    'The IconButton combined receipt pins the Button and Toggle combined bytes'
  );
  assert.ok(
    !receiptChain.includes(iconButtonReference),
    'The parallel IconButton receipt is not spliced into the chain'
  );
  const pins = new Map(receipt.priorReceipts.map(({ path, wholeFileSHA256 }) => [path, wholeFileSHA256]));
  assert.equal(pins.size, 12);
  for (const [path, pin] of pins) {
    assert.equal(digest(fs.readFileSync(resolve(root, path))), pin, path);
  }
  for (const reference of [buttonReference, toggleReference, combinedReference, iconButtonReference]) {
    assert.ok(pins.has(reference), reference);
  }
  assert.equal(receipt.semanticAmendments.length, 1);
  const [amendment] = receipt.semanticAmendments;
  assert.equal(amendment.id, 'leading-icon');
  assert.equal(amendment.previousReference, combinedReference);
  assert.deepEqual(amendment.changedFields, ['meaning', 'whenToUse', 'avoid']);
  const previous = JSON.parse(fs.readFileSync(resolve(root, combinedReference), 'utf8')).entries[0];
  assert.equal(amendment.previousContentHash, previous.contentHash);
  const current = actual.find(({ id }) => id === 'leading-icon');
  const { approval, usages: _usages, ...convention } = current;
  assert.deepEqual(receipt.entries, [
    { scope: 'convention:leading-icon', contentHash: props.conventionHash(current), convention }
  ]);
  assert.deepEqual(approval, {
    reference: iconButtonCombinedReference,
    scope: 'convention:leading-icon',
    contentHash: props.conventionHash(current)
  });
  for (const field of amendment.changedFields) {
    assert.equal(amendment.before[field], previous.convention[field]);
    assert.equal(amendment.after[field], current[field]);
  }
  assert.equal(
    current.meaning,
    "Optional decorative icon rendered beside a component's text label (before it by default) and hidden from assistive technology. Button alone may place this icon before or after its label, after it by default. Toggle alone also accepts a required decorative icon as its sole visible content, with a required accessible label. IconButton alone requires one decorative ReactElement icon, named separately by its required label."
  );
  assert.equal(
    current.whenToUse,
    'A labelled component offers a leading pictogram that repeats or decorates meaning already present in its text. Button alone also permits its iconPosition start/end slot, default end. Toggle alone permits its icon-only branch when icon and accessible label are both required. IconButton alone also permits required decorative icon-only content with a separate required label.'
  );
  assert.equal(
    current.avoid,
    'Icon-only controls (their accessible name is a separate required prop), trailing or interactive icons, or the sole carrier of meaning. Three scoped exceptions apply: Button with iconPosition may place the icon after its label; Toggle with a required icon and accessible label may render icon-only; IconButton.icon with its required label is icon-only by design. No other component gains trailing-icon or icon-only permission, and interactive icons remain excluded.'
  );
  assert.deepEqual(current.exceptions, []);
  const changed = structuredClone(actual);
  const broadened = changed.find(({ id }) => id === 'leading-icon');
  broadened.avoid = 'Trailing and icon-only icons are permitted everywhere.';
  assert.throws(() => validate(changed), /approval/i);
});

test('seed and component-specific types are valid; importing performs no CLI work', () => {
  const registry = seed();
  registry[0].usages.push({ component: 'Gauge', type: 'number', status: 'proposed', source: source() });
  assert.doesNotThrow(() => validate(registry));
  assert.match(renderRegistry(registry), /number/);
});

test('registry binds eight explicit convention approvals separately from Gauge implementation usage', () => {
  const actual = JSON.parse(fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json'), 'utf8'));
  validate(actual);
  assert.match(renderRegistry(actual), /Conventions start as proposed and require separate scoped approval\./);
  const approvedIds = [
    'primary-value',
    'preset-dimensions',
    'accessible-name',
    'consumer-selected-condition',
    'condition-description',
    'measurement-text-equivalent',
    'decorative-center-content',
    'unavailable-measurement-message'
  ];
  const deferredIds = [
    'initial-uncontrolled-value',
    'interactive-value-change',
    'visual-treatment',
    'surface-material-tone',
    'surface-elevation'
  ];
  for (const id of approvedIds) {
    assert.equal(actual.find((entry) => entry.id === id)?.status, 'approved', id);
  }
  // Deferral belongs to the historical receipt; later scoped decisions may accept those IDs.
  const elevation = actual.find((entry) => entry.id === 'surface-elevation');
  assert.equal(elevation?.status, 'approved');
  assert.equal(elevation.approval.reference, 'docs/decisions/prop-naming-molecule-specs-approval.json');
  const reference = 'docs/decisions/prop-naming-gauge-approval.json';
  const receipt = JSON.parse(fs.readFileSync(resolve(root, reference), 'utf8'));
  assert.equal(receipt.kind, 'human-approval-record');
  assert.equal(receipt.nativeReviewApproval, false);
  assert.deepEqual(receipt.entries.map((record) => record.convention.id).sort(), [...approvedIds].sort());
  assert.deepEqual([...receipt.deferredIds].sort(), [...deferredIds].sort());
  const receipts = new Map([[reference, receipt]]);
  for (const id of [...approvedIds, ...deferredIds]) {
    const entry = actual.find((entry) => entry.id === id);
    const { approval, usages: _usages, ...convention } = entry;
    if (approval === null) {
      continue;
    }
    if (!receipts.has(approval.reference)) {
      receipts.set(approval.reference, JSON.parse(fs.readFileSync(resolve(root, approval.reference), 'utf8')));
    }
    const current = receipts.get(approval.reference);
    assert.equal(current.kind, 'human-approval-record');
    assert.equal(current.nativeReviewApproval, false);
    const record = current.entries.find((record) => record.convention.id === id);
    assert.deepEqual(record.convention, convention);
    assert.equal(record.scope, `convention:${id}`);
    assert.equal(record.contentHash, props.conventionHash(entry));
    assert.deepEqual(approval, { reference: approval.reference, scope: record.scope, contentHash: record.contentHash });
  }
  const observed = actual.flatMap((entry) =>
    entry.usages.filter((usage) => usage.component === 'Gauge').map((usage) => [entry.name, usage])
  );
  const expected = {
    value: 'number',
    label: 'string',
    size: "GaugeSize | number (GaugeSize = 'sm' | 'md' | 'lg'; numeric CSS pixels, e.g. 64)",
    state: "GaugeState = 'normal' | 'warning' | 'critical' | 'muted' (GaugeStateProps union)",
    stateText: 'string (conditional requiredness in GaugeStateProps)',
    valueText: 'string',
    center: 'ReactNode',
    unavailableText: 'string'
  };
  assert.deepEqual(observed.map(([name]) => name).sort(), Object.keys(expected).sort());
  for (const [name, usage] of observed) {
    assert.equal(usage.type, expected[name]);
    assert.equal(usage.status, 'existing');
    assert.equal(usage.source.path, 'packages/ui/src/atoms/gauge/types.ts');
    assert.equal(usage.source.symbol, 'GaugeProps');
    assert.equal(usage.source.revision, digest(fs.readFileSync(resolve(root, usage.source.path))));
  }
});

test('molecule naming receipt binds delegated decisions without speculative implementation evidence', () => {
  const reference = 'docs/decisions/prop-naming-molecule-specs-approval.json';
  const receipt = JSON.parse(fs.readFileSync(resolve(root, reference), 'utf8'));
  const actual = JSON.parse(fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json'), 'utf8'));
  validate(actual);
  assert.equal(receipt.kind, 'human-approval-record');
  assert.equal(receipt.nativeReviewApproval, false);
  assert.equal(receipt.authority, 'assistant-observed-human-delegation');
  assert.deepEqual(
    receipt.evidence.userStatements.map(({ quote }) => quote),
    [
      'no me preguntes, aplica tu las opciones sugeridas y si tengo que irerar en la revisión ya lo vemos',
      'no dejes pendientes. todo de una cuando definamos specs. añade captura y acepta props',
      'hazlo'
    ]
  );
  assert.ok(receipt.evidence.userStatements.every(({ provenance }) => provenance.length > 0));
  assert.match(receipt.evidence.interpretation, /No per-convention user quotation/);
  assert.equal(receipt.evidence.draftSnapshot.count, 36);
  assert.equal(Object.keys(receipt.evidence.draftSnapshot.wholeFileSHA256).length, 36);
  assert.deepEqual(receipt.previouslyProposedNowApproved, ['surface-elevation']);
  assert.equal(receipt.entries.length, 66);
  assert.equal(new Set(receipt.entries.map(({ scope }) => scope)).size, receipt.entries.length);

  // Read tracked receipts only: ignored drafts are provenance, not a dependency of CI tests.
  const history = new Map();
  for (const prior of receipt.priorReceipts) {
    const bytes = fs.readFileSync(resolve(root, prior.path));
    assert.equal(digest(bytes), prior.wholeFileSHA256, prior.path);
    history.set(prior.path, JSON.parse(bytes));
  }
  // A later receipt is reviewed history only when it pins this receipt's exact bytes.
  const later = laterReceipts(reference);
  assert.ok(later.size >= 1);
  const superseded = new Map(
    [...later].flatMap(([laterReference, laterReceipt]) =>
      laterReceipt.semanticAmendments
        .filter(({ previousReference }) => previousReference === reference)
        .map((amendment) => [amendment.id, { ...amendment, laterReference }])
    )
  );
  const receipts = new Map([...history, [reference, receipt], ...later]);
  for (const entry of historicalRegistry(actual)) {
    assert.equal(entry.status, 'approved', entry.id);
    const { approval, usages: _usages, ...convention } = entry;
    const currentReceipt = receipts.get(approval.reference);
    assert.ok(currentReceipt, `Unreviewed receipt: ${approval.reference}`);
    assert.equal(currentReceipt.kind, 'human-approval-record');
    assert.equal(currentReceipt.nativeReviewApproval, false);
    const record = currentReceipt.entries.find((record) => record.convention.id === entry.id);
    assert.ok(record, entry.id);
    assert.deepEqual(record.convention, convention, entry.id);
    assert.equal(record.scope, `convention:${entry.id}`);
    assert.equal(record.contentHash, props.conventionHash(entry), entry.id);
    assert.deepEqual(approval, { reference: approval.reference, scope: record.scope, contentHash: record.contentHash });
    assert.ok(
      entry.usages.every((usage) => usage.component === 'Gauge'),
      entry.id
    );
  }
  for (const record of receipt.entries) {
    const entry = actual.find((entry) => entry.id === record.convention.id);
    assert.ok(entry, record.scope);
    const amendment = superseded.get(entry.id);
    if (amendment) {
      assert.equal(amendment.previousContentHash, record.contentHash, entry.id);
      assert.equal(entry.approval.reference, amendment.laterReference, entry.id);
    } else {
      assert.equal(entry.approval.reference, reference, entry.id);
    }
    // Receipt bytes bind current content, not merely an existing file path or fresh digest.
    const changed = structuredClone(actual);
    changed.find((entry) => entry.id === record.convention.id).meaning += ' Changed.';
    assert.throws(() => validate(changed), /approval/i, entry.id);
  }

  const amendedFields = {
    'consumer-selected-condition': ['meaning', 'whenToUse'],
    'condition-description': ['meaning', 'whenToUse'],
    'decorative-center-content': ['meaning'],
    'measurement-text-equivalent': ['meaning', 'whenToUse', 'avoid'],
    'unavailable-measurement-message': ['meaning', 'avoid'],
    'layout-orientation': ['meaning', 'whenToUse', 'avoid']
  };
  assert.deepEqual(receipt.semanticAmendments.map(({ id }) => id).sort(), Object.keys(amendedFields).sort());
  for (const amendment of receipt.semanticAmendments) {
    const previous = history
      .get(amendment.previousReference)
      .entries.find(({ convention }) => convention.id === amendment.id);
    assert.equal(previous.contentHash, amendment.previousContentHash, amendment.id);
    assert.equal(previous.contentHash, props.conventionHash(previous.convention), amendment.id);
    const current = receipt.entries.find(({ convention }) => convention.id === amendment.id);
    assert.notEqual(current.contentHash, previous.contentHash, amendment.id);
    const changedFields = Object.keys(previous.convention).filter(
      (field) => JSON.stringify(previous.convention[field]) !== JSON.stringify(current.convention[field])
    );
    assert.deepEqual(changedFields.sort(), [...amendedFields[amendment.id]].sort(), amendment.id);
    assert.deepEqual([...amendment.changedFields].sort(), changedFields, amendment.id);
    assert.ok(amendment.boundary.length > 0);
  }
  const amendments = new Set(receipt.semanticAmendments.map(({ id }) => id));
  const newlyAccepted = receipt.entries.filter(
    ({ convention }) => !amendments.has(convention.id) && convention.id !== 'surface-elevation'
  );
  assert.equal(newlyAccepted.length, 59);
  const historicalIds = new Set(
    [...history.values()].flatMap(({ entries }) => entries.map(({ convention }) => convention.id))
  );
  for (const { convention } of newlyAccepted) {
    assert.equal(historicalIds.has(convention.id), false, convention.id);
    assert.deepEqual(historicalRegistry(actual).find(({ id }) => id === convention.id).usages, [], convention.id);
    assert.deepEqual(convention.aliases, [], convention.id);
    assert.deepEqual(convention.exceptions, [], convention.id);
  }
  assert.equal(
    actual.some(
      ({ id, name, aliases }) => id === 'independent-gauge-rings' || name === 'rings' || aliases.includes('rings')
    ),
    false
  );
  assert.equal(actual.find(({ id }) => id === 'collection-items').name, 'items');
  assert.match(actual.find(({ id }) => id === 'measurement-text-equivalent').avoid, /indeterminate-progress/);
  assert.match(
    actual.find(({ id }) => id === 'unavailable-measurement-message').avoid,
    /initial clock sampling.*expired zero time.*indeterminate task progress/
  );
  assert.match(
    actual.find(({ id }) => id === 'layout-orientation').avoid,
    /inventing keyboard behavior for passive separators/
  );
});

test('organism naming receipt binds delegated decisions and the menu-entry-kind widening', () => {
  const reference = 'docs/decisions/prop-naming-organism-specs-approval.json';
  const receipt = JSON.parse(fs.readFileSync(resolve(root, reference), 'utf8'));
  const actual = JSON.parse(fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json'), 'utf8'));
  validate(actual);
  assert.equal(receipt.kind, 'human-approval-record');
  assert.equal(receipt.nativeReviewApproval, false);
  assert.equal(receipt.authority, 'assistant-observed-human-delegation');
  assert.deepEqual(
    receipt.evidence.userStatements.map(({ quote }) => quote),
    [
      'no me preguntes, aplica tu las opciones sugeridas y si tengo que irerar en la revisión ya lo vemos',
      'no dejes pendientes. todo de una cuando definamos specs. añade captura y acepta props',
      'empezamos con spcs de organismos'
    ]
  );
  assert.ok(receipt.evidence.userStatements.every(({ provenance }) => provenance.length > 0));
  assert.match(receipt.evidence.interpretation, /No per-convention user quotation/);
  assert.equal(receipt.evidence.draftSnapshot.count, 9);
  assert.equal(Object.keys(receipt.evidence.draftSnapshot.wholeFileSHA256).length, 9);
  assert.deepEqual(receipt.previouslyProposedNowApproved, []);
  assert.equal(receipt.entries.length, 21);
  assert.equal(new Set(receipt.entries.map(({ scope }) => scope)).size, receipt.entries.length);

  const history = new Map();
  for (const prior of receipt.priorReceipts) {
    const bytes = fs.readFileSync(resolve(root, prior.path));
    assert.equal(digest(bytes), prior.wholeFileSHA256, prior.path);
    history.set(prior.path, JSON.parse(bytes));
  }
  assert.equal(history.size, 4);
  for (const record of receipt.entries) {
    const entry = actual.find((entry) => entry.id === record.convention.id);
    assert.ok(entry, record.scope);
    const { approval, usages, ...convention } = entry;
    assert.deepEqual(record.convention, convention, entry.id);
    assert.equal(record.scope, `convention:${entry.id}`);
    assert.equal(record.contentHash, props.conventionHash(entry), entry.id);
    assert.deepEqual(approval, { reference, scope: record.scope, contentHash: record.contentHash });
    assert.deepEqual(usages, [], entry.id);
    const changed = structuredClone(actual);
    changed.find((entry) => entry.id === record.convention.id).meaning += ' Changed.';
    assert.throws(() => validate(changed), /approval/i, entry.id);
  }

  assert.deepEqual(
    receipt.semanticAmendments.map(({ id }) => id),
    ['menu-entry-kind']
  );
  const [amendment] = receipt.semanticAmendments;
  const previous = history
    .get(amendment.previousReference)
    .entries.find(({ convention }) => convention.id === amendment.id);
  assert.equal(previous.contentHash, amendment.previousContentHash);
  assert.equal(previous.contentHash, props.conventionHash(previous.convention));
  const current = receipt.entries.find(({ convention }) => convention.id === amendment.id);
  const changedFields = Object.keys(previous.convention).filter(
    (field) => JSON.stringify(previous.convention[field]) !== JSON.stringify(current.convention[field])
  );
  assert.deepEqual(changedFields.sort(), ['meaning', 'whenToUse']);
  assert.deepEqual([...amendment.changedFields].sort(), changedFields);
  for (const field of changedFields) {
    assert.equal(amendment.before[field], previous.convention[field], field);
    assert.equal(amendment.after[field], current.convention[field], field);
  }
  assert.match(current.convention.meaning, /data-driven menu or navigation entry/);
  assert.ok(amendment.boundary.length > 0);

  const historicalIds = new Set(
    [...history.values()].flatMap(({ entries }) => entries.map(({ convention }) => convention.id))
  );
  const newlyAccepted = receipt.entries.filter(({ convention }) => convention.id !== amendment.id);
  assert.equal(newlyAccepted.length, 20);
  for (const { convention } of newlyAccepted) {
    assert.equal(historicalIds.has(convention.id), false, convention.id);
    assert.deepEqual(convention.aliases, [], convention.id);
    assert.deepEqual(convention.exceptions, [], convention.id);
  }
  // 123 entries at this receipt; later receipts that pin it may only add new IDs.
  const later = laterReceipts(reference);
  const knownIds = new Set([...historicalIds, ...receipt.entries.map(({ convention }) => convention.id)]);
  const laterAdded = [...later.values()].flatMap(({ entries }) =>
    entries.filter(({ convention }) => !knownIds.has(convention.id))
  );
  assert.equal(actual.length, 123 + laterAdded.length);
});

test('template naming receipt pins the organism receipt and binds two new layout slots', () => {
  const reference = 'docs/decisions/prop-naming-template-specs-approval.json';
  const receipt = JSON.parse(fs.readFileSync(resolve(root, reference), 'utf8'));
  const registryBytes = fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json'));
  const actual = JSON.parse(registryBytes);
  validate(actual);
  assert.equal(receipt.kind, 'human-approval-record');
  assert.equal(receipt.nativeReviewApproval, false);
  assert.equal(receipt.authority, 'assistant-observed-human-delegation');
  assert.notEqual(receipt.sourceRegistrySHA256, digest(registryBytes));
  assert.deepEqual(
    receipt.evidence.userStatements.map(({ quote }) => quote),
    [
      'no me preguntes, aplica tu las opciones sugeridas y si tengo que irerar en la revisión ya lo vemos',
      'no dejes pendientes. todo de una cuando definamos specs. añade captura y acepta props',
      'si'
    ]
  );
  assert.ok(receipt.evidence.userStatements.every(({ provenance }) => provenance.length > 0));
  assert.match(receipt.evidence.userStatements[2].provenance, /¿Seguimos con AppShell\?/);
  assert.match(receipt.evidence.interpretation, /No per-convention user quotation/);
  assert.equal(receipt.evidence.draftSnapshot.count, 1);
  assert.deepEqual(Object.keys(receipt.evidence.draftSnapshot.wholeFileSHA256), ['app-shell.md']);
  assert.deepEqual(receipt.previouslyProposedNowApproved, []);
  assert.deepEqual(receipt.semanticAmendments, []);
  assert.deepEqual(
    receipt.entries.map(({ convention }) => convention.id),
    ['side-navigation', 'bottom-navigation']
  );

  const history = new Map();
  for (const prior of receipt.priorReceipts) {
    const bytes = fs.readFileSync(resolve(root, prior.path));
    assert.equal(digest(bytes), prior.wholeFileSHA256, prior.path);
    history.set(prior.path, JSON.parse(bytes));
  }
  assert.equal(history.size, 5);
  assert.ok(history.has('docs/decisions/prop-naming-organism-specs-approval.json'));
  const historicalIds = new Set(
    [...history.values()].flatMap(({ entries }) => entries.map(({ convention }) => convention.id))
  );
  for (const record of receipt.entries) {
    assert.equal(historicalIds.has(record.convention.id), false, record.convention.id);
    const entry = actual.find((entry) => entry.id === record.convention.id);
    assert.ok(entry, record.scope);
    const { approval, usages, ...convention } = entry;
    assert.deepEqual(record.convention, convention, entry.id);
    assert.equal(record.scope, `convention:${entry.id}`);
    assert.equal(record.contentHash, props.conventionHash(entry), entry.id);
    assert.deepEqual(approval, { reference, scope: record.scope, contentHash: record.contentHash });
    assert.deepEqual(usages, [], entry.id);
    assert.deepEqual(convention.aliases, [], entry.id);
    assert.deepEqual(convention.exceptions, [], entry.id);
    const changed = structuredClone(actual);
    changed.find((entry) => entry.id === record.convention.id).meaning += ' Changed.';
    assert.throws(() => validate(changed), /approval/i, entry.id);
  }
  assert.equal(actual.find(({ id }) => id === 'side-navigation').name, 'sideNavigation');
  assert.equal(actual.find(({ id }) => id === 'bottom-navigation').name, 'bottomNavigation');
  const later = laterReceipts(reference);
  const laterAdded = [...later.values()].flatMap(({ entries }) =>
    entries.filter(
      ({ convention }) =>
        !historicalIds.has(convention.id) && !receipt.entries.some((r) => r.convention.id === convention.id)
    )
  );
  assert.equal(actual.length, 125 + laterAdded.length);
});

const isotipoReference = 'docs/decisions/prop-naming-isotipo3d-approval.json';
const skeletonReference = 'docs/decisions/prop-naming-skeleton-v0.2-approval.json';
const isotipoPriorPins = [
  ['gauge', '97374db3519c5cd1b0c7c05e5c73974138c47ce38c4326e702f613f800b69911'],
  ['atom-specs', 'a615c560018e7d142a9e627d85ba101c57c35a5289abf2fa48bf1cec0b69903b'],
  ['ambient-background', 'bf7574a50d0d52f0bc2fc2a2c224d200b0dd84537c3ec565f193b3cd93190e71'],
  ['molecule-specs', '2ef1fd8192f5004da741b83570a08b4a2e517cee6e714cd6154e37d67b53e838'],
  ['organism-specs', 'c8bdcbb7e3ef9ef2621440b97128b8468b7c5f10b2e5e9b2de528abee4d9dea4'],
  ['template-specs', '4bf0cffbbb2403aedd4830b4983519c863ebd851705f7050f4b7f104327a550a']
].map(([name, hash]) => ({
  path: `docs/decisions/prop-naming-${name}-approval.json`,
  wholeFileSHA256: `sha256:${hash}`
}));
function checkIsotipoHistory(receipt, read = (path) => fs.readFileSync(resolve(root, path))) {
  assert.deepEqual(receipt.priorReceipts, isotipoPriorPins);
  for (const prior of receipt.priorReceipts) {
    assert.equal(digest(read(prior.path)), prior.wholeFileSHA256, prior.path);
  }
}

test('Isotipo3D naming receipt preserves 125 entries and binds three scoped approvals, not full Draft consent', () => {
  const receipt = JSON.parse(fs.readFileSync(resolve(root, isotipoReference), 'utf8'));
  const actual = JSON.parse(fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json'), 'utf8'));
  validate(actual);
  assert.equal(actual.length, 128);
  assert.equal(receipt.kind, 'human-approval-record');
  assert.equal(receipt.nativeReviewApproval, false);
  assert.equal(receipt.authority, 'assistant-observed-human-delegation');
  assert.equal(receipt.sourceRegistrySHA256, 'sha256:b5d1ffd75c8ded3c976115db39d9515f0ce321bdc15892fb63156309feea9adc');
  assert.equal(
    digest(
      `${JSON.stringify(
        registryBeforeSemanticAmendments(historicalRegistry(actual).slice(0, 125), isotipoReference),
        null,
        2
      )}\n`
    ),
    receipt.sourceRegistrySHA256
  );
  assert.equal(receipt.sourceRegistryEntryCount, 125);
  assert.deepEqual(receipt.previouslyProposedNowApproved, ['effect-scene', 'effect-progress', 'pointer-tilt']);
  assert.deepEqual(receipt.semanticAmendments, []);
  assert.deepEqual(
    receipt.evidence.userStatements.map(({ quote }) => quote),
    ['ok']
  );
  assert.ok(receipt.evidence.userStatements[0].provenance.length > 0);
  assert.equal(
    receipt.evidence.question,
    '¿Autorizás conservar las tres capturas como referencias —Lab con recorte y fallback solo geometría/paleta— y registrar las convenciones scene, progress y pointerTilt? Sin instalar three, implementar ni publicar todavía.'
  );
  assert.match(receipt.evidence.interpretation, /not.*per-payload/);
  assert.equal(receipt.evidence.draftSnapshot.path, '.playwright-mcp/specs/isotipo3d/isotipo3d-v0.3.md');
  assert.equal(
    receipt.evidence.draftSnapshot.wholeFileSHA256,
    'sha256:a926e56dfc4b28d257f3cdabfeab7f4ac9e51c765030848d09190d7d3afaacfc'
  );
  assert.equal(
    receipt.evidence.draftSnapshot.canonicalSHA256,
    'sha256:8e2c363cc6871657789e94b17b68ddeaae3d6a358fe55ebbaa828b2f0e24389c'
  );
  assert.equal(receipt.evidence.draftSnapshot.canonicalBytes, 49890);
  checkIsotipoHistory(receipt);
  assert.ok(laterReceipts('docs/decisions/prop-naming-template-specs-approval.json').has(isotipoReference));
  const hashes = [
    [
      'effect-scene',
      'scene',
      '153b68933d1df373b063201e03fcac8c33b6780cec26065802af47bfbf6507dc',
      'a0ddc8aa8c8209ef712164e164408cf2e0d49d7b1ff11a9497d7e40c78f37818'
    ],
    [
      'effect-progress',
      'progress',
      '2d645be86ca2574d3b8a0330e846def3894da1cdfd46f2f7b3e204bdbf8bd36d',
      '5d3b9c8baefc158b078147f53b76a57f54a63e825c105f63f638010c2188a4b9'
    ],
    [
      'pointer-tilt',
      'pointerTilt',
      '91eae46168acb123c0f532b1ed3e45e0c9403386816faa20fc5c8977e3dd7815',
      '4dd09b904cc3152e23929278dda86055a623f6c837977a691d7f7f93d71e5c00'
    ]
  ];
  assert.deepEqual(
    receipt.entries.map(({ convention }) => convention.id),
    hashes.map(([id]) => id)
  );
  for (const [id, name, proposedHash, approvedHash] of hashes) {
    const record = receipt.entries.find(({ convention }) => convention.id === id);
    const entry = actual.find((entry) => entry.id === id);
    const { approval, usages, ...convention } = entry;
    assert.equal(entry.name, name);
    assert.equal(entry.status, 'approved');
    assert.deepEqual(record.convention, convention);
    assert.deepEqual(record.proposedConvention, { ...entry, status: 'proposed', approval: null });
    assert.equal(record.proposedContentHash, `sha256:${proposedHash}`);
    assert.equal(record.proposedContentHash, props.conventionHash(record.proposedConvention));
    assert.equal(record.contentHash, `sha256:${approvedHash}`);
    assert.equal(record.contentHash, props.conventionHash(entry));
    assert.equal(record.scope, `convention:${id}`);
    assert.deepEqual(approval, { reference: isotipoReference, scope: record.scope, contentHash: record.contentHash });
    assert.deepEqual(usages, []);
    assert.deepEqual(entry.aliases, []);
    assert.deepEqual(entry.exceptions, []);
  }
  assert.equal(
    actual.find(({ id }) => id === 'layer-opacity').approval.reference,
    'docs/decisions/prop-naming-ambient-background-approval.json'
  );
});

test('Isotipo3D rejects stale naming approvals and refreshed-but-unreviewed receipt semantics', () => {
  const actual = JSON.parse(fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json'), 'utf8'));
  const receipt = JSON.parse(fs.readFileSync(resolve(root, isotipoReference), 'utf8'));
  for (const record of receipt.entries) {
    const changed = structuredClone(actual);
    const entry = changed.find(({ id }) => id === record.convention.id);
    entry.meaning += ' Changed.';
    assert.throws(() => validate(changed), /approval/i);
    entry.approval.contentHash = props.conventionHash(entry);
    assert.notEqual(entry.approval.contentHash, record.contentHash);
    const { approval: _approval, usages: _usages, ...convention } = entry;
    assert.notDeepEqual(convention, record.convention);
  }
});

test('Isotipo3D predecessor pins reject changed prior receipt bytes, changed pins and missing history in memory', () => {
  const receipt = JSON.parse(fs.readFileSync(resolve(root, isotipoReference), 'utf8'));
  for (const prior of isotipoPriorPins) {
    assert.throws(
      () =>
        checkIsotipoHistory(receipt, (path) => {
          const bytes = fs.readFileSync(resolve(root, path));
          return path === prior.path ? Buffer.concat([bytes, Buffer.from('\n')]) : bytes;
        }),
      /AssertionError/
    );
    const changed = structuredClone(receipt);
    changed.priorReceipts.find(({ path }) => path === prior.path).wholeFileSHA256 = `sha256:${'0'.repeat(64)}`;
    assert.throws(() => checkIsotipoHistory(changed), /AssertionError/);
  }
  const missing = structuredClone(receipt);
  missing.priorReceipts.pop();
  assert.throws(() => checkIsotipoHistory(missing), /AssertionError/);
});

test('Skeleton v0.2 naming receipt records the owner published-spec approval and widens signal-pulse', () => {
  const receipt = JSON.parse(fs.readFileSync(resolve(root, skeletonReference), 'utf8'));
  const actual = JSON.parse(fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json'), 'utf8'));
  validate(actual);
  assert.equal(actual.length, 128);
  assert.equal(receipt.kind, 'human-approval-record');
  assert.equal(receipt.nativeReviewApproval, false);
  assert.equal(receipt.authority, 'assistant-observed-human-delegation');
  assert.equal(receipt.sourceRegistryEntryCount, 128);
  assert.equal(receipt.sourceRegistrySHA256, 'sha256:76bd797a68e19111cb1449730149b766b2377acc08475ede02508adc0eb13885');
  assert.notEqual(
    receipt.sourceRegistrySHA256,
    digest(fs.readFileSync(resolve(root, 'skills/_shared/prop-naming.json')))
  );
  assert.deepEqual(receipt.previouslyProposedNowApproved, []);
  assert.match(
    receipt.evidence.draftSnapshot.reference,
    /^https:\/\/github\.com\/egdev6\/egdev-design-system\/issues\/102#issuecomment-6328255802$/
  );
  assert.equal(
    receipt.evidence.draftSnapshot.canonicalSHA256,
    'sha256:4fea97ea3b2fcd36116fb3ab5acffb54ff9645f6f74a38616f67e0c16c6b5a72'
  );
  assert.deepEqual(
    receipt.evidence.userStatements.map(({ quote }) => quote),
    ['aprueba y publica']
  );
  assert.match(receipt.evidence.userStatements[0].provenance, /issues\/102#issuecomment-6328255802/);
  assert.match(receipt.evidence.userStatements[0].provenance, /2026-10-22/);
  assert.match(receipt.evidence.interpretation, /not.*per-payload/);

  const history = new Map();
  for (const prior of receipt.priorReceipts) {
    const bytes = fs.readFileSync(resolve(root, prior.path));
    assert.equal(digest(bytes), prior.wholeFileSHA256, prior.path);
    history.set(prior.path, JSON.parse(bytes));
  }
  assert.equal(history.size, 7);
  assert.ok(history.has('docs/decisions/prop-naming-atom-specs-approval.json'));
  assert.ok(laterReceipts(isotipoReference).has(skeletonReference));

  assert.deepEqual(
    receipt.semanticAmendments.map(({ id }) => id),
    ['signal-pulse']
  );
  const [amendment] = receipt.semanticAmendments;
  assert.equal(amendment.previousReference, 'docs/decisions/prop-naming-atom-specs-approval.json');
  const previous = history
    .get(amendment.previousReference)
    .entries.find(({ convention }) => convention.id === amendment.id);
  assert.equal(previous.contentHash, amendment.previousContentHash);
  assert.equal(previous.contentHash, props.conventionHash(previous.convention));
  const current = receipt.entries.find(({ convention }) => convention.id === amendment.id);
  assert.notEqual(current.contentHash, previous.contentHash);
  const changedFields = Object.keys(previous.convention).filter(
    (field) => JSON.stringify(previous.convention[field]) !== JSON.stringify(current.convention[field])
  );
  assert.deepEqual(changedFields.sort(), ['avoid', 'meaning', 'whenToUse']);
  assert.deepEqual([...amendment.changedFields].sort(), changedFields);
  for (const field of changedFields) {
    assert.equal(amendment.before[field], previous.convention[field], field);
    assert.equal(amendment.after[field], current.convention[field], field);
  }
  assert.equal(
    current.convention.meaning,
    'Whether a decorative signal indicator or placeholder plays its pulse animation; reduced-motion preferences always stop it.'
  );
  assert.equal(
    current.convention.whenToUse,
    'A decorative signal indicator or content placeholder offers an optional pulsing emphasis that the consumer can switch to a static presentation.'
  );
  assert.equal(
    current.convention.avoid,
    'Progress or completion animation, general motion toggles for interactive components, or conveying meaning only through motion.'
  );
  assert.ok(amendment.boundary.length > 0);

  assert.equal(receipt.entries.length, 1);
  for (const record of receipt.entries) {
    const entry = actual.find((entry) => entry.id === record.convention.id);
    assert.ok(entry, record.scope);
    const { approval, usages, ...convention } = entry;
    assert.deepEqual(record.convention, convention);
    assert.equal(record.scope, `convention:${entry.id}`);
    assert.equal(record.contentHash, props.conventionHash(entry));
    assert.deepEqual(approval, {
      reference: skeletonReference,
      scope: record.scope,
      contentHash: record.contentHash
    });
    const implementationUsage = {
      component: 'Skeleton',
      type: 'boolean',
      status: 'existing',
      source: {
        path: 'packages/ui/src/primitives/skeleton/types.ts',
        symbol: 'SkeletonProps',
        revision: digest(fs.readFileSync(resolve(root, 'packages/ui/src/primitives/skeleton/types.ts')))
      }
    };
    assert.deepEqual(
      usages.filter(({ source }) => source.path === implementationUsage.source.path),
      [implementationUsage]
    );
    // Later implementations (StatusDot, #71) append only reviewed post-receipt usages.
    assert.deepEqual(historicalRegistry([entry])[0].usages, []);
    assert.equal(entry.id, 'signal-pulse');
    assert.equal(entry.name, 'pulse');
    assert.equal(entry.status, 'approved');
    assert.deepEqual(entry.aliases, []);
    assert.deepEqual(entry.exceptions, []);
  }
  // The implementation commit records exactly one Skeleton usage under signal-pulse.
  assert.equal(
    actual.find(({ id }) => id === 'signal-pulse').usages.filter(({ component }) => component === 'Skeleton').length,
    1
  );
});

test('promoting observed usage to existing does not approve or change its proposed convention', () => {
  const registry = seed();
  const entry = registry[0];
  entry.usages[0].status = 'proposed';
  const before = props.conventionHash(entry);
  entry.usages[0].status = 'existing';
  assert.doesNotThrow(() => validate(registry));
  assert.equal(entry.status, 'proposed');
  assert.equal(entry.approval, null);
  assert.equal(props.conventionHash(entry), before);
  assert.match(renderRegistry(registry), /proposed; None recorded/);
});

for (const status of ['approved', 'deprecated']) {
  test(`${status} requires approval; synthetic scoped content-bound approval is accepted without proving consent`, () => {
    const registry = seed();
    registry[0].status = status;
    assert.throws(() => validate(registry), /approval/i);
    delete registry[0].approval;
    assert.throws(() => validate(registry), /approval/i);
    approve(registry[0], status);
    assert.doesNotThrow(() => validate(registry));
  });
}

for (const [field, value] of [
  ['reference', ' '],
  ['reference', 'approved by someone'],
  ['reference', 'http://example.test/review/1'],
  ['reference', 'https://user:password@example.test/review/1'],
  ['reference', '../approval.md'],
  ['reference', '/outside/approval.md'],
  ['reference', 'scripts/missing-approval.md'],
  ['scope', ' '],
  ['scope', 'convention:another-id'],
  ['contentHash', ' '],
  ['contentHash', 'sha256:invalid'],
  ['contentHash', `sha256:${'0'.repeat(64)}`]
]) {
  test(`rejects invalid approval ${field}: ${value}`, () => {
    const registry = seed();
    approve(registry[0]);
    registry[0].approval[field] = value;
    assert.throws(() => validate(registry));
  });
}

test('local approval references must resolve inside the repository; proposed entries cannot claim approval', () => {
  const registry = seed();
  approve(registry[0]);
  registry[0].approval.reference = `${sourcePath}#review-record`;
  assert.doesNotThrow(() => validate(registry));
  const io = {
    ...fs,
    realpathSync: (path) => (path === resolve(root, sourcePath) ? '/outside/approval' : fs.realpathSync(path))
  };
  assert.throws(() => validate(registry, { io }), /outside/);
  registry[0].status = 'proposed';
  assert.throws(() => validate(registry), /approval/i);
});

test('convention hashes have a fixed canonical definition, no approval/usage dependency and no array-order dependency', () => {
  const registry = seed();
  const e = registry[0];
  const canonical = {
    aliases: [],
    avoid: e.avoid,
    exceptions: [],
    id: e.id,
    meaning: e.meaning,
    name: e.name,
    status: e.status,
    whenToUse: e.whenToUse
  };
  assert.equal(props.conventionHash(e), digest(JSON.stringify(canonical)));
  e.aliases = ['z', 'a'];
  e.exceptions = [pendingException(), pendingException({ scope: 'Other', reason: 'Other reason.' })];
  approve(e);
  const before = props.conventionHash(e);
  e.approval.reference = 'https://example.test/reviews/2';
  e.usages.push({ component: 'Other', type: 'number', status: 'proposed', source: source() });
  approveException(e, e.exceptions[0]);
  e.aliases.reverse();
  e.exceptions.reverse();
  assert.equal(props.conventionHash(e), before);
  assert.doesNotThrow(() => validate(registry));
});

for (const key of ['id', 'name', 'meaning', 'whenToUse', 'avoid', 'status', 'aliases', 'exceptions']) {
  test(`approval goes stale when convention ${key} changes`, () => {
    const registry = seed();
    approve(registry[0]);
    const e = registry[0];
    if (key === 'aliases') {
      e.aliases.push('selected');
    } else if (key === 'exceptions') {
      e.exceptions.push(pendingException());
    } else if (key === 'status') {
      e.status = 'deprecated';
    } else {
      e[key] += 'Changed';
    }
    assert.throws(() => validate(registry), /approval/i);
  });
}

const invalid = [
  ['canonical name case collision', second({ name: 'VALUE' })],
  ['semantic ID collision', second({ id: 'SELECTED-VALUE' })],
  ['duplicate alias', entry({ aliases: ['selected', 'SELECTED'] })],
  ['alias canonical collision', entry({ aliases: ['VALUE'] })],
  [
    'cross-entry alias collision',
    [...entry({ aliases: ['selected'] }), ...entry({ id: 'other', name: 'other', aliases: ['SELECTED'] })]
  ],
  ['alias collides with later canonical', [...entry({ aliases: ['other'] }), ...entry({ id: 'other', name: 'OTHER' })]],
  ['duplicate component usage', entry({ usages: [seed()[0].usages[0], { ...seed()[0].usages[0], type: 'number' }] })],
  ['cross-entry public usage', second({ aliases: ['value'] })],
  ['missing source', evidence({ path: 'scripts/missing-prop-evidence.mjs' })],
  ['traversal', evidence({ path: 'scripts/../package.json' })],
  ['absolute source', evidence({ path: resolve(root, sourcePath) })],
  ['directory source', evidence({ path: 'scripts' })],
  ['backslash source', evidence({ path: 'scripts\\evidence' })],
  ['legacy string source', usage({ source: sourcePath })],
  ['absent source object', usage({ source: undefined })],
  ['missing source path', usage({ source: { symbol: 'ExampleProps', revision: source().revision } })],
  ['missing symbol', usage({ source: { path: sourcePath, revision: source().revision } })],
  ['empty symbol', evidence({ symbol: ' ' })],
  ['missing revision', usage({ source: { path: sourcePath, symbol: 'ExampleProps' } })],
  ['non-hash revision', evidence({ revision: 'HEAD' })],
  ['wrong file hash', evidence({ revision: `sha256:${'0'.repeat(64)}` })],
  ['bad convention status', entry({ status: 'existing' })],
  ['bad usage status', usage({ status: 'approved' })],
  ['empty type', usage({ type: ' ' })],
  ['empty meaning', entry({ meaning: '' })],
  ['unscoped exception', entry({ exceptions: [pendingException({ scope: '' })] })],
  ['wildcard exception scope', entry({ exceptions: [pendingException({ scope: '*' })] })],
  ['empty reason', entry({ exceptions: [pendingException({ reason: ' ' })] })],
  ['missing alternative prop name', entry({ exceptions: [{ scope: 'Example', reason: 'Reason.', approval: null }] })],
  ['invalid alternative prop name', entry({ exceptions: [pendingException({ propName: 'not-a-prop' })] })],
  ['same alternative as canonical', entry({ exceptions: [pendingException({ propName: 'VALUE' })] })],
  [
    'missing exception approval',
    entry({ exceptions: [{ scope: 'Example', propName: 'selected', reason: 'Reason.' }] })
  ],
  ['missing aliases', entry({ aliases: undefined })],
  ['extra entry field', entry({ invented: true })],
  ['extra source field', evidence({ invented: true })],
  ['invalid object', [null]]
];
for (const [name, registry] of invalid) {
  test(`rejects ${name}`, () => assert.throws(() => validate(registry)));
}

test('rejects malformed schema and symlink evidence outside root before reading', () => {
  for (const registry of [null, {}, [], [42]]) {
    assert.throws(() => validate(registry));
  }
  const io = {
    ...fs,
    readFileSync: () => assert.fail('must not read escaping evidence'),
    realpathSync: (path) => (path === resolve(root, sourcePath) ? '/outside/evidence' : fs.realpathSync(path))
  };
  assert.throws(() => validate(seed(), { io }), /outside/);
});

test('pending and approved exceptions bind component, alternative prop name and reason without global alias promotion', () => {
  const registry = seed();
  const exception = pendingException();
  registry[0].exceptions.push(exception);
  assert.doesNotThrow(() => validate(registry));
  assert.match(renderRegistry(registry), /Pending exception \(Example → selectedValue\)/);
  assert.deepEqual(registry[0].aliases, []);
  assert.equal(
    props.exceptionHash(exception),
    digest(
      JSON.stringify({
        propName: exception.propName,
        reason: exception.reason,
        scope: exception.scope
      })
    )
  );
  approveException(registry[0], exception);
  assert.doesNotThrow(() => validate(registry));
  assert.match(renderRegistry(registry), /Approved exception \(Example → selectedValue\)/);
  for (const key of ['scope', 'propName', 'reason']) {
    const changed = structuredClone(registry);
    changed[0].exceptions[0][key] += 'Changed';
    assert.throws(() => validate(changed), /approval/i);
  }
  for (const field of ['reference', 'scope', 'contentHash']) {
    const changed = structuredClone(registry);
    changed[0].exceptions[0].approval[field] = '';
    assert.throws(() => validate(changed), /approval/i);
  }
  exception.approval.scope = 'convention:selected-value';
  assert.throws(() => validate(registry), /approval/i);
});

test('approved alternative conflicts are component-scoped; pending exceptions grant no API permission', () => {
  const registry = second({ name: 'selectedValue' });
  const exception = pendingException();
  registry[0].exceptions.push(exception);
  registry[1].usages = [{ ...seed()[0].usages[0] }];
  assert.doesNotThrow(() => validate(registry));
  approveException(registry[0], exception);
  assert.throws(() => validate(registry), /public usage/i);
  registry[1].usages[0].component = 'Other';
  assert.doesNotThrow(() => validate(registry));
  registry.reverse();
  assert.doesNotThrow(() => validate(registry));
  registry[0].name = 'otherValue';
  registry[0].exceptions.push(pendingException({ propName: 'SELECTEDVALUE' }));
  approveException(registry[0], registry[0].exceptions[0]);
  assert.throws(() => validate(registry), /public usage/i);
});

test('duplicate scoped exceptions are rejected case-insensitively, not made global aliases', () => {
  const registry = seed();
  registry[0].exceptions = [pendingException(), pendingException({ scope: 'EXAMPLE', propName: 'SELECTEDVALUE' })];
  assert.throws(() => validate(registry), /duplicate/i);
  registry[0].exceptions[1].scope = 'Other';
  registry[0].aliases = ['selectedValue'];
  assert.doesNotThrow(() => validate(registry));
});

test('view is stable across ordering, escapes Markdown and displays approval and source evidence as text', () => {
  const registry = seed();
  registry[0].aliases = ['z', 'a'];
  registry[0].exceptions = [
    pendingException({ scope: 'Z', reason: 'Z reason' }),
    pendingException({ scope: 'A', reason: 'A | reason' })
  ];
  approveException(registry[0], registry[0].exceptions[0]);
  approve(registry[0]);
  registry[0].usages.push({ component: 'Another', type: 'number | null', status: 'proposed', source: source() });
  registry.push({ ...seed()[0], id: 'size', name: 'size', usages: [] });
  const before = renderRegistry(registry);
  registry.reverse();
  for (const entry of registry) {
    for (const key of ['usages', 'aliases', 'exceptions']) {
      entry[key].reverse();
    }
  }
  assert.equal(renderRegistry(registry), before);
  assert.match(before, /number &#124; null/);
  assert.match(before, /A &#124; reason/);
  assert.ok(before.includes(registry[1].approval.reference));
  assert.ok(before.includes(registry[1].approval.scope));
  assert.ok(before.includes(registry[1].approval.contentHash));
  assert.ok(before.includes(sourcePath));
  assert.ok(before.includes(source().revision));
  assert.doesNotMatch(before, /\[object Object\]/);
  assert.ok(before.includes('`convention:<entry.id>`'));
  assert.ok(before.includes('`exception:<entry.id>:<scope>:<propName>`'));
});

function fixture(overrides = {}) {
  const registryPath = 'skills/_shared/prop-naming.json';
  const outputPath = 'docs/prop-naming.md';
  const files = new Map([
    [resolve(root, registryPath), JSON.stringify(seed())],
    [resolve(root, outputPath), 'stale\n'],
    [resolve(root, sourcePath), fs.readFileSync(resolve(root, sourcePath))]
  ]);
  const writes = [];
  const messages = [];
  const io = {
    ...fs,
    readFileSync: (path) => {
      assert.ok(files.has(path), `Unexpected fixture read: ${path}`);
      return files.get(path);
    },
    writeFileSync: (path, text) => {
      assert.equal(path, resolve(root, outputPath));
      writes.push(path);
      files.set(path, text);
    },
    ...overrides
  };
  const run = (args) => runCli(args, { root, registryPath, outputPath, io, log: (text) => messages.push(text) });
  return { files, writes, messages, run, registry: resolve(root, registryPath), output: resolve(root, outputPath) };
}

test('CLI check fails stale without writes, write regenerates only view, default check succeeds', () => {
  const f = fixture();
  const original = f.files.get(f.registry);
  assert.equal(f.run(['--check']), 1);
  assert.equal(f.files.get(f.output), 'stale\n');
  assert.deepEqual(f.writes, []);
  assert.match(f.messages.join('\n'), /stale/i);
  assert.equal(f.run(['--write']), 0);
  assert.equal(f.files.get(f.output), renderRegistry(seed()));
  assert.deepEqual(f.writes, [f.output]);
  assert.equal(f.files.get(f.registry), original);
  assert.equal(f.run([]), 0);
  assert.match(f.messages.join('\n'), /up to date/i);
});

test('stale source evidence fails both modes without refreshing JSON or generated view', () => {
  const f = fixture();
  f.files.set(resolve(root, sourcePath), 'Changed file, even outside the reviewed symbol.');
  const before = new Map(f.files);
  for (const args of [['--check'], ['--write'], []]) {
    assert.equal(f.run(args), 1);
  }
  assert.match(f.messages.join('\n'), /revision/i);
  assert.deepEqual(f.writes, []);
  assert.deepEqual(f.files, before);
});

test('stale approval fails both modes without refreshing approval or generated view', () => {
  const f = fixture();
  const registry = seed();
  approve(registry[0]);
  registry[0].meaning += ' Changed.';
  f.files.set(f.registry, JSON.stringify(registry));
  const before = new Map(f.files);
  assert.equal(f.run(['--check']), 1);
  assert.equal(f.run(['--write']), 1);
  assert.match(f.messages.join('\n'), /approval/i);
  assert.deepEqual(f.writes, []);
  assert.deepEqual(f.files, before);
});

test('output symlinks cannot redirect regeneration to another repository file', () => {
  const f = fixture({
    realpathSync: (path) =>
      path === resolve(root, 'docs/prop-naming.md') ? resolve(root, sourcePath) : fs.realpathSync(path)
  });
  assert.equal(f.run(['--write']), 1);
  assert.deepEqual(f.writes, []);
});

test('invalid registry, unknown flags and escaping output never write', () => {
  const f = fixture();
  assert.equal(f.run(['--unknown']), 1);
  assert.equal(f.run(['--check', '--write']), 1);
  f.files.set(f.registry, '[{}]');
  assert.equal(f.run(['--write']), 1);
  f.files.set(f.registry, 'not json');
  assert.equal(f.run(['--write']), 1);
  assert.deepEqual(f.writes, []);
  assert.equal(runCli(['--write'], { root, outputPath: '../escape.md', log: (text) => f.messages.push(text) }), 1);
  const result = spawnSync(process.execPath, ['scripts/prop-naming.mjs', '--unknown'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unknown/i);
});
