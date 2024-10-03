import React, { PropsWithChildren } from 'react';
import { Col, FormInstance, Grid, Row, theme, Typography } from 'antd';
import { DrawerFilterButton, VsTable } from 'vs-design-components';

import { Pagination } from '@/types/commonTypes';
import { TMedpassDateFilters } from '@/types/medpassTypes';

import FilterTags from '@/components/common/filterTags/filterTags';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { DowntimeMedpassFilter } from '../filter/downtimeMedpassFilter';
import { useDowntimeMedpassStyle } from '../styles/useDowntimeMedpassStyle';

interface props {
  onClickDownload: any;
  isLoading: boolean;
  formRef: FormInstance<any>;
  tableColumns: any[];
  data: any[];
  pagination: Pagination;
  onPaginationChange: (pageNumber: number, pageSize: number) => void;
  onFilterApply: (fields: any) => void;
  onFilterReset: () => void;
  filterDate: TMedpassDateFilters;
}

const { useBreakpoint } = Grid;
const { useToken } = theme;

export const DowntimeMedpassLayout: React.FC<PropsWithChildren<props>> = ({
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
  const { medPassTable } = useDowntimeMedpassStyle();
  const size = useBreakpoint();
  const { token } = useToken();
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
                  Downtime Medpass
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
                    <DowntimeMedpassFilter form={formRef} />
                  </div>
                </DrawerFilterButton>
              </Row>
            </Col>
          </Row>
        </Col>

        <FilterTags<TMedpassDateFilters>
          filterForm={formRef}
          filterState={filterDate}
          filterInitialValues={{
            dateFrom: undefined,
            dateTo: undefined
          }}
          onChangeFilters={onFilterApply}
          marginBottom={pxToRem(-16)}
        />
        <Col span={24} className={medPassTable}>
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
                y: data.length ? tableHeight : undefined
              }
            }}
          />
        </Col>
      </Row>
    </div>
  );
};
