import React, { ReactElement, useState } from 'react';
import moment from 'moment';
import { Form, DatePicker, Input, InputNumber, Button, Space, Select, Row, Col, Checkbox } from 'antd';

import { LocalFundraiser, BASE_CURRENCIES } from '@lib';
import { devDefaultFundraiser, isDev, useEthers } from '@app';
import { Help, HelpLabel } from '..';

interface FundraiserFormProps {
  tokenName: string;
  onCancel: () => void;
  formData: LocalFundraiser;
  onSave: (values: LocalFundraiser) => void;
  onStart: (values: LocalFundraiser) => void;
  disabled: boolean;
}

const defaultFormData = isDev ? devDefaultFundraiser : undefined;

export function FundraiserForm({
  tokenName,
  onCancel,
  onSave,
  onStart,
  formData = defaultFormData,
  disabled = false,
}: FundraiserFormProps): ReactElement {
  const [startNow, setStartNow] = useState(formData?.startNow || false);
  const [supplyAndPriceEmpty, setSupplyAndPriceEmpty] = useState<boolean>(true);
  const [form] = Form.useForm();
  const [submitButton, setSubmitButton] = useState<string>();
  const { networkId, network } = useEthers();

  const handleToggleStartNow = () => {
    setStartNow(!startNow);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values) => {
    values.startNow = startNow;
    if (submitButton === 'start') {
      onStart(values);
    } else {
      onSave(values);
    }
  };

  const handleUpdatedSupplyOrPrice = (resetField: string) => {
    form.setFieldsValue({ [resetField]: null });
    setSupplyAndPriceEmpty(!form.getFieldValue('tokensToMint') && !form.getFieldValue('tokenPrice'));
  };

  const initialValues = {
    ...(formData || {}),
    startDate: formData?.startDate ? moment(formData.startDate) : undefined,
    endDate: formData?.endDate ? moment(formData.endDate) : undefined,
    label: formData?.label || `${tokenName} fundraiser`,
  };

  return (
    <Form form={form} onFinish={handleSubmit} onReset={handleCancel} layout="vertical" initialValues={initialValues}>
      <Form.Item name="label" label="What do you want to call your fundraiser">
        <Input disabled={disabled} />
      </Form.Item>
      <Form.Item
        name="baseCurrency"
        label="Base currency"
        rules={[{ required: true, message: 'Base currency is required' }]}
      >
        <Select defaultActiveFirstOption disabled={disabled}>
          {Object.entries(BASE_CURRENCIES).map(([key, currency]) => {
            const address = currency.addresses[networkId] || undefined;
            return (
              <Select.Option value={key} key={key}>
                {currency.symbol}: {address || 'unknown address'}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item name="contributionsLocked" valuePropName="checked">
        <Checkbox disabled={disabled}>
          <HelpLabel name="contributionsLocked" />
        </Checkbox>
      </Form.Item>

      <h3>
        Token price/supply <Help name="supplyOrPrice" />
      </h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="tokensToMint"
            label="Token supply to mint"
            rules={[{ required: supplyAndPriceEmpty, message: 'Enter token supply or price' }]}
          >
            <InputNumber
              min={1}
              step={1000}
              className="w-full"
              disabled={disabled}
              onChange={() => handleUpdatedSupplyOrPrice('tokenPrice')}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="tokenPrice"
            label="Token price (USD)"
            rules={[{ required: supplyAndPriceEmpty, message: 'Enter token supply or price' }]}
          >
            <InputNumber
              min={0}
              step={0.1}
              className="w-full"
              disabled={disabled}
              onChange={() => handleUpdatedSupplyOrPrice('tokensToMint')}
            />
          </Form.Item>
        </Col>
      </Row>

      <h3>Dates</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="startDate"
            label={
              <Space size="large">
                <span>Start date</span>
                <Checkbox checked={startNow} onChange={handleToggleStartNow}>
                  Start now
                </Checkbox>
              </Space>
            }
            rules={[{ required: !startNow, message: 'Start date is required' }]}
          >
            <DatePicker className="w-full" disabled={disabled || startNow} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="endDate"
            label="End date"
            rules={[
              { required: true, message: 'End date is required' },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (value && startNow && value <= new Date()) {
                    return Promise.reject('Has to end in the future');
                  } else if (value && !startNow && value <= getFieldValue('startDate')) {
                    return Promise.reject('Has to end after start date');
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}
          >
            <DatePicker className="w-full" disabled={disabled} />
          </Form.Item>
        </Col>
      </Row>

      <h3>Caps</h3>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="softCap" label="Soft Cap" rules={[{ required: true, message: 'Soft Cap is required' }]}>
            <InputNumber min={1} step={1000} className="w-full" disabled={disabled} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="hardCap" label="Hard Cap" rules={[{ required: true, message: 'Hard Cap is required' }]}>
            <InputNumber min={1} step={1000} className="w-full" disabled={disabled} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            onClick={() => setSubmitButton('start')}
            disabled={disabled}
          >
            Save and deploy now
          </Button>
          <Button htmlType="submit" size="large" onClick={() => setSubmitButton('save')} disabled={disabled}>
            Save and deploy later
          </Button>
          <Button size="large" onClick={onCancel} disabled={disabled}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
