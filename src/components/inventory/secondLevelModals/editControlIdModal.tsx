import { FC } from 'react';
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
  BasicInputFormItem,
  ErrorMessage,
  VsButton
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { Formulary } from '@/types/formularyTypes';
import { Inventory } from '@/types/inventoryTypes';

import { pxToRem } from '@/utils/sharedUtils';

import { ANTIRETROVIRAL } from '../getNdcNestedControlledIdRows';

const { useBreakpoint } = Grid;

interface Props {
  showModal: boolean;
  handleCancel: () => void;
  form: FormInstance;
  drugClass?: string;
  onFinish: (data: any) => void;
  isLoading: boolean;
  formData: Partial<Formulary & Inventory>;
}

export const EditControlIDModal: FC<Props> = ({
  showModal,
  handleCancel,
  form,
  drugClass,
  onFinish,
  isLoading: loading,
  formData
}) => {
  const size = useBreakpoint();

  return (
    <Modal
      open={showModal}
      destroyOnClose={true}
      footer={null}
      style={{
        maxWidth: 'none',
        margin: 0
      }}
      title={
        <Typography.Title
          style={{
            marginBlock: 0,
            fontSize: pxToRem(20),
            paddingLeft: pxToRem(20)
          }}
        >
          {'Edit'}
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(402)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(20) }} />}
      onCancel={handleCancel}
    >
      <Divider style={{ margin: `${pxToRem(12)} 0px ${pxToRem(20)} 0px` }} />
      <Form form={form} onFinish={onFinish}>
        <div style={{ paddingInline: pxToRem(20) }}>
          <Row style={{ paddingBlockEnd: pxToRem(16) }}>
            <Col span={24}>
              <Typography.Text
                style={{
                  fontSize: pxToRem(14),
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.65)',
                  marginBlockEnd: 0,
                  marginLeft: pxToRem(5),
                  display: 'flow',
                  marginBottom: 0
                }}
              >
                {`${formData.name}`}
              </Typography.Text>
            </Col>
            <Col span={24}>
              <Typography.Text
                style={{
                  fontSize: pxToRem(14),
                  fontWeight: 400,
                  color: 'rgba(0, 0, 0, 0.65)',
                  marginBlockEnd: 0,
                  marginLeft: pxToRem(5)
                }}
              >
                NDC:{' '}
                <span
                  style={{
                    color: 'rgba(0, 0, 0, 0.88)'
                  }}
                >{`${formData.ndc}`}</span>
              </Typography.Text>
            </Col>
          </Row>

          <BasicInputFormItem
            placeholder="Controlled ID"
            width="100%"
            formItemProps={{
              name: 'controlledId',
              rules: [
                {
                  validator: (rule, val) => {
                    if (!val) {
                      return Promise.reject(
                        <ErrorMessage>Controlled ID is required</ErrorMessage>
                      );
                    }

                    return Promise.resolve();
                  },
                  required: true
                }
              ]
            }}
          />
          <BasicInputFormItem
            placeholder="Quantity"
            width="100%"
            type="number"
            min={0}
            formItemProps={{
              name: 'controlledQuantity',
              rules: [
                {
                  validator: (rule, val) => {
                    if (!val) {
                      return Promise.reject(
                        <ErrorMessage>Quantity is required</ErrorMessage>
                      );
                    }
                    if (!/^(0|[1-9][0-9]*)$/.test(val)) {
                      return Promise.reject(
                        <ErrorMessage>
                          Must be equal to or greater than 0
                        </ErrorMessage>
                      );
                    }

                    return Promise.resolve();
                  },
                  required: true
                }
              ]
            }}
          />
          {drugClass !== ANTIRETROVIRAL && (
            <BasicInputFormItem
              placeholder="TR"
              width="100%"
              formItemProps={{
                name: 'tr',
                rules: [
                  {
                    validator: (rule, val) => {
                      if (!val) {
                        return Promise.reject(
                          <ErrorMessage>TR is required</ErrorMessage>
                        );
                      }

                      return Promise.resolve();
                    },
                    required: true
                  }
                ]
              }}
            />
          )}
        </div>
        <Divider style={{ margin: `${pxToRem(20)} 0px ${pxToRem(12)} 0px` }} />

        <div style={{ paddingInline: pxToRem(20) }}>
          <Row gutter={[14, 14]}>
            <Col span={12}>
              <VsButton
                style={{ width: '100%' }}
                onClick={handleCancel}
                size={BUTTON_SIZES.large}
              >
                Cancel
              </VsButton>
            </Col>
            <Col span={12}>
              <VsButton
                antButtonProps={{
                  type: 'primary',
                  htmlType: 'submit',
                  loading
                }}
                style={{ width: '100%' }}
                size={BUTTON_SIZES.large}
              >
                {'Save'}
              </VsButton>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};
