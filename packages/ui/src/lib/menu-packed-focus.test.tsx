import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../atoms/button';
import { Menu } from '../molecules/menu';

const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 30));

/** The packed CSR harness uses raw DOM events and createRoot, without userEvent's timer turns. */
describe('Menu packed-harness focus timing', () => {
  it('restores the composed trigger focus after selection commits', async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    const host = document.createElement('div');
    document.body.append(host);
    const root = createRoot(host);
    const select = vi.fn();
    try {
      await act(async () =>
        root.render(
          <Menu items={[{ id: 'edit', label: 'Edit', onSelect: select }]}>
            <Button>Menu actions</Button>
          </Menu>
        )
      );
      const trigger = host.querySelector('button');
      if (!trigger) {
        throw new Error('Missing Menu trigger');
      }
      trigger.focus();
      await act(async () => {
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        await settle();
      });
      const item = document.querySelector<HTMLElement>('[role="menuitem"]');
      if (!item) {
        throw new Error('Missing Menu item');
      }
      expect(document.activeElement).toBe(item);
      // Hold Radix's unmount-autofocus timeout to expose the packed harness's race deterministically.
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      await act(async () => {
        item.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
      });
      expect(select).toHaveBeenCalledOnce();
      expect(document.querySelector('[role="menu"]')).toBeNull();
      expect(document.activeElement).toBe(document.body);
      // Only advance the timer after the selecting act has committed the unmount.
      await act(async () => vi.runOnlyPendingTimersAsync());
      expect(document.activeElement).toBe(trigger);
    } finally {
      await act(async () => vi.runOnlyPendingTimersAsync());
      vi.useRealTimers();
      await act(async () => root.unmount());
      host.remove();
      await settle();
      vi.unstubAllGlobals();
    }
  });
});
