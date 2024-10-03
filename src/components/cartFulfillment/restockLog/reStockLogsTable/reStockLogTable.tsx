import { FC, useEffect } from 'react';
import { Grid, Typography } from 'antd';
import { VsTable } from 'vs-design-components';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

interface Props {
  tableColumns: any[];
  tableData: any[];
  pagination: Record<string, any>;
  onChangePagination: (page: number, pageSize: number) => void;
  isLoading: boolean;
  tableStyle: any;
  isModalTable?: boolean;
}

export const ReStockLogTable: FC<Props> = ({
  tableData,
  tableColumns,
  pagination,
  onChangePagination,
  isLoading,
  tableStyle,
  isModalTable = false
}) => {
  const size = useBreakpoint();
  const { tableHeight } = useTablePaginationPosition();

  const isSmallScreenSize = window.screen.width < 576;

  return (
    <div className={tableStyle} style={{ width: '100%' }}>
      <VsTable
        tableProps={{
          columns: tableColumns,
          dataSource: tableData,
          loading: isLoading,
          sticky: true,
          pagination: {
            current: pagination.currentPage,
            defaultPageSize: pagination?.perPage
              ? pagination?.perPage
              : isSmallScreenSize
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
            },
            pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS
          },
          scroll: {
            x: 'max-content',
            y: tableData.length
              ? isModalTable
                ? pxToRem(427)
                : tableHeight
              : undefined
          }
        }}
      />
    </div>
  );
};
