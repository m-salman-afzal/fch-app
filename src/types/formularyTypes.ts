import { Inventory } from './inventoryTypes';

export type Formulary = {
  adminId: string;
  brandName: string;
  drugClass: string;
  drugName: string;
  formularyId: string;
  formulation: string;
  genericName: string;
  id: number;
  isActive: boolean;
  isControlled: boolean;
  isGeneric: boolean;
  max: number;
  min: number;
  name: string;
  package: string;
  parLevel: number;
  release: string;
  strengthUnit: string;
  threshold: number;
  unitsPkg: string;
  key?: string;
  isStock: boolean;
  inventory: Inventory[];
  orderedQuantity?: number;
  totalQuantity: number;
  originalOrderedQuantity?: number;
  isFormulary?: boolean;
  formularyLevel?: any;
};

export type TFormularyFilters = {
  perPage: number;
  currentPage: number;
  name: string;
  isActive: string;
  isControlled: string;
  isFormulary: string;
};
