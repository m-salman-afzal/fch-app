export type TShiftCountTabs = {
  key: string;
  value: string;
  label: string;
};

export type TShiftCountData = {
  key?: string;
  cartId: string;
  facilityId: string;
  rowNumber: number;
  controlledId: string;
  tr: string;
  rx: string;
  name: string;
  perpetualInventoryId: string;
  controlledDrugId: string;
  quantityAllocated: number;
  inputQuantity?: number;
  isError?: boolean;
  isDiscrepancyFlag?: boolean;
};

export type TShiftCountLogDrugsData = Omit<
  TShiftCountData,
  | 'cartId'
  | 'perpetualInventoryId'
  | 'quantityAllocated'
  | 'facilityId'
  | 'isError'
  | 'isDiscrepancyFlag'
> & {
  countedQuantity: number;
  quantityOnHand: number;
  shiftCountLogDrugId: string;
  shiftCountLogId: string;
  key?: string;
};

export type TShiftCountFilter = {
  fromDate?: string;
  toDate?: string;
  cartId?: string;
};

export type TShiftCountLogsData = {
  key?: string;
  shiftCountLogId: string;
  receiverName: string;
  receiverSignature: string;
  cartName: string;
  handOffName: string;
  handOffSignature: string;
  createdAt: string;
  comment: string;
  cartId: string;
  facilityId: string;
  isDiscrepancy: boolean;
};

export type TShiftCountComment = {
  commentText: string;
  commentDate: string;
};

export type TShiftCountSubmitForm = {
  cartId: string;
  facilityId: string;
  comment: string;
  handOffName: string;
  handOffSignature: string;
  receiverName: string;
  receiverSignature: string;
  shiftCountLogDrugs: Omit<
    TShiftCountLogDrugsData,
    'key' | 'shiftCountLogId' | 'shiftCountLogDrugId'
  >[];
};
