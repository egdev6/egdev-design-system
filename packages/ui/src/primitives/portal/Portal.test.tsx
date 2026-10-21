import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { act, createContext, createRef, useContext } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Portal } from './Portal';
import { usePortal } from './usePortal';

const Message = createContext('outside');
function ContextMessage() {
  return <button type='button'>{useContext(Message)}</button>;
}

describe('Portal public contract', () => {
  it.each([undefined, null])('mounts into body for container %s and removes its div on unmount', (container) => {
    const view = render(<Portal container={container}>Layer content</Portal>);
    const root = screen.getByText('Layer content');
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('eg-portal');
    expect(root.parentElement).toBe(document.body);
    expect(view.container).toBeEmptyDOMElement();
    view.unmount();
    expect(root).not.toBeInTheDocument();
  });

  it.each(['element', 'fragment'] as const)('mounts into a ready %s', (kind) => {
    const container = kind === 'element' ? document.createElement('section') : document.createDocumentFragment();
    const view = render(<Portal container={container}>Custom layer</Portal>);
    const root = container.querySelector('.eg-portal');
    expect(root?.textContent).toBe('Custom layer');
    expect(root?.parentNode).toBe(container);
    view.unmount();
    expect(container.childNodes).toHaveLength(0);
  });

  it('preserves React context and React-tree event bubbling', () => {
    const onClick = vi.fn();
    render(
      <Message.Provider value='Inside context'>
        <div onClick={onClick} role='presentation'>
          <Portal>
            <ContextMessage />
          </Portal>
        </div>
      </Message.Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Inside context' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('forwards the div ref, attributes and supported layout classes without adding paint or roles', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Portal ref={ref} className='contents' data-testid='layer' aria-label='Consumer layer'>
        Content
      </Portal>
    );
    expect(ref.current).toBe(screen.getByTestId('layer'));
    expect(ref.current).toHaveClass('eg-portal', 'contents');
    expect(ref.current).toHaveAttribute('aria-label', 'Consumer layer');
    expect(ref.current).not.toHaveAttribute('role');
    expect(ref.current).not.toHaveAttribute('style');
  });

  it('composes the marker before consumer classes and passes props through its hook', () => {
    const container = document.createElement('div');
    const { result } = renderHook(() =>
      usePortal({ children: 'Content', container, className: 'fixed absolute', title: 'Layer' })
    );
    expect(result.current).toMatchObject({
      children: 'Content',
      container,
      className: 'eg-portal absolute',
      title: 'Layer'
    });
  });

  it('hydrates default server output into body without mismatches', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    expect(renderToString(<Portal>Hydrated layer</Portal>)).toBe('');
    const onRecoverableError = vi.fn();
    const root = hydrateRoot(host, <Portal>Hydrated layer</Portal>, { onRecoverableError });
    await act(async () => Promise.resolve());
    expect(screen.getByText('Hydrated layer').parentElement).toBe(document.body);
    expect(onRecoverableError).not.toHaveBeenCalled();
    await act(async () => root.unmount());
    host.remove();
  });
});
