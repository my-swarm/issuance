import { Button, Progress } from 'antd';
import React, { MouseEventHandler, ReactElement, useState } from 'react';
import {
  DeployerState,
  DeployerStatesMeta,
  FundraiserDeployerState,
  Token,
  TokenDeployerState,
  TokenState,
  TransactionState,
} from '@types';
import { fundraiserDeployerStatesMeta, tokenDeployerStatesMeta, transactionStatesMeta } from '@const';
import { Deployer, TokenDeployer, FundraiserDeployer } from '../../@lib';
import { LoadingOutlined } from '@ant-design/icons';
import { RequireEthers } from './RequireEthers';
import { useEthers, useStateValue } from '@app';

interface DeployProgressProps {
  token: Token;
  type: 'token' | 'fundraiser';
  onClose: MouseEventHandler;
}

export function DeployProgress({ token, type, onClose }: DeployProgressProps): ReactElement {
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [, dispatch] = useStateValue();
  const { signer, networkId } = useEthers();
  const tokenNetwork = token.networks[networkId];
  let deployerState: DeployerState;
  const [transactionState, setTransactionState] = useState<TransactionState>(TransactionState.None);

  // these are initialized depending on deployer type (token/fundraiser)
  let deployer: Deployer;
  let stateField: string;
  let deployerStatesMeta: DeployerStatesMeta;
  if (type === 'token') {
    stateField = 'deployerState';
    deployerState = tokenNetwork?.deployerState || TokenDeployerState.None;
    deployerStatesMeta = tokenDeployerStatesMeta;
  } else if (type === 'fundraiser') {
    stateField = 'fundraiserDeployerState';
    deployerState = tokenNetwork?.fundraiserDeployerState || FundraiserDeployerState.None;
    deployerStatesMeta = fundraiserDeployerStatesMeta;
  }
  const deployerStateMeta = deployerStatesMeta[deployerState];
  console.log({ deployerState, deployerStatesMeta, deployerStateMeta });
  const transactionStateMeta = transactionStatesMeta[transactionState];

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
        error = { message: 'Error during deployment', description: e.message };
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

    await deployer.setup();
    deployer.resume(deployerState, tokenNetwork?.addresses || {});
    deployer.onProgress(handleDeployProgress);
    deployer.onTransactionProgress(handleTransactionProgress);
  }

  const handleDeployProgress = (newState: TokenDeployerState) => {
    console.log('handleDeployProgress', newState);
    dispatch({
      type: 'updateTokenNetwork',
      id: token.id,
      networkId: networkId,
      networkData: {
        state: newState === TokenDeployerState.Finished ? TokenState.Deployed : TokenState.Deploying,
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

      {deployerState === TokenDeployerState.Finished ? (
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
          {deployerState === TokenDeployerState.None ? 'Start deployment now!' : 'Resume deployment'}
        </Button>
      )}
    </RequireEthers>
  );
}
