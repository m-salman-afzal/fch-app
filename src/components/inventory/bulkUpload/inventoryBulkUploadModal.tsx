import { FC } from 'react';
import { Form, FormInstance } from 'antd';

import { InventoryBulkUploadTypes } from '@/types/inventoryBulkUploadTypes';

import BulkUpload from '@/components/common/bulkUpload/bulkUpload';

import {
  CONTROLLED_INVENTORY_RECEIVE_EDIT_DELETE_SAMPLE_FILE,
  CONTROLLED_INVENTORY_RECEIVE_SAMPLE_FILE
} from '@/utils/sampleFiles/inventory/inventoryControlled';
import {
  NON_CONTROLLED_INVENTORY_RECEIVE_EDIT_DELETE_SAMPLE_FILE,
  NON_CONTROLLED_INVENTORY_RECEIVE_SAMPLE_FILE
} from '@/utils/sampleFiles/inventory/inventoryNonControlled';

interface props {
  onSubmit: (value: any) => void;
  onClose: () => void;
  bulkUploadOption: InventoryBulkUploadTypes;
  uploadForm: FormInstance<any>;
  isLoading: boolean;
}

export const InventoryBulkUpload: FC<props> = ({
  onClose,
  onSubmit,
  uploadForm,
  bulkUploadOption,
  isLoading
}) => {
  const isControlled = bulkUploadOption.isControlled;
  const isAddAction = bulkUploadOption.action === 'add';

  const getSampleFile = () => {
    if (isControlled) {
      return isAddAction
        ? CONTROLLED_INVENTORY_RECEIVE_SAMPLE_FILE
        : CONTROLLED_INVENTORY_RECEIVE_EDIT_DELETE_SAMPLE_FILE;
    }

    return isAddAction
      ? NON_CONTROLLED_INVENTORY_RECEIVE_SAMPLE_FILE
      : NON_CONTROLLED_INVENTORY_RECEIVE_EDIT_DELETE_SAMPLE_FILE;
  };

  const fileName = `Sample FCH ${!isControlled ? 'Non ' : ''}Controlled Inventory ${isAddAction ? 'Initial Receipt or Replenishment' : 'Edit or Delete'} Upload File`;

  return (
    <BulkUpload
      onCloseModal={onClose}
      onFinishForm={onSubmit}
      sampleData={getSampleFile()}
      open={true}
      form={uploadForm}
      isLoading={isLoading}
      fileName={fileName}
    />
  );
};
