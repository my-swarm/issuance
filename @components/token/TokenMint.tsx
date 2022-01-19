import React, { ReactElement, useState } from 'react';
import { Alert, Button, Divider } from 'antd';

import { useAppState, useContract, useDispatch, useFeeInfo } from '@app';
import { parseUnits } from '@lib';
import { FeeTable, StakingForm, StakingFormData, TokenInfoFee } from '..';

interface Props {
  onCancel: () => void;
  refetch: () => void;
}

export function TokenMint({ onCancel, refetch }: Props): ReactElement {
  const [{ onlineToken: token }] = useAppState();
  const { swm } = useContract();
  const { checkAllowance, dispatchTransaction } = useDispatch();
  const [isStaked, setIsStaked] = useState<boolean>(false);
  const { fee, reloadSwmBalance } = useFeeInfo();

  const handleMint = async (values: StakingFormData) => {
    checkAllowance('minter', swm.address, fee, () => {
      dispatchTransaction({
        method: 'src20.mint',
        args: [parseUnits(values.supply, token.decimals)],
        description: 'Minting Your Token...',
        onSuccess: () => {
          reloadSwmBalance();
          setIsStaked(true);
        },
        syncCallbacks: [refetch],
      });
    });
  };

  return (
    <div>
      <TokenInfoFee />

      {isStaked ? (
        <>
          <Alert type="info" message="Your token has been minted!" className="mb-3" showIcon />
          <p>
            <Button onClick={onCancel} type="primary">
              Close
            </Button>
          </p>
        </>
      ) : (
        <StakingForm value={token.nav} onSubmit={handleMint} />
      )}

      <Divider />

      <h3>How does this work</h3>
      <ul>
        <li>
          When you click the <strong>Mint Tokens</strong> button, we first check (and increase if necessary) your SWM
          spending allowance. You have to sign a transaction for that.
        </li>
        <li>
          After that, the <strong>Mint</strong> function is run and the computed SWM amount is transfered from your
          wallet to the smart contract.
        </li>
      </ul>

      <h3>How is the stake amount computed</h3>
      <p>
        It&apos;s derived from your asset value using the table below. Fee is paid in SWM with the USD to SWM returned
        by the SwmPriceOracle contract.
      </p>
      <FeeTable />
    </div>
  );
}
