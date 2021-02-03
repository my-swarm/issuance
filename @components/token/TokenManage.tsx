import React, { ReactElement } from 'react';
import { Collapse } from 'antd';
import { AddressZero } from '@ethersproject/constants';
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
  Help,
} from '..';

export function TokenManage(): ReactElement {
  const [{ onlineToken: token }] = useAppState();

  return (
    <div>
      <Collapse defaultActiveKey={[]}>
        {token.features.tokenFreeze && (
          <Collapse.Panel header="Freeze token" key="status" extra={<Help name="manageFreeze" />}>
            <ManageTokenStatus />
          </Collapse.Panel>
        )}

        <Collapse.Panel header="Token supply (Mint & Burn)" key="supply" extra={<Help name="manageSupply" />}>
          <ManageSupply />
        </Collapse.Panel>

        <Collapse.Panel header="Distribute token" key="distribute" extra={<Help name="manageDistribute" />}>
          <ManageDistribute />
        </Collapse.Panel>

        <Collapse.Panel header="Token holders" key="holders" extra={<Help name="manageHolders" />}>
          <ManageTokenHolders />
        </Collapse.Panel>

        <Collapse.Panel header="Transfer history" key="transfers" extra={<Help name="manageTransfers" />}>
          <ManageTransferHistory />
        </Collapse.Panel>

        {token.transferRules?.address !== AddressZero && (
          <>
            <Collapse.Panel header="Transfer requests" key="requests" extra={<Help name="manageRequests" />}>
              <ManageTransferRequests />
            </Collapse.Panel>
            <Collapse.Panel header="Whitelist management" key="whitelist" extra={<Help name="manageWhitelist" />}>
              <ManageAccountList type="whitelist" />
            </Collapse.Panel>
            <Collapse.Panel header="Greylist management" key="greylist" extra={<Help name="manageGreylist" />}>
              <ManageAccountList type="greylist" />
            </Collapse.Panel>
          </>
        )}

        <Collapse.Panel header="Edit token's KYA" key="asset" extra={<Help name="manageAsset" />}>
          <ManageAsset />
        </Collapse.Panel>

        <Collapse.Panel header="Dividend distribution" key="dividends" extra={<Help name="manageDividends" />}>
          <ManageDividends />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
}
