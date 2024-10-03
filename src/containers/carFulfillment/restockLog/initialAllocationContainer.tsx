'use client';

import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { FormInstance, Tooltip } from 'antd';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import {
  TCartRequestLog,
  TRestockLogFilters
} from '@/types/cartFulfillmentTypes';
import { SelectOption, TPagination } from '@/types/commonTypes';

import { ReStockLogFilter } from '@/components/cartFulfillment/restockLog/filters/reStockLogFilters';
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

interface Props {
  selectedTab: string;
  pagination: TPagination;
  onChangePagination: (page: number, pageSize: number) => void;
  filterFormRef: FormInstance;
  filterOpen: boolean;
  setFilterOpen: (val: any) => void;
  onClickApply: (val: TRestockLogFilters) => void;
  onClickAction: (val: any) => void;
  search: string;
  fetchRestockLog: (data: any) => Promise<void>;
  tableData: any[];
  userOptions: any[];
  getType: (val: string) => string;
  isLoading: boolean;
  setSelectedFilterAdmin: Dispatch<SetStateAction<SelectOption>>;
}

export const InitialAllocationContainer: FC<Props> = ({
  pagination,
  onChangePagination,
  filterFormRef,
  filterOpen,
  setFilterOpen,
  onClickApply,
  onClickAction,
  search,
  fetchRestockLog,
  tableData,
  userOptions,
  getType,
  isLoading,
  setSelectedFilterAdmin
}) => {
  const isSmall = window.screen.width <= 576;
  const { initalAllocationContainer } = useReStockLogTableStyle();
  const { greenPill } = usePillStyle();

  const initialAllocationColumns: any = [
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
      render: (value: TCartRequestLog) => {
        return (
          <div>
            <VsButton
              antButtonProps={{
                icon: (
                  <Tooltip title={'Download'}>
                    <DownloadOutlined style={TABLE_BUTTON_ICON_SIZE} />
                  </Tooltip>
                )
              }}
              size={BUTTON_SIZES.squareIcon}
              onClick={() => {
                onClickAction(value);
              }}
              style={TABLE_BUTTON_STYLE}
            ></VsButton>
          </div>
        );
      }
    }
  ];

  useEffect(() => {
    fetchRestockLog({
      text: search,
      selectedTab: RESTOCK_LOGS_TABS[2]?.value
    });
  }, [search]);

  return (
    <div>
      <ReStockLogTable
        tableColumns={initialAllocationColumns}
        tableData={tableData}
        pagination={pagination}
        onChangePagination={onChangePagination}
        isLoading={isLoading}
        tableStyle={initalAllocationContainer}
      />

      <ReStockLogFilter
        reStockLogType={'Initial Allocation'}
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
