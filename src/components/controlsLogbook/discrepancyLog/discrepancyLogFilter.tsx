import { FC, useState } from 'react';
import { Form, FormInstance, Grid, Spin } from 'antd';
import {
  DrawerFilter,
  VsDatePickerFormItem,
  VsMobileDatePickerFormItem,
  VsSelectFormItem
} from 'vs-design-components/src/Components';
import { VsSelectMobileFormItem } from 'vs-design-components/src/Components/Select';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import ToFromFields from '@/components/common/toFromFieldsFilters/toFromFields';
import { useLogSearchStyle } from '@/components/logs/logsSearch/useLogsSearchStyle';

import {
  ALL,
  ALL_OPTION,
  BRIDGE_THERAPY_PATIENT_RELEASE_FILTER
} from '@/utils/constants';

import { DISCREPANCY_LOG_TYPES_FILTERS } from './discrepancyLogConstant';

const { useBreakpoint } = Grid;

interface Props {
  filterOpen: boolean;
  setFilerOpen: () => void;
  handleReset: () => void;
  onClickApply: (val: any) => void;
  filterFormRef: FormInstance;
  cartsData: any[];
  handleCartSearch: (val: string) => void;
}

export const DiscrepancyLogFilter: FC<Props> = ({
  filterOpen,
  setFilerOpen,
  handleReset,
  onClickApply,
  filterFormRef,
  cartsData,
  handleCartSearch
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
      // width={drawerWidth}
    >
      <div style={{ paddingInline: pxToRem(20), paddingTop: pxToRem(6) }}>
        <div className={formItemWrappingDiv}>
          {size.xs ? (
            <VsSelectMobileFormItem
              placeholder="Cart"
              defaultValue={ALL}
              options={[ALL_OPTION, ...cartsData]}
              width="100%"
              formItemProps={{
                name: 'cartId'
              }}
              // filterOption={(input: any, option: any) => {
              //   return true;
              // }}
              showSearch={true}
              formNamePath={['cartId']}
              // onModalVisibleChange={onDropdownVisibleChange}
              // onScrollBottom={onScrollMobile}
              onSearch={handleCartSearch}
              searchPlaceholder={'Search Cart'}
              modalTitle="Select Cart"
              externalShowLabel={true}
            />
          ) : (
            <VsSelectFormItem
              placeholder="Cart"
              defaultValue={ALL}
              options={[ALL_OPTION, ...cartsData]}
              width="100%"
              formItemProps={{
                name: 'cartId'
              }}
              filterOption={(input: any, option: any) => {
                return !!(
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
              showSearch={true}
              formNamePath={['cartId']}
              // onDropdownVisibleChange={onDropdownVisibleChange}
              // onPopupScroll={onPopupScroll}
              onSearch={handleCartSearch}
              externalShowLabel={true}
            />
          )}
        </div>

        <div className={formItemWrappingDiv}>
          <VsSelectFormItem
            options={DISCREPANCY_LOG_TYPES_FILTERS}
            placeholder={'Type'}
            defaultActiveFirstOption={true}
            formItemProps={{
              noStyle: true,
              name: 'type',
              initialValue: ALL
            }}
            onChange={handleOnChange}
          />
        </div>

        <ToFromFields />
      </div>
    </DrawerFilter>
  );
};
