import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

import type {ParentAccount} from '@core/domain';

export type SessionState = {
  readonly parent: ParentAccount | null;
  readonly accessToken: string | null;
  readonly isAuthenticated: boolean;
};

const initialState: SessionState = {
  parent: null,
  accessToken: null,
  isAuthenticated: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession(
      state,
      action: PayloadAction<{parent: ParentAccount; accessToken: string}>,
    ) {
      state.parent = action.payload.parent;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    clearSession(state) {
      state.parent = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const {setSession, clearSession} = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
