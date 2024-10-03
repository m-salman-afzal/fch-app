import { PropsWithChildren } from 'react';
import { Col, FormInstance, Row } from 'antd';
import Image from 'next/image';

import { TReportData } from '@/types/safeReportTypes';

import safeReportGenerate from '@/assets/generateSafeReport.svg';
import { pxToRem } from '@/utils/sharedUtils';

import { SafeReportGenerateForm } from '../forms/safeReportGenerateForm';
import { useSafeReportGenerateStyle } from '../styles/useSafeReportGenerateStyle';

interface props {
  onFinishForm: (values: TReportData) => void;
  form: FormInstance<TReportData>;
  isLoading: boolean;
}

export const SafeReportGenerateLayout: React.FC<PropsWithChildren<props>> = ({
  onFinishForm,
  form,
  isLoading
}) => {
  const { generateText, generateContainer } = useSafeReportGenerateStyle();

  return (
    <div
      style={{
        overflowY: 'auto',
        height: `calc(100dvh - ${pxToRem(105)} - ${pxToRem(5)} - ${pxToRem(5)})`
      }}
    >
      <Row
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row',
          marginTop: pxToRem(16),
          marginBottom: pxToRem(16)
        }}
      >
        <Col className={generateContainer}>
          <Image src={safeReportGenerate} alt="safeReportGenerate" />

          <p className={generateText}>Generate Report</p>

          <SafeReportGenerateForm
            onFinishForm={onFinishForm}
            form={form}
            isLoading={isLoading}
          />
        </Col>
      </Row>
    </div>
  );
};
