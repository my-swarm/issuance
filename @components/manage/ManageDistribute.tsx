import React, { ReactElement, useState } from 'react';
import { useAppState, useContractAddress, useDispatch, useEthers, useGraphql } from '@app';
import { Alert, Button, Form, Input, Modal, Radio, Space, Table } from 'antd';
import { ContributorStatus, useDistrubuteQuery } from '@graphql';
import { Address, AmountsTable, Loading } from '../utility';
import { BigNumber } from 'ethers';
import { formatUnits, parseAddressesInput, parseUnits } from '@lib';
import { BASE_CURRENCIES } from '@const';

type DistributionType = 'fundraiser' | 'custom';

type FormData = {
  distributionType: DistributionType;
  from: string;
  addresses: string;
};

export function ManageDistribute(): ReactElement {
  const { address: myAddress } = useEthers();
  const { dispatchTransaction } = useDispatch();
  const [{ token }] = useAppState();
  const { src20: src20Address } = useContractAddress();
  const [form] = Form.useForm();
  const { reset } = useGraphql();
  const { loading, error, data } = useDistrubuteQuery({ variables: { id: src20Address } });
  const [distributionType, setDistributionType] = useState<DistributionType>(
    data?.token?.currentFundraiser?.contributors ? 'fundraiser' : 'custom',
  );

  if (loading || !data) return <Loading />;
  const { availableSupply, currentFundraiser: fundraiser } = data.token;
  const contributors = fundraiser?.contributors || [];
  const qualifiedContributors = contributors.filter(
    (c) => c.status === ContributorStatus.Qualified && BigNumber.from(c.amount).gt(0),
  );
  const pendingContributors = contributors.filter((c) => c.status === ContributorStatus.Pending);

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

    const niceAmount = formatUnits(amount, token.decimals);
    Modal.confirm({
      title: `Please confirm the distribution of ${niceAmount} ${token.symbol} to ${amounts.length} qualified investors`,
      width: 400,
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

      onOk: () =>
        dispatchTransaction({
          method: 'src20.bulkTransfer',
          arguments: [addresses, amounts],
          description: `Distributing ${niceAmount} ${token.symbol} to ${addresses.length} accounts`,
          onSuccess: () => {
            reset();
            form.resetFields();
          },
        }),
    });
  };

  const initialValues: FormData = {
    distributionType: distributionType,
    from: myAddress,
    addresses: '',
  };

  return (
    <>
      <p>
        Available supply: {formatUnits(availableSupply, token.decimals)} {token.symbol}
      </p>

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
            <Form.Item name="addresses" label="List of Receivers">
              <Input.TextArea rows={8} />
            </Form.Item>
            <p>
              Enter CSV data with <code>&lt;address&gt;,&lt;amount&gt;</code> per line
            </p>
          </>
        )}

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Distribute
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}
