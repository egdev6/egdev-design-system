import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** One consumer-defined choreography zone. */
export type HomeTemplateZone = {
  /** Zone key matching a section's data-zone. @control text */
  id: string;
  /** Whether this zone owns the 3D layer. @control boolean */
  isotipo?: boolean;
  /** Ambient presence, derived from layer ownership when omitted. @control number */
  ambient?: number;
  /** Ambient profile. @control select */
  profile?: 'base' | 'read' | 'live';
  /** Isotipo pose family, required for 3D zones. @control select */
  scene?: 'hero' | 'chapter' | 'lab' | 'outro';
  /** Whether 3D remains enabled on mobile. @control boolean */
  mobileIsotipo?: boolean;
};

/**
 * Root className supports outer placement only, such as margins and self-alignment.
 * Appearance overrides are unsupported; root invariants take precedence in cn().
 */
export type HomeTemplateProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'dangerouslySetInnerHTML' | 'role' | 'style'
> & {
  /** Ordered scroll-choreography zones.
   * @control false
   * @controlReason Zone records require the dedicated story examples.
   */
  zoneTable: readonly HomeTemplateZone[];
  /** Consumer page content.
   * @control false
   * @controlReason React content requires the dedicated story examples.
   */
  children: ReactNode;
  /** Notify active zone identity changes.
   * @control false
   * @controlReason Callbacks require the dedicated story examples.
   */
  onZoneChange?: (change: { zone: string; previous: string | null }) => void;
};

export type HomeTemplateAnchorProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'dangerouslySetInnerHTML' | 'role' | 'style'
> & {
  /** Configured 3D zone key for this measured box. @control text */
  zone: string;
};

export const rootVariants = cva('eg-home-template relative isolate block w-full');
export const canvasVariants = cva('fixed inset-0 block w-full h-full pointer-events-none bg-transparent', {
  variants: {
    layer: {
      ambient: 'z-0 opacity-[var(--eg-home-ambient-opacity)]',
      isotipo: 'z-[1] opacity-[var(--eg-home-isotipo-opacity)]'
    }
  }
});
export const vignetteVariants = cva('fixed inset-0 z-0 pointer-events-none bg-[image:var(--gradient-vignette)]');
export const contentVariants = cva('relative z-[2] block overflow-x-clip');
export const anchorVariants = cva('eg-home-template-anchor relative block');
export const fallbackVariants = cva('block data-[state=painted]:opacity-0');
