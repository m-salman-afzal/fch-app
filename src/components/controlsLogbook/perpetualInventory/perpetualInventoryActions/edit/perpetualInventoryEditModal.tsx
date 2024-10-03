import { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Divider, Form, FormInstance, Grid, Modal, Typography } from 'antd';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TPerpetualInventory } from '@/types/perpetualInventoryTypes';

import { WebSignatureForm } from './webperpetualInventoryEditForm';

interface Props {
  open: boolean;
  onCloseModal: () => void;
  formRef: FormInstance;
  isLoading: boolean;
  handlePerpetualInventoryEditSubmit: (data: any) => Promise<void>;
  perpetualInventory: TPerpetualInventory;
}

const { useBreakpoint } = Grid;

export const PerpetualInventoryEditModal: React.FC<Props> = ({
  open,
  onCloseModal,
  formRef,
  isLoading,
  handlePerpetualInventoryEditSubmit,
  perpetualInventory
}) => {
  const size = useBreakpoint();

  useEffect(() => {
    if (open) {
      formRef.setFieldsValue({
        controlledId: perpetualInventory.controlledId,
        trx: perpetualInventory.tr || perpetualInventory.rx,
        patientName: perpetualInventory.patientName,
        providerName: perpetualInventory.providerName,
        qtyOH: `${perpetualInventory.quantityAllocated}`
      });
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onCancel={onCloseModal}
      footer={null}
      style={{
        maxWidth: 'none',
        padding: 0
      }}
      title={
        <Typography.Title
          style={{
            paddingInlineStart: pxToRem(20),
            marginBlock: 0,
            fontSize: pxToRem(20)
          }}
        >
          Edit
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(402)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      destroyOnClose
    >
      <Form
        style={{ width: '100%' }}
        form={formRef}
        onFinish={handlePerpetualInventoryEditSubmit}
      >
        <WebSignatureForm
          isLoading={isLoading}
          onCloseModal={onCloseModal}
          perpetualInventory={perpetualInventory}
        />
      </Form>
    </Modal>
  );
};
