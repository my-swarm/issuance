import React, { ReactElement, useState } from 'react';
import { Col, Input, InputNumber, Modal, Row, Space } from 'antd';
import { useAppState, useDispatch } from '@app';
import { Address } from '../utility';
import { parseUnits } from '@lib';

interface AccountBurnModalProps {
  from: string;
  currentBalance: number;
  onClose: () => void;
}

export function TransferModal({ from, currentBalance, onClose }: AccountBurnModalProps): ReactElement {
  const [to, setTo] = useState<string>();
  const [amount, setAmount] = useState<number>(0);
  const { dispatchTransaction } = useDispatch();
  const [{ token }] = useAppState();

  const handleTransfer = async (): Promise<void> => {
    dispatchTransaction({
      method: 'src20.transferTokenForced',
      arguments: [from, to, parseUnits(amount, token.decimals)],
      description: `Transfering ${amount} ${token.symbol} from ${from} to ${to}`,
      onSuccess: handleCancel,
    });
  };

  const handleCancel = () => {
    setAmount(0);
    onClose();
  };

  return (
    <Modal visible={true} title="Transfer tokens" onOk={handleTransfer} onCancel={handleCancel}>
      <div className="mb-2">
        <p>Burning means permanently deleting tokens.</p>
        <Space direction="vertical">
          <Row>
            <Col xs={24} md={8}>
              From Address
            </Col>
            <Col xs={24} md={16}>
              <Address>{from}</Address>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={8}>
              Current balance
            </Col>
            <Col xs={24} md={16}>
              <InputNumber value={currentBalance} readOnly /> {token.symbol}
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={8}>
              To address
            </Col>
            <Col xs={24} md={16}>
              <Input value={to} onChange={(e) => setTo(e.target.value)} />
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={8}>
              Transfer amount
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
