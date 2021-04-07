import React, { ReactElement } from 'react';
import { Button, Space } from 'antd';

import { useAppState, useContract, useDispatch } from '@app';
import { TokenInfoBasics } from '..';
import { getFeaturesAsContractValue, parseUnits, storeKya, tokenToKya } from '@lib';

interface TokenDeployProps {
  onReview: () => void;
  onCancel: () => void;
}

export function TokenDeploy({ onReview, onCancel }: TokenDeployProps): ReactElement {
  const [{ localToken: token }] = useAppState();
  const { dispatchTransaction } = useDispatch();
  const { registry, minter } = useContract();

  const handleDeploy = async () => {
    const { name, symbol, decimals, allowUnlimitedSupply, totalSupply, assetNetValue } = token;
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
        assetNetValue || 0,
        getFeaturesAsContractValue(token),
        registry.address,
        minter.address,
      ],
      description: 'Deploying your token',
      onSuccess: onCancel,
    });
  };

  return (
    <>
      <TokenInfoBasics />

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
