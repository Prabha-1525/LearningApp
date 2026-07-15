import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

import type {ChildId} from '@core/domain';

import {rewardEngine} from '../domain/engines/RewardEngine';
import type {CelebrationEvent} from '../domain/entities/RewardGrant';
import type {GamificationSnapshot} from '../domain/schema/RewardDatabase';
import {levelProgressRatio} from '../domain/policies/levelCurve';

export type GamificationState = {
  readonly activeChildId: ChildId | null;
  readonly snapshot: GamificationSnapshot | null;
  readonly pendingCelebrations: CelebrationEvent[];
  readonly lastGrantAt: string | null;
};

const initialState: GamificationState = {
  activeChildId: null,
  snapshot: null,
  pendingCelebrations: [],
  lastGrantAt: null,
};

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    hydrateGamification(
      state,
      action: PayloadAction<{
        childId: ChildId;
        snapshot: GamificationSnapshot;
      }>,
    ) {
      state.activeChildId = action.payload.childId;
      state.snapshot = action.payload.snapshot as GamificationSnapshot;
    },
    ensureGamificationChild(state, action: PayloadAction<ChildId>) {
      if (state.activeChildId === action.payload && state.snapshot != null) {
        return;
      }
      state.activeChildId = action.payload;
      state.snapshot = rewardEngine.createEmptySnapshot(
        action.payload,
      ) as GamificationSnapshot;
    },
    applyGrantResult(
      state,
      action: PayloadAction<{
        snapshot: GamificationSnapshot;
        celebrations: readonly CelebrationEvent[];
      }>,
    ) {
      state.snapshot = action.payload.snapshot as GamificationSnapshot;
      state.pendingCelebrations = [
        ...state.pendingCelebrations,
        ...action.payload.celebrations,
      ];
      state.lastGrantAt = new Date().toISOString();
    },
    shiftCelebration(state) {
      state.pendingCelebrations = state.pendingCelebrations.slice(1);
    },
    clearCelebrations(state) {
      state.pendingCelebrations = [];
    },
  },
});

export const {
  hydrateGamification,
  ensureGamificationChild,
  applyGrantResult,
  shiftCelebration,
  clearCelebrations,
} = gamificationSlice.actions;

export const gamificationReducer = gamificationSlice.reducer;

export function selectXpProgress(
  snapshot: GamificationSnapshot | null,
): number {
  if (snapshot == null) {
    return 0;
  }
  return levelProgressRatio(snapshot.xp.xpIntoLevel, snapshot.xp.xpToNextLevel);
}
