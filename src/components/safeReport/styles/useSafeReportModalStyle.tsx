import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useSafeReportModalStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      headerClassName: css`
        .ant-modal-header {
          padding-inline: ${pxToRem(20)} !important;
        }
      `,
      divider: css`
        border-color: ${token.colorBorder};
        margin: 0;
        margin-top: ${pxToRem(20)};
      `,
      safeReportMessageStyle: css`
        margin-top: ${pxToRem(18)};

        border-radius: ${pxToRem(18)};
        padding-block: ${pxToRem(16)};
        padding-inline: ${pxToRem(13)};
        background: ${token.colorBgContainerDisabled};
      `,
      messageDateTime: css`
        color: ${token.colorTextDescription};
        font-size: ${pxToRem(10)};
        font-weight: 400;
        line-height: ${pxToRem(20)};
      `,
      email: css`
        margin: ${pxToRem(20)};
      `,
      emailButton: css`
        margin-top: ${pxToRem(12)};
        display: flex;
        // flex-direction: row;
        justify-content: center;
        padding-inline: ${pxToRem(20)};
        gap: ${pxToRem(14)};
      `
    };
  });

  return styleGenerator();
};
