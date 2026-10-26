import { cn } from '@/lib/cn';
import type { LogoArtwork, LogoShape } from './logo-artwork';
import { markArtwork, wordmarkArtwork } from './logo-artwork';
import type { LogoProps } from './types';
import { logoArtworkVariants, logoInkClasses, logoVariants } from './types';

/** Naming and content the contract owns per mode, even when unsupported code paths inject them. */
const FORBIDDEN_LINK = new Set(['children', 'aria-label', 'aria-labelledby', 'dangerouslySetInnerHTML']);
const FORBIDDEN_IMAGE = new Set([...FORBIDDEN_LINK, 'role', 'aria-hidden']);

const DEFAULT_LABEL = 'egdev';

export type UseLogoShape = LogoShape & { key: string; className: string };

export type UseLogoResult = {
  /** Link destination; undefined renders the image mode. */
  href: string | undefined;
  rootProps: Record<string, unknown> & { className: string };
  artwork: LogoArtwork;
  artworkClassName: string;
  shapes: UseLogoShape[];
};

/** Derive the image or link mode, its accessible name, the height preset and the inked artwork. */
export function useLogo(props: LogoProps): UseLogoResult {
  const { variant = 'wordmark', size, label, className, href, ...rest } = props;
  const link = href !== undefined;
  const forbidden = link ? FORBIDDEN_LINK : FORBIDDEN_IMAGE;
  const passthrough: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (!forbidden.has(key)) {
      passthrough[key] = value;
    }
  }
  const name = label?.trim() ? label : DEFAULT_LABEL;
  const artwork = variant === 'mark' ? markArtwork : wordmarkArtwork;
  return {
    href,
    rootProps: {
      ...passthrough,
      ...(link ? { href } : { role: 'img' }),
      'aria-label': name,
      className: cn(logoVariants({ size, link }), className)
    },
    artwork,
    artworkClassName: cn(logoArtworkVariants()),
    shapes: artwork.shapes.map((shape, index) => ({
      ...shape,
      key: `${shape.kind}-${index}`,
      className: logoInkClasses[shape.ink]
    }))
  };
}
