import { useEffect } from 'react';
import { Form, Grid } from 'antd';
import { VsSelectFormItem } from 'vs-design-components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import {
  ALL,
  ALL_OPTION,
  ANONYMOUS_TYPE_OPTIONS,
  NDC_STATUS
} from '@/utils/constants';

const { useBreakpoint } = Grid;

interface props {
  showControlled: boolean;
}
const FILTER_STATUS_OPTIONS = [
  ALL_OPTION,
  {
    label: 'Active',
    value: 'active',
    key: 'active'
  },
  {
    label: 'Inactive',
    value: 'inactive',
    key: 'inactive'
  },
  {
    label: 'None',
    value: 'none',
    key: 'none'
  }
];
const FILTER_DEPLETED_OPTIONS = [
  ALL_OPTION,
  {
    label: 'Yes',
    value: 'yes',
    key: 'yes'
  },
  {
    label: 'No',
    value: 'no',
    key: 'no'
  }
];
const FILTER_CONTROLLED_OPTIONS = [
  ALL_OPTION,
  {
    label: 'Yes',
    value: 'controlled',
    key: 'controlled'
  },
  {
    label: 'No',
    value: 'uncontrolled',
    key: 'uncontrolled'
  }
];

const FILTER_PENDING_OPTIONS = [
  ALL_OPTION,
  {
    label: 'Pending',
    value: 'pending',
    key: 'pending'
  },
  {
    label: 'Non-Pending',
    value: 'nonPending',
    key: 'nonPending'
  }
];

const contolledFormularyOptions = [ALL_OPTION, ...ANONYMOUS_TYPE_OPTIONS];

const FiltersForm: React.FC<props> = ({ showControlled }) => {
  const form = Form.useFormInstance();
  const size = useBreakpoint();
  const watchStatus = Form.useWatch('status', form);

  useEffect(() => {
    form.setFieldsValue({
      controlled: ALL,
      depleted: 'no',
      pending: ALL,
      status: 'active',
      isFormulary: 'true',
      isStock: 'true'
    });
  }, []);

  return (
    <div
      style={{
        paddingInline: pxToRem(17)
      }}
    >
      <VsSelectFormItem
        formItemProps={{
          name: 'status'
        }}
        formNamePath={['status']}
        placeholder={'NDC Status'}
        options={FILTER_STATUS_OPTIONS}
        externalShowLabel={true}
      />
      <VsSelectFormItem
        disabled={watchStatus === NDC_STATUS.NONE}
        formItemProps={{
          name: 'pending'
        }}
        formNamePath={['pending']}
        placeholder={'Pending Receipts'}
        options={FILTER_PENDING_OPTIONS}
        externalShowLabel={true}
      />
      {showControlled && (
        <VsSelectFormItem
          formItemProps={{
            name: 'controlled'
          }}
          formNamePath={['controlled']}
          placeholder={'Controlled'}
          options={contolledFormularyOptions}
          externalShowLabel={true}
        />
      )}

      <VsSelectFormItem
        formItemProps={{
          name: 'isStock'
        }}
        formNamePath={['isStock']}
        placeholder={'Central Supply'}
        options={contolledFormularyOptions}
        externalShowLabel={true}
      />

      <VsSelectFormItem
        disabled={watchStatus === NDC_STATUS.NONE}
        formItemProps={{
          name: 'depleted'
        }}
        formNamePath={['depleted']}
        placeholder={'Depleted'}
        options={FILTER_DEPLETED_OPTIONS}
        externalShowLabel={true}
      />

      <VsSelectFormItem
        options={contolledFormularyOptions}
        formNamePath={['isFormulary']}
        placeholder={'Formulary'}
        formItemProps={{
          noStyle: true,
          name: 'isFormulary'
        }}
        externalShowLabel={true}
      />
    </div>
  );
};

export default FiltersForm;
