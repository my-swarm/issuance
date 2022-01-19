import React, { ReactElement } from 'react';

import { useAppState, useDispatch } from '@app';
import { useTransferRequestsQuery } from '@graphql';
import { Loading, TransferRequestRecord, TransferRequests } from '@components';

export function ManageTransferRequests(): ReactElement {
  const [{ onlineToken }] = useAppState();
  const { dispatchTransaction } = useDispatch();
  const { loading, refetch, data } = useTransferRequestsQuery({
    variables: { token: onlineToken.id },
  });
  if (loading || !data) return <Loading />;
  const { token } = data;
  const { transferRequests } = token;

  const handleApprove = (record: TransferRequestRecord) => {
    dispatchTransaction({
      method: 'transferRules.approveTransfer',
      args: [record.requestId],
      description: `Approving transfer from ${record.from} to ${record.to}`,
      syncCallbacks: [refetch],
    });
  };

  const handleDeny = (record: TransferRequestRecord) => {
    dispatchTransaction({
      method: 'transferRules.denyTransfer',
      args: [record.requestId],
      description: `Denying transfer from ${record.from} to ${record.to}`,
      syncCallbacks: [refetch],
    });
  };

  return (
    <TransferRequests
      token={onlineToken}
      transferRequests={transferRequests}
      approved
      onApprove={handleApprove}
      onDeny={handleDeny}
    />
  );
}
