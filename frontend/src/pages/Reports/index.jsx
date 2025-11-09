import React, { useState } from 'react';
import { Card, Row, Col, Table, DatePicker, Button, Spin, Alert, Statistic, Descriptions, message } from 'antd';
import {
  DownloadOutlined,
  DollarOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { request } from '@/request';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { RangePicker } = DatePicker;

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);

  const fetchFinancialReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      };

      const { data } = await request.get({
        entity: 'analytics/financial-report',
        options: { params },
      });

      if (data.success) {
        setReportData(data.result);
      } else {
        setError(data.message || 'Failed to load report');
      }
    } catch (err) {
      setError(err.message || 'Error loading report');
      console.error('Report error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  const exportToExcel = () => {
    try {
      if (!reportData) {
        message.warning('No data to export. Please generate a report first.');
        return;
      }

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Profit & Loss Sheet
      const plData = [
        ['Profit & Loss Statement'],
        ['Period', `${dateRange[0].format('YYYY-MM-DD')} to ${dateRange[1].format('YYYY-MM-DD')}`],
        [],
        ['Metric', 'Amount'],
        ['Total Revenue', profitLoss.revenue || 0],
        ['Total Expenses', profitLoss.expenses || 0],
        ['Gross Profit', profitLoss.grossProfit || 0],
        ['Profit Margin (%)', profitLoss.profitMargin || 0],
      ];
      const plSheet = XLSX.utils.aoa_to_sheet(plData);
      XLSX.utils.book_append_sheet(wb, plSheet, 'Profit & Loss');

      // Revenue Details Sheet
      const revenueData = [
        ['Revenue Details'],
        [],
        ['Metric', 'Amount'],
        ['Total Invoiced', revenue.totalInvoiced || 0],
        ['Total Paid', revenue.totalPaid || 0],
        ['Total Due', revenue.totalDue || 0],
        ['Invoice Count', revenue.invoiceCount || 0],
        ['Tax Collected', revenue.taxCollected || 0],
        [],
        ['Revenue by Category'],
        ['Category', 'Amount'],
        ['Labor Revenue', revenueByCategory.laborRevenue || 0],
        ['Parts Revenue', revenueByCategory.partsRevenue || 0],
        ['Total Revenue', revenueByCategory.totalRevenue || 0],
      ];
      const revenueSheet = XLSX.utils.aoa_to_sheet(revenueData);
      XLSX.utils.book_append_sheet(wb, revenueSheet, 'Revenue Details');

      // AR Aging Sheet
      const arAgingData = [
        ['Accounts Receivable Aging'],
        [],
        ['Age Range', 'Count', 'Total Due'],
      ];
      (reportData.arAging || []).forEach((item) => {
        const range = item._id === '120+' ? 'Over 120 days' : `${item._id}-${parseInt(item._id) + 29} days`;
        arAgingData.push([range, item.count, item.totalDue]);
      });
      const arAgingSheet = XLSX.utils.aoa_to_sheet(arAgingData);
      XLSX.utils.book_append_sheet(wb, arAgingSheet, 'AR Aging');

      // Payments Received Sheet
      const paymentsData = [
        ['Payments Received by Method'],
        [],
        ['Payment Method', 'Count', 'Total'],
      ];
      (reportData.paymentsReceived || []).forEach((item) => {
        paymentsData.push([item._id, item.count, item.total]);
      });
      const paymentsSheet = XLSX.utils.aoa_to_sheet(paymentsData);
      XLSX.utils.book_append_sheet(wb, paymentsSheet, 'Payments');

      // Generate and download
      const fileName = `Financial_Report_${dateRange[0].format('YYYY-MM-DD')}_to_${dateRange[1].format('YYYY-MM-DD')}.xlsx`;
      XLSX.writeFile(wb, fileName);
      message.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Excel export error:', error);
      message.error('Failed to export to Excel');
    }
  };

  const exportToPDF = () => {
    try {
      if (!reportData) {
        message.warning('No data to export. Please generate a report first.');
        return;
      }

      const doc = new jsPDF();
      let yPosition = 20;

      // Title
      doc.setFontSize(18);
      doc.text('Financial Report', 14, yPosition);
      yPosition += 10;

      // Period
      doc.setFontSize(11);
      doc.text(`Period: ${dateRange[0].format('YYYY-MM-DD')} to ${dateRange[1].format('YYYY-MM-DD')}`, 14, yPosition);
      yPosition += 15;

      // Profit & Loss
      doc.setFontSize(14);
      doc.text('Profit & Loss Statement', 14, yPosition);
      yPosition += 5;

      doc.autoTable({
        startY: yPosition,
        head: [['Metric', 'Amount']],
        body: [
          ['Total Revenue', `$${(profitLoss.revenue || 0).toFixed(2)}`],
          ['Total Expenses', `$${(profitLoss.expenses || 0).toFixed(2)}`],
          ['Gross Profit', `$${(profitLoss.grossProfit || 0).toFixed(2)}`],
          ['Profit Margin', `${(profitLoss.profitMargin || 0).toFixed(2)}%`],
        ],
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      // Revenue Details
      doc.setFontSize(14);
      doc.text('Revenue Details', 14, yPosition);
      yPosition += 5;

      doc.autoTable({
        startY: yPosition,
        head: [['Metric', 'Amount']],
        body: [
          ['Total Invoiced', `$${(revenue.totalInvoiced || 0).toFixed(2)}`],
          ['Total Paid', `$${(revenue.totalPaid || 0).toFixed(2)}`],
          ['Total Due', `$${(revenue.totalDue || 0).toFixed(2)}`],
          ['Invoice Count', revenue.invoiceCount || 0],
          ['Tax Collected', `$${(revenue.taxCollected || 0).toFixed(2)}`],
        ],
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      // Revenue by Category
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text('Revenue by Category', 14, yPosition);
      yPosition += 5;

      doc.autoTable({
        startY: yPosition,
        head: [['Category', 'Amount']],
        body: [
          ['Labor Revenue', `$${(revenueByCategory.laborRevenue || 0).toFixed(2)}`],
          ['Parts Revenue', `$${(revenueByCategory.partsRevenue || 0).toFixed(2)}`],
          ['Total Revenue', `$${(revenueByCategory.totalRevenue || 0).toFixed(2)}`],
        ],
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      // AR Aging
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text('Accounts Receivable Aging', 14, yPosition);
      yPosition += 5;

      const arAgingBody = (reportData.arAging || []).map((item) => {
        const range = item._id === '120+' ? 'Over 120 days' : `${item._id}-${parseInt(item._id) + 29} days`;
        return [range, item.count, `$${(item.totalDue || 0).toFixed(2)}`];
      });

      doc.autoTable({
        startY: yPosition,
        head: [['Age Range', 'Count', 'Total Due']],
        body: arAgingBody,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      // Payments Received
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text('Payments Received by Method', 14, yPosition);
      yPosition += 5;

      const paymentsBody = (reportData.paymentsReceived || []).map((item) => [
        item._id,
        item.count,
        `$${(item.total || 0).toFixed(2)}`,
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Payment Method', 'Count', 'Total']],
        body: paymentsBody,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
      });

      // Save PDF
      const fileName = `Financial_Report_${dateRange[0].format('YYYY-MM-DD')}_to_${dateRange[1].format('YYYY-MM-DD')}.pdf`;
      doc.save(fileName);
      message.success('PDF file downloaded successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      message.error('Failed to export to PDF');
    }
  };

  const arAgingColumns = [
    {
      title: 'Age Range',
      dataIndex: '_id',
      key: 'range',
      render: (value) => {
        if (value === '120+') return 'Over 120 days';
        return `${value}-${parseInt(value) + 29} days`;
      },
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Total Due',
      dataIndex: 'totalDue',
      key: 'totalDue',
      render: (value) => `$${value?.toFixed(2) || '0.00'}`,
    },
  ];

  const paymentsColumns = [
    {
      title: 'Payment Method',
      dataIndex: '_id',
      key: 'method',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value) => `$${value?.toFixed(2) || '0.00'}`,
    },
  ];

  const revenue = reportData?.revenue || {};
  const revenueByCategory = reportData?.revenueByCategory || {};
  const expenses = reportData?.expenses || {};
  const profitLoss = reportData?.profitLoss || {};

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <h1>Financial Reports</h1>
          <div style={{ marginTop: '16px', marginBottom: '16px' }}>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="YYYY-MM-DD"
              style={{ marginRight: '16px' }}
            />
            <Button
              type="primary"
              onClick={fetchFinancialReport}
              loading={loading}
              icon={<DownloadOutlined />}
            >
              Generate Report
            </Button>
            {reportData && (
              <>
                <Button
                  onClick={exportToExcel}
                  style={{ marginLeft: '8px' }}
                  icon={<FileExcelOutlined />}
                >
                  Export Excel
                </Button>
                <Button
                  onClick={exportToPDF}
                  style={{ marginLeft: '8px' }}
                  icon={<FilePdfOutlined />}
                >
                  Export PDF
                </Button>
              </>
            )}
          </div>
        </Col>
      </Row>

      {loading && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="Generating report..." />
        </div>
      )}

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {reportData && !loading && (
        <>
          {/* Profit & Loss Summary */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={24}>
              <Card title="Profit & Loss Statement">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} lg={6}>
                    <Statistic
                      title="Total Revenue"
                      value={profitLoss.revenue || 0}
                      precision={2}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Statistic
                      title="Total Expenses"
                      value={profitLoss.expenses || 0}
                      precision={2}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Statistic
                      title="Gross Profit"
                      value={profitLoss.grossProfit || 0}
                      precision={2}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: profitLoss.grossProfit >= 0 ? '#3f8600' : '#cf1322' }}
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Statistic
                      title="Profit Margin"
                      value={profitLoss.profitMargin || 0}
                      precision={2}
                      suffix="%"
                      valueStyle={{ color: profitLoss.profitMargin >= 0 ? '#3f8600' : '#cf1322' }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          {/* Revenue Details */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}>
              <Card title="Revenue Details">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Total Invoiced">
                    ${revenue.totalInvoiced?.toFixed(2) || '0.00'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Paid">
                    ${revenue.totalPaid?.toFixed(2) || '0.00'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Due">
                    ${revenue.totalDue?.toFixed(2) || '0.00'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Invoice Count">
                    {revenue.invoiceCount || 0}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tax Collected">
                    ${revenue.taxCollected?.toFixed(2) || '0.00'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Revenue by Category">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Labor Revenue">
                    ${revenueByCategory.laborRevenue?.toFixed(2) || '0.00'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Parts Revenue">
                    ${revenueByCategory.partsRevenue?.toFixed(2) || '0.00'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Revenue">
                    ${revenueByCategory.totalRevenue?.toFixed(2) || '0.00'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Labor %">
                    {revenueByCategory.totalRevenue > 0
                      ? ((revenueByCategory.laborRevenue / revenueByCategory.totalRevenue) * 100).toFixed(1)
                      : '0.0'}%
                  </Descriptions.Item>
                  <Descriptions.Item label="Parts %">
                    {revenueByCategory.totalRevenue > 0
                      ? ((revenueByCategory.partsRevenue / revenueByCategory.totalRevenue) * 100).toFixed(1)
                      : '0.0'}%
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          {/* AR Aging */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}>
              <Card title="Accounts Receivable Aging">
                <Table
                  dataSource={reportData.arAging || []}
                  columns={arAgingColumns}
                  rowKey="_id"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Payments Received by Method">
                <Table
                  dataSource={reportData.paymentsReceived || []}
                  columns={paymentsColumns}
                  rowKey="_id"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
