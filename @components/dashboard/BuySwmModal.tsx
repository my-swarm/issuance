import React, { ReactElement, useState } from 'react';
import { Alert, Button, Form, Input, Modal } from 'antd';
import { useDispatch } from '@app';
import { ArrowDownOutlined } from '@ant-design/icons';
import { formatNumber } from '@lib';

interface BuySwmModalProps {
  onClose: () => void;
}

export function BuySwmModal({ onClose }: BuySwmModalProps): ReactElement {
  const [input, setInput] = useState<string>('');
  const [price, setPrice] = useState<number>(0.14);
  const [ethBalance, setEthBalance] = useState<number>(23.434);
  const [swmBalance, setSwmBalance] = useState<number>(480000);
  // const [swmBalance] = useSwmBalance();
  const { dispatchTransaction, dispatchError } = useDispatch();
  const [form] = Form.useForm();

  const handleBuy = async (): Promise<void> => {
    alert('Coming soon!');
  };

  const handleCancel = () => {
    setInput('');
    onClose();
  };

  const swmAddon = (
    <div className="addon">
      <span className="icon">
        <img src="/images/swarm-symbol.svg" alt="SWM symbol" />
      </span>
      <strong>SWM</strong>
    </div>
  );
  const ethAddon = (
    <div className="addon">
      <span className="icon">
        <img src="/images/ethereum.svg" alt="ETH symbol" />
      </span>
      <strong>ETH</strong>
    </div>
  );
  const swmSuffix = (
    <div className="suffix">
      balance
      <br />
      {formatNumber(swmBalance)}
    </div>
  );
  const ethSuffix = (
    <div className="suffix">
      balance
      <br />
      {formatNumber(ethBalance, 4)}
    </div>
  );

  return (
    <Modal visible={true} title="Buy SWM token" onOk={() => form.submit()} onCancel={handleCancel} footer={null}>
      <Alert message="Mock form, functionality TBD" type="warning" className="mb-4" showIcon />
      <Form form={form} onFinish={() => handleBuy()}>
        <Form.Item name="ethAmount">
          <Input addonBefore={ethAddon} suffix={ethSuffix} size="large" />
        </Form.Item>
        <div className="mb-4 text-center">
          <ArrowDownOutlined width={32} style={{ fontSize: '24px' }} />
        </div>
        <Form.Item name="swmAmount">
          <Input addonBefore={swmAddon} suffix={swmSuffix} size="large" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" size="large" block>
            Buy SWM
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
