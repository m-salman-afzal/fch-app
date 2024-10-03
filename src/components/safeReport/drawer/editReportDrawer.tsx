import { FC, useEffect, useState } from 'react';
import {
  Checkbox,
  Col,
  Divider,
  Form,
  FormInstance,
  Grid,
  Input,
  Radio,
  Row,
  Typography
} from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsFormItem,
  VsSelectFormItem,
  VsTextAreaFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TReportData } from '@/types/safeReportTypes';

import ReportDrawer from '@/components/common/reportDrawer/reportDrawer';
import { LabeledTextArea } from '@/components/common/textArea/LabeledTextArea';

import { SAFE_SEVERITY_TYPES } from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import { useSafeReportDrawerStyle } from './drawerStyles';

const { useBreakpoint } = Grid;

interface Props {
  drawerOpen: boolean;
  setDrawerOpen: (val: boolean) => void;
  drawerData: TReportData;
  handleSubmit: (data: any) => Promise<void>;
  reportFormRef: FormInstance;
  isLoading: boolean;
}

const EVENT_TYPES = [
  { label: 'Medication', value: 'MEDICATION', key: 'medication' },
  { label: 'Mental Health', value: 'MENTAL_HEALTH', key: 'mentalHealth' },
  {
    label: 'Patient or Employee Safety',
    value: 'EMPLOYEE_SAFETY',
    key: 'employeeSafety'
  },
  { label: 'Environmental', value: 'ENVIRONMENTAL', key: 'environmental' },
  {
    label: 'Equipment Malfunction',
    value: 'EQUIPMENT_MALFUNCTION',
    key: 'equipmentMalfunction'
  },
  { label: 'Other Issue', value: 'OTHER_ISSUE', key: 'otherIssue' }
];

export const EditReportDrawer: FC<Props> = ({
  drawerData,
  setDrawerOpen,
  drawerOpen,
  handleSubmit,
  reportFormRef,
  isLoading
}) => {
  const isSmall = window.screen.width <= 576;
  const size = useBreakpoint();

  const [selectedLocations, setSelectedLocations] = useState<any[]>(
    reportFormRef.getFieldValue(['eventLocation']) || []
  );

  const [severityType, setSeverityType] = useState('');

  const [checkedList, setCheckedList] = useState<string[]>([]);

  const { subject } = useSafeReportDrawerStyle();

  const [showSubjectInput, setShowSubjectInput] = useState(false);

  const onChangeLocation = (checkedValues: any[]) => {
    if (checkedValues[0] === 'OTHER_ISSUE' && checkedValues.length > 1) {
      setCheckedList(checkedValues.slice(1));
      reportFormRef.setFieldValue('eventType', checkedValues.slice(1));

      return;
    }
    if (checkedValues.includes('OTHER_ISSUE')) {
      setCheckedList(['OTHER_ISSUE']);
      reportFormRef.setFieldValue('eventType', ['OTHER_ISSUE']);

      return;
    }

    setCheckedList(checkedValues);
  };

  const onChangeEventLocation = (locations: any) => {
    setSelectedLocations(locations);
  };

  const getFormattedTime = () => {
    if (drawerData.safeReport?.date && drawerData.safeReport?.time) {
      return getFormattedDateNoTimeZone({
        date: `${drawerData.safeReport.date} ${drawerData.safeReport.time}`,
        format: DATE_FORMATS.MDY_TIME
      });
    }

    return getFormattedDateNoTimeZone({
      date: `${drawerData.safeReport.date}`,
      format: DATE_FORMATS.MDY
    });
  };

  const onChangeSeverityType = (val: string) => {
    setSeverityType(val);
  };

  useEffect(() => {
    reportFormRef.setFieldsValue({
      subject: drawerData.description,
      eventLocation: drawerData.safeReportEventLocation.map(e => e.location),
      eventType: !drawerData.safeFacilityChecklist.length
        ? ['OTHER_ISSUE']
        : drawerData.safeFacilityChecklist[0] === 'ISSUE_REPORT'
          ? ['OTHER_ISSUE']
          : drawerData.safeFacilityChecklist,
      cartName:
        drawerData.safeReportEventLocation.find(
          x => x.location === 'MEDICATION_CART'
        )?.description ?? undefined,
      housingUnit:
        drawerData.safeReportEventLocation.find(
          x => x.location === 'HOUSING_UNIT'
        )?.description ?? undefined,
      other:
        drawerData.safeReportEventLocation.find(x => x.location === 'OTHER')
          ?.description ?? undefined,
      severityType: drawerData.safeReport.severityType ?? undefined,
      situation: drawerData.safeReport.sbarrSituation,
      background: drawerData.safeReport.sbarrBackground,
      action: drawerData.safeReport.sbarrAction,
      recommendation: drawerData.safeReport.sbarrRecommendation,
      result: drawerData.safeReport.sbarrResult,
      nearMiss: drawerData.safeReport.nearMissType,
      detail: drawerData.safeReport.detail,
      patientHarmed:
        drawerData.safeReport.isPatientHarmed == null
          ? undefined
          : drawerData.safeReport.isPatientHarmed
            ? 'yes'
            : 'no'
    });

    setSelectedLocations(reportFormRef.getFieldValue('eventLocation'));
    setSeverityType(reportFormRef.getFieldValue('severityType'));
  }, []);

  return (
    <ReportDrawer
      isOpen={drawerOpen}
      commentsArray={drawerData.comment}
      titleCtas={
        <div
          style={{
            display: 'flex',
            gap: pxToRem(12),
            marginRight: pxToRem(12)
          }}
        >
          <VsButton
            size={BUTTON_SIZES.middle}
            onClick={() => {
              setDrawerOpen(false);
              reportFormRef.resetFields();
            }}
          >
            Discard Changes
          </VsButton>
          <VsButton
            antButtonProps={{
              type: 'primary',
              loading: isLoading
            }}
            size={BUTTON_SIZES.middle}
            onClick={async () => {
              await reportFormRef.validateFields();
              const data = reportFormRef.getFieldsValue();
              data.reportId = drawerData.reportId;
              await handleSubmit(data);
              setDrawerOpen(false);
            }}
          >
            Submit
          </VsButton>
        </div>
      }
      onClickClose={() => {
        setDrawerOpen(false);
      }}
    >
      <div
        style={{
          paddingInline: pxToRem(32),
          paddingBlock: pxToRem(16),
          maxWidth: !isSmall ? pxToRem(557) : undefined,
          minWidth: !isSmall ? pxToRem(557) : undefined
        }}
      >
        <Form form={reportFormRef} onFinish={handleSubmit}>
          <Row>
            <Col span={23}>
              {!showSubjectInput ? (
                <div
                  className={subject}
                  onClick={() => setShowSubjectInput(true)}
                >
                  {drawerData.description}
                </div>
              ) : (
                <Form.Item
                  name="subject"
                  rules={[
                    {
                      required: true,
                      min: 10,
                      message: (
                        <ErrorMessage>
                          Type Subject (Min. 10 Characters)
                        </ErrorMessage>
                      )
                    }
                  ]}
                >
                  <Input
                    placeholder="Subject"
                    maxLength={50}
                    style={{
                      fontSize: pxToRem(20),
                      fontWeight: 600,
                      borderRadius: 4,
                      padding: pxToRem(8),
                      lineHeight: pxToRem(28)
                    }}
                    autoFocus={true}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>

          <Divider style={{ marginTop: 0 }} />
          <Row justify={'space-between'} gutter={[16, 16]}>
            <Col>
              <Row style={{ marginBottom: pxToRem(10) }}>
                <Typography.Text style={{ fontWeight: 600 }}>
                  Generated By
                </Typography.Text>
              </Row>
              <Row style={{ fontSize: pxToRem(12) }}>
                {drawerData.admin?.firstName
                  ? `${drawerData.admin.lastName}, ${drawerData.admin.firstName} ${drawerData.admin.isDeleted ? '(Deleted User)' : ''}`
                  : 'Anonymous'}
              </Row>
            </Col>
            <Col>
              <Row style={{ marginBottom: pxToRem(10) }}>
                <Typography.Text style={{ fontWeight: 600 }}>
                  Date & Time
                </Typography.Text>
              </Row>
              <Row style={{ fontSize: pxToRem(12) }}>{getFormattedTime()}</Row>
            </Col>
            <Col>
              <Row style={{ marginBottom: pxToRem(10) }}>
                <Typography.Text style={{ fontWeight: 600 }}>
                  Facility
                </Typography.Text>
              </Row>
              <Row style={{ fontSize: pxToRem(12) }}>
                {drawerData.facility?.facilityName}
              </Row>
            </Col>
          </Row>
          <Divider />

          <Typography.Text style={{ fontWeight: 600 }}>
            Event Location
          </Typography.Text>
          <VsFormItem
            formItemProps={{
              rules: [
                {
                  required: true,
                  message: (
                    <ErrorMessage>Select atleast one location</ErrorMessage>
                  )
                }
              ],
              name: 'eventLocation'
            }}
          >
            <Checkbox.Group
              name="eventLocation"
              onChange={onChangeEventLocation}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: pxToRem(14),
                marginTop: pxToRem(14)
              }}
            >
              <Checkbox value="INTAKE">Intake</Checkbox>
              <Checkbox value="MEDICAL_UNIT_INFIRMARY">
                Medical Unit (Infirmary)
              </Checkbox>
              <Checkbox value="CLINIC">Clinic</Checkbox>
              <Checkbox value="HOUSING_UNIT">Housing Unit</Checkbox>
              {selectedLocations.includes('HOUSING_UNIT') && (
                <BasicInputFormItem
                  placeholder="Housing Unit"
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: <ErrorMessage>Enter Housing Unit</ErrorMessage>
                      }
                    ],
                    name: 'housingUnit',
                    style: {
                      marginLeft: pxToRem(20),
                      marginBottom: 0
                    }
                  }}
                  formNamePath={['housingUnit']}
                  width={isSmall ? pxToRem(300) : pxToRem(340)}
                />
              )}
              <Checkbox value="MEDICATION_CART">Medication Cart</Checkbox>
              {selectedLocations.includes('MEDICATION_CART') && (
                <BasicInputFormItem
                  placeholder="Cart Name"
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: <ErrorMessage>Enter Cart</ErrorMessage>
                      }
                    ],
                    name: 'cartName',
                    style: {
                      marginLeft: pxToRem(20),
                      marginBottom: 0
                    }
                  }}
                  formNamePath={['cartName']}
                  width={isSmall ? pxToRem(300) : pxToRem(340)}
                />
              )}
              <Checkbox value="OTHER">Other</Checkbox>
              {selectedLocations.includes('OTHER') && (
                <BasicInputFormItem
                  placeholder="Other"
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: (
                          <ErrorMessage>Enter other location</ErrorMessage>
                        )
                      }
                    ],
                    name: 'other',
                    style: {
                      marginLeft: pxToRem(20),
                      marginBottom: 0
                    }
                  }}
                  formNamePath={['other']}
                  width={isSmall ? pxToRem(300) : pxToRem(340)}
                />
              )}
            </Checkbox.Group>
          </VsFormItem>
          <Divider />

          <Typography.Text style={{ fontWeight: 600 }}>
            Event Type
          </Typography.Text>

          <VsFormItem
            formItemProps={{
              rules: [
                {
                  required: true,
                  message: <ErrorMessage>Select atleast one event</ErrorMessage>
                }
              ],
              name: 'eventType'
            }}
          >
            <Checkbox.Group
              name="eventType"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: pxToRem(14),
                marginTop: pxToRem(14)
              }}
              onChange={onChangeLocation}
              value={checkedList}
            >
              {EVENT_TYPES.map(reportEvent => {
                return (
                  <>
                    {reportEvent.key === 'otherIssue' && (
                      <Divider style={{ marginBlock: pxToRem(0) }} />
                    )}
                    <Checkbox
                      key={reportEvent?.value}
                      value={reportEvent?.value}
                    >
                      {reportEvent?.label}
                    </Checkbox>
                  </>
                );
              })}
            </Checkbox.Group>
          </VsFormItem>

          <Typography.Text style={{ fontWeight: 600 }}>
            {reportFormRef?.getFieldValue('eventType')?.[0] === 'OTHER_ISSUE'
              ? 'Details of Issue'
              : 'Event Severity'}
          </Typography.Text>
          <div style={{ marginTop: pxToRem(16) }}>
            {reportFormRef?.getFieldValue('eventType')?.[0] ===
            'OTHER_ISSUE' ? (
              <div
                style={{
                  width: size.xs ? undefined : '100%'
                }}
              >
                <VsTextAreaFormItem
                  formItemProps={{
                    name: 'detail',
                    rules: [
                      {
                        required: true,
                        min: 10,
                        message: (
                          <ErrorMessage>
                            Type Details (min 10 characters)
                          </ErrorMessage>
                        )
                      }
                    ]
                  }}
                  width="100%"
                  autoSize={{ minRows: 15 }}
                  placeholder="Type Here"
                />
              </div>
            ) : (
              <div>
                <div style={{ width: size.xs ? '100%' : pxToRem(364) }}>
                  <VsSelectFormItem
                    options={[
                      {
                        label: 'Near Miss',
                        value: SAFE_SEVERITY_TYPES.NEAR_MISS,
                        key: 'nearMiss'
                      },
                      {
                        label: 'Reached Patient',
                        value: SAFE_SEVERITY_TYPES.REACHED_PATIENT,
                        key: 'reachedPatient'
                      }
                    ]}
                    onChange={onChangeSeverityType}
                    placeholder="Severity Type"
                    formItemProps={{
                      name: 'severityType',
                      rules: [
                        {
                          required: true,
                          message: (
                            <ErrorMessage>
                              Severity Type is Required
                            </ErrorMessage>
                          )
                        }
                      ]
                    }}
                  />
                </div>
                {severityType === SAFE_SEVERITY_TYPES.NEAR_MISS && (
                  <>
                    <Col
                      style={{
                        width: size?.xs ? `100%` : pxToRem(364),
                        marginTop: pxToRem(20)
                      }}
                    >
                      <VsFormItem
                        formItemProps={{
                          rules: [
                            {
                              required: true,
                              message: (
                                <ErrorMessage>
                                  Specify one of the above
                                </ErrorMessage>
                              )
                            }
                          ],
                          name: 'nearMiss'
                        }}
                      >
                        <Radio.Group
                          name="nearMiss"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: pxToRem(20)
                          }}
                        >
                          <Radio
                            style={{
                              borderRadius: pxToRem(4),
                              paddingInline: pxToRem(16),
                              paddingBlock: pxToRem(12),
                              border: `${pxToRem(1)} solid #00000026`,
                              marginInlineEnd: 0
                            }}
                            value={`INCIDENTAL`}
                          >
                            Incidental
                          </Radio>
                          <Radio
                            style={{
                              borderRadius: pxToRem(4),
                              paddingInline: pxToRem(16),
                              paddingBlock: pxToRem(12),
                              border: `${pxToRem(1)} solid #00000026`,
                              marginInlineEnd: 0
                            }}
                            value={`ACTIVE_RECOVERY`}
                          >
                            Active Recovery through a Process
                          </Radio>
                        </Radio.Group>
                      </VsFormItem>
                    </Col>
                  </>
                )}
                {severityType === SAFE_SEVERITY_TYPES.REACHED_PATIENT && (
                  <>
                    <Col
                      style={{
                        width: size?.xs ? `100%` : pxToRem(364),
                        marginTop: pxToRem(20)
                      }}
                    >
                      <Typography.Text
                        style={{
                          color: 'rgba(0, 0, 0, 0.88)',
                          fontWeight: 600
                        }}
                      >
                        Was Patient Harmed?
                      </Typography.Text>
                    </Col>
                    <Col
                      style={{
                        width: size?.xs ? `100%` : pxToRem(364),
                        marginTop: pxToRem(20)
                      }}
                    >
                      <VsFormItem
                        formItemProps={{
                          rules: [
                            {
                              required: true,
                              message: (
                                <ErrorMessage>
                                  Specify patient was harmed or not?
                                </ErrorMessage>
                              )
                            }
                          ],
                          name: 'patientHarmed'
                        }}
                      >
                        <Radio.Group
                          name="patientHarmed"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: pxToRem(20)
                          }}
                        >
                          <Radio
                            value={'yes'}
                            style={{
                              borderRadius: pxToRem(4),
                              paddingInline: pxToRem(16),
                              paddingBlock: pxToRem(12),
                              border: `${pxToRem(1)} solid #00000026`,
                              marginInlineEnd: 0
                            }}
                          >
                            Yes
                          </Radio>
                          <Radio
                            value={'no'}
                            style={{
                              borderRadius: pxToRem(4),
                              paddingInline: pxToRem(16),
                              paddingBlock: pxToRem(12),
                              border: `${pxToRem(1)} solid #00000026`,
                              marginInlineEnd: 0
                            }}
                          >
                            No
                          </Radio>
                        </Radio.Group>
                      </VsFormItem>
                    </Col>
                  </>
                )}
                <Col
                  style={{
                    width: size?.xs ? `90%` : pxToRem(364),
                    marginTop: pxToRem(20)
                  }}
                >
                  <Typography.Text
                    style={{ color: 'rgba(0, 0, 0, 0.88)', fontWeight: 600 }}
                  >
                    SBARR
                  </Typography.Text>
                </Col>
                <Col
                  style={{
                    marginTop: pxToRem(20)
                  }}
                >
                  <Form.Item
                    name="situation"
                    rules={[
                      {
                        required: true,
                        min: 10,
                        message: (
                          <ErrorMessage>
                            Type Situation (min 10 characters)
                          </ErrorMessage>
                        )
                      }
                    ]}
                  >
                    <LabeledTextArea
                      placeholder="Situation"
                      autoSize={{ minRows: 3 }}
                      width="100%"
                    />
                  </Form.Item>
                </Col>
                <Col
                  style={{
                    marginTop: pxToRem(20)
                  }}
                >
                  <Form.Item
                    name="background"
                    rules={[
                      {
                        required: true,
                        min: 10,
                        message: (
                          <ErrorMessage>
                            Type Background (min 10 characters)
                          </ErrorMessage>
                        )
                      }
                    ]}
                  >
                    <LabeledTextArea
                      placeholder="Background"
                      autoSize={{ minRows: 3 }}
                      width="100%"
                    />
                  </Form.Item>
                </Col>
                <Col
                  style={{
                    marginTop: pxToRem(20)
                  }}
                >
                  <Form.Item
                    name="action"
                    rules={[
                      {
                        required: true,
                        min: 10,
                        message: (
                          <ErrorMessage>
                            Type Action (min 10 characters)
                          </ErrorMessage>
                        )
                      }
                    ]}
                  >
                    <LabeledTextArea
                      placeholder="Action"
                      autoSize={{ minRows: 3 }}
                      width="100%"
                    />
                  </Form.Item>
                </Col>
                <Col
                  style={{
                    marginTop: pxToRem(20)
                  }}
                >
                  <Form.Item
                    name="recommendation"
                    rules={[
                      {
                        required: true,
                        min: 10,
                        message: (
                          <ErrorMessage>
                            Type Recommendations (min 10 characters)
                          </ErrorMessage>
                        )
                      }
                    ]}
                  >
                    <LabeledTextArea
                      placeholder="Recommendations"
                      autoSize={{ minRows: 3 }}
                      width="100%"
                    />
                  </Form.Item>
                </Col>
                <Col
                  style={{
                    marginTop: pxToRem(20)
                  }}
                  span={24}
                >
                  <Form.Item
                    name="result"
                    rules={[
                      {
                        required: true,
                        min: 10,
                        message: (
                          <ErrorMessage>
                            Type Results (min 10 characters)
                          </ErrorMessage>
                        )
                      }
                    ]}
                  >
                    <LabeledTextArea
                      placeholder="Results"
                      autoSize={{ minRows: 3 }}
                      width="100%"
                    />
                  </Form.Item>
                </Col>
              </div>
            )}
          </div>
        </Form>
      </div>
    </ReportDrawer>
  );
};
