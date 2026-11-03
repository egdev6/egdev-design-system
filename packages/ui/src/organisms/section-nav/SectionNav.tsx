import type { FC } from 'react';
import { Icon } from '../../atoms/icon';
import { Pixel } from '../../atoms/pixel';
import { ProgressBar } from '../../atoms/progress-bar';
import { Popover, PopoverContent, PopoverTrigger } from '../../molecules/popover';
import { Surface } from '../../primitives/surface';
import type { SectionNavProps } from './types';
import { useSectionNav } from './useSectionNav';

/** Floating, host-driven section index and next destination. */
export const SectionNav: FC<SectionNavProps> = (props) => {
  const nav = useSectionNav(props);
  return (
    <nav {...nav.rootProps}>
      {nav.items.length > 0 && (
        <Popover open={nav.popoverOpen} onOpenChange={nav.requestOpen}>
          <Surface tone='overlay' padding='none' radius='full' className={nav.pillClass}>
            <PopoverTrigger aria-label={nav.disclosureLabel} className={nav.triggerClass}>
              {nav.current && (
                <>
                  <span>{nav.currentNumber}</span>
                  <span>{nav.current.label}</span>
                </>
              )}
              <Icon name='chevron-down' />
            </PopoverTrigger>
            {nav.next && (
              <a
                href={nav.next.href}
                aria-label={nav.nextLabel}
                className={nav.nextClass}
                onClick={nav.onNextClick}
                onAuxClick={nav.onNextAuxClick}
              >
                <Icon name='arrow-down' />
              </a>
            )}
            <ProgressBar value={nav.value} size='sm' edge={true} />
          </Surface>
          <PopoverContent label={nav.label} side='top' align='end' onCloseAutoFocus={nav.onCloseAutoFocus}>
            <ol className={nav.listClass}>
              {nav.rows.map((row) => (
                <li key={row.item.id}>
                  <a
                    href={row.item.href}
                    className={nav.linkClass}
                    aria-current={row.current}
                    onClick={row.onClick}
                    onAuxClick={row.onAuxClick}
                  >
                    <Pixel state={row.state} />
                    <span>{row.number}</span>
                    <span>{row.item.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </PopoverContent>
        </Popover>
      )}
    </nav>
  );
};
