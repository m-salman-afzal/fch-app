import { useEffect, useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Grid, Row, Typography } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { VsTable } from 'vs-design-components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TPagination } from '@/types/commonTypes';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';

import { useDiscrepancyLogTableStyle } from './useDiscrepancyLogTableStyle';

interface props {
  columns: ColumnProps<any[]>[];
  data: any[];
  isLoading: boolean;
  pagination: TPagination;
  onChangePagination: (pageNumber: number, pageSize: number) => void;
}

const { useBreakpoint } = Grid;

export const DiscrepancyLogTable: React.FC<props> = ({
  columns,
  data,
  isLoading,
  pagination,
  onChangePagination
}) => {
  const isSmall = window.screen.width <= 576;

  const size = useBreakpoint();

  const { perpetualInventoryTableContainer } = useDiscrepancyLogTableStyle();

  const { tableHeight } = useTablePaginationPosition();

  return (
    <Row>
      <Col span={24} className={perpetualInventoryTableContainer}>
        <VsTable
          tableProps={{
            columns: columns,
            dataSource: data,
            loading: isLoading,
            sticky: true,
            pagination: {
              current: pagination.currentPage,
              onChange: onChangePagination,
              total: pagination.totalItems,
              pageSizeOptions: !size.xs ? DEFAULT_PAGE_SIZE_OPTIONS : undefined,
              showTotal: size.sm
                ? (total, range) => {
                    return (
                      <Typography.Text>
                        Showing {range[1]} out of <strong>{total}</strong>
                      </Typography.Text>
                    );
                  }
                : undefined,
              showSizeChanger: !size.xs,
              size: 'small',
              defaultPageSize: isSmall
                ? DEFAULT_PAGE_SIZE.MOBILE
                : DEFAULT_PAGE_SIZE.DESKTOP,

              position: ['bottomCenter']
            },
            scroll: {
              x: 'max-content',
              y: data.length === 0 ? undefined : tableHeight
            }
          }}
        />
      </Col>
    </Row>
  );
};
