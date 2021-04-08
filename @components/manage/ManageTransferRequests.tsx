import React, { ReactElement } from 'react';

import { useAppState, useDispatch, useGraphql } from '@app';
import { TransferRequestStatus, useTransferRequestsQuery } from '@graphql';
import { Loading, TransferRequestRecord, TransferRequests } from '@components';

export function ManageTransferRequests(): ReactElement {
  const { reset } = useGraphql();
  const [{ onlineToken }] = useAppState();
  const { dispatchTransaction } = useDispatch();
  const { loading, data } = useTransferRequestsQuery({
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
      onSuccess: reset,
    });
  };

  const handleDeny = (record: TransferRequestRecord) => {
    dispatchTransaction({
      method: 'transferRules.denyTransfer',
      args: [record.requestId],
      description: `Denying transfer from ${record.from} to ${record.to}`,
      onSuccess: reset,
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
