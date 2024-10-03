import { FC, useState } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Col, Divider, Form, Grid, Row, TimePicker, Typography } from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsCheckboxFormItem,
  VsDatePickerFormItem,
  VsFormItem,
  VsMobileDatePickerFormItem,
  VsSelectFormItem,
  VsTextAreaFormItem
} from 'vs-design-components';

import { DATE_FORMATS } from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import { LabeledTextArea } from '../common/textArea/LabeledTextArea';
import { useDynamicSafeReportStyle } from './useDynamicSafeReportStyle';

const { useBreakpoint } = Grid;
interface Props {
  facilities?: any[];
  safeReportFormData: any;
  onChangeDate: (date: any) => void;
}

export const SafeReportFormStepOne: FC<Props> = ({
  facilities = [],
  safeReportFormData,
  onChangeDate
}) => {
  const size = useBreakpoint();
  const { safeReportTextAreContainer, safeReportTimePicker } =
    useDynamicSafeReportStyle();
  const [isFocused, setIsFocused] = useState<boolean>(
    safeReportFormData?.time ? true : false
  );

  return (
    <>
      <Col style={{ width: size.xs ? `100%` : pxToRem(463) }}>
        <VsSelectFormItem
          placeholder="Facility"
          formItemProps={{
            rules: [
              {
                required: true,
                message: <ErrorMessage>Select Facility</ErrorMessage>
              }
            ],
            name: 'facilityId'
          }}
          formNamePath={['facilityId']}
          options={facilities}
          width="100%"
          externalShowLabel={true}
          setExternalShowLabel={() => {}}
          open={false}
          showArrow={false}
        />
      </Col>
      <Col style={{ width: size.xs ? `100%` : pxToRem(463), display: 'flex' }}>
        <VsCheckboxFormItem
          formItemProps={{
            name: 'anonymous'
          }}
          formNamePath={['anonymous']}
        />
        <Typography.Text
          style={{
            fontSize: pxToRem(14),
            fontWeight: 400,
            fontStyle: 'normal',
            fontFamily: 'inter',
            color: 'rgba(0, 0, 0, 0.88)',
            marginLeft: pxToRem(8)
          }}
        >
          Submit as Anonymous
        </Typography.Text>
      </Col>
      <Divider
        style={{
          marginBottom: pxToRem(5),
          marginTop: pxToRem(10),
          width: size.xs ? '100%' : pxToRem(463),
          minWidth: 0
        }}
      />
      <Col
        style={{
          width: size.xs ? '100%' : pxToRem(463)
        }}
      >
        <Typography.Text
          style={{
            fontWeight: 600,
            fontSize: pxToRem(16),
            color: 'rgba(0, 0, 0, 0.65)',
            fontStyle: 'normal',
            fontFamily: 'inter'
          }}
        >
          Subject of Event
        </Typography.Text>
      </Col>
      <Col
        style={{
          width: size.xs ? `100%` : pxToRem(463),
          marginTop: pxToRem(12)
        }}
        className={safeReportTextAreContainer}
      >
        <VsTextAreaFormItem
          formItemProps={{
            name: 'subject',
            rules: [
              {
                required: true,
                min: 10,
                message: (
                  <ErrorMessage>Type Subject (min 10 characters)</ErrorMessage>
                )
              }
            ]
          }}
          placeholder="Subject"
          autoSize={{ minRows: 1 }}
          maxLength={50}
          width="100%"
        />
      </Col>
      <Col style={{ width: size.xs ? `100%` : pxToRem(463) }}>
        <BasicInputFormItem
          placeholder="Patient Name (optional)"
          formItemProps={{
            rules: [
              {
                required: false,
                message: <ErrorMessage>Enter Unit/Package</ErrorMessage>
              }
            ],
            name: 'patientName'
          }}
          formNamePath={['patientName']}
          width="100%"
        />
      </Col>
      <Row
        style={{ width: size.xs ? `100%` : pxToRem(463) }}
        justify={`space-between`}
      >
        <Col style={{ width: size.xs ? `49%` : pxToRem(225) }}>
          {size?.xs ? (
            <VsMobileDatePickerFormItem
              placeholder={'MM/DD/YYYY'}
              formItemProps={{
                rules: [
                  {
                    required: true,
                    message: <ErrorMessage>Select Date</ErrorMessage>
                  }
                ],
                name: 'date'
              }}
              seperateLabel="Date"
              formNamePath={['date']}
            />
          ) : (
            <VsDatePickerFormItem
              date={safeReportFormData?.date}
              seperateLabel={'Date'}
              placeholder="MM/DD/YYYY"
              formItemProps={{
                rules: [
                  {
                    required: true,
                    message: <ErrorMessage>Select Date</ErrorMessage>
                  }
                ],
                name: 'date'
              }}
              formNamePath={['date']}
              onChange={onChangeDate}
            />
          )}
        </Col>
        <Col style={{ width: size.xs ? `49%` : pxToRem(225) }}>
          <VsFormItem
            formItemProps={{
              name: `time`
            }}
          >
            <TimePicker
              placeholder="Time"
              format={DATE_FORMATS.TIME}
              style={{
                width: `100%`,
                height: pxToRem(48.08),
                borderRadius: pxToRem(4)
              }}
              suffixIcon={
                <>
                  {isFocused && (
                    <Typography.Text
                      style={{
                        zIndex: 1,
                        top: pxToRem(-22),
                        left: pxToRem(5),
                        fontSize: pxToRem(12),
                        backgroundColor: `white`,
                        color: `rgba(0, 0, 0, 0.45)`,
                        position: `absolute`,
                        padding: `0px 0.29rem 0.29rem 0.29rem`,
                        fontFamily: `inter`
                      }}
                    >
                      Time
                    </Typography.Text>
                  )}
                  <ClockCircleOutlined />
                </>
              }
              onBlur={e => {
                setIsFocused(e?.target?.value ? true : false);
              }}
              onFocus={e => {
                setIsFocused(true);
              }}
              className={safeReportTimePicker}
            />
          </VsFormItem>
        </Col>
      </Row>
    </>
  );
};
