import React, { ReactElement, useState } from 'react';
import { TableProps } from 'antd/es/table';
import { Checkbox, Space, Table } from 'antd';
import { createPagination } from '../manage/listUtils';

// eslint-disable-next-line
export function PaginatedTable<RecordType extends object = any>(props: TableProps<RecordType>): ReactElement {
  const [paginate, setPaginate] = useState<boolean>(true);

  const { dataSource } = props;

  return (
    <>
      {dataSource.length > 0 && (
        <div className="text-right mb-2">
          <Space>
            <Checkbox onChange={(e) => setPaginate(e.target.checked)} checked={paginate}>
              {' '}
              paginate
            </Checkbox>
          </Space>
        </div>
      )}
      <Table {...props} pagination={createPagination(!paginate, dataSource.length)} />
    </>
  );
}
