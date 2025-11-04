import React from 'react';
import { Card, Row, Col, Button, Space, DatePicker } from 'antd';
import { DownloadOutlined, BarChartOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useAppSelector } from '../../hooks/redux';
import { Subscription } from '../../types';
import { formatCurrency } from '../../utils/subscription';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const DataAnalysis: React.FC = () => {
  const subscriptions = useAppSelector(state => state.subscriptions.items);
  const [dateRange, setDateRange] = React.useState<[string, string]>([
    dayjs().subtract(6, 'months').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]);
  const costTrendRef = React.useRef<any>(null);
  const platformCostRef = React.useRef<any>(null);

  const monthlyTrendData = React.useMemo(() => {
    const monthlyMap = new Map<string, { cost: number; count: number }>();
    
    subscriptions.forEach((subscription: Subscription) => {
      const startDate = dayjs(subscription.startDate);
      const endDate = dayjs(dateRange[1]);
      let currentDate = startDate;
      
      while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'month')) {
        const monthKey = currentDate.format('YYYY-MM');
        const existing = monthlyMap.get(monthKey) || { cost: 0, count: 0 };
        
        existing.cost += subscription.cost;
        existing.count += 1;
        monthlyMap.set(monthKey, existing);
        
        currentDate = currentDate.add(1, 'month');
      }
    });
    
    const months = [];
    let currentMonth = dayjs(dateRange[0]);
    const endMonth = dayjs(dateRange[1]);
    
    while (currentMonth.isBefore(endMonth) || currentMonth.isSame(endMonth, 'month')) {
      const monthKey = currentMonth.format('YYYY-MM');
      const data = monthlyMap.get(monthKey) || { cost: 0, count: 0 };
      
      months.push({
        month: currentMonth.format('MM月'),
        totalCost: data.cost,
        subscriptionCount: data.count,
      });
      
      currentMonth = currentMonth.add(1, 'month');
    }
    
    return months;
  }, [subscriptions, dateRange]);

  const platformStats = React.useMemo(() => {
    const platformMap = new Map<string, { cost: number; count: number }>();
    
    subscriptions.forEach((subscription: Subscription) => {
      const existing = platformMap.get(subscription.platform) || { cost: 0, count: 0 };
      existing.cost += subscription.cost;
      existing.count += 1;
      platformMap.set(subscription.platform, existing);
    });
    
    return Array.from(platformMap.entries()).map(([platform, data]) => ({
      platform,
      totalCost: data.cost,
      count: data.count,
    }));
  }, [subscriptions]);

  const costTrendOption = {
    title: {
      text: '费用趋势',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        const data = params[0];
        return `${data.name}<br/>费用: ${formatCurrency(data.value)}<br/>数量: ${monthlyTrendData[data.dataIndex]?.subscriptionCount || 0}个`;
      },
    },
    xAxis: {
      type: 'category',
      data: monthlyTrendData.map(item => item.month),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `¥${value}`,
      },
    },
    series: [
      {
        name: '费用',
        type: 'line',
        data: monthlyTrendData.map(item => item.totalCost),
        smooth: true,
        itemStyle: {
          color: '#3B82F6',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.1)' },
            ],
          },
        },
      },
    ],
  };

  const platformCostOption = {
    title: {
      text: '平台费用对比',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (params: any) {
        const data = params[0];
        return `${data.name}<br/>费用: ${formatCurrency(data.value)}<br/>数量: ${platformStats[data.dataIndex]?.count || 0}个`;
      },
    },
    xAxis: {
      type: 'category',
      data: platformStats.map(item => item.platform),
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `¥${value}`,
      },
    },
    series: [
      {
        name: '费用',
        type: 'bar',
        data: platformStats.map(item => item.totalCost),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#3B82F6' },
              { offset: 1, color: '#1D4ED8' },
            ],
          },
        },
      },
    ],
  };

  const handleExportChart = (chartId: string, filename: string) => {
    const ref = chartId === 'cost-trend-chart' ? costTrendRef : platformCostRef;
    if (ref.current && ref.current.getEchartsInstance) {
      const url = ref.current.getEchartsInstance().getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff',
      });
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
    }
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setDateRange([
        dates[0].format('YYYY-MM-DD'),
        dates[1].format('YYYY-MM-DD'),
      ]);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '24px' }}>
          <Col>
            <BarChartOutlined style={{ fontSize: '24px', color: '#3B82F6' }} />
          </Col>
          <Col flex="auto">
            <h2 style={{ margin: 0 }}>数据分析</h2>
          </Col>
          <Col>
            <Space>
              <RangePicker
                value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
              />
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleExportChart('cost-trend-chart', '费用趋势图.png')}
              >
                导出趋势图
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleExportChart('platform-cost-chart', '平台费用对比图.png')}
              >
                导出对比图
              </Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="费用趋势" size="small">
              <ReactECharts
                ref={costTrendRef}
                option={costTrendOption}
                style={{ height: '300px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="平台费用对比" size="small">
              <ReactECharts
                ref={platformCostRef}
                option={platformCostOption}
                style={{ height: '300px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={24}>
            <Card title="统计摘要" size="small">
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6' }}>
                      {formatCurrency(subscriptions.reduce((sum, s) => sum + s.cost, 0))}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>总费用</div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}>
                      {subscriptions.length}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>总订阅数</div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B' }}>
                      {platformStats.length}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>平台数量</div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#EF4444' }}>
                      {formatCurrency(monthlyTrendData.reduce((sum, item) => sum + item.totalCost, 0) / monthlyTrendData.length)}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>月均费用</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DataAnalysis;