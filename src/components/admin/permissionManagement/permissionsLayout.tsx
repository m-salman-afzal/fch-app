import { useEffect, useMemo, useState } from 'react';
import { Grid, Row, Spin } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import { useRouter, useSearchParams } from 'next/navigation';
import { VsTable } from 'vs-design-components';

import {
  PermissionType,
  RBAC,
  Role,
  RoleAndServiceList
} from '@/types/adminTypes';
import {
  TPermissionWithChildren,
  TRbac,
  TRbacTableChild,
  TRbacTableData
} from '@/types/permissionTypes';

import TableSegmented from '@/components/common/subTabs/tableSegmented';

import { SCREENS } from '@/containers/admin/adminContainer';
import {
  PERMISSION_SUB_TABS,
  PERMISSION_SUBTAB_ITEMS
} from '@/containers/admin/constants';
import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  ADMIN_RBAC_ITEMS,
  MEDICAL_RBAC_ITEMS,
  PHARMACY_RBAC_ITEMS,
  RBAC_ITEMS
} from '@/utils/rbacItems';
import { pxToRem } from '@/utils/sharedUtils';

import getPermissionColumns from './getPermissionColumns';
import { PermissionTableButtonAdmin } from './permissionTableButton';
import { usePermissionManagementStyle } from './usePermissionManagementStyle';

const { useBreakpoint } = Grid;
interface props {
  rolesList: Role[];
  onChangeRbac: (
    rbac: RBAC,
    permission: PermissionType,
    serviceId: string,
    isRemove: boolean
  ) => void;
  changes: RoleAndServiceList[];
  isLoading: boolean;
  roleServiceList: RBAC[];
  getRolesServiceList: () => void;
  RBAC_ITEMS: TRbac;
  errorList: any[];
  resetChanges: () => void;
}
const PermissionsLayout: React.FC<props> = ({
  onChangeRbac,
  changes,
  isLoading,
  roleServiceList,
  getRolesServiceList,
  errorList,
  resetChanges
}) => {
  const [rbacItems, setRbacItems] = useState<TRbac>(RBAC_ITEMS);
  const { permissionContainer, row, rowDark } = usePermissionManagementStyle();
  const [permissionColumns, setPermissionColumns] = useState<any[]>([]);
  const [data, setData] = useState<TRbacTableData[]>([]);
  const [expandedRows, setExpandedRows] = useState<any[]>([]);
  const router = useRouter();
  const tabInUrl = useSearchParams().get('tab');
  const subTabInUrl = useSearchParams().get('subTab');
  const size = useBreakpoint();

  useEffect(() => {
    const mapWithRoute = Object.keys(rbacItems).map(item => {
      const service: TRbacTableData = { feature: '', label: '' };
      service.feature = item;
      const rbacChildren = (rbacItems[item] as TPermissionWithChildren)
        ?.children;
      if (!!rbacChildren) {
        service.children = Object.keys(rbacChildren).map(childItem => {
          let childService: TRbacTableChild = {
            feature: '',
            isChild: true,
            label: ''
          };
          childService.feature = childItem;
          roleServiceList.forEach(role => {
            const found = role.roleServiceList.find(
              i => i.serviceList.name === childItem
            )?.permission;
            if (found) {
              childService = {
                ...childService,
                [role.name]: found
              };
            }
          });
          childService.key = childItem;
          childService.label = rbacChildren[childItem];
          childService.isChild = true;

          return childService;
        });
      }

      roleServiceList.forEach(
        role =>
          (service[role.name] = role.roleServiceList.find(
            i => i.serviceList.name === item
          )?.permission)
      );

      service.key = item;
      service.label = rbacChildren
        ? (rbacItems[item] as TPermissionWithChildren).label
        : (rbacItems[item] as string);

      return service;
    });

    setData(mapWithRoute);
  }, [roleServiceList, rbacItems]);

  useEffect(() => {
    setPermissionColumns(
      getPermissionColumns(roleServiceList, onChangeRbac, changes, errorList)
    );
  }, [roleServiceList, changes, errorList]);

  useEffect(() => {
    getRolesServiceList();

    setRbacItems(() => {
      return subTabInUrl
        ? subTabInUrl === PERMISSION_SUBTAB_ITEMS.ADMIN
          ? ADMIN_RBAC_ITEMS
          : subTabInUrl === PERMISSION_SUBTAB_ITEMS.MEDICAL
            ? MEDICAL_RBAC_ITEMS
            : subTabInUrl === PERMISSION_SUBTAB_ITEMS.PHARMACY
              ? PHARMACY_RBAC_ITEMS
              : RBAC_ITEMS
        : RBAC_ITEMS;
    });
  }, []);

  const [currentTab, setTab] = useState<string>(
    subTabInUrl ?? PERMISSION_SUBTAB_ITEMS.ALL
  );

  const onChangeTabs = (value: SegmentedValue) => {
    setRbacItems(
      value === PERMISSION_SUBTAB_ITEMS.ADMIN
        ? ADMIN_RBAC_ITEMS
        : value === PERMISSION_SUBTAB_ITEMS.MEDICAL
          ? MEDICAL_RBAC_ITEMS
          : value === PERMISSION_SUBTAB_ITEMS.PHARMACY
            ? PHARMACY_RBAC_ITEMS
            : RBAC_ITEMS
    );
    setTab(value as string);
    resetChanges();

    router.push(
      `admins?tab=${tabInUrl ?? SCREENS.USER_MANAGEMENT}&subTab=${value}`
    );
  };

  const { tableHeight } = useTablePaginationPosition();

  return (
    <div style={{ overflowY: 'hidden' }}>
      <TableSegmented
        segmentedProps={{
          options: PERMISSION_SUB_TABS,
          value: currentTab,
          onChange: onChangeTabs,
          style: {
            marginBlockEnd: pxToRem(16),
            paddingInlineStart: size.xs ? pxToRem(20) : undefined
          }
        }}
      />
      <Row
        className={permissionContainer}
        style={{
          marginBlockEnd: pxToRem(42),
          flexWrap: 'nowrap',
          paddingBlockEnd: size.xs ? pxToRem(0) : 0
        }}
      >
        <VsTable
          tableProps={{
            columns: permissionColumns,
            rowClassName: record => (record.isChild ? rowDark : row),
            dataSource: data,
            expandable: {
              expandIcon: PermissionTableButtonAdmin
            },

            loading: isLoading,
            sticky: true,
            pagination: false,
            scroll: {
              x: 'max-content',
              y: tableHeight
            }
          }}
        />
      </Row>
    </div>
  );
};

export default PermissionsLayout;
