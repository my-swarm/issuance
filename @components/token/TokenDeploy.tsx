import React, { ReactElement, useContext, useState } from 'react';
import { Button, Progress } from 'antd';
import { ProgressProps } from 'antd/lib/progress';

import { Uuid, TransactionState, DeployerState } from '@types';
import { EthersContext, useStateValue } from '@app';
import { Deployer } from '@lib';

interface TokenDeployProps {
  id: Uuid;
}

const stateMeta = {
  [DeployerState.None]: {
    message: 'Ready to deploy',
    description:
      "To start the deployment process, just click the button. You'll be asked for signatures when necessary",
    percent: 0,
  },
  [DeployerState.TransferRulesStarted]: {
    message: 'Deploying transfer rules contract',
    description: 'Transfer rules define the restrictions on who may transfer your token to whom',
    percent: 10,
  },
  [DeployerState.FeaturesStarted]: {
    message: 'Deploying token features contract',
    description: 'This contract stores your token configuration',
    percent: 20,
  },
  [DeployerState.FeaturesFinished]: {
    message: 'Token features contract deployed',
    percent: 30,
  },
  [DeployerState.RolesStarted]: {
    message: 'Deploying roles contract',
    percent: 20,
  },
  [DeployerState.RolesFinished]: {
    message: 'Roles contract deployed',
    percent: 30,
  },
  [DeployerState.DeployFinished]: {
    message: "Deployment hasn't started yet",
    percent: 30,
  },
  [DeployerState.Error]: {
    message: "Deployment hasn't started yet",
    percent: 30,
  },
};

export const transactionStateMeta = {
  [TransactionState.None]: {
    message: "Transaction hasn't been initiated yet",
  },
  [TransactionState.Signing]: {
    message: 'Waiting for transaction signature',
  },
  [TransactionState.Confirming]: {
    message: 'Waiting for network confirmation',
  },
  [TransactionState.Confirmed]: {
    message: 'Done',
  },
};

export function TokenDeploy({ id }: TokenDeployProps): ReactElement {
  const [state, setState] = useState<DeployerState>(DeployerState.None);
  const [transactionState, setTransactionState] = useState<TransactionState>(TransactionState.None);
  const [{ tokens }, dispatch] = useStateValue();
  const { signer, networkId } = useContext(EthersContext);

  const token = tokens.find((t) => t.id === id);

  const handleDeploy = async () => {
    const deployer = new Deployer(signer);
    deployer.onProgress((state: DeployerState) => {
      console.log('onProgress event', state);
      if (stateMeta[state]) {
        setState(state);
      }
      token.deployerState = state;
      token.addresses[this.networkId] = deployer.addresses;
    });
    deployer.contractProxy.onProgress((event: TransactionState) => {
      setTransactionState(event);
    });
    try {
      await deployer.deploy(token);
    } catch (e) {
      dispatch({ type: 'showError', message: 'Your token could not be deployed' });
    }
  };

  function getProgressStatus() {
    if (state === DeployerState.Error) {
      return 'exception';
    }
    if (state !== DeployerState.DeployFinished) {
      return 'active';
    }
    return 'normal';
  }

  function getPercent() {
    return stateMeta[state].percent;
  }

  function getMessage() {
    return stateMeta[state].message;
  }

  function getDescription() {
    const meta = stateMeta[state];
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
      <p>So you want to deploy a token, right?</p>
      <p>Good luck, mate!</p>
      <Button onClick={handleDeploy}>Deploy the shit</Button>

      <h2>Deployment progress</h2>
      <Progress percent={getPercent()} status={getProgressStatus()} />
      <h3>{getMessage()}</h3>
      {getDescription()}
      <p>{getTransactionMessage()}</p>
    </>
  );
}
