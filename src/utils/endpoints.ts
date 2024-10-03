import {
  ADMIN_SETTING_URL,
  ADMIN_URL,
  API_BASE_URL,
  BRIDGE_THERAPY,
  CART_INVENTORY,
  CART_REQUEST_DRUGS_URL,
  CART_REQUEST_FORM,
  CART_REQUEST_LOGS,
  CARTS_URL,
  CONTROL_LOG_BOOK_ADMINISTER,
  FILE_URL,
  FORMULARY_URL,
  INVENTORY_HISTORY_URL,
  INVENTORY_URL,
  MEDICATIONS_URL,
  NOTIFICATIONS_AND_TASKS_URL,
  PERPETUAL_INVENTORY,
  REFERENCE_GUIDE,
  REPORT_HISTORY_URL,
  REPORTS_URL,
  ROLE,
  ROLESLIST,
  SAFE_REPORT_INVESTIGATIONS_URL,
  SAFE_REPORT_REVIEWS_URL,
  SERVICE_DISRUPTION_PATIENTS_URL,
  SERVICE_DISRUPTION_URL
} from './urls';

// * Safe Report
export const getReportsUrl = () => {
  return `${API_BASE_URL}${REPORTS_URL}`;
};

export const getReportHistoryUrl = () => {
  return `${API_BASE_URL}${REPORT_HISTORY_URL}`;
};

export const getSafeReportInvestigationsUrl = () => {
  return `${API_BASE_URL}${SAFE_REPORT_INVESTIGATIONS_URL}`;
};

export const getSafeReportReviewsUrl = () => {
  return `${API_BASE_URL}${SAFE_REPORT_REVIEWS_URL}`;
};

// * Service Disruption
export const getServiceDisruptionUrl = () => {
  return `${API_BASE_URL}${SERVICE_DISRUPTION_URL}`;
};

export const getServiceDisruptionPatientsUrl = () => {
  return `${API_BASE_URL}${SERVICE_DISRUPTION_URL}/${SERVICE_DISRUPTION_PATIENTS_URL}`;
};

export const bulkUpsertServiceDisruptionUrl = () => {
  return `${API_BASE_URL}${SERVICE_DISRUPTION_URL}/bulkUpsert`;
};

export const getDowntimeMedpassUrl = () => {
  return `${API_BASE_URL}${MEDICATIONS_URL}`;
};

export const getDowntimeMedpassLastUpdateUrl = () => {
  return `${API_BASE_URL}${MEDICATIONS_URL}/lastUpdate`;
};

// * File
export const postFileUrl = () => {
  return `${API_BASE_URL}${FILE_URL}/`;
};

export const getFileUrl = () => {
  return `${API_BASE_URL}${FILE_URL}/`;
};

export const downloadFileUrl = (fileId: string) => {
  return `${API_BASE_URL}${FILE_URL}/download/${fileId}`;
};

// * Admin
export const getAllAdminsUrl = () => {
  return `${API_BASE_URL}${ADMIN_URL}`;
};

export const getAllRolesUrl = () => {
  return `${API_BASE_URL}${ROLE}`;
};

export const getRolesServiceListUrl = () => {
  return `${API_BASE_URL}${ROLESLIST}`;
};

export const addAdminUrl = () => {
  return `${API_BASE_URL}${ADMIN_URL}/add`;
};

export const updateAdminUrl = (adminId: string) => {
  return `${API_BASE_URL}${ADMIN_URL}/edit/${adminId}`;
};

export const bulkUpsertAdminUrl = () => {
  return `${API_BASE_URL}${ADMIN_URL}/bulkUpsert`;
};

// * User Setting
export const updateUserSettingUrl = (userSettingId: string) => {
  return `${API_BASE_URL}${ADMIN_SETTING_URL}/${userSettingId}`;
};

// * Formulary
export const bulkUpsertFormularyUrl = () => {
  return `${API_BASE_URL}${FORMULARY_URL}/bulkUpsert`;
};

// * Inventory
export const bulkUpsertInventoryUrl = () => {
  return `${API_BASE_URL}${INVENTORY_URL}/bulkUpsert`;
};

//Formulary Levels
export const bulkUpsertFormularylevelsUrl = () => {
  return `${API_BASE_URL}${INVENTORY_URL}/formularyLevels/bulkUpsert`;
};

// Central Supply
export const centralSupplyLogsUrl = () =>
  `${API_BASE_URL}${INVENTORY_URL}/centralSupply/logs`;

export const centralSupplyLogDrugsUrl = (id: string) =>
  `${API_BASE_URL}${INVENTORY_URL}/centralSupply/logDrugs/${id}`;

export const centralSupplyOrderedUnitsUrl = () =>
  `${API_BASE_URL}${INVENTORY_URL}/centralSupply/orderedQuantity`;

export const getcartUrl = () => {
  return `${API_BASE_URL}${CART_REQUEST_FORM}/allCarts`;
};

export const getCartRequestForm = () => {
  return `${API_BASE_URL}${CART_REQUEST_FORM}`;
};

export const getCartRequestLogsUrl = () => {
  return `${API_BASE_URL}referenceGuide/${CART_REQUEST_LOGS}`;
};

export const getCartRequestLogsExportUrl = () => {
  return `${API_BASE_URL}referenceGuide/cartRequestDrugs`;
};

export const getReferenceGuideUrl = () => {
  return `${API_BASE_URL}${REFERENCE_GUIDE}`;
};

export const bulkUpsertCartUrl = () => {
  return `${API_BASE_URL}${CART_REQUEST_DRUGS_URL}/bulkUpsert`;
};

export const getNotificationUrl = () => {
  return `${API_BASE_URL}${NOTIFICATIONS_AND_TASKS_URL}`;
};

export const getNotificationFacilitiesUrl = () => {
  return `${API_BASE_URL}${NOTIFICATIONS_AND_TASKS_URL}/facilities`;
};

export const archiveNotificationUrl = () => {
  return `${API_BASE_URL}${NOTIFICATIONS_AND_TASKS_URL}/archive`;
};

export const markAsReadNotificationUrl = () => {
  return `${API_BASE_URL}${NOTIFICATIONS_AND_TASKS_URL}/markAsRead`;
};

export const downloadCentralSupplyLogsUrl = () =>
  `${API_BASE_URL}${INVENTORY_URL}/centralSupply/download`;

export const getBridgeTherapyAdmins = () => {
  return `${API_BASE_URL}${BRIDGE_THERAPY}/bridgeTherapyAdmins`;
};

export const getInventoryHistoryList = () => {
  return `${API_BASE_URL}${INVENTORY_HISTORY_URL}/`;
};

export const getPerpetualInventoryUrl = () => {
  return `${API_BASE_URL}${PERPETUAL_INVENTORY}`;
};

export const addPerpetualInventoryDeductionUrl = () => {
  return `${API_BASE_URL}${PERPETUAL_INVENTORY}/addDeduction`;
};

export const addStaffSignatureUrl = () => {
  return `${API_BASE_URL}${PERPETUAL_INVENTORY}/addSignature`;
};

export const getPerpetualInventorySignatureUrl = () => {
  return `${API_BASE_URL}${PERPETUAL_INVENTORY}/getSignature`;
};

export const getPerpetualInventoryCartsUrl = () => {
  return `${API_BASE_URL}${PERPETUAL_INVENTORY}/getCarts`;
};

export const getCartsUrl = () => {
  return `${API_BASE_URL}${CARTS_URL}/all`;
};

export const getAllPerpetualInventoryUrl = () => {
  return `${API_BASE_URL}${PERPETUAL_INVENTORY}/getAll`;
};

export const getAllCartInventoryUrl = () => {
  return `${API_BASE_URL}${CONTROL_LOG_BOOK_ADMINISTER}/${CART_INVENTORY}`;
};

export const getAllCartInventoryLogUrl = () => {
  return `${API_BASE_URL}${CONTROL_LOG_BOOK_ADMINISTER}/cartInventoryLogsDrug`;
};

export const removePerpetualInventoryDeductionUrl = (
  perpetualInventoryDeducitonId: string
) => {
  return `${API_BASE_URL}${PERPETUAL_INVENTORY}/deductions/${perpetualInventoryDeducitonId}`;
};

export const editPerpetualInventoryDeductionUrl = (
  perpetualInventoryDeducitonId: string
) => {
  return `${API_BASE_URL}${PERPETUAL_INVENTORY}/deductions/${perpetualInventoryDeducitonId}`;
};

export const getDiscrepancyLogsUrl = () => {
  return `${API_BASE_URL}${PERPETUAL_INVENTORY}/discrepancyLogs`;
};
