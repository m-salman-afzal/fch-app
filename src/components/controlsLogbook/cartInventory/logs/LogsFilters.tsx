import { useEffect } from 'react';
import { Form, Grid } from 'antd';
import {
  VsDatePickerFormItem,
  VsMobileDatePickerFormItem,
  VsSelectFormItem
} from 'vs-design-components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { SelectOption } from '@/types/commonTypes';

import { ALL, ALL_OPTION } from '@/utils/constants';

const { useBreakpoint } = Grid;

interface props {
  cart: SelectOption[];
}

export const LogsFilter: React.FC<props> = ({ cart }) => {
  const form = Form.useFormInstance();
  const size = useBreakpoint();

  useEffect(() => {
    form.setFieldsValue({
      cart: ALL
    });
  }, []);

  const toWatch = Form.useWatch(['toDate'], form);
  const fromWatch = Form.useWatch(['fromDate'], form);

  return (
    <div
      style={{
        paddingInline: pxToRem(17)
      }}
    >
      {size.xs ? (
        <div style={{ marginBlockEnd: pxToRem(15) }}>
          <VsMobileDatePickerFormItem
            seperateLabel={'From'}
            placeholder="MM/DD/YYYY"
            width="100%"
            max={toWatch ?? new Date('1/1/2100')}
            min={new Date('1/1/1900')}
            formItemProps={{
              name: 'fromDate',
              noStyle: true
            }}
          />
        </div>
      ) : (
        <div style={{ marginBlockEnd: pxToRem(20) }}>
          <VsDatePickerFormItem
            seperateLabel={'From'}
            placeholder="MM/DD/YYYY"
            width="100%"
            datePickerProps={{
              minDate: new Date('01/01/1900'),
              maxDate: toWatch ?? new Date('01/01/2200')
            }}
            formItemProps={{
              name: 'fromDate'
            }}
            toFromDate={toWatch}
          />
        </div>
      )}
      {size.xs ? (
        <div style={{ marginBlockEnd: pxToRem(15) }}>
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
        </div>
      ) : (
        <div style={{ marginBlockEnd: pxToRem(25) }}>
          <VsDatePickerFormItem
            seperateLabel={'To'}
            placeholder="MM/DD/YYYY"
            width="100%"
            datePickerProps={{
              minDate: fromWatch ?? new Date('01/01/1900'),
              maxDate: new Date('01/01/2200')
            }}
            formItemProps={{
              name: 'toDate'
            }}
            toFromDate={fromWatch}
          />
        </div>
      )}
      <VsSelectFormItem
        showSearch
        optionFilterProp="children"
        formItemProps={{
          name: 'cart'
        }}
        filterOption={(input: any, option: any) => {
          return !!(
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          );
        }}
        formNamePath={['cart']}
        placeholder={'Cart'}
        options={[ALL_OPTION, ...cart]}
        externalShowLabel={true}
      />
    </div>
  );
};
