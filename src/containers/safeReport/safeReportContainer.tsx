import React, { FC, useCallback, useEffect, useState } from 'react';
import { Col, Form, Grid, Row, Typography } from 'antd';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConfirm } from 'vs-design-components';

import { TPagination } from '@/types/commonTypes';
import { TReportData, TSafeRportFilters } from '@/types/safeReportTypes';

import FilterTags from '@/components/common/filterTags/filterTags';
import { SafeReportFilterLayout } from '@/components/safeReport/layout/safeReportFilterLayout';
import { SafeReportHistoryLayout } from '@/components/safeReport/layout/safeReportHistoryLayout';
import { SafeReportNavigationLayout } from '@/components/safeReport/layout/safeReportNavigationLayout';
import { useSafeReportNavigationStyle } from '@/components/safeReport/styles/useSafeReportNavigationStyle';

import DELETEICON from '@/assets/icons/common/deleteModal.svg';
import useCookies from '@/hooks/useCookies';
import { useFacility } from '@/hooks/useFacility';
import { useFetch } from '@/hooks/useFetch';
import { useCommonStyles } from '@/styles/useCommonStyles';
import {
  ALL,
  ALL_OPTION,
  DEFAULT_PAGE_SIZE,
  PERMISSIONS_TYPES,
  SAFE_REPORT_EVENT_SEVERITY_SCREENS,
  SAFE_REPORT_STATUS,
  SAFE_REPORT_TYPE_OPTIONS
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInUTC,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import {
  getReportHistoryUrl,
  getReportsUrl,
  getSafeReportInvestigationsUrl,
  getSafeReportReviewsUrl
} from '@/utils/endpoints';
import { getFitlerValuesAndFilterAll } from '@/utils/getFiltersValuesAndFilterAll';
import { pxToRem } from '@/utils/sharedUtils';
import ShowToast from '@/utils/showToast';
import { API_BASE_URL, FACILITIES_URL, REPORTS_URL } from '@/utils/urls';

const { useBreakpoint } = Grid;

const filterInitialValues = {
  fromDate: undefined,
  toDate: undefined,
  reportType: ALL,
  status: ALL
} as const;

interface Props {}

export const SafeReportContainer: FC<Props> = ({}) => {
  const [reportId, setReportId] = useState<string | null>(
    useSearchParams().get('reportId')
  );
  const tabInUrl = useSearchParams().get('tab');
  const router = useRouter();
  const { getDataFromCookie } = useCookies();
  const [reportTypeModalOpen, setReportTypeModalOpen] = useState(false);
  const admin = getDataFromCookie();
  const { safeReportHeading } = useSafeReportNavigationStyle();
  const size = useBreakpoint();
  const [form] = Form.useForm<TSafeRportFilters>();
  const [editReportFormRef] = Form.useForm();
  const [safeReportFormRef] = Form.useForm();
  const {
    fetchData,
    isLoading,
    postData,
    updateData,
    setIsLoading,
    deleteData
  } = useFetch();
  const [safeFormCurrentStep, setSafeFormCurrentStep] = useState<number>(0);
  const [searchText, setSearchText] = useState('');
  const [showSafeForm, setShowSafeForm] = useState<boolean>(false);
  const [safeReportFormData, setSafeReportFormData] = useState<any>(
    size?.xs
      ? {}
      : {
          date: getFormattedDateNoTimeZone({})
        }
  );
  const [facilities, setFacilities] = useState<any>([]);

  const [safeReportScreen, setSafeReportScreen] = useState(
    SAFE_REPORT_EVENT_SEVERITY_SCREENS.NEARMISS
  );
  const [onScreen, setScreen] = useState(
    (admin.rbac.reports !== PERMISSIONS_TYPES.HIDE ||
      admin.rbac.reportHistory !== PERMISSIONS_TYPES.HIDE) &&
      (!tabInUrl || tabInUrl === 'reportHistory')
      ? 'reportHistory'
      : 'investigationReview'
  );
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const [filteredSafeReport, setFilteredSafeReport] = useState<TReportData[]>(
    []
  );

  const isSmall = window.screen.width <= 576;
  const paginationInitialValues = {
    currentPage: 1,
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  };
  const [pagination, setPagination] = useState<TPagination>(
    paginationInitialValues
  );
  const [filters, setFilters] =
    useState<TSafeRportFilters>(filterInitialValues);
  const { currentFacility } = useFacility({
    admin
  });
  const onChangeScreen = (e: any) => {
    setReportId(null);
    setPagination(paginationInitialValues);
    setScreen(e);
    setFilters(filterInitialValues);
    form.resetFields();
    router.push(`/safeReporting?tab=${e}`);
  };

  const onResetFilter = () => {
    form.resetFields();
    form.setFieldsValue(filterInitialValues);
  };

  const handleSearch = useCallback(
    debounce(async (val: React.SetStateAction<string>) => {
      setSearchText(val);

      await getSafeReport({
        filters: { ...filters, text: val },
        pagination: pagination
      });
    }, 500),

    [filters, onScreen]
  );

  const setFilterOpen = async (value: boolean) => {
    setShowFilterDrawer(value);
  };

  const getAllFacilities = async () => {
    const allFacilities = await fetchData(`${API_BASE_URL}${FACILITIES_URL}`);
    if (allFacilities?.length > 0) {
      setFacilities(
        allFacilities.map((fac: any) => {
          return {
            ...fac,
            label: fac?.facilityName,
            value: fac?.facilityId,
            key: fac?.facilityId
          };
        })
      );
    } else {
      setFacilities([]);
    }
  };

  const getSafeReport = async ({
    filters,
    pagination
  }: {
    filters?: any;
    pagination?: TPagination;
  }) => {
    try {
      setIsLoading(true);
      const searchFilters = {
        ...pagination,
        ...getFitlerValuesAndFilterAll(filters)
      };

      const safeReports = await fetchData(
        onScreen === 'reportHistory'
          ? admin.rbac.reportHistory === PERMISSIONS_TYPES.HIDE
            ? getReportsUrl()
            : getReportHistoryUrl()
          : admin.rbac.safeReportReviews === PERMISSIONS_TYPES.HIDE
            ? getSafeReportInvestigationsUrl()
            : getSafeReportReviewsUrl(),
        searchFilters
      );

      if (safeReports.status === 'error') {
        setFilteredSafeReport([]);
        setPagination(paginationInitialValues);
        setIsLoading(false);

        return;
      }

      setFilteredSafeReport(safeReports.rows);
      setPagination({
        ...(pagination as TPagination),
        totalItems: safeReports.paginationInfo.totalItems,
        totalPages: safeReports.paginationInfo.totalPages
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (reportId) {
      window.history.pushState(null, '', '/safeReporting');
    }
    setSearchText('');
    getSafeReport({
      pagination: pagination
    });
  }, [onScreen]);

  useEffect(() => {
    getAllFacilities();
  }, []);

  const onApplyFilter = async (values: TSafeRportFilters) => {
    setReportId(null);

    const newFilters = {
      ...values,
      fromDate:
        values.fromDate &&
        getFormattedDateInUTC({
          date: values.fromDate,
          format: DATE_FORMATS.YMD
        }),

      toDate:
        values.toDate &&
        getFormattedDateInUTC({
          date: values.toDate,
          format: DATE_FORMATS.YMD
        }),
      status: values.status === ALL ? undefined : values.status
    };

    setFilters(newFilters);

    await getSafeReport({
      filters: {
        ...newFilters,
        text: searchText,
        type: values.reportType === ALL ? undefined : values.reportType
      },
      pagination: pagination
    });
    setShowFilterDrawer(false);
  };

  const onChangePagination = async (page: number, pageSize: number) => {
    const updatedPagination = {
      ...pagination,
      currentPage: page,
      perPage: pageSize
    };

    setPagination(updatedPagination);
    await getSafeReport({ filters: filters, pagination: updatedPagination });
  };

  const handleEditSubmit = async (data: any) => {
    const safeReportData = {
      type: data.eventType[0] === 'OTHER_ISSUE' ? 'ISSUE' : 'SAFE',
      description: data.description,
      safeFacilityChecklist: data?.eventType
        ? data.eventType[0] === 'OTHER_ISSUE'
          ? ['ISSUE_REPORT']
          : data.eventType
        : [],
      isSenderEdit: true,
      safeReportEventLocation: data?.eventLocation?.map((location: any) => {
        return {
          location,
          description:
            location === 'HOUSING_UNIT'
              ? data?.housingUnit
              : location === 'MEDICATION_CART'
                ? data?.cartName
                : location === 'OTHER'
                  ? data?.other
                  : ''
        };
      }),
      safeReport: {
        nearMissType: data.nearMiss,
        sbarrAction: data.action,
        sbarrResult: data.result,
        sbarrSituation: data.situation,
        sbarrBackground: data.background,
        sbarrRecommendation: data.recommendation,
        severityType: data.severityType,
        isPatientHarmed:
          data.severityType === 'NEAR_MISS'
            ? undefined
            : data?.patientHarmed === 'yes'
              ? true
              : false,
        detail: data.detail
      }
    };

    safeReportData.safeReport.severityType =
      safeReportData.safeFacilityChecklist[0] === 'ISSUE_REPORT'
        ? undefined
        : safeReportData.safeReport.severityType;

    setIsLoading(true);

    const res = await updateData(`${getReportsUrl()}/${data.reportId}`, {
      ...safeReportData,
      status: SAFE_REPORT_STATUS.UNDER_INVESTIGATION
    });
    if (res.status === 'error') {
      setIsLoading(false);

      return;
    }
    await getSafeReport({ filters, pagination });
    setIsLoading(false);
  };

  const submitIssueReport = async (data: any) => {
    setIsLoading(true);
    data = { ...data, type: 'ISSUE', isAnonymous: data.isAnonymous ?? false };
    const res = await postData(getReportsUrl(), data);
    if (res.status === 'error') {
      setIsLoading(false);

      return;
    }
    await getSafeReport({ filters, pagination });
    setIsLoading(false);
  };

  const onCloseSafeReportForm = () => {
    safeReportFormRef.resetFields();
    setSafeReportFormData(
      size?.xs
        ? {}
        : {
            date: getFormattedDateNoTimeZone({})
          }
    );
    setSafeReportScreen(SAFE_REPORT_EVENT_SEVERITY_SCREENS.NEARMISS);
    setSafeFormCurrentStep(0);
    setShowSafeForm(false);
  };

  const onChangeFormStepNumber = async (currentStep: number) => {
    if (currentStep < safeFormCurrentStep) {
      setSafeFormCurrentStep(currentStep);
    }
    if (currentStep > safeFormCurrentStep) {
      try {
        await safeReportFormRef.validateFields();
        setSafeReportFormData({
          ...safeReportFormData,
          ...safeReportFormRef.getFieldsValue()
        });
        setSafeFormCurrentStep(currentStep);
      } catch (error) {
        return;
      }
    }
  };

  const onChangeSafeReportFormScreen = (data: any) => {
    setSafeReportScreen(data);
  };

  const onClickBackButton = () => {
    setSafeFormCurrentStep(safeFormCurrentStep - 1);
  };

  const onSubmitSafeReportForm = async (data: any) => {
    setSafeReportFormData({ ...safeReportFormData, ...data });
    if (safeFormCurrentStep < 3) {
      setSafeFormCurrentStep(safeFormCurrentStep + 1);
    }
    if (safeFormCurrentStep === 3) {
      setIsLoading(true);
      const safeReportDTO: Record<string, any> = getSafeReportDTO({
        ...safeReportFormData,
        ...data,
        safeReportScreen
      });

      safeReportDTO.safeReport.severityType =
        safeReportDTO.safeReport.safeFacilityChecklist[0] === 'ISSUE_REPORT'
          ? undefined
          : safeReportDTO.safeReport.severityType;

      safeReportDTO.type =
        safeReportDTO.safeReport.safeFacilityChecklist[0] === 'ISSUE_REPORT'
          ? 'ISSUE'
          : 'SAFE';

      const saveSafeReport = await postData(
        `${API_BASE_URL}${REPORTS_URL}`,
        safeReportDTO
      );
      if (saveSafeReport?.status === 'error') {
        ShowToast(saveSafeReport?.message, 'error', 5);
      } else {
        onCloseSafeReportForm();
        await getSafeReport({ filters, pagination });
      }
      setIsLoading(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    setIsLoading(true);
    const res = await deleteData(`${getReportHistoryUrl()}/${reportId}`);
    if (res.status === 'error') {
      setIsLoading(false);

      return;
    }
    await getSafeReport({ filters, pagination });
    setIsLoading(false);
  };

  const { confirm } = useConfirm();
  const {
    deleteFamilyMemberConfirmIcon,
    deleteFamilyMemberConfirmIconContainer
  } = useCommonStyles();

  const onDeleteReport = (reportId: string) => {
    confirm({
      onOk: async () => {
        await handleDeleteReport(reportId);
      },
      text: (
        <Typography.Paragraph
          style={{
            fontSize: pxToRem(20),
            width: pxToRem(277),
            fontWeight: 600,
            textAlign: 'center',
            marginBlockEnd: 0
          }}
        >
          Are you sure you want to delete this report?
        </Typography.Paragraph>
      ),
      type: 'destructive',
      okText: 'Yes',
      cancelText: 'No',
      icon: (
        <div className={deleteFamilyMemberConfirmIconContainer}>
          <Image
            alt={'MSG'}
            src={DELETEICON}
            className={deleteFamilyMemberConfirmIcon}
            fill
          />
        </div>
      )
    });
  };

  const getSafeReportDTO = (data: any) => {
    return {
      type: 'SAFE',
      facilityId: data?.facilityId,
      isAnonymous: data?.anonymous ? true : false,
      description: data?.subject,
      safeReport: {
        patientName: data?.patientName ? data?.patientName : undefined,
        detail: data?.detail ? data.detail : undefined,
        date: getFormattedDateNoTimeZone({
          date: data?.date,
          format: DATE_FORMATS.YMD
        }),
        time: data?.time
          ? getFormattedDateNoTimeZone({
              date: data?.time,
              format: DATE_FORMATS.HMS_TIME
            })
          : undefined,
        safeFacilityChecklist: !data.eventType
          ? []
          : data?.eventType[0] === 'OTHER_ISSUE'
            ? ['ISSUE_REPORT']
            : data.eventType,
        safeReportEventLocation: data?.eventLocation?.map((location: any) => {
          return {
            location,
            description:
              location === 'HOUSING_UNIT'
                ? data?.housingUnit
                : location === 'MEDICATION_CART'
                  ? data?.cartName
                  : location === 'OTHER'
                    ? data?.other
                    : ''
          };
        }),
        severityType:
          safeReportScreen === 'Near Miss' ? 'NEAR_MISS' : 'REACHED_PATIENT',
        nearMissType:
          safeReportScreen === 'Near Miss' ? data?.nearMiss : undefined,
        isPatientHarmed:
          safeReportScreen === 'Near Miss'
            ? undefined
            : data?.patientHarmed === 'yes'
              ? true
              : false,
        sbarrSituation: data?.situation,
        sbarrBackground: data?.background,
        sbarrAction: data?.action,
        sbarrRecommendation: data?.recommendation,
        sbarrResult: data?.result
      }
    };
  };

  const onOpenSafeReportForm = () => {
    setShowSafeForm(true);
    setTimeout(() => {
      safeReportFormRef.setFieldsValue({
        date: isSmall
          ? undefined
          : getFormattedDateNoTimeZone({ format: DATE_FORMATS.MDY }),
        facilityId: currentFacility?.facilityId
      });
    });
  };

  const onChangeSafeReportDate = (date: any) => {
    setSafeReportFormData({
      ...safeReportFormData,
      date: date.toString()
    });
    safeReportFormRef.setFieldsValue({
      date: getFormattedDateNoTimeZone({ date, format: DATE_FORMATS.MDY })
    });
  };

  return (
    <>
      <Col style={{ paddingInline: size.xs ? pxToRem(20) : undefined }}>
        <Row className={safeReportHeading}>
          {size.xs && 'SAFE & Issue Reporting'}
        </Row>
        <Row align={'middle'} justify={'space-between'} style={{ gap: 8 }}>
          <SafeReportNavigationLayout
            onScreen={onScreen}
            onChangeScreen={onChangeScreen}
          />

          <SafeReportFilterLayout
            setFilterOpen={setFilterOpen}
            handleSearch={handleSearch}
            handleGenerateReport={onOpenSafeReportForm}
            onResetFilter={onResetFilter}
            onApplyFilter={onApplyFilter}
            form={form}
            showFilterDrawer={showFilterDrawer}
            onScreen={onScreen}
          />
        </Row>
      </Col>
      <>
        <FilterTags<TSafeRportFilters>
          filterForm={form}
          filterInitialValues={filterInitialValues}
          onChangeFilters={onApplyFilter}
          filterState={filters}
          customMapForSelect={{
            reportType: [ALL_OPTION, ...SAFE_REPORT_TYPE_OPTIONS]
          }}
          marginBottom={pxToRem(-16)}
          marginTop={pxToRem(12)}
          repositoryId={reportId}
        />
        <SafeReportHistoryLayout
          handleDeleteReport={onDeleteReport}
          onChangePagination={onChangePagination}
          safeReports={filteredSafeReport}
          loading={isLoading}
          pagination={pagination}
          handleEditSubmit={handleEditSubmit}
          onScreen={onScreen}
          showReportTypeModal={reportTypeModalOpen}
          setShowReportTypeModal={setReportTypeModalOpen}
          submitIssueReport={submitIssueReport}
          filters={filters}
          getSafeReport={getSafeReport}
          safeReportFormRef={safeReportFormRef}
          onCloseSafeReportForm={onCloseSafeReportForm}
          onChangeSafeFormStepNumber={onChangeFormStepNumber}
          currentSafeFormStep={safeFormCurrentStep}
          safeFormOnScreen={safeReportScreen}
          onChangeSafeFormScreen={onChangeSafeReportFormScreen}
          safeFormOpen={showSafeForm}
          onClickSafeFormBackButton={onClickBackButton}
          facilities={facilities}
          handleSafeReportFormSubmit={onSubmitSafeReportForm}
          onOpenSafeReportForm={onOpenSafeReportForm}
          safeReportFormData={safeReportFormData}
          onChangeSafeReportDate={onChangeSafeReportDate}
          reportFormRef={editReportFormRef}
          reportId={reportId as string}
          setReportId={setReportId}
        />
      </>
    </>
  );
};
