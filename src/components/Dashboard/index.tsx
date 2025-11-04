import React from 'react';
import { Row, Col } from 'antd';
import MetricsCards from './MetricsCards';
import ExpiringSoonList from './ExpiringSoonList';
import PlatformDistribution from './PlatformDistribution';

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <MetricsCards />
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={8}>
          <ExpiringSoonList />
        </Col>
        <Col xs={24} lg={16}>
          <PlatformDistribution />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;