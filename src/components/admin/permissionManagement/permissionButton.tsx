import { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';

import { RBAC, RoleAndServiceList } from '@/types/adminTypes';

import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';

import useCookies from '@/hooks/useCookies';
import { PERMISSION_TYPES_BACKEND } from '@/utils/constants';

import { usePermissionManagementStyle } from './usePermissionManagementStyle';

interface props {
  selected: string;
  onChange: (
    rbac: RBAC,
    permission: any,
    serviceId: string,
    isRemove: boolean
  ) => void;
  featureName: RBAC;
  changes: RoleAndServiceList[];
  rbacId: string;
}
const PermissionButton: React.FC<props> = ({
  featureName,
  selected,
  onChange,
  changes,
  rbacId
}) => {
  const getItems = () => {
    const items = [
      {
        label: 'Edit',
        key: 'Edit'
      },
      {
        label: 'View',
        key: 'View'
      },
      {
        label: 'Hide',
        key: 'Hide'
      }
    ];

    return items;
  };

  const [selectedItem, setSelectedItem] = useState<string>(selected);
  const {
    permissionButtonBase,
    permissionButtonEdit,
    permissionButtonHide,
    permissionButtonView
  } = usePermissionManagementStyle();
  const permissionColor: any = {
    Edit: permissionButtonEdit,
    View: permissionButtonView,
    Hide: permissionButtonHide
  };

  useEffect(() => {
    if (changes.length === 0) {
      setSelectedItem(selected);
    }
  }, [changes, featureName]);

  const { getDataFromCookie } = useCookies();
  const permissionManagementAccess = getDataFromCookie()?.rbac.roleServiceList;

  return permissionManagementAccess !== PERMISSION_TYPES_BACKEND.WRITE ? (
    <ColorfulPill className={permissionColor[selectedItem]} text={selected} />
  ) : (
    <Dropdown
      menu={{
        items: getItems(),
        selectable: true,
        selectedKeys: [selectedItem],
        onSelect: e => {
          setSelectedItem(e.key);
          onChange(featureName, e.key, rbacId, e.key === selected);
        }
      }}
      trigger={['click']}
    >
      <Button
        className={
          selected !== selectedItem
            ? permissionButtonBase
            : permissionColor[selectedItem]
        }
        shape="round"
        type={selected !== selectedItem ? 'primary' : 'default'}
      >
        {selectedItem}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default PermissionButton;
