import { FC } from 'react';
import { Grid, Typography } from 'antd';
import { VsTable } from 'vs-design-components';

import { TCartFullfillmentPick } from '@/types/cartFulfillmentTypes';
import { TPagination } from '@/types/commonTypes';

import useCookies from '@/hooks/useCookies';
import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  DEFAULT_PAGE_SIZEOPTIONS_FOR_SELECTABLE,
  PERMISSION_TYPES_BACKEND
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useUnprocessedTableStyle } from './unprocessedTableStyle';

const { useBreakpoint } = Grid;

interface Props {
  tableColumns: any[];
  tableData: any[];
  pagination: TPagination | undefined;
  onChangePagination: (page: number, pageSize: number) => void;
  isLoading: boolean;
  selectedRowKeys: React.Key[];
  onSelectCheckbox: (
    record: TCartFullfillmentPick,
    selected: boolean,
    selectedRows: TCartFullfillmentPick[],
    nativeEvent: any
  ) => void;
  onSelectAllCheckboxes: (
    selected: boolean,
    selectedRows: TCartFullfillmentPick[],
    changeRows: TCartFullfillmentPick[]
  ) => void;
}

export const UnprocessedTable: FC<Props> = ({
  tableData,
  tableColumns,
  pagination,
  onChangePagination,
  isLoading,
  selectedRowKeys,
  onSelectCheckbox,
  onSelectAllCheckboxes
}) => {
  const size = useBreakpoint();
  const { container, containerReadRbac, rowLight, rowDark, warningRow } =
    useUnprocessedTableStyle();

  const admin = useCookies().getDataFromCookie();
  const permission = admin.rbac.cartRequestDrugs;
  const { tableHeight } = useTablePaginationPosition(
    selectedRowKeys.length > 0,
    0
  );

  const isSmallScreenSize = window.screen.width < 576;

  const rowClassName: any = (record: TCartFullfillmentPick, index: any) => {
    if (!record.isDrugFound) {
      return warningRow;
    }

    return index % 2 === 0 ? rowLight : rowDark;
  };

  return (
    <div
      className={
        permission === PERMISSION_TYPES_BACKEND.WRITE
          ? container
          : containerReadRbac
      }
      style={{ width: '100%' }}
    >
      <VsTable
        tableProps={{
          columns: tableColumns,
          dataSource: tableData,
          loading: isLoading,
          rowClassName: rowClassName,
          rowSelection:
            permission === PERMISSION_TYPES_BACKEND.WRITE
              ? {
                  onSelect: onSelectCheckbox,
                  onSelectAll: onSelectAllCheckboxes,
                  selectedRowKeys: selectedRowKeys,
                  columnWidth: pxToRem(48)
                }
              : undefined,
          sticky: true,
          pagination: {
            current: pagination?.currentPage,
            defaultPageSize: pagination?.perPage
              ? pagination?.perPage
              : DEFAULT_PAGE_SIZE.SELECTOR,
            showSizeChanger: size.xs ? false : true,
            onChange: onChangePagination,
            total: pagination?.totalItems,
            showTotal: !size.xs
              ? (total: any, range: any) => {
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
            pageSizeOptions: DEFAULT_PAGE_SIZEOPTIONS_FOR_SELECTABLE
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
