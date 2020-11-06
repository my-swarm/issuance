import React, { ReactElement } from 'react';
import { useContractAddress, useDispatch, useGraphql } from '@app';
import { Alert, Button } from 'antd';
import { useTokenStatusQuery } from '@graphql';
import { Loading } from '@components';

export function ManageTokenStatus(): ReactElement {
  const { reset } = useGraphql();

  const { src20: src20Address } = useContractAddress();
  const { dispatchTransaction } = useDispatch();

  const { loading, error, data } = useTokenStatusQuery({
    variables: { id: src20Address },
  });
  const gToken = data?.token || undefined;
  if (loading || !gToken) return <Loading />;

  const handleFreeze = async () => {
    dispatchTransaction({
      method: 'features.freezeToken',
      description: 'Freezing token',
      onSuccess: reset,
    });
  };

  const handleUnfreeze = async () => {
    dispatchTransaction({
      method: 'features.unfreezeToken',
      description: 'Unfreezing token',
      onSuccess: reset,
    });
  };

  return (
    <>
      <h2>Freeze token</h2>
      <p>When token is frozen, all transfers are disabled</p>
      {gToken.isFrozen && <Alert message="Token is currently frozen!" type="warning" className="mb-3" />}
      {gToken.features.tokenFreeze ? (
        <p>
          {gToken.isFrozen ? (
            <Button type="primary" size="large" onClick={handleUnfreeze}>
              Unfreeze token
            </Button>
          ) : (
            <Button type="primary" size="large" onClick={handleFreeze}>
              Freeze token
            </Button>
          )}
        </p>
      ) : (
        <Alert message="Token freeze feature not enabled" type="error" />
      )}
    </>
  );
}
