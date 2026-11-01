import { cva } from 'class-variance-authority';
import type { ReactElement } from 'react';
import type { IconName } from '../../atoms/icon';

/** A single action in the palette. */
export type CommandPaletteItem = {
  id: string;
  label: string;
  onSelect: () => void;
  category?: string;
  keywords?: string[];
  icon?: IconName;
  shortcut?: string;
  disabled?: boolean;
};
export type CommandPaletteFiltering = 'builtin' | 'none';
export type CommandPaletteMessages = {
  placeholder: string;
  empty: string;
  loading: string;
  count: (count: number) => string;
};
/** Modal command search; className supports panel width and max-width only. */
export type CommandPaletteProps = {
  /** Ordered commands. @control false
   * @controlReason Command arrays are not serializable; see Default. */
  items: CommandPaletteItem[];
  /** Input and dialog name. @default Search
   * @control text */
  label?: string;
  /** Close button name. @default Close
   * @control text */
  dismissLabel?: string;
  /** Localized messages. @control false
   * @controlReason Message objects contain a callback; see Localized. */
  messages?: Partial<CommandPaletteMessages>;
  /** Filtering mode. @default builtin
   * @control select */
  filtering?: CommandPaletteFiltering;
  /** Results are loading. @default false
   * @control boolean */
  busy?: boolean;
  /** User query changes. @control false
   * @controlReason Callback is not serializable; see RemoteResults. */
  onQueryChange?: (query: string) => void;
  /** Controlled visibility. @control boolean */
  open?: boolean;
  /** Initial visibility. @default false
   * @control boolean */
  defaultOpen?: boolean;
  /** Requested visibility changes. @control false
   * @controlReason Callback is not serializable; see Controlled. */
  onOpenChange?: (open: boolean) => void;
  /** Optional focusable launcher. @control false
   * @controlReason ReactElement is not serializable; see WithSearchTrigger. */
  children?: ReactElement;
  /** Panel width and max-width only; appearance overrides are unsupported. @control text */
  className?: string;
};

export const paletteOverlay = cva('eg-palette fixed inset-0 flex items-start justify-center px-(--gutter) pt-[12vh]');
export const palettePanel = cva(
  'w-full max-w-150 p-2 text-fg-default motion-safe:transition-[opacity,transform] duration-(--duration-fast) ease-(--ease-out) motion-safe:data-[state=open]:starting:translate-y-1.5 data-[state=open]:starting:opacity-0 motion-reduce:transition-none'
);
export const paletteField = cva(
  'group relative flex items-center gap-2.5 px-3 py-1.5 border-b border-border-subtle text-fg-secondary'
);
export const paletteInput = cva(
  'h-11 min-w-0 flex-1 bg-transparent border-0 outline-none font-sans text-body-default text-fg-default placeholder:text-fg-muted'
);
export const paletteList = cva('max-h-[50vh] overflow-y-auto py-1.5');
export const paletteRow = cva(
  'flex items-center gap-3 p-3 rounded-md font-sans text-body-default data-[selected=true]:bg-action-primary-bg-default data-[selected=true]:outline-2 data-[selected=true]:-outline-offset-2 data-[selected=true]:outline-focus-inverse data-[disabled=true]:opacity-45'
);
export const paletteCategory = cva('font-display text-label-eyebrow uppercase text-fg-secondary');
export const paletteMessage = cva('p-3 text-body-default text-fg-muted');
