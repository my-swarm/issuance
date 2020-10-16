import React, { ReactElement, useState } from 'react';
import { useAppState, useContract, useDispatch, useEthers, useSwmAllowance } from '@app';
import { Button, Descriptions, Form, InputNumber } from 'antd';
import { formatInt, formatNumber, formatTokenAmount, getBnSupply, getTokenAmount } from '@lib';
import { useTokenSupplyQuery } from '../../@graphql';
import { Loading } from '@components';

export function ManageSupply(): ReactElement {
  const { address } = useEthers();
  const [{ token }] = useAppState();
  const [swmAllowance] = useSwmAllowance();

  const [stakeRequired, setStakeRequired] = useState<number>();
  const [stakeReturned, setStakeReturned] = useState<number>();
  const { src20, registry, swmToken } = useContract();
  const [increaseForm] = Form.useForm();
  const [decreaseForm] = Form.useForm();
  const [, dispatch] = useAppState();
  const { dispatchTransaction } = useDispatch();

  const { loading, error, data } = useTokenSupplyQuery({
    variables: { id: '0x63e00e15ec3f75dc4ef547ea86ecd2ae323e2f32' },
  });
  if (loading) return <Loading />;

  const gToken = data?.tokens[0] || undefined;
  console.log({ loading, error, data, gToken });

  const handleSupplyChange = (newSupply: number | string | undefined, returned = false) => {
    const method = returned ? setStakeReturned : setStakeRequired;

    if (!newSupply) {
      method(0);
      return;
    }
    // contractMethods('swmNeeded', [src20.address, getBnSupply(newSupply.toString(), token.decimals)]).then((x) =>
    //   method(getTokenAmount(x, SWM_TOKEN_DECIMALS)),
    // );
  };

  const handleIncreaseSupply = async () => {
    const additionalSupply = getBnSupply(increaseForm.getFieldValue('supply'), token.decimals);
    const swmNeeded = await registry.swmNeeded(src20.address, additionalSupply);

    dispatchTransaction({
      method: 'swmToken.approve',
      arguments: [registry.address, swmNeeded.sub(swmAllowance)],
      description: 'Approving SWM spending. Confirm transaction to be albe to stake your SWM',
      onSuccess: () => {
        dispatchTransaction({
          method: 'registry.increaseSupply',
          arguments: [src20.address, address, additionalSupply],
          description: 'Increasing token supply and staking your SWM tokens',
        });
      },
    });
    try {
      await swmToken.approve(registry.address, swmNeeded.sub(swmAllowance));
      const transaction = await registry.increaseSupply(src20.address, address, additionalSupply);
      await transaction.wait();
    } catch (e) {
      let error;
      if (e.code === -32603) {
        if (e.data.message.match(/trying to mint too many tokens/)) {
          error = {
            message: 'Cannot mint',
            description: 'It appears you have aleready minted your tokens.',
          };
        }
      } else {
        error = {
          message: 'Error',
          description: e.message,
        };
      }
      dispatch({ type: 'showError', error });
    }
  };

  const handleDecreaseSupply = async () => {
    const supply = getBnSupply(decreaseForm.getFieldValue('supply'), token.decimals);
    const transaction = await registry.decreaseSupply(src20.address, address, supply);
    await transaction.wait();
  };

  return (
    <>
      <Descriptions title="Current supply and stake">
        <Descriptions.Item label="Supply">
          {formatTokenAmount(gToken.supply, token.decimals)} {token.symbol}
        </Descriptions.Item>
        <Descriptions.Item label="Max Supply">
          {formatTokenAmount(gToken.maxSupply, token.decimals)} {token.symbol}
        </Descriptions.Item>
        <Descriptions.Item label="Available">
          {formatTokenAmount(gToken.availableSupply, token.decimals)} {token.symbol}
        </Descriptions.Item>
        <Descriptions.Item label="Stake">{gToken.stake} SWM</Descriptions.Item>
        <Descriptions.Item label="Allowance">{swmAllowance.nice} SWM</Descriptions.Item>
        <Descriptions.Item label="Asset Value">{10000} USD</Descriptions.Item>
      </Descriptions>

      <h3>Increase supply</h3>
      <Form form={increaseForm} onFinish={handleIncreaseSupply} layout="inline" className="mb-3">
        <Form.Item name="supply" label="Additonal supply">
          <InputNumber
            min={0}
            placeholder="Gazillion"
            onChange={(x) => handleSupplyChange(x, false)}
            formatter={formatInt}
            parser={parseInt}
          />
        </Form.Item>
        <Form.Item label="Stake required">
          <InputNumber disabled value={stakeRequired} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Stake and mint
          </Button>
        </Form.Item>
      </Form>

      <h3>Decrease supply</h3>
      <Form form={decreaseForm} onFinish={handleDecreaseSupply} layout="inline">
        <Form.Item name="supply" label="Decrease by">
          <InputNumber
            min={0}
            placeholder="Gazillion"
            onChange={(x) => handleSupplyChange(x, true)}
            formatter={formatInt}
            parser={parseInt}
          />
        </Form.Item>
        <Form.Item label="Stake returned">
          <InputNumber disabled value={stakeReturned} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Decrease supply
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
