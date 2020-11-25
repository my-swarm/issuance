import { Button, Progress } from 'antd';
import React, { MouseEventHandler, ReactElement, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

import {
  Deployer,
  DeployerState,
  DeployerStateFinished,
  DeployerStateNone,
  DeployerStatesMeta,
  FundraiserDeployer,
  FundraiserDeployerState,
  TokenDeployer,
  TokenState,
  TransactionState,
  fundraiserDeployerStatesMeta,
  tokenDeployerStatesMeta,
  transactionStatesMeta,
} from '@lib';
import { useAppState, useEthers } from '@app';

import { RequireEthers } from './RequireEthers';

interface DeployProgressProps {
  type: 'token' | 'fundraiser';
  onClose: MouseEventHandler;
}

export function DeployProgress({ type, onClose }: DeployProgressProps): ReactElement {
  const { signer, networkId } = useEthers();
  const [{ token }, dispatch] = useAppState();
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const tokenNetwork = token.networks[networkId];
  let deployerState: DeployerState;
  const [transactionState, setTransactionState] = useState<TransactionState>(TransactionState.None);

  // these are initialized depending on deployer type (token/fundraiser)
  let deployer: Deployer;
  let stateField: string;
  let deployerStatesMeta: DeployerStatesMeta;
  if (type === 'token') {
    stateField = 'deployerState';
    deployerState = tokenNetwork?.deployerState || DeployerStateNone;
    deployerStatesMeta = tokenDeployerStatesMeta;
  } else if (type === 'fundraiser') {
    stateField = 'fundraiserDeployerState';
    deployerState = tokenNetwork?.fundraiserDeployerState || FundraiserDeployerState.None;
    deployerStatesMeta = fundraiserDeployerStatesMeta;
  }
  const deployerStateMeta = deployerStatesMeta[deployerState];
  const transactionStateMeta = transactionStatesMeta[transactionState];
  console.log({ deployerState, deployerStateMeta });

  const handleDeploy = async () => {
    await setupDeployer();
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
      dispatch({ type: 'showError', error });
    }
    setIsDeploying(false);
  };

  async function setupDeployer() {
    if (type === 'token') {
      deployer = new TokenDeployer(signer, token);
    } else if (type === 'fundraiser') {
      deployer = new FundraiserDeployer(signer, token);
    }
    console.log('setup deployer', type, deployer);

    await deployer.setup();
    deployer.resume(deployerState, tokenNetwork?.addresses || {});
    deployer.onProgress(handleDeployProgress);
    deployer.onTransactionProgress(handleTransactionProgress);
  }

  const handleDeployProgress = (newState: DeployerState) => {
    const deployingState = type === 'token' ? TokenState.Deploying : TokenState.DeployingFundraiser;
    const deployedState = type === 'token' ? TokenState.Deployed : TokenState.Fundraising;
    dispatch({
      type: 'updateTokenNetwork',
      id: token.id,
      networkId: networkId,
      networkData: {
        state: newState === DeployerStateFinished ? deployedState : deployingState,
        [stateField]: newState,
        addresses: deployer.addresses,
      },
    });
  };

  const handleTransactionProgress = (event: TransactionState) => {
    setTransactionState(event);
  };

  return (
    <RequireEthers>
      <Progress percent={deployerStateMeta.percent} status={deployerStateMeta.percent === 100 ? 'normal' : 'active'} />
      <h3 className="mt-3">{deployerStateMeta.message}</h3>
      {deployerStateMeta.description && <p>{deployerStateMeta.description}</p>}
      {deployerStateMeta.percent > 0 && deployerStateMeta.percent < 100 && <p>{transactionStateMeta.message}</p>}

      {deployerState === DeployerStateFinished ? (
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
        <Button onClick={handleDeploy} type="primary" size="large">
          {deployerState === DeployerStateNone ? 'Start deployment now!' : 'Resume deployment'}
        </Button>
      )}
    </RequireEthers>
  );
}
