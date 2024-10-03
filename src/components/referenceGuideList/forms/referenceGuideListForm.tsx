import { PropsWithChildren, useEffect } from 'react';
import { FormInstance } from 'antd';
import { VsSelectFormItem } from 'vs-design-components';

import { ALL, ALL_OPTION } from '@/utils/constants';

interface props {
  onChangeCategory: (value: any) => void;
  referenceGuideCategoryOptions: any[];
  referenceGuideSubCategoryOptions: any[];
  form: FormInstance<any>;
}

export const ReferenceGuideListForm: React.FC<PropsWithChildren<props>> = ({
  onChangeCategory,
  referenceGuideCategoryOptions,
  referenceGuideSubCategoryOptions,
  form
}) => {
  useEffect(() => {
    form.setFieldsValue({
      category: ALL,
      subCategory: ALL
    });
  }, []);

  return (
    <div>
      <VsSelectFormItem
        onChange={onChangeCategory}
        options={[ALL_OPTION, ...referenceGuideCategoryOptions]}
        defaultActiveFirstOption={false}
        placeholder="Category"
        formItemProps={{
          name: 'category'
        }}
        externalShowLabel={true}
      />
      <VsSelectFormItem
        options={[ALL_OPTION, ...referenceGuideSubCategoryOptions]}
        defaultActiveFirstOption={false}
        placeholder="Subcategory"
        formItemProps={{
          name: 'subCategory'
        }}
        externalShowLabel={true}
      />
    </div>
  );
};
