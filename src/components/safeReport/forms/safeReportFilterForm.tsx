import { PropsWithChildren, useEffect, useState } from 'react';
import { Form, FormInstance, Grid } from 'antd';
import {
  VsDatePickerFormItem,
  VsMobileDatePickerFormItem,
  VsSelectFormItem
} from 'vs-design-components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { SelectOption } from '@/types/commonTypes';

import useCookies from '@/hooks/useCookies';
import {
  ALL,
  ALL_OPTION,
  PERMISSIONS_TYPES,
  SAFE_REPORT_TYPE_OPTIONS
} from '@/utils/constants';

interface props {
  form: FormInstance<any>;
  onScreen: string;
}

const safeReportTypeOptions = [ALL_OPTION, ...SAFE_REPORT_TYPE_OPTIONS];

const { useBreakpoint } = Grid;

export const SafeReportFilterForm: React.FC<PropsWithChildren<props>> = ({
  form,
  onScreen
}) => {
  const size = useBreakpoint();
  const { getDataFromCookie } = useCookies();
  const { rbac } = getDataFromCookie();
  const [statusOptions, setStatusOptions] = useState<any[]>();

  useEffect(() => {
    form.setFieldsValue({
      reportType: ALL,
      status: ALL,
      toDate: undefined,
      fromDate: undefined
    });
    if (
      rbac.reportHistory !== PERMISSIONS_TYPES.HIDE &&
      onScreen === 'reportHistory'
    ) {
      setStatusOptions([
        ALL_OPTION,
        { label: 'Pending', key: 'Pending', value: 'PENDING' },
        {
          label: 'Under Investigation',
          key: 'Under Investigation',
          value: 'UNDER_INVESTIGATION'
        },
        { label: 'In Review', key: 'In review', value: 'IN_REVIEW' },
        { label: 'Closed', key: 'Closed', value: 'CLOSED' }
      ]);

      return;
    }

    const tempOptions: SelectOption[] = [ALL_OPTION];

    if (rbac.safeReportInvestigations !== PERMISSIONS_TYPES.HIDE) {
      tempOptions.push({
        label: 'Under Investigation',
        key: 'Under Investigation',
        value: 'UNDER_INVESTIGATION'
      });
    }

    if (rbac.safeReportReviews !== PERMISSIONS_TYPES.HIDE) {
      tempOptions.push({
        label: 'In review',
        key: 'In review',
        value: 'IN_REVIEW'
      });
    }

    setStatusOptions(tempOptions);
  }, [onScreen]);

  const toWatch = Form.useWatch(['toDate'], form);
  const fromWatch = Form.useWatch(['fromDate'], form);

  return (
    <>
      {size.xs ? (
        <div style={{ marginBlockEnd: pxToRem(15) }}>
          <VsMobileDatePickerFormItem
            seperateLabel={'From'}
            placeholder="MM/DD/YYYY"
            width="100%"
            formNamePath={['fromDate']}
            max={fromWatch}
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
            formNamePath={['fromDate']}
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
            formNamePath={['toDate']}
            min={fromWatch}
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
            formNamePath={['toDate']}
            formItemProps={{
              name: 'toDate'
            }}
            toFromDate={fromWatch}
          />
        </div>
      )}

      {onScreen === 'reportHistory' && (
        <VsSelectFormItem
          options={safeReportTypeOptions}
          defaultActiveFirstOption={true}
          placeholder="Report Type"
          formNamePath={['reportType']}
          formItemProps={{
            name: 'reportType'
          }}
        />
      )}

      <VsSelectFormItem
        options={statusOptions}
        showSearch={true}
        placeholder="Status"
        formNamePath={['status']}
        formItemProps={{
          name: 'status'
        }}
      />
    </>
  );
};
