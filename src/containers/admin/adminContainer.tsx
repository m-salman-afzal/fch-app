import { ChangeEvent, useEffect, useState } from 'react';
import { Form } from 'antd';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Admin,
  Facility,
  PermissionType,
  RBAC,
  Role,
  RoleAndServiceList,
  UserFilters
} from '@/types/adminTypes';
import { SelectOption } from '@/types/commonTypes';
import { TRbacDependencyCheckOutput } from '@/types/permissionTypes';

import AdminLayout from '@/components/admin/adminLayout';
import PermissionsLayout from '@/components/admin/permissionManagement/permissionsLayout';

import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import { useSessionStorage } from '@/hooks/useSessionStorage';
import FacilityService from '@/services/FacilityService';
import {
  ALL,
  PERMISSION_TYPES,
  PERMISSION_TYPES_BACKEND,
  PERMISSION_TYPES_INVERSE,
  TOAST_DURATION,
  TOAST_GENERIC_ERROR_MESSAGE,
  TOAST_MESSAGES
} from '@/utils/constants';
import {
  bulkUpsertAdminUrl,
  getAllAdminsUrl,
  getAllRolesUrl,
  getRolesServiceListUrl
} from '@/utils/endpoints';
import { getRbacLabel, RBAC_ITEMS } from '@/utils/rbacItems';
import { toBase64File } from '@/utils/sharedUtils';
import ShowToast from '@/utils/showToast';
import { API_BASE_URL } from '@/utils/urls';

import RoleManagement from './rolesManagementContainer';
import UserManagementContainer from './userManagementContainer';

export const SCREENS = {
  USER_MANAGEMENT: 'User Management',
  PERMISSIONS: 'Permissions',
  ROLES: 'Roles'
};
const AdminContainer = () => {
  const { getDataFromCookie } = useCookies();
  const currentAdmin = getDataFromCookie();
  const userManagementAccess = currentAdmin?.rbac.admins;
  const permissionManagementAccess = currentAdmin?.rbac.roleServiceList;
  const router = useRouter();
  const tabInUrl = useSearchParams().get('tab');
  const [onScreen, setScreen] = useState<string>(
    tabInUrl ?? SCREENS.USER_MANAGEMENT
  );
  const [adminList, setAdminList] = useState<Admin[]>([]);
  const [adminFilteredList, setAdminFilteredList] = useState<Admin[]>([]);
  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [bulkUploadFormRef] = Form.useForm();
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [roleServiceList, setRoleServiceList] = useState<RBAC[]>([]);
  const [facilitySelectOptions, setFacilitySelectOptions] = useState<
    SelectOption[]
  >([]);
  const [userDetailsModal, setShowUserModal] = useState<boolean>(false);
  const [rolesSelectOptions, setRolesSelectOptions] = useState<SelectOption[]>(
    []
  );

  const [rbacErrorList, setRbacErrorList] = useState<
    TRbacDependencyCheckOutput[]
  >([]);
  const [filters, setFilters] = useState<UserFilters>({
    name: '',
    role: [ALL],
    facility: [ALL]
  });
  const { isLoading, setIsLoading, fetchData, updateData, postData } =
    useFetch();
  const [permissionChanges, setPermissionChanges] = useState<
    RoleAndServiceList[]
  >([]);

  const onChangeScreen = (val: any) => {
    setScreen(val);
    setRbacErrorList([]);
    if (val === SCREENS.USER_MANAGEMENT) {
      getAllAdmins();
    }

    router.push(`/admins?tab=${val}`);
  };

  const setAdminTypesForUserManagment = (appRoles: RBAC[]) => {
    const filteredUserTypes = [];
    if (appRoles && appRoles.length > 0) {
      for (const tempRole of appRoles) {
        filteredUserTypes.push({
          label: tempRole.name,
          value: tempRole.roleId,
          key: tempRole.roleId
        });
      }
    }
    setRolesSelectOptions(filteredUserTypes);
  };

  const getAllRoles = async () => {
    const url = getAllRolesUrl();
    const appRoles = await fetchData(url);

    try {
      if (appRoles.status === 'error') {
        ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);
        setIsLoading(false);

        return;
      }
      const sortedRoles = structuredClone(appRoles).sort((a: any, b: any) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setRolesList(appRoles.sort((a: any, b: any) => a.position - b.position));
      setAdminTypesForUserManagment(sortedRoles);
    } catch (errors) {}
  };

  const getAllAdmins = async () => {
    try {
      setIsLoading(true);
      const url = getAllAdminsUrl();
      const allAdmins = await fetchData(url);
      if (allAdmins.status === 'error') {
        ShowToast(allAdmins.message, allAdmins.status, TOAST_DURATION);
        setIsLoading(false);

        return;
      }

      const adminsWithKey = allAdmins.map((admin: Admin) => ({
        ...admin,
        key: admin.adminId
      }));

      setAdminList(adminsWithKey);
      setAdminFilteredList(() => {
        return getFilterAdminList(adminsWithKey, filters);
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getFacilities = async () => {
    const facilities: Facility[] =
      await FacilityService.getFacilitiesWithContacts({});

    const facilitiesOptions = facilities.map(facility => {
      return {
        label: facility.facilityName,
        key: facility.facilityId,
        value: facility.facilityId
      };
    });
    setFacilitySelectOptions(facilitiesOptions);
  };

  const getRolesServiceList = async () => {
    const url = getRolesServiceListUrl();
    const list = await fetchData(url);

    if (list?.status === 'error') {
      return false;
    }
    setRoleServiceList(list);
  };
  const openNewUserModal = () => {
    setShowUserModal(true);
  };

  const onSearchName = (e: ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    const updatedFilters = { ...filters, name: searchQuery };
    setFilters(updatedFilters);
    const roleFiltered = updatedFilters.role.find(key => key === ALL)
      ? adminList
      : adminList.filter(admin =>
          updatedFilters.role.find((key: string) =>
            admin.role.find(role => key === role.roleId)
          )
        );
    const facilityFiltered = updatedFilters.facility.find(key => key === ALL)
      ? roleFiltered
      : roleFiltered.filter(admin =>
          updatedFilters.facility.find((key: string) =>
            admin.facility.find(role => key === role.facilityId)
          )
        );
    setAdminFilteredList(
      facilityFiltered.filter(
        admin =>
          `${admin.lastName} ${admin.firstName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          admin.email.includes(searchQuery.toLowerCase())
      )
    );
  };

  const onSelectRoleFilter = (role: any) => {
    const updatedFilters =
      role.key === ALL
        ? { ...filters, role: [ALL] }
        : {
            ...filters,
            role: role.selectedKeys.length
              ? role.selectedKeys.filter((key: string) => key !== ALL)
              : [ALL]
          };

    const updateFilteredAdmins = getFilterAdminList(adminList, updatedFilters);
    setFilters(updatedFilters);
    setAdminFilteredList(updateFilteredAdmins);
  };

  const onCancelPermissionChanges = () => {
    setPermissionChanges([]);
    setRbacErrorList([]);
  };

  const getRbacErrorToastMessage = (item: TRbacDependencyCheckOutput) => {
    const role = roleServiceList?.find(role => role.roleId === item.roleId);
    const serviceDefault = role?.roleServiceList?.find(
      rsl => rsl.serviceListId === item.serviceListId
    );
    const service = serviceDefault?.serviceList;

    const permissionSelectedOfService = permissionChanges.find(
      perm => perm.serviceListId === service?.serviceListId
    )?.permission;

    if (item.serviceDependsOnIds) {
      const depends = item.serviceDependsOnIds.map(item => {
        const service = role?.roleServiceList.find(
          rsl => rsl.serviceListId === item.serviceDependsOnId
        )?.serviceList?.name;

        return `${getRbacLabel(service as string)}, ${PERMISSION_TYPES[item.minimumPermissionDependsOn as string]} access`;
      });

      return `${getRbacLabel(service?.name as string)}, ${PERMISSION_TYPES[permissionSelectedOfService ?? serviceDefault?.permission ?? '']} access requires ${depends.join(' or ')}`;
    }

    const serviceDependsOnName = role?.roleServiceList.find(
      rsl => rsl.serviceListId === item.serviceDependsOnId
    )?.serviceList?.name;

    return `${getRbacLabel(service?.name as string)}, ${PERMISSION_TYPES[permissionSelectedOfService ?? serviceDefault?.permission ?? '']} access requires ${getRbacLabel(serviceDependsOnName as string)}, ${PERMISSION_TYPES[item.minimumPermissionDependsOn as string]} access `;
  };

  const onSavePermissionChanges = async () => {
    try {
      const permissionChangesPayload = roleServiceList
        .filter(
          (role: any) =>
            !!permissionChanges.find(perm => perm.roleId === role.roleId)
        )
        .map((role: any) => {
          let tempRole = structuredClone(role);
          const roleFilteredPermissionChanges = permissionChanges.filter(
            perm => perm.roleId === tempRole.roleId
          );
          tempRole.roleServiceList = tempRole.roleServiceList.map(
            (rsl: any) => {
              const newServiceList = roleFilteredPermissionChanges.find(
                perm => perm.serviceListId === rsl.serviceListId
              );
              if (!!newServiceList) {
                return newServiceList;
              }

              return rsl;
            }
          );

          return tempRole;
        });

      const url = getRolesServiceListUrl();
      const response = await updateData(url, {
        data: permissionChangesPayload
      });
      if (response.status !== 'error') {
        await getAllRoles();
        await getRolesServiceList();
        setPermissionChanges([]);
      }

      if (response.status === 'error' && response.body) {
        response.body.forEach((item: TRbacDependencyCheckOutput) => {
          ShowToast(getRbacErrorToastMessage(item), 'error', TOAST_DURATION);
        });
        setRbacErrorList(response.body);
      }
    } catch (error) {}
  };

  const onChangeRbac = (
    rbac: RBAC,
    permission: PermissionType,
    serviceListId: string,
    isRemove: boolean
  ) => {
    const tempChanges = structuredClone(permissionChanges);
    setRbacErrorList([]);
    let clonedRbac = structuredClone(rbac);

    if (isRemove) {
      const filterChanges = tempChanges.filter(change => {
        return (
          change.serviceListId !== serviceListId ||
          change.roleId !== rbac.roleId
        );
      });

      setPermissionChanges(filterChanges);

      return;
    }

    let roleServiceChanged = clonedRbac.roleServiceList.find(
      roleServiceList => roleServiceList.serviceListId === serviceListId
    );

    if (roleServiceChanged) {
      const isSameRoleAndService = tempChanges.find(
        temp => temp.roleServiceListId === roleServiceChanged.roleServiceListId
      );

      if (isSameRoleAndService) {
        setPermissionChanges(
          tempChanges.map(change => {
            if (
              change.roleServiceListId === roleServiceChanged.roleServiceListId
            ) {
              return {
                ...change,
                permission: PERMISSION_TYPES_INVERSE[permission]
              };
            }

            return change;
          })
        );

        return;
      }

      roleServiceChanged.permission = PERMISSION_TYPES_INVERSE[permission];
      tempChanges.push(roleServiceChanged);
    }

    setPermissionChanges(tempChanges);
  };

  const onSelectFacility = (facility: any) => {
    const updatedFilters =
      facility.key === ALL
        ? { ...filters, facility: [ALL] }
        : {
            ...filters,
            facility: facility.selectedKeys.length
              ? facility.selectedKeys.filter((key: string) => key !== ALL)
              : [ALL]
          };

    const updateFilteredAdmins = getFilterAdminList(adminList, updatedFilters);
    setFilters(updatedFilters);
    setAdminFilteredList(updateFilteredAdmins);
  };

  const onCancelBulkUploadModal = () => {
    bulkUploadFormRef.resetFields();
    setShowBulkModal(false);
  };

  const onOpenBulkAdminModal = async () => {
    setShowBulkModal(true);
    bulkUploadFormRef.setFieldsValue({
      csvType: 'bulkAddAdmins'
    });
  };

  const onSubmitBulkUploadModal = async (data: any) => {
    setIsLoading(true);
    const {
      file: { file }
    } = data;
    const csvFile: any = await toBase64File(file);
    const fileNameArray = file.name.split('.');
    fileNameArray.pop();

    let csv = csvFile.split('base64,')[1];
    data.fileContent = csv;
    data.fileName = fileNameArray.join('.');
    data.process = 'BULK_UPSERT_ADMINS';
    data.fileExtension = 'csv';
    data.repository = 'ADMIN';

    const url = bulkUpsertAdminUrl();
    const uploadCsv = await postData(url, data);
    if (uploadCsv.status === 'error') {
      ShowToast(TOAST_MESSAGES.ERROR.FILE_UPLOAD, 'error', TOAST_DURATION);
    }
    onCancelBulkUploadModal();
    setIsLoading(false);
  };

  useEffect(() => {
    if (userManagementAccess !== PERMISSION_TYPES_BACKEND.HIDE) {
      getAllAdmins();
      getFacilities();
      getAllRoles();
    }

    if (permissionManagementAccess !== PERMISSION_TYPES_BACKEND.HIDE) {
      getRolesServiceList();
    }
  }, []);

  const resetSearchFilter = () => {
    const emptySearchQuery = {
      target: { value: '' }
    } as ChangeEvent<HTMLInputElement>;

    onSearchName(emptySearchQuery);
  };
  const getFilterAdminList = (
    updatedAdmins = adminList,
    updatedFilters = filters
  ) => {
    return updatedAdmins.filter(admin => {
      let isMatch: any = true;
      if (updatedFilters?.name.length > 0) {
        isMatch =
          `${admin.lastName} ${admin.firstName}`
            .toLocaleLowerCase()
            .includes(updatedFilters.name.toLocaleLowerCase()) ||
          admin.email
            .toLocaleLowerCase()
            .includes(updatedFilters.name.toLocaleLowerCase());
      }

      if (isMatch && !updatedFilters?.facility.includes(ALL)) {
        isMatch = admin?.facility?.find(fa =>
          updatedFilters.facility.includes(fa.facilityId)
        );
      }

      if (isMatch && !updatedFilters.role.includes(ALL)) {
        isMatch = admin?.role?.find(role =>
          updatedFilters.role.includes(role.roleId)
        );
      }

      return isMatch;
    });
  };

  const updateUserList = (admin: Admin, action: 'edit' | 'delete' | 'add') => {
    let updatedAdmins: Admin[] = [];
    let updateFilteredAdmins: Admin[] = [];

    if (action === 'add' || action === 'edit') {
      if (action === 'add') {
        updatedAdmins = [admin, ...adminList];
      } else {
        updatedAdmins = adminList.map(ad => {
          if (ad.adminId === admin.adminId) {
            return admin;
          }

          return ad;
        });
      }
      updateFilteredAdmins = getFilterAdminList(updatedAdmins);
    }

    if (action === 'delete') {
      updatedAdmins = adminList.filter(ad => ad.adminId !== admin.adminId);
      updateFilteredAdmins = adminFilteredList.filter(
        ad => ad.adminId !== admin.adminId
      );
    }

    setAdminList(updatedAdmins);
    setAdminFilteredList(updateFilteredAdmins);
  };

  useEffect(() => {
    setPermissionChanges([]);
    setRbacErrorList([]);
    resetSearchFilter();
  }, [onScreen]);

  const csvAdmins: any = adminFilteredList.map((a: any) => {
    return {
      ...a,
      role: `"${a.role.map((r: any) => r.name).join(',')}"`,
      externalFacilityId: `"${a.facility
        .map((f: any) => f.externalFacilityId)
        .join(',')}"`
    };
  });

  return (
    <>
      <Head>
        <style>
          {`.ant-layout-content { background-color: ${
            onScreen === SCREENS.USER_MANAGEMENT ? 'white' : '#f5f5f5'
          } !important;
          
          @media screen and (max-width: 576px) {
            background-color: white !important;
            padding-inline: 0 !important;
          } }`}
        </style>
      </Head>
      <AdminLayout
        openNewUserModal={openNewUserModal}
        isLoading={isLoading}
        onSearchName={onSearchName}
        roleOptions={rolesSelectOptions}
        onSelectRoles={onSelectRoleFilter}
        filters={filters}
        onScreen={onScreen}
        setScreen={onChangeScreen}
        permissionChanges={permissionChanges}
        onCancelPermissionChanges={onCancelPermissionChanges}
        onSavePermissionChanges={onSavePermissionChanges}
        facilitiesOptions={facilitySelectOptions}
        onSelectFacility={onSelectFacility}
        csvAdmins={csvAdmins}
        openBulkUploadModel={onOpenBulkAdminModal}
        setShowModel={setShowModel}
      >
        {onScreen === SCREENS.USER_MANAGEMENT && (
          <UserManagementContainer
            userDetailsModal={userDetailsModal}
            setShowUserModal={setShowUserModal}
            filteredList={adminFilteredList}
            setFilteredList={setAdminFilteredList}
            filters={filters}
            tableLoading={isLoading}
            setFilters={setFilters}
            adminList={adminList}
            getAllAdmins={getAllAdmins}
            rolesSelectOptions={rolesSelectOptions}
            facilitiesOptions={facilitySelectOptions}
            onCancelBulkUploadModal={onCancelBulkUploadModal}
            onSubmitBulkUploadModal={onSubmitBulkUploadModal}
            showBulkUploadModel={showBulkModal}
            bulkUploadFormRef={bulkUploadFormRef}
            onUpdateAdmin={updateUserList}
            getFilterAdminList={getFilterAdminList}
          />
        )}

        {onScreen === SCREENS.PERMISSIONS && (
          <PermissionsLayout
            resetChanges={onCancelPermissionChanges}
            onChangeRbac={onChangeRbac}
            rolesList={rolesList}
            changes={permissionChanges}
            isLoading={isLoading}
            roleServiceList={roleServiceList}
            getRolesServiceList={getRolesServiceList}
            RBAC_ITEMS={RBAC_ITEMS}
            errorList={rbacErrorList}
          />
        )}

        {onScreen === SCREENS.ROLES && (
          <RoleManagement
            isRolePageLoading={isLoading}
            admins={adminList}
            rolesList={rolesList}
            getRoles={getAllRoles}
            showModel={showModel}
            setShowModel={setShowModel}
            getAllAdmins={getAllAdmins}
            setRolesList={setRolesList}
          />
        )}
      </AdminLayout>
    </>
  );
};

export default AdminContainer;
