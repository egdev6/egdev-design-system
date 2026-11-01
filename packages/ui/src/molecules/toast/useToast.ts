import type { IconName } from '../../atoms/icon';
import { toastStore } from './toastStore';
import type { ToastApi, ToastCallOptions, ToastPromiseMessages, ToastProps, ToastTone } from './types';

function showTone(tone: ToastTone, title: string, options?: ToastCallOptions): string {
  return toastStore.show({ tone, title, ...options } as ToastProps);
}

function resolveMessage<T>(message: string | ((value: T) => string), value: T): string {
  return typeof message === 'function' ? message(value) : message;
}

/** Stable imperative object; safe outside React effects once the provider has mounted. */
const toastApi: ToastApi = {
  show: (options) => toastStore.show(options),
  update: (id, options) => toastStore.update(id, options),
  close: (id) => toastStore.close(id),
  clear: () => toastStore.clear(),
  info: (title, options) => showTone('info', title, options),
  success: (title, options) => showTone('success', title, options),
  warning: (title, options) => showTone('warning', title, options),
  error: (title, options) => showTone('danger', title, options),
  loading: (title, options) => showTone('loading', title, options),
  promise: <T>(promise: Promise<T>, messages: ToastPromiseMessages<T>): Promise<T> => {
    const id = toastStore.show({ tone: 'loading', title: messages.loading });
    return promise.then(
      (value) => {
        if (messages.success !== undefined) {
          toastStore.update(id, { tone: 'success', title: resolveMessage(messages.success, value) });
        } else {
          toastStore.close(id);
        }
        return value;
      },
      (reason: unknown) => {
        if (messages.error !== undefined) {
          toastStore.update(id, { tone: 'danger', title: resolveMessage(messages.error, reason) });
        } else {
          toastStore.close(id);
        }
        throw reason;
      }
    );
  }
};

/** Returns the stable imperative surface; calls before provider mount warn and no-op. */
export function useToast(): ToastApi {
  return toastApi;
}

/** Decorative glyph per tone; loading renders a Spinner instead of a system Icon. */
export function toastIconName(tone: ToastTone): IconName {
  return tone === 'success' ? 'check' : tone === 'warning' || tone === 'danger' ? 'alert' : 'bell';
}
