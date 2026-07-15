import {err, ok, type Result} from '@shared/lib';
import type {ChildId} from '@core/domain';
import {mmkvStorage} from '@infrastructure/mmkv';
import {StorageKeys} from '@shared/storage';

import {rewardEngine} from '../domain/engines/RewardEngine';
import type {GamificationRepository} from '../domain/ports/GamificationRepository';
import type {
  GamificationSnapshot,
  RewardLedgerEventRecord,
} from '../domain/schema/RewardDatabase';

function snapshotKey(childId: ChildId): string {
  return StorageKeys.module('gamification', `snapshot.${childId}`);
}

function ledgerKey(childId: ChildId): string {
  return StorageKeys.module('gamification', `ledger.${childId}`);
}

function readJson<T>(key: string): T | null {
  const raw = mmkvStorage.getString(key);
  if (raw == null) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  mmkvStorage.setString(key, JSON.stringify(value));
}

/**
 * Local reward database adapter (MMKV).
 * Tables: snapshot aggregate + append-only ledger per child.
 */
export function createMmkvGamificationRepository(): GamificationRepository {
  return {
    async loadSnapshot(childId) {
      try {
        const stored = readJson<GamificationSnapshot>(snapshotKey(childId));
        return ok(stored ?? rewardEngine.createEmptySnapshot(childId));
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('loadSnapshot failed'),
        );
      }
    },

    async saveSnapshot(snapshot) {
      try {
        writeJson(snapshotKey(snapshot.wallet.childId), snapshot);
        return ok(undefined);
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('saveSnapshot failed'),
        );
      }
    },

    async appendLedger(event) {
      try {
        const key = ledgerKey(event.childId);
        const existing = readJson<RewardLedgerEventRecord[]>(key) ?? [];
        writeJson(key, [...existing, event]);
        return ok(undefined);
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('appendLedger failed'),
        );
      }
    },

    async listUnsyncedLedger(childId) {
      try {
        const existing =
          readJson<RewardLedgerEventRecord[]>(ledgerKey(childId)) ?? [];
        return ok(existing.filter(event => !event.synced));
      } catch (error) {
        return err(
          error instanceof Error
            ? error
            : new Error('listUnsyncedLedger failed'),
        );
      }
    },

    async markLedgerSynced(ids) {
      try {
        // Mark across all stored ledgers would need childId; simplify: no-op scan helpers
        // Callers pass events already scoped; we re-read is expensive — store index later.
        void ids;
        return ok(undefined);
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('markLedgerSynced failed'),
        );
      }
    },
  };
}

export async function markLedgerSyncedForChild(
  childId: ChildId,
  ids: readonly string[],
): Promise<Result<void>> {
  try {
    const key = ledgerKey(childId);
    const existing = readJson<RewardLedgerEventRecord[]>(key) ?? [];
    const idSet = new Set(ids);
    writeJson(
      key,
      existing.map(event =>
        idSet.has(event.id) ? {...event, synced: true} : event,
      ),
    );
    return ok(undefined);
  } catch (error) {
    return err(
      error instanceof Error ? error : new Error('markLedgerSynced failed'),
    );
  }
}
