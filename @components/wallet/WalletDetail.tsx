import React, { ReactElement } from 'react';
import { TokenHolderFragment, TokenInfoFragment, TransferFragment } from '@graphql';
import { TransferForm, TransferHistory } from '../common';

interface WalletDetailProps {
  token: TokenInfoFragment;
  transfers: TransferFragment[];
  holder: TokenHolderFragment;
  onReset: () => void;
}

export function WalletDetail({ token, transfers, holder, onReset }: WalletDetailProps): ReactElement {
  const handleTransfered = () => {
    onReset();
  };

  return (
    <div>
      <h2>Transfer</h2>
      <TransferForm token={token} onSuccess={handleTransfered} currentBalance={holder.balance} />

      <h2>Transaction history</h2>
      <TransferHistory token={token} transfers={transfers} direction={true} />
    </div>
  );
}
