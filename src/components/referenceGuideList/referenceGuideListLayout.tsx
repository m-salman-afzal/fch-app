import { FC } from 'react';
import { FormInstance, Grid, Typography } from 'antd';
import { VsTable } from 'vs-design-components';

import { TReferenceGuide } from '@/types/referenceGuideTypes';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  ALL,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import FilterTags from '../common/filterTags/filterTags';
import { ReferenceGuideListTitle } from './forms/referenceGuideListTitle';
import { ReferenceGuideListUploadTypeModal } from './modals/referenceGuideListUploadType';
import { ReferenceGuideListFilters } from './search/referenceGuideListFilters';
import { useReferenceGuideListStyle } from './useReferenceGuideListStyle';

const { useBreakpoint } = Grid;
interface Props {
  handleFilterInput: (val: string) => void;
  onChangePagination: (page: number, pageSize: number) => void;
  tableColumns: any[];
  tableData: any[];
  filtersFormRef: FormInstance;
  tableLoading: boolean;
  onChangeReferenceGuide: (value: string) => void;
  filters?: any;
  referenceGuideTotalDrugs?: number;
  onDownLoadCSV: () => void;
  onSubmitFilters: (formData: any) => void;
  onResetFilters: () => void;
  referenceGuideListUploadTypeShow?: boolean;
  toggleReferenceGuideListUploadTypeModal: (value: boolean) => void;
  selectedReferenceGuideListUploadType: string;
  setSelectedReferenceGuideListUploadType: (value: string) => void;
  onNextAfterSelectingReferenceGuideListUploadType: () => void;
  referenceGuideListTitle?: string;
  onSaveReferenceGuideListTitle: (title: string) => void;
  referenceGuideList?: any[];
  referenceGuideCategoryList: any[];
  referenceGuideSubCategoryList: any[];
  onChangeCategoryFilter: (value: any) => void;
  openReferenceGuideNoteModal: (note: string | undefined) => void;
  selectedReferenceGuide: TReferenceGuide | undefined;
  onDeleteReferenceGuide: () => void;
}

export const ReferenceGuideListLayout: FC<Props> = ({
  handleFilterInput,
  tableColumns,
  tableData,
  tableLoading,
  onChangePagination,
  onChangeReferenceGuide,
  filters,
  referenceGuideTotalDrugs = 0,
  onDownLoadCSV,
  filtersFormRef,
  onSubmitFilters,
  onResetFilters,
  referenceGuideListUploadTypeShow = false,
  toggleReferenceGuideListUploadTypeModal,
  selectedReferenceGuideListUploadType,
  setSelectedReferenceGuideListUploadType,
  onNextAfterSelectingReferenceGuideListUploadType,
  referenceGuideListTitle,
  onSaveReferenceGuideListTitle,
  referenceGuideList = [],
  referenceGuideCategoryList = [],
  referenceGuideSubCategoryList = [],
  onChangeCategoryFilter,
  openReferenceGuideNoteModal,
  selectedReferenceGuide,
  onDeleteReferenceGuide
}) => {
  const { referenceGuideListTableContainer } = useReferenceGuideListStyle();
  const size = useBreakpoint();
  const isSmall = window.screen.width <= 576;
  const { tableHeight } = useTablePaginationPosition();
  const tableHieghtWithTagSpace = tableHeight - 35;

  return (
    <div>
      <ReferenceGuideListFilters
        handleFilterInput={handleFilterInput}
        onChangeReferenceGuide={onChangeReferenceGuide}
        filters={filters}
        onDownLoadCSV={onDownLoadCSV}
        filtersFormRef={filtersFormRef}
        onSubmitFilters={onSubmitFilters}
        onResetFilters={onResetFilters}
        toggleReferenceGuideListUploadTypeModal={
          toggleReferenceGuideListUploadTypeModal
        }
        referenceGuideList={referenceGuideList}
        referenceGuideCategoryList={referenceGuideCategoryList}
        referenceGuideSubCategoryList={referenceGuideSubCategoryList}
        onChangeCategoryFilter={onChangeCategoryFilter}
      />
      <ReferenceGuideListTitle
        referenceGuideTitle={referenceGuideListTitle}
        onSaveEditedTitle={onSaveReferenceGuideListTitle}
        openReferenceGuideNoteModal={openReferenceGuideNoteModal}
        selectedReferenceGuide={selectedReferenceGuide}
        onDeleteReferenceGuide={onDeleteReferenceGuide}
      />

      <FilterTags
        filterForm={filtersFormRef}
        filterState={filters}
        onChangeFilters={onSubmitFilters}
        filterInitialValues={{
          category: ALL,
          subCategory: ALL
        }}
        excludeKeys={{
          perPage: true,
          referenceGuideId: true,
          currentPage: true
        }}
        marginTop={pxToRem(12)}
      />
      <div className={referenceGuideListTableContainer}>
        <VsTable
          tableProps={{
            dataSource: tableData,
            columns: tableColumns,
            sticky: true,
            pagination: {
              onChange: (page, pageSize) => {
                return onChangePagination(page, pageSize);
              },
              defaultPageSize: isSmall
                ? DEFAULT_PAGE_SIZE.MOBILE
                : DEFAULT_PAGE_SIZE.DESKTOP,
              pageSizeOptions: !size.xs ? DEFAULT_PAGE_SIZE_OPTIONS : undefined,
              showSizeChanger: !size.xs,
              total: referenceGuideTotalDrugs,
              position: ['bottomCenter'],
              size: 'small',
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
              y: tableData.length === 0 ? undefined : tableHieghtWithTagSpace
            }
          }}
        />
      </div>
      <ReferenceGuideListUploadTypeModal
        handleNext={onNextAfterSelectingReferenceGuideListUploadType}
        open={referenceGuideListUploadTypeShow}
        setOpen={toggleReferenceGuideListUploadTypeModal}
        selected={selectedReferenceGuideListUploadType}
        setSelected={setSelectedReferenceGuideListUploadType}
      />
    </div>
  );
};
