export type TPerpetualInventoryFilters = {
  cartId?: string;
  text?: string;
};

export type TPerpetualInventory = {
  perpetualInventoryId: string;
  rowNumber: number;
  controlledId: string;
  createdAt: string;
  tr: string;
  rx: string;
  name: string;
  patientName: string;
  providerName: string;
  staffSignature: string;
  quantityAllocated: number;
  isModified: boolean;
  isPatientSpecific: boolean;
  cartRequestDeductionId: string;
  facilityId: string;
  controlledDrugId: string;
  cartId: string;
  staffName: string;

  deductionType?: string;
  perpetualInventoryDeduction: TPerpetualInventoryDeduction[];
};

export type TPerpetualInventoryDeduction = {
  perpetualInventoryDeductionId: string;
  patientName: string;
  providerName: string;
  comment: string;
  type: string;
  perpetualInventoryId: string;
  date: string;
  time: string;
  adminId: string;
  admin: any;
  quantityDeducted: number;
  deductionType: string;
  dateTime: string;
  perpetualInventory: TPerpetualInventory;
  adminName: string;
  adminSignature: string;
  witnessName: string;
  witnessSignature: string;
  nurseName: string;
  nurseSignature: string;
  signatureImages: {
    adminSignature: string;
    witnessSignature: string;
    nurseSignature?: string;
  };
};

export type TSignature = {
  name?: string;
  signatureUrl?: string;
  isPerpetualInventory?: boolean;
  signatureType?: string;
};
