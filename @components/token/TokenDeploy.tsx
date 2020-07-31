import React, { ReactElement, useContext, useState } from 'react';
import { Button, Progress } from 'antd';
import { Uuid } from '@types';
import { EthersContext, useStateValue } from '@app';
import {
  TokenDeployer,
  TokenDeployerEvent,
  TokenDeployerState,
  tokenDeployerStateMeta,
  TokenDeployerStateMeta,
  TransactionEvent,
  TransactionState,
  TransactionStateMeta,
  transactionStateMeta,
} from '@lib';
import { ProgressProps } from 'antd/lib/progress';

interface TokenDeployProps {
  id: Uuid;
}

export function TokenDeploy({ id }: TokenDeployProps): ReactElement {
  const [state, setState] = useState<TokenDeployerState>(TokenDeployerState.None);
  const [stateMeta, setStateMeta] = useState<TokenDeployerStateMeta>(tokenDeployerStateMeta[TokenDeployerState.None]);
  const [transactionMeta, setTransactionMeta] = useState<TransactionStateMeta>(
    transactionStateMeta[TransactionState.None],
  );
  const [{ tokens }, dispatch] = useStateValue();
  const { signer } = useContext(EthersContext);

  const token = tokens.find((t) => t.id === id);

  const handleDeploy = async () => {
    const deployer = new TokenDeployer(token, signer);
    deployer.onProgress((event: TokenDeployerEvent) => {
      setState(event.state);
      setStateMeta(event.meta);
      console.log('onProgress event', event);
    });
    deployer.onTransactionProgress((event: TransactionEvent) => {
      setTransactionMeta(event.meta);
    });
    await deployer.deploy();
    console.log('we are done');
  };

  let progressStatus: ProgressProps['status'] = 'normal';
  if (state === TokenDeployerState.Error) {
    progressStatus = 'exception';
  } else if (state !== TokenDeployerState.DeployFinished) {
    progressStatus = 'active';
  }
  return (
    <>
      <p>So you want to deploy a token, right?</p>
      <p>Good luck, mate!</p>
      <Button onClick={handleDeploy}>Deploy the shit</Button>

      <h2>Deployment progress</h2>
      <Progress percent={stateMeta.percent} status={progressStatus} />
      <p>{stateMeta.title}</p>
      <p>{transactionMeta.title}</p>
    </>
  );
}
