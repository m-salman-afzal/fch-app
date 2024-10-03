export type TPermissionWithChildren = {
  label: string;
  children: {
    [key: string]: string;
  };
};

export type TRbacTableChild = {
  [key: string]: string | boolean;
  feature: string;
  isChild: true;
  label: string;
};
export type TRbacTableData = {
  [key: string]: string | TRbacTableChild[] | undefined;
  feature: string;
  children?: TRbacTableChild[];
  label: string;
};

export type TRbac = { [key: string]: string | TPermissionWithChildren };

export type TRbacDependencyCheckOutput = {
  checkFailed: boolean;
  roleId: string;
  serviceDependsOnIds?: {
    serviceDependsOnId: string;
    minimumPermissionDependsOn: string;
  }[];
  serviceDependencyId: string;
  serviceListId: string;
  serviceDependsOnId: string;
  minimumPermission: string;
  minimumPermissionDependsOn: string;
  dependencyOrRelationGroupId: string;
};
