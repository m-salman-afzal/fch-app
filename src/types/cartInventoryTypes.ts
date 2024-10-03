export type TCartInventoryLogsFilterTypes = {
  fromDate?: string | Date;
  toDate?: string | Date;
  cart?: string;
};

export type TCartInventory = {
  name: string;
  isPatientSpecific: boolean;
  qtyOh: number;
  rowNumber: 4;
  rx: string;
  tr: string;
};

export type TCartInventoryLogsSubmit = {
  countedBySignature: string;
  witnessSignature: string;
  comment: string;
  witnessName: string;
  countedBy: string;
};

export type TCartInventoryLogs = {
  cart: string;
  cartInventoryLogsId: string;
  comment: string;
  countedBy: 4;
  countedBySignature: string;
  createdAt: string;
  facilityId: string;
  witnessName: string;
  witnessSignature: string;
};
