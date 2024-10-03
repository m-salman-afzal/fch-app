import { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';
import { FormInstance } from 'antd';

import {
  TAllocationFilters,
  TCartAllocation,
  TCartAllocationControlledForm
} from '@/types/cartFulfillmentTypes';
import { SelectOption, TPaginatedData, TPagination } from '@/types/commonTypes';

import { TSelectPaginationHook } from '@/hooks/useSelectPagination';

import { AllocationNavigation } from './allocationNavigation';

interface Props {
  isFulfilled: boolean;
  setSelectedTab: (val: string) => void;
  allocationSelectedData: TCartAllocation[];
  onClickClear: () => void;
  filterForm: FormInstance<any>;
  setIsFulfilled: Dispatch<SetStateAction<boolean>>;
  controlledFulfillForm: FormInstance<any>;
  onCloseFulfillModal: () => void;
  onClickDelete: () => void;
  onFulfillNonControlled: () => Promise<void>;
  onFulfillControlled: (values: TCartAllocationControlledForm) => Promise<void>;
  isLoading: boolean;
  onSearch: (e: any) => void;
  onSubmitFiltersForm: (values: TAllocationFilters) => Promise<void>;
  onResetFiltersForm: () => Promise<void>;
  adminFilterOptions: {
    fulfilledByAdmins: SelectOption[];
    orderedByAdmins: SelectOption[];
  };
  selectWithPagination: TSelectPaginationHook;
  search: string;
  selectedTab: string;
}

export const AllocationLayout: FC<PropsWithChildren<Props>> = ({
  setSelectedTab,
  allocationSelectedData,
  onClickClear,
  filterForm,
  setIsFulfilled,
  controlledFulfillForm,
  onCloseFulfillModal,
  children,
  isFulfilled,
  onClickDelete,
  onFulfillNonControlled,
  onFulfillControlled,
  isLoading,
  onSearch,
  onResetFiltersForm,
  onSubmitFiltersForm,
  adminFilterOptions,
  selectWithPagination,
  search,
  selectedTab
}) => {
  return (
    <div>
      <AllocationNavigation
        isFulfilled={isFulfilled}
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
        selectedData={allocationSelectedData}
        onClickClear={onClickClear}
        filterForm={filterForm}
        setIsFulfilled={setIsFulfilled}
        controlledFulfillForm={controlledFulfillForm}
        onCloseFulfillModal={onCloseFulfillModal}
        onClickDelete={onClickDelete}
        onFulfillNonControlled={onFulfillNonControlled}
        onFulfillControlled={onFulfillControlled}
        isLoading={isLoading}
        onSearch={onSearch}
        onResetFiltersForm={onResetFiltersForm}
        onSubmitFiltersForm={onSubmitFiltersForm}
        adminFilterOptions={adminFilterOptions}
        selectWithPagination={selectWithPagination}
        search={search}
      />
      <div>{children}</div>
    </div>
  );
};
