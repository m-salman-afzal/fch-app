import { CloseOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Col,
  ColorPicker,
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
import { VsSelectMobileFormItem } from 'vs-design-components/src/Components/Select';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { Role } from '@/types/adminTypes';

import { tagRender } from '@/components/common/tagsForSelect/tags';

import { PERMISSIONS_TYPES } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useRoleManagementStyle } from './useRoleManagementStyle';

interface props {
  isLoading: boolean;
  open: boolean;
  isEdit: Role | null;
  form: FormInstance<Role>;
  onCloseModal: () => void;
  onFinishForm: (values: Role) => void;
}
const { useBreakpoint } = Grid;
const RoleModal: React.FC<props> = ({
  open,
  isEdit,
  form,
  isLoading,
  onCloseModal,
  onFinishForm
}) => {
  const size = useBreakpoint();
  const { roleColorPicker } = useRoleManagementStyle();
  const permissionOption = [
    { label: 'Edit', value: PERMISSIONS_TYPES.WRITE },
    { label: 'View', value: PERMISSIONS_TYPES.READ },
    { label: 'Hide', value: PERMISSIONS_TYPES.HIDE }
  ];

  const onColourChange = (color: any) => {
    form.setFields([
      { name: 'colorCode', value: color.toHexString(), errors: [] }
    ]);
  };

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
          {isEdit ? 'Edit Role' : 'Add New Role'}
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
        name="user"
      >
        <Row style={{ paddingInline: pxToRem(20) }}>
          <Col span={24}>
            <Row gutter={[13, 0]}>
              <Col span={24}>
                <BasicInputFormItem
                  placeholder="Role Name"
                  formItemProps={{
                    name: 'name',
                    rules: [
                      {
                        required: true,
                        message: <ErrorMessage>Enter Role Name</ErrorMessage>
                      }
                    ]
                  }}
                  width="100%"
                />
              </Col>
            </Row>
            {!isEdit && (
              <Row style={{ marginBottom: pxToRem(24) }}>
                <Col span={24}>
                  {size.md ? (
                    <VsSelectFormItem
                      placeholder="Default Permissions"
                      options={permissionOption}
                      showSearch={true}
                      filterOption={(input: any, option: any) => {
                        return !!(
                          option.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                      formItemProps={{
                        name: 'defaultPermission',
                        rules: [
                          {
                            required: true,
                            message: (
                              <ErrorMessage>
                                {' '}
                                Select Default Permission
                              </ErrorMessage>
                            )
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
                      placeholder="Default Permission"
                      options={permissionOption}
                      showSearch={true}
                      formItemProps={{
                        name: 'defaultPermission',
                        rules: [
                          {
                            required: true,
                            message: (
                              <ErrorMessage>
                                Select Default Permission
                              </ErrorMessage>
                            )
                          }
                        ],
                        style: {
                          marginBlockEnd: 0
                        }
                      }}
                      modalTitle="Select Default Permission"
                      tagRender={tagRender}
                      searchPlaceholder={''}
                    />
                  )}
                </Col>
              </Row>
            )}
            <Row>
              <Form.Item
                name="colorCode"
                initialValue={'#1677FF'}
                required={true}
                rules={[
                  {
                    message: <ErrorMessage>Select Role Color</ErrorMessage>
                  }
                ]}
              >
                <ColorPicker
                  disabledAlpha={true}
                  onChangeComplete={onColourChange}
                  onChange={onColourChange}
                  className={roleColorPicker}
                  showText={() => (
                    <span>
                      Role Color <DownOutlined />{' '}
                    </span>
                  )}
                />
              </Form.Item>
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
              antButtonProps={{
                loading: isLoading
              }}
              size={BUTTON_SIZES.large}
              style={{ width: '100%' }}
              onClick={onCloseModal}
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
              {isEdit ? 'Save' : 'Add Role'}
            </VsButton>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default RoleModal;
