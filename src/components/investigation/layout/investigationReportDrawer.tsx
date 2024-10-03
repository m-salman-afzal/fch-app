import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Col, FormInstance, Row } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import { VsSegmented } from 'vs-design-components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TReportData } from '@/types/safeReportTypes';

import ReportDrawer from '@/components/common/reportDrawer/reportDrawer';

import useCookies from '@/hooks/useCookies';
import {
  PERMISSIONS_TYPES,
  SAFE_REPORT_STATUS,
  SAFE_REPORT_TYPES
} from '@/utils/constants';

import InvestigateReport from './investigateReport';
import InvestigationActions from './investigationDrawerActions';
import ReviewReport from './reviewReport';
import ViewReport from './viewReport';
import ViewActions from './viewReportActions';

interface props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  form: FormInstance<any>;
  reportData: TReportData;
  onSubmitInvestigation: (
    values: any,
    isDraft?: boolean,
    isIssueReport?: boolean
  ) => Promise<void | boolean>;
  reassignButtonLoading: boolean;
  getFacilityCheckList: () => Promise<void>;
  investigationFacilityChecklist: any[];
  changeReportStatus: (
    reportId: string,
    commentText: string,
    status: string
  ) => Promise<void>;
  isLoading: boolean;
}
const SCREENS = {
  REPORT: 'Report',
  INVESTIGATION: 'Investigation'
};
const InvestigationReportDrawer: React.FC<props> = ({
  isOpen,
  form,
  reportData,
  onSubmitInvestigation,
  getFacilityCheckList,
  reassignButtonLoading,
  investigationFacilityChecklist,
  changeReportStatus,
  setIsOpen,
  isLoading
}) => {
  const { getDataFromCookie } = useCookies();
  const { rbac, adminId: currentAdminId } = getDataFromCookie();

  useEffect(() => {
    form.setFieldsValue({
      ...reportData,
      ...reportData.safeReport,
      involvedParty: reportData.safeReport?.involvedParty
    });
  }, [reportData]);
  const isSmall = window.screen.width <= 576;
  const [isNewComment, setNewComment] = useState<boolean>(false);
  const [noteRequired, setNoteRequired] = useState<boolean>(
    reportData.safeReport?.isFinding ?? true
  );
  const [issueInvestigationClose, setIssueInvestigationClose] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<string>(SCREENS.REPORT);
  const [clickClose, setClickClose] = useState(false);
  const [isReassign, setReassign] = useState<boolean>(false);
  const onChangeScreen = (e: SegmentedValue) => {
    setCurrentScreen(e as string);
  };

  const onClickReassign = async () => {
    try {
      await getFacilityCheckList();
      setReassign(true);
    } catch (error) {}
  };

  const onCancelReassign = () => {
    setReassign(false);
  };

  const onClickIsDraft = async () => {
    try {
      const values = form.getFieldsValue();
      const isSubbmitted = await onSubmitInvestigation(
        {
          ...values,
          reportId: reportData.reportId,
          safeReportId: reportData.safeReportId,
          interventionDescription: values.interventionDescription
            ? values.interventionDescription
            : '',
          involvedParty: !values.involvedParty
            ? undefined
            : values.involvedParty,
          findings: values.findings ? values.findings : '',
          involvedPartyText: values.involvedPartyText
            ? values.involvedPartyText
            : ''
        },
        true
      );

      if (isSubbmitted) {
        onClickCloseDrawerIcon();
      }
    } catch (error) {}
  };

  const onClickReturnToReport = () => {
    setNewComment(true);
  };

  const onClickCommentCancel = () => {
    setClickClose(false);
    setNewComment(false);
  };

  const SubmitComment = async (commentText: string) => {
    if (clickClose) {
      if (issueInvestigationClose) {
        await form.validateFields();
        await onFinishInvestigation(
          form.getFieldsValue(),
          noteRequired,
          commentText
        );

        setCurrentScreen(SCREENS.REPORT);

        setNewComment(false);
        setClickClose(false);
        setIssueInvestigationClose(false);

        return;
      }

      await changeReportStatus(
        reportData.reportId,
        commentText,
        SAFE_REPORT_STATUS.CLOSED
      );
      setCurrentScreen(SCREENS.REPORT);

      setNewComment(false);
      setClickClose(false);

      return;
    }

    await changeReportStatus(
      reportData.reportId,
      commentText,
      reportData.status === SAFE_REPORT_STATUS.IN_REVIEW
        ? SAFE_REPORT_STATUS.UNDER_INVESTIGATION
        : SAFE_REPORT_STATUS.PENDING
    );

    setNewComment(false);
    setClickClose(false);
    onClickCloseDrawerIcon();
  };

  const onCloseReport = async () => {
    setClickClose(true);
    setNewComment(true);

    return;
  };

  const onReopenReport = async () => {
    await changeReportStatus(
      reportData.reportId,
      '',
      reportData.type === SAFE_REPORT_TYPES.ISSUE
        ? SAFE_REPORT_STATUS.UNDER_INVESTIGATION
        : SAFE_REPORT_STATUS.IN_REVIEW
    );
    setCurrentScreen(SCREENS.REPORT);
  };

  const onClickCloseDrawerIcon = () => {
    setReassign(false);
    setClickClose(false);
    setCurrentScreen(SCREENS.REPORT);
    setNewComment(false);
    setIsOpen(false);
    setCurrentScreen(SCREENS.REPORT);
    form.setFieldValue('safeAssignmentComment', undefined);
  };

  const onFinishInvestigation = async (
    values: any,
    noteRequired: boolean,
    commentText?: string
  ) => {
    values.safeAssignmentComment = values.safeAssignmentComment
      ? values.safeAssignmentComment
      : issueInvestigationClose && commentText && clickClose
        ? commentText
        : undefined;

    const isSubmitted = await onSubmitInvestigation(
      {
        ...values,
        interventionDescription: noteRequired
          ? values.interventionDescription ?? ''
          : '',
        reportId: reportData.reportId,
        safeReportId: reportData.safeReportId,
        safeFacilityChecklist: isReassign
          ? [...reportData.safeFacilityChecklist, values.eventType]
          : undefined,
        eventType: isReassign ? values.eventType : undefined,
        isFinding: noteRequired,
        involvedParty: !values.involvedParty ? undefined : values.involvedParty,
        findings: values.findings?.length > 0 ? values.findings : '',
        involvedPartyText:
          values.involvedPartyText?.length > 0 ? values.involvedPartyText : ''
      },
      isReassign ? true : false,
      reportData.type === 'ISSUE'
    );

    if (isSubmitted) {
      onClickCloseDrawerIcon();
    }
  };

  return (
    <>
      <ReportDrawer
        isOpen={isOpen}
        onClickClose={onClickCloseDrawerIcon}
        isLoading={isLoading}
        titleCtas={
          ((rbac.safeReportInvestigations === PERMISSIONS_TYPES.WRITE &&
            reportData?.owner?.adminId === currentAdminId) ||
            (rbac.safeReportReviews === PERMISSIONS_TYPES.WRITE &&
              reportData.status !== SAFE_REPORT_STATUS.UNDER_INVESTIGATION)) &&
          (currentScreen === SCREENS.INVESTIGATION &&
          reportData.status !== SAFE_REPORT_STATUS.IN_REVIEW &&
          reportData.status !== SAFE_REPORT_STATUS.CLOSED ? (
            <InvestigationActions
              isReassign={isReassign}
              isLoading={isLoading}
              reassignButtonLoading={reassignButtonLoading}
              isIssueReport={reportData.type === 'ISSUE'}
              onClickReAssign={onClickReassign}
              onCancelReassign={onCancelReassign}
              onClickSubmit={() => {
                if (reportData.type === 'ISSUE') {
                  setIssueInvestigationClose(true);
                  onCloseReport();

                  return;
                }
                form.submit();
              }}
              onClickIsDraft={onClickIsDraft}
              onClickReturnReport={onClickReturnToReport}
              reportStatus={reportData.status}
            />
          ) : (
            <ViewActions
              isLoading={isLoading}
              closedByAdminId={reportData.closedByAdminId}
              onClickClose={onCloseReport}
              onClickReturn={onClickReturnToReport}
              reportStatus={reportData.status}
              onClickReopen={onReopenReport}
              reportData={reportData}
            />
          ))
        }
        commentsArray={reportData.comment}
        isNewComment={isNewComment}
        commentSubmitButtonText={
          clickClose
            ? 'Close Report'
            : reportData.status !== SAFE_REPORT_STATUS.IN_REVIEW
              ? 'Return to Sender'
              : 'Return to Owner'
        }
        onClickCommentSubmit={SubmitComment}
        onClickCommentCancel={onClickCommentCancel}
        destroyOncllose
      >
        {(rbac.safeReportInvestigations !== PERMISSIONS_TYPES.HIDE ||
          rbac.safeReportReviews !== PERMISSIONS_TYPES.HIDE) && (
          <Row
            style={{
              marginBlockStart: pxToRem(18),
              paddingInline: isSmall ? pxToRem(16) : pxToRem(32)
            }}
          >
            <Col xs={18} md={18} lg={10}>
              <VsSegmented
                segmentedProps={{
                  options: [SCREENS.REPORT, SCREENS.INVESTIGATION],
                  onChange: onChangeScreen,
                  block: true,
                  defaultValue: SCREENS.REPORT
                }}
              />
            </Col>
          </Row>
        )}
        <Row>
          {currentScreen === SCREENS.REPORT ? (
            <ViewReport reportData={reportData} />
          ) : reportData.status === SAFE_REPORT_STATUS.IN_REVIEW ||
            reportData.status === SAFE_REPORT_STATUS.CLOSED ||
            reportData?.owner?.adminId !== currentAdminId ||
            rbac.safeReportInvestigations !== PERMISSIONS_TYPES.WRITE ? (
            <ReviewReport reviewData={reportData} />
          ) : (
            <InvestigateReport
              investigateData={reportData}
              isReassign={isReassign}
              eventsList={[]}
              form={form}
              onSubmitInvestigation={onFinishInvestigation}
              investigationFacilityChecklist={investigationFacilityChecklist}
              noteRequired={noteRequired}
              setNoteRequired={setNoteRequired}
            />
          )}
        </Row>
      </ReportDrawer>
    </>
  );
};

export default InvestigationReportDrawer;
