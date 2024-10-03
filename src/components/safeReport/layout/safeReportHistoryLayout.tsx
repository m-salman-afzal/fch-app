import { PropsWithChildren, useEffect, useState } from 'react';
import { EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, FormInstance, Grid, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TPagination } from '@/types/commonTypes';
import { TReportData } from '@/types/safeReportTypes';

import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';
import { usePillStyle } from '@/components/common/colorfulPill/usePillStyle';
import { SafeReportForm } from '@/components/dynamicSafeReportForm/safeReportForm';
import InvestigationReportDrawer from '@/components/investigation/layout/investigationReportDrawer';

import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import useInvestigateSubmission from '@/hooks/useInvestigationSubmission';
import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  PERMISSIONS_TYPES,
  SAFE_REPORT_STATUS,
  SAFE_REPORT_TYPES
} from '@/utils/constants';
import { DeleteOption } from '@/utils/constantsComponents';
import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import { getReportHistoryUrl, getReportsUrl } from '@/utils/endpoints';
import {
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE,
  toCapitalize
} from '@/utils/sharedUtils';

import { EditReportDrawer } from '../drawer/editReportDrawer';
import { ReviewHistoryDrawer } from '../drawer/reviewHistoryDrawer';
import { ViewSafeReportModal } from '../modals/viewSafeReportModal';
import { useSafeReportHistoryTableStyle } from '../styles/useSafeReportHistoryTableStyle';

interface props {
  onChangePagination: (page: number, pageSize: number) => void;
  safeReports: TReportData[];
  loading: boolean;
  pagination: TPagination;
  handleEditSubmit: (data: any) => Promise<void>;
  showReportTypeModal: boolean;
  setShowReportTypeModal: (x: boolean) => void;
  submitIssueReport: (data: any) => Promise<void>;
  onScreen: string;
  getSafeReport?: (filters: any) => Promise<void>;
  filters: any;
  safeReportFormRef: FormInstance;
  onCloseSafeReportForm: () => void;
  safeFormOnScreen: string;
  onChangeSafeFormStepNumber: (step: number) => void;
  currentSafeFormStep?: number;
  onChangeSafeFormScreen: (screen: string) => void;
  onClickSafeFormBackButton: () => void;
  facilities?: any[];
  safeFormOpen?: boolean;
  handleSafeReportFormSubmit: (data: any) => void;
  onOpenSafeReportForm: () => void;
  safeReportFormData: any;
  onChangeSafeReportDate: (date: any) => void;
  reportFormRef: FormInstance;
  handleDeleteReport: (reportId: string) => void;
  reportId?: string;
  setReportId: (reportId: string | null) => void;
}

const { useBreakpoint } = Grid;

export const REPORT_OPTIONS = {
  SAFE: 'SAFE',
  ISSUE: 'ISSUE'
};

export const SafeReportHistoryLayout: React.FC<PropsWithChildren<props>> = ({
  onChangePagination,
  safeReports,
  loading,
  pagination,
  showReportTypeModal,
  setShowReportTypeModal,
  handleEditSubmit,
  submitIssueReport,
  onScreen,
  filters,
  getSafeReport = () => {},
  safeReportFormRef,
  onCloseSafeReportForm,
  safeFormOnScreen,
  onChangeSafeFormStepNumber,
  currentSafeFormStep = 0,
  onChangeSafeFormScreen,
  onClickSafeFormBackButton,
  facilities = [],
  safeFormOpen = false,
  handleSafeReportFormSubmit,
  onOpenSafeReportForm,
  safeReportFormData,
  onChangeSafeReportDate,
  reportFormRef,
  reportId,
  setReportId,
  handleDeleteReport
}) => {
  const { getDataFromCookie } = useCookies();
  const { rbac } = getDataFromCookie();
  const admin = getDataFromCookie();
  const size = useBreakpoint();

  const isSmall = window.screen.width <= 576;
  const { fetchData } = useFetch();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [drawerData, setDrawerData] = useState<any>(null);

  const { tableClassName } = useSafeReportHistoryTableStyle();
  const { greenPill, greyPill, bluePill, yellowPill } = usePillStyle();
  const pillAnonymousColor: any = {
    NO: greenPill,
    YES: greyPill
  };

  const { tableHeight } = useTablePaginationPosition();

  const showMoreOptions = (data: any[], displayKey: string, style?: any) => {
    if (data?.length > 1) {
      const items = data?.toSpliced(0, 1);
      const htmlContent = (
        <div>
          {items.map((item, index) => {
            return (
              <span key={index} style={{ display: 'flex' }}>{`${
                index + 1
              }. ${item}`}</span>
            );
          })}
        </div>
      );

      return (
        <Tooltip title={htmlContent}>
          {' '}
          <ColorfulPill
            text={`+${items.length}`}
            style={style || { marginLeft: pxToRem(10) }}
          />
        </Tooltip>
      );
    }

    return null;
  };

  const columns: ColumnsType = [
    {
      title: 'Name',
      render: (value: TReportData) => (
        <div>
          {value.admin?.firstName
            ? `${value.admin.lastName}, ${value.admin.firstName} ${value.admin.isDeleted ? '(Deleted User)' : ''}`
            : 'Anonymous'}
        </div>
      )
    },
    {
      title: 'Report Type',
      render: (value: TReportData) => (
        <div>{value.type === 'SAFE' ? 'SAFE' : toCapitalize(value.type)}</div>
      )
    },
    {
      title: 'Date & Time',
      render: (value: TReportData) => (
        <div>
          {getFormattedDateInEST({
            date: `${value.createdAt}`,
            format: DATE_FORMATS.MDY_TIME
          })}
        </div>
      )
    },
    {
      title: 'Status',
      render: value =>
        value.status ? (
          <ColorfulPill
            className={
              value.status === SAFE_REPORT_STATUS.UNDER_INVESTIGATION
                ? bluePill
                : value.status === SAFE_REPORT_STATUS.PENDING
                  ? yellowPill
                  : value.status === SAFE_REPORT_STATUS.IN_REVIEW
                    ? greenPill
                    : greyPill
            }
            text={toCapitalize(
              (value.status as string).split('_').length > 1
                ? `${value.status.split('_')[0]} ${value.status.split('_')[1]}`
                : value.status
            )}
          />
        ) : (
          '-'
        )
    },
    {
      title: 'Assignee',
      render: (value: TReportData) => {
        const names = value.assignees.length
          ? value.assignees?.map(v => `${v.lastName}, ${v.firstName}`)
          : [];
        const assignees = Array.from(new Set(names));

        return (
          <div style={{ display: 'inline-flex' }}>
            {assignees?.length ? assignees[0] : '-'}
            {showMoreOptions(assignees, 'firstName')}
          </div>
        );
      }
    },
    {
      title: 'Owner',
      render: (value: TReportData) =>
        value.type === 'ISSUE'
          ? '-'
          : value.owner?.firstName
            ? `${value.owner.lastName}, ${value.owner.firstName}`
            : '-'
    },
    {
      title: 'Anonymous',
      render: (value: TReportData) => (
        <ColorfulPill
          className={pillAnonymousColor[value.isAnonymous ? 'YES' : 'NO']}
          text={value.isAnonymous ? 'Yes' : 'No'}
        />
      )
    }
  ];

  const handleEditOrView = async (values: TReportData) => {
    if (values.type === SAFE_REPORT_TYPES.ISSUE && !values.status) {
      setDrawerData(values);
      setIssueModalOpen(true);

      return;
    }

    if (
      (admin.rbac.safeReportInvestigations !== PERMISSIONS_TYPES.HIDE ||
        admin.rbac.safeReportReviews !== PERMISSIONS_TYPES.HIDE) &&
      (onScreen === 'investigationReview' ||
        values.status !== SAFE_REPORT_STATUS.PENDING)
    ) {
      await getCurrentInvestigationReport(values.reportId);
      setOpenInvestigationDrawer(true);

      return;
    }

    const data: TReportData = await fetchData(
      `${admin.rbac.reports === PERMISSIONS_TYPES.HIDE ? getReportHistoryUrl() : getReportsUrl()}/${values.reportId}`
    );
    setDrawerData(data);

    if (onScreen === 'reportHistory') {
      if (
        ((admin.adminId === values.adminId &&
          rbac.reports === PERMISSIONS_TYPES.WRITE) ||
          rbac.reportHistory === PERMISSIONS_TYPES.WRITE) &&
        values.status === SAFE_REPORT_STATUS.PENDING
      )
        setIsEdit(true);
      else setIsEdit(false);
      setDrawerOpen(true);
    }
  };

  const safeReportCta =
    admin.rbac.reportHistory === PERMISSIONS_TYPES.WRITE &&
    onScreen === 'reportHistory'
      ? {
          title: '',
          width: pxToRem(56),
          render: (value: TReportData) => (
            <div
              style={{
                border: '0px solid',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Dropdown
                placement={'bottomRight'}
                trigger={['click']}
                key={value.reportId}
                menu={{
                  items: [
                    {
                      key: 1,
                      label:
                        (value.status === SAFE_REPORT_STATUS.PENDING &&
                          ((admin.adminId === value.adminId &&
                            rbac.reports === PERMISSIONS_TYPES.WRITE) ||
                            rbac.reportHistory === PERMISSIONS_TYPES.WRITE)) ||
                        (value.status ===
                          SAFE_REPORT_STATUS.UNDER_INVESTIGATION &&
                          admin.adminId === value.owner?.adminId &&
                          rbac.safeReportInvestigations ===
                            PERMISSIONS_TYPES.WRITE) ||
                        (value.status === SAFE_REPORT_STATUS.IN_REVIEW &&
                          rbac.safeReportReviews === PERMISSIONS_TYPES.WRITE)
                          ? 'Edit'
                          : 'View',
                      onClick: async () => {
                        await handleEditOrView(value);
                      }
                    },

                    {
                      key: 2,
                      label: <DeleteOption />,
                      onClick: () => {
                        handleDeleteReport(value.reportId);
                      }
                    }
                  ]
                }}
              >
                <VsButton
                  antButtonProps={{
                    icon: <MoreOutlined style={TABLE_BUTTON_ICON_SIZE} />
                  }}
                  size={BUTTON_SIZES.squareIcon}
                  style={TABLE_BUTTON_STYLE}
                />
              </Dropdown>
            </div>
          )
        }
      : {
          title: '',
          width: pxToRem(58),
          render: (values: TReportData) => (
            <div
              style={{
                border: '0px solid',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <VsButton
                style={TABLE_BUTTON_STYLE}
                size={BUTTON_SIZES.squareIcon}
                antButtonProps={{
                  icon:
                    (values.status === SAFE_REPORT_STATUS.PENDING &&
                      ((admin.adminId === values.adminId &&
                        rbac.reports === PERMISSIONS_TYPES.WRITE) ||
                        rbac.reportHistory === PERMISSIONS_TYPES.WRITE)) ||
                    (values.status === SAFE_REPORT_STATUS.UNDER_INVESTIGATION &&
                      admin.adminId === values.owner?.adminId &&
                      rbac.safeReportInvestigations ===
                        PERMISSIONS_TYPES.WRITE) ||
                    (values.status === SAFE_REPORT_STATUS.IN_REVIEW &&
                      rbac.safeReportReviews === PERMISSIONS_TYPES.WRITE) ? (
                      <Tooltip title={'Edit'}>
                        <EditOutlined style={TABLE_BUTTON_ICON_SIZE} />
                      </Tooltip>
                    ) : (
                      <Tooltip title={'View'}>
                        <EyeOutlined style={TABLE_BUTTON_ICON_SIZE} />
                      </Tooltip>
                    )
                }}
                onClick={async () => {
                  await handleEditOrView(values);
                }}
              ></VsButton>
            </div>
          )
        };

  columns.push(safeReportCta);

  const getDrawerData = async () => {
    const safeReport = safeReports.find(sR => sR.reportId === reportId);
    if (!safeReport) return;
    if (safeReport.type === SAFE_REPORT_TYPES.ISSUE && !safeReport.status) {
      setDrawerData(safeReport);
      setIssueModalOpen(true);

      return;
    }

    if (
      (admin.rbac.safeReportInvestigations !== PERMISSIONS_TYPES.HIDE ||
        admin.rbac.safeReportReviews !== PERMISSIONS_TYPES.HIDE) &&
      (onScreen === 'investigationReview' ||
        safeReport.status !== SAFE_REPORT_STATUS.PENDING)
    ) {
      await getCurrentInvestigationReport(safeReport.reportId);
      setOpenInvestigationDrawer(true);

      return;
    }

    const data: TReportData = await fetchData(
      `${admin.rbac.reports === PERMISSIONS_TYPES.HIDE ? getReportHistoryUrl() : getReportsUrl()}/${safeReport.reportId}`
    );
    setDrawerData(data);

    if (onScreen === 'reportHistory') {
      if (
        ((admin.adminId === safeReport.adminId &&
          rbac.reports === PERMISSIONS_TYPES.WRITE) ||
          rbac.reportHistory === PERMISSIONS_TYPES.WRITE) &&
        safeReport.status === SAFE_REPORT_STATUS.PENDING
      )
        setIsEdit(true);
      else setIsEdit(false);
      setDrawerOpen(true);
    }
  };

  useEffect(() => {
    getFacilityCheckList();
    if (reportId && safeReports.length) {
      getDrawerData();
      setReportId(null);
    }
  }, [safeReports]);

  const {
    investigationForm,
    onSubmitInvestigation,
    openInvestigationDrawer,
    reassignButtonLoading,
    getFacilityCheckList,
    investigationFacilityChecklist,
    changeReportStatus,
    setOpenInvestigationDrawer,
    getCurrentInvestigationReport,
    reportData: investigationReportData,
    isLoading,
    setIsLoading
  } = useInvestigateSubmission(getSafeReport, {
    filters: filters,
    pagination: pagination
  });

  return (
    <>
      <div className={tableClassName} style={{ marginBlockEnd: pxToRem(20) }}>
        <VsTable
          tableProps={{
            loading,
            columns: columns,
            dataSource: safeReports,
            pagination: {
              current: pagination.currentPage,
              showTotal: size.sm
                ? (total, range) => {
                    return (
                      <Typography.Text>
                        Showing {range[1]} out of <strong>{total}</strong>
                      </Typography.Text>
                    );
                  }
                : undefined,
              showSizeChanger: !size.xs,
              defaultPageSize: isSmall
                ? DEFAULT_PAGE_SIZE.MOBILE
                : DEFAULT_PAGE_SIZE.DESKTOP,
              pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
              size: 'small',
              position: ['bottomCenter'],
              total: pagination.totalItems,
              onChange: onChangePagination
            },
            scroll: {
              x: true,
              y: safeReports.length ? tableHeight : undefined
            }
          }}
        />
        {drawerData && issueModalOpen && (
          <ViewSafeReportModal
            onCloseModal={() => {
              setIssueModalOpen(false);
              setDrawerData(null);
            }}
            open={issueModalOpen}
            safeReportMessage={drawerData}
          />
        )}

        {drawerData && drawerOpen && isEdit && onScreen === 'reportHistory' && (
          <EditReportDrawer
            isLoading={loading}
            drawerData={drawerData}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            handleSubmit={handleEditSubmit}
            reportFormRef={reportFormRef}
          />
        )}

        {drawerData && drawerOpen && !isEdit && (
          <ReviewHistoryDrawer
            isLoading={isLoading}
            drawerData={drawerData}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            handleSubmit={handleEditSubmit}
            isEdit={false}
          />
        )}

        {investigationReportData?.safeReport && (
          <InvestigationReportDrawer
            isLoading={isLoading}
            isOpen={openInvestigationDrawer}
            setIsOpen={setOpenInvestigationDrawer}
            form={investigationForm}
            reportData={investigationReportData}
            onSubmitInvestigation={onSubmitInvestigation}
            reassignButtonLoading={reassignButtonLoading}
            getFacilityCheckList={getFacilityCheckList}
            investigationFacilityChecklist={investigationFacilityChecklist}
            changeReportStatus={changeReportStatus}
          />
        )}
      </div>

      <SafeReportForm
        handleFormSubmit={handleSafeReportFormSubmit}
        reportFormRef={safeReportFormRef}
        onCloseSafeReportForm={onCloseSafeReportForm}
        onScreen={safeFormOnScreen}
        onChangeStepNumber={onChangeSafeFormStepNumber}
        currentSafeFormStep={currentSafeFormStep}
        onChangeScreen={onChangeSafeFormScreen}
        onClickBackButton={onClickSafeFormBackButton}
        facilities={facilities}
        open={safeFormOpen}
        safeReportFormData={safeReportFormData}
        onChangeSafeReportDate={onChangeSafeReportDate}
        isLoading={loading}
        isChecklist={investigationFacilityChecklist.length > 0}
      />
    </>
  );
};
