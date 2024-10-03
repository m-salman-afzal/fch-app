import { useState } from 'react';
import { Col, Row, Typography } from 'antd';

import { TReportData } from '@/types/safeReportTypes';

import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';

import { pxToRem } from '@/utils/sharedUtils';

import { useInvestigateReportStyle } from './useInvestigateReportStyle';

interface props {
  reviewData: TReportData;
}
const involvedPartiesOptions = [
  {
    name: 'UNSAFE',
    key: 'UNSAFE',
    text: 'A.  Unsafe condition (condition with potential to cause injury or death)'
  },
  {
    name: 'NEAR_MISS_INCIDENT',
    key: 'NEAR_MISS_INCIDENT',
    text: 'B.  Near miss - Harm didn’t reach patient - Incidentally (caught by chance)'
  },
  {
    name: 'NEAR_MISS_ACTIVE',
    key: 'NEAR_MISS_ACTIVE',
    text: 'C.  Near miss - Harm didn’t reach patient - Active recovery by caregiver'
  },
  {
    name: 'NO_HARM',
    key: 'NO_HARM',
    text: 'D.  No harm - Reached patient - no monitoring required'
  },
  {
    name: 'NO_HARM_MONITORING',
    key: 'NO_HARM_MONITORING',
    text: 'E.  No harm - Reached patient - monitoring required'
  },
  {
    name: 'HARM_TEMP',
    key: 'HARM_TEMP',
    text: 'F.  Harm - Temporary intervention needed'
  },
  {
    name: 'HARM_TEMP_HOSPITAL',
    key: 'HARM_TEMP_HOSPITAL',
    text: 'G.  Harm - Temporary - hospitalization needed (new or prolonged)'
  },
  {
    name: 'HARM_PERM',
    key: 'HARM_PERM',
    text: 'H.  Harm - Permanent'
  },
  {
    name: 'HARM_INTERVENTION',
    key: 'HARM_INTERVENTION',
    text: 'I.  Harm - Intervention required to sustain life'
  },
  {
    name: 'DEATH',
    key: 'DEATH',
    text: 'J.  Death'
  }
];
const ReviewReport: React.FC<props> = ({ reviewData }) => {
  const {
    investigateReportContainer,
    titleClass,
    investigationTitle,
    subHeading,
    investigateReportSecion,
    ownerPill,
    radioGroup,
    radioText,
    reviewText,
    reviewTextFull,
    viewMoreButton,
    reviewFindingsYes,
    assigneeContainer
  } = useInvestigateReportStyle();

  const [viewMore, setViewMore] = useState<any>({
    involvedParty: false,
    findings: false,
    interventionDescription: false
  });

  const onClickView = (
    textbox: 'involvedParty' | 'findings' | 'interventionDescription'
  ) => {
    setViewMore((x: { [x: string]: any }) => ({
      ...x,
      [textbox]: !x[textbox]
    }));
  };

  return (
    <Row className={investigateReportContainer}>
      <Col span={24}>
        <Row className={titleClass}>
          <Col span={24}>
            <Typography.Title className={investigationTitle}>
              Leadership Review
            </Typography.Title>
            <Typography.Text className={subHeading}>
              {Array.from(
                new Set(
                  reviewData.assignees.map(v => `${v.lastName}, ${v.firstName}`)
                )
              ).length > 1
                ? 'Assignees'
                : 'Assignee'}
            </Typography.Text>
            <div
              className={assigneeContainer}
              style={{ marginBlockStart: pxToRem(16) }}
            >
              {Array.from(
                new Set(
                  reviewData.assignees.map(v => `${v.lastName}, ${v.firstName}`)
                )
              ).map(assign => (
                <ColorfulPill key={assign} text={assign} />
              ))}
            </div>
          </Col>
        </Row>

        {reviewData.type !== 'ISSUE' && (
          <Row className={investigateReportSecion}>
            <Col span={24}>
              <Typography.Text className={subHeading}>Owner</Typography.Text>
              <div style={{ marginBlockStart: pxToRem(16) }}>
                <ColorfulPill
                  className={ownerPill}
                  text={`${reviewData.owner.lastName}, ${reviewData.owner.firstName}`}
                />
              </div>
            </Col>
          </Row>
        )}

        <Row className={investigateReportSecion}>
          <Col span={24}>
            <Typography.Text className={subHeading}>
              Involved Parties
            </Typography.Text>
            <div
              className={radioGroup}
              style={{
                padding: 0,
                paddingBlockStart: pxToRem(12),
                marginBlockStart: pxToRem(12)
              }}
            >
              <div
                className={viewMore.involvedParty ? reviewTextFull : reviewText}
                style={{
                  marginBlockEnd:
                    reviewData.safeReport?.involvedPartyText?.length < 760
                      ? pxToRem(12)
                      : !reviewData.safeReport?.involvedPartyText
                        ? pxToRem(12)
                        : undefined
                }}
              >
                {reviewData.safeReport?.involvedPartyText
                  ? reviewData.safeReport?.involvedPartyText
                  : '-'}
              </div>
              {reviewData.safeReport?.involvedPartyText?.length >= 760 && (
                <div
                  className={viewMoreButton}
                  onClick={() => onClickView('involvedParty')}
                >
                  {!viewMore.involvedParty ? 'View More' : 'View Less'}
                </div>
              )}
            </div>

            {reviewData.type !== 'ISSUE' && (
              <div>
                <div
                  style={{ marginBlockStart: pxToRem(24) }}
                  className={subHeading}
                >
                  Severity of Event{' '}
                </div>
                <div style={{ marginBlockStart: pxToRem(10) }}>
                  {involvedPartiesOptions.find(
                    option => option.key === reviewData.safeReport.involvedParty
                  )?.text ?? '-'}
                </div>
              </div>
            )}
          </Col>
        </Row>

        <Row
          className={investigateReportSecion}
          style={{ paddingBlockEnd: 0, borderBlockEnd: 'unset' }}
        >
          <Col span={24}>
            <Typography.Text className={subHeading}>Findings</Typography.Text>
            <div
              className={radioGroup}
              style={{
                padding: 0,
                paddingBlockStart: pxToRem(12),
                marginBlockStart: pxToRem(12)
              }}
            >
              <div
                className={viewMore.findings ? reviewTextFull : reviewText}
                style={{
                  marginBlockEnd:
                    reviewData.safeReport?.findings?.length < 760
                      ? pxToRem(12)
                      : !reviewData.safeReport?.findings
                        ? pxToRem(12)
                        : undefined
                }}
              >
                {reviewData.safeReport?.findings
                  ? reviewData.safeReport?.findings
                  : '-'}
              </div>
              {reviewData.safeReport?.findings?.length >= 760 && (
                <div
                  className={viewMoreButton}
                  onClick={() => onClickView('findings')}
                >
                  {!viewMore.findings ? 'View More' : 'View Less'}
                </div>
              )}
            </div>
            <div
              style={{
                marginBlockStart: pxToRem(24),
                marginBlockEnd: pxToRem(17)
              }}
              className={radioText}
            >
              Were any interventions/process improvements required?{' '}
            </div>{' '}
            {reviewData.safeReport.isFinding ? (
              <div className={radioGroup} style={{ padding: 0 }}>
                <div className={`${radioText} ${reviewFindingsYes}`}>Yes</div>
                <div
                  className={
                    viewMore.interventionDescription
                      ? reviewTextFull
                      : reviewText
                  }
                  style={{
                    marginBlockEnd:
                      reviewData.safeReport?.interventionDescription?.length <
                      760
                        ? pxToRem(12)
                        : undefined
                  }}
                >
                  {reviewData.safeReport?.interventionDescription
                    ? reviewData.safeReport?.interventionDescription
                    : '-'}
                </div>
                {reviewData.safeReport?.interventionDescription?.length >=
                  760 && (
                  <div
                    className={viewMoreButton}
                    onClick={() => onClickView('interventionDescription')}
                  >
                    {!viewMore.interventionDescription
                      ? 'View More'
                      : 'View Less'}
                  </div>
                )}
              </div>
            ) : (
              <div className={radioGroup}>
                <Typography.Text className={radioText}>No</Typography.Text>
              </div>
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ReviewReport;
