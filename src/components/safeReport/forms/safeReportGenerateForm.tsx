import { PropsWithChildren } from 'react';
import { Col, Divider, Form, Grid } from 'antd';
import { FormInstance } from 'antd/es/form';
import {
  ErrorMessage,
  VsButton,
  VsCheckboxFormItem,
  VsSelectFormItem,
  VsTextAreaFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TReportData } from '@/types/safeReportTypes';

import { SAFE_REPORT_TYPE_OPTIONS } from '@/utils/constants';

import { useSafeReportGenerateStyle } from '../styles/useSafeReportGenerateStyle';

interface props {
  onFinishForm: (values: TReportData) => void;
  form: FormInstance<TReportData>;
  isLoading: boolean;
}

const { useBreakpoint } = Grid;

export const SafeReportGenerateForm: React.FC<PropsWithChildren<props>> = ({
  onFinishForm,
  form,
  isLoading
}) => {
  const { reportForm, divider } = useSafeReportGenerateStyle();
  const size = useBreakpoint();

  return (
    <Form
      className={reportForm}
      form={form}
      onFinish={onFinishForm}
      name="safeReport"
      style={{ minWidth: '100%', paddingInline: pxToRem(0) }}
    >
      <Col style={{ minWidth: pxToRem(350), paddingInline: pxToRem(20) }}>
        <VsSelectFormItem
          placeholder="Report Type"
          options={SAFE_REPORT_TYPE_OPTIONS}
          formItemProps={{
            name: 'reportType',
            rules: [
              {
                required: true,
                message: <ErrorMessage>Select Type</ErrorMessage>
              }
            ]
          }}
        />

        <VsTextAreaFormItem
          placeholder="Message"
          width="100%"
          autoSize={{
            minRows: 10,
            maxRows: 40
          }}
          formItemProps={{
            name: 'report',
            rules: [
              {
                required: true,
                validator: (rule, value) => {
                  if (value === undefined || value === null) {
                    return Promise.reject(
                      <ErrorMessage>Message is required</ErrorMessage>
                    );
                  }

                  if (value?.trim().length < 10) {
                    return Promise.reject(
                      <ErrorMessage>
                        Type Message (Min 10 Characters)
                      </ErrorMessage>
                    );
                  }

                  return Promise.resolve();
                }
              }
            ]
          }}
        />

        <VsCheckboxFormItem
          formItemProps={{ name: 'anonymous' }}
          checkboxProps={{ children: 'Anonymous' }}
        />
      </Col>

      <Col>
        <Divider className={divider} />

        <VsButton
          antButtonProps={{
            type: 'primary',
            htmlType: 'submit',
            loading: isLoading
          }}
          size={BUTTON_SIZES.large}
          style={{
            minWidth: size.xs ? pxToRem(310) : pxToRem(463),
            marginBlockStart: pxToRem(12),
            marginInline: pxToRem(20)
          }}
        >
          Generate
        </VsButton>
      </Col>
    </Form>
  );
};
