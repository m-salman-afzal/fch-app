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
  VsButton,
  VsSelectFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { Formulary } from '@/types/formularyTypes';

import { BOOLEAN_SELECT } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;
const formName = 'levels';

interface Props {
  form: FormInstance;
  onFinish: (val: any) => void;
  open: boolean;
  setOpen: (x: boolean) => void;
  isLoading: boolean;
  formData: Formulary;
}

export const SetLevelsModal: FC<Props> = ({
  form,
  onFinish,
  open,
  setOpen,
  isLoading,
  formData
}) => {
  const size = useBreakpoint();

  return (
    <Modal
      open={open}
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
          Set Levels or Central Supply
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(402)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(20) }} />}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
    >
      <Divider style={{ margin: `${pxToRem(12)} 0px ${pxToRem(20)} 0px` }} />
      <Form form={form} onFinish={onFinish}>
        <div style={{ paddingInline: pxToRem(20) }}>
          <Row style={{ paddingBlockEnd: pxToRem(16) }}>
            <Typography.Text
              style={{
                fontSize: pxToRem(14),
                fontWeight: 400,
                color: 'rgba(0, 0, 0, 0.65)'
              }}
            >
              {formData.name}
            </Typography.Text>
          </Row>

          <BasicInputFormItem
            placeholder="Par Level"
            width="100%"
            type="number"
            formItemProps={{
              name: [formName, 'parLevel'],
              rules: [
                {
                  required: true,
                  type: 'number',
                  validator: (rule, val) => {
                    if (!val) {
                      return Promise.reject(
                        <ErrorMessage>Par level is required</ErrorMessage>
                      );
                    }
                    if (!/^[1-9][0-9]*$/.test(val)) {
                      return Promise.reject(
                        <ErrorMessage>Must be greater than 0</ErrorMessage>
                      );
                    }

                    return Promise.resolve();
                  }
                }
              ]
            }}
          />
          <BasicInputFormItem
            placeholder="Threshold"
            width="100%"
            type="number"
            formItemProps={{
              name: [formName, 'threshold'],
              rules: [
                {
                  required: true,
                  type: 'number',
                  validator: (rule, val) => {
                    if (!val) {
                      return Promise.reject(
                        <ErrorMessage>Threshold level is required</ErrorMessage>
                      );
                    }
                    if (!/^[1-9][0-9]*$/.test(val)) {
                      return Promise.reject(
                        <ErrorMessage>Must be greater than 0</ErrorMessage>
                      );
                    }

                    if (
                      Number(form.getFieldValue([formName, 'parLevel'])) <=
                      Number(val)
                    ) {
                      return Promise.reject(
                        <ErrorMessage>
                          Threshold should be less than Par level
                        </ErrorMessage>
                      );
                    }

                    return Promise.resolve();
                  }
                }
              ]
            }}
          />
          <BasicInputFormItem
            placeholder="Min"
            width="100%"
            type="number"
            formItemProps={{
              name: [formName, 'minLevel'],
              rules: [
                {
                  required: true,
                  type: 'number',
                  validator: (rule, val) => {
                    if (!val) {
                      return Promise.reject(
                        <ErrorMessage>Min level is required</ErrorMessage>
                      );
                    }
                    if (!/^[1-9][0-9]*$/.test(val)) {
                      return Promise.reject(
                        <ErrorMessage>Must be greater than 0</ErrorMessage>
                      );
                    }

                    return Promise.resolve();
                  }
                }
              ]
            }}
          />
          <BasicInputFormItem
            type="number"
            placeholder="Max"
            width="100%"
            formItemProps={{
              name: [formName, 'maxLevel'],
              rules: [
                {
                  required: true,
                  type: 'number',
                  validator: (rule, val) => {
                    if (!val) {
                      return Promise.reject(
                        <ErrorMessage>Max level is required</ErrorMessage>
                      );
                    }
                    if (!/^[1-9][0-9]*$/.test(val)) {
                      return Promise.reject(
                        <ErrorMessage>Must be greater than 0</ErrorMessage>
                      );
                    }

                    if (
                      Number(form.getFieldValue([formName, 'minLevel'])) >=
                      Number(val)
                    ) {
                      return Promise.reject(
                        <ErrorMessage>
                          Max value must be greater than min
                        </ErrorMessage>
                      );
                    }

                    return Promise.resolve();
                  }
                }
              ]
            }}
          />
          <VsSelectFormItem
            options={BOOLEAN_SELECT}
            placeholder="Central Supply"
            formItemProps={{
              name: [formName, 'isStock'],
              rules: [
                {
                  required: true,
                  message: 'Central supply is required'
                }
              ],
              initialValue: false
            }}
            externalShowLabel={true}
          />
        </div>
        <Divider
          style={{ margin: `${pxToRem(20)} 0rem ${pxToRem(12)} 0rem` }}
        />

        <div style={{ paddingInline: pxToRem(20) }}>
          <Row gutter={[14, 14]}>
            <Col span={12}>
              <VsButton
                onClick={() => {
                  setOpen(false);
                  form.resetFields();
                }}
                size={BUTTON_SIZES.large}
                style={{ width: '100%' }}
              >
                Cancel
              </VsButton>
            </Col>
            <Col span={12}>
              <VsButton
                antButtonProps={{
                  type: 'primary',
                  htmlType: 'submit',
                  loading: isLoading
                }}
                size={BUTTON_SIZES.large}
                style={{ width: '100%' }}
              >
                Save
              </VsButton>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};
