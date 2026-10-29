import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

/** Arrangement only; compact is not a calendar model. */
export type ListItemVariant = 'card' | 'compact' | 'row';
/** Exclusive host-selected presentation snapshots, not an internal lifecycle. */
export type ListItemStatus = 'default' | 'new' | 'failed' | 'done' | 'empty' | 'dragging' | 'off';

type ListItemNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'tabIndex'
  | 'contentEditable'
  | 'aria-selected'
  | 'aria-pressed'
  | 'aria-disabled'
>;

/**
 * Generic content container with independent actions. Non-default statuses require visible
 * explanatory content; failed also needs failure detail. No status announcements are synthesized.
 * className supports outer margin, width and parent placement only, merged last through cn.
 * No ref API. A slotted child may retain its own ref, but must not conflict with owned data props.
 */
export type ListItemProps = ListItemNativeProps &
  (
    | {
        /**
         * Host-selected condition, never selection or disabled semantics.
         * @default default
         * @control select
         */
        status?: Exclude<ListItemStatus, 'empty'>;
        /**
         * Arrangement and density; content preserves DOM order and wraps.
         * @default card
         * @control select
         */
        variant?: ListItemVariant;
        /**
         * Merge onto one child through Radix Slot. Populated children remain non-focusable containers.
         * @default false
         * @control boolean
         */
        asChild?: false;
        /**
         * Populated item composition; use compound parts for readable content and independent controls.
         * @control false
         * @controlReason ReactNode is not serializable; see Default and WithMedia.
         */
        children: ReactNode;
      }
    | {
        /**
         * Host-selected condition, never selection or disabled semantics.
         * @control select
         */
        status?: Exclude<ListItemStatus, 'empty'>;
        /**
         * Arrangement and density; content preserves DOM order and wraps.
         * @control select
         */
        variant?: ListItemVariant;
        /**
         * Merge onto one child through Radix Slot. Populated children remain non-focusable containers.
         * @control boolean
         */
        asChild: true;
        /**
         * One non-focusable li, article or div containing the entire populated composition.
         * @control false
         * @controlReason ReactElement is not serializable; see AsList and AsArticle.
         */
        children: ReactElement;
      }
    | {
        /**
         * Empty presentation requires a single native action and visible creation text.
         * @control select
         */
        status: 'empty';
        /**
         * Empty actions support card only; invalid runtime combinations normalize to card.
         * @control select
         */
        variant?: 'card';
        /**
         * Merge onto one native button or anchor; its child owns type, disabled, href and activation.
         * @control boolean
         */
        asChild: true;
        /**
         * One native action with phrasing content only; no compound div parts or nested controls.
         * @control false
         * @controlReason ReactElement is not serializable; see Empty, EmptyLink and EmptyDisabled.
         */
        children: ReactElement;
      }
  );

/**
 * Compound div attributes. className supports local alignment, placement and width constraints,
 * not appearance, hidden content or reordering. No ref, own role or tab stop is exposed.
 */
export type ListItemPartProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'dangerouslySetInnerHTML' | 'role' | 'tabIndex' | 'contentEditable'
>;

/** ListItem-specific state recipes augment, never copy, the exported Surface recipe. */
export const listItemVariants = cva([
  'eg-list-item group/list-item flex flex-col min-w-0 gap-3 p-4 rounded-lg font-sans',
  'data-[variant=compact]:p-3 data-[variant=compact]:gap-2 data-[variant=compact]:rounded-md',
  'data-[variant=row]:flex-row data-[variant=row]:flex-wrap data-[variant=row]:items-center data-[variant=row]:p-3 data-[variant=row]:rounded-md',
  'data-[state=default]:hover:border-border-hairline-strong',
  'data-[state=new]:bg-[image:var(--gradient-post-new)] data-[state=new]:border-border-brand data-[state=new]:text-fg-brand-raised',
  'data-[state=new]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)]',
  'data-[state=failed]:border-status-danger/40',
  'data-[state=done]:bg-transparent data-[state=done]:bg-none data-[state=done]:shadow-none',
  'data-[state=off]:bg-transparent data-[state=off]:bg-none data-[state=off]:shadow-none data-[state=off]:border-dashed',
  'data-[state=dragging]:border-dashed',
  'data-[state=empty]:bg-transparent data-[state=empty]:bg-none data-[state=empty]:shadow-none',
  'data-[state=empty]:border-dashed data-[state=empty]:border-border-control data-[state=empty]:min-h-14',
  'data-[state=empty]:flex-row data-[state=empty]:items-center data-[state=empty]:justify-center data-[state=empty]:text-label-default data-[state=empty]:text-fg-muted data-[state=empty]:cursor-pointer',
  'data-[state=empty]:not-disabled:hover:bg-bg-brand-subtle data-[state=empty]:not-disabled:hover:text-fg-default',
  'data-[state=empty]:focus-visible:outline-none data-[state=empty]:focus-visible:shadow-focus',
  'data-[state=empty]:disabled:opacity-45 data-[state=empty]:disabled:pointer-events-none data-[state=empty]:disabled:cursor-not-allowed'
]);

/** Supported outer-layout examples; no part appearance overrides. Internal to documentation. */
export const listItemExampleVariants = cva('', {
  variants: { layout: { narrow: 'w-full max-w-64', outer: 'w-full mt-4' } }
});

/** Local layout and ancestor data variants; parts have no state or context of their own. */
export const listItemPartVariants = cva('', {
  variants: {
    part: {
      body: 'eg-list-item__body flex flex-wrap items-start gap-3 min-w-0 group-data-[variant=row]/list-item:grow',
      content: [
        'eg-list-item__content min-w-0 grow [overflow-wrap:anywhere] font-sans text-body-default',
        'group-data-[variant=compact]/list-item:text-label-default',
        'group-data-[state=done]/list-item:text-fg-muted group-data-[state=off]/list-item:text-fg-secondary'
      ],
      media: [
        'eg-list-item__media w-[calc(var(--space-20)+var(--space-2))] h-[calc(var(--space-20)+var(--space-2))] shrink-0 overflow-hidden',
        '[&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>video]:w-full [&>video]:h-full [&>video]:object-cover',
        'group-data-[state=dragging]/list-item:opacity-50'
      ],
      footer: 'eg-list-item__foot flex flex-wrap items-center border-t border-border-hairline pt-3 gap-2',
      meta: 'eg-list-item__meta flex flex-wrap items-center min-w-0 gap-2 font-sans text-label-default text-fg-muted',
      actions: 'eg-list-item__acts flex flex-wrap items-center gap-1 ms-auto text-fg-default'
    }
  }
});
