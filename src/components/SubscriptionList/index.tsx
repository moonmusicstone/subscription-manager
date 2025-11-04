import React from 'react';
import { Button, Input, Select, DatePicker, Row, Col } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { SubscriptionStatus } from '../../types';
import { setFilters, clearFilters } from '../../store/subscriptionSlice';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import SubscriptionTable from '../SubscriptionTable';

dayjs.extend(isBetween);

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const SubscriptionList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, filters } = useAppSelector(state => state.subscriptions);

  const platforms = React.useMemo(() => {
    const uniquePlatforms = Array.from(new Set(items.map(item => item.platform)));
    return uniquePlatforms.map(platform => ({ value: platform, label: platform }));
  }, [items]);

  const filteredData = React.useMemo(() => {
    let filtered = [...items];
    const searchText = filters.searchText;

    if (searchText) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.platform.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.platform) {
      filtered = filtered.filter(item => item.platform === filters.platform);
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(item => {
        const itemDate = dayjs(item.nextBillingDate);
        return itemDate.isBetween(start, end, 'day', '[]');
      });
    }

    return filtered;
  }, [items, filters]);

  const handleSearch = (value: string) => {
    dispatch(setFilters({ ...filters, searchText: value }));
  };

  const handleStatusFilter = (status: SubscriptionStatus | undefined) => {
    dispatch(setFilters({ ...filters, status }));
  };

  const handlePlatformFilter = (platform: string | undefined) => {
    dispatch(setFilters({ ...filters, platform }));
  };

  const handleDateFilter = (dates: any) => {
    if (dates) {
      dispatch(setFilters({
        ...filters,
        dateRange: {
          start: dates[0].format('YYYY-MM-DD'),
          end: dates[1].format('YYYY-MM-DD'),
        },
      }));
    } else {
      const { dateRange, ...restFilters } = filters;
      dispatch(setFilters(restFilters));
    }
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Search
            placeholder="搜索名称或平台"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Select
            placeholder="状态筛选"
            allowClear
            style={{ width: '100%' }}
            onChange={handleStatusFilter}
            value={filters.status}
          >
            <Option value="active">活跃</Option>
            <Option value="cancelled">已取消</Option>
            <Option value="expiring">即将到期</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Select
            placeholder="平台筛选"
            allowClear
            style={{ width: '100%' }}
            onChange={handlePlatformFilter}
            value={filters.platform}
            options={platforms}
          />
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <RangePicker
            style={{ width: '100%' }}
            onChange={handleDateFilter}
            placeholder={['开始日期', '结束日期']}
          />
        </Col>
        <Col xs={24} sm={8} lg={4}>
          <Button
            icon={<FilterOutlined />}
            onClick={handleClearFilters}
            style={{ width: '100%' }}
          >
            清除筛选
          </Button>
        </Col>
      </Row>

      <SubscriptionTable data={filteredData} loading={loading} />
    </div>
  );
};

export default SubscriptionList;