import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const usePillStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const basePill = css`
      display: inline-flex;
      height: ${pxToRem(24)};
      padding: ${pxToRem(1)} ${pxToRem(9)};
      justify-content: center;
      align-items: center;
      gap: ${pxToRem(10)};
      flex-shrink: 0;
      border-radius: ${pxToRem(12)};
    `;

    return {
      pillStyle: css`
        ${basePill};
      `,
      greenPill: css`
        background-color: #d9f7be80;
        color: ${token.colorSuccessText};
      `,
      redPill: css`
        background-color: ${token.colorErrorBg};
        color: ${token.colorErrorText};
      `,
      yellowPill: css`
        background-color: ${token.colorWarningBg};
        color: ${token.colorWarningText};
      `,
      bluePill: css`
        background-color: ${token.colorInfoBg};
        color: ${token.colorInfoText};
      `,
      greyPill: css`
        background-color: ${token.colorFillContent};
        color: ${token.colorText};
      `,
      purplePill: css`
        background-color: ${token['purple-1']};
        color: ${token['purple-9']};
      `,
      cyanPill: css`
        background-color: ${token['cyan-1']};
        color: ${token['cyan-9']};
      `
    };
  });

  return styleGenerator();
};
