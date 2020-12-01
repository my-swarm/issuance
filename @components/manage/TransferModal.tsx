import React, { ReactElement } from 'react';
import { Modal } from 'antd';

import { TransferForm } from '..';

interface TransferModalProps {
  from: string;
  currentBalance: number;
  onClose: () => void;
}

export function TransferModal({ from, currentBalance, onClose }: TransferModalProps): ReactElement {
  return (
    <Modal visible={true} title="Transfer tokens">
      <TransferForm type="forced" from={from} currentBalance={currentBalance} onSuccess={onClose} />
    </Modal>
  );
}
