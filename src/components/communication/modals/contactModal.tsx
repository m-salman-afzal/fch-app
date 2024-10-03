import { FC } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Divider, Form, FormInstance, Grid, Modal, Row } from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsSelectFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { ALL } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

interface Props {
  type: string;
  action: string;
  admins: any[];
  facilites: any[];
  reports: any[];
  handleContactFormSubmit: (val: any) => void;
  onSelectName: (val: any, options: any) => void;
  contactFormRef: FormInstance;
  setOpen: (val: boolean) => void;
  open: boolean;
  isLoading: boolean;
}

export const ContactFormModal: FC<Props> = ({
  type,
  action,
  admins,
  onSelectName,
  facilites,
  reports,
  contactFormRef,
  handleContactFormSubmit,
  setOpen,
  open,
  isLoading
}) => {
  const size = useBreakpoint();

  return (
    <Modal
      destroyOnClose
      open={open}
      title={
        <div style={{ paddingLeft: 20, fontSize: 20, paddingTop: 12 }}>
          {`${action === 'Add' ? 'New' : 'Edit'} ${type} Contact`}
        </div>
      }
      width={size.xs ? '100%' : pxToRem(402)}
      styles={{
        content: {
          padding: 0
        }
      }}
      footer={null}
      style={{
        maxWidth: 'none',
        margin: 0
      }}
      maskClosable={false}
      onCancel={() => setOpen(false)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(20) }} />}
      centered
    >
      <Divider style={{ marginTop: pxToRem(12), marginBottom: pxToRem(20) }} />
      <Form form={contactFormRef} onFinish={handleContactFormSubmit}>
        <div style={{ marginInline: pxToRem(20) }}>
          {type === 'Internal' ? (
            <VsSelectFormItem
              placeholder="Name"
              formItemProps={{
                name: 'contactName',
                rules: [
                  {
                    required: true,
                    message: <ErrorMessage>Select Name</ErrorMessage>
                  }
                ]
              }}
              showSearch={true}
              filterOption={(input: any, option: any) => {
                return !!(
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
              options={admins.filter(admin => admin.value !== ALL)}
              onSelect={onSelectName}
              disabled={action === 'Edit'}
            />
          ) : (
            <Row>
              <Col span={12} style={{ paddingInlineEnd: pxToRem(8) }}>
                <BasicInputFormItem
                  placeholder="First Name"
                  width="100%"
                  formItemProps={{
                    name: 'firstName',
                    rules: [
                      {
                        required: true,
                        message: <ErrorMessage>Enter First Name</ErrorMessage>
                      }
                    ]
                  }}
                />
              </Col>

              <Col span={12} style={{ paddingInlineStart: pxToRem(8) }}>
                <BasicInputFormItem
                  placeholder="Last Name"
                  width="100%"
                  formItemProps={{
                    name: 'lastName',
                    rules: [
                      {
                        required: true,
                        message: <ErrorMessage>Enter Last Name</ErrorMessage>
                      }
                    ]
                  }}
                />
              </Col>
            </Row>
          )}

          <BasicInputFormItem
            placeholder="Email"
            width="100%"
            formItemProps={{
              name: 'email',
              rules: [
                {
                  required: true,
                  type: 'email',
                  message: <ErrorMessage>Enter Email</ErrorMessage>
                }
              ]
            }}
            disabled={contactFormRef.getFieldValue('contactName')}
          />

          <VsSelectFormItem
            placeholder="Facility"
            formItemProps={{
              name: 'facilityId',
              rules: [
                {
                  required: true,
                  message: <ErrorMessage>Select Facility</ErrorMessage>
                }
              ]
            }}
            mode="multiple"
            options={facilites?.filter(facility => facility.value !== ALL)}
            filterOption={(input: any, option: any) => {
              return !!(
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
          />

          <VsSelectFormItem
            placeholder="Report"
            formItemProps={{
              name: 'processId',
              rules: [
                {
                  required: true,
                  message: <ErrorMessage>Select Report</ErrorMessage>
                }
              ]
            }}
            mode="multiple"
            options={reports}
            filterOption={(input: any, option: any) => {
              return !!(
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
          />
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
                size={BUTTON_SIZES.large}
                style={{ width: '100%' }}
                onClick={() => setOpen(false)}
              >
                Cancel
              </VsButton>
            </Col>
            <Col span={12}>
              <VsButton
                antButtonProps={{
                  type: 'primary',
                  htmlType: 'submit',
                  icon: action !== 'Edit' && <PlusOutlined />,
                  loading: isLoading
                }}
                size={BUTTON_SIZES.large}
                style={{ width: '100%' }}
              >
                {action === 'Edit' ? 'Save' : 'Add Contact'}
              </VsButton>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};
