import React, { ReactElement } from 'react';
import { Button, Popconfirm } from 'antd';
import { useDispatch } from '@app';
import { FundraiserInfoFragment } from '@graphql';

interface ManageFundraiserStateProps {
  fundraiser: FundraiserInfoFragment;
}

export function ManageFundraiserState({ fundraiser }: ManageFundraiserStateProps): ReactElement {
  const { dispatchTransaction } = useDispatch();

  const handleCancel = () => {
    dispatchTransaction({
      method: 'fundraiser.cancel',
      description: 'Canceling the fundraiser.',
      onSuccess: () => {
        alert('What now?');
      },
    });
  };

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
        <Button disabled size="large" type="primary">
          Stake &amp; Mint
        </Button>
      </p>
    </div>
  );
}
