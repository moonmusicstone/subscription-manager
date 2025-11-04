import { configureStore } from '@reduxjs/toolkit';
import subscriptionReducer from './subscriptionSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    subscriptions: subscriptionReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;