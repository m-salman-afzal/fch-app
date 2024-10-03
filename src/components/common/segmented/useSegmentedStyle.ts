import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useSegmentedStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      segmented: css`
        font-size: ${pxToRem(12)};
        background-color: ${token.colorFillTertiary};
        padding: ${pxToRem(3)};
        color: ${token.colorText};
        max-width: ${pxToRem(560)};
        .ant-segmented-item-selected {
          font-weight: 700;
          border-radius: ${pxToRem(7)};
          border: ${pxToRem(0.5)} solid rgba(0, 0, 0, 0.04);
          box-shadow:
            0px ${pxToRem(3)} ${pxToRem(1)} 0px rgba(0, 0, 0, 0.04),
            0px ${pxToRem(3)} ${pxToRem(8)} 0px rgba(0, 0, 0, 0.12);
        }
      `
    };
  });

  return styleGenerator();
};
