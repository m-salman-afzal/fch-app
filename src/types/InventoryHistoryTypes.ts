export type TInventoryHistoryDateFilters = {
  dateFrom?: string | Date;
  dateTo?: string | Date;
};

export type TInventoryHistory = {
  inventoryHistoryId: string;
  facilityId: string;
  createdAt: string;
};
