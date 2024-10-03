import { FC } from 'react';
import { Form, FormInstance, Grid } from 'antd';
import {
  DrawerFilterButton,
  VsDatePickerFormItem,
  VsMobileDatePickerFormItem,
  VsSelectFormItem
} from 'vs-design-components';
import { VsSelectMobileFormItem } from 'vs-design-components/src/Components/Select';

import { ALL, APP_ACTIONS, FILTER_ENTITIES } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useLogSearchStyle } from './useLogsSearchStyle';

const { useBreakpoint } = Grid;

interface Props {
  handleReset: () => void;
  onClickApply: (val: any) => void;
  filterFormRef: FormInstance;
}

export const LogsFilters: FC<Props> = ({
  handleReset,
  onClickApply,
  filterFormRef
}) => {
  const { formItemWrappingDiv } = useLogSearchStyle();
  const size = useBreakpoint();

  const toWatch = Form.useWatch(['toDate'], filterFormRef);
  const fromWatch = Form.useWatch(['fromDate'], filterFormRef);

  return (
    <DrawerFilterButton
      handleReset={handleReset}
      onClickApply={onClickApply}
      formRef={filterFormRef}
    >
      <div
        style={{
          paddingInline: pxToRem(16)
        }}
      >
        <div className={formItemWrappingDiv}>
          {size.md ? (
            <VsDatePickerFormItem
              seperateLabel={'From'}
              placeholder="MM/DD/YYYY"
              width="100%"
              datePickerProps={{
                minDate: new Date('01/01/1900'),
                maxDate: toWatch ?? new Date('01/01/2200')
              }}
              formItemProps={{
                name: 'fromDate',
                noStyle: true,
                style: {
                  marginBlockEnd: pxToRem(15)
                }
              }}
              toFromDate={toWatch}
            />
          ) : (
            <VsMobileDatePickerFormItem
              seperateLabel={'From'}
              placeholder="MM/DD/YYYY"
              width="100%"
              max={toWatch ?? new Date('1/1/2100')}
              min={new Date('1/1/1900')}
              formItemProps={{
                name: 'fromDate',
                noStyle: true,
                style: {
                  marginBlockEnd: pxToRem(15)
                }
              }}
            />
          )}
        </div>

        <div className={formItemWrappingDiv}>
          {size.md ? (
            <VsDatePickerFormItem
              seperateLabel={'To'}
              placeholder="MM/DD/YYYY"
              width="100%"
              datePickerProps={{
                minDate: fromWatch ?? new Date('01/01/1900'),
                maxDate: new Date('01/01/2200')
              }}
              formItemProps={{
                name: 'toDate',
                noStyle: true,
                style: {
                  marginBlockEnd: pxToRem(15)
                }
              }}
              toFromDate={fromWatch}
            />
          ) : (
            <VsMobileDatePickerFormItem
              seperateLabel={'To'}
              placeholder="MM/DD/YYYY"
              width="100%"
              max={new Date('1/1/2100')}
              min={fromWatch ?? new Date('1/1/1900')}
              formItemProps={{
                name: 'toDate',
                noStyle: true,
                style: {
                  marginBlockEnd: pxToRem(15)
                }
              }}
            />
          )}
        </div>

        <div className={formItemWrappingDiv}>
          {size.xs ? (
            <VsSelectMobileFormItem
              defaultActiveFirstOption={true}
              modalTitle="Select Entity"
              searchPlaceholder={'Search Entity'}
              options={FILTER_ENTITIES}
              placeholder="Entity"
              formItemProps={{
                noStyle: true,
                name: 'entity',
                initialValue: ALL
              }}
            />
          ) : (
            <VsSelectFormItem
              defaultActiveFirstOption={true}
              options={FILTER_ENTITIES}
              placeholder="Entity"
              formItemProps={{
                noStyle: true,
                name: 'entity',
                initialValue: ALL
              }}
              showSearch={true}
              filterOption={(input: any, option: any) => {
                return !!(
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
            />
          )}
        </div>

        <div className={formItemWrappingDiv}>
          <VsSelectFormItem
            defaultActiveFirstOption={true}
            options={APP_ACTIONS}
            placeholder="Action"
            formItemProps={{
              noStyle: true,
              name: 'action',
              initialValue: ALL
            }}
          />
        </div>
      </div>
    </DrawerFilterButton>
  );
};
