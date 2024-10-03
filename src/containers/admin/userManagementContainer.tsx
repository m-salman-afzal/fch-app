import { Dispatch, SetStateAction, useState } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ErrorMessage,
  useConfirm,
  VsButton
} from 'vs-design-components/src/Components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { Admin, UserFilters, UserFormType } from '@/types/adminTypes';
import { SelectOption } from '@/types/commonTypes';

import UserDetailsModal from '@/components/admin/userManagement/userDetailsModal';
import UserLayout from '@/components/admin/userManagement/userLayout';
import BulkUpload from '@/components/common/bulkUpload/bulkUpload';
import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';

import DELETEICON from '@/assets/icons/common/deleteModal.svg';
import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import { useSessionStorage } from '@/hooks/useSessionStorage';
import { useCommonStyles } from '@/styles/useCommonStyles';
import {
  ADMINS_SAMPLE_FILE,
  ALL,
  PERMISSION_TYPES_BACKEND,
  TOAST_DURATION,
  TOAST_GENERIC_ERROR_MESSAGE
} from '@/utils/constants';
import { DeleteOption } from '@/utils/constantsComponents';
import { addAdminUrl, updateAdminUrl } from '@/utils/endpoints';
import {
  getContrastColor,
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE,
  toCapitalize
} from '@/utils/sharedUtils';
import ShowToast from '@/utils/showToast';
import { ADMIN_URL, API_BASE_URL } from '@/utils/urls';

interface props {
  userDetailsModal: boolean;
  setShowUserModal: Dispatch<SetStateAction<boolean>>;
  filteredList: Admin[];
  setFilteredList: Dispatch<SetStateAction<Admin[]>>;
  filters: UserFilters;
  setFilters: Dispatch<SetStateAction<UserFilters>>;
  getAllAdmins: () => void;
  adminList: Admin[];
  rolesSelectOptions: SelectOption[];
  facilitiesOptions: SelectOption[];
  onCancelBulkUploadModal: () => void;
  onSubmitBulkUploadModal: (e: any) => void;
  showBulkUploadModel: boolean;
  bulkUploadFormRef: any;
  onUpdateAdmin: (admin: Admin, action: 'edit' | 'delete' | 'add') => void;
  getFilterAdminList: (admin?: Admin[], filters?: UserFilters) => Admin[];
  tableLoading: boolean;
}
const UserManagementContainer: React.FC<props> = ({
  userDetailsModal,
  setShowUserModal,
  filteredList,
  setFilteredList,
  filters,
  setFilters,
  adminList,
  getAllAdmins,
  rolesSelectOptions,
  facilitiesOptions,
  onCancelBulkUploadModal,
  onSubmitBulkUploadModal,
  showBulkUploadModel,
  bulkUploadFormRef,
  onUpdateAdmin,
  getFilterAdminList,
  tableLoading
}) => {
  const [editAdminId, setEditAdminId] = useState<string>('');
  const { getDataFromCookie, removeAllCookies } = useCookies();
  const { removeAllSessionStorage } = useSessionStorage();
  const currentAdmin = getDataFromCookie();
  const adminAccess = currentAdmin?.rbac.admins;
  const {
    fetchData,
    isLoading,
    setIsLoading,
    updateData,
    postData,
    deleteData
  } = useFetch();
  const { confirm } = useConfirm();
  const router = useRouter();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [form] = Form.useForm<UserFormType>();
  const {
    deleteFamilyMemberConfirmIcon,
    deleteFamilyMemberConfirmIconContainer
  } = useCommonStyles();

  const onCancelUserModal = () => {
    form.resetFields();
    setShowUserModal(false);
    if (isEdit) {
      setIsEdit(false);
    }
  };

  const onCloseTag = (e: any, type: 'role' | 'facility') => {
    const filteredRoles = { ...filters };
    filteredRoles[type] = filters[type].filter(key => key !== e);

    if (filteredRoles[type].length === 0) {
      filteredRoles[type] = [ALL];
    }
    setFilters(filteredRoles);
    const updatedFilteredAdmins = getFilterAdminList(adminList, filteredRoles);
    setFilteredList(updatedFilteredAdmins);
  };

  const clearAllFilters = () => {
    setFilters({ ...filters, role: [ALL], facility: [ALL] });
    const nameFiltered = adminList.filter((admin: Admin) =>
      `${admin.lastName} ${admin.firstName}`.includes(filters.name)
    );
    setFilteredList(nameFiltered);
  };

  const [currentAdminFacilities, setCurrentAdminFacilities] = useState<any>([]);
  const [adminFacilityCheckList, setAdminFacilityCheckList] = useState<any>([]);

  const deletedFacilities = (selectedFacilities: any) => {
    return currentAdminFacilities.filter(
      (facility: any) => !selectedFacilities.includes(facility)
    );
  };

  const getCurrentAdminFacilityChecklist = async (adminId: string) => {
    try {
      const url = `${API_BASE_URL}${ADMIN_URL}/adminFacilityCheckList`;
      const { facilityChecklist } = await fetchData(url, { adminId });

      if (facilityChecklist) {
        const facilities = Array.from(
          new Set<string>(
            facilityChecklist.map((fC: any) => {
              return fC.facilityId;
            })
          )
        );
        setAdminFacilityCheckList(facilities);

        return facilities;
      } else setAdminFacilityCheckList([]);
    } catch (error) {}
  };

  const onClickEdit = (adminValues: Admin) => {
    getCurrentAdminFacilityChecklist(adminValues.adminId);

    setIsEdit(true);
    setShowUserModal(true);

    const currentFacilities = adminValues.facility.map(
      facility => facility.facilityId
    );
    setCurrentAdminFacilities(currentFacilities);

    form.setFieldsValue({
      firstName: adminValues.firstName,
      lastName: adminValues.lastName,
      email: adminValues.email,
      roleId: adminValues.role.map(rbac => rbac.roleId),
      facilityId: currentFacilities
    });
    setEditAdminId(adminValues.adminId);
  };

  const onClickDelete = (adminValues: Admin) => {
    confirm({
      onOk: async () => {
        setIsLoading(true);
        const adminCheckListFacilites = await getCurrentAdminFacilityChecklist(
          adminValues.adminId
        );

        if (adminCheckListFacilites?.length) {
          ShowToast(
            'To delete this user contact your admin to remove this user from facility checklist',
            'error',
            TOAST_DURATION
          );
          setIsLoading(false);

          return;
        }

        const deleteAdmin = await deleteData(
          `${API_BASE_URL}${ADMIN_URL}/remove/${adminValues.adminId}`
        );

        if (!(deleteAdmin.status === 'error')) {
          setIsLoading(false);
          onUpdateAdmin(adminValues, 'delete');
        } else {
          ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);
          setIsLoading(false);
        }
      },
      text: (
        <>
          <Typography.Paragraph
            style={{
              fontSize: pxToRem(20),
              fontWeight: 600,
              textAlign: 'center',
              marginBlockEnd: 0,
              marginBottom: pxToRem(16)
            }}
          >
            Are you sure you want to delete this user?
          </Typography.Paragraph>
          <Typography.Text
            style={{
              fontSize: pxToRem(14),
              fontWeight: 400,
              color: 'rgba(0, 0, 0, 0.65)',
              marginBlockEnd: 0,
              marginLeft: pxToRem(5)
            }}
          >
            User:{' '}
            <span
              style={{
                color: 'rgba(0, 0, 0, 0.88)'
              }}
            >{`${adminValues.lastName}, ${adminValues.firstName}`}</span>
          </Typography.Text>
        </>
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

  const onSelectMenuItmes = (key: string, adminValues: Admin) => {
    if (key === '0') {
      onClickEdit(adminValues);
    } else {
      onClickDelete(adminValues);
    }
  };

  const onFinishAddUser = async (values: UserFormType) => {
    try {
      const url = addAdminUrl();
      values.firstName = toCapitalize(values.firstName);
      values.lastName = toCapitalize(values.lastName);
      const admin = await postData(url, values);

      if (admin.status === 'error') {
        if (admin.message === 'Already exists') {
          form.setFields([
            {
              name: 'email',
              errors: [
                (<ErrorMessage>This user already exists</ErrorMessage>) as any
              ]
            }
          ]);
        } else {
          ShowToast(TOAST_GENERIC_ERROR_MESSAGE, admin?.status, TOAST_DURATION);
        }

        return;
      }
      onUpdateAdmin(admin, 'add');
      onCancelUserModal();
    } catch (erros) {
      ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);
    }
  };

  const onFinishEditUser = async (values: UserFormType) => {
    try {
      const url = updateAdminUrl(editAdminId);
      const admin = await updateData(url, values);
      if (admin.status === 'error') {
        ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);

        return;
      } else {
        if (currentAdmin.adminId === editAdminId) {
          logoutUser();
        }
        onUpdateAdmin(admin, 'edit');
        onCancelUserModal();
      }
    } catch (error) {
      ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);
    }
  };

  const onFinishFormUserFields = (values: UserFormType) => {
    if (isEdit) {
      onFinishEditUser(values);
    } else {
      onFinishAddUser(values);
    }
  };

  const showMoreOptions = (data: any[], displayKey: string, style?: any) => {
    if (data?.length > 1) {
      const items = data?.toSpliced(0, 1).map(i => i[displayKey]);
      const htmlContent = (
        <div>
          {items.map((item, index) => {
            return (
              <span key={index} style={{ display: 'flex' }}>{`${
                index + 1
              }. ${item}`}</span>
            );
          })}
        </div>
      );

      return (
        <Tooltip title={htmlContent}>
          {' '}
          <ColorfulPill
            text={`+${items.length}`}
            style={style || { marginLeft: pxToRem(10) }}
          />
        </Tooltip>
      );
    }

    return null;
  };

  const logoutUser = () => {
    removeAllCookies();
    removeAllSessionStorage();
    router.push('/login');
  };

  const AdminUserTableColumn: ColumnsType<Admin> = [
    {
      title: 'User',
      width: 210,
      render: (value: Admin) => (
        <div>{`${value.lastName}, ${value.firstName}`}</div>
      )
    },
    {
      title: 'Email',
      width: '330px',
      render: (value: Admin) => <div>{value.email}</div>
    },
    {
      title: 'Role',
      width: 215,
      render: (value: Admin) => (
        <>
          {value.role[0] && (
            <ColorfulPill
              key={value.role[0]?.rbacId}
              text={value.role[0]?.name}
              style={{
                background: value.role[0]?.colorCode,
                color:
                  value.role[0]?.colorCode &&
                  getContrastColor(value.role[0]?.colorCode)
              }}
            />
          )}
          {showMoreOptions(value.role, 'name', { marginLeft: pxToRem(-2) })}
        </>
      )
    },
    {
      title: 'Facility',
      width: 215,
      render: (value: Admin) => (
        <div style={{ display: 'inline-flex' }}>
          {value.facility[0]?.facilityName}
          {showMoreOptions(value.facility, 'facilityName')}
        </div>
      )
    }
  ];
  adminAccess === PERMISSION_TYPES_BACKEND.WRITE &&
    AdminUserTableColumn.push({
      render: (values: Admin) => (
        <div
          style={{
            border: '0px solid',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Dropdown
            placement={'bottomRight'}
            menu={{
              items: [
                {
                  label: 'Edit',
                  key: 0
                },
                {
                  label: <DeleteOption />,
                  key: 1
                }
              ],
              onClick: items => onSelectMenuItmes(items.key, values)
            }}
            trigger={['click']}
          >
            <VsButton style={TABLE_BUTTON_STYLE} size={BUTTON_SIZES.squareIcon}>
              <MoreOutlined style={TABLE_BUTTON_ICON_SIZE} />
            </VsButton>
          </Dropdown>
        </div>
      )
    });

  return (
    <>
      <UserLayout
        adminList={filteredList}
        adminUserTableColumns={AdminUserTableColumn}
        isLoading={tableLoading}
        roleOptions={rolesSelectOptions}
        filters={filters}
        onCloseTag={onCloseTag}
        onPressClearAll={clearAllFilters}
        facilitiesOptions={facilitiesOptions}
      />

      <UserDetailsModal
        isLoading={isLoading}
        open={userDetailsModal}
        isEdit={isEdit}
        roleOptions={rolesSelectOptions}
        facilitiesOptions={facilitiesOptions}
        form={form}
        onCloseModal={onCancelUserModal}
        onFinishForm={onFinishFormUserFields}
        adminFacilityCheckList={adminFacilityCheckList}
        deletedFacilities={deletedFacilities}
      />

      <BulkUpload
        sampleData={ADMINS_SAMPLE_FILE}
        onCloseModal={onCancelBulkUploadModal}
        onFinishForm={onSubmitBulkUploadModal}
        open={showBulkUploadModel}
        form={bulkUploadFormRef}
        isLoading={false}
        fileName={'Sample User List'}
      />
    </>
  );
};

export default UserManagementContainer;
