import { TPagination } from './commonTypes';

export type Inventory = {
  adminId: string;
  controlledId: string;
  expirationDate: string;
  facilityId: string;
  formularyId: string;
  id: number;
  inventoryId: string;
  isActive: boolean;
  isStock: boolean;
  lotNo: string;
  manufacturer: string;
  ndc: string;
  quantity: number;
  controlledDrug: ControlledDrug[];
};

export type TInventoryFilters = {
  controlled: 'true' | 'false' | 'All';
  isFormulary: 'true' | 'false' | 'All';
  depleted: 'All' | 'yes' | 'no';
  status: 'active' | 'inactive' | 'All';
  pending: 'pending' | 'nonPending' | 'All';
  formularyId?: string;
  isStock: 'true' | 'false' | 'All';
};

export type ControlledDrug = {
  controlledId: string;
  tr: string;
  quantity: number;
};

export type TInventoryGetRequest = TPagination & {
  isControlled?: 'true' | 'false' | 'All';
  isFormulary?: 'true' | 'false' | 'All';
  isDepleted?: string;
  isActive?: string;
  pendingOrder?: string;
  formularyId?: string;
  isStock?: 'true' | 'false' | 'All';
};
