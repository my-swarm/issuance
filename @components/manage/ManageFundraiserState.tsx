import React, { ReactElement } from 'react';
import { Button, Popconfirm, Tag } from 'antd';
import { useContractAddress, useDispatch, useGraphql } from '@app';
import { FundraiserStatus, FundraiserWithContributorsFragment } from '@graphql';
import { BigNumber } from 'ethers';
import { CheckOutlined, WarningOutlined } from '@ant-design/icons';
import { formatUnits, parseUnits, BASE_CURRENCIES, SWM_TOKEN_DECIMALS } from '@lib';

interface ManageFundraiserStateProps {
  fundraiser: FundraiserWithContributorsFragment;
}

const baseCurrency = BASE_CURRENCIES.USDC;

export function ManageFundraiserState({ fundraiser }: ManageFundraiserStateProps): ReactElement {
  const { dispatchTransaction, checkAllowance } = useDispatch();
  const { swm: swmAddress } = useContractAddress();
  const { reset } = useGraphql();

  const handleCancel = () => {
    dispatchTransaction({
      method: 'fundraiser.cancel',
      description: 'Canceling the fundraiser.',
      onSuccess: () => {
        alert('What now?');
      },
    });
  };

  const handleStakeAndMint = async () => {
    const stakeAmount = 1000; //await minter.calcStake(fundraiser.token.nav);
    checkAllowance(
      ['fundraiser', fundraiser.address],
      fundraiser.token.address,
      parseUnits(1000, SWM_TOKEN_DECIMALS),
      () => {
        checkAllowance('registry', swmAddress, parseUnits(1000, SWM_TOKEN_DECIMALS), () => {
          dispatchTransaction({
            method: 'fundraiser.stakeAndMint',
            description: 'Staking and minting...',
            onSuccess: () => {
              reset();
            },
          });
        });
      },
    );
  };

  const statusFinished = fundraiser.status === FundraiserStatus.Finished;
  const statusRunning = fundraiser.status === FundraiserStatus.Running;
  const amountQualified = BigNumber.from(fundraiser.amountQualified);
  const softCap = BigNumber.from(fundraiser.softCap);
  const hardCap = BigNumber.from(fundraiser.hardCap);
  const raisedEnoughSoft = amountQualified.gte(softCap);
  const raisedEnoughHard = amountQualified.gte(hardCap);
  const afterEndDate = fundraiser.endDate < Date.now() / 1000;
  const allowStakeAndMint = statusRunning && (raisedEnoughHard || (raisedEnoughSoft && afterEndDate));

  const raisedSoft = (
    <>
      Soft Cap: raised <strong>{formatUnits(amountQualified, baseCurrency.decimals)}</strong> of{' '}
      <strong>{formatUnits(softCap, baseCurrency.decimals)}</strong> {baseCurrency.symbol}
    </>
  );

  const raisedHard = (
    <>
      Hard Cap: raised <strong>{formatUnits(amountQualified, baseCurrency.decimals)}</strong> of{' '}
      <strong>{formatUnits(hardCap, baseCurrency.decimals)}</strong> {baseCurrency.symbol}
    </>
  );

  return (
    <div>
      {/*
      {!statusFinished && (
        <>
          <h2>Cancel fundraiser</h2>
          <p>Stops the fundraiser and returns all funds back to contributors.</p>
          <p>
            <Popconfirm
              title="Are you 100% sure you want to cancel the fundraiser? There is no way back!"
              onConfirm={handleCancel}
            >
              <Button size="large" type="primary" danger>
                Cancel fundraiser
              </Button>
            </Popconfirm>
          </p>
        </>
      )}
      <h2>Stake and mint</h2>
*/}
      {statusFinished ? (
        <p>Fundraiser is finished and your tokens should already be minted</p>
      ) : (
        <>
          {allowStakeAndMint ? (
            <p>Your token is ready to be minted</p>
          ) : (
            <>
              <p>Tokens can be minted when one of these conditions is true:</p>
              <ul>
                <li>Hard Cap is reached</li>
                <li>Soft Cap is reached and the fundraiser is beyond the end date</li>
              </ul>
            </>
          )}

          <div className="mb-2">
            {raisedEnoughSoft ? (
              <Tag color="green">
                <CheckOutlined /> {raisedSoft}
              </Tag>
            ) : (
              <Tag color="red">
                <WarningOutlined /> {raisedSoft}
              </Tag>
            )}
          </div>
          <div className="mb-2">
            {raisedEnoughHard ? (
              <Tag color="green">
                <CheckOutlined /> {raisedHard}
              </Tag>
            ) : (
              <Tag color="red">
                <WarningOutlined /> {raisedHard}
              </Tag>
            )}
          </div>
          <div className="mb-2">
            {afterEndDate ? (
              <Tag color="green">
                <CheckOutlined /> End Date: reached
              </Tag>
            ) : (
              <Tag color="red">
                <WarningOutlined /> End Date: not reached
              </Tag>
            )}
          </div>

          <p>
            <Button disabled={!allowStakeAndMint} size="large" type="primary" onClick={handleStakeAndMint}>
              Stake &amp; Mint
            </Button>
          </p>
        </>
      )}
    </div>
  );
}
