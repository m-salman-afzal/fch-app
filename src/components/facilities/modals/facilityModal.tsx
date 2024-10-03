import { FC } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Divider, Form, FormInstance, Grid, Modal, Row } from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsDatePickerFormItem,
  VsMobileDatePickerFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

interface Props {
  title?: string;
  handleFacilityFormSubmit: (val: any) => void;
  facilityFormRef: FormInstance;
  setOpen: (val: boolean) => void;
  open: boolean;
  facilityExists: any[];
  facilityToEdit: any;
  onCancelFacilitiesModal: () => void;
  isLoading: boolean;
}

export const FacilityModal: FC<Props> = ({
  title,
  setOpen,
  open,
  handleFacilityFormSubmit: handleContactFormSubmit,
  facilityFormRef: contactFormRef,
  facilityExists,
  facilityToEdit,
  onCancelFacilitiesModal,
  isLoading
}) => {
  const size = useBreakpoint();

  return (
    <Modal
      open={open}
      footer={null}
      destroyOnClose
      title={
        <div style={{ paddingLeft: 20, fontSize: 20, paddingTop: 12 }}>
          {title ?? 'Add New Facility'}
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
        setOpen(false);
        contactFormRef.resetFields();
        onCancelFacilitiesModal();
      }}
      maskClosable={false}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(22) }} />}
      centered
    >
      <Divider style={{ marginTop: 12, marginBottom: 20 }} />
      <Form
        form={contactFormRef}
        onFinish={handleContactFormSubmit}
        style={{ width: '100%' }}
      >
        <div style={{ marginInline: pxToRem(20) }}>
          <BasicInputFormItem
            placeholder="Facility Name"
            formItemProps={{
              name: 'facilityName',
              rules: [
                {
                  required: true,
                  message: (
                    <ErrorMessage>Facility Name is required</ErrorMessage>
                  )
                }
              ]
            }}
            width="100%"
          />
          <BasicInputFormItem
            placeholder="Address"
            formItemProps={{
              rules: [
                {
                  required: true,
                  message: <ErrorMessage>Address is required</ErrorMessage>
                }
              ],
              name: 'address'
            }}
            width="100%"
          />
          <BasicInputFormItem
            placeholder="Population"
            formItemProps={{
              rules: [
                {
                  required: false,
                  validator: (rule, val) => {
                    if (!val) {
                      return Promise.resolve();
                    }
                    if (!/^[1-9][0-9]*$/.test(val)) {
                      return Promise.reject(
                        <ErrorMessage>Must be greater than 0</ErrorMessage>
                      );
                    }

                    return Promise.resolve();
                  }
                }
              ],
              name: 'population'
            }}
            type="number"
            width="100%"
          />
          {size.xs ? (
            <VsMobileDatePickerFormItem
              seperateLabel={'Launch Date'}
              placeholder="MM/DD/YYYY"
              width="100%"
              formItemProps={{
                name: 'launchDate'
              }}
            />
          ) : (
            <VsDatePickerFormItem
              seperateLabel={'Launch Date'}
              placeholder="MM/DD/YYYY"
              width="100%"
              datePickerProps={{
                minDate: new Date('01/01/1900')
              }}
              formItemProps={{
                name: 'launchDate'
              }}
            />
          )}
        </div>
        <Divider style={{ marginTop: 20, marginBottom: 12 }} />

        <div style={{ paddingInline: pxToRem(20) }}>
          <Row
            justify={'space-between'}
            gutter={[14, 12]}
            style={{ paddingBottom: 12 }}
          >
            <Col span={12}>
              <VsButton
                onClick={() => {
                  setOpen(false);
                  contactFormRef.resetFields();
                }}
                style={{ width: '100%' }}
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
                  icon: title !== 'Edit Facility' && (
                    <PlusOutlined style={{ fontSize: 16 }} />
                  ),
                  loading: isLoading
                }}
                style={{ width: '100%' }}
                size={BUTTON_SIZES.large}
              >
                {title === 'Edit Facility' ? 'Save' : 'Add Facility'}
              </VsButton>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};
