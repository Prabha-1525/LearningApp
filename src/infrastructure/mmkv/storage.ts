import {createMMKV, type MMKV} from 'react-native-mmkv';

import type {StoragePort} from '@core/domain';

/**
 * Decision: MMKV v4 via createMMKV() is the fastest on-device KV store for RN.
 * We wrap it behind StoragePort so Domain never imports MMKV directly.
 *
 * In Jest / non-native contexts we fall back to an in-memory Map so unit tests
 * do not require Nitro native modules.
 */
type MemoryRecord = Map<string, string | boolean | number>;

function createMemoryStorage(): StoragePort & {
  getNumber(key: string): number | undefined;
  setNumber(key: string, value: number): void;
} {
  const store: MemoryRecord = new Map();

  return {
    getString: key => {
      const value = store.get(key);
      return typeof value === 'string' ? value : undefined;
    },
    setString: (key, value) => {
      store.set(key, value);
    },
    getBoolean: key => {
      const value = store.get(key);
      return typeof value === 'boolean' ? value : undefined;
    },
    setBoolean: (key, value) => {
      store.set(key, value);
    },
    getNumber: key => {
      const value = store.get(key);
      return typeof value === 'number' ? value : undefined;
    },
    setNumber: (key, value) => {
      store.set(key, value);
    },
    delete: key => {
      store.delete(key);
    },
    clearAll: () => {
      store.clear();
    },
  };
}

function createNativeMmkv(): MMKV | null {
  try {
    return createMMKV({id: 'learning-app'});
  } catch {
    return null;
  }
}

const native = createNativeMmkv();

export const mmkvStorage: StoragePort & {
  getNumber(key: string): number | undefined;
  setNumber(key: string, value: number): void;
} = native
  ? {
      getString: key => native.getString(key),
      setString: (key, value) => {
        native.set(key, value);
      },
      getBoolean: key => native.getBoolean(key),
      setBoolean: (key, value) => {
        native.set(key, value);
      },
      getNumber: key => native.getNumber(key),
      setNumber: (key, value) => {
        native.set(key, value);
      },
      delete: key => {
        native.remove(key);
      },
      clearAll: () => {
        native.clearAll();
      },
    }
  : createMemoryStorage();

export function isUsingNativeMmkv(): boolean {
  return native != null;
}
