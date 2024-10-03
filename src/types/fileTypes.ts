import { TAdmin } from './adminTypes';

export type TFile = {
  fileId: string;
  fileName: string;
  fileExtension: string;
  repository: string;
  process: string;
  status: string;
  isEf: boolean;
  facilityName: string;
  info: {
    addedCount: number;
    updatedCount: number;
    removedCount: number;
    failedCount: number;
    inventoryQuantity: number;
    totalUnits: number;
    drugCount: number;
  };
  createdAt: string;
  admin?: TAdmin;
};

export type TFileFilter = {
  toDate?: string;
  fromDate?: string;
  status?: string;
  facility?: string;
};
