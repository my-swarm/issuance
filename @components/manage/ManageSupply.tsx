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
import { Button, Col, Divider, Form, InputNumber, Row, Statistic } from 'antd';
import { formatInt, parseUnits, formatUnits, SWM_TOKEN_DECIMALS } from '@lib';
import { useTokenSupplyQuery } from '@graphql';
import { Loading } from '@components';

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
      .computeStake(src20.address, parseUnits(newSupply.toString(), token.decimals))
      .then((x) => method(parseFloat(formatUnits(x, SWM_TOKEN_DECIMALS))));
  };

  const handleIncreaseSupply = async () => {
    const additionalSupply = parseUnits(increaseForm.getFieldValue('supply'), token.decimals);
    const computeStake = await registry.computeStake(src20.address, additionalSupply);

    dispatchTransaction({
      method: 'swm.approve',
      arguments: [registry.address, computeStake.sub(swmAllowance.raw)],
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
      <Row gutter={[24, 16]}>
        <Col xs={24} md={12} lg={8}>
          <Statistic title="Supply" value={formatUnits(gToken.supply, token.decimals)} suffix={token.symbol} />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Statistic title="Max Supply" value={formatUnits(gToken.maxSupply, token.decimals)} suffix={token.symbol} />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Statistic
            title="Available Supply"
            value={formatUnits(gToken.availableSupply, token.decimals)}
            suffix={token.symbol}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Statistic title="Current stake" value={formatUnits(gToken.stake, SWM_TOKEN_DECIMALS)} suffix="SWM" />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Statistic title="SWM Balance" value={swmBalance.nice} suffix="SWM" />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Statistic title="SWM Allowance" value={swmAllowance.nice} suffix="SWM" />
        </Col>
      </Row>

      <Divider />

      <h3 className="mt-3">Increase supply</h3>
      <Form form={increaseForm} onFinish={handleIncreaseSupply} layout="inline" className="mb-3">
        <Form.Item name="supply" label="Increase by">
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
            Increase
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
            Decrease
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
