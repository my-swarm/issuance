import React, { ReactElement } from 'react';
import { useAppState, useContractAddress, useDispatch, useGraphql } from '@app';
import { Alert, Button } from 'antd';
import { useTokenStatusQuery } from '@graphql';
import { Loading } from '@components';

export function ManageTokenStatus(): ReactElement {
  const { reset } = useGraphql();
  const [{ onlineToken }] = useAppState();
  const { dispatchTransaction } = useDispatch();

  const { loading, error, data } = useTokenStatusQuery({
    variables: { id: onlineToken.id },
  });
  if (loading) return <Loading />;
  const { token } = data;

  const handleFreeze = async () => {
    dispatchTransaction({
      method: 'features.pauseToken',
      description: 'Freezing token',
      onSuccess: reset,
    });
  };

  const handleUnfreeze = async () => {
    dispatchTransaction({
      method: 'features.unpauseToken',
      description: 'Unfreezing token',
      onSuccess: reset,
    });
  };

  return (
    <>
      <h2>Freeze token</h2>
      <p>When token is frozen, all transfers are disabled</p>
      {token.isFrozen && <Alert message="Token is currently frozen." type="error" showIcon className="mb-3" />}
      {token.features.tokenFreeze ? (
        <p>
          {token.isFrozen ? (
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
