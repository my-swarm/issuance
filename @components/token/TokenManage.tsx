import React, { ReactElement, useEffect, useState } from 'react';
import { Form, Collapse, Input, InputNumber, Button, Descriptions } from 'antd';
import { Token } from '@types';
import { useContract } from '../../@app/useContract';
import { formatInt, formatNumber, getBnSupply, getTokenAmount, formatTokenAmount } from '../../@lib';
import { SWM_TOKEN_DECIMALS } from '../../@const';
import { useEthers } from '../../@app';

interface TokenManageProps {
  token: Token;
}

export function TokenManage({ token }: TokenManageProps): ReactElement {
  const { address } = useEthers();
  const [currentSupply, setCurrentSupply] = useState<string>();
  const [availableSupply, setAvailableSupply] = useState<string>();
  const [currentStake, setCurrentStake] = useState<string>();
  const [currentAllowance, setCurrentAllowance] = useState<string>();
  const [currentNav, setCurrentNav] = useState<string>();
  const [stakeRequired, setStakeRequired] = useState<number>();
  const src20 = useContract('src20', token);
  const registry = useContract('registry');
  const assetRegistry = useContract('assetRegistry');
  const getRateMinter = useContract('getRateMinter');
  const swmToken = useContract('swmToken');
  const [increaseSupplyForm] = Form.useForm();

  const reloadSupply = () => {
    src20.totalSupply().then((x) => setCurrentSupply(formatTokenAmount(x, token.decimals)));
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

  const handleSupplyChange = (newSupply: number) => {
    const newSupplyBn = getBnSupply(newSupply, token.decimals);
    registry.swmNeeded(src20.address, newSupplyBn).then((x) => setStakeRequired(getTokenAmount(x, SWM_TOKEN_DECIMALS)));
  };

  const handleIncreaseSupply = async () => {
    const supply = getBnSupply(increaseSupplyForm.getFieldValue('supply'), token.decimals);
    const allowance = await src20.allowance(address, registry.address);
    const swmNeeded = await registry.swmNeeded(src20.address, supply);
    console.log({
      allowance: allowance.toString(),
      swmNeeded: swmNeeded.toString(),
      diff: swmNeeded.sub(allowance).toString(),
    });
    await swmToken.approve(registry.address, swmNeeded.sub(allowance));
    const transaction = await registry.increaseSupply(src20.address, address, supply);
    await transaction.wait();
    reloadSupply();
  };

  return (
    <div>
      <Collapse defaultActiveKey={[]}>
        <Collapse.Panel header="Transfer token" key="1"></Collapse.Panel>
        <Collapse.Panel header="Token supply (Mint & Burn)" key="2">
          <Descriptions title="Current supply and stake">
            <Descriptions.Item label="Supply">
              {currentSupply} {token.symbol}
            </Descriptions.Item>
            <Descriptions.Item label="Available">
              {availableSupply} {token.symbol}
            </Descriptions.Item>
            <Descriptions.Item label="Stake">{currentStake} SWM</Descriptions.Item>
            <Descriptions.Item label="Allowance">{currentAllowance} SWM</Descriptions.Item>
            <Descriptions.Item label="Asset Value">{currentNav} USD</Descriptions.Item>
          </Descriptions>
          <h3>Increase supply</h3>
          <Form form={increaseSupplyForm} onFinish={handleIncreaseSupply} layout="inline">
            <Form.Item name="supply" label="Additonal supply">
              <InputNumber
                min={0}
                placeholder="Gazillion"
                onChange={handleSupplyChange}
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
        </Collapse.Panel>
        <Collapse.Panel header="Whitelist management" key="3"></Collapse.Panel>
        <Collapse.Panel header="Graylist management" key="4"></Collapse.Panel>
        <Collapse.Panel header="Update Asset" key="5"></Collapse.Panel>
        <Collapse.Panel header="Manage token roles" key="6"></Collapse.Panel>
      </Collapse>
      <div>TokenManage {token.symbol}</div>
      <h2>Info</h2>
      <ul>
        <li>total supply</li>
        <li>highest balances, option to show all</li>
      </ul>
      <h2>Operations</h2>
      <ul>
        <li>?? Show pending graylist transfers, allow to execute [SRC20.executeTransfer]</li>
        <li>Update restrictions and rules [SRC20.updateRestrictionsAndRules]</li>
        <li>Transfer token [SRC20.transferTokenForced] - only if enabled</li>
        <li>Burn account [SRC20.burnAccount] - only if enabled</li>
        <li>Burn token [SRC20.burn] - only if enabled</li>
        <li>Mint token [SRC20.mint] - only if enabled</li>
        <li>Bulk transfer [SRC20.packedBulkTransfer]</li>
        <li>update net asset value [AssetRegistry.updateNetAssetValueUSD]</li>
        <li>Update KYA [AssetRegistry.updateKYA]</li>
        <li>List minters, add, remove [SRC20Registry]</li>
      </ul>
    </div>
  );
}
