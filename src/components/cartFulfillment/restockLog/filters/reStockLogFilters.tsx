import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { Form, FormInstance, Grid } from 'antd';
import {
  DrawerFilter,
  VsDatePickerFormItem,
  VsMobileDatePickerFormItem,
  VsSelectFormItem
} from 'vs-design-components/src/Components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TRestockLogFilters } from '@/types/cartFulfillmentTypes';
import { SelectOption } from '@/types/commonTypes';

import { useLogSearchStyle } from '@/components/logs/logsSearch/useLogsSearchStyle';

import {
  RESTOCKLOGS_TYPES,
  STANDARD_RESTOCKLOG_FILTER_STATUS_OPTIONS
} from '@/containers/carFulfillment/constants';
import { ALL, ALL_OPTION } from '@/utils/constants';

const { useBreakpoint } = Grid;

interface Props {
  reStockLogType: string;
  filterOpen: boolean;
  setFilerOpen: () => void;
  handleReset: () => void;
  onClickApply: (val: any) => void;
  filterFormRef: FormInstance<TRestockLogFilters>;
  users: any[];
  setSelectedFilterAdmin: Dispatch<SetStateAction<SelectOption>>;
}

export const ReStockLogFilter: FC<Props> = ({
  reStockLogType,
  filterOpen,
  setFilerOpen,
  handleReset,
  onClickApply,
  filterFormRef,
  users,
  setSelectedFilterAdmin
}) => {
  const size = useBreakpoint();
  const { formItemWrappingDiv } = useLogSearchStyle();

  const toWatch = Form.useWatch(['toDate'], filterFormRef);
  const fromWatch = Form.useWatch(['fromDate'], filterFormRef);
  const watchUser = Form.useWatch(['userId'], filterFormRef);

  useEffect(() => {
    if (watchUser === ALL) {
      setSelectedFilterAdmin(ALL_OPTION);
    }
  }, [watchUser]);

  return (
    <DrawerFilter
      filterOpen={filterOpen}
      setFilterOpen={setFilerOpen}
      handleReset={handleReset}
      onClickApply={onClickApply}
      formRef={filterFormRef}
    >
      <div style={{ paddingInline: pxToRem(20), paddingTop: pxToRem(6) }}>
        <div className={formItemWrappingDiv}>
          {size.xs ? (
            <VsMobileDatePickerFormItem
              seperateLabel={'From'}
              placeholder="MM/DD/YYYY"
              width="100%"
              max={toWatch ?? new Date('1/1/2100')}
              min={new Date('1/1/1900')}
              formItemProps={{
                name: 'from',
                noStyle: true
              }}
            />
          ) : (
            <div style={{ marginBlockEnd: pxToRem(20) }}>
              <VsDatePickerFormItem
                seperateLabel={'From'}
                placeholder="MM/DD/YYYY"
                width="100%"
                datePickerProps={{
                  minDate: new Date('01/01/1900'),
                  maxDate: toWatch ? new Date(toWatch) : new Date('01/01/2200')
                }}
                formItemProps={{
                  name: 'fromDate'
                }}
                toFromDate={toWatch}
              />
            </div>
          )}
        </div>

        <div className={formItemWrappingDiv}>
          {size.xs ? (
            <VsMobileDatePickerFormItem
              seperateLabel={'To'}
              placeholder="MM/DD/YYYY"
              width="100%"
              max={new Date('1/1/2100')}
              min={fromWatch ?? new Date('1/1/1900')}
              formItemProps={{
                name: 'toDate',
                noStyle: true
              }}
            />
          ) : (
            <div style={{ marginBlockEnd: pxToRem(20) }}>
              <VsDatePickerFormItem
                seperateLabel={'To'}
                placeholder="MM/DD/YYYY"
                width="100%"
                datePickerProps={{
                  minDate: fromWatch
                    ? new Date(fromWatch)
                    : new Date('01/01/1900'),
                  maxDate: new Date('01/01/2200')
                }}
                formItemProps={{
                  name: 'toDate'
                }}
                toFromDate={fromWatch}
              />
            </div>
          )}
        </div>

        <div
          style={{ marginBlockEnd: pxToRem(20) }}
          className={formItemWrappingDiv}
        >
          <VsSelectFormItem
            options={users}
            placeholder={'User'}
            defaultActiveFirstOption={true}
            formItemProps={{
              noStyle: true,
              name: 'userId',
              initialValue: ALL
            }}
            onSelect={(value, option) => {
              setSelectedFilterAdmin(option as any);
            }}
            externalShowLabel={true}
          />
        </div>

        {reStockLogType === RESTOCKLOGS_TYPES.STANDARD && (
          <div
            style={{ marginBlockEnd: pxToRem(20) }}
            className={formItemWrappingDiv}
          >
            <VsSelectFormItem
              options={STANDARD_RESTOCKLOG_FILTER_STATUS_OPTIONS}
              placeholder={'Status'}
              defaultActiveFirstOption={true}
              formItemProps={{
                noStyle: true,
                name: 'status',
                initialValue: ALL
              }}
              externalShowLabel={true}
            />
          </div>
        )}
      </div>
    </DrawerFilter>
  );
};
