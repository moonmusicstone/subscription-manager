import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Subscription, SubscriptionPeriod, SubscriptionStatus } from '../types';

dayjs.extend(isBetween);

export const calculateNextBillingDate = (
  startDate: string,
  period: SubscriptionPeriod,
  customDays?: number
): string => {
  const start = dayjs(startDate);
  
  switch (period) {
    case 'daily':
      return start.add(1, 'day').format('YYYY-MM-DD');
    case 'weekly':
      return start.add(1, 'week').format('YYYY-MM-DD');
    case 'monthly':
      return start.add(1, 'month').format('YYYY-MM-DD');
    case 'quarterly':
      return start.add(3, 'months').format('YYYY-MM-DD');
    case 'yearly':
      return start.add(1, 'year').format('YYYY-MM-DD');
    case 'custom':
      return start.add(customDays || 30, 'day').format('YYYY-MM-DD');
    default:
      return start.add(1, 'month').format('YYYY-MM-DD');
  }
};

export const calculateSubscriptionStatus = (nextBillingDate: string): SubscriptionStatus => {
  const today = dayjs();
  const nextBilling = dayjs(nextBillingDate);
  const daysUntilBilling = nextBilling.diff(today, 'day');
  
  if (daysUntilBilling <= 7) {
    return 'expiring';
  }
  
  return 'active';
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(amount);
};

export const getPeriodDisplayName = (
  period: SubscriptionPeriod,
  customDays?: number
): string => {
  const periodNames = {
    daily: '日',
    weekly: '周',
    monthly: '月',
    quarterly: '季',
    yearly: '年',
    custom: `自定义 (${customDays}天)`,
  };
  return periodNames[period];
};

export const getStatusColor = (status: SubscriptionStatus): string => {
  const statusColors = {
    active: '#10B981',
    cancelled: '#EF4444',
    expiring: '#F59E0B',
  };
  return statusColors[status];
};

export const getStatusDisplayName = (status: SubscriptionStatus): string => {
  const statusNames = {
    active: '活跃',
    cancelled: '已取消',
    expiring: '即将到期',
  };
  return statusNames[status];
};

export const filterSubscriptionsByDateRange = (
  subscriptions: Subscription[],
  startDate: string,
  endDate: string
): Subscription[] => {
  return subscriptions.filter(subscription => {
    const nextBilling = dayjs(subscription.nextBillingDate);
    return nextBilling.isBetween(startDate, endDate, 'day', '[]');
  });
};

export const getExpiringSubscriptions = (
  subscriptions: Subscription[],
  daysAhead: number = 30
): Subscription[] => {
  const today = dayjs();
  return subscriptions
    .filter(subscription => {
      const nextBilling = dayjs(subscription.nextBillingDate);
      const daysUntilBilling = nextBilling.diff(today, 'day');
      return daysUntilBilling <= daysAhead && daysUntilBilling >= 0 && subscription.status !== 'cancelled';
    })
    .sort((a, b) => dayjs(a.nextBillingDate).diff(dayjs(b.nextBillingDate)));
};