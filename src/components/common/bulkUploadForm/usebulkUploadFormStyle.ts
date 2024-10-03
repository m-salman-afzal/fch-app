import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useBulkUploadModalStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      headerClassName: css`
        .ant-modal-header {
          margin-bottom: ${pxToRem(0)};
        }
        .ant-modal-content {
          // padding: ${pxToRem(20)} !important;
        }
      `,

      formErrorFix: css`
        .ant-form-item-explain-error {
          margin-block-start: ${pxToRem(-16)};
          margin-block-end: ${pxToRem(8)};
          color: #cf1322 !important;
        }
      `,

      uploadClassName: css`
        .ant-upload {
          margin-top: ${pxToRem(16)};
          margin-bottom: ${pxToRem(0)};
          .ant-upload-btn {
            margin-top: ${pxToRem(0)};
          }
        }
        .ant-upload-list {
          border-radius: ${pxToRem(10)};
          margin-top: ${pxToRem(6)};
          margin-bottom: ${pxToRem(14)};
        }

        .ant-upload-list-item {
          border-radius: ${pxToRem(4)} !important;
          font-weight: 600 !important;
        }
      `,
      downloadText: css`
        font-weight: ${token.fontWeightStrong};
        color: #000000;
        font-size: ${pxToRem(14)};
        padding-inline-start: ${pxToRem(14)};
      `,
      sampleFile: css`
        display: flex;
        justify-content: space-between;
        border: ${pxToRem(1)} solid ${token.colorBorder};
        borderradius: ${pxToRem(4)};
        alignitems: center;
        marginblockstart: ${pxToRem(13)};
      `
    };
  });

  return styleGenerator();
};
