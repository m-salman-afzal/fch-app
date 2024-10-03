export type TAdmin = {
  adminId: string;
  firstName: string;
  lastName: string;
  email: string;
};
export type LoginType = 'HYBRID' | 'SAML' | 'PASSWORD';

export type PermissionType = 'READ' | 'WRITE' | 'HIDE';

export type ServiceList = {
  name: string;
  serviceListId: string;
};

export type Role = {
  colorCode: string;
  name: string;
  position: number;
  roleId: string;
};
export type RoleAndServiceList = {
  name: string;
  permission: PermissionType;
  roleId: string;
  roleServiceListId: string;
  serviceList: ServiceList;
  serviceListId: string;
};

export type RoleCategory =
  | 'ADMIN'
  | 'GENERAL'
  | 'PHARMACY'
  | 'CLINICAL'
  | 'USER';

export type RBAC = {
  [key: string]: PermissionType | string | RoleCategory;
} & Role & {
    roleServiceList: RoleAndServiceList[];
  };

export type User = {
  email: string;
  firstName: string;
  lastName: string;
};

export type Facility = {
  address: string;
  externalFacilityId: string;
  facilityId: string;
  facilityName: string;
  population: number;
};
export type Admin = User & {
  adminId: string;
  facility: Facility[];
  phone: number | null;
  loginType: LoginType;
  role: RBAC[];
  signature: string | null;
  roleId?: string[];
  facilityId?: string[];
  isDeleted?: boolean;
};

export type UserFormType = User & {
  roleId: string[];
  facilityId: string[];
};

export type UserFilters = {
  name: string;
  role: string[];
  facility: string[];
};

export type Action = 'add' | 'edit' | 'delete';
