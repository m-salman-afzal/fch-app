import { TableColumnsType } from 'antd';

import { PermissionType, RBAC, RoleAndServiceList } from '@/types/adminTypes';
import { TRbacTableData } from '@/types/permissionTypes';

import { PERMISSION_TYPES } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import PermissionButton from './permissionButton';
import { PermissionTableButtonAdmin } from './permissionTableButton';

const getPermissionColumns: (
  roleServiceList: any[],
  onChangeRbac: (
    rbac: RBAC,
    permission: PermissionType,
    serviceListId: string,
    isRemove: boolean
  ) => void,
  changes: RoleAndServiceList[],
  errorList: any[]
) => any[] = (roleServiceList, onChangeRbac, changes, errorList) => {
  const isSmall = window.screen.width <= 576;

  const permissionColumn: TableColumnsType<TRbacTableData> = [
    {
      key: 'action',
      width: pxToRem(30),
      fixed: isSmall ? undefined : 'left'
    },
    {
      title: 'Feature',
      key: 'feature',
      fixed: isSmall ? undefined : 'left',
      render: (value: TRbacTableData) => {
        return (
          <div
            style={{
              fontWeight: value.isChild ? undefined : 600,
              paddingInline: pxToRem(16)
            }}
          >
            {value.label as string}
          </div>
        );
      }
    },
    ...roleServiceList?.map((item: RBAC, index) => {
      return {
        title: item.name,
        key: item.name,
        width: pxToRem(120),
        render: (value: TRbacTableData) => {
          const serviceId: any = item.roleServiceList.find(
            i => i.serviceList.name === value.feature
          )?.serviceListId;

          const isError = errorList?.find(
            err => err.serviceListId === serviceId && err.roleId === item.roleId
          );

          return (
            !value?.children && (
              <div
                style={{
                  paddingInline: pxToRem(16),
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  border: isError ? `${pxToRem(2)} solid #ff4d4f` : undefined
                }}
              >
                <PermissionButton
                  key={serviceId}
                  selected={PERMISSION_TYPES[value[item.name] as string]}
                  onChange={(rbac, permission, serviceListId, isRemove) =>
                    onChangeRbac(rbac, permission, serviceListId, isRemove)
                  }
                  featureName={item}
                  changes={changes}
                  rbacId={serviceId}
                />
              </div>
            )
          );
        }
      };
    })
  ];

  return permissionColumn;
};

export default getPermissionColumns;
