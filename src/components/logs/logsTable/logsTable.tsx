import { FC } from 'react';
import { Grid, Typography } from 'antd';
import { VsTable } from 'vs-design-components';

import { TPagination } from '@/types/commonTypes';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';

import { useLogTableStyle } from './useLogsTableStyle';

const { useBreakpoint } = Grid;

interface Props {
  tableColumns: any[];
  tableData: any[];
  pagination: TPagination | undefined;
  onChangePagination: (page: number, pageSize: number) => void;
  isLoading: boolean;
}

export const LogsTable: FC<Props> = ({
  tableData,
  tableColumns,
  pagination,
  onChangePagination,
  isLoading
}) => {
  const size = useBreakpoint();
  const { mobileContainer, container } = useLogTableStyle();
  const isSmallScreenSzie = window.screen.width < 576;
  const { tableHeight } = useTablePaginationPosition();

  return (
    <div className={size.xs ? mobileContainer : container}>
      <VsTable
        tableProps={{
          columns: tableColumns,
          dataSource: tableData,
          loading: isLoading,
          pagination: {
            pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
            defaultPageSize: pagination?.perPage
              ? pagination?.perPage
              : isSmallScreenSzie
                ? DEFAULT_PAGE_SIZE.MOBILE
                : DEFAULT_PAGE_SIZE.DESKTOP,
            showSizeChanger: size.xs ? false : true,
            onChange: onChangePagination,
            total: pagination?.totalItems,
            showTotal: !size.xs
              ? (total, range) => {
                  return (
                    <Typography.Text>
                      Showing {range[1]} out of <strong>{total}</strong>
                    </Typography.Text>
                  );
                }
              : undefined,
            size: 'small',
            position: ['bottomCenter'],
            locale: {
              items_per_page: ``
            }
          },
          scroll: {
            x: 'max-content',
            y: tableData.length ? tableHeight : undefined
          }
        }}
      />
    </div>
  );
};
