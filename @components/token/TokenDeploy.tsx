import React, { ReactElement } from 'react';
import { Button, Divider } from 'antd';

import { useAppState, useEthers } from '@app';
import { DeployerState } from '@lib';
import { TokenInfoDeploy, TokenDeployProgress } from '..';

interface TokenDeployProps {
  onReview: () => void;
  onCancel: () => void;
}

export function TokenDeploy({ onReview, onCancel }: TokenDeployProps): ReactElement {
  const { networkId } = useEthers();
  const [{ localToken }] = useAppState();

  const deployerState = localToken.networks[networkId]?.deployerState;

  return (
    <>
      <TokenInfoDeploy />

      <Button onClick={onReview} disabled={deployerState != DeployerState.None}>
        Review/edit the token
      </Button>

      <Divider />
      <TokenDeployProgress onClose={onCancel} />
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
