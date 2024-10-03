import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useTableSegmentedStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      segmented: css`
        border-radius: unset;
        font-size: ${pxToRem(14)};
        background-color: transparent;
        color: ${token.colorText};
        max-width: ${pxToRem(560)};
        line-height: ${pxToRem(22)};
        border-top: ${pxToRem(0)} solid ${token.colorSplit};
        border-right: ${pxToRem(0)}solid ${token.colorSplit};
        border-left: ${pxToRem(0)} solid ${token.colorSplit};
        .ant-segmented-thumb {
          background-color: transparent;
          border-block-end: ${pxToRem(3)} solid ${token.colorPrimary};
        }

        .ant-segmented-item {
          margin-inline: ${pxToRem(8)};

          :first-child {
            margin-inline-start: 0;
          }

          :last-child {
            margin-inline-end: 0;
          }
          padding: 0;
          background-color: transparent;
          box-shadow: unset;
        }
        .ant-segmented-item-selected {
          font-weight: 700;
          background-color: transparent;

          border-radius: unset;
          border-block-end: ${pxToRem(3)} solid ${token.colorPrimary};
        }
      `,
      segmentedSize: css`
        .ant-segmented-item-label {
          padding: unset !important;
        }
      `
    };
  });

  return styleGenerator();
};
