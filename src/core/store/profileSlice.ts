import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

import type {ChildId, ChildProfile} from '@core/domain';

export type ProfileState = {
  readonly activeChildId: ChildId | null;
  readonly children: ChildProfile[];
};

const initialState: ProfileState = {
  activeChildId: null,
  children: [],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setChildren(state, action: PayloadAction<ChildProfile[]>) {
      state.children = action.payload;
    },
    setActiveChildId(state, action: PayloadAction<ChildId | null>) {
      state.activeChildId = action.payload;
    },
    upsertChild(state, action: PayloadAction<ChildProfile>) {
      const index = state.children.findIndex(
        child => child.id === action.payload.id,
      );
      if (index >= 0) {
        state.children[index] = action.payload;
      } else {
        state.children.push(action.payload);
      }
    },
  },
});

export const {setChildren, setActiveChildId, upsertChild} =
  profileSlice.actions;
export const profileReducer = profileSlice.reducer;
