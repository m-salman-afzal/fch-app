import { Col, Form, FormInstance, Grid, Modal, Row, Typography } from 'antd';
import Image from 'next/image';
import {
  ErrorMessage,
  VsButton,
  VsTextAreaFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TPerpetualInventory } from '@/types/perpetualInventoryTypes';

import DELETEICON from '@/assets/icons/common/deleteModal.svg';
import { useCommonStyles } from '@/styles/useCommonStyles';
import { pxToRem } from '@/utils/sharedUtils';

import { usefirstLevelDeleteModalStyle } from './useperpetualInventoryDeleteModalStyle';

interface Props {
  open: boolean;
  onCloseModal: () => void;
  deleteForm: FormInstance;
  perpetualInventory: TPerpetualInventory;
  onFinish: any;
}

const { useBreakpoint } = Grid;

export const PerpetualInventoryDeleteModal: React.FC<Props> = ({
  open,
  onCloseModal,
  onFinish,
  perpetualInventory,
  deleteForm
}: Props) => {
  const size = useBreakpoint();
  const { deleteConfirmIcon, deleteConfirmIconContainer } = useCommonStyles();
  const { deleteModal } = usefirstLevelDeleteModalStyle();

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
      closable={false}
      destroyOnClose
      className={deleteModal}
    >
      <Form form={deleteForm} onFinish={onFinish}>
        <Col>
          <Row
            gutter={[0, 16]}
            style={{
              borderBlockEnd: `${pxToRem(1)} solid  #00000026`,
              paddingInline: pxToRem(20),
              paddingBlockStart: pxToRem(28),
              paddingBlockEnd: pxToRem(16)
            }}
          >
            <Col span={24} className={deleteConfirmIconContainer}>
              <Image
                className={deleteConfirmIcon}
                alt={'MSG'}
                src={DELETEICON}
              />
            </Col>
            <Col span={24}>
              <Typography.Paragraph
                style={{
                  fontWeight: 600,
                  fontSize: pxToRem(20),
                  textAlign: 'center',
                  marginBottom: 0
                }}
              >
                {`Are you sure you want to delete this controlled ID?`}
              </Typography.Paragraph>
            </Col>
            {perpetualInventory && (
              <Col span={24}>
                <Row>
                  <Col>
                    <Typography.Text
                      style={{
                        color: 'rgba(0, 0, 0, 0.65)',
                        marginBottom: 0
                      }}
                    >
                      {`${perpetualInventory.name}`}
                    </Typography.Text>
                  </Col>
                  <Col span={24}>
                    <Typography.Text
                      style={{
                        color: 'rgba(0, 0, 0, 0.88)'
                      }}
                    >
                      <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                        Controlled ID:{' '}
                      </span>{' '}
                      {`${perpetualInventory.controlledId}`}
                    </Typography.Text>
                  </Col>
                </Row>
              </Col>
            )}

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
                          Enter Comment (min 10 characters)
                        </ErrorMessage>
                      )
                    }
                  ],
                  style: {
                    marginBottom: 0
                  }
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
        </Col>
      </Form>
    </Modal>
  );
};
