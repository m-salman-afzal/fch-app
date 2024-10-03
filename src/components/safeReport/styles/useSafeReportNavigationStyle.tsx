import { createStylish } from 'antd-style';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

export const useSafeReportNavigationStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      safeReportHeading: css`
        color: ${token.colorText};
        font-size: ${pxToRem(16)};
        font-weight: 600;
        line-height: ${pxToRem(24)};

        @media screen and (max-width: 576px) {
          margin-bottom: ${pxToRem(12)};
        }
      `
    };
  });

  return styleGenerator();
};
