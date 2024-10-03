import { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Divider, Form, FormInstance, Grid, Modal, Typography } from 'antd';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import {
  TPerpetualInventory,
  TSignature
} from '@/types/perpetualInventoryTypes';

import { WebSignatureForm } from './webSignatureForm';

interface Props {
  open: boolean;
  onCloseModal: () => void;
  signatureForm: FormInstance;
  isLoading: boolean;
  signature: TSignature;
  handleAdministerSubmit: (data: any) => Promise<void>;
}

const { useBreakpoint } = Grid;

export const SignatureActionModal: React.FC<Props> = ({
  open,
  onCloseModal,
  signatureForm,
  isLoading,
  handleAdministerSubmit,
  signature
}) => {
  const size = useBreakpoint();

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
          Signatures
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
        form={signatureForm}
        onFinish={handleAdministerSubmit}
      >
        <WebSignatureForm
          isLoading={isLoading}
          onCloseModal={onCloseModal}
          signature={signature}
        />
      </Form>
    </Modal>
  );
};
