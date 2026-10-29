import type { FC } from 'react';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { ProgressBar } from '../../atoms/progress-bar';
import { VisuallyHidden } from '../../primitives/visually-hidden';
import type { CarouselProps } from './types';
import { useCarousel } from './useCarousel';

/** Manually navigated read-only slides; no autoplay, selection-widget semantics or hidden slides. */
export const Carousel: FC<CarouselProps> = (props) => {
  const carousel = useCarousel(props);
  return (
    <div {...carousel.rootProps}>
      <div className={carousel.headerClassName}>
        <span {...carousel.labelProps}>{carousel.label}</span>
        <div className={carousel.controlsClassName}>
          <span className={carousel.counterClassName} aria-hidden='true'>
            <span className={carousel.currentClassName}>{carousel.currentText}</span> / {carousel.totalText}
          </span>
          <IconButton
            {...carousel.previousProps}
            label={carousel.messages.previousSlide}
            variant='ghost'
            size='lg'
            icon={<Icon name='arrow-right' className={carousel.previousIconClassName} />}
          />
          <IconButton
            {...carousel.nextProps}
            label={carousel.messages.nextSlide}
            variant='ghost'
            size='lg'
            icon={<Icon name='arrow-right' className={carousel.nextIconClassName} />}
          />
        </div>
      </div>
      <div {...carousel.trackProps}>
        {carousel.slides.map(({ item, props: slideProps }) => (
          <div key={item.value} {...slideProps}>
            {item.children}
          </div>
        ))}
      </div>
      {carousel.slides.length === 0 && <p>{carousel.messages.empty}</p>}
      <div className={carousel.progressClassName}>
        <ProgressBar value={carousel.progress} size='sm' variant='default' />
      </div>
      <VisuallyHidden id={carousel.instructionId}>{carousel.messages.instructions}</VisuallyHidden>
      <VisuallyHidden role='status' aria-atomic='true'>
        {carousel.status}
      </VisuallyHidden>
    </div>
  );
};
