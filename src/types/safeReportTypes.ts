import { Admin, Facility, TAdmin } from './adminTypes';

export type TReportData = {
  admin: Admin;
  adminId: string;
  assignees: Admin[];
  comment: any[];
  createdAt: string;
  description: string;
  facilityId: string;
  facility: Facility;
  isAnonymous: boolean;
  type: string;
  owner: Admin;
  reportId: string;
  safeReportId: string;
  status: 'UNDER_INVESTIGATION' | 'PENDING' | 'IN_REVIEW' | 'CLOSED';
  safeReport: TSafeReportData;
  safeFacilityChecklist: string[];
  safeReportEventLocation: any[];
  closedByAdminId: string;
  closedByAdmin: Admin;
};

export type TSafeReportData = {
  safeReportId: string;
  eventType: string;
  patientName: string;
  date: string;
  time: string;
  severityType: string;
  nearMissType: string;
  isPatientHarmed: boolean;
  sbarrSituation: string;
  sbarrBackground: string;
  sbarrAction: string;
  sbarrRecommendation: string;
  sbarrResult: string;
  interventionDescription: string;
  involvedParty: string;
  isFinding: boolean;
  findings: string;
  involvedPartyText: string;
  detail: string;
};

export type TSafeReportEventLocations = {
  description: string;
  location:
    | 'INTAKE'
    | 'MEDICAL_UNIT_INFIRMARY'
    | 'CLINIC'
    | 'HOUSING_UNIT'
    | 'MEDICATION_CART';
  safeEventLocationId: string;
  safeReportEventLocationId: string;
  safeReportId: string;
};

export type TSafeAssignmentComment = {
  admin: Admin;
  adminId: string;
  comment: string;
  safeAssignmentCommentId: string;
  safeReportId: string;
  createdAt: string;
};

export type TSafeRportFilters = {
  fromDate?: Date | string;
  toDate?: Date | string;
  reportType?: string;
  status?: string;
  text?: string;
};
