import { FormInstance, TableColumnsType } from 'antd';

import { BridgeTherapy } from '@/types/bridgeTherapyTypes';
import { Pagination } from '@/types/commonTypes';

import FilterTags from '@/components/common/filterTags/filterTags';

import { TSFTPLogFilter } from '@/containers/bridgeTherapy/sftpLogsIntialValues';
import { ALL } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { SftpLogsFilters } from './sftpLogsSearch/sftpLogsFilter';
import { SFTPLogsTable } from './sftpLogsTable/sftpLogsTable';

interface props {
  bridgeTherapyColumns: TableColumnsType<any>;
  bridgeTherapyList: BridgeTherapy[];
  pagination: Pagination;
  onChangePagination: (page: number, pageSize: number) => void;
  isLoading: boolean;

  filterFormRef: FormInstance;
  onClickApply: (val: any, isClearAll?: boolean) => void;
  setFilterOpen: (val: any) => void;
  filterOpen: boolean;
  allAdmins: any[];
  filterTagsState: TSFTPLogFilter;
}

const SFTPLogsLayout: React.FC<props> = ({
  bridgeTherapyColumns,
  bridgeTherapyList,
  pagination,
  onChangePagination,
  isLoading,
  filterFormRef,
  onClickApply,
  filterOpen,
  setFilterOpen,
  allAdmins,
  filterTagsState
}) => {
  const handleReset = () => {
    filterFormRef.resetFields();
  };

  return (
    <div>
      <FilterTags<TSFTPLogFilter>
        filterForm={filterFormRef}
        filterState={filterTagsState}
        filterInitialValues={{
          bridgeTherapyLogCreatedAt: undefined,
          adminId: ALL
        }}
        onChangeFilters={val => onClickApply(val, true)}
        customKeys={{
          adminId: 'Uploaded By',
          bridgeTherapyLogCreatedAt: 'Date',
          adminName: 'Uploaded By'
        }}
        customMapForSelect={{
          adminId: allAdmins,
          adminName: allAdmins
        }}
        marginTop={pxToRem(16)}
        excludeKeys={{
          sort: true,
          adminId: true
        }}
      />
      <SFTPLogsTable
        tableColumns={bridgeTherapyColumns}
        tableData={bridgeTherapyList}
        pagination={pagination}
        onChangePagination={onChangePagination}
        isLoading={isLoading}
      />

      <SftpLogsFilters
        filterOpen={filterOpen}
        setFilerOpen={() => setFilterOpen(false)}
        handleReset={handleReset}
        onClickApply={onClickApply}
        filterFormRef={filterFormRef}
        allAdmins={allAdmins}
      />
    </div>
  );
};

export default SFTPLogsLayout;
