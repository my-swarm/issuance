import React, { ReactElement, useState } from 'react';
import { FundraiserDeployerState, TokenFundraiser } from '@lib';
import { FundraiserForm, DeployProgress } from '..';
import { useEthers, useAppState } from '@app';

interface TokenManageProps {
  onClose: () => void;
}

export function TokenStartFundraiser({ onClose }: TokenManageProps): ReactElement {
  const [{ token }, dispatch] = useAppState();
  const { networkId } = useEthers();
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const deployerState = token.networks[networkId]?.fundraiserDeployerState || FundraiserDeployerState.None;
  const isDeploying = deployerState !== FundraiserDeployerState.None;

  const handleSave = async (values: TokenFundraiser) => {
    saveToken(values);
    onClose();
  };

  const handleStart = async (values: TokenFundraiser) => {
    saveToken(values);
    setIsStarted(true);
  };

  function saveToken(fundraiser) {
    dispatch({
      type: 'updateToken',
      token: { id: token.id, fundraiser },
    });
  }

  return (
    <div>
      <FundraiserForm
        tokenName={token.name}
        onCancel={onClose}
        onSave={handleSave}
        onStart={handleStart}
        formData={token.fundraiser}
        disabled={isDeploying || isStarted}
      />
      {(isDeploying || isStarted) && (
        <>
          <h2>Fundraiser contract deployment</h2>
          <DeployProgress type="fundraiser" onClose={onClose} />
        </>
      )}
    </div>
  );
}
