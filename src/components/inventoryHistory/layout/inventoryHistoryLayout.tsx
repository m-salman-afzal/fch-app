import React, { PropsWithChildren } from 'react';
import { Col, FormInstance, Grid, Row, theme, Typography } from 'antd';
import { DrawerFilterButton, VsTable } from 'vs-design-components';

import { Pagination } from '@/types/commonTypes';
import {
  TInventoryHistory,
  TInventoryHistoryDateFilters
} from '@/types/InventoryHistoryTypes';

import FilterTags from '@/components/common/filterTags/filterTags';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { InventoryHistoryFilter } from '../filter/inventoryHistoryFilter';
import { useInventoryHistoryStyle } from '../styles/inventoryHistoryStyle';

interface props {
  onClickDownload: any;
  isLoading: boolean;
  formRef: FormInstance<any>;
  tableColumns: any[];
  data: TInventoryHistory[];
  pagination: Pagination;
  onPaginationChange: (pageNumber: number, pageSize: number) => void;
  onFilterApply: (fields: any) => void;
  onFilterReset: () => void;
  filterDate: TInventoryHistoryDateFilters;
}

const { useBreakpoint } = Grid;

export const InventoryHistoryLayout: React.FC<PropsWithChildren<props>> = ({
  onClickDownload,
  isLoading,
  formRef,
  tableColumns,
  data,
  pagination,
  onPaginationChange,
  onFilterReset,
  onFilterApply,
  filterDate
}) => {
  const { inventoryHistoryTable } = useInventoryHistoryStyle();
  const size = useBreakpoint();
  const isSmall = window.screen.width <= 576;

  const { tableHeight } = useTablePaginationPosition();

  return (
    <div>
      <Row gutter={[0, 16]}>
        <Col span={24} style={{ padding: size.xs ? `0 ${pxToRem(20)}` : '0' }}>
          <Row>
            <Col span={12}>
              {size.xs && (
                <Typography.Text
                  style={{ fontSize: pxToRem(16), fontWeight: 600 }}
                >
                  Inventory History
                </Typography.Text>
              )}
            </Col>

            <Col span={12}>
              <Row justify={'end'}>
                <DrawerFilterButton
                  isIcon={size.xs}
                  handleReset={onFilterReset}
                  onClickApply={onFilterApply}
                  formRef={formRef}
                >
                  <div style={{ paddingInline: pxToRem(16) }}>
                    <InventoryHistoryFilter form={formRef} />
                  </div>
                </DrawerFilterButton>
              </Row>
            </Col>
          </Row>
        </Col>

        <FilterTags<TInventoryHistoryDateFilters>
          filterForm={formRef}
          filterState={filterDate}
          filterInitialValues={{
            dateFrom: undefined,
            dateTo: undefined
          }}
          onChangeFilters={onFilterApply}
          marginBottom={pxToRem(-16)}
        />
        <Col span={24} className={inventoryHistoryTable}>
          <VsTable
            tableProps={{
              pagination: {
                onChange: onPaginationChange,
                pageSizeOptions: !size.xs
                  ? DEFAULT_PAGE_SIZE_OPTIONS
                  : undefined,
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

                position: ['bottomCenter'],
                total: pagination?.totalItems
              },
              sticky: true,
              columns: tableColumns,
              dataSource: data,
              loading: isLoading,
              scroll: {
                x: 'max-content',
                y: data?.length ? tableHeight : undefined
              }
            }}
          />
        </Col>
      </Row>
    </div>
  );
};
