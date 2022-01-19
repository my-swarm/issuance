import React, { ReactElement, useEffect, useMemo } from 'react';
import {
  TokenInfoFragment,
  TransferFragment,
  TransferRequestFragment,
  TransferRequestStatus,
  useWalletDetailLazyQuery,
} from '@graphql';
import { Alert, Divider } from 'antd';
import { useEthers } from '@app';
import { TransferForm, TransferHistory, TransferRequests } from '../common';
import { Loading } from '../utility';
import { tokenBalance } from '@lib';

interface Props {
  token: TokenInfoFragment;
  refetch: () => void;
}

type TransferOrRequest = TransferFragment | TransferRequestFragment;

function mergeRecords<T extends TransferOrRequest>(t1: T[], t2: T[]): T[] {
  return [...t1, ...t2].sort((a, b) => b.createdAt - a.createdAt);
}

export function WalletDetail({ token, refetch }: Props): ReactElement {
  const [loadQuery, { data, loading, refetch: refetchDetail }] = useWalletDetailLazyQuery();
  const { address, block } = useEthers();

  const transfers = useMemo<TransferFragment[]>(() => {
    if (!data?.token) return [];
    const { transfersFrom, transfersTo } = data.token;
    return mergeRecords(transfersFrom, transfersTo);
  }, [data]);

  const transferRequests = useMemo<TransferRequestFragment[]>(() => {
    if (!data?.token) return [];
    const { transferRequestsFrom, transferRequestsTo } = data.token;
    return mergeRecords(transferRequestsFrom, transferRequestsTo);
  }, [data]);

  const holder = data?.token?.holders?.[0] || undefined;

  useEffect(() => {
    if (!address) return;
    loadQuery({ variables: { address, token: token.address } });
  }, [address]);

  const handleRefetch = () => {
    refetch();
    refetchDetail();
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h2>Transfer</h2>
      {holder ? (
        <TransferForm
          token={token}
          refetch={handleRefetch}
          currentBalance={tokenBalance(block, token, holder.balance)}
        />
      ) : (
        <Alert type="warning" message="You don't own this token" />
      )}

      <Divider />

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
