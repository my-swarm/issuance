import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Descriptions, Form, Input, Modal, Typography } from 'antd';
import { useFundraiserLazyQuery } from '@graphql';
import { Address, Box, Help, Loading, TokenTitle, VSpace } from '@components';
import { useDispatch, useErc20Balance, useEthers } from '@app';
import { formatUnits, getUnitsAsNumber, parseUnits } from '@lib';
import { BigNumber } from '@ethersproject/bignumber';

const { Title } = Typography;

interface InvestContributeProps {
  id: string;
}

export function InvestContribute({ id }: InvestContributeProps): ReactElement {
  const { address } = useEthers();
  const [loadQuery, { data, loading, refetch }] = useFundraiserLazyQuery();
  const { checkAllowance, dispatchTransaction } = useDispatch();
  const [amount, setAmount] = useState<number>(0);
  const [balance, reloadBalance] = useErc20Balance(data?.fundraiser?.baseCurrency?.address);
  const [form] = Form.useForm();

  useEffect(() => {
    if (id && address) {
      loadQuery({ variables: { id, address } });
    }
  }, [address, id]);

  if (!data || loading) return <Loading />;
  const fundraiser = data?.fundraiser;
  const { token, baseCurrency, contributors } = fundraiser ?? {
    token: undefined,
    baseCurrency: undefined,
    contributors: undefined,
  };

  const contributor = contributors?.length ? contributors[0] : undefined;
  const contributed = contributor?.amount || 0;
  const status = contributor?.status || 'Not contributed yet';

  const handleContribute = (values) => {
    const amount = parseUnits(values.amount, baseCurrency.decimals);
    console.log('contribute', { values, amount });
    checkAllowance(['fundraiser', fundraiser.address], baseCurrency.address, amount, () => {
      dispatchTransaction({
        method: 'fundraiser.contribute',
        address: fundraiser.address,
        args: [amount, values.referral || ''],
        description: 'Contributing...',
        autoclose: true,
        onSuccess: () => {
          Modal.info({
            title: 'Thank you for your contribution!',
            content: (
              <div>
                <p>
                  You have contributed {values.amount} {baseCurrency.symbol} to the {token.symbol} fundraiser.
                </p>
                <p>Follow the fundraiser status to see how the progress goes.</p>
              </div>
            ),
          });
          form.resetFields();
          reloadBalance();
        },
        syncCallbacks: [refetch],
      });
    });
  };

  const balanceNumber = balance.raw ? getUnitsAsNumber(balance.raw as BigNumber, baseCurrency.decimals) : 0;
  const canContribute = amount > 0 && balanceNumber >= amount;

  return (
    <div>
      <p>
        Funds are contributed in <TokenTitle token={baseCurrency} />. If you don&apos;t own any, please get them first{' '}
        <Help name="gettingBaseCurrency" />
      </p>
      <p>
        This project&apos;s tokens ({token.symbol}) can be requested from the fundraise issuer -{' '}
        <strong>post raise</strong>, please contact the issuer for more details on distribution.
      </p>
      <p>
        Contributions are automatically set at <strong>pending</strong> until <strong>approved</strong> by the token
        issuer.
      </p>
      <Descriptions title="Your investor status" column={1} size="small" bordered>
        <Descriptions.Item label="Status">{status}</Descriptions.Item>
        <Descriptions.Item
          label={
            <span>
              <TokenTitle token={baseCurrency} /> balance
            </span>
          }
        >
          {balance.nice} {baseCurrency.symbol}{' '}
          <Button type="link" onClick={reloadBalance}>
            refresh
          </Button>
        </Descriptions.Item>
        <Descriptions.Item label="Amount contributed">
          {formatUnits(contributed, baseCurrency.decimals)} {baseCurrency.symbol}
        </Descriptions.Item>
      </Descriptions>
      <VSpace />
      <Title level={4}>Contribute</Title>
      <p>
        When you contribute, {baseCurrency.symbol} tokens are sent from your current account (
        <Address short>{address}</Address>) to the Fundraiser contract address (
        <Address short>{fundraiser.address}</Address>). You will be asked to sign the transaction and you can verify the
        parameters in the Metamask popup window.
      </p>
      <div style={{ maxWidth: '480px' }}>
        <Box>
          <Form onFinish={handleContribute} form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 12 }}>
            <Form.Item name="amount" label="Amount to invest">
              <Input
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                suffix={<TokenTitle token={baseCurrency} />}
              />
            </Form.Item>
            <Form.Item name="referral" label="Referral code">
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ md: { offset: 10, span: 12 } }}>
              <Button type="primary" htmlType="submit" disabled={!canContribute}>
                Contribute
              </Button>
            </Form.Item>
          </Form>
        </Box>
      </div>
    </div>
  );
}
