import React, { ReactElement } from 'react';
import { Modal } from 'antd';

import { TransferForm } from '..';
import { TokenInfoFragment } from '@graphql';

interface TransferModalProps {
  from: string;
  currentBalance: number;
  onClose: () => void;
  token: TokenInfoFragment;
  refetch: () => void;
}

export function TransferModal({ from, currentBalance, token, onClose, refetch }: TransferModalProps): ReactElement {
  return (
    <Modal visible={true} title="Transfer tokens" maskClosable={false} onCancel={onClose}>
      <TransferForm
        type="forced"
        from={from}
        currentBalance={currentBalance}
        onSuccess={onClose}
        token={token}
        refetch={refetch}
      />
    </Modal>
  );
}
