import React, { ReactElement, useState } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { Alert, Button, Descriptions, Form, Input, Modal, Radio, Space } from 'antd';

import { useAppState, useDispatch, useEthers } from '@app';
import { ContributorStatus, useDistrubuteQuery } from '@graphql';
import { bn, formatUnits, parseAddressesInput, parseUnits, tokenBalance } from '@lib';
import { AmountsTable, Help, Loading, VSpace } from '..';

type DistributionType = 'fundraiser' | 'custom';

type FormData = {
  distributionType: DistributionType;
  from: string;
  addresses: string;
};

const batchSize = 100;

export function ManageDistribute(): ReactElement {
  const { block, address: myAddress } = useEthers();
  const { dispatchTransaction } = useDispatch();
  const [{ onlineToken }] = useAppState();
  const [form] = Form.useForm();
  const { loading, data, refetch } = useDistrubuteQuery({ variables: { id: onlineToken.id } });
  const [distributionType, setDistributionType] = useState<DistributionType>(
    data?.token?.currentFundraiser?.contributors ? 'fundraiser' : 'custom',
  );

  if (loading || !data) return <Loading />;
  const { token } = data;
  const { availableSupply, currentFundraiser: fundraiser } = token;
  const contributors = fundraiser?.contributors || [];
  const qualifiedContributors = contributors.filter(
    (c) => c.status === ContributorStatus.Qualified && BigNumber.from(c.amount).gt(0),
  );
  const pendingContributors = contributors.filter((c) => c.status === ContributorStatus.Pending);

  async function distributeChunk(amounts, addresses, totalCount, totalAmount) {
    const numBatches = Math.ceil(totalCount / batchSize);
    const oneBatch = numBatches === 1;
    const amountsBatch = amounts.slice(0, batchSize);
    const addressesBatch = addresses.slice(0, batchSize);
    const amountsLeft = amounts.slice(batchSize);
    const addressesLeft = addresses.slice(batchSize);
    const batchesLeft = Math.ceil(amountsLeft.length / batchSize);
    const batchNum = numBatches - batchesLeft;
    dispatchTransaction({
      method: 'src20.bulkTransfer',
      args: [addressesBatch, amountsBatch],
      description: `Distributing ${totalAmount} ${token.symbol} to ${addresses.length} accounts${
        oneBatch ? `` : ` (batch ${batchNum} of ${numBatches}; ${batchSize} per batch)`
      }`,
      onSuccess: () => {
        if (amountsLeft.length > 0) {
          distributeChunk(amountsLeft, addressesLeft, totalCount, totalAmount);
        } else {
          form.resetFields();
        }
      },
      syncCallbacks: amountsLeft.length === 0 ? [refetch] : [],
    });
  }

  const handleSubmit = async (data: FormData) => {
    let amount: BigNumber;
    let amounts: BigNumber[];
    let addresses: string[];
    if (data.distributionType === 'fundraiser') {
      amount = BigNumber.from(availableSupply);
      addresses = qualifiedContributors.map((c) => c.address);
      const sum = qualifiedContributors.map((c) => c.amount).reduce((a, b) => a.add(b), BigNumber.from(0));
      amounts = qualifiedContributors.map((c) => BigNumber.from(c.amount).mul(amount).div(sum));
    } else {
      const parsedInput = parseAddressesInput<BigNumber>(data.addresses, (meta) => parseUnits(meta[0], token.decimals));
      addresses = Object.keys(parsedInput);
      amounts = Object.values(parsedInput);
      amount = amounts.reduce((a, b) => a.add(b), BigNumber.from(0));
    }

    if (amount.gt(bn(token.availableSupply))) {
      Modal.error({
        title: 'Cannot distribute more than available supply',
        content: (
          <>
            <p>
              Available Supply: <strong>{formatUnits(token.availableSupply, token.decimals)}</strong>
              <br />
              Amount to distribute: <strong>{formatUnits(amount, token.decimals)}</strong>
            </p>
            <p>Please check your list of receivers.</p>
          </>
        ),
      });
      return;
    }

    const niceAmount = formatUnits(amount, token.decimals);
    Modal.confirm({
      title: `Please confirm the distribution of ${niceAmount} ${token.symbol} to ${amounts.length} accounts`,
      width: 640,
      content: (
        <>
          {pendingContributors.length > 0 && (
            <Alert
              type="error"
              showIcon
              message={`You have ${pendingContributors.length} pending contributors. Maybe you want to confirm them first?`}
              className="mb-3"
            />
          )}
          <div className="limit-height">
            <AmountsTable amounts={amounts} addresses={addresses} token={token} />
          </div>
        </>
      ),

      onOk: () => distributeChunk(amounts, addresses, amounts.length, niceAmount),
    });
  };

  const initialValues: FormData = {
    distributionType: distributionType,
    from: myAddress,
    addresses: '',
  };

  const realAvailableSupply = tokenBalance(block, onlineToken, availableSupply);

  return (
    <>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Available supply">
          {formatUnits(realAvailableSupply, token.decimals)} {token.symbol}
        </Descriptions.Item>
      </Descriptions>

      <VSpace />

      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={initialValues}>
        {qualifiedContributors.length > 0 && (
          <Form.Item name="distributionType" label="Distribute to">
            <Radio.Group onChange={(e) => setDistributionType(e.target.value)}>
              <Radio value="fundraiser">Fundraiser contributors ({qualifiedContributors.length})</Radio>
              <Radio value="custom">Custom address list</Radio>
            </Radio.Group>
          </Form.Item>
        )}

        {distributionType === 'custom' && (
          <>
            <Form.Item
              name="addresses"
              label={
                <Space>
                  <span>Enter a list of Receivers</span>
                  <Help name="distributeInput" />
                </Space>
              }
            >
              <Input.TextArea rows={8} />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" disabled={realAvailableSupply.eq(0)}>
              Distribute
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}
