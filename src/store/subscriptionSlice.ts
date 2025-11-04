import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subscription, SubscriptionFilters, SubscriptionStatus, SubscriptionPeriod } from '../types/subscription';

interface SubscriptionState {
  items: Subscription[];
  loading: boolean;
  error: string | null;
  filters: SubscriptionFilters;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  selectedIds: string[];
}

const initialState: SubscriptionState = {
  items: [],
  loading: false,
  error: null,
  filters: {},
  pagination: {
    current: 1,
    pageSize: 20,
    total: 0,
  },
  selectedIds: [],
};

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    setSubscriptions: (state, action: PayloadAction<Subscription[]>) => {
      state.items = action.payload;
      state.pagination.total = action.payload.length;
    },
    addSubscription: (state, action: PayloadAction<Subscription>) => {
      state.items.push(action.payload);
      state.pagination.total += 1;
    },
    updateSubscription: (state, action: PayloadAction<Subscription>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteSubscription: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.pagination.total -= 1;
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
    },
    deleteMultipleSubscriptions: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter(item => !action.payload.includes(item.id));
      state.pagination.total -= action.payload.length;
      state.selectedIds = state.selectedIds.filter(id => !action.payload.includes(id));
    },
    setFilters: (state, action: PayloadAction<SubscriptionFilters>) => {
      state.filters = action.payload;
      state.pagination.current = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.current = 1;
    },
    setPagination: (state, action: PayloadAction<{ current: number; pageSize: number }>) => {
      state.pagination.current = action.payload.current;
      state.pagination.pageSize = action.payload.pageSize;
    },
    setSelectedIds: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateSubscriptionStatus: (state, action: PayloadAction<{ id: string; status: SubscriptionStatus }>) => {
      const subscription = state.items.find(item => item.id === action.payload.id);
      if (subscription) {
        subscription.status = action.payload.status;
        subscription.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  setSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
  deleteMultipleSubscriptions,
  setFilters,
  clearFilters,
  setPagination,
  setSelectedIds,
  setLoading,
  setError,
  updateSubscriptionStatus,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;