import React, { ReactElement } from 'react';
import { Button } from 'antd';
import { OnlineToken, parseUnits } from '@lib';
import { useDispatch, useEthers } from '@app';
import { useTokensQuery } from '@graphql';

interface Props {
  token: OnlineToken;
}

export function DevTransferTest({ token }: Props): ReactElement {
  const { address } = useEthers();
  const { dispatchTransaction } = useDispatch();
  const query = useTokensQuery({ variables: { owner: address } });

  const handleTest = () => {
    dispatchTransaction({
      method: 'src20.forceTransfer',
      args: [address, '0xA901C6edd839C8eB355C7Dd5b07f26DDD43b24e4', parseUnits(1, token.decimals)],
      address: token.address,
      description: 'Transfering a little bit',
      onSuccess: () => {
        console.log('success');
      },
      syncCallbacks: [query.refetch, () => console.log('sync')],
    });
  };

  return <Button onClick={handleTest}>Test Transfer pls</Button>;
}
