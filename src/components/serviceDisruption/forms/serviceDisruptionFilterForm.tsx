import { PropsWithChildren } from 'react';
import { Grid } from 'antd';
import {
  VsDatePickerFormItem,
  VsMobileDatePickerFormItem,
  VsSelectFormItem
} from 'vs-design-components';
import { VsSelectMobileFormItem } from 'vs-design-components/src/Components/Select';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import {
  ALL,
  ALL_OPTION,
  DISRIPTION_SERVICE_REASONS,
  HVAS_COUNTY_SERVICES
} from '@/utils/constants';

interface props {}

const hvaCountyServiceTypeOptions = [ALL_OPTION, ...HVAS_COUNTY_SERVICES];

const disruptionServiceTypeOptions = [
  ALL_OPTION,
  ...DISRIPTION_SERVICE_REASONS
];

const { useBreakpoint } = Grid;

export const ServiceDisruptionFilterForm: React.FC<
  PropsWithChildren<props>
> = ({}) => {
  const size = useBreakpoint();

  return (
    <>
      {size.xs ? (
        <div style={{ marginBlockEnd: pxToRem(15) }}>
          <VsMobileDatePickerFormItem
            seperateLabel={'Date'}
            placeholder="MM/DD/YYYY"
            width="100%"
            formItemProps={{
              name: 'date',
              noStyle: true
            }}
          />
        </div>
      ) : (
        <div style={{ marginBlockEnd: pxToRem(20) }}>
          <VsDatePickerFormItem
            seperateLabel={'Date'}
            placeholder="MM/DD/YYYY"
            width="100%"
            datePickerProps={{
              minDate: new Date('01/01/1900'),
              maxDate: new Date('01/01/2200')
            }}
            formItemProps={{
              name: 'date'
            }}
          />
        </div>
      )}

      {size.xs ? (
        <VsSelectMobileFormItem
          modalTitle="Select Service"
          searchPlaceholder={'Search Service'}
          placeholder="Service"
          options={hvaCountyServiceTypeOptions}
          formItemProps={{
            name: 'service',
            initialValue: ALL
          }}
          externalShowLabel={true}
        />
      ) : (
        <VsSelectFormItem
          options={hvaCountyServiceTypeOptions}
          placeholder="Service"
          formItemProps={{
            name: 'service',
            initialValue: ALL
          }}
          showSearch={true}
          externalShowLabel={true}
        />
      )}

      {size.xs ? (
        <VsSelectMobileFormItem
          searchPlaceholder={'Search Reason'}
          modalTitle="Select Reason"
          options={disruptionServiceTypeOptions}
          defaultActiveFirstOption={true}
          placeholder="Reason"
          formItemProps={{
            name: 'reason',
            initialValue: ALL
          }}
          externalShowLabel={true}
        />
      ) : (
        <VsSelectFormItem
          options={disruptionServiceTypeOptions}
          defaultActiveFirstOption={true}
          placeholder="Reason"
          formItemProps={{
            name: 'reason',
            initialValue: ALL
          }}
          externalShowLabel={true}
          showSearch={true}
        />
      )}
    </>
  );
};
