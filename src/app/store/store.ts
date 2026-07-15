import {persistKey, reduxPersistStorage} from '@infrastructure/persistence';
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';

import {
  profileReducer,
  sessionReducer,
  settingsReducer,
  gamificationReducer,
} from '@core/store';

/**
 * Decision: whitelist only durable client state.
 * Never persist ephemeral UI or TanStack Query caches into Redux Persist.
 */
export const rootReducer = combineReducers({
  session: sessionReducer,
  profile: profileReducer,
  settings: settingsReducer,
  gamification: gamificationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: 'root',
  storage: reduxPersistStorage,
  whitelist: ['session', 'profile', 'settings', 'gamification'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function createAppStore() {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: __DEV__,
  });

  const persistor = persistStore(store);
  return {store, persistor};
}

export type AppStore = ReturnType<typeof createAppStore>['store'];
export type AppDispatch = AppStore['dispatch'];

/** Exposed for diagnostics; matches StorageKeys.core.reduxPersistRoot conceptually. */
export const reduxPersistDebugKey = persistKey;
