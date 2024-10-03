import { Dispatch, FC, SetStateAction, useCallback, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Col, Form, Grid, Row, Spin, Typography } from 'antd';
import Image from 'next/image';
import { ErrorMessage, useConfirm } from 'vs-design-components/src/Components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { Admin, Role } from '@/types/adminTypes';

import RoleCard from '@/components/admin/roleManagement/roleCard';
import RoleModal from '@/components/admin/roleManagement/roleModel';

import DELETEICON from '@/assets/icons/common/deleteModal.svg';
import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import { useCommonStyles } from '@/styles/useCommonStyles';
import {
  PERMISSIONS_TYPES,
  TOAST_DURATION,
  TOAST_GENERIC_ERROR_MESSAGE
} from '@/utils/constants';
import { getAllRolesUrl } from '@/utils/endpoints';
import ShowToast from '@/utils/showToast';

const { useBreakpoint } = Grid;
interface Props {
  rolesList: Role[];
  getRoles: () => void;
  getAllAdmins: () => void;
  showModel: boolean;
  setShowModel: (status: boolean) => void;
  admins: Admin[];
  setRolesList: Dispatch<SetStateAction<Role[]>>;
  isRolePageLoading: boolean;
}

const RoleManagement: FC<Props> = ({
  rolesList,
  setRolesList,
  getRoles,
  setShowModel,
  showModel,
  admins,
  getAllAdmins,
  isRolePageLoading
}) => {
  const [formRef] = Form.useForm();
  const [editRole, setEdit] = useState<null | Role>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState();

  const { getDataFromCookie } = useCookies();
  const roleManagementAccess = getDataFromCookie()?.rbac.roles;
  const { confirm } = useConfirm();
  const sensors = useSensors(
    useSensor(TouchSensor),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor)
  );
  const { fetchData, updateData, deleteData, postData } = useFetch();
  const {
    deleteFamilyMemberConfirmIcon,
    deleteFamilyMemberConfirmIconContainer
  } = useCommonStyles();
  const size = useBreakpoint();
  const onModelCancel = () => {
    formRef.resetFields();
    setEdit(null);
    setShowModel(false);
  };

  const onSubmit = async (data: any) => {
    if (!editRole) {
      return await addNewRole(data);
    }

    return await updateRole(data);
  };

  const addNewRole = async (roleData: Role) => {
    setIsLoading(true);
    const url = getAllRolesUrl();
    const newRole: any = await postData(url, roleData);

    if (newRole.status === 'error') {
      if (newRole.message === 'Already exists') {
        setIsLoading(false);
        formRef.setFields([
          {
            name: 'name',
            errors: [
              (<ErrorMessage>This role already exists</ErrorMessage>) as any
            ]
          }
        ]);
      }

      return false;
    }

    getRoles();
    setIsLoading(false);
    setShowModel(false);
    formRef.resetFields();

    return true;
  };

  const updateRole = async (roleData: Role) => {
    setIsLoading(true);
    const url = getAllRolesUrl();
    const updateRole = [{ ...editRole, ...roleData }];
    const role: any = await updateData(url, { data: updateRole });

    if (role.status === 'error') {
      return ShowToast('Can not update role. Try again', 'error', 5);
    }

    getRoles();
    getAllAdmins();
    setShowModel(false);
    setEdit(null);
    setIsLoading(false);
    formRef.resetFields();

    return true;
  };

  const onEdit = (role: Role) => {
    setShowModel(true);
    setEdit(role);
    formRef.setFieldsValue(role);
  };

  const onDelete = (role: Role) => {
    const { roleId, name } = role;
    confirm({
      onOk: async () => {
        const isRoleAssign = admins.find((item: { role: any[] }) => {
          return item.role.find(
            (role: { roleId: string }) => role.roleId === roleId
          );
        });
        if (isRoleAssign) {
          return ShowToast(
            'There are users linked with this role. You need to unassign this role to all the users in order to proceed',
            'error',
            5
          );
        }
        setIsLoading(true);
        const url = getAllRolesUrl();
        const deleteRole = await deleteData(`${url}/${roleId}`);
        if (deleteRole.status === 'error') {
          ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          getRoles();
        }
      },
      text: (
        <Typography.Paragraph
          style={{
            fontSize: pxToRem(20),
            fontWeight: 600,
            textAlign: 'center',
            marginBlockEnd: 0
          }}
        >
          Are you sure you want to delete{' '}
          <strong>
            <u>{name}</u>
          </strong>
          ?
        </Typography.Paragraph>
      ),
      type: 'destructive',
      okText: 'Yes',
      cancelText: 'No',
      icon: (
        <div className={deleteFamilyMemberConfirmIconContainer}>
          <Image
            className={deleteFamilyMemberConfirmIcon}
            alt={'MSG'}
            fill={true}
            src={DELETEICON}
          />
        </div>
      )
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    window.scrollTo(0, 0);
    if (active?.id !== over?.id) {
      setRolesList((roles: Role[]) => {
        const oldIndex = roles.findIndex(c => c.roleId === active?.id);
        const newIndex = roles.findIndex(c => c.roleId === over?.id);
        const sortingOrder = arrayMove(roles, oldIndex, newIndex);
        if (newIndex !== -1) {
          onPositionChange(sortingOrder);

          return sortingOrder;
        }

        return roles;
      });
    }
  };

  const handleDragStart = useCallback((event: any) => {
    setActive(event.active.id);
  }, []);

  const onPositionChange = async (data: any[]) => {
    const updatedPositions = data
      .map((item, index: number) => {
        return {
          ...item,
          position: index
        };
      })
      .filter(item => item.name);
    const url = getAllRolesUrl();
    const isUpdated = await updateData(url, { data: updatedPositions });
    if (isUpdated.status !== 'error') {
      await getRoles();
    }
  };

  return (
    <Spin spinning={isRolePageLoading}>
      <div
        style={{
          height: '100vh',
          overflowY: 'auto',
          position: 'relative',
          paddingBottom: size.xs ? pxToRem(200) : pxToRem(150)
        }}
      >
        <Row
          justify={'start'}
          gutter={[30, 20]}
          style={
            size.xs
              ? { padding: `0 ${pxToRem(20)}`, paddingBlockEnd: pxToRem(130) }
              : { width: '100%', overflowX: 'hidden' }
          }
        >
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            autoScroll={false}
          >
            <SortableContext items={rolesList.map(c => c.roleId)}>
              {rolesList.map(role => {
                return (
                  <Col span={8} key={role.roleId} xs={24} sm={8} xxl={6}>
                    <RoleCard
                      onDelete={onDelete}
                      onEdit={onEdit}
                      role={role}
                      isWriteAccess={
                        roleManagementAccess === PERMISSIONS_TYPES.WRITE
                      }
                    />
                  </Col>
                );
              })}
            </SortableContext>
          </DndContext>
        </Row>
      </div>
      <RoleModal
        isLoading={isLoading}
        open={showModel}
        isEdit={editRole}
        form={formRef}
        onCloseModal={onModelCancel}
        onFinishForm={onSubmit}
      />
    </Spin>
  );
};

export default RoleManagement;
