import { useState } from 'react';
import { Form } from 'antd';

import { TReportData } from '@/types/safeReportTypes';

import { PERMISSIONS_TYPES, SAFE_REPORT_STATUS } from '@/utils/constants';
import {
  getReportHistoryUrl,
  getReportsUrl,
  getSafeReportInvestigationsUrl,
  getSafeReportReviewsUrl
} from '@/utils/endpoints';
import {
  API_BASE_URL,
  FACILITY_CHECKLIST_URL,
  SAFE_REPORT_INVESTIGATIONS_URL,
  SAFE_REPORT_REVIEWS_URL
} from '@/utils/urls';

import useCookies from './useCookies';
import { useFetch } from './useFetch';

const useInvestigateSubmission = (
  getReport: (reportFilters: any) => void = () => {},
  reportFilters?: any
) => {
  const [investigationForm] = Form.useForm();
  const [reportData, setReportData] = useState<TReportData>({} as TReportData);
  const [investigationFacilityChecklist, setInvestigationCheckList] = useState<
    any[]
  >([]);
  const { getDataFromCookie } = useCookies();
  const { adminId, rbac } = getDataFromCookie();
  const [openInvestigationDrawer, setOpenInvestigationDrawer] =
    useState<boolean>(false);
  const [reassignButtonLoading, setReassignButtonLoading] =
    useState<boolean>(false);
  const { fetchData, updateData, isLoading, setIsLoading } = useFetch();
  const baseUrlGet =
    rbac.safeReportInvestigations === PERMISSIONS_TYPES.HIDE
      ? SAFE_REPORT_REVIEWS_URL
      : SAFE_REPORT_INVESTIGATIONS_URL;
  const baseUrlUpdate =
    rbac.safeReportReviews === PERMISSIONS_TYPES.WRITE
      ? SAFE_REPORT_REVIEWS_URL
      : SAFE_REPORT_INVESTIGATIONS_URL;

  const onSubmitInvestigation = async (
    values: any,
    isDraft?: boolean,
    isIssueReport?: boolean
  ) => {
    try {
      const url = `${API_BASE_URL}${baseUrlUpdate}/${values.reportId}`;
      const reportData = await updateData(url, {
        adminId: adminId,
        safeReport: {
          ...values,
          safeReportId: values.safeReportId,
          safeAssignmentComment: undefined
        },
        status: isDraft
          ? undefined
          : isIssueReport
            ? SAFE_REPORT_STATUS.CLOSED
            : SAFE_REPORT_STATUS.IN_REVIEW,
        safeAssignmentComment: values.safeAssignmentComment,
        safeFacilityChecklist: values.safeFacilityChecklist
      });
      if (!!reportData) {
        setOpenInvestigationDrawer(false);
        await getReport(reportFilters);

        return true;
      }
    } catch (error) {}
  };

  const getCurrentInvestigationReport = async (reportId: string) => {
    try {
      const url = `${API_BASE_URL}${baseUrlGet}/${reportId}`;
      const reportData = await fetchData(url);

      if (!!reportData.reportId) {
        setReportData(reportData);
        setOpenInvestigationDrawer(true);
      }
    } catch (error) {}
  };

  const setFacilityChecklistUrl = () => {
    switch (true) {
      case rbac.reports === PERMISSIONS_TYPES.WRITE:
        return `${getReportsUrl()}/facilityChecklist`;

      case rbac.reportHistory === PERMISSIONS_TYPES.WRITE:
        return `${getReportHistoryUrl()}/facilityChecklist`;

      case rbac.safeReportInvestigations === PERMISSIONS_TYPES.WRITE:
        return `${getSafeReportInvestigationsUrl()}/facilityChecklist`;

      case rbac.safeReportReviews === PERMISSIONS_TYPES.WRITE:
        return `${getSafeReportReviewsUrl()}/facilityChecklist`;

      default:
        return `${API_BASE_URL}${FACILITY_CHECKLIST_URL}`;
    }
  };
  const getFacilityCheckList = async () => {
    try {
      setReassignButtonLoading(true);
      const tempList = await fetchData(setFacilityChecklistUrl());
      if (tempList?.facilityChecklist?.length > 0) {
        setInvestigationCheckList(
          tempList.facilityChecklist.sort(
            (a: any, b: any) => a.priority - b.priority
          )
        );
      }

      setReassignButtonLoading(false);
    } catch (error) {}
  };

  const changeReportStatus = async (
    reportId: string,
    commentText: string,
    status: string
  ) => {
    try {
      const url = `${API_BASE_URL}${baseUrlUpdate}/${reportId}`;
      const reportData = await updateData(url, {
        reportId: reportId,
        adminId: adminId,
        status: status,
        safeAssignmentComment:
          commentText.length === 0 ? undefined : commentText,
        safeReport: {
          safeReportId: '324234'
        }
      });
      if (!!reportData) {
        setOpenInvestigationDrawer(false);
        await getReport(reportFilters);
      }
    } catch (error) {}
  };

  return {
    investigationForm,
    onSubmitInvestigation,
    getCurrentInvestigationReport,
    reportData,
    openInvestigationDrawer,
    getFacilityCheckList,
    reassignButtonLoading,
    setReassignButtonLoading,
    investigationFacilityChecklist,
    changeReportStatus,
    setOpenInvestigationDrawer,
    isLoading,
    setIsLoading
  };
};

export default useInvestigateSubmission;
