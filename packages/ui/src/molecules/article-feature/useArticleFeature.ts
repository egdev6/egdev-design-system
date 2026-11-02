import * as SlotPrimitive from '@radix-ui/react-slot';
import { type ComponentPropsWithoutRef, isValidElement, type ReactNode, useId } from 'react';
import { PhotoFrame } from '../../atoms/photo-frame';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import type { ArticleFeatureCoverProps, ArticleFeatureLevel, ArticleFeatureProps } from './types';
import {
  articleFeatureActionVariants,
  articleFeatureBadgeVariants,
  articleFeatureCoverVariants,
  articleFeatureDetailVariants,
  articleFeatureEyebrowVariants,
  articleFeatureMetaVariants,
  articleFeaturePlateVariants,
  articleFeatureTitleVariants,
  articleFeatureVariants,
  articleFeatureWordVariants
} from './types';

/** Runtime shape of the hook input once both union branches are merged. */
type ArticleFeatureMergedProps = ArticleFeatureProps & {
  role?: unknown;
  tabIndex?: unknown;
  style?: unknown;
  ref?: unknown;
};

export type UseArticleFeatureResult = {
  valid: boolean;
  root: 'a' | typeof SlotPrimitive.Root;
  rootProps: ComponentPropsWithoutRef<'a'> & { 'data-level': ArticleFeatureLevel; className: string };
  children: ReactNode;
  headingElement: `h${ArticleFeatureLevel}`;
  headingProps: { id: string; className: string };
  title: string;
  eyebrow: string | null;
  eyebrowProps: { className: string };
  detail: string | null;
  detailProps: { className: string };
  metaProps: { className: string };
  separatorProps: { 'aria-hidden': true };
  action: string | null;
  actionProps: { className: string };
  arrowProps: { name: 'arrow-right'; size: 'sm' };
};

/** Normalize the title, context row and action label, strip protected semantics and compose each part. */
export function useArticleFeature(props: ArticleFeatureProps): UseArticleFeatureResult {
  const {
    title,
    level = 3,
    asChild = false,
    eyebrow,
    detail,
    actionLabel,
    children,
    className,
    role: _role,
    tabIndex: _tabIndex,
    style: _style,
    ref: _ref,
    ...rest
  } = props as ArticleFeatureMergedProps;
  const headingId = useId();
  const valid = typeof title === 'string' && title.trim().length > 0;
  if ((typeof process === 'undefined' || process.env.NODE_ENV !== 'production') && !valid) {
    console.warn('ArticleFeature requires a non-empty title. Nothing was rendered.');
  }
  const rank: ArticleFeatureLevel = [2, 3, 4, 5, 6].includes(level) ? level : 3;
  const eyebrowText = typeof eyebrow === 'string' && eyebrow.trim().length > 0 ? eyebrow : null;
  const detailText = typeof detail === 'string' && detail.trim().length > 0 ? detail : null;
  const actionText = typeof actionLabel === 'string' && actionLabel.trim().length > 0 ? actionLabel : null;
  return {
    valid,
    root: asChild ? SlotPrimitive.Root : 'a',
    rootProps: {
      ...rest,
      'data-level': rank,
      className: cn(
        surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }),
        articleFeatureVariants(),
        className
      )
    },
    children,
    headingElement: `h${rank}`,
    headingProps: {
      id: headingId,
      className: cn(articleFeatureTitleVariants())
    },
    title,
    eyebrow: eyebrowText,
    eyebrowProps: { className: cn(articleFeatureEyebrowVariants()) },
    detail: detailText,
    detailProps: { className: cn(articleFeatureDetailVariants()) },
    metaProps: { className: cn(articleFeatureMetaVariants()) },
    separatorProps: { 'aria-hidden': true },
    action: actionText,
    actionProps: { className: cn(articleFeatureActionVariants()) },
    arrowProps: { name: 'arrow-right', size: 'sm' }
  };
}

export type UseArticleFeatureCoverResult = {
  coverProps: ComponentPropsWithoutRef<'div'> & { 'data-cover': 'generative' | 'media'; className: string };
  reservationProps: { ratio: 2 };
  media: ReactNode;
  plateProps: { className: string };
  word: string | null;
  wordProps: { 'aria-hidden': true; className: string };
  badge: string | null;
  badgeProps: { className: string };
};

/**
 * Resolve the cover branch: a supplied media child wins over the generative word, the reservation
 * stays the public AspectRatio composition, and composition errors warn in development only.
 */
export function useArticleFeatureCover(props: ArticleFeatureCoverProps): UseArticleFeatureCoverResult {
  const { coverWord, badge, children, className } = props;
  const media = isValidElement(children) ? children : null;
  if (media !== null) {
    const childRatio = (media.props as { ratio?: unknown }).ratio;
    if (
      (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') &&
      media.type === PhotoFrame &&
      childRatio !== undefined &&
      childRatio !== 'auto'
    ) {
      console.warn(
        'ArticleFeatureCover requires the composed PhotoFrame to use ratio="auto"; a child with its own ratio breaks the reserved 16:8 cover.'
      );
    }
    if (
      (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') &&
      typeof coverWord === 'string' &&
      coverWord.trim().length > 0
    ) {
      console.warn(
        'ArticleFeatureCover ignores coverWord when a media child is supplied; the media cover wins the cover region.'
      );
    }
  }
  const word = media === null && typeof coverWord === 'string' && coverWord.trim().length > 0 ? coverWord : null;
  const badgeText = typeof badge === 'string' && badge.trim().length > 0 ? badge : null;
  return {
    coverProps: {
      'data-cover': media === null ? 'generative' : 'media',
      className: cn(articleFeatureCoverVariants(), className)
    },
    reservationProps: { ratio: 2 },
    media: media === null ? null : (children as ReactNode),
    plateProps: {
      className: cn(surfaceVariants({ tone: 'well', padding: 'none', radius: 'none' }), articleFeaturePlateVariants())
    },
    word,
    wordProps: { 'aria-hidden': true, className: cn(articleFeatureWordVariants()) },
    badge: badgeText,
    badgeProps: { className: cn(articleFeatureBadgeVariants()) }
  };
}
