import {
  MoreOutlined,
  ReloadOutlined,
  SaveOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Row } from 'antd';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { SAFE_REPORT_STATUS } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

interface props {
  isReassign: boolean;
  onClickReAssign: () => void;
  onCancelReassign: () => void;
  onClickSubmit: () => void;
  onClickIsDraft: () => void;
  reassignButtonLoading: boolean;
  onClickReturnReport: () => void;
  reportStatus: string;
  isIssueReport: boolean;
  isLoading?: boolean;
}

const MobileActions: React.FC<props> = ({
  onClickReAssign,
  onClickIsDraft,
  reassignButtonLoading,
  onClickReturnReport,
  reportStatus,
  isIssueReport
}) => {
  return (
    <Dropdown
      placement={'bottomRight'}
      menu={{
        items: isIssueReport
          ? [
              {
                label: `Return to ${
                  reportStatus === SAFE_REPORT_STATUS.IN_REVIEW
                    ? 'Owner'
                    : 'Sender'
                }`,
                key: 0,
                onClick: onClickReturnReport
              },
              {
                label: 'Save as Draft',
                key: 1,
                onClick: onClickIsDraft
              }
            ]
          : [
              {
                label: `Return to ${
                  reportStatus === SAFE_REPORT_STATUS.IN_REVIEW
                    ? 'Owner'
                    : 'Sender'
                }`,
                key: 0,
                onClick: onClickReturnReport
              },
              {
                label: 'Save as Draft',
                key: 1,
                onClick: onClickIsDraft
              },
              {
                label: 'Reassign',
                key: 2,
                onClick: onClickReAssign
              }
            ]
      }}
      trigger={['click']}
    >
      <Button
        style={{
          width: pxToRem(32),
          height: pxToRem(32),
          borderRadius: pxToRem(4),
          padding: pxToRem(1)
        }}
        size="small"
        loading={reassignButtonLoading}
      >
        <MoreOutlined style={{ fontSize: pxToRem(16) }} />
      </Button>
    </Dropdown>
  );
};

const InvestigationActions: React.FC<props> = ({
  isReassign,
  onClickReAssign,
  onCancelReassign,
  onClickSubmit,
  onClickIsDraft,
  reassignButtonLoading,
  onClickReturnReport,
  reportStatus,
  isIssueReport,
  isLoading
}) => {
  const isSmall = window.screen.width <= 576;

  return (
    <Row style={{ gap: pxToRem(12), marginInlineEnd: pxToRem(12) }}>
      {!isReassign && !isSmall && (
        <>
          <VsButton
            antButtonProps={{
              type: 'default',

              loading: reassignButtonLoading,
              icon: <ReloadOutlined />
            }}
            size={BUTTON_SIZES.middle}
            onClick={onClickReturnReport}
          >
            {' '}
            Return to{' '}
            {reportStatus === SAFE_REPORT_STATUS.IN_REVIEW ? 'Owner' : 'Sender'}
          </VsButton>

          <VsButton
            antButtonProps={{
              type: 'default',
              icon: <SaveOutlined />
            }}
            size={BUTTON_SIZES.middle}
            onClick={onClickIsDraft}
          >
            {' '}
            Save as Draft
          </VsButton>

          {!isIssueReport && (
            <VsButton
              antButtonProps={{
                type: 'default',
                icon: <UsergroupAddOutlined />,
                loading: isLoading
              }}
              size={BUTTON_SIZES.middle}
              onClick={onClickReAssign}
            >
              Reassign
            </VsButton>
          )}
        </>
      )}
      {isReassign && (
        <VsButton
          antButtonProps={{
            type: 'default',
            loading: isLoading
          }}
          size={BUTTON_SIZES.middle}
          onClick={onCancelReassign}
        >
          {isSmall ? 'Cancel' : 'Cancel Reassignment'}
        </VsButton>
      )}

      <VsButton
        antButtonProps={{
          type: 'primary',
          loading: isLoading
        }}
        size={BUTTON_SIZES.middle}
        onClick={onClickSubmit}
      >
        {isIssueReport ? 'Close Report' : 'Submit'}
      </VsButton>
      {isSmall && !isReassign && (
        <MobileActions
          isReassign={isReassign}
          onClickReAssign={onClickReAssign}
          onCancelReassign={onCancelReassign}
          onClickSubmit={onClickSubmit}
          onClickIsDraft={onClickIsDraft}
          onClickReturnReport={onClickReturnReport}
          reassignButtonLoading={reassignButtonLoading}
          reportStatus={reportStatus}
          isIssueReport={isIssueReport}
        />
      )}
    </Row>
  );
};

export default InvestigationActions;
