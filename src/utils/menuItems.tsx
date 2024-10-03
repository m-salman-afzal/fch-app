import Image from 'next/image';

import ClockCircle from '@/assets/icons/inventoryHistory/clockCircle.svg';
import AdminIcon from '@/assets/icons/sideMenu/Administration.svg';
import FileIcon from '@/assets/icons/sideMenu/Bridge Therapy.svg';
import CartFulfillmentIcon from '@/assets/icons/sideMenu/cartFulfillment.svg';
import CartIcon from '@/assets/icons/sideMenu/cartIcon.svg';
import CartRestock from '@/assets/icons/sideMenu/cartRestock.svg';
import CentralSupplyIcon from '@/assets/icons/sideMenu/centralSupplyIcon.svg';
import CheckListIcon from '@/assets/icons/sideMenu/checkList.svg';
import ClipBoardIcon from '@/assets/icons/sideMenu/clipboard.svg';
import ControlsLogbookIcon from '@/assets/icons/sideMenu/controlsLogbook.svg';
import CubeIcon from '@/assets/icons/sideMenu/cube.svg';
import DashboardIcon from '@/assets/icons/sideMenu/Dashboard.svg';
import FileManager from '@/assets/icons/sideMenu/fileManager.svg';
import CommsIcom from '@/assets/icons/sideMenu/global.svg';
import PlaceIcon from '@/assets/icons/sideMenu/hospital.svg';
import LogsIcon from '@/assets/icons/sideMenu/Logs.svg';
import PillIcon from '@/assets/icons/sideMenu/pills.svg';
import ShieldIcon from '@/assets/icons/sideMenu/shield.svg';
import WarningIcon from '@/assets/icons/sideMenu/warn.svg';

import { FOMMULARY_AUTH_ROUTES } from './constants';

export type DashboardMenuItem = {
  featureName: string;
  label: string;
  url: string;
  icon: any;
  backendUrl: string[];
};

export const MEDICAL_ITEMS: DashboardMenuItem[] = [
  {
    featureName: 'serviceDisruption',
    label: 'Service Disruption',
    url: '/serviceDisruption',
    icon: WarningIcon,
    backendUrl: ['serviceDisruptions']
  },
  {
    featureName: 'safeReporting',
    label: 'SAFE & Issue Reporting',
    url: '/safeReporting',
    icon: ShieldIcon,
    backendUrl: [
      'reports',
      'reportHistory',
      'safeReportInvestigations',
      'safeReportReviews'
    ]
  },
  {
    featureName: 'medicationLists',
    label: 'Downtime Medpass',
    url: '/medicationLists',
    icon: PillIcon,
    backendUrl: ['medicationLists']
  }
];

export const PHARMACY_ITEMS: DashboardMenuItem[] = [
  {
    featureName: 'formulary',
    label: 'Formulary',
    url: '/formulary',
    icon: ClipBoardIcon,
    backendUrl: [
      FOMMULARY_AUTH_ROUTES.CONTROLLED,
      FOMMULARY_AUTH_ROUTES.NON_CONTROLLED
    ]
  },
  {
    featureName: 'inventory',
    label: 'Inventory',
    url: '/inventory',
    icon: CubeIcon,
    backendUrl: ['inventory']
  },
  {
    featureName: 'inventoryHistory',
    label: 'Inventory History',
    url: '/inventoryHistory',
    icon: ClockCircle,
    backendUrl: ['inventoryHistory']
  },
  {
    featureName: 'centralSupply',
    label: 'Central Supply',
    url: '/centralSupply',
    icon: CentralSupplyIcon,
    backendUrl: ['inventory']
  },
  {
    featureName: 'carts',
    label: 'Cart Assignment',
    url: '/carts',
    icon: CartIcon,
    backendUrl: ['carts']
  },
  {
    featureName: 'cartRestock',
    label: 'Cart Restock',
    url: '/cartRestock',
    icon: CartRestock,
    backendUrl: ['cartRequestForms', 'referenceGuide']
  },
  {
    featureName: 'cartFulfillment',
    label: 'Cart Fulfillment',
    url: '/cartFulfillment',
    icon: CartFulfillmentIcon,
    backendUrl: ['cartRequestDrugs']
  },
  {
    featureName: 'controlsLogbook',
    label: 'Controls Logbook',
    url: '/controlsLogbook',
    icon: ControlsLogbookIcon,
    backendUrl: ['controlLogBookAdminister', 'perpetualInventory']
  },
  {
    featureName: 'bridgeTherapy',
    label: 'Bridge Therapy',
    url: '/bridgeTherapy',
    icon: FileIcon,
    backendUrl: ['bridgeTherapy']
  }
];

export const ADMIN_MENU_ITEMS: DashboardMenuItem[] = [
  {
    featureName: 'notificationsAndTasks',
    label: 'Notifications & Tasks',
    url: '/notificationsAndTasks',
    icon: DashboardIcon,
    backendUrl: ['notificationsAndTasks']
  },
  {
    featureName: 'admins',
    label: 'Administration',
    url: '/admins',
    icon: AdminIcon,
    backendUrl: ['admins']
  },
  {
    featureName: 'facilities',
    label: 'Facilities',
    url: '/facilities',
    icon: PlaceIcon,
    backendUrl: ['facilities']
  },
  {
    featureName: 'facilityChecklist',
    label: 'Facility Checklist',
    url: '/facilityChecklist',
    icon: CheckListIcon,
    backendUrl: ['facilityChecklist']
  },
  {
    featureName: 'communication',
    label: 'Communication',
    url: '/communication',
    icon: CommsIcom,
    backendUrl: ['communication']
  },
  {
    featureName: 'fileManager',
    label: 'File Manager',
    url: '/fileManager',
    icon: FileManager,
    backendUrl: ['files']
  },
  {
    featureName: 'logs',
    label: 'Logs',
    url: '/logs',
    icon: LogsIcon,
    backendUrl: ['auditLog']
  }
];

export const MENU_ITEMS = [
  ...MEDICAL_ITEMS,
  ...PHARMACY_ITEMS,
  ...ADMIN_MENU_ITEMS
];
