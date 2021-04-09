import React, { ReactElement, useState } from 'react';
import { Form, Input, InputNumber, Button, Checkbox, Space, Row, Col } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Store } from 'rc-field-form/lib/interface';

import { LocalToken } from '@lib';
import { tokenFormRules as rules } from './tokenFormRules';
import { HelpLabel, AssetFormStub, TokenMetaStub, Fieldset } from '..';
import { devDefaultToken, isDev } from '@app';

interface TokenFormProps {
  onCancel: () => void;
  onSubmit: (token: LocalToken) => void;
  formData?: LocalToken;
}

const defaultToken = isDev ? devDefaultToken : ({ decimals: 18 } as LocalToken);

export function TokenForm({ onCancel, onSubmit, formData = defaultToken }: TokenFormProps): ReactElement {
  const [allowUnlimitedSupply, setallowUnlimitedSupply] = useState<boolean>(formData?.allowUnlimitedSupply || false);
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (token: Store) => {
    onSubmit(token as LocalToken);
  };

  const handleToggleallowUnlimitedSupply = (e: CheckboxChangeEvent) => {
    setallowUnlimitedSupply(e.target.checked);
  };

  return (
    <Form form={form} onFinish={handleSubmit} onReset={handleCancel} layout="vertical" initialValues={formData}>
      <Fieldset legend="Token basics">
        <Form.Item name="name" label="Token name" rules={rules.name}>
          <Input placeholder="Your token name" />
        </Form.Item>
        <Row gutter={16}>
          <Col lg={12}>
            <Form.Item name="symbol" label="Symbol" rules={rules.symbol} normalize={(x) => x.toUpperCase()}>
              <Input placeholder="XXX" />
            </Form.Item>
          </Col>
          <Col lg={12}>
            <Form.Item name="decimals" label="Decimals (keep 18 if not sure)" rules={rules.decimals}>
              <InputNumber min={0} max={36} placeholder="18" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <TokenMetaStub />
      </Fieldset>

      <Fieldset legend="Token supply">
        <p>
          Set the maximum possible number of tokens that can ever be minted. The actual initial supply is decided when
          you mint your tokens later.
        </p>
        <Space size="large">
          <Form.Item
            name="totalSupply"
            rules={[
              {
                required: !allowUnlimitedSupply,
                message: 'Enter maximum supply or check unlimited',
              },
            ]}
          >
            <InputNumber disabled={allowUnlimitedSupply} />
          </Form.Item>
          <Form.Item name="allowUnlimitedSupply" valuePropName="checked">
            <Checkbox onChange={handleToggleallowUnlimitedSupply}>Unlimited total supply</Checkbox>
          </Form.Item>
        </Space>
      </Fieldset>

      <Fieldset legend="Token features">
        <Form.Item>
          <Form.Item name="allowTransferRules" valuePropName="checked" className="no-margin">
            <Checkbox>
              <HelpLabel name="allowTransferRules" />
            </Checkbox>
          </Form.Item>
          <Form.Item name="allowAccountFreeze" valuePropName="checked" className="no-margin">
            <Checkbox>
              <HelpLabel name="allowAccountFreeze" />
            </Checkbox>
          </Form.Item>
          <Form.Item name="allowContractFreeze" valuePropName="checked" className="no-margin">
            <Checkbox>
              <HelpLabel name="allowContractFreeze" />
            </Checkbox>
          </Form.Item>
          <Form.Item name="allowForceTransfer" valuePropName="checked" className="no-margin">
            <Checkbox>
              <HelpLabel name="allowForceTransfer" />
            </Checkbox>
          </Form.Item>
          <Form.Item name="allowBurn" valuePropName="checked" className="no-margin">
            <Checkbox>
              <HelpLabel name="allowBurn" />
            </Checkbox>
          </Form.Item>
        </Form.Item>
      </Fieldset>

      <Fieldset legend="Asset details">
        <p>Define your asset, it&apos;s value and other information in detail.</p>
        <AssetFormStub />
      </Fieldset>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {formData ? 'Save Token' : 'Create Token'}
          </Button>
          <Button htmlType="reset">Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
