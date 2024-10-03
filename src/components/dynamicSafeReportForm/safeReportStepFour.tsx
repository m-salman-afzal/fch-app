import { FC, useEffect, useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  Col,
  FormInstance,
  Grid,
  Popover,
  Radio,
  Tooltip,
  Typography
} from 'antd';
import {
  ErrorMessage,
  VsFormItem,
  VsTextAreaFormItem,
  VsTooltip
} from 'vs-design-components';

import { SAFE_REPORT_EVENT_SEVERITY_SCREENS } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import VsSegmented from '../common/segmented/VsSegmented';
import { useDynamicSafeReportStyle } from './useDynamicSafeReportStyle';

const { useBreakpoint } = Grid;
interface Props {
  onScreen?: string;
  onChangeScreen: (data: any) => void;
  reportFormRef: FormInstance;
}

export const SafeReportFormStepFour: FC<Props> = ({
  onScreen,
  onChangeScreen,
  reportFormRef
}) => {
  const size = useBreakpoint();
  const {
    eventSeverityStepContainer,
    nearMissRadioGroup,
    activeRecoveryFormItem,
    safeReportTextAreContainer
  } = useDynamicSafeReportStyle();
  const segments = [];
  segments.push(Object.values(SAFE_REPORT_EVENT_SEVERITY_SCREENS)[0]);
  segments.push(Object.values(SAFE_REPORT_EVENT_SEVERITY_SCREENS)[1]);

  return (
    <>
      {reportFormRef.getFieldValue('eventType')[0] === 'OTHER_ISSUE' ? (
        <div
          style={{
            width: size.xs ? undefined : '100%',
            paddingInline: size.xs ? 0 : pxToRem(24)
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
        <div
          style={
            size?.xs
              ? { width: size?.xs ? `100%` : pxToRem(463) }
              : {
                  width: size?.xs ? `100%` : pxToRem(463),
                  maxHeight: 750,
                  overflow: 'auto',
                  scrollBehavior: 'smooth'
                }
          }
          className={eventSeverityStepContainer}
        >
          <VsSegmented
            segmentedProps={{
              options: [
                {
                  label: (
                    <div>
                      {Object.values(SAFE_REPORT_EVENT_SEVERITY_SCREENS)[0]}
                      <Tooltip title="An event or situation that could have resulted in harm to a patient but did not, either by chance or through timely intervention">
                        <InfoCircleOutlined
                          style={{
                            paddingLeft: pxToRem(8),
                            color: '#00000073'
                          }}
                        />
                      </Tooltip>
                    </div>
                  ),
                  value: Object.values(SAFE_REPORT_EVENT_SEVERITY_SCREENS)[0]
                },
                {
                  label: Object.values(SAFE_REPORT_EVENT_SEVERITY_SCREENS)[1],
                  value: Object.values(SAFE_REPORT_EVENT_SEVERITY_SCREENS)[1]
                }
              ],
              defaultValue: segments[0],
              block: true,
              value: onScreen,
              onChange: data => {
                onChangeScreen(data);
                reportFormRef.resetFields([
                  'action',
                  'recommendation',
                  'situation',
                  'background',
                  'result'
                ]);
              },
              style: { maxWidth: size?.xs ? `100%` : pxToRem(260) }
            }}
          />
          {onScreen === 'Near Miss' && (
            <>
              <Col
                style={{
                  width: `100%`,
                  marginTop: pxToRem(20),
                  paddingRight: size.xs ? undefined : pxToRem(24)
                }}
                className={activeRecoveryFormItem}
              >
                <VsFormItem
                  formItemProps={{
                    rules: [
                      {
                        required: true,
                        message: (
                          <ErrorMessage>Specify one of the above</ErrorMessage>
                        )
                      }
                    ],
                    name: 'nearMiss'
                  }}
                >
                  <Radio.Group name="nearMiss" className={nearMissRadioGroup}>
                    <Radio value={`INCIDENTAL`}>
                      Incidental
                      <Tooltip title="A near-miss that was discovered by chance">
                        <InfoCircleOutlined
                          style={{
                            paddingLeft: pxToRem(8),
                            color: '#00000073'
                          }}
                        />
                      </Tooltip>
                    </Radio>
                    <Radio value={`ACTIVE_RECOVERY`}>
                      Active Recovery through a Process
                      <Tooltip title="A near miss that was discovered as a result of following established process/procedure">
                        <InfoCircleOutlined
                          style={{
                            paddingLeft: pxToRem(8),
                            color: '#00000073'
                          }}
                        />
                      </Tooltip>
                    </Radio>
                  </Radio.Group>
                </VsFormItem>
              </Col>
            </>
          )}
          {onScreen === 'Reached Patient' && (
            <>
              <Col
                style={{
                  width: size?.xs ? `100%` : pxToRem(364),
                  marginTop: pxToRem(20)
                }}
              >
                <Typography.Text
                  style={{ color: 'rgba(0, 0, 0, 0.88)', fontWeight: 600 }}
                >
                  Was Patient Harmed?
                </Typography.Text>
              </Col>
              <Col
                style={{
                  width: size?.xs ? `100%` : pxToRem(364),
                  marginTop: pxToRem(20)
                }}
                className={activeRecoveryFormItem}
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
                    className={nearMissRadioGroup}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: pxToRem(10)
                    }}
                  >
                    <Radio value={`yes`} style={{ width: pxToRem(103) }}>
                      Yes
                    </Radio>
                    <Radio value={`no`} style={{ width: pxToRem(103) }}>
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
              width: `100%`,
              marginTop: pxToRem(20),
              paddingRight: size.xs ? undefined : pxToRem(24)
            }}
            className={safeReportTextAreContainer}
          >
            <VsTextAreaFormItem
              placeholder="Situation"
              rows={3}
              formItemProps={{
                rules: [
                  {
                    required: true,
                    min: 10,
                    message: (
                      <ErrorMessage>
                        Type Situation (min 10 characters)
                      </ErrorMessage>
                    )
                  }
                ],
                name: 'situation'
              }}
              formNamePath={['situation']}
              width="100%"
              autoSize={{ minRows: 3 }}
            />
          </Col>
          <Col
            style={{
              width: `100%`,
              marginTop: pxToRem(20),
              paddingRight: size.xs ? undefined : pxToRem(24)
            }}
            className={safeReportTextAreContainer}
          >
            <VsTextAreaFormItem
              placeholder="Background"
              rows={3}
              formItemProps={{
                rules: [
                  {
                    required: true,
                    min: 10,
                    message: (
                      <ErrorMessage>
                        Type Background (min 10 characters)
                      </ErrorMessage>
                    )
                  }
                ],
                name: 'background'
              }}
              formNamePath={['background']}
              width="100%"
              autoSize={{ minRows: 3 }}
            />
          </Col>
          <Col
            style={{
              width: `100%`,
              marginTop: pxToRem(20),
              paddingRight: size.xs ? undefined : pxToRem(24)
            }}
            className={safeReportTextAreContainer}
          >
            <VsTextAreaFormItem
              placeholder="Action"
              rows={3}
              formItemProps={{
                rules: [
                  {
                    required: true,
                    min: 10,
                    message: (
                      <ErrorMessage>
                        Type Action (min 10 characters)
                      </ErrorMessage>
                    )
                  }
                ],
                name: 'action'
              }}
              formNamePath={['action']}
              width="100%"
              autoSize={{ minRows: 3 }}
            />
          </Col>
          <Col
            style={{
              width: `100%`,
              marginTop: pxToRem(20),
              paddingRight: size.xs ? undefined : pxToRem(24)
            }}
            className={safeReportTextAreContainer}
          >
            <VsTextAreaFormItem
              placeholder="Recommendations"
              rows={3}
              formItemProps={{
                rules: [
                  {
                    required: true,
                    min: 10,
                    message: (
                      <ErrorMessage>
                        Type Recommendations (min 10 characters)
                      </ErrorMessage>
                    )
                  }
                ],
                name: 'recommendation'
              }}
              formNamePath={['recommendation']}
              width="100%"
              autoSize={{ minRows: 3 }}
            />
          </Col>
          <Col
            style={{
              width: `100%`,
              marginTop: pxToRem(20),
              paddingRight: size.xs ? undefined : pxToRem(24)
            }}
            className={safeReportTextAreContainer}
          >
            <VsTextAreaFormItem
              placeholder="Results"
              rows={3}
              formItemProps={{
                rules: [
                  {
                    required: true,
                    min: 10,
                    message: (
                      <ErrorMessage>
                        Type Results (min 10 characters)
                      </ErrorMessage>
                    )
                  }
                ],
                name: 'result'
              }}
              formNamePath={['result']}
              width="100%"
              autoSize={{ minRows: 3 }}
            />
          </Col>
        </div>
      )}
    </>
  );
};
