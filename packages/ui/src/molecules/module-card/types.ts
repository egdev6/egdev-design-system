import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Consumer-selected presentation, never a service-state engine. */
export type ModuleCardStatus = 'default' | 'error' | 'stopped';
/** Regular card or tonal header/body/footer hierarchy. */
export type ModuleCardVariant = 'default' | 'banded';
/** Supported Surface material; overlay is reserved for genuinely floating hosts. */
export type ModuleCardTone = 'surface-1' | 'overlay';
/** Native heading rank, independent of typography. */
export type ModuleCardLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Localizable built-in status phrases. Choose concise, non-empty text that fits a Badge. */
export type ModuleCardMessages = {
  /**
   * Ordinary status phrase; omitted dictionary overrides use Ready.
   * @control text
   */
  defaultStatus: string;
  /**
   * Error phrase; omitted dictionary overrides use Needs attention. The body supplies the explanation.
   * @control text
   */
  errorStatus: string;
  /**
   * Stopped phrase; omitted dictionary overrides use Stopped. Actions supply Start/enable or details.
   * @control text
   */
  stoppedStatus: string;
};

type ModuleCardNativeProps = Omit<
  ComponentPropsWithoutRef<'article'>,
  | 'children'
  | 'title'
  | 'role'
  | 'tabIndex'
  | 'contentEditable'
  | 'dangerouslySetInnerHTML'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-disabled'
  | 'aria-selected'
  | 'aria-pressed'
  | 'aria-live'
>;

/** Named passive module summary. className supports external layout only, merged last;
 * appearance, spacing and parts remain owned. Use className="col-span-full" in a parent grid.
 * No ref, asChild or whole-card activation API.
 */
export type ModuleCardProps = ModuleCardNativeProps & {
  /**
   * Visible non-empty heading and complete article name. Blank titles warn in development and render nothing.
   * @control text
   */
  title: string;
  /**
   * Native heading rank only; typography follows variant.
   * @default 2
   * @control select
   */
  level?: ModuleCardLevel;
  /**
   * Optional decorative pictogram; no controls or sole identity text. Absent/null/boolean omits the wrapper.
   * @control false
   * @controlReason ReactNode is not serializable; see WithIcon for a decorative system Icon.
   */
  icon?: ReactNode;
  /**
   * Meaningful free body; error content explains the problem. Consumers own figures and related controls.
   * @control false
   * @controlReason ReactNode is not serializable; see Default, Error and ChildStates for body compositions.
   */
  children: ReactNode;
  /**
   * Supplementary metadata and at most one utility control; never the primary actions. Omitted when absent/null/boolean.
   * @control false
   * @controlReason ReactNode is not serializable; see WithFooter and Banded for metadata and utility controls.
   */
  footer?: ReactNode;
  /**
   * Partial status dictionary; omitted or blank keys fall back to Ready / Needs attention / Stopped.
   * @control false
   * @controlReason A dictionary cannot use a scalar control; see Localized for partial message overrides.
   */
  messages?: Partial<ModuleCardMessages>;
} & (
    | {
        /**
         * Consumer-selected presentation; no automatic transitions or announcements.
         * @default default
         * @control select
         */
        status?: 'default';
        /**
         * Regular card or tonal bands, independent of status.
         * @default default
         * @control select
         */
        variant?: ModuleCardVariant;
        /**
         * Surface material; overlay requires a genuinely floating host.
         * @default surface-1
         * @control select
         */
        tone?: ModuleCardTone;
        /**
         * One or two supplied Button/Link controls. Absent/null/boolean omits the wrapper.
         * @control false
         * @controlReason ReactNode is not serializable; see WithActions for independent supplied controls.
         */
        actions?: ReactNode;
      }
    | {
        /**
         * Error presentation keeps the selected Material and requires meaningful recovery actions.
         * @control select
         */
        status: 'error';
        /**
         * Regular card or tonal bands, independent of status.
         * @control select
         */
        variant?: ModuleCardVariant;
        /**
         * Surface material; overlay requires a genuinely floating host.
         * @control select
         */
        tone?: ModuleCardTone;
        /**
         * One or two meaningful recovery Button/Link elements; null/boolean/empty fragments are unsupported.
         * @control false
         * @controlReason ReactNode is not serializable; see Error for required recovery controls.
         */
        actions: ReactNode;
      }
    | {
        /**
         * Unpainted dashed stopped presentation; does not disable descendants.
         * @control select
         */
        status: 'stopped';
        /**
         * Stopped cards support only the regular variant; untyped conflicts normalize to default.
         * @control select
         */
        variant?: 'default';
        /**
         * Stopped cards support only surface-1 input, then reset its paint.
         * @control select
         */
        tone?: 'surface-1';
        /**
         * One or two meaningful Start/enable/details controls; null/boolean/empty fragments are unsupported.
         * @control false
         * @controlReason ReactNode is not serializable; see Stopped for required Start controls.
         */
        actions: ReactNode;
      }
  );

/** Internal layout/state composition over the unmodified Surface recipe. */
export const moduleCardVariants = cva([
  'eg-module-card group/module-card flex flex-col min-w-0 gap-4 p-5 font-sans overflow-visible',
  'transform-none transition-none animate-none',
  'data-[variant=banded]:gap-0 data-[variant=banded]:p-0 data-[tone=overlay]:bg-none',
  'data-[state=error]:border-status-danger/40',
  'data-[state=stopped]:bg-transparent data-[state=stopped]:bg-none data-[state=stopped]:shadow-none',
  'data-[state=stopped]:border-dashed data-[state=stopped]:border-border-control'
]);

/** Header geometry; bands keep Surface's light edge and only their bottom separator. */
export const moduleCardHeadVariants = cva('eg-module-card__head flex flex-wrap items-center gap-2.5 min-w-0', {
  variants: {
    banded: {
      true: 'border-x-0 border-t-0 border-b rounded-t-xl py-3.5 px-6 group-data-[tone=overlay]/module-card:px-5',
      false: ''
    }
  }
});

/** Wrapper resets legacy SVG-only paint; the supplied glyph owns its geometry/paint. */
export const moduleCardIconVariants = cva(
  'eg-module-card__icon inline-flex size-(--icon-size) shrink-0 fill-inherit stroke-inherit text-fg-secondary group-data-[state=stopped]/module-card:text-fg-muted'
);

/** Rank-independent typography with stopped text treatment. */
export const moduleCardNameVariants = cva(
  'eg-module-card__name m-0 flex-1 min-w-0 wrap-anywhere text-fg-default group-data-[state=stopped]/module-card:text-fg-secondary',
  {
    variants: {
      banded: { true: 'font-display text-heading-small uppercase', false: 'font-sans text-cta-label' }
    }
  }
);

/** Free body stays transparent; last-part rounding never clips descendant focus. */
export const moduleCardBodyVariants = cva(
  'eg-module-card__body flex flex-col flex-1 min-w-0 gap-3 font-sans text-body-default text-fg-secondary wrap-anywhere last:rounded-b-xl',
  {
    variants: {
      banded: { true: 'gap-4 pt-5 px-6 pb-6 group-data-[tone=overlay]/module-card:px-5', false: '' }
    }
  }
);

/** Logical last-of-multiple alignment resets the source's physical margin in RTL. */
export const moduleCardActionsVariants = cva(
  'eg-module-card__actions flex flex-wrap items-center gap-2 mt-auto last:rounded-b-xl [&>:last-child:not(:first-child)]:ml-0 [&>:last-child:not(:first-child)]:ms-auto',
  {
    variants: { banded: { true: 'px-6 pb-5 group-data-[tone=overlay]/module-card:px-5', false: '' } }
  }
);

/** Lower band drops the Surface sheen/edge and redundant side/perimeter borders. */
export const moduleCardFootVariants = cva(
  'eg-module-card__foot flex flex-wrap items-center gap-2 min-w-0 font-sans text-label-default text-fg-muted wrap-anywhere',
  {
    variants: {
      banded: {
        true: 'border-x-0 border-b-0 border-t bg-none shadow-none rounded-b-xl py-2.5 ps-6 pe-3 group-data-[tone=overlay]/module-card:px-5',
        false: ''
      }
    }
  }
);

/** Badge's documented decorative 14px slot. */
export const moduleCardStatusIconVariants = cva('size-3.5');
