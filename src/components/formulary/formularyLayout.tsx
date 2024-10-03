import { FC } from 'react';
import { FormInstance, Grid, Typography } from 'antd';
import { VsTable } from 'vs-design-components';

import { Pagination } from '@/types/commonTypes';
import { TFormularyFilters } from '@/types/formularyTypes';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  ALL,
  ALL_OPTION,
  ANONYMOUS_TYPE_OPTIONS,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  STATUS_ACTIVE_INACTIVE
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import FilterTags from '../common/filterTags/filterTags';
import { DrugFormModal } from './drugForm/drugForm';
import { FormularySearch } from './search/formularySearch';
import { useFormularyStyle } from './useFormularyStyle';

const { useBreakpoint } = Grid;
interface Props {
  handleFilterInput: (val: string) => void;
  onChangePagination: (page: number, pageSize: number) => void;
  tableColumns: any[];
  tableData: any[];
  facilityFormRef: FormInstance;
  handleFacilityFormSubmit: (val: any) => void;
  modalTitle: string;
  addFacilityModalOpen: (val: boolean) => void;
  addFacilityModal: boolean;
  tableLoading: boolean;
  facilityExists: any[];
  facilityToEdit: any;
  paginationInfo: Pagination;
  openBulkUploadModel: (value: boolean) => void;
  onDownLoadCSV: () => void;
  isLoading: boolean;
  showDrugTypeOption: boolean;
  controlled: boolean;
  setFilterOpen: (val: any) => void;
  filterState: TFormularyFilters;
  filtersForm: FormInstance<TFormularyFilters>;
  onApplyFilters: (values: TFormularyFilters) => void;
}

export const FormularyLayout: FC<Props> = ({
  handleFilterInput,
  tableColumns,
  tableData,
  facilityFormRef,
  handleFacilityFormSubmit,
  modalTitle,
  addFacilityModal,
  addFacilityModalOpen,
  tableLoading,
  facilityExists,
  facilityToEdit,
  paginationInfo,
  onChangePagination,
  openBulkUploadModel,
  onDownLoadCSV,
  isLoading,
  setFilterOpen,
  showDrugTypeOption,
  controlled,
  filterState,
  filtersForm,
  onApplyFilters
}) => {
  const isSmall = window.screen.width <= 576;
  const filtersInitialValues = {
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP,
    currentPage: 1,
    name: '',
    isActive: ALL,
    isControlled: ALL,
    isFormulary: ALL
  };
  const { formularyTableContainer, rowLight, rowDark } = useFormularyStyle();
  const rowClassName: any = (record: any, index: any) => {
    return index % 2 === 0 ? rowLight : rowDark;
  };
  const { tableHeight } = useTablePaginationPosition();

  const size = useBreakpoint();

  return (
    <div>
      <FormularySearch
        showDrugTypeOption={showDrugTypeOption}
        handleFilterInput={handleFilterInput}
        addFacilityModalOpen={addFacilityModalOpen}
        drugCount={paginationInfo.totalItems}
        openBulkUploadModel={openBulkUploadModel}
        onDownLoadCSV={onDownLoadCSV}
        setFilterOpen={setFilterOpen}
      />

      <FilterTags
        filterForm={filtersForm}
        filterState={filterState}
        filterInitialValues={filtersInitialValues}
        onChangeFilters={onApplyFilters}
        customKeys={{
          isControlled: 'Controlled',
          isFormulary: 'Formulary',
          isActive: 'Status'
        }}
        excludeKeys={{
          currentPage: true,
          perPage: true,
          name: true
        }}
        customMapForSelect={{
          isActive: [ALL_OPTION, ...STATUS_ACTIVE_INACTIVE],
          isControlled: [ALL_OPTION, ...ANONYMOUS_TYPE_OPTIONS],
          isFormulary: [ALL_OPTION, ...ANONYMOUS_TYPE_OPTIONS]
        }}
        marginTop={pxToRem(16)}
      />
      <div className={formularyTableContainer}>
        <VsTable
          tableProps={{
            dataSource: tableData,
            columns: tableColumns,
            sticky: true,
            rowClassName: rowClassName,
            pagination: {
              current: paginationInfo.currentPage,
              onChange: (page, pageSize) => {
                return onChangePagination(page, pageSize);
              },
              defaultPageSize: isSmall
                ? DEFAULT_PAGE_SIZE.MOBILE
                : DEFAULT_PAGE_SIZE.DESKTOP,
              pageSizeOptions: !size.xs ? DEFAULT_PAGE_SIZE_OPTIONS : undefined,
              showSizeChanger: !size.xs,
              total: paginationInfo.totalItems,
              size: 'small',
              position: ['bottomCenter'],
              style: { alignItems: 'center' },
              showTotal: size.sm
                ? (total, range) => {
                    return (
                      <Typography.Text>
                        Showing {range[1]} out of <strong>{total}</strong>
                      </Typography.Text>
                    );
                  }
                : undefined
            },
            loading: tableLoading,
            scroll: {
              x: 'max-content',
              y: tableData.length === 0 ? undefined : tableHeight
            }
          }}
        />
      </div>
      <DrugFormModal
        controlled={controlled}
        showDrugTypeOption={showDrugTypeOption}
        isLoading={isLoading}
        title={modalTitle}
        setOpen={addFacilityModalOpen}
        open={addFacilityModal}
        drugFormRef={facilityFormRef}
        handleDrugFormSubmit={handleFacilityFormSubmit}
        facilityExists={facilityExists}
        drugToEdit={facilityToEdit}
      />
    </div>
  );
};
