import { Dispatch, SetStateAction, useState } from 'react';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, FormInstance, Grid, Row, Switch, Typography } from 'antd';
import {
  DrawerFilterButton,
  FilterSearch,
  VsButton
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import {
  TAllocationFilters,
  TCartAllocation,
  TCartAllocationControlledForm
} from '@/types/cartFulfillmentTypes';
import { SelectOption } from '@/types/commonTypes';

import { ALLOCATION_TABS } from '@/containers/carFulfillment/constants';
import { TSelectPaginationHook } from '@/hooks/useSelectPagination';
import { pxToRem } from '@/utils/sharedUtils';

import AllocationFiltersForm from './allocationFiltersForm';
import FulfillModalButton from './fulfillModalButton';

interface props {
  isFulfilled: boolean;
  onSearchPick: (e: any) => void;
  selectedData: TCartAllocation[];
  onClickClear: () => void;
  filterForm: FormInstance<any>;
  setIsFulfilled: Dispatch<SetStateAction<boolean>>;
  selectedTab: string;
  controlledFulfillForm: FormInstance<any>;
  onCloseFulfillModal: () => void;
  onClickDelete: () => void;
  onFulfillNonControlled: () => Promise<void>;
  onFulfillControlled: (values: TCartAllocationControlledForm) => Promise<void>;
  isLoading: boolean;
  onSubmitFiltersForm: (values: TAllocationFilters) => Promise<void>;
  onResetFiltersForm: () => Promise<void>;
  adminFilterOptions: {
    fulfilledByAdmins: SelectOption[];
    orderedByAdmins: SelectOption[];
  };
  selectPagination: TSelectPaginationHook;
  search: string;
}

const { useBreakpoint } = Grid;

const AllocationActions: React.FC<props> = ({
  isFulfilled,
  onSearchPick,
  selectedData,
  onClickClear,
  filterForm,
  setIsFulfilled,
  controlledFulfillForm,
  selectedTab,
  onCloseFulfillModal,
  onClickDelete,
  onFulfillControlled,
  onFulfillNonControlled,
  isLoading,
  onSubmitFiltersForm,
  onResetFiltersForm,
  adminFilterOptions,
  selectPagination,
  search
}) => {
  const isSmall = window.screen.width <= 576;

  const isMedium = window.screen.width < 1440;
  const size = useBreakpoint();
  const [isSearching, setSearching] = useState<boolean>(false);

  const blurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };

  return (
    <Row
      justify={size.xs ? 'start' : 'end'}
      align={size.xs ? 'top' : 'middle'}
      style={{ rowGap: isSmall ? pxToRem(16) : undefined }}
    >
      {selectedData.length > 0 && !isSmall && (
        <Col
          style={{
            display: 'flex',
            alignItems: 'center',
            marginInlineEnd: pxToRem(15)
          }}
        >
          <Typography.Text style={{ fontSize: pxToRem(12) }}>
            {selectedData.length}{' '}
            {`${selectedData.length > 1 ? 'items' : 'item'} selected`}
          </Typography.Text>
          <VsButton
            antButtonProps={{
              type: 'link'
            }}
            style={{
              textDecoration: 'underline',
              fontSize: pxToRem(12),
              lineHeight: 1.57
            }}
            size={BUTTON_SIZES.small}
            onClick={onClickClear}
          >
            Clear
          </VsButton>
        </Col>
      )}
      <Col
        style={{
          display: 'flex',
          alignItems: 'center',
          marginInlineEnd: pxToRem(8)
        }}
        xs={undefined}
      >
        <Typography.Text
          style={{ marginInlineEnd: pxToRem(10), fontSize: pxToRem(12) }}
        >
          Show Fulfilled
        </Typography.Text>
        <Switch
          checked={isFulfilled}
          onChange={checked => setIsFulfilled(checked)}
        />
      </Col>
      <Col
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexWrap: 'nowrap',
          gap: pxToRem(8)
        }}
      >
        {!isMedium && (
          <FilterSearch
            placeholder={'Search Drug'}
            onChange={onSearchPick}
            value={search}
          />
        )}

        {isMedium &&
          (!isSearching ? (
            <VsButton
              onClick={() => {
                setSearching(true);
              }}
              size={BUTTON_SIZES.squareIcon}
            >
              <SearchOutlined />
            </VsButton>
          ) : (
            <FilterSearch
              onBlur={blurSearch}
              onChange={onSearchPick}
              autoFocus={true}
              placeholder="Search Drug"
              width={isSmall ? pxToRem(150) : pxToRem(150)}
              value={search}
            />
          ))}

        <DrawerFilterButton
          handleReset={onResetFiltersForm}
          onClickApply={onSubmitFiltersForm}
          formRef={filterForm}
          isIcon={!size.xl}
        >
          <AllocationFiltersForm
            form={filterForm}
            isFulfilled={isFulfilled}
            orderedByFilterOptions={adminFilterOptions.orderedByAdmins}
            fulfilledByFilterOptions={adminFilterOptions.fulfilledByAdmins}
            selectPagination={selectPagination}
          />
        </DrawerFilterButton>

        {selectedData.length > 0 && (
          <>
            <VsButton
              size={BUTTON_SIZES.squareIcon}
              antButtonProps={{ danger: true }}
              onClick={onClickDelete}
            >
              <DeleteOutlined />
            </VsButton>
            <FulfillModalButton
              isControlled={selectedTab === ALLOCATION_TABS[1]?.value}
              onClick={() => {}}
              onCloseModal={onCloseFulfillModal}
              onSubmit={
                selectedTab === ALLOCATION_TABS[1]?.value
                  ? (onFulfillControlled as any)
                  : (onFulfillNonControlled as any)
              }
              selectedData={selectedData}
              controlledFulfillForm={controlledFulfillForm}
              isLoading={isLoading}
            />
          </>
        )}
      </Col>
      {selectedData.length > 0 && isSmall && (
        <Col
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBlockStart: pxToRem(10)
          }}
          xs={24}
        >
          <Typography.Text style={{ fontSize: pxToRem(12) }}>
            {selectedData.length}{' '}
            {`${selectedData.length > 1 ? 'items' : 'item'} selected`}
          </Typography.Text>
          <VsButton
            antButtonProps={{
              type: 'link'
            }}
            style={{ textDecoration: 'underline', fontSize: pxToRem(12) }}
            size={BUTTON_SIZES.small}
            onClick={onClickClear}
          >
            Clear
          </VsButton>
        </Col>
      )}
    </Row>
  );
};
export default AllocationActions;
