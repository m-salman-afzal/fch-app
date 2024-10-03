import { FC, useEffect } from 'react';
import { Grid, Typography } from 'antd';
import { VsTable } from 'vs-design-components';

import { TCartAllocation } from '@/types/cartFulfillmentTypes';
import { TPagination } from '@/types/commonTypes';

import { ALLOCATION_TABS } from '@/containers/carFulfillment/constants';
import useCookies from '@/hooks/useCookies';
import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  DEFAULT_PAGE_SIZEOPTIONS_FOR_SELECTABLE,
  PERMISSION_TYPES_BACKEND,
  PERMISSIONS_TYPES
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useAllocationTableStyle } from './allocationTableStyle';

const { useBreakpoint } = Grid;

interface Props {
  selectedTab: string;
  isFulfilled: boolean;
  tableColumns: any[];
  tableData: any[];
  pagination: TPagination | undefined;
  onChangePagination: (page: number, pageSize: number) => void;
  isLoading: boolean;
  selectedRowKeys: React.Key[];
  onSelectCheckbox: (
    record: TCartAllocation,
    selected: boolean,
    selectedRows: TCartAllocation[],
    nativeEvent: any
  ) => void;
  onSelectAllCheckboxes: (
    selected: boolean,
    selectedRows: TCartAllocation[],
    changeRows: TCartAllocation[]
  ) => void;
}

export const AllocationTable: FC<Props> = ({
  selectedTab,
  isFulfilled,
  tableData,
  tableColumns,
  pagination,
  onChangePagination,
  isLoading,
  selectedRowKeys,
  onSelectCheckbox,
  onSelectAllCheckboxes
}) => {
  const admin = useCookies().getDataFromCookie();
  const permission = admin.rbac.cartRequestDrugs;
  const { tableHeight } = useTablePaginationPosition(
    selectedRowKeys.length > 0,
    20
  );

  const size = useBreakpoint();
  const { container, rowLight, rowDark, warningRow, fulfilledContainer } =
    useAllocationTableStyle();
  const isSmallScreenSize = window.screen.width < 576;

  const rowClassName: any = (record: TCartAllocation, index: any) => {
    return index % 2 === 0
      ? `${rowLight} ${!record.containsActive ? warningRow : ''}`
      : `${rowDark} ${!record.containsActive ? warningRow : ''}`;
  };

  const minusValueFromTableHeight = 55;

  return (
    <div
      className={
        isFulfilled || permission !== PERMISSION_TYPES_BACKEND.WRITE
          ? fulfilledContainer
          : container
      }
      style={{ width: '100%' }}
    >
      <VsTable
        tableProps={{
          columns: tableColumns,
          dataSource: tableData,
          loading: isLoading,
          rowClassName: !isFulfilled ? rowClassName : undefined,
          rowSelection: isFulfilled
            ? undefined
            : permission === PERMISSIONS_TYPES.WRITE
              ? {
                  onSelect: onSelectCheckbox,
                  onSelectAll: onSelectAllCheckboxes,
                  selectedRowKeys: selectedRowKeys,
                  getCheckboxProps: (record: TCartAllocation) => ({
                    disabled: !record.containsActive
                  }),
                  type:
                    selectedTab === ALLOCATION_TABS[1]?.value
                      ? 'radio'
                      : 'checkbox',
                  columnWidth: pxToRem(48)
                }
              : undefined,
          sticky: true,
          pagination: {
            current: pagination?.currentPage,
            pageSize: pagination?.perPage ?? undefined,
            defaultPageSize:
              selectedTab === ALLOCATION_TABS[1]?.value
                ? isSmallScreenSize
                  ? DEFAULT_PAGE_SIZE.MOBILE
                  : DEFAULT_PAGE_SIZE.DESKTOP
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
            pageSizeOptions:
              selectedTab === ALLOCATION_TABS[1]?.value
                ? DEFAULT_PAGE_SIZE_OPTIONS
                : DEFAULT_PAGE_SIZEOPTIONS_FOR_SELECTABLE
          },
          scroll: {
            x: 'max-content',
            y: tableData.length
              ? tableHeight - minusValueFromTableHeight
              : undefined
          }
        }}
      />
    </div>
  );
};
