import { CloseOutlined } from '@ant-design/icons';
import { Form, FormInstance, Grid, Modal, Typography } from 'antd';

import { pxToRem } from '@/utils/sharedUtils';

import { PerpetualInventoryDeductionEditForm } from './perpetualInventoryDeductionEditForm';

interface Props {
  open: boolean;
  onCloseModal: () => void;
  editForm: FormInstance;
  deductionType: string;
  onFinish: any;
}

const { useBreakpoint } = Grid;

export const PerpetualInventoryDeductionEditModal: React.FC<Props> = ({
  open,
  onCloseModal,
  editForm,
  deductionType,
  onFinish
}: Props) => {
  const size = useBreakpoint();

  return (
    <Modal
      open={open}
      onCancel={onCloseModal}
      footer={null}
      style={{
        maxWidth: 'none'
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
      <Form style={{ width: '100%' }} form={editForm} onFinish={onFinish}>
        <PerpetualInventoryDeductionEditForm
          onCloseModal={onCloseModal}
          deductionType={deductionType}
          qtyOH={editForm.getFieldValue('perpetualInventoryQtyOH')}
          quantityDeducted={editForm.getFieldValue('quantityDeducted')}
        />
      </Form>
    </Modal>
  );
};
