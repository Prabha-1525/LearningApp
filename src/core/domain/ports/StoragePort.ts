import type {Result} from '@shared/lib';

/**
 * Port: key-value storage (MMKV adapter in infrastructure).
 */
export type StoragePort = {
  getString(key: string): string | undefined;
  setString(key: string, value: string): void;
  getBoolean(key: string): boolean | undefined;
  setBoolean(key: string, value: boolean): void;
  delete(key: string): void;
  clearAll(): void;
};

export type JsonStoragePort = {
  getJson<T>(key: string): Result<T | null>;
  setJson<T>(key: string, value: T): Result<void>;
};
