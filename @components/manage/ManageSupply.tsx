import React, { ReactElement, useState } from 'react';
import {
  useAppState,
  useContract,
  useContractAddress,
  useDispatch,
  useEthers,
  useGraphql,
  useSwmAllowance,
  useSwmBalance,
} from '@app';
import { Button, Descriptions, Form, InputNumber } from 'antd';
import { formatInt, formatNumber, formatTokenAmount, parseUnits, formatUnits } from '@lib';
import { useTokenSupplyQuery } from '../../@graphql';
import { Loading } from '@components';
import { SWM_TOKEN_DECIMALS } from '@const';

export function ManageSupply(): ReactElement {
  const { reset } = useGraphql();
  const { address } = useEthers();
  const [{ token }] = useAppState();
  const [swmAllowance, reloadSwmAllowance] = useSwmAllowance();
  const [swmBalance, reloadSwmBalance] = useSwmBalance();

  const [stakeRequired, setStakeRequired] = useState<number>();
  const [stakeReturned, setStakeReturned] = useState<number>();
  const { src20, registry, swm } = useContract();
  const { src20: src20Address } = useContractAddress();
  const [increaseForm] = Form.useForm();
  const [decreaseForm] = Form.useForm();
  const [, dispatch] = useAppState();
  const { dispatchTransaction } = useDispatch();

  const { loading, error, data } = useTokenSupplyQuery({
    variables: { id: src20Address },
  });
  const gToken = data?.token || undefined;
  if (loading || !gToken) return <Loading />;

  const handleSupplyChange = (newSupply: number | string | undefined, returned = false) => {
    const method = returned ? setStakeReturned : setStakeRequired;

    if (!newSupply) {
      method(0);
      return;
    }

    registry
      .swmNeeded(src20.address, parseUnits(newSupply.toString(), token.decimals))
      .then((x) => method(formatUnits(x, SWM_TOKEN_DECIMALS)));
  };

  const handleIncreaseSupply = async () => {
    const additionalSupply = parseUnits(increaseForm.getFieldValue('supply'), token.decimals);
    const swmNeeded = await registry.swmNeeded(src20.address, additionalSupply);

    dispatchTransaction({
      method: 'swm.approve',
      arguments: [registry.address, swmNeeded.sub(swmAllowance.raw)],
      description: 'Approving SWM spending. Confirm transaction to be albe to stake your SWM',
      onSuccess: () => {
        dispatchTransaction({
          method: 'registry.increaseSupply',
          arguments: [src20.address, address, additionalSupply],
          description: 'Increasing token supply and staking your SWM tokens',
          onSuccess: () => {
            reset();
            reloadSwmAllowance();
            reloadSwmBalance();
          },
        });
      },
    });
  };

  const handleDecreaseSupply = async () => {
    const supply = parseUnits(decreaseForm.getFieldValue('supply'), token.decimals);

    dispatchTransaction({
      method: 'registry.decreaseSupply',
      arguments: [src20.address, address, supply],
      description: 'Decreasing token supply and returning SWM tokens',
      onSuccess: () => {
        reset();
        reloadSwmAllowance();
        reloadSwmBalance();
      },
    });
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
        <Descriptions.Item label="Stake">{formatTokenAmount(gToken.stake, SWM_TOKEN_DECIMALS)} SWM</Descriptions.Item>
        <Descriptions.Item label="SWM Balance">{swmBalance.nice} SWM</Descriptions.Item>
        <Descriptions.Item label="SWM Allowance">{swmAllowance.nice} SWM</Descriptions.Item>
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
