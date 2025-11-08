import { useState } from 'react';
import { Form, Input, InputNumber, Select, Button, Alert, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DynamicForm from '@/forms/DynamicForm';
import { request } from '@/request';

const { TextArea } = Input;
const { Option } = Select;

export default function VehicleForm({ fields, isUpdateForm = false }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [vinError, setVinError] = useState(null);
  const [vinSuccess, setVinSuccess] = useState(null);

  const handleVINDecode = async () => {
    try {
      setLoading(true);
      setVinError(null);
      setVinSuccess(null);

      const vin = form.getFieldValue('vin');

      if (!vin || vin.length !== 17) {
        setVinError('Please enter a valid 17-character VIN');
        setLoading(false);
        return;
      }

      // Call the VIN decoder API
      const response = await request.post({
        entity: 'vehicle',
        jsonData: { vin: vin.toUpperCase() },
        options: { path: '/decode-vin' },
      });

      if (response.success && response.result) {
        const { data, exists, vehicle } = response.result;

        if (exists) {
          setVinError(
            `Vehicle with VIN ${data.vin} already exists in the system for customer: ${vehicle.customer?.name}`
          );
        } else {
          // Auto-populate fields from VIN decode
          if (data.data) {
            const decodedData = data.data;
            form.setFieldsValue({
              year: decodedData.year,
              make: decodedData.make,
              model: decodedData.model,
              trim: decodedData.trim,
              engine: decodedData.engine,
              transmission: decodedData.transmission,
              fuelType: decodedData.fuelType,
            });
            setVinSuccess('VIN decoded successfully! Vehicle information has been auto-filled.');
          }
        }
      }
    } catch (error) {
      setVinError(error.message || 'Failed to decode VIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DynamicForm
      fields={fields}
      form={form}
      customComponents={{
        vin: (
          <Input.Group compact>
            <Form.Item
              name="vin"
              label="VIN"
              rules={fields.vin.rules}
              style={{ display: 'inline-block', width: 'calc(100% - 120px)', marginBottom: 0 }}
            >
              <Input
                placeholder="Enter 17-character VIN"
                maxLength={17}
                style={{ textTransform: 'uppercase' }}
                disabled={isUpdateForm}
              />
            </Form.Item>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              loading={loading}
              onClick={handleVINDecode}
              style={{ marginLeft: 8 }}
              disabled={isUpdateForm}
            >
              Decode
            </Button>
          </Input.Group>
        ),
      }}
      beforeFormItems={
        <>
          {vinError && (
            <Alert
              message="VIN Decode Error"
              description={vinError}
              type="error"
              closable
              onClose={() => setVinError(null)}
              style={{ marginBottom: 16 }}
            />
          )}
          {vinSuccess && (
            <Alert
              message="Success"
              description={vinSuccess}
              type="success"
              closable
              onClose={() => setVinSuccess(null)}
              style={{ marginBottom: 16 }}
            />
          )}
        </>
      }
    />
  );
}
