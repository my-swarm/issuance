import React, { ReactElement, useEffect, useState } from 'react';
import { Token } from '@types';
import { useContract, useEthers, useAppState } from '../../@app';
import { Button, Collapse, Descriptions, Form, InputNumber } from 'antd';
import { formatInt, formatNumber, formatTokenAmount, getBnSupply, getTokenAmount } from '../../@lib';
import { SWM_TOKEN_DECIMALS } from '../../@const';

export function ManageSupply({ token }: { token: Token }): ReactElement {
  const { address } = useEthers();
  const [currentSupply, setCurrentSupply] = useState<string>();
  const [maxSupply, setMaxSupply] = useState<string>();
  const [availableSupply, setAvailableSupply] = useState<string>();
  const [currentStake, setCurrentStake] = useState<string>();
  const [currentAllowance, setCurrentAllowance] = useState<string>();
  const [currentNav, setCurrentNav] = useState<string>();
  const [stakeRequired, setStakeRequired] = useState<number>();
  const [stakeReturned, setStakeReturned] = useState<number>();
  const src20 = useContract('src20', token);
  const registry = useContract('registry');
  const assetRegistry = useContract('assetRegistry');
  const swmToken = useContract('swmToken');
  const [increaseForm] = Form.useForm();
  const [decreaseForm] = Form.useForm();
  const [, dispatch] = useAppState();

  const reloadSupply = () => {
    src20.totalSupply().then((x) => setCurrentSupply(formatTokenAmount(x, token.decimals)));
    src20._maxTotalSupply().then((x) => setMaxSupply(formatTokenAmount(x, token.decimals)));
    src20.balanceOf(address).then((x) => setAvailableSupply(formatTokenAmount(x, token.decimals)));
    src20
      .allowance(address, registry.address)
      .then((x) => setCurrentAllowance(formatTokenAmount(x, SWM_TOKEN_DECIMALS)));
    registry.getStake(src20.address).then((x) => setCurrentStake(formatTokenAmount(x, token.decimals)));
  };

  useEffect(() => {
    reloadSupply();
    assetRegistry.getNetAssetValueUSD(src20.address).then((x) => setCurrentNav(formatNumber(x)));
  }, [src20]);

  const handleSupplyChange = (newSupply: number | string | undefined, returned = false) => {
    const method = returned ? setStakeReturned : setStakeRequired;

    if (!newSupply) {
      method(0);
      return;
    }
    const newSupplyBn = getBnSupply(newSupply.toString(), token.decimals);
    registry.swmNeeded(src20.address, newSupplyBn).then((x) => method(getTokenAmount(x, SWM_TOKEN_DECIMALS)));
  };

  const handleIncreaseSupply = async () => {
    const supply = getBnSupply(increaseForm.getFieldValue('supply'), token.decimals);
    const allowance = await src20.allowance(address, registry.address);
    const swmNeeded = await registry.swmNeeded(src20.address, supply);
    try {
      await swmToken.approve(registry.address, swmNeeded.sub(allowance));
      const transaction = await registry.increaseSupply(src20.address, address, supply);
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
    reloadSupply();
  };

  const handleDecreaseSupply = async () => {
    const supply = getBnSupply(decreaseForm.getFieldValue('supply'), token.decimals);
    const transaction = await registry.decreaseSupply(src20.address, address, supply);
    await transaction.wait();
    reloadSupply();
  };

  return (
    <>
      <Descriptions title="Current supply and stake">
        <Descriptions.Item label="Supply">
          {currentSupply} {token.symbol}
        </Descriptions.Item>
        <Descriptions.Item label="Max Supply">
          {maxSupply} {token.symbol}
        </Descriptions.Item>
        <Descriptions.Item label="Available">
          {availableSupply} {token.symbol}
        </Descriptions.Item>
        <Descriptions.Item label="Stake">{currentStake} SWM</Descriptions.Item>
        <Descriptions.Item label="Allowance">{currentAllowance} SWM</Descriptions.Item>
        <Descriptions.Item label="Asset Value">{currentNav} USD</Descriptions.Item>
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
