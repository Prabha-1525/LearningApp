import {err, ok, type Result} from '@shared/lib';
import type {
  ChildId,
  ChildProgressSnapshot,
  ModuleId,
  ModuleProgressEntry,
  ProgressRepository,
} from '@core/domain';

import {appConfig} from '@app/config';

/**
 * Firestore progress adapter (scaffold). Offline-friendly UI can keep writing
 * through this port once Firebase is enabled.
 */
export function createFirebaseProgressRepository(): ProgressRepository {
  return {
    async getSnapshot(
      childId: ChildId,
    ): Promise<Result<ChildProgressSnapshot>> {
      if (!appConfig.firebaseEnabled) {
        return ok({
          childId,
          entries: [],
          lastModuleId: null,
          syncedAt: null,
        });
      }
      try {
        const firestore = require('@react-native-firebase/firestore').default;
        const snap = await firestore()
          .collection('children')
          .doc(childId)
          .collection('progress')
          .get();

        const entries = snap.docs.map(
          (doc: {data: () => ModuleProgressEntry}) => doc.data(),
        ) as ModuleProgressEntry[];

        return ok({
          childId,
          entries,
          lastModuleId: entries[0]?.moduleId ?? null,
          syncedAt:
            new Date().toISOString() as ChildProgressSnapshot['syncedAt'],
        });
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('getSnapshot failed'),
        );
      }
    },

    async upsertEntry(entry: ModuleProgressEntry): Promise<Result<void>> {
      if (!appConfig.firebaseEnabled) {
        return ok(undefined);
      }
      try {
        const firestore = require('@react-native-firebase/firestore').default;
        const id = `${entry.moduleId}_${entry.lessonId ?? 'module'}`;
        await firestore()
          .collection('children')
          .doc(entry.childId)
          .collection('progress')
          .doc(id)
          .set(entry, {merge: true});
        return ok(undefined);
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('upsertEntry failed'),
        );
      }
    },

    async listByModule(
      childId: ChildId,
      moduleId: ModuleId,
    ): Promise<Result<readonly ModuleProgressEntry[]>> {
      if (!appConfig.firebaseEnabled) {
        return ok([]);
      }
      try {
        const firestore = require('@react-native-firebase/firestore').default;
        const snap = await firestore()
          .collection('children')
          .doc(childId)
          .collection('progress')
          .where('moduleId', '==', moduleId)
          .get();
        return ok(
          snap.docs.map((doc: {data: () => ModuleProgressEntry}) =>
            doc.data(),
          ) as ModuleProgressEntry[],
        );
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error('listByModule failed'),
        );
      }
    },
  };
}
