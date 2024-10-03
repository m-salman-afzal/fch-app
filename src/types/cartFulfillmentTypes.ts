import { Admin } from './adminTypes';
import { TCartData } from './cartTypes';
import { TPaginatedData } from './commonTypes';
import { Formulary } from './formularyTypes';

export type TCartRequestLog = {
  requestLogType: string;
  cartRequestLogId: string;
  type: string;
  canUndo: string;
  controlledType: string;
  controlledId?: string;
  isControlled?: boolean;
  providerName: string;
  receiverName: string;
  receiverSignature: string;
  witnessName: string;
  witnessSignature: string;
  cartId: string;
  adminId: string;
  facilityId: string;
  createdAt: string;
  drugCount: number;
  totalUnit: number;
  admin: Admin;
  cart: TCartData;
};

export type TCartRequestDrug = {
  dateTime: string;
  username: string;
  cart: string;
  drug: string;
  drugClass: string;
  package: string;
  min: number;
  max: number;
  packageQuantity: number;
  isControlled: boolean;
  totalUnits: number;
  tr?: string;
  controlledId?: string;
  unitsPkg?: number;
};

type TCartfulfillment = {
  packageQuantity: number;
  totalUnits: number;
  pickStatus: 'PROCESSED' | 'UNPROCESSED';
  allocationStatus: 'FULFILLED' | 'UNFULFILLED';
  facilityId: string;
};

export type TCartFullfillmentPick = TCartfulfillment & {
  name: string;
  formularyId: string;
  isDrugFound: boolean;
  cartRequestDrugIds: string[];
  pickedAt: string;
  pickedByAdminId: string;
  pickedByAdmin: Admin;
  containsActive: boolean;
  facilityId: string;
};

export type TCartAllocation = TCartfulfillment & {
  createdAt: string;
  cart: TCartData;
  formulary: Formulary;
  formularyId: string;
  orderedByAdmin: Admin;
  cartId: string;
  cartRequestDrugId: string;
  cartRequestFormId: string;
  cartRequestLogId: string;
  containsActive: boolean;
  pickedByAdminId: string;
  referenceGuideDrugId: string;
  allocatedByAdmin: Admin;
  allocatedByAdminId: string;
  allocatedAt: string;
};

export type TCartAllocationControlledForm = {
  cartRequestDrugId: string[];
  controlledId?: string;
  tr?: string;
  providerName: string;
  receiverName: string;
  witnessName: string;
  receiverSignatureImage: string;
  witnessSignatureImage: string;
  cart?: string;
  packageQuantity?: number;
  totalUnits?: number;
  drug?: string;
};

type TDateRange = {
  toDate?: string;
  fromDate?: string;
};

export type TAllocationFilters = TDateRange & {
  cartId?: string;
  allocatedByAdminId?: string;
  adminId?: string;
};

export type TRestockLogFilters = TDateRange & {
  userId?: string;
  status?: string;
};

export type TCartFilterPaginatedData = TPaginatedData<
  Pick<TCartData, 'cartId' | 'cart'>
>;

export type TControlledIds = {
  controlledId: string;
  tr: string;
  controlledDrugId: string;
};
