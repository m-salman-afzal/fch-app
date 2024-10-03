import { TAdmin } from './adminTypes';

export type TCentralSupplyLogs = {
  centralSupplyLog: {
    admin: TAdmin;
    adminId: string;
    centralSupplyLogId: string;
    createdAt: string;
    facilityId: string;
    orderedQuantity: number;
  };
};

export type TOrderedUnits = {
  orderedQuantityMin: number;
  orderedQuantityMax: number;
  calculatedOrderedQuantityMax: number;
  calculatedOrderedQuantityMin: number;
};

export type TCentralSupplyFilters = {
  isFormulary?: string;
  isControlled?: string;
  fromDate?: string;
  toDate?: string;
  orderedQuantityMin?: number;
  orderedQuantityMax?: number;
};
