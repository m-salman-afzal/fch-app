import { FC, useState } from 'react';
import { Form, FormInstance, Grid } from 'antd';
import {
  DrawerFilter,
  VsDatePickerFormItem,
  VsMobileDatePickerFormItem,
  VsSelectFormItem
} from 'vs-design-components/src/Components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { useLogSearchStyle } from '@/components/logs/logsSearch/useLogsSearchStyle';

import { BRIDGE_THERAPY_PATIENT_RELEASE_FILTER } from '@/utils/constants';

const { useBreakpoint } = Grid;
interface Props {
  filterOpen: boolean;
  setFilerOpen: () => void;
  handleReset: () => void;
  onClickApply: (val: any) => void;
  filterFormRef: FormInstance;
}

export const BridgeTherapyFilters: FC<Props> = ({
  filterOpen,
  setFilerOpen,
  handleReset,
  onClickApply,
  filterFormRef
}) => {
  const [drawerWidth, setDrawerWidth] = useState(pxToRem(275));
  const size = useBreakpoint();
  const { formItemWrappingDiv } = useLogSearchStyle();
  const patientVal = Form.useWatch('status', filterFormRef);

  const toWatch = Form.useWatch(['toDate'], filterFormRef);
  const fromWatch = Form.useWatch(['fromDate'], filterFormRef);

  const handleOnChange = (e: any) => {
    filterFormRef.setFieldValue('toDate', undefined);
    filterFormRef.setFieldValue('fromDate', undefined);
    setDrawerWidth(pxToRem(275));
    if (e === 'RELEASED') {
      setDrawerWidth(pxToRem(315));
    }
  };

  return (
    <DrawerFilter
      filterOpen={filterOpen}
      setFilterOpen={setFilerOpen}
      handleReset={handleReset}
      onClickApply={onClickApply}
      formRef={filterFormRef}
      forceRender={true}
      width={drawerWidth}
    >
      <div style={{ paddingInline: pxToRem(20), paddingTop: pxToRem(6) }}>
        <div className={formItemWrappingDiv}>
          <VsSelectFormItem
            options={BRIDGE_THERAPY_PATIENT_RELEASE_FILTER}
            placeholder={'Status'}
            defaultActiveFirstOption={true}
            formItemProps={{
              noStyle: true,
              name: 'status',
              initialValue: '7'
            }}
            onChange={handleOnChange}
          />
        </div>
        <div className={formItemWrappingDiv}>
          {patientVal === 'RELEASED' &&
            (size.xs ? (
              <VsMobileDatePickerFormItem
                seperateLabel={'From'}
                placeholder="MM/DD/YYYY"
                width="100%"
                max={toWatch}
                formItemProps={{
                  name: 'fromDate',
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
                    maxDate: toWatch ?? new Date('01/01/2200')
                  }}
                  formItemProps={{
                    name: 'fromDate',
                    preserve: true
                  }}
                  toFromDate={toWatch}
                />
              </div>
            ))}
        </div>

        <div className={formItemWrappingDiv}>
          {patientVal == 'RELEASED' &&
            (size.xs ? (
              <VsMobileDatePickerFormItem
                seperateLabel={'To'}
                placeholder="MM/DD/YYYY"
                width="100%"
                min={fromWatch}
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
                    minDate: fromWatch ?? new Date('01/01/1900'),
                    maxDate: new Date('01/01/2200')
                  }}
                  formItemProps={{
                    name: 'toDate'
                  }}
                  toFromDate={fromWatch}
                />
              </div>
            ))}
        </div>
      </div>
    </DrawerFilter>
  );
};
