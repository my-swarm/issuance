import React, { ReactElement, useEffect } from 'react';
import { Space, Tooltip } from 'antd';
import _ from 'lodash';
import { SyncOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons/lib';
import * as devData from 'dev_data';

import { useAppState, useStorage } from '@app';
import { formatDatetime } from '@lib';

export function StateStorageSync(): ReactElement {
  const [state, dispatch] = useAppState();
  const { isLoaded, isSaving, isSynced, version } = state;

  const handleResetDev = () => {
    dispatch({ type: 'restoreState', data: { ...devData, version: 0 } });
  };

  const { save, isWorking } = useStorage();

  useEffect(() => {
    if (isLoaded) {
      save(_.pick(state, ['tokens', 'fundraisers', 'version', 'accountNames', 'accountNotes']));
    }
  }, [version]);

  useEffect(() => {
    if (isWorking) {
      dispatch({ type: 'startSaving' });
    } else {
      window.setTimeout(() => dispatch({ type: 'endSaving' }), 500);
    }
  }, [isWorking]);

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
    <>
      <h3 className="side-box-title" style={{ marginLeft: '1px' }}>
        {renderCardTitle()}
      </h3>
      <div className="side-box-body">
        <div className="mb-1">{formatDatetime(Math.round(version / 1000))}</div>
        <Space size="small">
          <span onClick={handleResetDev} className="link">
            Reset
          </span>
        </Space>
      </div>
    </>
  );
}
