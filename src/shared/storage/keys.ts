/**
 * Central MMKV / persist key catalog.
 * Features prefix keys with their module id — never collide with core.
 */
export const StorageKeys = {
  core: {
    activeChildId: 'core.activeChildId',
    onboardingComplete: 'core.onboardingComplete',
    settings: 'core.settings',
    reduxPersistRoot: 'persist:root',
  },
  module: (moduleId: string, key: string) => `module.${moduleId}.${key}`,
} as const;

export type CoreStorageKey =
  (typeof StorageKeys.core)[keyof typeof StorageKeys.core];
