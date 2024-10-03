import { useEffect, useState } from 'react';
import { Form, Grid } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import {
  VsDatePickerFormItem,
  VsMobileDatePickerFormItem
} from 'vs-design-components';

import { pxToRem } from '@/utils/sharedUtils';

interface props {
  customFromToFormNames?: {
    fromDate: string;
    toDate: string;
  };
  customFromToPlaceHolders?: {
    fromDate: string;
    toDate: string;
  };
}

const { useBreakpoint } = Grid;

const ToFromFields: React.FC<props> = ({
  customFromToFormNames = {
    fromDate: 'fromDate',
    toDate: 'toDate'
  },
  customFromToPlaceHolders = { fromDate: 'From', toDate: 'To' }
}) => {
  const [date, setDate] = useState({
    from: '',
    to: ''
  });

  const size = useBreakpoint();

  const form = useFormInstance();

  const toWatch = Form.useWatch(['toDate'], form);
  const fromWatch = Form.useWatch(['fromDate'], form);

  return (
    <>
      {size.xs ? (
        <div style={{ marginBlockEnd: pxToRem(15) }}>
          <VsMobileDatePickerFormItem
            seperateLabel={customFromToPlaceHolders.fromDate}
            placeholder="MM/DD/YYYY"
            width="100%"
            formNamePath={[customFromToFormNames.fromDate]}
            max={toWatch ?? new Date('1/1/2100')}
            min={new Date('1/1/1900')}
            formItemProps={{
              name: customFromToFormNames.fromDate,
              noStyle: true
            }}
            onChange={d => {
              setDate({
                ...date,
                from: d
              });
            }}
          />
        </div>
      ) : (
        <div style={{ marginBlockEnd: pxToRem(20) }}>
          <VsDatePickerFormItem
            seperateLabel={customFromToPlaceHolders.fromDate}
            placeholder="MM/DD/YYYY"
            width="100%"
            date={date.from}
            datePickerProps={{
              minDate: new Date('01/01/1900'),
              maxDate: toWatch ?? new Date('01/01/2200')
            }}
            formNamePath={[customFromToFormNames.fromDate]}
            formItemProps={{
              name: customFromToFormNames.fromDate
            }}
            onChange={d => {
              setDate({
                ...date,
                from: d
              });
            }}
            toFromDate={toWatch}
          />
        </div>
      )}

      {size.xs ? (
        <div style={{ marginBlockEnd: pxToRem(15) }}>
          <VsMobileDatePickerFormItem
            seperateLabel={customFromToPlaceHolders.toDate}
            placeholder="MM/DD/YYYY"
            width="100%"
            formNamePath={[customFromToFormNames.toDate]}
            max={new Date('1/1/2100')}
            min={fromWatch ?? new Date('1/1/1900')}
            formItemProps={{
              name: customFromToFormNames.toDate,
              noStyle: true
            }}
            onChange={d => {
              setDate({
                ...date,
                to: d
              });
            }}
          />
        </div>
      ) : (
        <div style={{ marginBlockEnd: pxToRem(25) }}>
          <VsDatePickerFormItem
            seperateLabel={customFromToPlaceHolders.toDate}
            placeholder="MM/DD/YYYY"
            width="100%"
            date={date.to}
            datePickerProps={{
              minDate: fromWatch ?? new Date('01/01/1900'),
              maxDate: new Date('01/01/2200')
            }}
            formNamePath={[customFromToFormNames.toDate]}
            formItemProps={{
              name: customFromToFormNames.toDate
            }}
            toFromDate={fromWatch}
            onChange={d => {
              setDate({
                ...date,
                to: d
              });
            }}
          />
        </div>
      )}
    </>
  );
};

export default ToFromFields;
