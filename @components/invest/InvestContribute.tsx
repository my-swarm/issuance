import React, { ReactElement } from 'react';
import { Descriptions, Form, InputNumber, Typography, Button, Modal } from 'antd';
import { useFundraiserQuery } from '@graphql';
import { Address, Help, Loading, VSpace } from '@components';
import { useDispatch, useErc20Balance, useEthers, useGraphql } from '@app';
import { formatUnits, parseUnits } from '@lib';

const { Title } = Typography;

interface InvestContributeProps {
  id: string;
}

export function InvestContribute({ id }: InvestContributeProps): ReactElement {
  const { address } = useEthers();
  const { data, loading } = useFundraiserQuery({ variables: { id, address } });
  const { checkAllowance, dispatchTransaction } = useDispatch();
  const { reset } = useGraphql();
  const [balance, reloadBalance] = useErc20Balance(data?.fundraiser?.baseCurrency?.address);
  const [form] = Form.useForm();

  if (loading) return <Loading />;
  const { fundraiser } = data;
  const { token, baseCurrency, contributors } = fundraiser;

  const contributor = contributors.length ? contributors[0] : undefined;
  const contributed = contributor?.amount || 0;
  const status = contributor?.status || 'Not contributed yet';

  const handleContribute = (values) => {
    const amount = parseUnits(values.amount, baseCurrency.decimals);
    checkAllowance(['fundraiser', fundraiser.address], baseCurrency.address, amount, () => {
      dispatchTransaction({
        method: 'fundraiser.contribute',
        address: fundraiser.address,
        arguments: [amount],
        description: 'Contributing...',
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
          reset();
          form.resetFields();
          reloadBalance();
        },
      });
    });
  };

  return (
    <div>
      <p>
        Funds are contributed in <strong>{baseCurrency.symbol}</strong>. If you don&apos;t own any, please get them
        first <Help name="gettingBaseCurrency" />
      </p>
      <p>
        On succesful raise, you&apos;ll get you share of the <strong>{token.symbol}</strong> token ({token.name}).
      </p>
      <p>TBD: Info about what happens after contribution, when user gets his tokens etc.</p>
      <Descriptions title="Your investor status" column={1} size="small" bordered>
        <Descriptions.Item label="Status">{status}</Descriptions.Item>
        <Descriptions.Item label={`${baseCurrency.symbol} balance`}>
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
      <Title level={4}>Invest</Title>
      <p>
        When you contribute, {baseCurrency.symbol} tokens are sent from your current account (
        <Address short>{address}</Address>) to the Fundraiser contract address (
        <Address short>{fundraiser.address}</Address>). You will be asked to sign the transaction and you can verify the
        parameters in the Metamask popup window.
      </p>
      <Form onFinish={handleContribute} layout="inline" form={form}>
        <Form.Item name="amount" label="Amount to contribute">
          <InputNumber min={1} max={balance.raw ? parseFloat(balance.nice) : 1} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Contribute
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
