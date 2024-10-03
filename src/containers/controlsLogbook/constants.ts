import { TControlLogBookScreenKeys } from '@/types/controlLogbookTypes';

export const paginationInitialValues = {
  currentPage: 1,
  perPage: 20,
  totalPages: undefined,
  totalItems: undefined
};

export const filterInitialValues = {
  text: ''
};

export const CONTROLS_LOGBOOK_SCREENS: {
  [key in TControlLogBookScreenKeys]: string;
} = {
  perpetualInventory: 'Perpetual Inventory',
  archive: 'Archive',
  shiftCount: 'Shift Count',
  discrepancyLogs: 'Discrepancy & Edit Logs',
  cartInventory: 'Cart Inventory'
} as const;

export const PERPETUAL_INVENTORY_DEDUCTION_TYPES = {
  DOSE_ADMINISTERED: 'DOSE_ADMINISTERED',
  WASTED: 'WASTED',
  DESTROYED: 'DESTROYED',
  TRANSFERRED: 'TRANSFERRED',
  RETURNED_TO_PATIENT: 'RETURNED_TO_PATIENT',
  RETURNED_TO_PROPERTY: 'RETURNED_TO_PROPERTY'
};

export const CSV_HEADERS = {
  PERPETUAL_INVENTORY: [
    {
      key: 'cart',
      label: 'cart'
    },

    {
      key: 'rowNumber',
      label: 'rowNumber'
    },
    {
      key: 'name',
      label: 'drug'
    },
    {
      key: 'controlledId',
      label: 'controlledId'
    },
    {
      key: 'tr/rx',
      label: 'tr/rx'
    },
    {
      key: 'patientName',
      label: 'patientName (PS)'
    },
    {
      key: 'providerName',
      label: 'providerName (PS)'
    },
    {
      key: 'createdAt',
      label: 'dateReceived'
    },
    {
      key: 'staffName',
      label: 'staffName (1st level)'
    },
    {
      key: 'quantityAllocated',
      label: 'qtyOH'
    },
    {
      key: 'dateTime',
      label: 'date/time'
    },
    {
      key: 'deductionPatientName',
      label: 'patientName (Stock)'
    },
    {
      key: 'deductionProviderName',
      label: 'providerName (Stock)'
    },
    {
      key: 'doseAdministered',
      label: 'doseAdmin'
    },
    {
      key: 'wasted',
      label: 'wasted'
    },
    {
      key: 'destroyed',
      label: 'destroyed'
    },
    {
      key: 'transferred',
      label: 'transferred'
    },

    {
      key: 'returned',
      label: 'returned'
    },

    {
      key: 'adminBy',
      label: 'adminBy'
    },

    {
      key: 'adminName',
      label: 'staffName (2nd level)'
    },

    {
      key: 'witnessName',
      label: 'witnessName'
    }
  ]
};

export const CART_INVENTORY_TABS = {
  CART_INVENTORY: 'inventory',
  LOGS: 'logs'
};

export const CART_INVENTORY_TABS_OPTIONS = [
  {
    label: 'Cart Inventory',
    key: CART_INVENTORY_TABS.CART_INVENTORY,
    value: CART_INVENTORY_TABS.CART_INVENTORY
  },
  {
    label: 'Logs',
    key: CART_INVENTORY_TABS.LOGS,
    value: CART_INVENTORY_TABS.LOGS
  }
];
export const PERPETUAL_SIGNATURE_TYPES = {
  STAFF_SIGNATURE: 'STAFF_SIGNATURE',
  ADMIN_SIGNATURE: 'ADMIN_SIGNATURE',
  WITNESS_SIGNATURE: 'WITNESS_SIGNATURE'
};
