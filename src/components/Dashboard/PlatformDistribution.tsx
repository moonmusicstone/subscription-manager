import React from 'react';
import { Card, Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useAppSelector } from '../../hooks/redux';
import { PlatformStats, Subscription } from '../../types/subscription';

const PlatformDistribution: React.FC = () => {
  const subscriptions = useAppSelector(state => state.subscriptions.items);
  
  const platformData = React.useMemo(() => {
    const platformMap = new Map<string, number>();
    
    subscriptions.forEach((subscription: Subscription) => {
      const current = platformMap.get(subscription.platform) || 0;
      platformMap.set(subscription.platform, current + 1);
    });
    
    const total = subscriptions.length;
    const data: PlatformStats[] = [];
    
    platformMap.forEach((count, platform) => {
      data.push({
        platform,
        count,
        percentage: Math.round((count / total) * 100),
        totalCost: subscriptions
          .filter((s: Subscription) => s.platform === platform)
          .reduce((sum: number, s: Subscription) => sum + s.cost, 0),
      });
    });
    
    return data.sort((a, b) => b.count - a.count);
  }, [subscriptions]);

  const chartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '平台分布',
        type: 'pie',
        radius: '50%',
        data: platformData.map(item => ({
          name: item.platform,
          value: item.count,
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
  };

  return (
    <Card title="平台分布" style={{ height: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <ReactECharts
            option={chartOptions}
            style={{ height: '300px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </Col>
        <Col xs={24} lg={12}>
          <div style={{ padding: '20px' }}>
            {platformData.map((item, index) => (
              <div key={item.platform} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 500 }}>{item.platform}</span>
                  <span style={{ color: '#666' }}>{item.count}个</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' }}>
                  <span>{item.percentage}%</span>
                  <span>¥{item.totalCost.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default PlatformDistribution;