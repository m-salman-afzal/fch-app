import { FC } from 'react';
import { Col, Grid, Typography } from 'antd';
import { VsTable } from 'vs-design-components';

import { Patient } from '@/types/patientTypes';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import { DEFAULT_PAGE_SIZE_OPTIONS } from '@/utils/constants';

import { useBridgeTherapyTableStyle } from './useBrideTherapyTableStyle';

const { useBreakpoint } = Grid;

interface Props {
  tableColumns: any[];
  tableData: any[];
  pagination: Record<string, any>;
  onChangePagination: (page: number, pageSize: number) => void;
  isLoading: boolean;
  onSelectChange: (
    selectedRowKeys: React.Key[],
    selectedRows: Patient[]
  ) => void;
  selectedRowKeys: React.Key[];
  onSelectCheckbox: (
    record: any,
    selected: any,
    selectedRows: any,
    nativeEvent: any
  ) => void;
  onSelectAllCheckboxes: (
    selected: any,
    selectedRows: any,
    changeRows: any
  ) => void;
}

export const BridgeTherapyTable: FC<Props> = ({
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
  const { mobileContainer, container } = useBridgeTherapyTableStyle();
  const isSmallScreenSize = window.screen.width < 576;
  const { tableHeight } = useTablePaginationPosition();

  return (
    <div className={container} style={{ width: '100%' }}>
      <VsTable
        tableProps={{
          columns: tableColumns,
          dataSource: tableData,
          loading: isLoading,
          rowSelection: {
            onSelect: onSelectCheckbox,
            onSelectAll: onSelectAllCheckboxes,
            selectedRowKeys: selectedRowKeys,
            columnWidth: 48
          },
          sticky: true,
          pagination: {
            current: pagination.currentPage,
            defaultPageSize: pagination.perPage,
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
            pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS
          },
          scroll: {
            x: 'max-content',
            y: tableData.length
              ? isSmallScreenSize
                ? window.innerHeight - 305
                : tableHeight
              : undefined
          }
        }}
      />
    </div>
  );
};
