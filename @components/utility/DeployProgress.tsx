import React, { ReactElement, useState, useEffect } from 'react';
import { RequireEthers } from '@components';
import { Button, Progress } from 'antd';
import {
  Deployer,
  DeployerStateFinished,
  DeployerStateNone,
  TransactionState,
  transactionStatesMeta,
  deployerStatesMeta,
  DeployerState,
} from '@lib';
import { LoadingOutlined } from '@lib/icons';
import { useDispatch, useGraphql } from '@app';

interface DeployProgressProps {
  deployer: Deployer;
  onClose: () => void;
}

export function DeployProgress({ deployer, onClose }: DeployProgressProps): ReactElement {
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [transactionState, setTransactionState] = useState<TransactionState>(TransactionState.None);
  const { dispatchError } = useDispatch();
  const { reset } = useGraphql();
  useEffect(() => {
    if (deployer) {
      deployer.onTransactionProgress(handleTransactionProgress);
      deployer.onProgress(handleProgress);
    }
  }, [deployer]);

  const handleProgress = (deployer: Deployer) => {
    if (deployer.state === DeployerState.Finished) {
      reset();
    }
  };

  const handleTransactionProgress = (event: TransactionState) => {
    setTransactionState(event);
  };

  const transactionStateMeta = transactionStatesMeta[transactionState];

  const handleStart = async () => {
    setIsDeploying(true);
    try {
      await deployer.deploy();
    } catch (e) {
      let error;
      if (e.code === 4001) {
        error = {
          message: 'Transaction canceled',
          description:
            'You need to confirm (sign) all transactions in the Metamask popups.\nYou can resume your token deployment later.',
        };
      } else {
        console.error(e);
        error = {
          message: 'Error during deployment',
          description: `${e.message} - ${e.reason} - If the error message makes no sense to you, contact us!`,
        };
      }
      dispatchError(error.message, error.description);
    }
    setIsDeploying(false);
  };
  if (!deployer) return null;

  const state = deployer.state;
  const meta = deployerStatesMeta[state];

  return (
    <RequireEthers>
      <Progress percent={meta.percent} status={meta.percent === 100 ? 'normal' : 'active'} />
      <h3 className="mt-3">{meta.message}</h3>
      {meta.description && <div>{meta.description}</div>}
      {meta.percent > 0 && meta.percent < 100 && <p>{transactionStateMeta.message}</p>}

      {state === DeployerStateFinished ? (
        <Button onClick={onClose} size="large">
          Close
        </Button>
      ) : isDeploying ? (
        <>
          <Button disabled>
            <LoadingOutlined /> deploying your token
          </Button>
        </>
      ) : (
        <Button onClick={handleStart} type="primary" size="large">
          {state === DeployerStateNone ? 'Start deployment now!' : 'Resume deployment'}
        </Button>
      )}
    </RequireEthers>
  );
}
