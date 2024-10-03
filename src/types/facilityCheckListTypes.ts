import { Admin } from './adminTypes';
import { SelectOption } from './commonTypes';
import { TFacility } from './facilityTypes';

export type TFacilityCheckListIndexable = {
  [index: string]: TFacilityCheckList;
};

export type TFacilityCheckList = {
  facilityChecklistId: string;
  event: string;
  adminId: string;
  facilityId: string;
  admin?: Admin;
  facilty?: TFacility;
  roleServiceList: any[];
};

export type TFacilityChecklistForm = {
  externalFacilityId: string;
};

export type TSelectedAdmin = SelectOption & {
  event: string;
  roleServiceList: any[];
};
