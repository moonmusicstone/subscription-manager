import { SubscriptionFilters } from "./subscription";

export interface AppState {
  subscriptions: SubscriptionState;
  ui: UIState;
}

export interface SubscriptionState {
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

export interface UIState {
  modalVisible: boolean;
  editingSubscription: Subscription | null;
  dashboardDateRange: '6months' | '12months';
}

export interface Subscription {
  id: string;
  name: string;
  platform: string;
  cost: number;
  period: SubscriptionPeriod;
  customDays?: number;
  startDate: string;
  nextBillingDate: string;
  status: SubscriptionStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus = 'active' | 'cancelled' | 'expiring';
export type SubscriptionPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';