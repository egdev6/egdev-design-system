import { type KeyboardEvent, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CommandPaletteItem, CommandPaletteProps } from './types';

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function useCommandPalette(props: CommandPaletteProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(props.defaultOpen ?? false);
  const open = props.open ?? uncontrolledOpen;
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const id = useId();
  const listId = `${id}-list`;
  const optionId = (item: CommandPaletteItem) => `${id}-option-${encodeURIComponent(item.id)}`;
  const wasOpen = useRef(false);
  const items = useMemo(() => {
    const seen = new Set<string>();
    return props.items.filter((item) => {
      if (seen.has(item.id)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`CommandPalette: duplicate id "${item.id}"`);
        }
        return false;
      }
      seen.add(item.id);
      return true;
    });
  }, [props.items]);
  const results = useMemo(() => {
    const search = normalize(query.trim());
    if (props.filtering === 'none' || !search) {
      return items;
    }
    return items.filter((item) =>
      [item.label, item.category ?? '', ...(item.keywords ?? [])].some((part) => normalize(part).includes(search))
    );
  }, [items, props.filtering, query]);
  const previousQuery = useRef(query);
  useLayoutEffect(() => {
    if (open && !wasOpen.current) {
      setQuery('');
      setHighlight(items.find((item) => !item.disabled)?.id ?? '');
    }
    wasOpen.current = open;
  }, [open, items]);
  useLayoutEffect(() => {
    const queryChanged = previousQuery.current !== query;
    previousQuery.current = query;
    setHighlight((current) =>
      !queryChanged && results.some((item) => item.id === current && !item.disabled)
        ? current
        : (results.find((item) => !item.disabled)?.id ?? '')
    );
  }, [query, results]);
  const active = results.find((item) => item.id === highlight && !item.disabled);
  useEffect(() => {
    if (open && active) {
      document.getElementById(optionId(active))?.scrollIntoView?.({ block: 'nearest' });
    }
  }, [open, active, id]);
  const changeOpen = (next: boolean) => {
    if (props.open === undefined) {
      setUncontrolledOpen(next);
    }
    props.onOpenChange?.(next);
  };
  const changeQuery = (next: string) => {
    setQuery(next);
    props.onQueryChange?.(next);
  };
  const select = (item: CommandPaletteItem) => {
    if (item.disabled) {
      return;
    }
    item.onSelect();
    changeOpen(false);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) {
      return;
    }
    const enabled = results.filter((item) => !item.disabled);
    const index = enabled.findIndex((item) => item.id === highlight);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = enabled[(index + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length];
      if (next) {
        setHighlight(next.id);
      }
    } else if (!query && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault();
      const next = enabled[event.key === 'Home' ? 0 : enabled.length - 1];
      if (next) {
        setHighlight(next.id);
      }
    } else if (event.key === 'Enter' && active) {
      event.preventDefault();
      select(active);
    }
  };
  return {
    open,
    query,
    highlight,
    setHighlight,
    inputRef,
    previousFocus,
    results,
    active,
    listId,
    optionId,
    changeOpen,
    changeQuery,
    select,
    onKeyDown
  };
}
