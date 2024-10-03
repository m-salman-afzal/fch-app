import { FC } from 'react';
import { Col, Grid, Typography } from 'antd';
import { VsTable } from 'vs-design-components';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';

const { useBreakpoint } = Grid;

interface Props {
  useTableStyle: any;
  tableColumns: any[];
  tableData: any[];
  pagination: Record<string, any>;
  onChangePagination: (page: number, pageSize: number) => void;
  isLoading: boolean;
}

export const FacilitiesTable: FC<Props> = ({
  useTableStyle,
  tableData,
  tableColumns,
  pagination,
  onChangePagination,
  isLoading
}) => {
  const size = useBreakpoint();
  const { container } = useTableStyle();
  const isSmallScreenSize = window.screen.width < 576;
  const { tableHeight } = useTablePaginationPosition();

  return (
    <Col span={24} className={container}>
      <VsTable
        tableProps={{
          columns: tableColumns,
          dataSource: tableData,
          loading: isLoading,
          sticky: true,
          pagination: {
            defaultPageSize: pagination?.pageSize
              ? pagination?.pageSize
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
            y: tableData.length === 0 ? undefined : tableHeight
          }
        }}
      />
    </Col>
  );
};
