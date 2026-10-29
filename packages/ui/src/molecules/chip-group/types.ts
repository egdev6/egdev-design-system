import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Selection cardinality, never a visual treatment or a required form choice. */
export type ChipGroupType = 'single' | 'multiple';

/** One filter choice. Values must be unique and non-empty; icons must not contain controls. */
export type ChipGroupOption = {
  /**
   * Unique non-empty selection value; the empty string means no selection.
   * @control text
   */
  value: string;
  /**
   * Non-empty visible text and accessible item name.
   * @control text
   */
  label: string;
  /**
   * Disables this option without clearing its selection.
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * Optional decorative leading content, hidden from assistive technology.
   * @control false
   * @controlReason Non-serializable ReactNode; see the WithIcons story.
   */
  icon?: ReactNode;
};

type ChipGroupNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'defaultValue'
  | 'onChange'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'tabIndex'
  | 'dangerouslySetInnerHTML'
  | 'dir'
>;

type ChipGroupCommonProps = ChipGroupNativeProps & {
  /**
   * Required non-empty accessible group name; no visible heading is added.
   * @control text
   */
  label: string;
  /**
   * Choices in DOM and keyboard order. Empty arrays render an empty named group.
   * Consumers own valid labels, unique values and selection validity; no repair is performed.
   * @control false
   * @controlReason Structured choices may contain ReactNode icons; see Single, Multiple and WithIcons.
   */
  options: ChipGroupOption[];
  /**
   * Disables every item, preserving selection and dimming each item once, never the root.
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * Text direction and logical horizontal arrow direction.
   * @control select
   * @default ltr
   */
  dir?: 'ltr' | 'rtl';
};

/**
 * Named filter pills with Radix-owned selection and roving focus. Single mode allows clearing;
 * use RadioGroup for mandatory form choices. No ref, asChild, children or form submission API.
 * className supports root margins, width and parent flex/grid placement only, merged last by cn.
 * Do not switch mode or controlledness during a mount. Array values follow activation order.
 */
export type ChipGroupProps = ChipGroupCommonProps &
  (
    | {
        /**
         * At most one selected filter; selecting it again clears the group.
         * @control select
         */
        type: 'single';
        /**
         * Controlled selection; an empty string clears it. Omission leaves Radix uncontrolled.
         * @control false
         * @controlReason Mode-dependent string / string[] type; see the Single and Multiple stories.
         */
        value?: string;
        /**
         * Initial uncontrolled selection; omission starts empty. Later changes do not reset it.
         * @control false
         * @controlReason Mode-dependent string / string[] type; see the Single and Multiple stories.
         */
        defaultValue?: string;
        /**
         * Next selection after activation, including an empty string when cleared; not prop updates.
         * @control false
         * @controlReason Non-serializable callback; see the ControlledSingle story.
         */
        onValueChange?: (value: string) => void;
      }
    | {
        /**
         * Independent filters; no selection is required.
         * @control select
         */
        type: 'multiple';
        /**
         * Controlled selections; an empty array clears them. Omission leaves Radix uncontrolled.
         * @control false
         * @controlReason Mode-dependent string / string[] type; see the Single and Multiple stories.
         */
        value?: string[];
        /**
         * Initial uncontrolled selections; omission starts empty. Later changes do not reset them.
         * @control false
         * @controlReason Mode-dependent string / string[] type; see the Single and Multiple stories.
         */
        defaultValue?: string[];
        /**
         * Next selections in activation order after user interaction only, including an empty array.
         * @control false
         * @controlReason Non-serializable callback; see the ControlledMultiple story.
         */
        onValueChange?: (value: string[]) => void;
      }
  );

/** Internal unpainted wrapping layout, not a Material panel. */
export const chipGroupVariants = cva('eg-chip-group flex flex-wrap items-center gap-2');

/** Internal bounded additions to the shared Chip recipe: non-color cue and motion/disabled guards. */
export const chipGroupItemVariants = cva(
  'data-[state=on]:underline decoration-[length:var(--border-width)] underline-offset-[var(--space-1)] motion-reduce:transition-none disabled:cursor-not-allowed disabled:active:transform-none disabled:active:translate-none disabled:active:scale-none'
);

/** Decorative 14px wrapper; no public per-option class override. */
export const chipGroupIconVariants = cva(
  'inline-flex items-center justify-center size-3.5 shrink-0 [&>svg]:block [&>svg]:size-full'
);
