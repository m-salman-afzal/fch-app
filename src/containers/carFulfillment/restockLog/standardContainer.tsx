'use client';

import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { FormInstance, Grid, Tooltip } from 'antd';
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
  selectedTab: string;
  pagination: TPagination;
  onChangePagination: (page: number, pageSize: number) => void;
  paginationModal: TPagination;
  onChangePaginationModal: (page: number, pageSize: number) => void;
  filterFormRef: FormInstance;
  filterOpen: boolean;
  setFilterOpen: (val: any) => void;
  onClickAction: (val: any) => void;
  onClickDownload: (restockLogType: string, restockDrugsList: any) => void;
  onClickApply: (val: TRestockLogFilters) => void;
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

export const StandardContainer: FC<Props> = ({
  onClickDownload,
  pagination,
  onChangePagination,
  paginationModal,
  onChangePaginationModal,
  filterFormRef,
  filterOpen,
  setFilterOpen,
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
  const size = useBreakpoint();
  const isSmall = window.screen.width <= 576;

  const { standardAfterHoursContainer } = useReStockLogTableStyle();
  const { redPill, greenPill, bluePill, yellowPill, greyPill } = usePillStyle();

  const standardColumns: any = [
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
      render: (value: TCartRequestLog) =>
        value.type !== 'PICK' ? (
          <ColorfulPill
            className={value.isControlled ? yellowPill : greyPill}
            text={value.isControlled ? 'Controlled' : 'Non-Controlled'}
          />
        ) : (
          <div>{'-'}</div>
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
          className={
            value.type === 'PICK'
              ? bluePill
              : value.type === 'DELETE'
                ? redPill
                : greenPill
          }
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
          <VsButton
            antButtonProps={{
              icon: (
                <Tooltip title={'View'}>
                  <EyeOutlined style={TABLE_BUTTON_ICON_SIZE} />
                </Tooltip>
              ),
              disabled: value.isControlled && value.type === 'DELETE'
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
      selectedTab: RESTOCK_LOGS_TABS[0]?.value
    });
  }, [search]);

  return (
    <div>
      <ReStockLogTable
        tableColumns={standardColumns}
        tableData={tableData}
        pagination={pagination}
        onChangePagination={onChangePagination}
        isLoading={isLoading}
        tableStyle={standardAfterHoursContainer}
      />

      <ReStockLogModal
        showModal={showModal}
        handleCancel={handleCancel}
        isLoading={isLoading}
        tableData={modalTableData}
        pagination={paginationModal}
        onChangePagination={onChangePaginationModal}
        cart={selectedCart as TCartRequestLog}
        onClickDownload={onClickDownload}
        getType={getType}
      />

      <ReStockLogFilter
        reStockLogType={'Standard'}
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
