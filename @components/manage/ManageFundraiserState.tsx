import React, { ReactElement } from 'react';
import { Button, Popconfirm, Tag } from 'antd';
import { useContractAddress, useDispatch, useGraphql } from '@app';
import { FundraiserInfoFragment, FundraiserStatus } from '@graphql';
import { BigNumber } from 'ethers';
import { CheckOutlined, WarningOutlined } from '@ant-design/icons';
import { formatUnits, parseUnits } from '@lib';
import { BASE_CURRENCIES, SWM_TOKEN_DECIMALS } from '@const';

interface ManageFundraiserStateProps {
  fundraiser: FundraiserInfoFragment;
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

  const handleStakeAndMint = () => {
    checkAllowance('registry', swmAddress, parseUnits(1000, SWM_TOKEN_DECIMALS), () => {
      dispatchTransaction({
        method: 'fundraiser.stakeAndMint',
        description: 'Staking and minting...',
        onSuccess: () => {
          reset();
        },
      });
    });
  };

  const statusRunning = fundraiser.status === FundraiserStatus.Running;
  const amountQualified = BigNumber.from(fundraiser.amountQualified);
  const softCap = BigNumber.from(fundraiser.softCap);
  const raisedEnough = amountQualified.gt(softCap);
  const allowStakeAndMint = statusRunning && raisedEnough;

  const raised = (
    <>
      Raised <strong>{formatUnits(amountQualified, baseCurrency.decimals)}</strong> of{' '}
      <strong>{formatUnits(softCap, baseCurrency.decimals)}</strong> {baseCurrency.symbol}
    </>
  );

  return (
    <div>
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
      <h2>Stake and mint</h2>
      <p>When fundraiser is finished, you&apos;ll ba able to Stake SWM and mint your tokens here</p>
      <p>
        {statusRunning ? (
          <Tag color="green">
            <CheckOutlined /> Fundraiser is running
          </Tag>
        ) : (
          <Tag color="red">
            <WarningOutlined /> Fundraiser status is <strong>{fundraiser.status}</strong>
          </Tag>
        )}
        {raisedEnough ? (
          <Tag color="green">
            <CheckOutlined /> {raised}
          </Tag>
        ) : (
          <Tag color="red">
            <CheckOutlined /> {raised}
          </Tag>
        )}
      </p>
      <p>
        <Button disabled={!allowStakeAndMint} size="large" type="primary" onClick={handleStakeAndMint}>
          Stake &amp; Mint
        </Button>
      </p>
    </div>
  );
}
