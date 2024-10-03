import { createStylish } from 'antd-style';

import { pxToRem } from '../../../../utils/sharedUtils';

export const useSftpLogsSearchStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      selectClass: css`
        .ant-select-selector {
          background: rgba(0, 0, 0, 0.06) !important;
          border-radius: ${pxToRem(4)};
          border: none !important;
          color: #797979 !important;
        }
      `,

      selectClassFocused: css`
        .ant-select-selector {
          border-radius: ${pxToRem(4)};
        }
      `,
      formItemWrappingDiv: css`
        margin-bottom: ${pxToRem(15)};
      `
    };
  });

  return styleGenerator();
};
