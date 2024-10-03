import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Col, FormInstance, Grid, Row } from 'antd';

import {
  TAllocationFilters,
  TCartAllocation,
  TCartAllocationControlledForm
} from '@/types/cartFulfillmentTypes';
import { SelectOption, TPaginatedData, TPagination } from '@/types/commonTypes';

import { ALLOCATION_TABS } from '@/containers/carFulfillment/constants';
import { TSelectPaginationHook } from '@/hooks/useSelectPagination';
import { pxToRem } from '@/utils/sharedUtils';

import TableSegmented from '../../common/subTabs/tableSegmented';
import { useTableSegmentedStyle } from '../../common/subTabs/useTableSegmentedStyle';
import AllocationActions from './allocationActions';

const { useBreakpoint } = Grid;

interface Props {
  isFulfilled: boolean;
  setSelectedTab: (val: string) => void;
  selectedData: TCartAllocation[];
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

export const AllocationNavigation: FC<Props> = ({
  isFulfilled,
  setSelectedTab,
  selectedData,
  onClickClear,
  filterForm,
  controlledFulfillForm,
  setIsFulfilled,
  onCloseFulfillModal,
  onClickDelete,
  onFulfillControlled,
  onFulfillNonControlled,
  isLoading,
  onSearch,
  onResetFiltersForm,
  onSubmitFiltersForm,
  adminFilterOptions,
  selectWithPagination,
  search,
  selectedTab
}) => {
  const size = useBreakpoint();
  const { segmentedSize } = useTableSegmentedStyle();

  const ALLOCATION_TABS_WIDTH_BASED = [
    {
      label: <div>Non-Controlled</div>,
      value: ALLOCATION_TABS[0]?.value
    },
    {
      label: <div>Controlled</div>,
      value: ALLOCATION_TABS[1]?.value
    },
    {
      label: <div>Initial Allocation</div>,
      value: ALLOCATION_TABS[2]?.value
    }
  ];

  const ALLOCATION_TABS_WIDTH_BASED_IA = [
    {
      label: <div style={{ width: pxToRem(120) }}>Non-Controlled</div>,
      value: ALLOCATION_TABS[0]?.value
    },
    {
      label: <div style={{ width: pxToRem(100) }}>Controlled</div>,
      value: ALLOCATION_TABS[1]?.value
    },
    {
      label: <div style={{ width: pxToRem(120) }}>Initial Allocation</div>,
      value: ALLOCATION_TABS[2]?.value
    }
  ];

  const onChangeScreen = (val: any) => {
    setSelectedTab(val);
  };

  return (
    <div
      style={size.xs ? { paddingInlineEnd: pxToRem(20) } : {}}
      className={selectedTab === ALLOCATION_TABS[2].value ? segmentedSize : ''}
    >
      <Row
        justify={'space-between'}
        style={{
          gap: pxToRem(16),
          paddingTop: size.xs ? pxToRem(7) : '',
          flexDirection: size.xs ? 'column-reverse' : undefined,
          flexWrap: 'wrap-reverse'
        }}
        align={size.xs ? 'bottom' : 'middle'}
      >
        <Col>
          <TableSegmented
            segmentedProps={{
              options:
                selectedTab === ALLOCATION_TABS[2]?.value
                  ? ALLOCATION_TABS_WIDTH_BASED_IA
                  : ALLOCATION_TABS_WIDTH_BASED,
              defaultValue: ALLOCATION_TABS[0]?.value,
              value: selectedTab,
              onChange: onChangeScreen
            }}
          />
        </Col>

        {selectedTab !== ALLOCATION_TABS[2]?.value && (
          <div style={{ paddingInlineStart: pxToRem(20) }}>
            <AllocationActions
              onClickDelete={onClickDelete}
              isFulfilled={isFulfilled}
              onSearchPick={onSearch}
              selectedData={selectedData}
              onClickClear={onClickClear}
              filterForm={filterForm}
              setIsFulfilled={setIsFulfilled}
              selectedTab={selectedTab}
              controlledFulfillForm={controlledFulfillForm}
              onCloseFulfillModal={onCloseFulfillModal}
              onFulfillControlled={onFulfillControlled}
              onFulfillNonControlled={onFulfillNonControlled}
              isLoading={isLoading}
              onResetFiltersForm={onResetFiltersForm}
              onSubmitFiltersForm={onSubmitFiltersForm}
              selectPagination={selectWithPagination}
              adminFilterOptions={adminFilterOptions}
              search={search}
            />
          </div>
        )}
      </Row>
    </div>
  );
};
