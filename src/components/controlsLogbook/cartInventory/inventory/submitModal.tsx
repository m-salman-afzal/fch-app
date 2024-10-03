import { CloseOutlined } from '@ant-design/icons';
import {
  Col,
  Divider,
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
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TCartInventoryLogsSubmit } from '@/types/cartInventoryTypes';

import SignatureCollapsible from '@/components/common/signCollapsible/signCollapsible';

import { toBase64File } from '@/utils/sharedUtils';

import { useInventoryTableStyle } from '../useCartInventoryStyle';

interface Props {
  open: boolean;
  onCloseModal: () => void;
  formRef: FormInstance;
  isLoading: boolean;
  handleSubmit: (data: TCartInventoryLogsSubmit) => Promise<void>;
}

const { useBreakpoint } = Grid;

export const SubmitModal: React.FC<Props> = ({
  open,
  onCloseModal,
  formRef,
  isLoading,
  handleSubmit
}) => {
  const size = useBreakpoint();
  const { commentBox } = useInventoryTableStyle();

  const handleOnSubmit = async (values: TCartInventoryLogsSubmit) => {
    const formFields = {
      ...values
    };

    if (Array.isArray(values.countedBySignature)) {
      formFields.countedBySignature = (await toBase64File(
        values.countedBySignature[0].originFileObj
      )) as string;
    }

    if (Array.isArray(values.witnessSignature)) {
      formFields.witnessSignature = (await toBase64File(
        values.witnessSignature[0].originFileObj
      )) as string;
    }

    handleSubmit(formFields);
  };

  const onCancel = () => {
    formRef.resetFields();
    onCloseModal();
  };

  return (
    <Modal
      width={size.xs ? '100vw' : pxToRem(724)}
      open={open}
      onCancel={onCancel}
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
          Submit
        </Typography.Title>
      }
      maskClosable={false}
      centered
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      destroyOnClose={true}
    >
      <Divider
        style={{
          margin: `${pxToRem(12)} 0 ${pxToRem(20)} 0`,
          borderColor: '#00000026'
        }}
      />
      <Form
        style={{ width: '100%', paddingInline: pxToRem(20) }}
        form={formRef}
        onFinish={handleOnSubmit}
      >
        <Row gutter={20}>
          <Col
            lg={12}
            style={{ paddingBottom: size.xs ? pxToRem(16) : 0 }}
            xs={24}
          >
            <SignatureCollapsible
              header={'Your Signature'}
              inputPlaceHolder={'Your Name'}
              inputItemFormName={'countedBy'}
              itemFormItemErrorMessage={'Enter Your Name'}
              signatureFormErrorMessage={'Draw Signature'}
              signatureFormName={'countedBySignature'}
            />
          </Col>
          <Col lg={12} xs={24}>
            <SignatureCollapsible
              header={'Witness'}
              inputPlaceHolder={'Witness Name'}
              inputItemFormName={'witnessName'}
              itemFormItemErrorMessage={'Enter Witness Name'}
              signatureFormErrorMessage={'Draw Signature'}
              signatureFormName={'witnessSignature'}
            />
          </Col>
        </Row>
        <Row
          justify={'start'}
          style={{ paddingTop: size.xs ? pxToRem(16) : pxToRem(20) }}
        >
          <Col span={24} className={commentBox}>
            <VsTextAreaFormItem
              style={{
                height: pxToRem(195),
                marginBottom: size.xs ? pxToRem(16) : pxToRem(20)
              }}
              formItemProps={{
                name: 'comment',
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
              width="100%"
              autoSize={{ minRows: 7.7, maxRows: 7.7 }}
              placeholder="Comment"
            />
          </Col>
        </Row>
      </Form>
      <Divider
        style={{
          margin: `0 0 ${pxToRem(12)} 0`,
          borderColor: '#00000026'
        }}
      />
      <Row justify={'end'} gutter={14} style={{ paddingInline: pxToRem(20) }}>
        <Col>
          <VsButton
            style={{ width: pxToRem(130) }}
            size={BUTTON_SIZES.large}
            onClick={onCancel}
            antButtonProps={{
              loading: isLoading
            }}
          >
            Cancel
          </VsButton>
        </Col>
        <Col>
          <VsButton
            style={{ width: pxToRem(130) }}
            size={BUTTON_SIZES.large}
            onClick={formRef.submit}
            antButtonProps={{
              loading: isLoading,
              type: 'primary'
            }}
          >
            Submit
          </VsButton>
        </Col>
      </Row>
    </Modal>
  );
};
