import React, { ReactElement, useEffect, useState } from 'react';

import {
  Deployer,
  DeployerState,
  DeployerStateFinished,
  DeployerStateNone,
  LocalTokenAddresses,
  TokenDeployer,
  TokenState,
} from '@lib';
import { isDev, useAppState, useEthers } from '@app';
import { DeployProgress } from './DeployProgress';

interface TokenDeployProgressProps {
  onClose: () => void;
}

export function TokenDeployProgress({ onClose }: TokenDeployProgressProps): ReactElement {
  const { signer, networkId } = useEthers();
  const [{ localToken }, dispatch] = useAppState();
  const [deployer, setDeployer] = useState<Deployer>();

  useEffect(() => {
    (async () => {
      if (signer && localToken) {
        const tokenNetwork = localToken.networks[networkId];
        const deployerState = tokenNetwork?.deployerState || DeployerStateNone;

        const d = new TokenDeployer(signer, tokenNetwork?.addresses || {});
        await d.setup(localToken);
        d.onProgress(handleDeployProgress);
        d.resume(deployerState, tokenNetwork?.addresses || ({} as LocalTokenAddresses));
        setDeployer(d);
      }
    })();
  }, [signer, localToken.id]);

  const handleDeployProgress = (deployer: Deployer) => {
    dispatch({
      type: 'updateTokenNetwork',
      id: localToken.id,
      networkId: networkId,
      networkData: {
        state: deployer.state === DeployerStateFinished ? TokenState.Deployed : TokenState.Deploying,
        deployerState: deployer.state,
        addresses: deployer.addresses,
      },
    });
  };

  return <DeployProgress deployer={deployer} onClose={onClose} />;
}
