import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useSafeReportGenerateStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const generateContainer = css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: ${pxToRem(8)};
      background: ${token.colorBorderBg};
      min-width: ${pxToRem(493)};
      min-height: ${pxToRem(631)};
    `;

    return {
      generateContainer: css`
        ${generateContainer}
        padding-block: ${pxToRem(19)};

        @media screen and (max-width: 576px) {
          min-width: ${pxToRem(350)};
        }
      `,
      generateText: css`
        color: ${token.colorTextHeading};
        font-size: ${pxToRem(20)};
        font-weight: 600;
        line-height: ${pxToRem(28)};
        margin: 0;
        padding-block-start: ${pxToRem(20)};
      `,
      reportForm: css`
        margin-block-start: ${pxToRem(20)};
        padding-inline: ${pxToRem(20)};
        min-width: 100% !important;
      `,

      divider: css`
        border-color: ${token.colorBorder};
        margin: 0;
        margin-top: ${pxToRem(20)};
      `
    };
  });

  return styleGenerator();
};
