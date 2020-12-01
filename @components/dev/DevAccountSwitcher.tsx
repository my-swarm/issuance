import React, { ReactElement } from 'react';
import { devEthereumAccounts } from '@app';
import { Select, Space } from 'antd';

interface DevAccountSwitcherProps {
  value: number;
  onChange: (accountId: number) => void;
}

export function DevAccountSwitcher({ onChange, value }): ReactElement {
  const handleChange = (accountId: number) => {
    onChange(accountId);
  };

  const options = devEthereumAccounts.map((account, key) => ({ value: key, label: account.title }));
  return (
    <div style={{ position: 'fixed', right: '4rem', bottom: '1rem', background: 'red', padding: '1rem' }}>
      <Space>
        <span>Dev account:</span>
        <Select options={options} onChange={handleChange} value={value} style={{ width: '12rem' }} />
      </Space>
    </div>
  );
}
