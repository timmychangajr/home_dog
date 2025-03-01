import { configureStore } from '@reduxjs/toolkit';
import userReducer, { UserState } from './userSlice';
import toastReducer from './toastSlice';
import favoritesReducer from './favoritesSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { ToastProps } from '../components/ToastProvider';
import { Dog } from '../services';
import { combineReducers } from 'redux';

export interface RootState {
  user: UserState;
  toast: {
		queue: ToastProps[]
  },
  favorites: {
    favorites: Dog[]
  }
}

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'favorites', 'toast']
};

const rootReducer = {
  user: userReducer,
  toast: toastReducer,
  favorites: favoritesReducer,
};

const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export default store;