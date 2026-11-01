import type { ToastProps, ToastUpdateOptions } from './types';

/** One queued or visible toast; the store owns identity and ordering only, never behavior. */
export type ToastRecord = { id: string; options: ToastProps };

type ToastState = { records: readonly ToastRecord[]; activeProviderId: string | null };

type ToastConfig = { mounted: boolean };

let state: ToastState = { records: [], activeProviderId: null };
let config: ToastConfig = { mounted: false };
const listeners = new Set<() => void>();
let counter = 0;

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function warnBeforeMount(id: string): void {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`useToast: no ToastProvider is mounted; toast "${id}" was ignored.`);
  }
}

/** Stable server snapshot: SSR never renders records; the viewport is client-only content. */
const serverState: ToastState = { records: [], activeProviderId: null };

export function getServerState(): ToastState {
  return serverState;
}

/**
 * Module singleton between the imperative hook and the single mounted provider. Records keep
 * raw call options; defaults resolve at render time so updates replace, never bake, values.
 * Radix owns timers, swipe, focus and announcements; the store only orders and removes.
 */
export const toastStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getState(): ToastState {
    return state;
  },

  getConfig(): ToastConfig {
    return config;
  },

  /** Last mounted provider wins; records render in one viewport only. */
  claimProvider(id: string): void {
    if (state.activeProviderId !== id) {
      state = { ...state, activeProviderId: id };
      emit();
    }
  },

  releaseProvider(id: string): void {
    if (state.activeProviderId === id) {
      state = { ...state, activeProviderId: null };
      emit();
    }
  },

  configure(partial: Partial<ToastConfig>): void {
    config = { ...config, ...partial };
  },

  /** Shows a toast, or updates in place when the caller id is already known. */
  show(options: ToastProps): string {
    const id = options.id ?? `eg-toast-${++counter}`;
    if (state.records.some((record) => record.id === id)) {
      return this.update(id, options);
    }
    if (!config.mounted) {
      warnBeforeMount(id);
      return id;
    }
    state = { ...state, records: [...state.records, { id, options: { ...options, id } as ToastProps }] };
    emit();
    return id;
  },

  /** Updates a known toast in place; unknown ids no-op so settled promises stay safe. */
  update(id: string, options: ToastUpdateOptions): string {
    const record = state.records.find((entry) => entry.id === id);
    if (!record) {
      return id;
    }
    const merged = { ...record.options, ...options, id } as ToastProps;
    state = { ...state, records: state.records.map((entry) => (entry.id === id ? { id, options: merged } : entry)) };
    emit();
    return id;
  },

  /** Removes one toast immediately; Radix reported the close, so no exit state is kept. */
  close(id: string): void {
    if (!state.records.some((record) => record.id === id)) {
      return;
    }
    state = { ...state, records: state.records.filter((record) => record.id !== id) };
    emit();
  },

  /** Removes every queued and visible toast. */
  clear(): void {
    if (state.records.length === 0) {
      return;
    }
    state = { ...state, records: [] };
    emit();
  }
};
