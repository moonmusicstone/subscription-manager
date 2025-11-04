import React from 'react';
import { Button, Card, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { deleteSubscription } from '../../store/subscriptionSlice';
import { setModalVisible, setEditingSubscription } from '../../store/uiSlice';
import { formatCurrency, getStatusColor, getStatusDisplayName, getPeriodDisplayName } from '../../utils/subscription';
import { Subscription } from '../../types';

const { Text } = Typography;

interface SubscriptionTableProps {
  data: Subscription[];
  loading?: boolean;
}

const SubscriptionTable: React.FC<SubscriptionTableProps> = ({ data, loading }) => {
  const dispatch = useAppDispatch();

  const handleEdit = (subscription: Subscription) => {
    dispatch(setEditingSubscription(subscription));
    dispatch(setModalVisible(true));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteSubscription(id));
  };

  const handleExport = () => {
    const csvContent = [
      ['名称', '平台', '费用', '周期', '状态', '开始日期', '下次扣款', '备注'],
      ...data.map(sub => [
        sub.name,
        sub.platform,
        formatCurrency(sub.cost),
        getPeriodDisplayName(sub.period, sub.customDays),
        getStatusDisplayName(sub.status),
        sub.startDate,
        sub.nextBillingDate,
        sub.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `订阅数据_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (name: string) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 100,
      ellipsis: true,
    },
    {
      title: '费用',
      dataIndex: 'cost',
      key: 'cost',
      width: 80,
      render: (cost: number) => formatCurrency(cost),
    },
    {
      title: '周期',
      dataIndex: 'period',
      key: 'period',
      width: 100,
      render: (period: string, record: Subscription) => 
        getPeriodDisplayName(period as any, record.customDays),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={getStatusColor(status as any)}>
          {getStatusDisplayName(status as any)}
        </Tag>
      ),
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 100,
      render: (date: string) => date,
    },
    {
      title: '下次扣款',
      dataIndex: 'nextBillingDate',
      key: 'nextBillingDate',
      width: 100,
      render: (date: string, record: Subscription) => (
        <Tooltip title={`距离到期还有 ${Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} 天`}>
          <Text type={record.status === 'expiring' ? 'warning' : undefined}>
            {date}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      width: 120,
      ellipsis: {
        showTitle: false,
      },
      render: (notes: string) => (
        notes ? (
          <Tooltip placement="topLeft" title={notes}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {notes}
            </Text>
          </Tooltip>
        ) : '-'
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: Subscription) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="订阅列表"
      extra={
        <Button
          type="primary"
          icon={<ExportOutlined />}
          onClick={handleExport}
        >
          导出CSV
        </Button>
      }
      className="custom-card"
    >
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
        }}
        scroll={{ x: 1000 }}
        className="custom-table"
      />
    </Card>
  );
};

export default SubscriptionTable;