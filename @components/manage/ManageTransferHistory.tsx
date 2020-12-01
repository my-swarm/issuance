import React, { ReactElement } from 'react';

import { useContractAddress } from '@app';
import { useTransfersQuery } from '@graphql';
import { Loading, TransferHistory } from '@components';

export function ManageTransferHistory(): ReactElement {
  const { src20: src20Address } = useContractAddress();
  const { loading, error, data } = useTransfersQuery({
    variables: { token: src20Address },
  });
  if (loading || !data) return <Loading />;
  const { token } = data;
  const { transfers } = token;

  return <TransferHistory transfers={transfers} token={token} />;
}
