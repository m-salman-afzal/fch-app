import {
  MoreOutlined,
  ReloadOutlined,
  SaveOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Row } from 'antd';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TReportData } from '@/types/safeReportTypes';

import useCookies from '@/hooks/useCookies';
import {
  PERMISSION_TYPES_BACKEND,
  PERMISSIONS_TYPES,
  SAFE_REPORT_STATUS
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

interface props {
  onClickClose: () => void;
  onClickReturn: () => void;
  onClickReopen: () => void;
  reportStatus: string;
  closedByAdminId: string;
  reportData: TReportData;
  isLoading?: boolean;
}

const MobileActions: React.FC<props> = ({
  onClickClose,
  onClickReturn,
  reportStatus,
  closedByAdminId,
  onClickReopen
}) => {
  return (
    <Dropdown
      menu={{
        items: [
          {
            label: `Return to ${
              reportStatus === SAFE_REPORT_STATUS.IN_REVIEW ? 'Owner' : 'Sender'
            }`,
            key: 0,
            onClick: onClickReturn
          }
        ]
      }}
      trigger={['click']}
      placement={'bottomRight'}
    >
      <Button
        style={{
          width: pxToRem(32),
          height: pxToRem(32),
          borderRadius: pxToRem(4),
          padding: pxToRem(1)
        }}
        size="small"
      >
        <MoreOutlined style={{ fontSize: pxToRem(16) }} />
      </Button>
    </Dropdown>
  );
};

const ViewActions: React.FC<props> = ({
  onClickClose,
  onClickReturn,
  reportStatus,
  closedByAdminId,
  onClickReopen,
  reportData,
  isLoading
}) => {
  const isSmall = window.screen.width <= 576;
  const { getDataFromCookie } = useCookies();
  const { rbac, adminId } = getDataFromCookie();

  return (
    <Row style={{ gap: pxToRem(12), marginInlineEnd: pxToRem(12) }}>
      {(!isSmall &&
        reportStatus === SAFE_REPORT_STATUS.IN_REVIEW &&
        rbac.safeReportReviews === PERMISSIONS_TYPES.WRITE) ||
      (reportStatus === SAFE_REPORT_STATUS.UNDER_INVESTIGATION &&
        rbac.safeReportInvestigations === PERMISSIONS_TYPES.WRITE) ? (
        <>
          <VsButton
            antButtonProps={{
              type: 'default',
              icon: isSmall ? undefined : <ReloadOutlined />,
              loading: isLoading
            }}
            size={BUTTON_SIZES.middle}
            onClick={onClickReturn}
          >
            Return to{' '}
            {reportStatus === SAFE_REPORT_STATUS.IN_REVIEW ? 'Owner' : 'Sender'}
          </VsButton>
        </>
      ) : (
        <></>
      )}

      {rbac.safeReportReviews === PERMISSION_TYPES_BACKEND.WRITE &&
        reportStatus === SAFE_REPORT_STATUS.IN_REVIEW &&
        reportData.type !== 'ISSUE' && (
          <VsButton
            antButtonProps={{
              type: 'primary',
              loading: isLoading
            }}
            onClick={onClickClose}
            size={BUTTON_SIZES.middle}
          >
            Close Report
          </VsButton>
        )}

      {((reportData.type === 'SAFE' &&
        rbac.safeReportReviews === PERMISSION_TYPES_BACKEND.WRITE &&
        reportStatus === SAFE_REPORT_STATUS.CLOSED &&
        closedByAdminId === adminId) ||
        (reportData.type === 'ISSUE' &&
          reportStatus === SAFE_REPORT_STATUS.CLOSED &&
          rbac.safeReportInvestigations === PERMISSION_TYPES_BACKEND.WRITE &&
          closedByAdminId === adminId)) && (
        <VsButton
          onClick={onClickReopen}
          antButtonProps={{ loading: isLoading }}
          size={BUTTON_SIZES.middle}
        >
          Reopen
        </VsButton>
      )}

      {isSmall &&
        rbac.safeReportReviews === PERMISSION_TYPES_BACKEND.WRITE &&
        reportStatus === SAFE_REPORT_STATUS.IN_REVIEW && (
          <MobileActions
            onClickClose={onClickClose}
            onClickReturn={onClickReturn}
            reportStatus={reportStatus}
            closedByAdminId={closedByAdminId}
            onClickReopen={onClickReopen}
            reportData={reportData}
          />
        )}
    </Row>
  );
};

export default ViewActions;
