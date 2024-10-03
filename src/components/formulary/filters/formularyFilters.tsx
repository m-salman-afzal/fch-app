import { FC } from 'react';
import { FormInstance, Grid } from 'antd';
import {
  DrawerFilter,
  VsSelectFormItem
} from 'vs-design-components/src/Components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TRestockLogFilters } from '@/types/cartFulfillmentTypes';

import { useLogSearchStyle } from '@/components/logs/logsSearch/useLogsSearchStyle';

import {
  ALL,
  ALL_OPTION,
  ANONYMOUS_TYPE_OPTIONS,
  STATUS_ACTIVE_INACTIVE
} from '@/utils/constants';

interface Props {
  filterOpen: boolean;
  setFilerOpen: () => void;
  handleReset: () => void;
  onClickApply: (val: any) => void;
  filterFormRef: FormInstance<TRestockLogFilters>;
  showDrugTypeOption: boolean;
}

export const FormularyFilter: FC<Props> = ({
  filterOpen,
  setFilerOpen,
  handleReset,
  onClickApply,
  filterFormRef,
  showDrugTypeOption
}) => {
  const { formItemWrappingDiv } = useLogSearchStyle();
  const statusOptions = [ALL_OPTION, ...STATUS_ACTIVE_INACTIVE];
  const contolledFormularyOptions = [ALL_OPTION, ...ANONYMOUS_TYPE_OPTIONS];

  return (
    <DrawerFilter
      filterOpen={filterOpen}
      setFilterOpen={setFilerOpen}
      handleReset={handleReset}
      onClickApply={onClickApply}
      formRef={filterFormRef}
      forceRender={true}
    >
      <div style={{ paddingInline: pxToRem(16), paddingTop: pxToRem(6) }}>
        <div
          style={{ marginBlockEnd: pxToRem(20) }}
          className={formItemWrappingDiv}
        >
          <VsSelectFormItem
            options={statusOptions}
            placeholder={'Status'}
            formItemProps={{
              noStyle: true,
              name: 'isActive',
              initialValue: ALL
            }}
            externalShowLabel={true}
          />
        </div>
        {showDrugTypeOption && (
          <div
            style={{ marginBlockEnd: pxToRem(20) }}
            className={formItemWrappingDiv}
          >
            <VsSelectFormItem
              options={contolledFormularyOptions}
              placeholder={'Controlled'}
              formItemProps={{
                noStyle: true,
                name: 'isControlled',
                initialValue: ALL
              }}
              externalShowLabel={true}
            />
          </div>
        )}

        <div
          style={{ marginBlockEnd: pxToRem(20) }}
          className={formItemWrappingDiv}
        >
          <VsSelectFormItem
            options={contolledFormularyOptions}
            placeholder={'Formulary'}
            formItemProps={{
              noStyle: true,
              name: 'isFormulary',
              initialValue: 'true'
            }}
            externalShowLabel={true}
          />
        </div>
      </div>
    </DrawerFilter>
  );
};
