import type {Storage} from 'redux-persist';

import {StorageKeys} from '@shared/storage';

import {mmkvStorage} from '../mmkv/storage';

/**
 * Decision: Redux Persist uses MMKV instead of AsyncStorage for sync reads
 * and lower I/O latency — better cold-start for child sessions.
 */
export const reduxPersistStorage: Storage = {
  setItem: (key, value) => {
    mmkvStorage.setString(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = mmkvStorage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: key => {
    mmkvStorage.delete(key);
    return Promise.resolve();
  },
};

export const persistKey = StorageKeys.core.reduxPersistRoot;

export {mmkvStorage} from '../mmkv/storage';
