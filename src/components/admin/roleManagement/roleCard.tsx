import { FC } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Col, Dropdown, Row, theme } from 'antd';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { Role } from '@/types/adminTypes';

import { useRoleManagementStyle } from './useRoleManagementStyle';

interface props {
  role: Role;
  isWriteAccess: boolean;
  onEdit: (role: any) => void;
  onDelete: (role: any) => void;
  isDragDisabled?: boolean;
}
const { useToken } = theme;
const RoleCard: FC<props> = ({
  role,
  onEdit,
  onDelete,
  isWriteAccess,
  isDragDisabled
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: role.roleId,
    disabled: isDragDisabled,
    transition: {
      duration: 450,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition
  };

  const { roleCard } = useRoleManagementStyle();
  const { token } = useToken();
  const { name, colorCode } = role;
  const handleOnClick = (item: any, selectedKeys: any) => {
    switch (selectedKeys.key) {
      case '1':
        return onDelete(item);
      case '0':
        onEdit(item);
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Row
        justify={'start'}
        className={roleCard}
        align={'middle'}
        style={{ borderColor: colorCode || token.colorBgContainerDisabled }}
      >
        {isWriteAccess && (
          <Col
            span={2}
            style={{
              textAlign: 'start',
              cursor: isDragDisabled ? 'default' : 'move',
              fontSize: pxToRem(16)
            }}
            {...listeners}
          >
            ⋮⋮
          </Col>
        )}
        <Col span={20}>{name}</Col>
        <Col span={2}>
          {isWriteAccess && !isDragging && (
            <Dropdown
              menu={{
                items: [
                  {
                    label: 'Edit',
                    key: 0
                  },
                  {
                    label: 'Delete',
                    key: 1
                  }
                ],
                onClick: selectedKeys => handleOnClick(role, selectedKeys)
              }}
              placement={'bottomRight'}
              trigger={['click']}
            >
              <Button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: pxToRem(24),
                  height: pxToRem(24),
                  borderRadius: pxToRem(4),
                  padding: pxToRem(1)
                }}
                size="small"
              >
                <MoreOutlined style={{ fontSize: pxToRem(14) }} />
              </Button>
            </Dropdown>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RoleCard;
