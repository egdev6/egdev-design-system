import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { Kbd } from '../../atoms/kbd';
import { cn } from '../../lib/cn';
import { Surface } from '../../primitives/surface';
import { dialogScrimVariants } from '../dialog/types';
import {
  type CommandPaletteProps,
  paletteCategory,
  paletteField,
  paletteInput,
  paletteList,
  paletteMessage,
  paletteOverlay,
  palettePanel,
  paletteRow
} from './types';
import { useCommandPalette } from './useCommandPalette';

/** Modal command search; the consumer owns any global shortcut. */
export function CommandPalette(props: CommandPaletteProps) {
  const palette = useCommandPalette(props);
  const label = props.label ?? 'Search';
  const messages = {
    placeholder: 'Type a command or search…',
    empty: 'No results.',
    loading: 'Loading results…',
    count: (count: number) => (count === 1 ? '1 result' : `${count} results`),
    ...props.messages
  };
  const status = props.busy
    ? messages.loading
    : palette.results.length
      ? messages.count(palette.results.length)
      : messages.empty;
  return (
    <Dialog.Root open={palette.open} onOpenChange={palette.changeOpen}>
      {props.children && <Dialog.Trigger asChild={true}>{props.children}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className={cn(paletteOverlay(), dialogScrimVariants())}>
          <Dialog.Content
            asChild={true}
            aria-describedby={undefined}
            onOpenAutoFocus={(event) => {
              palette.previousFocus.current =
                document.activeElement instanceof HTMLElement ? document.activeElement : null;
              event.preventDefault();
              palette.inputRef.current?.focus();
            }}
            onCloseAutoFocus={(event) => {
              if (!props.children && palette.previousFocus.current) {
                event.preventDefault();
                palette.previousFocus.current.focus();
              }
            }}
          >
            <Surface tone='overlay' radius='xl' padding='none' className={cn(palettePanel(), props.className)}>
              <VisuallyHidden.Root asChild={true}>
                <Dialog.Title>{label}</Dialog.Title>
              </VisuallyHidden.Root>
              <div>
                <div className={cn(paletteField())}>
                  <Icon name='search' size='md' />
                  <input
                    ref={palette.inputRef}
                    role='combobox'
                    aria-label={label}
                    aria-expanded={true}
                    aria-controls={palette.listId}
                    aria-autocomplete='list'
                    aria-activedescendant={palette.active ? palette.optionId(palette.active) : undefined}
                    className={cn(paletteInput())}
                    value={palette.query}
                    onChange={(event) => palette.changeQuery(event.target.value)}
                    placeholder={messages.placeholder}
                    onKeyDown={palette.onKeyDown}
                  />
                  <Dialog.Close asChild={true}>
                    <IconButton
                      label={props.dismissLabel ?? 'Close'}
                      icon={<Icon name='close' />}
                      variant='ghost'
                      size='lg'
                    />
                  </Dialog.Close>
                  <span
                    aria-hidden='true'
                    className='absolute bottom-0 inset-x-3 h-0.5 bg-focus-ring opacity-0 group-focus-within:opacity-100'
                  />
                </div>
                <div
                  id={palette.listId}
                  role='listbox'
                  className={cn(paletteList())}
                  aria-label={label}
                  aria-busy={props.busy || undefined}
                >
                  {palette.results.map((item) => (
                    <div
                      key={item.id}
                      id={palette.optionId(item)}
                      role='option'
                      aria-selected={item.id === palette.active?.id}
                      aria-disabled={Boolean(item.disabled)}
                      data-selected={item.id === palette.active?.id}
                      data-disabled={Boolean(item.disabled)}
                      onPointerMove={() => {
                        if (!item.disabled) {
                          palette.setHighlight(item.id);
                        }
                      }}
                      onClick={() => palette.select(item)}
                      className={cn(paletteRow())}
                    >
                      {item.icon && <Icon name={item.icon} size='sm' />}
                      <span>{item.label}</span>
                      {item.category && (
                        <>
                          {' '}
                          <span className={cn(paletteCategory())}>{item.category}</span>
                        </>
                      )}
                      {item.shortcut?.trim() && (
                        <span aria-hidden='true'>
                          <Kbd>{item.shortcut}</Kbd>
                        </span>
                      )}
                    </div>
                  ))}
                  {props.busy ? (
                    <div className={cn(paletteMessage())}>{messages.loading}</div>
                  ) : palette.results.length === 0 ? (
                    <div className={cn(paletteMessage())}>{messages.empty}</div>
                  ) : null}
                </div>
                <VisuallyHidden.Root role='status' aria-live='polite'>
                  {status}
                </VisuallyHidden.Root>
              </div>
            </Surface>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
