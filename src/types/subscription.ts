export type SubscriptionStatus = 'active' | 'cancelled' | 'expiring';
export type SubscriptionPeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

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

export interface SubscriptionFormData {
  name: string;
  platform: string;
  cost: number;
  period: SubscriptionPeriod;
  customDays?: number;
  startDate: string;
  notes?: string;
}

export interface SubscriptionFilters {
  status?: SubscriptionStatus;
  platform?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  searchText?: string;
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  monthlyAverageCost: number;
  yearlyTotalCost: number;
  activeSubscriptions: number;
  expiringSoonCount: number;
}

export interface PlatformStats {
  platform: string;
  count: number;
  totalCost: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  totalCost: number;
  subscriptionCount: number;
}

export interface ExpiringSubscription {
  subscription: Subscription;
  daysUntilExpiry: number;
}