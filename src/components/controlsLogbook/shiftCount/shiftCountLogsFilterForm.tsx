import { VsSelectFormItem } from 'vs-design-components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import ToFromFields from '@/components/common/toFromFieldsFilters/toFromFields';

import { ALL, ALL_OPTION } from '@/utils/constants';

interface props {
  cartOptions: any[];
}

const ShiftCountLogsFilterForm: React.FC<props> = ({ cartOptions }) => {
  return (
    <div
      style={{
        paddingInline: pxToRem(16)
      }}
    >
      <ToFromFields />

      <VsSelectFormItem
        width="100%"
        placeholder={'Cart'}
        options={[ALL_OPTION, ...cartOptions]}
        formItemProps={{
          name: 'cartId',
          initialValue: ALL
        }}
        formNamePath={['cartId']}
      />
    </div>
  );
};
export default ShiftCountLogsFilterForm;
