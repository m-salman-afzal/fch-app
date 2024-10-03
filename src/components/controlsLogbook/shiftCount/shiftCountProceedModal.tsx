import { CloseOutlined } from '@ant-design/icons';
import {
  Alert,
  Col,
  Form,
  FormInstance,
  Grid,
  Modal,
  Row,
  Typography
} from 'antd';
import {
  ErrorMessage,
  VsButton,
  VsTextAreaFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import type { TShiftCountSubmitForm } from '@/types/shiftCountTypes';

import SignatureCollapsible from '@/components/common/signCollapsible/signCollapsible';

import { pxToRem } from '@/utils/sharedUtils';

export type ProcessModalProps = {
  open: boolean;
  onCloseModal: () => void;
  shiftCountSubmitForm: FormInstance<TShiftCountSubmitForm>;
  onClickSubmit: (values: TShiftCountSubmitForm) => void;
  isLoading: boolean;
  showDiscrepancyError: boolean;
};

const { useBreakpoint } = Grid;

const ShiftCountProcessModal: React.FC<ProcessModalProps> = ({
  open,
  onCloseModal,
  shiftCountSubmitForm,
  onClickSubmit,
  isLoading,
  showDiscrepancyError
}) => {
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
            fontSize: pxToRem(20),
            lineHeight: 0.9
          }}
        >
          Submit
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(724)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(20) }} />}
      destroyOnClose
    >
      <Form
        style={{
          width: '100%'
        }}
        form={shiftCountSubmitForm}
        onFinish={onClickSubmit}
      >
        <div
          style={{
            overflowY: 'scroll',
            height: size.xs ? '70dvh' : undefined,
            paddingInline: pxToRem(20),
            paddingBlock: pxToRem(20),
            borderBlock: `${pxToRem(1)} solid  #00000026`,
            marginBlockStart: pxToRem(16)
          }}
        >
          {showDiscrepancyError && (
            <Alert
              style={{
                padding: pxToRem(12),
                border: 'none',
                borderRadius: pxToRem(6),
                marginBlockEnd: pxToRem(20)
              }}
              description="There is a discrepancy with the controls counted, please submit and
        notify site leadership"
              type="error"
              showIcon
            />
          )}
          <Row
            style={{
              rowGap: pxToRem(16),
              paddingBlockEnd: size.xs ? pxToRem(16) : pxToRem(20)
            }}
            wrap={size.xs}
            justify={'space-between'}
            gutter={[20, 0]}
          >
            <Col xs={size.xs ? 24 : undefined} md={12}>
              <SignatureCollapsible
                header={'Hand-off'}
                inputPlaceHolder={'Hand-off Name'}
                inputItemFormName={'handOffName'}
                itemFormItemErrorMessage={'Enter Hand-off name'}
                signatureFormName={'handOffSignature'}
                signatureFormErrorMessage={'Draw Hand-off signature'}
                signHeight={pxToRem(206)}
              />
            </Col>
            <Col xs={size.xs ? 24 : undefined} md={12}>
              <SignatureCollapsible
                header={'Receiver'}
                inputPlaceHolder={'Receiver Name'}
                inputItemFormName={'receiverName'}
                itemFormItemErrorMessage={'Enter Receiver name'}
                signatureFormName={'receiverSignature'}
                signatureFormErrorMessage={'Draw Receiver signature'}
                signHeight={pxToRem(206)}
              />
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <VsTextAreaFormItem
                width="100%"
                formItemProps={{
                  name: 'comment',
                  style: {
                    marginBottom: 0
                  },
                  rules: [
                    {
                      required: true,
                      min: 10,
                      message: (
                        <ErrorMessage>
                          Type Comment (min 10 characters)
                        </ErrorMessage>
                      )
                    }
                  ]
                }}
                placeholder="Comments"
                autoSize={{
                  minRows: 7
                }}
              />
            </Col>
          </Row>
        </div>
        <Row
          justify={size.xs ? 'space-between' : 'end'}
          style={{
            marginBlockStart: pxToRem(16),
            paddingInline: pxToRem(20)
          }}
        >
          <VsButton
            style={{
              width: size.xs ? '48%' : pxToRem(132),
              marginInlineEnd: pxToRem(14)
            }}
            size={BUTTON_SIZES.large}
            onClick={onCloseModal}
          >
            Cancel
          </VsButton>
          <VsButton
            antButtonProps={{
              type: 'primary',
              htmlType: 'submit',
              loading: isLoading
            }}
            style={{ width: size.xs ? '48%' : pxToRem(132) }}
            size={BUTTON_SIZES.large}
          >
            Submit
          </VsButton>
        </Row>
      </Form>
    </Modal>
  );
};

export default ShiftCountProcessModal;
