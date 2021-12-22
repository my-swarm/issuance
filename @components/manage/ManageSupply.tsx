import React, { ReactElement, useEffect, useState } from 'react';
import { useAppState, useContract, useDispatch, useEthers, useGraphql, useSwmBalance } from '@app';
import { Button, Checkbox, Col, Divider, Form, InputNumber, Row, Space, Statistic } from 'antd';
import { formatInt, formatUnits, getUnitsAsNumber, parseUnits, SWM_TOKEN_DECIMALS, tokenBalance } from '@lib';
import { useTokenQuery } from '@graphql';
import { Help, Loading } from '@components';
import { BigNumber, BigNumberish } from 'ethers';

export function ManageSupply(): ReactElement {
  const { block } = useEthers();
  const { reset } = useGraphql();
  const [{ onlineToken }] = useAppState();
  const [showExactValues, setShowExactValues] = useState<boolean>(false);
  const [swmBalance, reloadSwmBalance] = useSwmBalance();

  const [fee, setFee] = useState<BigNumber>(BigNumber.from(0));
  const { src20, minter, swm } = useContract();
  const [increaseForm] = Form.useForm();
  const [decreaseForm] = Form.useForm();
  const { dispatchTransaction, checkAllowance } = useDispatch();

  useEffect(() => {
    if (!minter || !src20) return;
    minter.getAdditionalFee(src20.address).then(setFee);
  }, [minter, src20]);

  const { loading, data } = useTokenQuery({
    variables: { id: onlineToken.id },
  });

  if (loading) return <Loading />;
  const { token } = data;

  const handleMint = async () => {
    const additionalSupply = parseUnits(increaseForm.getFieldValue('supply_add'), token.decimals);
    const fee = await minter.getAdditionalFee(src20.address);

    checkAllowance('minter', swm.address, fee, () => {
      dispatchTransaction({
        method: 'src20.mint',
        args: [additionalSupply],
        description: 'Minting token supply',
        onSuccess: () => {
          reset();
          reloadSwmBalance();
        },
      });
    });
  };

  const handleBurn = async () => {
    const supply = parseUnits(decreaseForm.getFieldValue('supply_sub'), token.decimals);

    dispatchTransaction({
      method: 'minter.burn',
      args: [supply],
      description: 'Burning token supply',
      onSuccess: () => {
        reset();
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
        {renderStat('Available Supply', 'availableSupply', tokenBalance(block, token, token.availableSupply))}
        {renderStat('Fee paid', 'currentFee', token.fee, SWM_TOKEN_DECIMALS, 'SWM')}
        {renderStat('SWM Balance', 'swmBalance', swmBalance.raw as BigNumber, SWM_TOKEN_DECIMALS, 'SWM')}
        {renderStat('Current NAV', 'supplyNav', token.nav, 0, 'USD')}
      </Row>

      <Divider />

      <h3 className="mt-3">
        Mint (increase supply) <Help name="increaseSupply" />
      </h3>
      <Form form={increaseForm} onFinish={handleMint} layout="inline" className="mb-3">
        <Form.Item name="supply_add" label="Increase by">
          <InputNumber min={0} formatter={formatInt} parser={parseInt} />
        </Form.Item>
        <Form.Item label="Additonal Fee (SWM)">
          <InputNumber disabled value={getUnitsAsNumber(fee, SWM_TOKEN_DECIMALS)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Increase
          </Button>
        </Form.Item>
      </Form>

      <h3>
        Burn (decrease supply) <Help name="decreaseSupply" />
      </h3>
      <Form form={decreaseForm} onFinish={handleBurn} layout="inline">
        <Form.Item name="supply_sub" label="Decrease by">
          <InputNumber min={0} formatter={formatInt} parser={parseInt} />
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
