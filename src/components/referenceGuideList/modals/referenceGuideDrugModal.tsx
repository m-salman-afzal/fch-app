import { FC } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Col, Divider, Form, FormInstance, Grid, Modal, Row } from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsTextAreaFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

interface Props {
  handleDrugFormSubmit: (val: any) => void;
  drugFormRef: FormInstance;
  setOpen: (val: boolean) => void;
  open: boolean;
}

export const ReferenceGuideDrugModal: FC<Props> = ({
  setOpen,
  open,
  handleDrugFormSubmit,
  drugFormRef
}) => {
  const size = useBreakpoint();

  return (
    <Modal
      open={open}
      footer={null}
      destroyOnClose
      title={
        <div style={{ paddingLeft: 20, fontSize: 20, paddingTop: 12 }}>
          {'Edit'}
        </div>
      }
      width={size.xs ? '100%' : pxToRem(402)}
      style={{
        maxWidth: 'none',
        margin: 0
      }}
      styles={{
        content: {
          padding: 0
        }
      }}
      onCancel={() => {
        drugFormRef.resetFields();
        setOpen(false);
      }}
      maskClosable={false}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(20) }} />}
      centered
    >
      <Divider style={{ marginTop: 12, marginBottom: 20 }} />
      <Form
        form={drugFormRef}
        onFinish={handleDrugFormSubmit}
        style={{
          width: '100%',
          display: `flex`,
          flexDirection: `column`,
          justifyContent: `center`,
          alignItems: `center`
        }}
        scrollToFirstError={true}
      >
        <Row
          style={{
            width: '100%',
            justifyContent: 'center',
            columnGap: pxToRem(11),
            height: size.xs ? pxToRem(387) : `100%`,
            overflow: 'auto',
            scrollBehavior: `smooth`,
            paddingTop: pxToRem(6)
          }}
        >
          <Col style={{ width: '90%' }}>
            <BasicInputFormItem
              placeholder="Category"
              formItemProps={{
                name: 'category',
                rules: [
                  {
                    required: true,
                    message: <ErrorMessage>Enter Category</ErrorMessage>
                  }
                ]
              }}
              width="100%"
            />
          </Col>
          <Col style={{ width: '90%' }}>
            <BasicInputFormItem
              placeholder="Subcategory"
              formItemProps={{
                rules: [
                  {
                    required: false
                  }
                ],
                name: 'subCategory'
              }}
              width="100%"
            />
          </Col>
          <Col style={{ width: '43.5%' }}>
            <BasicInputFormItem
              placeholder="Min"
              type={`number`}
              formItemProps={{
                dependencies: ['max'],
                rules: [
                  {
                    required: true,
                    message: <ErrorMessage>Enter Min</ErrorMessage>
                  },
                  () => ({
                    validator(_, value) {
                      if (parseFloat(value) <= 0) {
                        return Promise.reject(
                          new Error('Min should be greater than 0')
                        );
                      }

                      return Promise.resolve();
                    }
                  })
                ],
                name: 'min'
              }}
              width="100%"
            />
          </Col>
          <Col style={{ width: '43.5%' }}>
            <BasicInputFormItem
              placeholder="Max"
              type={`number`}
              formItemProps={{
                dependencies: ['min'],
                rules: [
                  {
                    required: true,
                    message: <ErrorMessage>Enter Max</ErrorMessage>
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue('min')) {
                        if (
                          parseFloat(getFieldValue('min')) >= parseFloat(value)
                        ) {
                          return Promise.reject(
                            new Error('Max should be greater than Min')
                          );
                        }
                      }

                      return Promise.resolve();
                    }
                  })
                ],
                name: 'max'
              }}
              width="100%"
            />
          </Col>
          <Col style={{ width: '90%' }}>
            <VsTextAreaFormItem
              placeholder="Notes"
              rows={5}
              width="100%"
              formItemProps={{
                rules: [
                  {
                    required: false
                  }
                ],
                name: 'notes'
              }}
            />
          </Col>
        </Row>
        <Divider style={{ marginTop: 0, marginBottom: 12 }} />
        <Row
          justify={`center`}
          style={{
            paddingBottom: pxToRem(12),
            columnGap: pxToRem(11),
            width: '97%'
          }}
        >
          <Col style={{ width: '45%' }}>
            <VsButton
              size={BUTTON_SIZES.large}
              style={{ width: '100%' }}
              onClick={() => {
                drugFormRef.resetFields();
                setOpen(false);
              }}
            >
              Cancel
            </VsButton>
          </Col>
          <Col style={{ width: '45%' }}>
            <VsButton
              antButtonProps={{
                type: 'primary',
                htmlType: 'submit'
              }}
              size={BUTTON_SIZES.large}
              style={{ width: '100%' }}
            >
              Save
            </VsButton>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
