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
          padding: ${pxToRem(20)} !important;
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
          margin-bottom: ${pxToRem(13)};
        }

        .ant-upload-list-item {
          border-radius: ${pxToRem(4)} !important;
          font-weight: 600 !important;
        }
      `,
      sampleFile: css`
        display: flex;
        justify-content: space-between;
        border: ${pxToRem(1)} solid ${token.colorBorder};
        borderradius: ${pxToRem(4)};
        alignitems: center;
        marginblockstart: ${pxToRem(13)};
      `,

      downloadText: css`
        font-weight: ${token.fontWeightStrong};
        color: #000000;
        font-size: ${pxToRem(14)};
        padding-inline-start: ${pxToRem(14)};
      `
    };
  });

  return styleGenerator();
};
