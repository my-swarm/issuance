import { ColumnType, TablePaginationConfig } from 'antd/lib/table';
import { MANAGE_TABLE_PER_PAGE } from '@const';
import { Address } from '@components';
import React, { ReactElement } from 'react';

export function createPagination(showAll: boolean, length: number): TablePaginationConfig {
  return showAll
    ? {
        total: length,
        pageSize: length,
        hideOnSinglePage: true,
      }
    : {
        total: length,
        pageSize: MANAGE_TABLE_PER_PAGE,
        hideOnSinglePage: false,
      };
}

export function renderAddress(value: string): ReactElement {
  return (
    <Address short link>
      {value}
    </Address>
  );
}

export function tableColumns<T>(columns: ColumnType<T>[]): ColumnType<T>[] {
  return columns.map((column) => ({ ...column, dataIndex: column.key, showSorterTooltip: false }));
}
