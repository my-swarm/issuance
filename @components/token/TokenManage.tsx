import React, { ReactElement } from 'react';
import { Collapse } from 'antd';
import { TransferRules } from '@types';
import { useAppState } from '@app';
import { ManageAccountList, ManageSupply, ManageTokenHolders, ManageTransfer } from '../manage';

export function TokenManage(): ReactElement {
  const [{ token }] = useAppState();
  return (
    <div>
      <Collapse defaultActiveKey={['holders']}>
        <Collapse.Panel header="Token supply (Mint & Burn)" key="supply">
          <ManageSupply />
        </Collapse.Panel>

        <Collapse.Panel header="Token holders" key="holders">
          <ManageTokenHolders />
        </Collapse.Panel>

        <Collapse.Panel header="Transfer token" key="transfer">
          <ManageTransfer />
        </Collapse.Panel>

        <Collapse.Panel header="Transfer history" key="transfers"></Collapse.Panel>

        {token.transferRestrictionsType !== TransferRules.None && (
          <Collapse.Panel header="Transfer requests" key="requests"></Collapse.Panel>
        )}

        {token.transferRestrictionsType !== TransferRules.None && (
          <Collapse.Panel header="Whitelist management" key="whitelist">
            <ManageAccountList type="whitelist" />
          </Collapse.Panel>
        )}

        {token.transferRestrictionsType !== TransferRules.None && (
          <Collapse.Panel header="Greylist management" key="greylist">
            <ManageAccountList type="greylist" />
          </Collapse.Panel>
        )}

        <Collapse.Panel header="Manage asset information" key="asset"></Collapse.Panel>

        <Collapse.Panel header="Dividend distribution" key="asset"></Collapse.Panel>
      </Collapse>
      <h2>Real fancy stuff, skipping in V1</h2>
      <ul>
        <li>Manage token roles</li>
        <li>Update restrictions and rules [SRC20.updateRestrictionsAndRules]</li>
        <li>List minters, add, remove [SRC20Registry]</li>
      </ul>
    </div>
  );
}
