import React, { ReactElement, useEffect } from 'react';
import { Form, DatePicker, Input, InputNumber, Button, Checkbox, Popover, Space, Radio, Upload } from 'antd';

interface FundraiserFormProps {
  onCancel: () => void;
  onSubmit: () => void;
  formData?: any;
}

const sampleFormData = {
  label: 'Christmas fundraiser',
  // startDate: '2020-09-01',
  // endDate: '2020-12-24',
  softCap: 500000,
  hardCap: 1000000,
};

export function FundraiserForm({ onCancel, onSubmit, formData = sampleFormData }: FundraiserFormProps): ReactElement {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = () => {
    onSubmit();
  };

  useEffect(() => {
    if (formData) {
      form.setFieldsValue(formData);
    } else {
      form.resetFields();
    }
  }, [formData]);

  return (
    <Form form={form} onFinish={handleSubmit} onReset={handleCancel} layout="vertical">
      <Form.Item name="startDate" label="Start date">
        <DatePicker />
      </Form.Item>
      <Form.Item name="endDate" label="End date">
        <DatePicker />
      </Form.Item>
      <Form.Item name="softCap" label="Soft Cap">
        <InputNumber min={1} step={1000} />
      </Form.Item>
      <Form.Item name="hardCap" label="Hard Cap">
        <InputNumber min={1} step={1000} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {formData ? 'Save Fundraiser' : 'Create Fundraiser'}
          </Button>
          <Button htmlType="reset">Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
