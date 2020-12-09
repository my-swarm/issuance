import React, { ReactElement } from 'react';
import { Collapse } from 'antd';
import { useAppState } from '@app';
import {
  ManageAccountList,
  ManageSupply,
  ManageTokenHolders,
  ManageTokenStatus,
  ManageTransferHistory,
  ManageTransferRequests,
  ManageDividends,
  ManageAsset,
  ManageDistribute,
} from '..';

export function TokenManage(): ReactElement {
  const [{ onlineToken: token }] = useAppState();

  return (
    <div>
      <Collapse defaultActiveKey={[]}>
        {token.features.tokenFreeze && (
          <Collapse.Panel header="Freeze token" key="status">
            <ManageTokenStatus />
          </Collapse.Panel>
        )}

        <Collapse.Panel header="Token supply (Mint & Burn)" key="supply">
          <ManageSupply />
        </Collapse.Panel>

        <Collapse.Panel header="Distribute token" key="distribute">
          <ManageDistribute />
        </Collapse.Panel>

        <Collapse.Panel header="Token holders" key="holders">
          <ManageTokenHolders />
        </Collapse.Panel>

        <Collapse.Panel header="Transfer history" key="transfers">
          <ManageTransferHistory />
        </Collapse.Panel>

        {token.transferRules && (
          <>
            <Collapse.Panel header="Transfer requests" key="requests">
              <ManageTransferRequests />
            </Collapse.Panel>
            <Collapse.Panel header="Whitelist management" key="whitelist">
              <ManageAccountList type="whitelist" />
            </Collapse.Panel>
            <Collapse.Panel header="Greylist management" key="greylist">
              <ManageAccountList type="greylist" />
            </Collapse.Panel>
          </>
        )}

        {/* this is disabled before we figure out how to store KYA */}
        {false && (
          <Collapse.Panel header="Manage asset information" key="asset">
            <ManageAsset />
          </Collapse.Panel>
        )}

        <Collapse.Panel header="Dividend distribution" key="dividend">
          <ManageDividends />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
