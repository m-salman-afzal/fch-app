import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Form, FormInstance, Grid, Modal, Row, Typography } from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsSelectFormItem
} from 'vs-design-components';
import { VsSelectMobileFormItem } from 'vs-design-components/src/Components/Select';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { UserFormType } from '@/types/adminTypes';
import { SelectOption } from '@/types/commonTypes';

import { tagRender } from '@/components/common/tagsForSelect/tags';

import { pxToRem } from '@/utils/sharedUtils';
import { ADMIN_VALID_DOMAINS } from '@/utils/urls';

interface props {
  isLoading: boolean;
  open: boolean;
  isEdit: boolean;
  roleOptions: SelectOption[];
  facilitiesOptions: SelectOption[];
  form: FormInstance<UserFormType>;
  adminFacilityCheckList: any[];
  deletedFacilities: (val: any[]) => string[];
  onCloseModal: () => void;
  onFinishForm: (values: UserFormType) => void;
}
const { useBreakpoint } = Grid;
const UserDetailsModal: React.FC<props> = ({
  open,
  isEdit,
  roleOptions,
  form,
  isLoading,
  facilitiesOptions,
  adminFacilityCheckList,
  deletedFacilities,
  onCloseModal,
  onFinishForm
}) => {
  const size = useBreakpoint();

  const validatorForSelect = (_: any, value: any) => {
    if (!isEdit) {
      return !value || value.length === 0
        ? Promise.reject(<ErrorMessage>Select Facility</ErrorMessage>)
        : Promise.resolve();
    }

    const dF = deletedFacilities(value);

    const error_facilities = dF.filter((fId: any) => {
      return adminFacilityCheckList.includes(fId);
    });

    if (error_facilities.length) {
      const efs = error_facilities.map((ef: string) => {
        return facilitiesOptions.filter(f => {
          return f.value === ef;
        })[0].label;
      });

      return Promise.reject(
        <ErrorMessage
          customStyle={{
            marginBlockEnd: pxToRem(-10),
            width: '100%',
            display: 'flex',
            columnGap: pxToRem(5),
            lineHeight: pxToRem(20)
          }}
        >
          {`To remove this user from ${efs}, contact your admin to remove
          this user from facility checklist`}
        </ErrorMessage>
      );
    }

    return !value || value.length === 0
      ? Promise.reject(<ErrorMessage>Select Facility</ErrorMessage>)
      : Promise.resolve();
  };

  let emailDomainPattern = ``;

  const validDomains = ADMIN_VALID_DOMAINS.split(',');
  for (const domain of validDomains) {
    emailDomainPattern += `^[A-Za-z0-9._%+-]+@${domain.split('.')[0]}\.${
      domain.split('.')[1]
    }|`;
  }
  emailDomainPattern = emailDomainPattern.slice(0, -1);
  emailDomainPattern += `$`;

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
          {isEdit ? 'Edit User' : 'Add User'}
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(402)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
    >
      <Form
        form={form}
        onFinish={onFinishForm}
        style={{ marginBlockStart: pxToRem(20) }}
        name="userEvents"
      >
        <Row style={{ paddingInline: pxToRem(20) }}>
          <Col span={24}>
            <Row gutter={[13, 10]} style={{ marginBlockEnd: pxToRem(-5) }}>
              <Col span={12}>
                <BasicInputFormItem
                  placeholder="First Name"
                  formItemProps={{
                    name: 'firstName',
                    rules: [
                      {
                        required: true,
                        message: <ErrorMessage>Enter First Name</ErrorMessage>
                      }
                    ]
                  }}
                  width="100%"
                />
              </Col>
              <Col span={12}>
                <BasicInputFormItem
                  placeholder="Last Name"
                  formItemProps={{
                    name: 'lastName',
                    rules: [
                      {
                        required: true,
                        message: <ErrorMessage>Enter Last Name</ErrorMessage>
                      }
                    ]
                  }}
                  width="100%"
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                {' '}
                <BasicInputFormItem
                  placeholder="Email"
                  formItemProps={{
                    name: 'email',
                    rules: [
                      {
                        required: true,
                        type: 'email',
                        validator: (rule, value) => {
                          if (
                            !value ||
                            !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
                          ) {
                            return Promise.reject(
                              <ErrorMessage>Enter Valid Email</ErrorMessage>
                            );
                          }

                          if (!value.match(emailDomainPattern)) {
                            return Promise.reject(
                              <ErrorMessage>
                                Users must be added with their
                                @firstclasshealthcare email
                              </ErrorMessage>
                            );
                          }

                          return Promise.resolve();
                        }
                      }
                    ]
                  }}
                  width="100%"
                />
              </Col>
            </Row>
            <Row style={{ marginBlockStart: pxToRem(-5) }}>
              <Col span={24}>
                {size.md ? (
                  <VsSelectFormItem
                    placeholder="Role"
                    mode="multiple"
                    options={roleOptions}
                    filterOption={(input: any, option: any) => {
                      return !!(
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    formItemProps={{
                      name: 'roleId',
                      rules: [
                        {
                          required: true,
                          message: <ErrorMessage>Select Role</ErrorMessage>
                        }
                      ],
                      style: {
                        marginBlockEnd: 0
                      }
                    }}
                    tagRender={tagRender}
                  />
                ) : (
                  <VsSelectMobileFormItem
                    placeholder="Role"
                    searchPlaceholder={'Search Role'}
                    mode="multiple"
                    options={roleOptions}
                    formItemProps={{
                      name: 'roleId',
                      rules: [
                        {
                          required: true,
                          message: <ErrorMessage>Select Role</ErrorMessage>
                        }
                      ],
                      style: {
                        marginBlockEnd: 0
                      }
                    }}
                    modalTitle="Select Role"
                    tagRender={tagRender}
                  />
                )}
              </Col>
            </Row>
            <Row style={{ marginBlockStart: pxToRem(20) }}>
              <Col span={24}>
                {size.md ? (
                  <VsSelectFormItem
                    placeholder="Facility"
                    mode="multiple"
                    options={facilitiesOptions}
                    filterOption={(input: any, option: any) => {
                      return !!(
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                    formItemProps={{
                      name: 'facilityId',
                      rules: [
                        {
                          required: true,
                          validator: (_, value) => {
                            return validatorForSelect(_, value);
                          }
                        }
                      ],
                      style: {
                        marginBlockEnd: 0
                      }
                    }}
                    tagRender={tagRender}
                  />
                ) : (
                  <VsSelectMobileFormItem
                    placeholder="Facility"
                    searchPlaceholder={'Search Facility'}
                    mode="multiple"
                    options={facilitiesOptions}
                    formItemProps={{
                      name: 'facilityId',
                      rules: [
                        {
                          required: true,
                          validator: (_, value) => {
                            return validatorForSelect(_, value);
                          }
                        }
                      ],
                      style: {
                        marginBlockEnd: 0
                      }
                    }}
                    modalTitle="Select Facility"
                    tagRender={tagRender}
                  />
                )}
              </Col>
            </Row>
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
                icon: !isEdit && <PlusOutlined />
              }}
              size={BUTTON_SIZES.large}
              style={{ width: '100%' }}
            >
              {isEdit ? 'Save' : 'Add User'}
            </VsButton>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UserDetailsModal;
