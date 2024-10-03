import { useEffect, useState } from 'react';
import { Form, FormInstance, Spin } from 'antd';
import {
  ErrorMessage,
  VsDatePickerFormItem,
  VsMobileDatePickerFormItem,
  VsSelectFormItem
} from 'vs-design-components';
import { VsSelectMobileFormItem } from 'vs-design-components/src/Components/Select';

import { TAllocationFilters } from '@/types/cartFulfillmentTypes';
import { SelectOption } from '@/types/commonTypes';

import useSelectPagination, {
  TSelectPaginationHook
} from '@/hooks/useSelectPagination';
import { ALL, ALL_OPTION } from '@/utils/constants';
import {
  getFormattedDateNoTimeZone,
  getIsAfterDate,
  getIsBeforeDate
} from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import { useAllocationFilterStyle } from './allocationFiltersStyle';

interface props {
  form: FormInstance<TAllocationFilters>;
  isFulfilled: boolean;
  orderedByFilterOptions: SelectOption[];
  fulfilledByFilterOptions: SelectOption[];
  selectPagination: TSelectPaginationHook;
}

const AllocationFiltersForm: React.FC<props> = ({
  form,
  isFulfilled,
  orderedByFilterOptions = [],
  fulfilledByFilterOptions = [],
  selectPagination
}) => {
  const isSmall = window.screen.width <= 576;

  const [date, setDate] = useState({
    from: '',
    to: ''
  });

  const {
    dropdownLoading,
    options: cartOptions,
    handleSearch,
    search,
    onDropdownVisibleChange,
    onPopupScroll,
    onScrollMobile
  } = selectPagination;

  const fromDateValidator = (rule: any, value: any) => {
    const endDate = form.getFieldValue(['toDate']);

    if (endDate && !!value) {
      return !getIsAfterDate(
        getFormattedDateNoTimeZone({ date: endDate, endOf: 'day' }),
        getFormattedDateNoTimeZone({ date: value, startOf: 'day' })
      )
        ? Promise.reject(
            <ErrorMessage>From date cannot be after To date</ErrorMessage>
          )
        : Promise.resolve();
    }

    return Promise.resolve();
  };

  const toDateValidator = (rule: any, value: any) => {
    const startDate = form.getFieldValue(['fromDate']);

    if (startDate && !!value) {
      return !getIsBeforeDate(
        getFormattedDateNoTimeZone({ date: startDate, startOf: 'day' }),
        getFormattedDateNoTimeZone({ date: value, endOf: 'day' })
      )
        ? Promise.reject(
            <ErrorMessage>To date cannot be before From date</ErrorMessage>
          )
        : Promise.resolve();
    }

    return Promise.resolve();
  };

  useEffect(() => {
    form.setFieldsValue({
      adminId: ALL,
      allocatedByAdminId: ALL,
      cartId: ALL
    });
  }, []);

  const toWatch = Form.useWatch(['toDate'], form);
  const fromWatch = Form.useWatch(['fromDate'], form);

  return (
    <div style={{ paddingInline: pxToRem(16) }}>
      {!isSmall ? (
        <div>
          <VsDatePickerFormItem
            seperateLabel="Request From"
            placeholder="MM/DD/YYYY"
            date={date.from}
            datePickerProps={{
              maxDate: toWatch ? new Date(toWatch) : new Date('1/1/2100'),
              minDate: new Date('1/1/1900'),
              onChange: () => {}
            }}
            formItemProps={{
              name: 'fromDate'
            }}
            formNamePath={['fromDate']}
            width="100%"
            onChange={d => {
              setDate({
                ...date,
                from: d
              });
            }}
            toFromDate={toWatch}
          />
        </div>
      ) : (
        <VsMobileDatePickerFormItem
          seperateLabel="Request From"
          placeholder="MM/DD/YYYY"
          max={toWatch ?? new Date('1/1/2100')}
          min={new Date('1/1/1900')}
          formItemProps={{
            name: 'fromDate'
          }}
          formNamePath={['fromDate']}
          width="100%"
          onChange={d => {
            setDate({
              ...date,
              from: d
            });
          }}
        />
      )}

      {!isSmall ? (
        <div>
          {' '}
          <VsDatePickerFormItem
            seperateLabel={'Request To'}
            placeholder="MM/DD/YYYY"
            date={date.to}
            datePickerProps={{
              maxDate: new Date('1/1/2100'),
              minDate: fromWatch ? new Date(fromWatch) : new Date('1/1/1900'),
              onChange: () => {}
            }}
            formItemProps={{
              name: 'toDate'
            }}
            formNamePath={['toDate']}
            width="100%"
            toFromDate={fromWatch}
            onChange={d => {
              setDate({
                ...date,
                from: d
              });
            }}
          />
        </div>
      ) : (
        <VsMobileDatePickerFormItem
          seperateLabel={'Request To'}
          placeholder="MM/DD/YYYY"
          max={new Date('1/1/2100')}
          min={fromWatch ?? new Date('1/1/1900')}
          formItemProps={{
            name: 'toDate'
          }}
          formNamePath={['toDate']}
          width="100%"
          onChange={d => {
            setDate({
              ...date,
              from: d
            });
          }}
        />
      )}

      {isSmall ? (
        <VsSelectMobileFormItem
          placeholder="Cart"
          defaultValue={ALL}
          options={
            dropdownLoading
              ? [
                  ...cartOptions,
                  {
                    key: undefined,
                    value: undefined,
                    label: (
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <Spin spinning={true}></Spin>
                      </div>
                    )
                  }
                ]
              : [ALL_OPTION, ...cartOptions]
          }
          width="100%"
          formItemProps={{
            name: 'cartId'
          }}
          filterOption={(input: any, option: any) => {
            return true;
          }}
          loading={dropdownLoading}
          showSearch={true}
          formNamePath={['cartId']}
          onModalVisibleChange={onDropdownVisibleChange}
          onScrollBottom={onScrollMobile}
          onSearch={handleSearch}
          searchPlaceholder={'Search Cart'}
          modalTitle="Select Cart"
          externalShowLabel={true}
        />
      ) : (
        <VsSelectFormItem
          placeholder="Cart"
          defaultValue={ALL}
          options={
            dropdownLoading
              ? [
                  ...cartOptions,
                  {
                    key: undefined,
                    value: undefined,
                    label: (
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <Spin spinning={true}></Spin>
                      </div>
                    )
                  }
                ]
              : [ALL_OPTION, ...cartOptions]
          }
          width="100%"
          formItemProps={{
            name: 'cartId'
          }}
          filterOption={(input: any, option: any) => {
            return true;
          }}
          loading={dropdownLoading}
          showSearch={true}
          formNamePath={['cartId']}
          onDropdownVisibleChange={onDropdownVisibleChange}
          onPopupScroll={onPopupScroll}
          onSearch={handleSearch}
          externalShowLabel={true}
        />
      )}
      {isSmall ? (
        <VsSelectMobileFormItem
          placeholder="Ordered By"
          defaultValue={ALL}
          options={[ALL_OPTION, ...orderedByFilterOptions]}
          width="100%"
          formItemProps={{
            name: 'adminId'
          }}
          formNamePath={['adminId']}
          modalTitle="Select Ordered By"
          searchPlaceholder={'Search Admin'}
          externalShowLabel={true}
        />
      ) : (
        <VsSelectFormItem
          placeholder="Ordered By"
          defaultValue={ALL}
          options={[ALL_OPTION, ...orderedByFilterOptions]}
          width="100%"
          formItemProps={{
            name: 'adminId'
          }}
          formNamePath={['adminId']}
          externalShowLabel={true}
        />
      )}

      {isFulfilled &&
        (isSmall ? (
          <VsSelectMobileFormItem
            placeholder="Fulfilled By"
            defaultValue={ALL}
            options={[ALL_OPTION, ...fulfilledByFilterOptions]}
            width="100%"
            formItemProps={{
              name: 'allocatedByAdminId'
            }}
            formNamePath={['allocatedByAdminId']}
            modalTitle="Select Fulfilled By"
            searchPlaceholder={'Search Admin'}
            externalShowLabel={true}
          />
        ) : (
          <VsSelectFormItem
            placeholder="Fulfilled By"
            defaultValue={ALL}
            options={[ALL_OPTION, ...fulfilledByFilterOptions]}
            width="100%"
            formItemProps={{
              name: 'allocatedByAdminId'
            }}
            formNamePath={['allocatedByAdminId']}
            externalShowLabel={true}
          />
        ))}
    </div>
  );
};

export default AllocationFiltersForm;
