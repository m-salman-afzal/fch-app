import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useSafeReportDrawerStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      subject: css`
        line-height: ${pxToRem(28)};
        border-radius: ${pxToRem(4)};
        font-weight: 600;
        font-size: ${pxToRem(20)};
        padding: ${pxToRem(8)};
        border: ${pxToRem(1)} solid transparent;
        margin-bottom: ${pxToRem(16)};
        :hover {
          border: ${pxToRem(1)} solid #00000026;
        }
      `
    };
  });

  return styleGenerator();
};
