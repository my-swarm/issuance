import React, { ReactElement, useContext, useState } from 'react';
import { Button, Progress, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { deployerStateMeta, transactionStateMeta } from '@app/const';

import { Uuid, TransactionState, DeployerState, TokenAddresses } from '@types';
import { EthersContext, useStateValue } from '@app';
import { Deployer } from '@lib';

interface TokenDeployProps {
  id: Uuid;
}

export function TokenDeploy({ id }: TokenDeployProps): ReactElement {
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [transactionState, setTransactionState] = useState<TransactionState>(TransactionState.None);
  const [{ tokens }, dispatch] = useStateValue();
  const { signer, networkId } = useContext(EthersContext);
  console.log({ signer, networkId });
  const token = tokens.find((t) => t.id === id);
  const [state, setState] = useState<DeployerState>(token.deployerState || DeployerState.None);
  const [visualState, setVisualState] = useState<DeployerState>(token.deployerState || DeployerState.None);
  const [addresses, setAddresses] = useState<TokenAddresses>(
    (token.addresses && token.addresses[networkId]) || undefined,
  );

  const handleDeploy = async () => {
    const deployer = new Deployer(signer);
    deployer.resume(state, addresses);
    deployer.onProgress((state: DeployerState) => {
      console.log('onProgress event', state);
      const meta = deployerStateMeta[state];
      if (meta.visual) {
        setVisualState(state);
      }
      if (meta.persistent) {
        setState(state);
        setAddresses(deployer.addresses);
        console.log('persisting', state, deployer.addresses);
      }
    });
    deployer.contractProxy.onProgress((event: TransactionState) => {
      setTransactionState(event);
    });
    try {
      setIsDeploying(true);
      await deployer.deploy(token);
    } catch (e) {
      let error;
      if (e.code === 4001) {
        error = {
          message: 'Transaction canceled',
          description: 'Please confirm the transaction in your metamask popup',
        };
      } else {
        console.error(e);
        error = { message: 'Error during deployment', description: e.message };
      }
      dispatch({ type: 'showError', error });
    }
    setIsDeploying(false);
  };

  function getProgressStatus() {
    if (visualState === DeployerState.Error) {
      return 'exception';
    }
    if (visualState !== DeployerState.DeployFinished) {
      return 'active';
    }
    return 'normal';
  }

  function getPercent() {
    return deployerStateMeta[visualState].percent;
  }

  function getMessage() {
    return deployerStateMeta[visualState].message;
  }

  function getDescription() {
    const meta = deployerStateMeta[visualState];
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
      <Progress percent={getPercent()} status={getProgressStatus()} />
      <h3 className="mt-3">{getMessage()}</h3>
      {getDescription()}
      {visualState !== DeployerState.None && <p>{getTransactionMessage()}</p>}

      {isDeploying ? (
        <Button disabled>
          <LoadingOutlined /> deploying your token
        </Button>
      ) : (
        <Button onClick={handleDeploy}>
          {visualState === DeployerState.None ? 'Deploy your token' : 'Resume deployment'}
        </Button>
      )}
    </>
  );
}
