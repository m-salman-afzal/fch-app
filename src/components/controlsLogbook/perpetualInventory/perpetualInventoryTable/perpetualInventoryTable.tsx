import { useEffect, useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Grid, Row, Typography } from 'antd';
import { VsTable } from 'vs-design-components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TPagination } from '@/types/commonTypes';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';

import { usePerpetualInventoryTableStyle } from './usePerpetualInventoryTableStyle';

interface props {
  inventoryColumns: any[];
  firstLevelData: any[];
  isLoading: boolean;
  nestedRowRender: any;
  pagination: TPagination;
  onChangePagination: (pageNumber: number, pageSize: number) => void;
}
const { useBreakpoint } = Grid;

export const PerpetualInventoryTable: React.FC<props> = ({
  inventoryColumns,
  firstLevelData,
  isLoading,
  nestedRowRender,
  pagination,
  onChangePagination
}) => {
  const isSmall = window.screen.width <= 576;
  const size = useBreakpoint();
  const { perpetualInventoryTableContainer, selectedRow, rowDark, rowLight } =
    usePerpetualInventoryTableStyle();
  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const rowClassName: any = (record: any, index: any) => {
    if (!!expandedKeys.find((key: string) => key === record.key)) {
      return selectedRow;
    }

    return index % 2 === 0 ? rowLight : rowDark;
  };

  const { tableHeight } = useTablePaginationPosition();

  return (
    <Row>
      <Col span={24} className={perpetualInventoryTableContainer}>
        <VsTable
          tableProps={{
            columns: inventoryColumns,
            dataSource: firstLevelData,
            loading: isLoading,
            sticky: true,
            expandable: {
              columnWidth: pxToRem(34),
              onExpand: (expanded, record) => {
                if (expanded) {
                  setExpandedKeys([record.key]);

                  return;
                }
                setExpandedKeys([]);
              },
              expandedRowRender: nestedRowRender,
              expandedRowKeys: expandedKeys,
              expandIcon: expandable => (
                <Button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: pxToRem(4),
                    height: pxToRem(18),
                    width: pxToRem(18),
                    padding: 0
                  }}
                  size="small"
                  shape="default"
                  onClick={e => expandable.onExpand(expandable.record, e)}
                  icon={
                    expandable.expanded ? (
                      <MinusOutlined
                        style={{
                          width: pxToRem(12),
                          height: pxToRem(12),
                          fontSize: pxToRem(12)
                        }}
                      />
                    ) : (
                      <PlusOutlined
                        style={{
                          width: pxToRem(12),
                          height: pxToRem(12),
                          fontSize: pxToRem(12)
                        }}
                      />
                    )
                  }
                ></Button>
              )
            },
            rowClassName: rowClassName,

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
              y: firstLevelData.length === 0 ? undefined : tableHeight - 38
            }
          }}
        />
      </Col>
    </Row>
  );
};
