import { FC, useState } from 'react';
import { FormInstance, Grid } from 'antd';

import { TPagination } from '@/types/commonTypes';

import { searchingInitialValues } from '@/containers/logs/logsIntialValues';
import { pxToRem } from '@/utils/sharedUtils';

import FilterTags from '../common/filterTags/filterTags';
import { LogsModalTable } from './logsModalTable';
import { LogsFilters } from './logsSearch/logsFilter';
import { LogsSearch } from './logsSearch/logsSearch';
import { LogsTable } from './logsTable/logsTable';
import { useLogTableStyle } from './logsTable/useLogsTableStyle';
import { useLogsTableStyle } from './styles/useLogsTableStyle';

const { useBreakpoint } = Grid;

interface Props {
  tableColumns: any[];
  tableData: any[];
  pagination: TPagination | undefined;
  onChangePagination: (page: number, pageSize: number) => void;
  showModal: boolean;
  modalTableData: any[];
  handleModalClose: () => void;
  changedData: any[];
  changeLogCreateAt: string;
  setSearchValue: (val: string) => void;
  setLogType: (val: string) => void;
  searchResult: any[];
  setSelectedUser: (val: any) => void;
  isLoading: boolean;
  setSort: (val: string) => void;
  filterFormRef: FormInstance;
  handleFormSubmit: (val: any) => void;
  searchingFilter: any;
}

export const LogsLayout: FC<Props> = ({
  tableColumns,
  tableData,
  pagination,
  onChangePagination,
  showModal,
  handleModalClose,
  modalTableData,
  changedData,
  changeLogCreateAt,
  setSearchValue,
  setLogType,
  searchResult,
  setSelectedUser,
  isLoading,
  setSort,
  filterFormRef,
  handleFormSubmit,
  searchingFilter
}) => {
  const size = useBreakpoint();
  const [filterOpen, setFilterOpen] = useState(false);
  const { logTableContainer } = useLogsTableStyle();

  const handleReset = () => {
    filterFormRef.resetFields();
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      <div
        style={{
          paddingInline: size.xs ? pxToRem(20) : undefined
        }}
      >
        <LogsSearch
          handleReset={handleReset}
          onClickApply={handleFormSubmit}
          filterFormRef={filterFormRef}
          setSearchValue={setSearchValue}
          setLogType={setLogType}
          searchResult={searchResult}
          setSelectedUser={setSelectedUser}
          setSort={setSort}
          setFilterOpen={setFilterOpen}
        />
      </div>
      <FilterTags
        filterForm={filterFormRef}
        filterState={searchingFilter}
        filterInitialValues={searchingInitialValues}
        onChangeFilters={handleFormSubmit}
        marginBottom={0}
        marginTop={0}
        excludeKeys={{
          sort: true,
          currentPage: true,
          perPage: true,
          totalItems: true,
          totalPages: true,
          patientId: true,
          adminId: true,
          role: true
        }}
      />
      <div className={logTableContainer}>
        <LogsTable
          tableColumns={tableColumns}
          tableData={tableData}
          pagination={pagination}
          onChangePagination={onChangePagination}
          isLoading={isLoading}
        />
      </div>
      <LogsModalTable
        showModal={showModal}
        tableData={modalTableData}
        handleCancel={handleModalClose}
        changedData={changedData}
        changeLogCreateAt={changeLogCreateAt}
      />
    </div>
  );
};
