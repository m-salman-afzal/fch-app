import { useEffect } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Form, FormInstance, Grid, Modal, Row, Typography } from 'antd';
import { isSemicolonClassElement } from 'typescript';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsSelectFormItem
} from 'vs-design-components';
import { VsSelectMobileFormItem } from 'vs-design-components/src/Components/Select';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { CartForm } from '@/types/cartTypes';
import { SelectOption } from '@/types/commonTypes';

import { tagRender } from '../common/tagsForSelect/tags';

interface props {
  editId: string;
  form: FormInstance<CartForm>;
  open: boolean;
  onFinishForm: (values: CartForm) => Promise<void>;
  isLoading: boolean;
  onCloseModal: () => void;
  unitsOptions: SelectOption[];
  referenceGuide: SelectOption[];
  getUnitOptions: (editId?: string) => void;
  getExistingCart: (search: string) => boolean;
}
const { useBreakpoint } = Grid;

const CartInfoModal: React.FC<props> = ({
  open,
  editId,
  form,
  isLoading,
  unitsOptions,
  onFinishForm,
  onCloseModal,
  getUnitOptions,
  getExistingCart,
  referenceGuide
}) => {
  const isSmall = window.screen.width <= 576;

  useEffect(() => {
    if (isSmall) {
      getUnitOptions(editId);
    }
  }, [open]);
  const size = useBreakpoint();

  return (
    <Modal
      open={open}
      onCancel={onCloseModal}
      destroyOnClose={true}
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
          {!!editId ? 'Edit Cart' : 'New Cart'}
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(402)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
    >
      <Form
        form={form}
        onFinish={values => {
          onFinishForm(values);
        }}
        style={{
          marginBlockStart: pxToRem(12),
          borderBlockStart: `${pxToRem(1)} solid #00000026`,
          paddingBlockStart: pxToRem(20)
        }}
        name="cart"
      >
        <Row style={{ paddingInline: pxToRem(20) }}>
          <Col span={24}>
            <BasicInputFormItem
              placeholder="Cart"
              formNamePath={['cart']}
              formItemProps={{
                name: 'cart',
                rules: [
                  {
                    validator: async (rule, val) => {
                      if (!val) {
                        return Promise.reject(
                          <ErrorMessage>Enter Cart</ErrorMessage>
                        );
                      }

                      if (!editId.length) {
                        const isCartExist = getExistingCart(val);
                        if (isCartExist) {
                          return Promise.reject(
                            <ErrorMessage>Cart already exists</ErrorMessage>
                          );
                        }
                      }
                    },
                    required: true
                  }
                ]
              }}
              width="100%"
            />
            {size.md ? (
              <VsSelectFormItem
                placeholder="Assigned Units"
                mode="multiple"
                options={unitsOptions}
                loading={isLoading}
                onDropdownVisibleChange={open => {
                  if (open) {
                    getUnitOptions(editId);
                  }
                }}
                filterOption={(input: any, option: any) => {
                  return !!(
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
                formItemProps={{
                  name: 'units',
                  rules: [
                    {
                      required: true,
                      message: <ErrorMessage>Select Units</ErrorMessage>
                    }
                  ]
                }}
                tagRender={tagRender}
              />
            ) : (
              <VsSelectMobileFormItem
                placeholder="Assigned Units"
                searchPlaceholder={'Search Units'}
                mode="multiple"
                options={unitsOptions}
                formItemProps={{
                  name: 'units',
                  rules: [
                    {
                      required: true,
                      message: <ErrorMessage>Select Units</ErrorMessage>
                    }
                  ]
                }}
                modalTitle="Select Units"
                formNamePath={['units']}
                tagRender={tagRender}
              />
            )}

            {size.md ? (
              <VsSelectFormItem
                placeholder="Reference Guide"
                options={referenceGuide}
                filterOption={(input: any, option: any) => {
                  return !!(
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
                formItemProps={{
                  name: 'referenceGuideId',
                  rules: [
                    {
                      required: true,
                      message: (
                        <ErrorMessage>Select Reference Guide</ErrorMessage>
                      )
                    }
                  ],
                  style: {
                    marginBlockEnd: 0
                  }
                }}
                formNamePath={['referenceGuideId']}
                tagRender={tagRender}
              />
            ) : (
              <VsSelectMobileFormItem
                placeholder="Reference Guide"
                searchPlaceholder={'Search Reference Guide'}
                options={referenceGuide}
                formItemProps={{
                  name: 'referenceGuideId',
                  rules: [
                    {
                      required: true,
                      message: <ErrorMessage>Reference Guide</ErrorMessage>
                    }
                  ],
                  style: {
                    marginBlockEnd: 0
                  }
                }}
                modalTitle="Select Reference Guide"
                tagRender={tagRender}
              />
            )}
          </Col>
        </Row>
        <Row
          style={{
            marginBlockStart: pxToRem(14),
            paddingInline: pxToRem(20),
            borderBlockStart: `${pxToRem(1)} solid #EBEBEB`,
            paddingBlockStart: pxToRem(12)
          }}
        >
          <Col span={12} style={{ paddingInlineEnd: pxToRem(7) }}>
            <VsButton
              antButtonProps={{
                loading: isLoading
              }}
              onClick={onCloseModal}
              style={{ width: '100%' }}
              size={BUTTON_SIZES.large}
            >
              Cancel
            </VsButton>
          </Col>
          <Col span={12} style={{ paddingInlineStart: pxToRem(7) }}>
            <VsButton
              antButtonProps={{
                type: 'primary',
                htmlType: 'submit',
                loading: isLoading,
                icon: !editId && <PlusOutlined />
              }}
              style={{ width: '100%' }}
              size={BUTTON_SIZES.large}
            >
              {!!editId ? 'Save' : 'Add Med Cart'}
            </VsButton>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CartInfoModal;
