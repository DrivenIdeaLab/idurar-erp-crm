import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Spin, Alert } from 'antd';
import {
  DollarOutlined,
  UserOutlined,
  CarOutlined,
  ToolOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { request } from '@/request';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      };

      const { data } = await request.get({
        entity: 'analytics/executive-dashboard',
        options: { params },
      });

      if (data.success) {
        setDashboardData(data.result);
      } else {
        setError(data.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      setError(err.message || 'Error loading dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: '20px' }}
      />
    );
  }

  const revenue = dashboardData?.revenue || {};
  const customers = dashboardData?.customers || {};
  const vehicles = dashboardData?.vehicles || {};
  const services = dashboardData?.services || {};
  const inventory = dashboardData?.inventory || {};

  const topServicesColumns = [
    {
      title: 'Service Name',
      dataIndex: '_id',
      key: 'name',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => `$${value?.toFixed(2) || '0.00'}`,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <h1>Executive Dashboard</h1>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
          />
        </Col>
      </Row>

      {/* Revenue & Financial Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={revenue.total || 0}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
              {revenue.invoiceCount || 0} invoices
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Amount Paid"
              value={revenue.paid || 0}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={customers.total || 0}
              prefix={<UserOutlined />}
            />
            <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
              <RiseOutlined /> {customers.new || 0} new (
              {customers.growth?.toFixed(1) || 0}%)
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Vehicles"
              value={vehicles.total || 0}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Inventory Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12}>
          <Card title="Inventory Value">
            <Statistic
              title="Cost Value"
              value={inventory.value?.totalCostValue || 0}
              precision={2}
              prefix="$"
            />
            <Statistic
              title="Sell Value"
              value={inventory.value?.totalSellValue || 0}
              precision={2}
              prefix="$"
              style={{ marginTop: '16px' }}
            />
            {inventory.lowStockCount > 0 && (
              <Alert
                message={`${inventory.lowStockCount} parts need reordering`}
                type="warning"
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="Top Services by Revenue">
            <Table
              dataSource={services.topServices || []}
              columns={topServicesColumns}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue Trend */}
      {revenue.trend && revenue.trend.length > 0 && (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Revenue Trend (Last 30 Days)">
              <div style={{ fontSize: '14px', color: '#666' }}>
                Daily revenue tracking: {revenue.trend.length} days of data
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
