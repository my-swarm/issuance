import React, { ReactElement, useState } from 'react';
import { Col, Input, InputNumber, Modal, Row, Space } from 'antd';
import { useAppState, useDispatch } from '@app';
import { parseUnits } from '@lib';
import { Address } from '..';

interface AccountBurnModalProps {
  address: string;
  currentBalance: number;
  onClose: () => void;
}

export function AccountBurnModal({ address, currentBalance, onClose }: AccountBurnModalProps): ReactElement {
  const [amount, setAmount] = useState<number>(0);
  const { dispatchTransaction } = useDispatch();
  const [{ token }] = useAppState();

  const handleBurn = async (): Promise<void> => {
    dispatchTransaction({
      method: 'src20.burnAccount',
      arguments: [address, parseUnits(amount, token.decimals)],
      description: `Burning ${amount} ${token.symbol} from account ${address}`,
      onSuccess: handleCancel,
    });
  };

  const handleCancel = () => {
    setAmount(0);
    onClose();
  };

  return (
    <Modal visible={true} title="Burn account" onOk={handleBurn} onCancel={handleCancel} maskClosable={false}>
      <div className="mb-2">
        <p>Burning means permanently deleting tokens.</p>
        <Space direction="vertical">
          <Row>
            <Col xs={24} md={8}>
              Burn address
            </Col>
            <Col xs={24} md={16}>
              <Address>{address}</Address>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={8}>
              Current balance
            </Col>
            <Col xs={24} md={16}>
              <InputNumber value={currentBalance} readOnly /> <strong>{currentBalance}</strong> {token.symbol}
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={8}>
              Burn amount
            </Col>
            <Col xs={24} md={16}>
              <InputNumber
                min={0}
                max={currentBalance}
                value={amount}
                onChange={(value) => setAmount(parseFloat(value.toString()))}
              />{' '}
              {token.symbol}
            </Col>
          </Row>
        </Space>
      </div>
    </Modal>
  );
}
