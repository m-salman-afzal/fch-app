import { FC } from 'react';
import { FormInstance } from 'antd';

import { FacilitiesTable } from './facilitiesTable';
import { FacilityModal } from './modals/facilityModal';
import { FacilitiesSearch } from './search/facilitiesSearch';
import { FacilityUnitsDrawer } from './unitsDrawer/facilityUnitsDrawer';
import { useFacilityStyle } from './useFacilityStyles';

interface Props {
  handleFilterInput: (val: string) => void;
  tableColumns: any[];
  tableData: any[];
  facilityFormRef: FormInstance;
  handleFacilityFormSubmit: (val: any) => void;
  modalTitle: string;
  addFacilityModalOpen: (val: boolean) => void;
  onCloseUnitsDrawer: () => void;
  addFacilityModal: boolean;
  tableLoading: boolean;
  facilityExists: any[];
  facilityToEdit: any;
  unitsDrawerOpen: boolean;
  facilityIdToEdit: any;
  facilityUnits?: any[];
  onChangeUnitsMainSelectionBox: any;
  onChangeSingleUnitSelectionBox: any;
  handleUnitsFilterInput: any;
  unitsPaginationInfo: any;
  onUnitsPaginationChange: any;
  onSaveChangedUnits: any;
  updatedFacilityUnits?: any;
  unitSearchInputRef: any;
  onCancelFacilitiesModal: () => void;
  isLoading: boolean;
}

export const FacilitiesLayout: FC<Props> = ({
  handleFilterInput,
  tableColumns,
  tableData,
  facilityFormRef,
  handleFacilityFormSubmit,
  onCloseUnitsDrawer,
  modalTitle,
  addFacilityModal,
  addFacilityModalOpen,
  tableLoading,
  facilityExists,
  facilityToEdit,
  unitsDrawerOpen,
  facilityUnits = [],
  facilityIdToEdit = '',
  onChangeUnitsMainSelectionBox,
  onChangeSingleUnitSelectionBox,
  handleUnitsFilterInput,
  unitsPaginationInfo,
  onUnitsPaginationChange,
  onSaveChangedUnits,
  updatedFacilityUnits = {},
  unitSearchInputRef,
  onCancelFacilitiesModal,
  isLoading
}) => {
  return (
    <div>
      <FacilitiesSearch
        handleFilterInput={handleFilterInput}
        addFacilityModalOpen={addFacilityModalOpen}
      />
      <FacilitiesTable
        tableData={tableData}
        tableColumns={tableColumns}
        pagination={{}}
        isLoading={tableLoading}
        onChangePagination={() => {}}
        useTableStyle={useFacilityStyle}
      />
      <FacilityModal
        isLoading={isLoading}
        title={modalTitle}
        setOpen={addFacilityModalOpen}
        open={addFacilityModal}
        facilityFormRef={facilityFormRef}
        handleFacilityFormSubmit={handleFacilityFormSubmit}
        facilityExists={facilityExists}
        facilityToEdit={facilityToEdit}
        onCancelFacilitiesModal={onCancelFacilitiesModal}
      />
      <FacilityUnitsDrawer
        unitsOpen={unitsDrawerOpen}
        onCloseUnitsDrawer={onCloseUnitsDrawer}
        onClickSave={onSaveChangedUnits}
        formRef={facilityFormRef}
        facility={
          tableData.filter(
            facility => facility.facilityId === facilityIdToEdit
          )[0]
        }
        facilityUnits={facilityUnits}
        onChangeUnitsMainSelectionBox={onChangeUnitsMainSelectionBox}
        onChangeSingleUnitSelectionBox={onChangeSingleUnitSelectionBox}
        handleUnitsFilterInput={handleUnitsFilterInput}
        unitsPaginationInfo={unitsPaginationInfo}
        onChangePagination={onUnitsPaginationChange}
        loading={tableLoading}
        updatedUnits={updatedFacilityUnits}
        searchInputRef={unitSearchInputRef}
      />
    </div>
  );
};
