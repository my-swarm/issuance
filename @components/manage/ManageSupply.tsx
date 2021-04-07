import React, { ReactElement, useState } from 'react';
import { useAppState, useContract, useDispatch, useEthers, useGraphql, useSwmAllowance, useSwmBalance } from '@app';
import { Button, Checkbox, Col, Divider, Form, InputNumber, Row, Statistic, Space } from 'antd';
import { formatInt, parseUnits, formatUnits, SWM_TOKEN_DECIMALS } from '@lib';
import { useTokenQuery } from '@graphql';
import { Help, Loading } from '@components';
import { BigNumber, BigNumberish } from 'ethers';

export function ManageSupply(): ReactElement {
  const { reset } = useGraphql();
  const { address } = useEthers();
  const [{ onlineToken }] = useAppState();
  const [showExactValues, setShowExactValues] = useState<boolean>(false);
  const [swmAllowance, reloadSwmAllowance] = useSwmAllowance();
  const [swmBalance, reloadSwmBalance] = useSwmBalance();

  const [stakeRequired, setStakeRequired] = useState<number>();
  const [stakeReturned, setStakeReturned] = useState<number>();
  const { src20, registry } = useContract();
  const [increaseForm] = Form.useForm();
  const [decreaseForm] = Form.useForm();
  const { dispatchTransaction } = useDispatch();

  const { loading, data } = useTokenQuery({
    variables: { id: onlineToken.id },
  });
  if (loading) return <Loading />;
  const { token } = data;

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
    const additionalSupply = parseUnits(increaseForm.getFieldValue('supply_add'), token.decimals);
    const computeStake = await registry.computeStake(src20.address, additionalSupply);

    dispatchTransaction({
      method: 'swm.approve',
      args: [registry.address, computeStake.sub(swmAllowance.raw)],
      description: 'Approving SWM spending. Confirm transaction to be albe to stake your SWM',
      onSuccess: () => {
        dispatchTransaction({
          method: 'registry.increaseSupply',
          args: [src20.address, address, additionalSupply],
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
    const supply = parseUnits(decreaseForm.getFieldValue('supply_sub'), token.decimals);

    dispatchTransaction({
      method: 'registry.decreaseSupply',
      args: [src20.address, address, supply],
      description: 'Decreasing token supply and returning SWM tokens',
      onSuccess: () => {
        reset();
        reloadSwmAllowance();
        reloadSwmBalance();
      },
    });
  };

  function renderStat(
    title: ReactElement | string,
    help: string,
    value: BigNumberish,
    decimals: number = token.decimals,
    suffix: string = token.symbol,
  ) {
    let color: string;
    value = BigNumber.from(value || 0);
    color = value.gt(0) ? 'blue' : 'red';
    if (help === 'maxSupply' && value.eq(0)) {
      color = 'blue';
      value = 'Unlimited';
      suffix = '';
    } else {
      value = formatUnits(value, decimals);
    }
    return (
      <Col xs={24} md={12} lg={8}>
        <Statistic
          className={`statistic-${color}`}
          valueStyle={{ fontSize: `${showExactValues ? '16' : '22'}px` }}
          title={
            <Space size="small">
              <span>{title}</span>
              <Help name={help} />
            </Space>
          }
          value={value}
          suffix={suffix}
          precision={showExactValues ? 8 : 0}
        />
      </Col>
    );
  }

  return (
    <>
      <p>
        <Checkbox checked={showExactValues} onChange={(e) => setShowExactValues(e.target.checked)}>
          Show more decimal values
        </Checkbox>
      </p>
      <Row gutter={[24, 16]}>
        {renderStat('Supply', 'supply', token.supply)}
        {renderStat('Max Supply', 'maxSupply', token.maxSupply)}
        {renderStat('Available Supply', 'availableSupply', token.availableSupply)}
        {renderStat('Fee paid', 'currentFee', token.fee, SWM_TOKEN_DECIMALS, 'SWM')}
        {renderStat('SWM Balance', 'swmBalance', swmBalance.raw as BigNumber, SWM_TOKEN_DECIMALS, 'SWM')}
        {renderStat('Current NAV', 'supplyNav', token.nav, 0, 'USD')}
      </Row>

      <Divider />

      <h3 className="mt-3">
        Increase supply <Help name="increaseSupply" />
      </h3>
      <Form form={increaseForm} onFinish={handleIncreaseSupply} layout="inline" className="mb-3">
        <Form.Item name="supply_add" label="Increase by">
          <InputNumber min={0} onChange={(x) => handleSupplyChange(x, false)} formatter={formatInt} parser={parseInt} />
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

      <h3>
        Decrease supply <Help name="decreaseSupply" />
      </h3>
      <Form form={decreaseForm} onFinish={handleDecreaseSupply} layout="inline">
        <Form.Item name="supply_sub" label="Decrease by">
          <InputNumber min={0} onChange={(x) => handleSupplyChange(x, true)} formatter={formatInt} parser={parseInt} />
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
