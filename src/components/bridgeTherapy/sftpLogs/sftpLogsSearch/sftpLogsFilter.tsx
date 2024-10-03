import { FC } from 'react';
import { FormInstance, Grid } from 'antd';
import {
  DrawerFilter,
  VsDatePickerFormItem,
  VsMobileDatePickerFormItem,
  VsSelectFormItem
} from 'vs-design-components';
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
  allAdmins: any[];
}

export const SftpLogsFilters: FC<Props> = ({
  filterOpen,
  setFilerOpen,
  handleReset,
  onClickApply,
  filterFormRef,
  allAdmins
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
      width={pxToRem(315)}
    >
      <div style={{ paddingInline: pxToRem(16), paddingTop: pxToRem(5) }}>
        <div className={formItemWrappingDiv}>
          {size.xs ? (
            <VsMobileDatePickerFormItem
              seperateLabel={'Date'}
              placeholder="MM/DD/YYYY"
              width="100%"
              formItemProps={{
                name: 'bridgeTherapyLogCreatedAt',
                noStyle: true
              }}
            />
          ) : (
            <div style={{ marginBlockEnd: pxToRem(20) }}>
              <VsDatePickerFormItem
                seperateLabel={'Date'}
                placeholder="MM/DD/YYYY"
                width="100%"
                formItemProps={{
                  name: 'bridgeTherapyLogCreatedAt'
                }}
              />
            </div>
          )}
        </div>

        <div className={formItemWrappingDiv}>
          <VsSelectFormItem
            options={allAdmins}
            placeholder="Uploaded By"
            formItemProps={{
              noStyle: true,
              name: 'adminName',
              initialValue: ALL
            }}
            showSearch={true}
            externalShowLabel={true}
          />
        </div>
      </div>
    </DrawerFilter>
  );
};
