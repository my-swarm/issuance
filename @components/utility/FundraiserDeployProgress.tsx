import React, { ReactElement, useEffect, useState } from 'react';

import {
  Deployer,
  DeployerStateFinished,
  DeployerStateNone,
  FundraiserDeployer,
  LocalTokenAddresses,
  TokenState,
} from '@lib';
import { isDev, useAppState, useEthers } from '@app';
import { DeployProgress } from './DeployProgress';

interface FundraiserDeployProgressProps {
  onClose: () => void;
}

export function FundraiserDeployProgress({ onClose }: FundraiserDeployProgressProps): ReactElement {
  const { signer, networkId } = useEthers();
  const [{ onlineToken, fundraisers }, dispatch] = useAppState();
  const [deployer, setDeployer] = useState<Deployer>();
  const tokenAddress = onlineToken.address;

  const handleDeployProgress = (deployer: FundraiserDeployer) => {
    console.log('deployer progress', deployer.state, deployer.addresses);
    dispatch({
      type: 'updateFundraiserNetwork',
      tokenAddress: tokenAddress,
      networkId: networkId,
      networkData: {
        state: deployer.state === DeployerStateFinished ? TokenState.Fundraising : TokenState.DeployingFundraiser,
        deployerState: deployer.state,
        addresses: deployer.addresses,
      },
    });
  };

  useEffect(() => {
    (async () => {
      if (signer && tokenAddress) {
        const fundraiser = fundraisers[tokenAddress];
        const network = fundraiser.networks?.[networkId];
        const deployerState = network?.deployerState || DeployerStateNone;

        const d = new FundraiserDeployer(signer, network?.addresses);
        await d.setup(fundraiser, onlineToken.address, onlineToken.decimals);
        d.onProgress(handleDeployProgress);
        d.resume(deployerState, network?.addresses || ({} as LocalTokenAddresses));
        setDeployer(d);
      }
    })();
  }, [signer, tokenAddress]);

  if (!deployer) return null;

  return <DeployProgress deployer={deployer} onClose={onClose} />;
}
