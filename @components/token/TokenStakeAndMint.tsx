import React, { ReactElement, useState } from 'react';
import { Button, Divider } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { TokenDeployerState, Token, TokenState } from '@types';
import { TokenDeployer } from '@lib';
import { useEthers, useStateValue } from '@app';
import { StakeTable, TokenInfoStaking, TokenInfoMinting } from '..';

interface TokenStakeAndMintProps {
  token: Token;
  onCancel: () => void;
}

export function TokenStakeAndMint({ token, onCancel }: TokenStakeAndMintProps): ReactElement {
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const { signer, networkId } = useEthers();
  const [, dispatch] = useStateValue();

  const handleStakeAndMint = async () => {
    setIsDeploying(true);
    const deployer = new TokenDeployer(signer, token);
    await deployer.setup();
    try {
      await deployer.stakeAndMint();
      setTokenMinted();
    } catch (e) {
      let error;
      if (e.code === 4001) {
        error = {
          message: 'Transaction canceled',
          description:
            'You need to confirm both transactions (SWM spending and minting) in the Metamask popups. Note: SWM spending approval not required if you already have high enough allowance.',
        };
      } else if (e.code === -32000) {
        error = {
          message: 'Cannot stake SWM',
          description: "It appears your SWM balance is lower than what's required to stake",
        };
      } else if (e.code === -32603) {
        if (e.data.message.match(/trying to mint too many tokens/)) {
          error = {
            message: 'Cannot mint',
            description: 'It appears you have aleready minted your tokens.',
          };
          setTokenMinted();
        }
      } else {
        console.error(e);
        error = { message: 'Error during deployment', description: e.message };
      }
      dispatch({ type: 'showError', error });
    }
    setIsDeploying(false);
  };

  function setTokenMinted() {
    dispatch({
      type: 'setTokenState',
      id: token.id,
      networkId: networkId,
      state: TokenState.Minted,
    });
  }

  const tokenState = token.networks[networkId].state;

  return (
    <div>
      <TokenInfoStaking token={token} />
      <TokenInfoMinting token={token} />
      <div className="mb-3">
        {tokenState === TokenState.Minted ? (
          <Button size="large" onClick={onCancel}>
            Token minted! Close.
          </Button>
        ) : isDeploying ? (
          <Button disabled size="large">
            <LoadingOutlined /> Minting in progress
          </Button>
        ) : (
          <Button type="primary" size="large" onClick={handleStakeAndMint}>
            Stake &amp; Mint
          </Button>
        )}
      </div>
      <Divider />

      <h3>How does this work</h3>
      <ul>
        <li>
          When you click the <strong>Stake &amp; Mint</strong> button, we first check (and increase if necessary) your
          SWM spending allowance. You have to sign a transaction for that.
        </li>
        <li>
          After that, the <strong>Mint</strong> function is run and the computed SWM amount is transfered from your
          wallet to the smart contract.
        </li>
      </ul>

      <h3>How is the stake amount computed</h3>
      <p>It's derived from your asset value using the table below</p>
      <StakeTable />
    </div>
  );
}
