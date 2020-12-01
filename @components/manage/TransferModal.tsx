import React, { ReactElement } from 'react';
import { Modal } from 'antd';

import { TransferForm } from '..';
import { TokenInfoFragment } from '@graphql';

interface TransferModalProps {
  from: string;
  currentBalance: number;
  onClose: () => void;
  token: TokenInfoFragment;
}

export function TransferModal({ from, currentBalance, token, onClose }: TransferModalProps): ReactElement {
  return (
    <Modal visible={true} title="Transfer tokens" maskClosable={false}>
      <TransferForm type="forced" from={from} currentBalance={currentBalance} onSuccess={onClose} token={token} />
    </Modal>
  );
}
