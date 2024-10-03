import { FC, useEffect, useState } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Col, Form, Grid, Radio, Row, Typography } from 'antd';
import { VsButton, VsFormItem } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import useCookies from '@/hooks/useCookies';
import { PERMISSIONS_TYPES } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useInventoryBulkUploadStyle } from './useInventoryBulkUpload';

const { useBreakpoint } = Grid;

interface props {
  isControlled: boolean;
  handleNext: (value: any) => void;
}

interface FormValues {
  isControlled: boolean;
  action: 'add' | 'editAndDelete';
}

export const InventoryReceiveOptions: FC<props> = ({ handleNext }) => {
  const [drugTypeDefaultOption, setDrugTypeDefaultOption] = useState<boolean>();
  const { getDataFromCookie } = useCookies();
  const { formularyControlled, formularyNonControlled } =
    getDataFromCookie()?.rbac;
  const { radioButton, radioButtonLabel } = useInventoryBulkUploadStyle();
  const [isDisableNext, setIsDisableNext] = useState(true);
  const size = useBreakpoint();

  const isControlled = formularyControlled === PERMISSIONS_TYPES.HIDE;
  const isNonControlled = formularyNonControlled === PERMISSIONS_TYPES.HIDE;

  const [form] = Form.useForm();

  const onFinishForm = (values: any) => {
    handleNext(values);
  };

  useEffect(() => {
    if (isNonControlled || isControlled) {
      const drugTypeDefaultValue = isNonControlled;
      setDrugTypeDefaultOption(drugTypeDefaultValue);
      form.setFieldsValue({
        isControlled: drugTypeDefaultValue
      });
    }

    form.setFieldsValue({ action: null });
  }, []);

  const onValuesChange = (
    changedValues: Partial<FormValues>,
    allValues: FormValues
  ) => {
    const isAllSelected =
      allValues.isControlled !== undefined &&
      allValues.isControlled !== null &&
      allValues.action
        ? false
        : true;
    setIsDisableNext(isAllSelected);
  };

  return (
    <Row style={{ paddingInline: pxToRem(20) }} gutter={[0, 24]}>
      <Form
        onValuesChange={onValuesChange}
        form={form}
        onFinish={onFinishForm}
        name="inventoryReceiveOptions"
        style={{ width: '100%' }}
      >
        <Col span={24}>
          <Typography.Text className={radioButtonLabel}>
            Controlled Drugs?
          </Typography.Text>
          <VsFormItem
            formItemProps={{
              name: 'isControlled',
              noStyle: true,
              rules: [
                {
                  required: true,
                  message: ''
                }
              ]
            }}
          >
            <Radio.Group style={{ width: '100%' }} name="isControlled">
              <Row gutter={[0, 16]}>
                <Col span={24}>
                  <Radio
                    value={true}
                    name="isControlled"
                    className={radioButton}
                    disabled={isControlled}
                  >
                    Controlled
                  </Radio>
                </Col>

                <Col span={24}>
                  {' '}
                  <Radio
                    value={false}
                    name="isControlled"
                    className={radioButton}
                    disabled={isNonControlled}
                  >
                    Non-Controlled
                  </Radio>
                </Col>
              </Row>
            </Radio.Group>
          </VsFormItem>
        </Col>

        <Col span={24} style={{ marginBlockStart: pxToRem(16) }}>
          <Typography.Text className={radioButtonLabel}>Action</Typography.Text>
          <VsFormItem
            formItemProps={{
              name: 'action',
              noStyle: true,
              required: true
            }}
          >
            <Radio.Group style={{ width: '100%' }} name="action">
              <Row gutter={[0, 16]}>
                <Col span={24}>
                  <Radio value={'add'} name="action" className={radioButton}>
                    Initial Receipt or Replenishment
                  </Radio>
                </Col>

                <Col span={24}>
                  {' '}
                  <Radio
                    value={'editAndDelete'}
                    name="action"
                    className={radioButton}
                  >
                    Edit or Delete
                  </Radio>
                </Col>
              </Row>
            </Radio.Group>
          </VsFormItem>
        </Col>
        <Col span={24} style={{ marginBlockStart: pxToRem(24) }}>
          <Row justify={'end'}>
            <Col style={{ width: size.xs ? '100%' : 'auto' }}>
              <VsButton
                style={{ width: size.xs ? '100%' : 'auto' }}
                size={BUTTON_SIZES.large}
                antButtonProps={{
                  disabled: isDisableNext,
                  type: 'primary',
                  htmlType: 'submit'
                }}
              >
                Next <ArrowRightOutlined />
              </VsButton>
            </Col>
          </Row>
        </Col>
      </Form>
    </Row>
  );
};
