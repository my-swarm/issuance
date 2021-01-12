import React, { ChangeEvent, ChangeEventHandler, ReactElement, useRef, useState } from 'react';
import { Input, Space } from 'antd';
import { CloseCircleOutlined } from '@lib/icons';

interface FilterDropdownProps {
  onChange: (value: string) => void;
}

export function FilterDropdown({ onChange }: FilterDropdownProps): ReactElement {
  const searchInput = useRef<Input>();
  const [searchText, setSearchText] = useState<string>('');

  const handleChange: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div style={{ padding: 8 }}>
      <Space>
        <Input
          ref={searchInput}
          placeholder={`Search in account list`}
          value={searchText}
          onChange={handleChange}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <CloseCircleOutlined onClick={() => setSearchText('')} />
      </Space>
    </div>
  );
}
