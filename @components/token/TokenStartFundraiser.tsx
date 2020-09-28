import React, { ReactElement, useState } from 'react';
import { FundraiserDeployerState, Token, TokenFundraiser } from '@types';
import { FundraiserForm, DeployProgress } from '..';
import { useEthers, useAppState } from '@app';

interface TokenManageProps {
  token: Token;
  onClose: () => void;
}

export function TokenStartFundraiser({ token, onClose }: TokenManageProps): ReactElement {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const { networkId } = useEthers();
  const [, dispatch] = useAppState();
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
          <DeployProgress token={token} type="fundraiser" onClose={onClose} />
        </>
      )}
    </div>
  );
}
