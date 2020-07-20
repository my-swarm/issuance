import React, { useEffect } from 'react';
import { Card, Button, Spin, Space, Tooltip } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons/lib';
import { useStateValue } from '@app';
import { useStorage } from '../app';
import _ from 'lodash';

export function StateStorageSync(): React.ReactNode {
  const [state, dispatch] = useStateValue();
  const { isLoaded, isSaving, isSynced, version, ...data } = state;

  const handleSave = function () {
    dispatch({ type: 'incrementVersion' });
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
      </Card>
    </div>
  );
}
