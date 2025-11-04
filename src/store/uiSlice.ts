import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subscription } from '../types';

interface UIState {
  modalVisible: boolean;
  editingSubscription: Subscription | null;
  dashboardDateRange: '6months' | '12months';
}

const initialState: UIState = {
  modalVisible: false,
  editingSubscription: null,
  dashboardDateRange: '6months',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setModalVisible: (state, action: PayloadAction<boolean>) => {
      state.modalVisible = action.payload;
    },
    setEditingSubscription: (state, action: PayloadAction<Subscription | null>) => {
      state.editingSubscription = action.payload;
    },
    setDashboardDateRange: (state, action: PayloadAction<'6months' | '12months'>) => {
      state.dashboardDateRange = action.payload;
    },
  },
});

export const { setModalVisible, setEditingSubscription, setDashboardDateRange } = uiSlice.actions;

export default uiSlice.reducer;