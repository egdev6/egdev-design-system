import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Localizable built-in interface text of the shell. */
export type AppShellMessages = {
  /**
   * Visible text and accessible name of the skip link. Omitted entries use `Skip to content`.
   * @control false
   * @controlReason Structured message dictionary is not serializable; see the Localized story.
   */
  skipToContent?: string;
};

/** Region arrangement derived from the supplied navigation slots; internal, never a public prop. */
export type AppShellArrangement = 'switching' | 'side' | 'bottom' | 'content';

/** Responsive application region layout: one docked side region, one bottom region and the view's main content. */
export type AppShellProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'role' | 'dangerouslySetInnerHTML'> & {
  /**
   * Docked side navigation region, such as a Sidebar or ModuleRail. Its organism owns width, Material
   * and navigation behavior; the shell owns docking, full-height placement and responsive visibility.
   * @control false
   * @controlReason Composed navigation organism is not serializable; see the SidebarAndTabBar and SideOnly stories.
   */
  sideNavigation?: ReactNode;
  /**
   * Docked bottom navigation region, such as a TabBar. Shown below the 56rem viewport threshold when
   * sideNavigation is also supplied, and at every width when it is the only navigation.
   * @control false
   * @controlReason Composed navigation organism is not serializable; see the SidebarAndTabBar and BottomOnly stories.
   */
  bottomNavigation?: ReactNode;
  /**
   * Content of the view's single main landmark, without page padding or max-width. It must not
   * contain another main landmark.
   * @control false
   * @controlReason ReactNode page content is not serializable; see the ContentOnly and LongContent stories.
   */
  children: ReactNode;
  /**
   * Localizable built-in text. Omitted entries fall back to the documented English default.
   * @control false
   * @controlReason Structured message dictionary is not serializable; see the Localized story.
   */
  messages?: AppShellMessages;
};

/** Canvas root: column flow, document scroll and no containment or stacking. */
const appShellRootVariants = cva('eg-app-shell flex min-h-dvh w-full flex-col bg-bg-canvas font-sans text-fg-default');

/** Hide-until-focus skip row; in flow while focused and only where a side region is visible. */
const appShellSkipRowVariants = cva('sr-only focus-within:not-sr-only', {
  variants: {
    arrangement: { switching: 'hidden min-[56rem]:block', side: '', bottom: '', content: '' }
  },
  defaultVariants: { arrangement: 'content' }
});

/** Skip link Button: the only layout margin the shell applies to its composed action. */
const appShellSkipLinkVariants = cva('m-2');

/** Body row of the docked side region and the content column. */
const appShellBodyVariants = cva('flex flex-1');

/** Sticky full-height side column; the supplied organism owns its width and Material. */
const appShellSideVariants = cva('sticky top-0 h-dvh self-start shrink-0', {
  variants: {
    arrangement: { switching: 'max-[56rem]:hidden', side: '', bottom: '', content: '' }
  },
  defaultVariants: { arrangement: 'content' }
});

/** The view's single main landmark and skip target; no page padding, max-width or focus ring. */
const appShellMainVariants = cva('min-w-0 flex-1 focus:outline-none');

/** Sticky in-flow bottom dock: it occupies its own space, so it never covers the content end. */
const appShellBottomVariants = cva('sticky bottom-0', {
  variants: {
    arrangement: { switching: 'min-[56rem]:hidden', side: '', bottom: '', content: '' }
  },
  defaultVariants: { arrangement: 'content' }
});

/** Per-part recipes; arrangement is derived from slot presence and is never a public prop. */
export const appShellVariants = {
  root: appShellRootVariants,
  skip: appShellSkipRowVariants,
  skipLink: appShellSkipLinkVariants,
  body: appShellBodyVariants,
  side: appShellSideVariants,
  main: appShellMainVariants,
  bottom: appShellBottomVariants
} as const;
