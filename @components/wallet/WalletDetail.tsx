import React, { ReactElement, useEffect } from 'react';
import {
  TokenHolderFragment,
  TokenInfoFragment,
  TransferFragment,
  TransferRequestStatus,
  useWalletDetailLazyQuery,
} from '@graphql';
import { TransferForm, TransferHistory, TransferRequests } from '../common';
import { useEthers } from '@app';

interface WalletDetailProps {
  token: TokenInfoFragment;
  transfers: TransferFragment[];
  holder: TokenHolderFragment;
  onReset: () => void;
}

export function WalletDetail({ token, transfers, holder, onReset }: WalletDetailProps): ReactElement {
  const [loadQuery, { data, loading }] = useWalletDetailLazyQuery();
  const { address } = useEthers();

  useEffect(() => {
    if (!address) return;
    loadQuery({ variables: { address, token: token.address } });
  }, [address]);

  const handleTransfered = () => {
    onReset();
  };

  const transferRequests = [
    ...(data?.token?.transferRequestsFrom || []),
    ...(data?.token?.transferRequestsTo || []),
  ].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div>
      <h2>Transfer</h2>
      <TransferForm token={token} onSuccess={handleTransfered} currentBalance={holder.balance} />

      {transferRequests.length > 0 && (
        <>
          <h2>Pending requests</h2>
          <TransferRequests
            token={token}
            transferRequests={transferRequests}
            defaultStatus={TransferRequestStatus.Pending}
            defaultPaginate="off"
          />
        </>
      )}

      <h2>Transaction history</h2>
      <TransferHistory token={token} transfers={transfers} direction={true} />
    </div>
  );
}
