import React, { ReactElement, useContext, useState } from 'react';
import { Button, Divider, Progress, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { deployerStateMeta, transactionStateMeta } from '@app/const';
import { TransactionState, DeployerState, TokenAddresses, Token, TokenState } from '@types';
import { useEthers, useStateValue } from '@app';
import { Deployer } from '@lib';
import { TokenInfoGeneral, RequireEthers } from '..';

interface TokenDeployProps {
  token: Token;
  onReview: () => void;
  onCancel: () => void;
}

export function TokenDeploy({ token, onReview, onCancel }: TokenDeployProps): ReactElement {
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [transactionState, setTransactionState] = useState<TransactionState>(TransactionState.None);
  const [, dispatch] = useStateValue();
  const { signer, networkId } = useEthers();
  const tokenNetwork = token.networks[networkId];
  const [deployerState, setDeployerState] = useState<DeployerState>(tokenNetwork?.deployerState || DeployerState.None);
  const [addresses, setAddresses] = useState<TokenAddresses>(tokenNetwork?.addresses || undefined);

  let deployer: Deployer;

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
    deployer = new Deployer(signer, token);
    await deployer.setup();
    deployer.resume(deployerState, addresses);
    deployer.onProgress(handleDeployProgress);
    deployer.onTransactionProgress(handleTransactionProgress);
  }

  const handleDeployProgress = (newState: DeployerState) => {
    setDeployerState(newState);
    setAddresses(deployer.addresses);
    dispatch({
      type: 'updateTokenNetwork',
      id: token.id,
      networkId: networkId,
      networkData: {
        state: newState === DeployerState.Finished ? TokenState.Deployed : TokenState.Deploying,
        deployerState: newState,
        addresses: deployer.addresses,
      },
    });
  };

  const handleTransactionProgress = (event: TransactionState) => {
    setTransactionState(event);
  };

  function getProgressStatus() {
    if (deployerState !== DeployerState.Finished) {
      return 'active';
    }
    return 'normal';
  }

  function getPercent() {
    return deployerStateMeta[deployerState].percent;
  }

  function getMessage() {
    return deployerStateMeta[deployerState].message;
  }

  function getDescription() {
    const meta = deployerStateMeta[deployerState];
    if (!meta) {
      return null;
    }
    return <p>{meta.description}</p>;
  }

  function getTransactionMessage() {
    return transactionStateMeta[transactionState].message;
  }

  return (
    <>
      <TokenInfoGeneral token={token} />
      <Button onClick={onReview} disabled={deployerState != DeployerState.None}>
        Review/edit the token
      </Button>
      <Divider />
      <RequireEthers>
        <Progress percent={getPercent()} status={getProgressStatus()} />
        <h3 className="mt-3">{getMessage()}</h3>
        {getDescription()}

        {deployerState === DeployerState.Finished ? (
          <>
            <Space>
              <Button onClick={onCancel} size="large">
                Close
              </Button>
            </Space>
          </>
        ) : isDeploying ? (
          <>
            {deployerState !== DeployerState.None && <p>{getTransactionMessage()}</p>}
            <Button disabled>
              <LoadingOutlined /> deploying your token
            </Button>
          </>
        ) : (
          <Button onClick={handleDeploy} type="primary" size="large">
            {deployerState === DeployerState.None ? 'Deploy your token' : 'Resume deployment'}
          </Button>
        )}
      </RequireEthers>
      <Divider />
      <h3>How does this work</h3>
      <ul>
        <li>
          Token deploys in four steps. Three helper contracts are deployed first before the main token contract is
          deployed.
        </li>
        <li>
          Each step requires you to sign an Ethereum transaction. Make sure you have some ETH ready in your account.
        </li>
        <li>Deployed token can later be minted (for existing backed asset) or a fundraiser can be started.</li>
        <li>The progress is saved after each transaction and can be resumed at any point later.</li>
        <li>
          The process takes about a minute in total. You will be shown the overall progress and contextual information.
        </li>
      </ul>
    </>
  );
}
