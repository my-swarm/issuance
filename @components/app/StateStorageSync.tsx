import React, { ReactElement, useEffect } from 'react';
import { Card, Button, Spin, Space, Tooltip } from 'antd';
import _ from 'lodash';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons/lib';
import * as devData from 'dev_data';

import { useAppState, useStorage } from '@app';

export function StateStorageSync(): ReactElement {
  const [state, dispatch] = useAppState();
  const { isLoaded, isSaving, isSynced, version } = state;

  const handleSave = () => {
    dispatch({ type: 'incrementVersion' });
  };

  const handleResetDev = () => {
    console.log('reseting to', devData);
    dispatch({ type: 'restoreState', data: { ...devData, version: 0 } });
  };

  const { save, isWorking } = useStorage();

  useEffect(() => {
    if (isLoaded) {
      save(_.pick(state, ['tokens', 'version']));
    }
  }, [version]);

  useEffect(() => {
    if (isWorking) {
      dispatch({ type: 'startSaving' });
    } else {
      window.setTimeout(() => dispatch({ type: 'endSaving' }), 1000);
    }
  }, [isWorking]);

  function renderCardTitle() {
    return (
      <Space>
        {isSaving ? (
          <Spin size="small" />
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
        <div className="mb-1">Data version: {version}</div>
        <Space size="small">
          <span onClick={handleSave}>Save</span>
          <span onClick={handleResetDev}>Reset</span>
        </Space>
      </div>
    </>
  );
}
