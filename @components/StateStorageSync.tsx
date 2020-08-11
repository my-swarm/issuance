import React, { ReactElement, useEffect } from 'react';
import { Card, Button, Spin, Space, Tooltip } from 'antd';
import _ from 'lodash';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons/lib';
import * as devData from 'dev_data';

import { useStateValue, useStorage } from '@app';

export function StateStorageSync(): ReactElement {
  const [state, dispatch] = useStateValue();
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
        <div>Data sync status</div>
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
      </Space>
    );
  }

  return (
    <div className="c-storage-state-sync">
      <Card size="small" title={renderCardTitle()}>
        <p>Data version: {version}</p>
        <Button size="small" onClick={handleSave}>
          Save
        </Button>
        <Button size="small" onClick={handleResetDev}>
          Reset Dev
        </Button>
      </Card>
    </div>
  );
}
