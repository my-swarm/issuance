import { TablePaginationConfig } from 'antd/lib/table';
import { MANAGE_TABLE_PER_PAGE } from '@const';

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
