import { FormInstance, Grid, Row, TableColumnsType } from 'antd';

import { Pagination } from '@/types/commonTypes';
import { Patient } from '@/types/patientTypes';

import FilterTags from '@/components/common/filterTags/filterTags';

import { TBridgeTherapyFilterTypes } from '@/containers/bridgeTherapy/bridgeTherapyIntialValues';
import {
  ALL,
  BRIDGE_THERAPY_FILTER_TYPES,
  BRIDGE_THERAPY_PATIENT_RELEASE_FILTER
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { BridgeTherapyFilters } from './bridgeTherapySearch/bridgeTherapyFilter';
import { BridgeTherapyTable } from './bridgeTherapyTable/bridgeTherapyTable';

const { useBreakpoint } = Grid;

interface props {
  patientColumns: TableColumnsType<any>;
  patientList: Patient[];
  pagination: Pagination;
  onChangePagination: (page: number, pageSize: number) => void;
  isLoading: boolean;
  filterFormRef: FormInstance;
  onClickApply: (val: any, isClearAll?: boolean) => void;
  setFilterOpen: (val: any) => void;
  filterOpen: boolean;
  onScreen: string;
  onChangeScreen: (val: any) => void;
  onAddToSFTPList: () => void;
  showTableActions: boolean;
  onSelectChange: (
    selectedRowKeys: React.Key[],
    selectedRows: Patient[]
  ) => void;
  selectedRowKeys: React.Key[];
  onSelectCheckbox: (
    record: any,
    selected: any,
    selectedRows: any,
    nativeEvent: any
  ) => void;
  onSelectAllCheckboxes: (
    selected: any,
    selectedRows: any,
    changeRows: any
  ) => void;
  filterTagState: TBridgeTherapyFilterTypes;
}

const fitlerEmptyvalues = {
  status: BRIDGE_THERAPY_FILTER_TYPES.ALL_PATIENTS,
  fromDate: undefined,
  toDate: undefined
};
const BridgeTherapyLayout: React.FC<props> = ({
  patientColumns,
  patientList,
  pagination,
  onChangePagination,
  isLoading,
  filterFormRef,
  onClickApply,
  filterOpen,
  setFilterOpen,
  onSelectChange,
  selectedRowKeys,
  onSelectCheckbox,
  onSelectAllCheckboxes,
  filterTagState
}) => {
  const handleReset = () => {
    filterFormRef.resetFields();
  };

  return (
    <Row>
      <FilterTags<TBridgeTherapyFilterTypes>
        filterForm={filterFormRef}
        filterState={filterTagState}
        filterInitialValues={fitlerEmptyvalues}
        onChangeFilters={val => onClickApply(val, true)}
        customMapForSelect={{
          status: BRIDGE_THERAPY_PATIENT_RELEASE_FILTER
        }}
        excludeKeys={{
          status:
            filterTagState.status === BRIDGE_THERAPY_FILTER_TYPES.ALL_PATIENTS
        }}
      />
      <BridgeTherapyTable
        tableColumns={patientColumns}
        tableData={patientList}
        pagination={pagination}
        onChangePagination={onChangePagination}
        isLoading={isLoading}
        onSelectChange={onSelectChange}
        selectedRowKeys={selectedRowKeys}
        onSelectCheckbox={onSelectCheckbox}
        onSelectAllCheckboxes={onSelectAllCheckboxes}
      />
      <BridgeTherapyFilters
        filterOpen={filterOpen}
        setFilerOpen={() => setFilterOpen((x: any) => !x)}
        handleReset={handleReset}
        onClickApply={onClickApply}
        filterFormRef={filterFormRef}
      />
    </Row>
  );
};

export default BridgeTherapyLayout;
