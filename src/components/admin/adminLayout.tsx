import {
  ChangeEvent,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect
} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Col, Grid, Row, Typography } from 'antd';
import { VsButton, VsSelectFormItem } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { RBAC, RoleAndServiceList, UserFilters } from '@/types/adminTypes';
import { SelectOption } from '@/types/commonTypes';

import useCookies from '@/hooks/useCookies';
import {
  ALL,
  PERMISSION_TYPES_BACKEND,
  PERMISSIONS_TYPES
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import VsSegmented from '../common/segmented/VsSegmented';
import UserSearchFilter from './userManagement/userSearchFilter';

interface props {
  openNewUserModal: () => void;
  isLoading: boolean;
  onSearchName: (e: ChangeEvent<HTMLInputElement>) => void;
  roleOptions: SelectOption[];
  filters: UserFilters;
  onSelectRoles: (e: any) => void;
  onScreen: string;
  setScreen: (val: any) => void;
  permissionChanges: RoleAndServiceList[];
  onCancelPermissionChanges: () => void;
  onSavePermissionChanges: () => void;
  facilitiesOptions: SelectOption[];
  onSelectFacility: (e: any) => void;
  csvAdmins: any;
  openBulkUploadModel: () => void;
  setShowModel: (status: boolean) => void;
}

const ADMIN_MENU_ITEMS = ['User Management', 'Permissions', 'Roles'];
export const ADMIN_MENU_ITEMS_MOBILE = [
  {
    key: 'User Management',
    value: 'User Management',
    label: 'User Management'
  },
  {
    key: 'Permissions',
    value: 'Permissions',
    label: 'Permissions'
  },
  {
    key: 'Roles',
    value: 'Roles',
    label: 'Roles'
  }
];

const { useBreakpoint } = Grid;
const AdminLayout: React.FC<PropsWithChildren<props>> = ({
  children,
  onScreen,
  setScreen,
  openNewUserModal,
  isLoading,
  onSearchName,
  roleOptions,
  filters,
  onSelectRoles,
  permissionChanges,
  onCancelPermissionChanges,
  onSavePermissionChanges,
  facilitiesOptions,
  onSelectFacility,
  csvAdmins,
  openBulkUploadModel,
  setShowModel
}) => {
  const roleFitlerItems = [{ label: ALL, key: ALL, value: '' }, ...roleOptions];

  const facilityFitlerItems = [
    { label: ALL, key: ALL, value: '' },
    ...facilitiesOptions
  ];

  const size = useBreakpoint();
  const { getDataFromCookie } = useCookies();
  const userManagementAccess = getDataFromCookie()?.rbac.admins;
  const permissionManagementAccess = getDataFromCookie()?.rbac.roleServiceList;
  const roleManagementAccess = getDataFromCookie()?.rbac.roles;
  const segmentedMenuItems = ADMIN_MENU_ITEMS.filter((item: string) => {
    if (
      item === 'User Management' &&
      userManagementAccess === PERMISSION_TYPES_BACKEND.HIDE
    ) {
      return false;
    }
    if (
      item === 'Permissions' &&
      permissionManagementAccess === PERMISSION_TYPES_BACKEND.HIDE
    ) {
      return false;
    }
    if (
      item === 'Roles' &&
      roleManagementAccess === PERMISSION_TYPES_BACKEND.HIDE
    ) {
      return false;
    }

    return true;
  });

  const segmentedMenuItemsMobile = ADMIN_MENU_ITEMS_MOBILE.filter(item => {
    if (
      item.value === 'User Management' &&
      userManagementAccess === PERMISSION_TYPES_BACKEND.HIDE
    ) {
      return false;
    }
    if (
      item.value === 'Permissions' &&
      permissionManagementAccess === PERMISSION_TYPES_BACKEND.HIDE
    ) {
      return false;
    }
    if (
      item.value === 'Roles' &&
      roleManagementAccess === PERMISSION_TYPES_BACKEND.HIDE
    ) {
      return false;
    }

    return true;
  });

  return (
    <>
      <div
        style={{
          marginBlockEnd: pxToRem(16),
          ...(size.xs ? { paddingInline: pxToRem(20) } : {})
        }}
      >
        <Row>
          {size.xs && (
            <Typography.Text style={{ fontSize: pxToRem(16), fontWeight: 600 }}>
              Administration
            </Typography.Text>
          )}
        </Row>
        <Row
          justify="space-between"
          style={{ gap: pxToRem(16), paddingTop: size.xs ? pxToRem(7) : '' }}
        >
          {size.xs ? (
            <Col span={24} style={{ height: pxToRem(32) }}>
              <VsSelectFormItem
                options={segmentedMenuItemsMobile}
                onChange={(e: any) => {
                  setScreen(e);
                }}
                height={pxToRem(32)}
                width={'100%'}
                externalShowLabel={false}
                defaultValue={segmentedMenuItemsMobile[0].value}
              />
            </Col>
          ) : (
            <Col span={8}>
              <VsSegmented
                segmentedProps={{
                  options: segmentedMenuItems,
                  defaultValue: segmentedMenuItems[0],
                  block: true,
                  value: onScreen,
                  onChange: (e: any) => {
                    setScreen(e);
                  },
                  width: 'auto'
                }}
              />
            </Col>
          )}

          {onScreen === 'User Management' && (
            <UserSearchFilter
              csvAdmins={csvAdmins}
              onSearchName={onSearchName}
              openBulkUploadModel={openBulkUploadModel}
              onSelectRoles={onSelectRoles}
              onSelectFacility={onSelectFacility}
              openNewUserModal={openNewUserModal}
              roleOptions={roleOptions}
              facilitiesOptions={facilitiesOptions}
              filters={filters}
              userManagementAccess={userManagementAccess}
            />
          )}
          {size.sm &&
            onScreen === 'Permissions' &&
            permissionChanges.length > 0 && (
              <Col span={12}>
                <Row justify={'end'} style={{ gap: pxToRem(5) }}>
                  <div>
                    <VsButton
                      onClick={onCancelPermissionChanges}
                      size={BUTTON_SIZES.middle}
                      style={{
                        width: pxToRem(105)
                      }}
                    >
                      Cancel
                    </VsButton>
                  </div>
                  <div>
                    <VsButton
                      antButtonProps={{
                        type: 'primary',
                        disabled: !permissionChanges.length
                      }}
                      size={BUTTON_SIZES.middle}
                      onClick={onSavePermissionChanges}
                      style={{
                        width: pxToRem(105)
                      }}
                    >
                      Save
                    </VsButton>
                  </div>
                </Row>
              </Col>
            )}

          {onScreen === 'Roles' &&
            roleManagementAccess === PERMISSIONS_TYPES.WRITE && (
              <Col>
                <VsButton
                  antButtonProps={{
                    type: 'primary'
                  }}
                  onClick={() => setShowModel(true)}
                  style={{
                    width: 'fit-content'
                  }}
                  size={BUTTON_SIZES.middle}
                >
                  <PlusOutlined />
                  Add New Role
                </VsButton>
              </Col>
            )}
        </Row>
      </div>

      <div
        style={
          onScreen === 'Permissions'
            ? {
                height: '100dvh',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingBottom: pxToRem(100)
              }
            : {}
        }
      >
        {children}

        {size.xs &&
          onScreen === 'Permissions' &&
          permissionChanges.length > 0 && (
            <Col
              span={24}
              style={{
                paddingInline: pxToRem(20),
                paddingBlockEnd: pxToRem(70)
              }}
            >
              <Row justify={'space-between'}>
                <Col span={12} style={{ paddingInlineEnd: pxToRem(5) }}>
                  <VsButton
                    onClick={onCancelPermissionChanges}
                    size={BUTTON_SIZES.large}
                    style={{
                      width: '100%'
                    }}
                  >
                    Cancel
                  </VsButton>
                </Col>
                <Col span={12} style={{ paddingInlineStart: pxToRem(5) }}>
                  <VsButton
                    antButtonProps={{
                      type: 'primary',
                      disabled: !permissionChanges.length
                    }}
                    style={{
                      width: '100%'
                    }}
                    size={BUTTON_SIZES.large}
                    onClick={onSavePermissionChanges}
                  >
                    Save
                  </VsButton>
                </Col>
              </Row>
            </Col>
          )}
      </div>
    </>
  );
};

export default AdminLayout;
