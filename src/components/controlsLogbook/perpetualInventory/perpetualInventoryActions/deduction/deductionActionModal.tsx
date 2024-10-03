import { useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Form, FormInstance, Grid, Modal, Typography } from 'antd';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TPerpetualInventory } from '@/types/perpetualInventoryTypes';

import { PERPETUAL_INVENTORY_DEDUCTION_TYPES } from '@/containers/controlsLogbook/constants';

import { WebAdministerForm } from './deductionForm';
import { useAdministerModalStyle } from './useDeductionModalStyle';

interface Props {
  open: boolean;
  onCloseModal: () => void;
  carts: any;
  deductionForm: FormInstance;
  isLoading: boolean;
  perpetualInventory: TPerpetualInventory;
  handleDeductionSubmit: (data: any) => Promise<void>;
  size: any;
}

export const DeductionModal: React.FC<Props> = ({
  open,
  onCloseModal,
  deductionForm,
  carts,
  isLoading,
  perpetualInventory,
  handleDeductionSubmit,
  size
}) => {
  const { closeIcon } = useAdministerModalStyle();

  const getModalTitle = () => {
    if (perpetualInventory) {
      const { deductionType } = perpetualInventory;

      switch (deductionType) {
        case PERPETUAL_INVENTORY_DEDUCTION_TYPES.DOSE_ADMINISTERED:
          return 'Administer';
        case PERPETUAL_INVENTORY_DEDUCTION_TYPES.WASTED:
          return 'Waste';
        case PERPETUAL_INVENTORY_DEDUCTION_TYPES.DESTROYED:
          return 'Destroy';
        case PERPETUAL_INVENTORY_DEDUCTION_TYPES.TRANSFERRED:
          return 'Transfer';
        case PERPETUAL_INVENTORY_DEDUCTION_TYPES.RETURNED_TO_PATIENT:
          return 'Return to Patient';
        case PERPETUAL_INVENTORY_DEDUCTION_TYPES.RETURNED_TO_PROPERTY:
          return 'Return to Property';

        default:
          return '';
      }
    }
  };

  useEffect(() => {
    if (perpetualInventory?.isPatientSpecific) {
      deductionForm.setFieldValue(
        'patientName',
        perpetualInventory.patientName
      );
      deductionForm.setFieldValue(
        'providerName',
        perpetualInventory.providerName
      );
    }
  }, [perpetualInventory]);

  return (
    <Modal
      open={open}
      onCancel={onCloseModal}
      footer={null}
      style={{
        maxWidth: 'none'
      }}
      className={closeIcon}
      title={
        <Typography.Title
          style={{
            fontSize: pxToRem(20),
            lineHeight: pxToRem(28),
            marginBlock: 0,
            paddingInlineStart: pxToRem(20)
          }}
        >
          {getModalTitle()}
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(725)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(24) }} />}
      destroyOnClose={true}
      styles={{
        content: { paddingBlock: pxToRem(19.5) },
        header: { marginBottom: 0, paddingBlockEnd: pxToRem(19.5) }
      }}
    >
      <Form
        style={{ width: '100%' }}
        form={deductionForm}
        onFinish={val => {
          handleDeductionSubmit({
            ...val,
            deductionType: perpetualInventory.deductionType
          });
        }}
      >
        <WebAdministerForm
          isLoading={isLoading}
          onCloseModal={onCloseModal}
          perpetualInventory={perpetualInventory}
          carts={carts}
          size={size}
        />
      </Form>
    </Modal>
  );
};
