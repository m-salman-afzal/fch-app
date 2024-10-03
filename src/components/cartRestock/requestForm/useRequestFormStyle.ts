import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useCartRequestormStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      container: css`
        min-width: ${pxToRem(402)};
        border-radius: ${pxToRem(8)};
        background: ${token.colorBorderBg};

        .ant-select-single .ant-select-selector {
          height: ${pxToRem(39)} !important;
        }
      `,
      formContainer: css`
        padding: ${pxToRem(20)};
      `,
      titleRow: css`
        padding: ${pxToRem(12)} ${pxToRem(20)};
        border-bottom: ${pxToRem(1)} solid ${token.colorBorder};
      `,
      requestFormRadioButton: css`
        .ant-radio-wrapper {
          width: 100%;
          height: ${pxToRem(39)};
          border: ${pxToRem(1)} solid rgba(0, 0, 0, 0.15);
          align-items: center;
          border-radius: ${pxToRem(4)};
          padding: ${pxToRem(12)} ${pxToRem(16)};
          font-weight: 600;
          margin: 0;
        }

        .ant-radio-wrapper.ant-radio-wrapper-checked {
          border: ${pxToRem(1)} solid ${token.colorPrimary};
        }
      `,
      controlledDrugModal: css`
        .ant-modal-content {
          padding: 0;
          .ant-modal-close-icon svg {
            width: ${pxToRem(26)};
            height: ${pxToRem(26)};
          }
        }

        .ant-modal-header {
          padding: ${pxToRem(12)} ${pxToRem(20)};
          margin-bottom: 0;
          border-bottom: ${pxToRem(1)} solid ${token.colorBorder};

          .ant-modal-title {
            font-size: ${pxToRem(20)};
          }
        }
        .footer {
          border-top: ${pxToRem(1)} solid ${token.colorBorder};
          margin-top: 0;
          padding: ${pxToRem(12)} ${pxToRem(20)};
        }
      `,
      radioButton: css`
        .ant-radio-wrapper {
          width: ${pxToRem(195)} !important;
          height: ${pxToRem(42)};
        }

        @media screen and (max-width: 576px) {
          .ant-radio-wrapper {
            width: ${pxToRem(170)}!important;
            padding: ${pxToRem(10)};
          }
        }
      `,
      signModal: css`
        border-radius: ${pxToRem(4)} !important;
        .ant-row.ant-form-item-row {
          padding-top: ${pxToRem(16)};
        }
        .ant-collapse,
        .ant-collapse-header,
        .ant-collapse-item:last-child {
          border-radius: ${pxToRem(4)} !important;
        }

        .ant-collapse-header {
          background: #fff;
          border-radius: ${pxToRem(0)} !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.15);
          margin: 0 20px;
          padding: 12px 0px !important;
        }

        .ant-collapse-header-text {
          font-size: ${pxToRem(16)};
          font-weight: 600;
        }

        .ant-collapse-content > .ant-collapse-content-box {
          padding-bottom: 0;
        }

        .ant-collapse-content {
          border-top: none;
        }

        .ant-collapse-item {
          background: #fff;
        }

        @media screen and (max-width: 576px) {
          margin-block-end: ${pxToRem(16)};
        }
      `,
      errorClass: css`
        color: #cf1322;
        font-size: 0.86rem;
        text-align: left !important;
        margin-top: 0.29rem;
        margin-block-end: -${pxToRem(12)} !important;
      `,
      counterStyle: css`
        height: ${pxToRem(24)}!important;
        padding: ${pxToRem(8)}!important;

        .ant-btn {
          height: ${pxToRem(24)} !important;
          width: ${pxToRem(24)}!important;
        }
      `
    };
  });

  return styleGenerator();
};
