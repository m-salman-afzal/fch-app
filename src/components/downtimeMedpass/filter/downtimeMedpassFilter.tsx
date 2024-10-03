import { Form, Grid } from 'antd';
import {
  VsDatePickerFormItem,
  VsMobileDatePickerFormItem
} from 'vs-design-components';

import { pxToRem } from '@/utils/sharedUtils';

import { useDowntimeMedpassStyle } from '../styles/useDowntimeMedpassStyle';

const { useBreakpoint } = Grid;

export const DowntimeMedpassFilter = ({ form }: any) => {
  const size = useBreakpoint();
  const endDate = new Date();
  const startDate = new Date(endDate);

  startDate.setDate(endDate.getDate() - 89);

  const { datePicker } = useDowntimeMedpassStyle();

  const toWatch = Form.useWatch(['dateTo'], form);
  const fromWatch = Form.useWatch(['dateFrom'], form);

  return (
    <>
      {size.xs ? (
        <div style={{ marginBlockEnd: pxToRem(15) }}>
          <VsMobileDatePickerFormItem
            min={startDate}
            max={toWatch ? toWatch : endDate}
            seperateLabel={'From'}
            placeholder="MM/DD/YYYY"
            width="100%"
            formNamePath={['dateFrom']}
            formItemProps={{
              name: 'dateFrom',
              noStyle: true
            }}
          />
        </div>
      ) : (
        <div style={{ marginBlockEnd: pxToRem(15) }} className={datePicker}>
          <VsDatePickerFormItem
            seperateLabel={'From'}
            placeholder="MM/DD/YYYY"
            width="100%"
            datePickerProps={{
              maxDate: toWatch ? toWatch : endDate,
              minDate: startDate
            }}
            formNamePath={['dateFrom']}
            formItemProps={{
              name: 'dateFrom'
            }}
            toFromDate={toWatch}
          />
        </div>
      )}

      {size.xs ? (
        <div style={{ marginBlockEnd: pxToRem(15) }}>
          <VsMobileDatePickerFormItem
            seperateLabel={'To'}
            min={fromWatch ? fromWatch : startDate}
            placeholder="MM/DD/YYYY"
            width="100%"
            formNamePath={['dateTo']}
            formItemProps={{
              name: 'dateTo',
              noStyle: true
            }}
          />
        </div>
      ) : (
        <div style={{ marginBlockEnd: pxToRem(20) }} className={datePicker}>
          <VsDatePickerFormItem
            seperateLabel={'To'}
            placeholder="MM/DD/YYYY"
            width="100%"
            datePickerProps={{
              maxDate: endDate,
              minDate: fromWatch ? fromWatch : startDate
            }}
            formNamePath={['dateTo']}
            formItemProps={{
              name: 'dateTo'
            }}
            toFromDate={fromWatch}
          />
        </div>
      )}
    </>
  );
};
