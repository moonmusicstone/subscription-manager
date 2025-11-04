import React from 'react';
import { Card, Row, Col, Statistic, Tag } from 'antd';
import { DollarOutlined, CalendarOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../hooks/redux';
import { Subscription, SubscriptionStatus } from '../../types';
import { formatCurrency, getStatusColor } from '../../utils/subscription';

const MetricsCards: React.FC = () => {
  const subscriptions = useAppSelector(state => state.subscriptions.items);
  
  const stats = React.useMemo(() => {
    const active = subscriptions.filter((s: Subscription) => s.status === 'active').length;
    const cancelled = subscriptions.filter((s: Subscription) => s.status === 'cancelled').length;
    const expiring = subscriptions.filter((s: Subscription) => s.status === 'expiring').length;
    const totalCost = subscriptions.reduce((sum: number, s: Subscription) => sum + s.cost, 0);
    const monthlyAverage = totalCost / 12;
    
    return {
      total: subscriptions.length,
      active,
      cancelled,
      expiring,
      totalCost,
      monthlyAverage,
    };
  }, [subscriptions]);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable>
          <Statistic
            title="总订阅数"
            value={stats.total}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: '#3B82F6' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable>
          <Statistic
            title="活跃订阅"
            value={stats.active}
            prefix={<CheckCircleOutlined style={{ color: '#10B981' }} />}
            valueStyle={{ color: '#10B981' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable>
          <Statistic
            title="月均费用"
            value={stats.monthlyAverage}
            precision={2}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#F59E0B' }}
            formatter={(value) => formatCurrency(Number(value))}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable>
          <Statistic
            title="即将到期"
            value={stats.expiring}
            prefix={<ExclamationCircleOutlined style={{ color: '#EF4444' }} />}
            valueStyle={{ color: '#EF4444' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default MetricsCards;