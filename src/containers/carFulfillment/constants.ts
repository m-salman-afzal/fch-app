import { ALL_OPTION } from '@/utils/constants';

export const RESTOCKLOGS_TYPES = {
  STANDARD: 'Standard',
  AFTER_HOURS: 'After-hours',
  INITIAL_ALLOCATION: 'Initial Allocation'
};

export const RESTOCKLOGS_STATUS_TYPES = {
  ALLOCATION: 'ALLOCATION',
  PICKED: 'PICK',
  DELETED: 'DELETE',
  AFTER_HOUR: 'AFTER_HOUR',
  INITIAL_ALLOCATION: 'INITIAL_ALLOCATION'
};

export const CART_FULFILLMENT_SCREENS = [
  { label: 'Pick', value: 'pick', key: 'pick' },
  { label: 'Allocation', value: 'allocation', key: 'allocation' },
  { label: 'Restock Logs', value: 'restockLogs', key: 'restockLogs' }
];

export const PICK_TABS = [
  {
    label: 'Unprocessed',
    value: 'unProcessed',
    key: 'unProcessed',
    status: 'UNPROCESSED'
  },
  {
    label: 'Processed',
    value: 'processed',
    key: 'processed',
    status: 'PROCESSED'
  }
];

export const ALLOCATION_TABS = [
  {
    label: 'Non-Controlled',
    value: 'nonControlled',
    key: 'nonControlled',
    status: 'nonControlled'
  },
  {
    label: 'Controlled',
    value: 'controlled',
    key: 'controlled',
    status: 'controlled'
  },
  {
    label: 'Initial Allocation',
    value: 'initialAllocation',
    key: 'initialAllocation',
    status: 'initialAllocation'
  }
];

export const RESTOCK_LOGS_TABS = [
  { label: 'Standard', value: 'standard', key: 'standard', status: 'Standard' },
  {
    label: 'After-hours',
    value: 'afterHours',
    key: 'afterHours',
    status: 'After-hours'
  },
  {
    label: 'Initial Allocation',
    value: 'initialAllocationLogs',
    key: 'initialAllocationLogs',
    status: 'Initial Allocation'
  }
];

export const RESTOCK_LOGS_STANDARD_STATUS = {
  PICKED: 'Picked',
  FULFILLED: 'Fulfilled',
  DELETED: 'Deleted',
  REMOVED_FROM_INVENTORY: 'Removed from Inventory',
  ALLOCATED: 'Allocated'
} as const;

export const STANDARD_RESTOCKLOG_FILTER_STATUS_OPTIONS = [
  ALL_OPTION,
  {
    label: 'Deleted',
    value: 'Deleted',
    key: 'Deleted'
  },
  {
    label: 'Fulfilled',
    value: 'Fulfilled',
    key: 'Fulfilled'
  },
  {
    label: 'Picked',
    value: 'Picked',
    key: 'Picked'
  }
];

export const CSV_HEADERS = {
  PICK: [
    { key: 'dateTime', displayLabel: 'Date Time' },
    { key: 'drug', displayLabel: 'Drug' },
    { key: 'totalUnits', displayLabel: 'Total Units' },
    { key: 'username', displayLabel: 'User' },
    { key: 'isControlled', displayLabel: 'Type' },
    { key: 'status', displayLabel: 'Status' }
  ],
  INITIAL_ALLOCATION_LOG: [
    {
      key: 'dateTime',
      displayLabel: 'Date Time'
    },
    {
      key: 'drug',
      displayLabel: 'Drug'
    },
    {
      key: 'isControlled',
      displayLabel: 'Controlled'
    },
    {
      key: 'controlledId',
      displayLabel: 'Controlled ID'
    },
    {
      key: 'tr',
      displayLabel: 'TR'
    },
    {
      key: 'totalUnits',
      displayLabel: 'Total Units'
    },
    {
      key: 'cart',
      displayLabel: 'Cart'
    },
    {
      key: 'username',
      displayLabel: 'User'
    },
    {
      key: 'type',
      displayLabel: 'Type'
    },
    {
      key: 'status',
      displayLabel: 'Status'
    }
  ],
  FULFILLED_DELETED_NON_CONTROLLED: [
    { key: 'dateTime', displayLabel: 'Date Time' },
    { key: 'drug', displayLabel: 'Drug' },
    { key: 'totalUnits', displayLabel: 'Total Units' },
    { key: 'cart', displayLabel: 'Cart' },
    { key: 'username', displayLabel: 'User' },
    { key: 'isControlled', displayLabel: 'Type' },
    { key: 'status', displayLabel: 'Status' }
  ]
};

export const DRUG_CLASSES = {
  ARV: 'Antiretroviral'
};

export const CONTROLLED_TYPES = {
  STOCK: 'STOCK',
  PATIENT_SPECIFIC: 'PATIENT_SPECIFIC'
};

export const ALLOCATION_STATUS_BACKEND = {
  UNFULFILLED: 'UNFULFILLED',
  FULFILLED: 'FULFILLED',
  NULL: 'null'
};

export const PICK_STATUS_BACKEND = {
  PROCESSED: 'PROCESSED',
  UNPROCESSED: 'UNPROCESSED'
};
