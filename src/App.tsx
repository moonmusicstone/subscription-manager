import React, { useEffect } from 'react';
import { Layout, Menu, Button, Space, Typography } from 'antd';
import {
  DashboardOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  PlusOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { setSubscriptions } from './store/subscriptionSlice';
import Dashboard from './components/Dashboard';
import SubscriptionList from './components/SubscriptionList';
import DataAnalysis from './components/DataAnalysis';
import SubscriptionForm from './components/SubscriptionForm';
import { setModalVisible } from './store/uiSlice';
import './App.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

type ViewType = 'dashboard' | 'list' | 'analysis';

function App() {
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = React.useState(false);
  const [currentView, setCurrentView] = React.useState<ViewType>('dashboard');
  const { modalVisible } = useAppSelector(state => state.ui);

  // Initialize with sample data
  useEffect(() => {
    const sampleData = [
      {
        id: '1',
        name: 'Netflix',
        platform: 'Netflix',
        cost: 28.0,
        period: 'monthly' as const,
        startDate: '2024-01-01',
        nextBillingDate: '2024-12-01',
        status: 'active' as const,
        notes: '家庭套餐',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Spotify',
        platform: 'Spotify',
        cost: 15.0,
        period: 'monthly' as const,
        startDate: '2024-02-01',
        nextBillingDate: '2024-11-28',
        status: 'expiring' as const,
        notes: '个人会员',
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z',
      },
      {
        id: '3',
        name: 'Adobe Creative',
        platform: 'Adobe',
        cost: 498.0,
        period: 'yearly' as const,
        startDate: '2024-03-01',
        nextBillingDate: '2025-03-01',
        status: 'active' as const,
        notes: '全家桶套餐',
        createdAt: '2024-03-01T00:00:00Z',
        updatedAt: '2024-03-01T00:00:00Z',
      },
    ];
    dispatch(setSubscriptions(sampleData));
  }, [dispatch]);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: 'list',
      icon: <UnorderedListOutlined />,
      label: '订阅列表',
    },
    {
      key: 'analysis',
      icon: <BarChartOutlined />,
      label: '数据分析',
    },
  ];

  const handleMenuClick = (key: string) => {
    setCurrentView(key as ViewType);
  };

  const handleAddSubscription = () => {
    dispatch(setModalVisible(true));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'list':
        return <SubscriptionList />;
      case 'analysis':
        return <DataAnalysis />;
      default:
        return <Dashboard />;
    }
  };

  const handleCancel = () => {
    dispatch(setModalVisible(false));
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Title level={collapsed ? 4 : 3} style={{ margin: 0, color: '#3B82F6' }}>
            {collapsed ? 'SM' : '订阅管理'}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentView]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          style={{ border: 'none' }}
        />
      </Sider>
      
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <UnorderedListOutlined /> : <DashboardOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ marginRight: '16px' }}
            />
            <Title level={4} style={{ margin: 0 }}>
              {menuItems.find(item => item.key === currentView)?.label}
            </Title>
          </div>
          
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddSubscription}
            >
              添加订阅
            </Button>
          </Space>
        </Header>
        
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#F9FAFB',
            borderRadius: '8px',
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
      
      <SubscriptionForm visible={modalVisible} onCancel={handleCancel} />
    </Layout>
  );
}

export default App;