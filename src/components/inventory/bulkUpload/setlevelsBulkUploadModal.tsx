import { FC } from 'react';
import { Form, FormInstance } from 'antd';

import { InventoryBulkUploadTypes } from '@/types/inventoryBulkUploadTypes';

import BulkUpload from '@/components/common/bulkUpload/bulkUpload';

import { SET_LEVEL_SAMPLE_FILE } from '@/utils/sampleFiles/inventory/setLevel';

interface props {
  onSubmit: (value: any) => void;
  onClose: () => void;
  bulkUploadOption: InventoryBulkUploadTypes;
  uploadForm: FormInstance<any>;
  isLoading: boolean;
}

export const SetLevelsBulkUpload: FC<props> = ({
  onClose,
  onSubmit,
  uploadForm,
  isLoading
}) => {
  return (
    <BulkUpload
      onCloseModal={onClose}
      onFinishForm={onSubmit}
      sampleData={SET_LEVEL_SAMPLE_FILE}
      open={true}
      form={uploadForm}
      isLoading={isLoading}
      fileName={'Sample FCH Set Levels Upload File'}
    />
  );
};
