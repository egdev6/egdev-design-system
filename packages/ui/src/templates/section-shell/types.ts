import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Coordinated section scene and material treatment. */
export type SectionShellRegister = 'pro' | 'show' | 'flood' | 'deep' | 'grafito';

type SectionShellNativeProps = Omit<
  ComponentPropsWithoutRef<'section'>,
  'children' | 'role' | 'style' | 'dangerouslySetInnerHTML'
>;

/** Passive section frame. The host owns its accessible name, anchor, group edges and effects.
 * className supports outer placement only, not arbitrary appearance overrides. */
export type SectionShellProps = SectionShellNativeProps & {
  /**
   * Coordinated visual register for this section.
   * @default pro
   * @control select
   */
  register?: SectionShellRegister;
  /**
   * Supply a centered content wrapper with page gutters; disable for self-wrapped content.
   * @default true
   * @control boolean
   */
  wrap?: boolean;
  /**
   * Host-supplied content in reading order.
   * @control false
   * @controlReason ReactNode content is not serializable; see Default and WithoutWrap.
   */
  children: ReactNode;
};

/** Static, token-backed section recipes and bounded direct-child legacy reset. */
export const sectionShellVariants = cva(
  'eg-section box-border relative isolate flex flex-col justify-center min-h-[var(--section-min-height)] pt-[calc(var(--nav-height)+var(--space-8))] pb-8 shadow-none',
  {
    variants: {
      register: {
        pro: 'bg-transparent bg-none text-fg-default',
        show: 'bg-transparent bg-[image:var(--gradient-section-show)] text-fg-default',
        flood: 'bg-bg-flood bg-none text-fg-on-flood',
        deep: 'bg-bg-deep bg-none text-fg-default',
        grafito: 'bg-surface-0/50 bg-none text-fg-default [@media(prefers-reduced-transparency:reduce)]:bg-surface-0'
      },
      wrap: { true: '', false: '[&>*]:w-auto' }
    },
    defaultVariants: { register: 'pro', wrap: true }
  }
);

/** Centered content part, independently composed from the root. */
export const sectionShellWrapVariants = cva(
  'eg-section__wrap box-border w-full max-w-[var(--content-max)] mx-auto px-[var(--gutter)]'
);
