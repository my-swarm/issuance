import React, { ReactElement } from 'react';

import { useAppState } from '@app';
import { useTransfersQuery } from '@graphql';
import { Loading, TransferHistory } from '@components';

export function ManageTransferHistory(): ReactElement {
  const [{ onlineToken }] = useAppState();
  const { loading, error, data } = useTransfersQuery({
    variables: { token: onlineToken.id },
  });
  if (loading || !data) return <Loading />;
  const { token } = data;
  const { transfers } = token;

  return <TransferHistory transfers={transfers} token={token} />;
}
