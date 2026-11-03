import { Heading, Text } from '../../primitives/text';
import type { HeroProps } from './types';
import { useHero } from './useHero';

/** Introductory scene; the host supplies section semantics and decorative media. */
export function Hero(props: HeroProps) {
  const hero = useHero(props);
  return (
    <div {...hero.rootProps}>
      <div className={hero.copyClass}>
        {hero.eyebrow && (
          <div className={hero.eyebrowClass}>
            <Text variant='eyebrow'>{hero.eyebrow}</Text>
          </div>
        )}
        <div className={hero.headingClass}>
          <Heading id={hero.id} variant='hero' tone='canvas' level={hero.level} accent={hero.accent} accentBreak={true}>
            {hero.title}
          </Heading>
        </div>
        {hero.lede && <p className={hero.ledeClass}>{hero.lede}</p>}
        {hero.hasActions && <div className={hero.actionsClass}>{hero.children}</div>}
        {hero.hasSocial && <div className={hero.socialClass}>{hero.social}</div>}
      </div>
      {hero.hasMedia && (
        <div className={hero.mediaClass}>
          <div className={hero.slotClass} aria-hidden='true'>
            {hero.media}
          </div>
        </div>
      )}
    </div>
  );
}
