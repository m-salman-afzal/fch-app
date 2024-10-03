import { FC, useEffect, useState } from 'react';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseOutlined
} from '@ant-design/icons';
import {
  Col,
  Divider,
  Form,
  FormInstance,
  Grid,
  Modal,
  Row,
  Steps,
  Typography
} from 'antd';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import {
  SAFE_NEAR_MISS_TYPES,
  SAFE_REPORT_EVENT_SEVERITY_SCREENS
} from '../../utils/constants';
import { SafeReportFormStepFour } from './safeReportStepFour';
import { SafeReportFormStepOne } from './safeReportStepOne';
import { SafeReportFormStepThree } from './safeReportStepThree';
import { SafeReportFormStepTwo } from './safeReportStepTwo';
import { useDynamicSafeReportStyle } from './useDynamicSafeReportStyle';

const { useBreakpoint } = Grid;
interface Props {
  handleFormSubmit: (val: any) => void;
  reportFormRef: FormInstance;
  onCloseSafeReportForm: () => void;
  open?: boolean;
  currentSafeFormStep?: number;
  onChangeStepNumber?: (current: number) => void;
  onScreen?: string;
  onChangeScreen: (data: any) => void;
  onClickBackButton?: () => void;
  facilities?: any[];
  safeReportFormData: any;
  onChangeSafeReportDate: (date: any) => void;
  isLoading: boolean;
  isChecklist: boolean;
}

export const SafeReportForm: FC<Props> = ({
  onCloseSafeReportForm,
  open = false,
  handleFormSubmit,
  reportFormRef,
  currentSafeFormStep = 0,
  onChangeStepNumber,
  onScreen,
  onChangeScreen,
  onClickBackButton,
  facilities = [],
  safeReportFormData,
  onChangeSafeReportDate,
  isLoading,
  isChecklist
}) => {
  const steps = [
    {
      title: 'Primary Details',
      content: 'First-content'
    },
    {
      title: 'Location',
      content: 'Second-content'
    },
    {
      title: 'Event Type',
      content: 'Third-content'
    },
    {
      title: 'Severity',
      content: 'Last-content'
    }
  ];
  const items = steps.map(item => ({ key: item.title, title: item.title }));

  const size = useBreakpoint();
  const { safeReportFormStepsContainer } = useDynamicSafeReportStyle();

  useEffect(() => {
    reportFormRef.setFieldValue(
      'date',
      getFormattedDateNoTimeZone({ format: DATE_FORMATS.MDY })
    );
  }, []);

  return (
    <Modal
      open={open}
      footer={null}
      destroyOnClose
      width={size.xs ? '100%' : pxToRem(678)}
      style={{
        maxWidth: 'none',
        margin: 0
      }}
      styles={{
        content: {
          padding: 0
        }
      }}
      onCancel={onCloseSafeReportForm}
      maskClosable={false}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(20) }} />}
      centered
    >
      <Row style={{ flexDirection: size.xs ? `column` : `row` }}>
        <Col
          style={{
            width: size.xs ? `100%` : '25%',
            background: 'rgba(0, 0, 0, 0.04)'
          }}
        >
          <Steps
            className={safeReportFormStepsContainer}
            current={currentSafeFormStep}
            items={items}
            size={`small`}
            direction={size.xs ? `horizontal` : `vertical`}
            onChange={onChangeStepNumber}
            responsive={false}
          />
        </Col>
        <Col style={{ width: size.xs ? `100%` : '75%' }}>
          <Form
            form={reportFormRef}
            onFinish={handleFormSubmit}
            style={{
              width: '100%',
              display: `flex`,
              flexDirection: `column`,
              justifyContent: `center`,
              alignItems: `center`
            }}
            scrollToFirstError={true}
          >
            <Row
              style={{
                width: '100%',
                columnGap: pxToRem(11),
                height: size.xs ? pxToRem(500) : `100%`,
                overflow: 'auto',
                scrollBehavior: `smooth`,
                padding: size?.xs
                  ? `${pxToRem(6)} 5% 5% 5%`
                  : `${pxToRem(6)} 0 0 0`,
                rowGap: !size.xs ? pxToRem(6) : 0,
                justifyContent: size.xs ? `flex-start` : `center`,
                display: size.xs ? `block` : `flex`
              }}
            >
              <Col
                style={{
                  width: size.xs
                    ? '100%'
                    : onScreen ===
                          SAFE_REPORT_EVENT_SEVERITY_SCREENS.REACHEDPATIENT &&
                        currentSafeFormStep === 3
                      ? pxToRem(371)
                      : pxToRem(463),
                  marginTop: pxToRem(5)
                }}
              >
                <Typography.Text
                  style={{
                    fontWeight: 600,
                    fontSize: pxToRem(24)
                  }}
                >
                  {currentSafeFormStep === 0
                    ? `Generate Report`
                    : currentSafeFormStep === 1
                      ? `Event Location`
                      : currentSafeFormStep === 2
                        ? `Event Type`
                        : reportFormRef.getFieldValue('eventType')[0] ===
                            'OTHER_ISSUE'
                          ? `Details of Issue`
                          : `Event Severity`}
                </Typography.Text>
              </Col>
              <Divider style={{ marginBottom: 20, marginTop: pxToRem(4) }} />
              {currentSafeFormStep === 0 && (
                <SafeReportFormStepOne
                  facilities={facilities}
                  safeReportFormData={safeReportFormData}
                  onChangeDate={onChangeSafeReportDate}
                />
              )}
              {currentSafeFormStep === 1 && (
                <SafeReportFormStepTwo reportFormRef={reportFormRef} />
              )}
              {currentSafeFormStep === 2 && (
                <SafeReportFormStepThree reportFormRef={reportFormRef} />
              )}
              {currentSafeFormStep === 3 && (
                <SafeReportFormStepFour
                  onScreen={onScreen}
                  onChangeScreen={onChangeScreen}
                  reportFormRef={reportFormRef}
                />
              )}
            </Row>
            <Row
              justify={
                size.xs
                  ? `center`
                  : currentSafeFormStep === 0
                    ? `end`
                    : `space-between`
              }
              style={{
                paddingBottom: 12,
                columnGap: pxToRem(15),
                paddingTop: 12,
                padding: !size.xs
                  ? `0 0 ${pxToRem(12)} 0`
                  : `0 0 ${pxToRem(10)} 0`,
                width: size.xs ? `90%` : pxToRem(463)
              }}
            >
              {currentSafeFormStep > 0 && (
                <Col style={size.xs ? { width: '47.5%' } : {}}>
                  <VsButton
                    style={{ width: size.xs ? '100%' : pxToRem(100) }}
                    size={BUTTON_SIZES.large}
                    onClick={onClickBackButton}
                  >
                    <ArrowLeftOutlined />
                    Back
                  </VsButton>
                </Col>
              )}
              <Col
                style={
                  size.xs
                    ? { width: currentSafeFormStep === 0 ? `100%` : '47.5%' }
                    : {}
                }
              >
                <VsButton
                  antButtonProps={{
                    type: 'primary',
                    htmlType: 'submit',
                    loading: isLoading,
                    disabled: !isChecklist
                  }}
                  style={{
                    width: size.xs
                      ? '100%'
                      : isLoading
                        ? undefined
                        : pxToRem(100)
                  }}
                  size={BUTTON_SIZES.large}
                >
                  {currentSafeFormStep < 3 ? (
                    <>
                      Next
                      <ArrowRightOutlined style={{ marginLeft: 8 }} />
                    </>
                  ) : (
                    `Submit`
                  )}
                </VsButton>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};
