import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

const OUTBOX_KEY = StorageKeys.module('sync', 'outbox');

export type SyncOutboxItem = {
  readonly id: string;
  readonly uid: string;
  readonly module: 'math' | 'chess' | 'english' | 'gamification' | 'general';
  readonly createdAt: string;
};

function readOutbox(): SyncOutboxItem[] {
  const raw = mmkvStorage.getString(OUTBOX_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as SyncOutboxItem[];
  } catch {
    return [];
  }
}

function writeOutbox(items: SyncOutboxItem[]): void {
  mmkvStorage.setString(OUTBOX_KEY, JSON.stringify(items));
}

export function enqueueSync(
  uid: string,
  module: SyncOutboxItem['module'],
): void {
  const items = readOutbox().filter(
    item => !(item.uid === uid && item.module === module),
  );
  items.push({
    id: `${uid}:${module}:${Date.now()}`,
    uid,
    module,
    createdAt: new Date().toISOString(),
  });
  writeOutbox(items);
}

export function listSyncOutbox(): readonly SyncOutboxItem[] {
  return readOutbox();
}

export function clearSyncOutboxFor(
  uid: string,
  module: SyncOutboxItem['module'],
): void {
  writeOutbox(
    readOutbox().filter(item => !(item.uid === uid && item.module === module)),
  );
}

export function clearAllSyncOutbox(): void {
  writeOutbox([]);
}
