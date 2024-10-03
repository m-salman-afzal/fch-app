import { PropsWithChildren } from 'react';
import { Form, FormInstance, Grid } from 'antd';
import {
  VsDatePickerFormItem,
  VsMobileDatePickerFormItem,
  VsSelectFormItem
} from 'vs-design-components';

import { FACILITY_FREE_TABS } from '@/containers/file/fileContainer';
import useCookies from '@/hooks/useCookies';
import { ALL, ALL_OPTION, FILE_STATUS_OPTIONS } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

interface props {
  form: FormInstance<any>;
  onScreen: string;
}

const { useBreakpoint } = Grid;
const fileStatusOptions = [ALL_OPTION, ...FILE_STATUS_OPTIONS];

export const FileFilterForm: React.FC<PropsWithChildren<props>> = ({
  form,
  onScreen
}) => {
  const size = useBreakpoint();
  const { getDataFromCookie } = useCookies();
  const admin = getDataFromCookie();
  const facilityOptions = [
    ALL_OPTION,
    ...admin.facility.map((fa: any) => {
      return {
        label: fa.facilityName,
        value: fa.facilityId,
        key: fa.facilityId
      };
    })
  ];

  const toWatch = Form.useWatch(['toDate'], form);
  const fromWatch = Form.useWatch(['fromDate'], form);

  return (
    <div>
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
        options={fileStatusOptions}
        defaultActiveFirstOption={true}
        placeholder="Status"
        formItemProps={{
          name: 'status',
          initialValue: ALL
        }}
        externalShowLabel={true}
      />
      {FACILITY_FREE_TABS.indexOf(onScreen) === -1 && (
        <VsSelectFormItem
          options={facilityOptions}
          placeholder="Facility"
          formItemProps={{
            noStyle: true,
            name: 'facilityId',
            initialValue: ALL
          }}
          externalShowLabel={true}
        />
      )}
    </div>
  );
};
