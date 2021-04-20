import React, { ReactElement, useEffect } from 'react';
import { Space, Tooltip } from 'antd';
import _ from 'lodash';
import { SyncOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@lib/icons';
import * as devData from 'dev_data';

import { isDev, useAppState, useStorage } from '@app';
import { formatDatetime } from '@lib';
import { SideBox } from '../utility';

export function SidebarDataSync(): ReactElement {
  const [state, dispatch] = useAppState();
  const { isLoaded, isSaving, isSynced, version } = state;

  const handleResetDev = () => {
    if (isDev) {
      dispatch({ type: 'restoreState', data: { ...devData, version: 0 } });
    }
  };

  const { save, isWorking } = useStorage();

  useEffect(() => {
    if (isLoaded) {
      save(_.pick(state, ['tokens', 'fundraisers', 'version', 'accountNames', 'accountNotes']));
    }
  }, [isLoaded, version]);

  useEffect(() => {
    if (isWorking) {
      dispatch({ type: 'startSaving' });
    } else {
      window.setTimeout(() => dispatch({ type: 'endSaving' }), 500);
    }
  }, [isWorking]);

  // don't render the UI. Works still.
  if (!isDev) return null;

  function renderCardTitle() {
    return (
      <Space>
        {isSaving ? (
          <SyncOutlined spin />
        ) : isSynced ? (
          <Tooltip title="Synchronized with storage">
            <CheckCircleOutlined />
          </Tooltip>
        ) : (
          <Tooltip title="Out of sync with storage">
            <ExclamationCircleOutlined />
          </Tooltip>
        )}
        <div style={{ marginLeft: '1px' }}>Data sync</div>
      </Space>
    );
  }

  return (
    <SideBox>
      <h3 className="title" style={{ marginLeft: '1px' }}>
        {renderCardTitle()}
      </h3>
      <div className="body">
        <div className="mb-1">{formatDatetime(Math.round(version / 1000))}</div>
        <Space size="small">
          <span onClick={handleResetDev} className="link">
            Reset
          </span>
        </Space>
      </div>
    </SideBox>
  );
}
