import React, { ReactElement, useState } from 'react';
import { Button, Space, Modal } from 'antd';

import { useAppState, useContract, useDispatch, useEthers } from '@app';
import { TokenInfoAsset, TokenInfoBasics } from '..';
import {
  getFeaturesAsContractValue,
  getFeaturesOptionsAbiEncoded,
  getNetwork,
  LocalTokenState,
  parseUnits,
  storeKya,
  tokenToKya,
} from '@lib';
import { LoadingOutlined } from '../../@lib/icons';

interface TokenDeployProps {
  onReview: () => void;
  onCancel: () => void;
}

export function TokenDeploy({ onReview, onCancel }: TokenDeployProps): ReactElement {
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [{ localToken: token }, dispatch] = useAppState();
  const { dispatchTransaction } = useDispatch();
  const { registry, minter } = useContract();
  const { networkId } = useEthers();

  const handleDeployed = () => {
    dispatch({
      type: 'setTokenState',
      id: token.id,
      networkId,
      state: LocalTokenState.Deployed,
    });
    setIsDeploying(false);
    onCancel();
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    const { name, symbol, decimals, allowUnlimitedSupply, totalSupply, nav } = token;
    const kya = tokenToKya(token);
    let kyaUri;
    try {
      ({ kyaUri } = await storeKya(kya));
    } catch (e) {
      setIsDeploying(false);
      Modal.error({
        title: 'Error while deploying',
        content: (
          <>
            <p>{e.message}</p>
            <p>Please contact us if problem persists.</p>
          </>
        ),
      });
      return;
    }

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
        getFeaturesOptionsAbiEncoded(token),
        registry.address,
        minter.address,
      ],
      description: 'Deploying your token',
      onSuccess: handleDeployed,
      onError: () => setIsDeploying(false),
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
        <Button onClick={handleDeploy} type="primary" size="large" disabled={isDeploying}>
          {isDeploying && <LoadingOutlined className="mr-1" />}
          Deploy to&nbsp;<strong>{getNetwork(networkId)}</strong>
        </Button>
      </Space>
    </>
  );
}
