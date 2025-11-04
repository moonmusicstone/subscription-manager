import React from 'react';
import { Card, List, Tag, Empty, Button } from 'antd';
import { CalendarOutlined, BellOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../hooks/redux';
import { Subscription } from '../../types';
import { getExpiringSubscriptions, formatCurrency, getStatusColor } from '../../utils/subscription';
import dayjs from 'dayjs';

const ExpiringSoonList: React.FC = () => {
  const subscriptions = useAppSelector(state => state.subscriptions.items);
  
  const expiringSubscriptions = React.useMemo(() => {
    return getExpiringSubscriptions(subscriptions, 30).slice(0, 5);
  }, [subscriptions]);

  const formatDaysUntil = (date: string): string => {
    const days = dayjs(date).diff(dayjs(), 'day');
    if (days === 0) return '今天';
    if (days === 1) return '明天';
    return `${days}天后`;
  };

  return (
    <Card
      title={
        <span>
          <BellOutlined style={{ marginRight: 8, color: '#F59E0B' }} />
          即将到期提醒
        </span>
      }
      style={{ height: '100%' }}
    >
      {expiringSubscriptions.length > 0 ? (
        <List
          dataSource={expiringSubscriptions}
          renderItem={(subscription: Subscription) => (
            <List.Item
              actions={[
                <Tag color={getStatusColor(subscription.status)}>
                  {formatDaysUntil(subscription.nextBillingDate)}
                </Tag>
              ]}
            >
              <List.Item.Meta
                title={subscription.name}
                description={
                  <div>
                    <div>{subscription.platform}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      {formatCurrency(subscription.cost)} · {subscription.nextBillingDate}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty
          description="暂无即将到期的订阅"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
};

export default ExpiringSoonList;