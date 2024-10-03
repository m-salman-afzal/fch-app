import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useDynamicSafeReportStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      safeReportContentContainer: css``,
      safeReportFormStepsContainer: css`
        padding: ${pxToRem(42)} 0 0 ${pxToRem(25)};

        @media screen and (max-width: 576px) {
          padding: ${pxToRem(14)} 0 ${pxToRem(10)} 5%;
          display: block;
          .ant-steps-item .ant-steps-item-title {
            display: none;
          }
          .ant-steps-item-active .ant-steps-item-title {
            display: block;
          }

          .ant-steps-item-tail {
            display: block !important;
          }

          .ant-steps-item:first-child .ant-steps-item-tail {
            display: none !important;
          }
        }

        .ant-steps-item-title {
          font-size: ${pxToRem(12)} !important;
        }
        .ant-steps-item-tail {
          padding: ${pxToRem(24)} 0 0 !important;
          @media screen and (max-width: 576px) {
            padding: ${pxToRem(4)} 0 0 0 !important;
            width: 28% !important;
          }
          :after {
            background-color: rgba(0, 0, 0, 0.06) !important;
          }
        }
      `,
      cartNameInputContainer: css`
        .ant-form-item {
          margin-bottom: 0px !important;
        }
      `,
      eventTypeCheckBoxContainer: css`
        gap: ${pxToRem(16)};
        .ant-checkbox-wrapper {
          width: 100%;
        }
        .ant-checkbox-wrapper:last-child {
          margin-bottom: ${pxToRem(10)};
        }
      `,
      eventSeverityStepContainer: css`
        .ant-segmented-item-label {
          font-size: ${pxToRem(12)};
          font-family: Inter;
          font-weight: 400;
        }

        .ant-segmented-item-selected .ant-segmented-item-label {
          font-weight: 600;
        }
      `,
      nearMissRadioGroup: css`
        display: flex;
        flex-direction: column;
        gap: ${pxToRem(20)};
        .ant-radio-wrapper {
          width: 100%;
          height: ${pxToRem(39)};
          border: ${pxToRem(1)} solid rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          border-radius: ${pxToRem(4)};
          padding: ${pxToRem(12)} ${pxToRem(16)};

          span:nth-child(2) {
            font-family: Inter;
            font-size: ${pxToRem(14)};
            font-style: normal;
            font-weight: 600;
          }
        }
      `,
      activeRecoveryFormItem: css`
        .ant-form-item-explain-error {
          margin-top: ${pxToRem(10)};
          color: #cf1322;
          font-size: ${pxToRem(12)};
        }
      `,
      safeReportTextAreContainer: css`
        textarea.ant-input-status-error {
          border-color: #cf1322 !important;
        }
      `,
      safeReportTimePicker: css`
        input {
          padding-left: ${pxToRem(5)} !important;
        }
        .ant-picker-suffix {
          color: rgba(0, 0, 0, 0.45);
          margin-right: ${pxToRem(7)};
        }
        .ant-picker-clear {
          margin-right: ${pxToRem(7)};
        }
      `
    };
  });

  return styleGenerator();
};
