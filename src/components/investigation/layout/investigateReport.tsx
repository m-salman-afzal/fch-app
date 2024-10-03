import { useEffect, useRef, useState } from 'react';
import { Col, Form, FormInstance, Radio, Row, Typography } from 'antd';
import { ErrorMessage, VsTextAreaFormItem } from 'vs-design-components';

import { TReportData } from '@/types/safeReportTypes';

import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';

import {
  FACILITY_CHECKLIST_EVENT_DISPLAY_NAMES,
  FACILITY_CHECKLIST_EVENTS,
  FACILITY_CHECKLIST_ITEMS
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useInvestigateReportStyle } from './useInvestigateReportStyle';

interface props {
  investigateData: TReportData;
  isReassign: boolean;
  eventsList: any[];
  form: FormInstance<any>;
  onSubmitInvestigation: (
    values: any,
    noteRequired: boolean
  ) => Promise<void | boolean>;
  investigationFacilityChecklist: any[];
  noteRequired: boolean;
  setNoteRequired: (x: boolean) => void;
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
const InvestigateReport: React.FC<props> = ({
  investigateData,
  isReassign,
  form,
  onSubmitInvestigation,
  investigationFacilityChecklist,
  noteRequired,
  setNoteRequired
}) => {
  const {
    investigateReportContainer,
    titleClass,
    investigationTitle,
    subHeading,
    investigateReportSecion,
    ownerPill,
    radioGroup,
    radioText,
    investigateReportSecionEnd,
    assigneeContainer
  } = useInvestigateReportStyle();

  const scrollRef = useRef<any>();

  useEffect(() => {
    if (!noteRequired) {
      form.setFieldValue('interventionDescription', '');
    }
  }, [noteRequired]);

  useEffect(() => {
    if (isReassign) {
      scrollRef?.current?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [isReassign]);

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
                  investigateData.assignees.map(
                    v => `${v.lastName}, ${v.firstName}`
                  )
                )
              ).length > 1
                ? 'Assignees'
                : 'Assignee'}
            </Typography.Text>
            <div className={assigneeContainer}>
              {Array.from(
                new Set(
                  investigateData.assignees.map(
                    v => `${v.lastName}, ${v.firstName}`
                  )
                )
              ).map(assign => (
                <ColorfulPill key={assign} text={assign} />
              ))}
            </div>
          </Col>
        </Row>

        {investigateData.type !== 'ISSUE' && (
          <Row className={investigateReportSecion}>
            <Col span={24}>
              <Typography.Text className={subHeading}>Owner</Typography.Text>
              <div style={{ marginBlockStart: pxToRem(16) }}>
                <ColorfulPill
                  className={ownerPill}
                  text={`${investigateData.owner.lastName}, ${investigateData.owner.firstName}`}
                />
              </div>
            </Col>
          </Row>
        )}

        <Form
          form={form}
          onFinish={async values =>
            await onSubmitInvestigation(values, noteRequired)
          }
          scrollToFirstError={true}
        >
          <Row
            className={investigateReportSecion}
            style={{ paddingBlockEnd: pxToRem(0) }}
          >
            <Col span={24}>
              <Typography.Text className={subHeading}>
                Involved Parties
              </Typography.Text>
              <VsTextAreaFormItem
                width="100%"
                placeholder="Involved Party"
                autoSize={{ minRows: 3 }}
                formItemProps={{
                  name: 'involvedPartyText',
                  validateTrigger: ['onSubmit'],
                  style: {
                    marginBlockStart: pxToRem(24)
                  },
                  normalize: value => value.trimStart(),
                  rules: [
                    {
                      required:
                        investigateData.type === 'ISSUE' ? false : !isReassign,
                      message: (
                        <ErrorMessage>
                          Enter Involved Party Description
                        </ErrorMessage>
                      )
                    }
                  ]
                }}
              />
              {investigateData.type !== 'ISSUE' && (
                <div>
                  <div
                    style={{ marginBlockStart: pxToRem(24) }}
                    className={subHeading}
                  >
                    Severity of Event{' '}
                  </div>
                  <Form.Item
                    name={'involvedParty'}
                    rules={[
                      {
                        required: !isReassign,
                        message: (
                          <ErrorMessage
                            customStyle={{
                              marginBlockEnd: pxToRem(10),
                              display: 'flex',
                              columnGap: pxToRem(5),
                              color: '#cf1322',
                              fontSize: pxToRem(12)
                            }}
                          >
                            Select One
                          </ErrorMessage>
                        )
                      }
                    ]}
                  >
                    <Radio.Group style={{ marginBlockStart: pxToRem(24) }}>
                      {involvedPartiesOptions.map(option => (
                        <div key={option.key} className={radioGroup}>
                          <Radio key={option.key} value={option.name} />{' '}
                          <Typography.Text className={radioText}>
                            {option.text}
                          </Typography.Text>
                        </div>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </div>
              )}
            </Col>
          </Row>

          <Row
            className={investigateReportSecion}
            style={{ paddingBlockEnd: 0 }}
          >
            <Col span={24}>
              <Typography.Text className={subHeading}>Findings</Typography.Text>
              <VsTextAreaFormItem
                width="100%"
                placeholder="Findings"
                autoSize={{ minRows: 5 }}
                formItemProps={{
                  style: {
                    marginBlockStart: pxToRem(24)
                  },
                  name: 'findings',
                  validateTrigger: ['onSubmit'],
                  normalize: value => value.trimStart(),

                  rules: [
                    {
                      required: !isReassign,
                      message: <ErrorMessage>Enter Findings</ErrorMessage>
                    }
                  ]
                }}
              />
              <div
                style={{ marginBlockStart: pxToRem(24) }}
                className={radioText}
              >
                Were any interventions/process improvements required?{' '}
              </div>{' '}
              <Form.Item name={'isFinding'}>
                <Radio.Group
                  style={{ marginBlockStart: pxToRem(12), width: '100%' }}
                  onChange={e => {
                    setNoteRequired(e.target.value);
                  }}
                >
                  <div
                    className={radioGroup}
                    style={{
                      marginBlockEnd: pxToRem(-2),
                      borderEndStartRadius: 0,
                      borderEndEndRadius: 0
                    }}
                  >
                    <Radio key={'Yes'} value={true} />{' '}
                    <Typography.Text className={radioText}>Yes</Typography.Text>
                  </div>

                  <VsTextAreaFormItem
                    width="100%"
                    placeholder="Note"
                    autoSize={{ minRows: 4 }}
                    formItemProps={{
                      name: 'interventionDescription',
                      validateTrigger: ['onSubmit'],
                      normalize: value => value.trimStart(),
                      rules: [
                        {
                          required: noteRequired && !isReassign,
                          message: (
                            <ErrorMessage>
                              Enter Intervention Description
                            </ErrorMessage>
                          )
                        }
                      ]
                    }}
                  />

                  <div
                    className={radioGroup}
                    style={{ marginBlockStart: pxToRem(16) }}
                  >
                    <Radio key={'No'} value={false} />{' '}
                    <Typography.Text className={radioText}>No</Typography.Text>
                  </div>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {isReassign && (
            <Row className={investigateReportSecionEnd}>
              <Col span={24}>
                <Typography.Text className={subHeading}>
                  Reassign Ownership
                </Typography.Text>
                <Form.Item
                  name={'eventType'}
                  rules={[
                    {
                      required: true,
                      message: (
                        <ErrorMessage
                          customStyle={{
                            marginBlockEnd: pxToRem(10),
                            display: 'flex',
                            columnGap: pxToRem(5),
                            color: '#cf1322',
                            fontSize: pxToRem(12)
                          }}
                        >
                          Select One
                        </ErrorMessage>
                      )
                    }
                  ]}
                >
                  <Radio.Group
                    style={{ marginBlockStart: pxToRem(12), width: '100%' }}
                  >
                    {investigationFacilityChecklist
                      .filter(
                        fc =>
                          fc.event !== FACILITY_CHECKLIST_EVENTS.ISSUE_REPORT
                      )
                      .map(event => (
                        <div
                          key={event.facilityChecklistId}
                          style={{ marginBlockEnd: pxToRem(16) }}
                        >
                          <Radio
                            key={event.facilityChecklistId}
                            value={event.event}
                            disabled={
                              event.event ===
                              investigateData.safeReport.eventType
                            }
                          />{' '}
                          <Typography.Text
                            style={{
                              opacity:
                                event.event ===
                                investigateData.safeReport.eventType
                                  ? 0.5
                                  : undefined
                            }}
                          >
                            {
                              FACILITY_CHECKLIST_EVENT_DISPLAY_NAMES[
                                event.event
                              ]
                            }
                          </Typography.Text>
                          <ColorfulPill
                            className={
                              event.event ===
                                investigateData.safeReport.eventType &&
                              ownerPill
                            }
                            text={`${event.admin?.lastName}, ${event.admin?.firstName}`}
                            style={{ marginInlineStart: pxToRem(16) }}
                          />
                        </div>
                      ))}
                  </Radio.Group>
                </Form.Item>
                <div style={{ marginBlockStart: pxToRem(-24) }}>
                  <VsTextAreaFormItem
                    formItemProps={{
                      name: 'safeAssignmentComment',
                      rules: [
                        {
                          required: false
                        }
                      ]
                    }}
                    width="100%"
                    placeholder="Comment (Optional)"
                    autoSize={{ minRows: 4 }}
                  />
                </div>
              </Col>
              <div
                ref={scrollRef}
                style={{ height: pxToRem(12), width: '100%' }}
              ></div>
            </Row>
          )}
        </Form>
      </Col>
    </Row>
  );
};

export default InvestigateReport;
