'use client';

import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Col, FormInstance, Grid, Tooltip, Typography } from 'antd';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import {
  TCartRequestLog,
  TRestockLogFilters
} from '@/types/cartFulfillmentTypes';
import { SelectOption, TPagination } from '@/types/commonTypes';

import { ReStockLogFilter } from '@/components/cartFulfillment/restockLog/filters/reStockLogFilters';
import { ReStockLogModal } from '@/components/cartFulfillment/restockLog/reStockLogModal';
import { ReStockLogTable } from '@/components/cartFulfillment/restockLog/reStockLogsTable/reStockLogTable';
import { useReStockLogTableStyle } from '@/components/cartFulfillment/restockLog/reStockLogsTable/useReStockLogTableStyle';
import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';
import { usePillStyle } from '@/components/common/colorfulPill/usePillStyle';

import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import {
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

import { RESTOCK_LOGS_TABS } from '../constants';

const { useBreakpoint } = Grid;

interface Props {
  pagination: TPagination;
  onChangePagination: (page: number, pageSize: number) => void;
  paginationModal: TPagination;
  onChangePaginationModal: (page: number, pageSize: number) => void;
  filterFormRef: FormInstance;
  filterOpen: boolean;
  setFilterOpen: (val: any) => void;
  onClickApply: (val: TRestockLogFilters) => void;
  onClickAction: (val: any) => void;
  onClickDownload: (restockLogType: string, restockDrugsList: any) => void;
  search: string;
  showModal: boolean;
  handleCancel: () => void;
  fetchRestockLog: (data: any) => Promise<void>;
  tableData: any[];
  modalTableData: any[];
  selectedCart: TCartRequestLog | {};
  userOptions: any[];
  getType: (val: string) => string;
  isLoading: boolean;
  setSelectedFilterAdmin: Dispatch<SetStateAction<SelectOption>>;
}

export const AfterHoursContainer: FC<Props> = ({
  pagination,
  onChangePagination,
  paginationModal,
  onChangePaginationModal,
  filterFormRef,
  filterOpen,
  setFilterOpen,
  onClickDownload,
  onClickApply,
  onClickAction,
  search,
  handleCancel,
  showModal,
  fetchRestockLog,
  tableData,
  modalTableData,
  selectedCart,
  userOptions,
  getType,
  isLoading,
  setSelectedFilterAdmin
}) => {
  const { standardAfterHoursContainer } = useReStockLogTableStyle();
  const { greenPill, yellowPill, greyPill } = usePillStyle();
  const isSmall = window.screen.width <= 576;

  const afterHoursColumns: any = [
    {
      title: 'Date & Time',
      width: isSmall ? 150 : undefined,
      render: (value: TCartRequestLog) => (
        <div>
          {getFormattedDateInEST({
            date: value.createdAt,
            format: DATE_FORMATS.MDY_TIME
          })}
        </div>
      )
    },
    {
      title: 'User',
      width: isSmall ? 150 : undefined,

      render: (value: TCartRequestLog) => (
        <div>{`${value.admin.lastName}, ${value.admin.firstName}`}</div>
      )
    },
    {
      title: 'Type',
      width: isSmall ? 150 : undefined,

      render: (value: TCartRequestLog) => (
        <ColorfulPill
          className={value.isControlled ? yellowPill : greyPill}
          text={value.isControlled ? 'Controlled' : 'Non-Controlled'}
        />
      )
    },
    {
      title: 'Drug Count',
      width: isSmall ? 150 : undefined,

      render: (value: TCartRequestLog) => <div>{value.drugCount}</div>
    },
    {
      title: 'Total Units',
      width: isSmall ? 150 : undefined,

      render: (value: TCartRequestLog) => <div>{value.totalUnit}</div>
    },
    {
      title: 'Status',
      width: isSmall ? 150 : undefined,

      render: (value: TCartRequestLog) => (
        <ColorfulPill
          className={greenPill}
          key={value.type}
          text={getType(value.type)}
        />
      )
    },
    {
      title: '',
      key: 'action',
      width: isSmall ? 58 : undefined,
      render: (value: any) => {
        return (
          <VsButton
            antButtonProps={{
              icon: (
                <Tooltip title={'View'}>
                  <EyeOutlined style={TABLE_BUTTON_ICON_SIZE} />
                </Tooltip>
              )
            }}
            size={BUTTON_SIZES.squareIcon}
            onClick={() => {
              onClickAction(value);
            }}
            style={TABLE_BUTTON_STYLE}
          ></VsButton>
        );
      }
    }
  ];

  useEffect(() => {
    fetchRestockLog({
      text: search,
      selectedTab: RESTOCK_LOGS_TABS[1]?.value
    });
  }, [search]);

  return (
    <div>
      <ReStockLogTable
        tableColumns={afterHoursColumns}
        tableData={tableData}
        pagination={pagination}
        onChangePagination={onChangePagination}
        isLoading={isLoading}
        tableStyle={standardAfterHoursContainer}
      />

      <ReStockLogModal
        showModal={showModal}
        handleCancel={handleCancel}
        isLoading={false}
        tableData={modalTableData}
        pagination={paginationModal}
        onChangePagination={onChangePaginationModal}
        cart={selectedCart as TCartRequestLog}
        onClickDownload={onClickDownload}
        getType={getType}
      />

      <ReStockLogFilter
        reStockLogType={'After-hours'}
        filterOpen={filterOpen}
        setFilerOpen={() => setFilterOpen((x: any) => !x)}
        handleReset={() => {
          filterFormRef.resetFields();
        }}
        filterFormRef={filterFormRef}
        onClickApply={onClickApply}
        users={userOptions}
        setSelectedFilterAdmin={setSelectedFilterAdmin}
      />
    </div>
  );
};
