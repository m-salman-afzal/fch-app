import { CloseOutlined } from '@ant-design/icons';
import { Col, Form, FormInstance, Grid, Modal, Row, Typography } from 'antd';
import Image from 'next/image';
import {
  ErrorMessage,
  VsButton,
  VsTextAreaFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import DELETEICON from '@/assets/icons/common/deleteModal.svg';
import { useCommonStyles } from '@/styles/useCommonStyles';
import { pxToRem } from '@/utils/sharedUtils';

interface Props {
  open: boolean;
  onCloseModal: () => void;
  deleteForm: FormInstance;
  onFinish: any;
}

const { useBreakpoint } = Grid;

export const PerpetualInventoryDeductionDeleteModal: React.FC<Props> = ({
  open,
  onCloseModal,
  onFinish,
  deleteForm
}: Props) => {
  const size = useBreakpoint();
  const { deleteConfirmIcon, deleteConfirmIconContainer } = useCommonStyles();

  return (
    <Modal
      open={open}
      onCancel={onCloseModal}
      footer={null}
      style={{
        maxWidth: 'none'
      }}
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(325)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      destroyOnClose
    >
      <Form form={deleteForm} onFinish={onFinish}>
        <Row
          style={{
            borderBlockEnd: `${pxToRem(1)} solid  #00000026`,
            paddingBlockEnd: pxToRem(20)
          }}
        >
          <Col span={24} className={deleteConfirmIconContainer}>
            <Image className={deleteConfirmIcon} alt={'MSG'} src={DELETEICON} />
          </Col>
          <Col span={24}>
            <Typography.Paragraph
              style={{
                fontSize: pxToRem(20),
                fontWeight: 600,
                textAlign: 'center',
                marginBlock: pxToRem(16),
                marginBottom: pxToRem(16),
                paddingInline: pxToRem(20)
              }}
            >
              {`Are you sure you want to delete this action from Perpetual Inventory?`}
            </Typography.Paragraph>
          </Col>
          <Col span={24}>
            <VsTextAreaFormItem
              formItemProps={{
                name: 'comment',
                rules: [
                  {
                    required: true,
                    min: 10,
                    message: (
                      <ErrorMessage>
                        Type Details (min 10 characters)
                      </ErrorMessage>
                    )
                  }
                ],
                style: { marginBottom: 0, marginInline: pxToRem(20) }
              }}
              width="100%"
              autoSize={{ minRows: 5 }}
              placeholder="Comment"
            />
          </Col>
        </Row>

        <Row
          justify={'space-between'}
          style={{
            paddingBlockStart: pxToRem(12),
            paddingInline: pxToRem(20)
          }}
        >
          <Col>
            <VsButton
              style={{
                width: pxToRem(135.5)
              }}
              size={BUTTON_SIZES.large}
              onClick={onCloseModal}
            >
              No
            </VsButton>
          </Col>
          <Col>
            <VsButton
              style={{
                width: pxToRem(135.5),
                borderRadius: 'var(--Space-4, 4px)',
                background: 'var(--colorErrorBase, #FF4D4F)',
                boxShadow: '0px 2px 0px 0px rgba(0, 0, 0, 0.02)'
              }}
              antButtonProps={{
                type: 'primary',
                htmlType: 'submit'
                //   loading: isLoading
              }}
              size={BUTTON_SIZES.large}
            >
              Yes
            </VsButton>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
