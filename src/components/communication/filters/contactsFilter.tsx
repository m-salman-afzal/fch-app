import { FC } from 'react';
import { FormInstance, Grid } from 'antd';
import {
  DrawerFilter,
  VsSelectFormItem
} from 'vs-design-components/src/Components';
import { VsSelectMobileFormItem } from 'vs-design-components/src/Components/Select';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { useLogSearchStyle } from '@/components/logs/logsSearch/useLogsSearchStyle';

import { ALL } from '@/utils/constants';

const { useBreakpoint } = Grid;

interface Props {
  filterOpen: boolean;
  setFilerOpen: () => void;
  handleReset: () => void;
  onClickApply: (val: any) => void;
  filterFormRef: FormInstance;
  facilities: any[];
  reports: any[];
}

export const CommunicationFilter: FC<Props> = ({
  filterOpen,
  setFilerOpen,
  handleReset,
  onClickApply,
  filterFormRef,
  facilities,
  reports
}) => {
  const { formItemWrappingDiv } = useLogSearchStyle();
  const size = useBreakpoint();

  return (
    <DrawerFilter
      filterOpen={filterOpen}
      setFilterOpen={setFilerOpen}
      handleReset={handleReset}
      onClickApply={onClickApply}
      formRef={filterFormRef}
      forceRender={true}
    >
      <div
        style={{
          paddingInline: pxToRem(16)
        }}
      >
        <div className={formItemWrappingDiv}>
          {size.xs ? (
            <VsSelectMobileFormItem
              defaultActiveFirstOption={true}
              modalTitle="Select Facility"
              searchPlaceholder={'Search Facility'}
              options={facilities}
              placeholder="Facility"
              formItemProps={{
                noStyle: true,
                name: 'facilityId',
                initialValue: ALL
              }}
            />
          ) : (
            <VsSelectFormItem
              defaultActiveFirstOption={true}
              options={facilities}
              placeholder="Facility"
              formItemProps={{
                noStyle: true,
                name: 'facilityId',
                initialValue: ALL
              }}
              showSearch={true}
              filterOption={(input: any, option: any) => {
                return !!(
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
              onSearch={() => {}}
            />
          )}
        </div>

        <div className={formItemWrappingDiv}>
          {size.xs ? (
            <VsSelectMobileFormItem
              defaultActiveFirstOption={true}
              modalTitle="Select Report"
              searchPlaceholder={'Search Report'}
              options={reports}
              placeholder="Report"
              formItemProps={{
                noStyle: true,
                name: 'processId',
                initialValue: ALL
              }}
            />
          ) : (
            <VsSelectFormItem
              defaultActiveFirstOption={true}
              options={reports}
              placeholder="Report"
              formItemProps={{
                noStyle: true,
                name: 'processId',
                initialValue: ALL
              }}
              showSearch={true}
              onSearch={() => {}}
              filterOption={(input: any, option: any) => {
                return !!(
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
            />
          )}
        </div>
      </div>
    </DrawerFilter>
  );
};
