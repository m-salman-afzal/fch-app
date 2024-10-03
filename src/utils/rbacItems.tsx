import { TRbac } from '@/types/permissionTypes';

export const ADMIN_RBAC_ITEMS: TRbac = {
  notificationsAndTasks: 'Notifications & Tasks',
  administration: {
    label: 'Administration',
    children: {
      admins: 'User Management',
      roleServiceList: 'Permissions',
      roles: 'Roles'
    }
  },
  facilitiesParent: {
    label: 'Facilities',
    children: {
      facilities: 'Facilities',
      facilityUnits: 'Facility Units',
      facilityChecklist: 'Facility Checklist'
    }
  },
  communication: 'Communication',
  files: 'File Manager',
  auditLog: 'Logs'
};

export const MEDICAL_RBAC_ITEMS: TRbac = {
  serviceDisruptions: 'Service Disruption',
  safeReports: {
    label: 'SAFE & Issue Report',
    children: {
      reports: 'SAFE & Issue Report',
      reportHistory: 'SAFE & Issue History',
      safeReportInvestigations: 'SAFE & Issue Investigation',
      safeReportReviews: 'SAFE & Issue Review'
    }
  },
  medicationLists: 'Downtime Medpass',
  historyPhysical: 'History & Physical'
};

export const PHARMACY_RBAC_ITEMS: TRbac = {
  formulary: {
    label: 'Formulary',
    children: {
      formularyControlled: 'Formulary Controlled',
      formularyNonControlled: 'Formulary Non-Controlled'
    }
  },
  inventoryParent: {
    label: 'Inventory',
    children: {
      inventory: 'Inventory & Central Supply',
      inventoryHistory: 'Inventory History'
    }
  },
  carts: 'Cart Assignment',
  cartRestock: {
    label: 'Cart Restock',
    children: {
      referenceGuide: 'Reference Guide & Logs',
      cartRequestForms: 'Request Form',
      cartRequestDrugs: 'Fulfillment'
    }
  },
  controlsLogbook: {
    label: 'Controls Logbook',
    children: {
      controlLogBookAdminister: 'Controls Logbook (Administer/Count)',
      perpetualInventory: 'Controls Logbook (Edit)',
      shiftCountDiscrepancyNotifications:
        'Shift Count Discrepancy Notifications'
    }
  },
  bridgeTherapy: 'Bridge Therapy'
};

export const RBAC_ITEMS: TRbac = {
  ...MEDICAL_RBAC_ITEMS,
  ...PHARMACY_RBAC_ITEMS,
  ...ADMIN_RBAC_ITEMS
} as const;

export const getRbacLabel = (rbacName: string) => {
  let flattened: { [key: string]: string } = {};
  for (const rbac in RBAC_ITEMS) {
    if (typeof RBAC_ITEMS[rbac] === 'string') {
      flattened = { ...flattened, [rbac]: RBAC_ITEMS[rbac] };
    } else {
      for (const children in RBAC_ITEMS[rbac].children) {
        flattened = {
          ...flattened,
          [children]: RBAC_ITEMS[rbac].children[children]
        };
      }
    }
  }

  return flattened[rbacName];
};
