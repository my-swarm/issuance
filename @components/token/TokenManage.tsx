import React, { ReactElement } from 'react';
import { Collapse } from 'antd';
import { TransferRules } from '@types';
import { useAppState } from '@app';
import { ManageAccountList, ManageSupply, ManageTransfer } from '../manage';

export function TokenManage(): ReactElement {
  const [{ token }] = useAppState();
  return (
    <div>
      <Collapse defaultActiveKey={[]}>
        <Collapse.Panel header="Transfer token" key="1">
          <ManageTransfer />
        </Collapse.Panel>
        <Collapse.Panel header="Token supply (Mint & Burn)" key="2">
          <ManageSupply />
        </Collapse.Panel>
        {token.transferRestrictionsType !== TransferRules.None && (
          <Collapse.Panel header="Whitelist management" key="3">
            <ManageAccountList type="whitelist" />
          </Collapse.Panel>
        )}
        {token.transferRestrictionsType !== TransferRules.None && (
          <Collapse.Panel header="Greylist management" key="4">
            <ManageAccountList type="greylist" />
          </Collapse.Panel>
        )}
        <Collapse.Panel header="Update Asset" key="5"></Collapse.Panel>
        <Collapse.Panel header="Manage token roles" key="6"></Collapse.Panel>
      </Collapse>
      <h2>Info</h2>
      <ul>
        <li>total supply</li>
        <li>highest balances, option to show all</li>
      </ul>
      <h2>Operations</h2>
      <ul>
        <li>?? Show pending greylist transfers, allow to execute [SRC20.executeTransfer]</li>
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
