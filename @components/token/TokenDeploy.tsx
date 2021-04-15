import React, { ReactElement } from 'react';
import { Button, Space } from 'antd';

import { useAppState, useContract, useDispatch, useEthers } from '@app';
import { TokenInfoAsset, TokenInfoBasics } from '..';
import { getFeaturesAsContractValue, LocalTokenState, parseUnits, storeKya, tokenToKya } from '@lib';

interface TokenDeployProps {
  onReview: () => void;
  onCancel: () => void;
}

export function TokenDeploy({ onReview, onCancel }: TokenDeployProps): ReactElement {
  const [{ localToken: token }, dispatch] = useAppState();
  const { dispatchTransaction } = useDispatch();
  const { registry, minter } = useContract();
  const { networkId } = useEthers();

  const handleDeployed = () => {
    console.log({
      type: 'setTokenState',
      id: token.id,
      networkId,
      state: LocalTokenState.Deployed,
    });
    dispatch({
      type: 'setTokenState',
      id: token.id,
      networkId,
      state: LocalTokenState.Deployed,
    });
    onCancel();
  };

  const handleDeploy = async () => {
    const { name, symbol, decimals, allowUnlimitedSupply, totalSupply, nav } = token;
    const kya = tokenToKya(token);
    const { kyaUri } = await storeKya(kya);

    let supply = totalSupply;
    if (!supply || allowUnlimitedSupply) supply = 0;

    dispatchTransaction({
      method: 'src20.deploy',
      args: [
        name,
        symbol,
        parseUnits(supply, decimals),
        kyaUri,
        nav || 0,
        getFeaturesAsContractValue(token),
        registry.address,
        minter.address,
      ],
      description: 'Deploying your token',
      onSuccess: handleDeployed,
    });
  };

  return (
    <>
      <TokenInfoBasics />
      <TokenInfoAsset />

      <Space>
        <Button onClick={onReview} size="large">
          Review/edit the token
        </Button>
        <Button onClick={handleDeploy} type="primary" size="large">
          Deploy now
        </Button>
      </Space>
    </>
  );
}
