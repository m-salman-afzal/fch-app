import { FC } from 'react';
import { Grid, Typography } from 'antd';
import { VsTable } from 'vs-design-components';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useSFTPLogsTableStyle } from './useSFTPLogsTableStyle';

const { useBreakpoint } = Grid;

interface Props {
  tableColumns: any[];
  tableData: any[];
  pagination: Record<string, any>;
  onChangePagination: (page: number, pageSize: number) => void;
  isLoading: boolean;
}

export const SFTPLogsTable: FC<Props> = ({
  tableData,
  tableColumns,
  pagination,
  onChangePagination,
  isLoading
}) => {
  const size = useBreakpoint();
  const isSmallScreenSize = window.screen.width < 576;
  const { mobileContainer, container } = useSFTPLogsTableStyle();
  const isSmallScreenSzie = window.screen.width < 576;

  const { tableHeight } = useTablePaginationPosition();

  return (
    <div className={size.xs ? mobileContainer : container}>
      <div
        style={{
          overflowY: 'auto',
          height: '100dvh',
          position: 'relative',
          paddingBottom: size.xs ? pxToRem(100) : pxToRem(150)
        }}
      >
        <VsTable
          tableProps={{
            columns: tableColumns,
            dataSource: tableData,
            loading: isLoading,
            sticky: true,
            pagination: {
              defaultPageSize: pagination?.perPage
                ? pagination.perPage
                : isSmallScreenSzie
                  ? DEFAULT_PAGE_SIZE.MOBILE
                  : DEFAULT_PAGE_SIZE.DESKTOP,
              pageSize: pagination.perPage,
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
              y: tableData.length ? tableHeight : undefined
            }
          }}
        />
      </div>
    </div>
  );
};
