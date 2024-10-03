import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd';
import { VsButton, VsTooltip } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { InventoryBulkUploadTypes } from '@/types/inventoryBulkUploadTypes';

import useCookies from '@/hooks/useCookies';
import { PERMISSIONS_TYPES } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { InventoryBulkUploadTypeModal } from './bulkUpload/inventoryBulkUploadTypesModal';

interface props {
  onClick?: () => void;
  form: FormInstance<any>;
  onFinishbulkUploadForm: (values: any) => void;
  selectedOption: string;
  setBulkUploadOption: (x: InventoryBulkUploadTypes) => void;
  isControlled: boolean;
}
const BulkUploadModal: React.FC<props> = ({
  onClick = () => {},
  form,
  onFinishbulkUploadForm,
  selectedOption,
  setBulkUploadOption,
  isControlled
}) => {
  const [modalOpen, setShowModal] = useState<boolean>(false);
  const admin = useCookies().getDataFromCookie();
  const onClickButton = () => {
    onClick();
    setShowModal(true);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  const finishForm = (values: any) => {
    onFinishbulkUploadForm(values);
    onCloseModal();
  };

  return (
    <>
      {admin?.rbac?.inventory === PERMISSIONS_TYPES.WRITE && (
        <VsButton
          antButtonProps={{
            type: 'primary'
          }}
          onClick={onClickButton}
          size={BUTTON_SIZES.middle}
        >
          <VsTooltip title={''} placement="bottom" arrow>
            <UploadOutlined
              style={{
                fontSize: pxToRem(14),
                paddingInlineEnd: pxToRem(8)
              }}
            />
            Upload
          </VsTooltip>
        </VsButton>
      )}
      <InventoryBulkUploadTypeModal
        isControlled={isControlled}
        handleNext={() => {}}
        open={modalOpen}
        setOpen={onCloseModal}
        selected={selectedOption}
        setSelected={setBulkUploadOption}
      />
    </>
  );
};

export default BulkUploadModal;
