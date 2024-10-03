import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useBridgeTherapyTableStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const commonContainer = css`
      .ant-table-thead {
        .ant-table-cell {
          font-size: ${pxToRem(14)};
        }
      }
      .ant-table-tbody {
        .ant-table-cell {
          font-size: ${pxToRem(12)};
        }
      }

      .ant-table-cell {
        padding-inline-start: ${pxToRem(16)} !important;
        padding-inline-end: ${pxToRem(16)} !important;
        white-space: nowrap;
        :first-child {
          width: ${pxToRem(48)} !important;
          min-width: ${pxToRem(48)} !important;
          max-width: ${pxToRem(48)} !important;
        }
        :nth-child(2) {
          width: ${pxToRem(215)} !important;
        }

        :nth-child(6),
        :nth-child(7),
        :nth-child(8) {
          width: ${pxToRem(102)} !important;
        }

        :nth-child(5) {
          width: ${pxToRem(165)} !important;
        }

        :nth-child(3),
        :nth-child(4) {
          width: ${pxToRem(102)} !important;
        }
      }
    `;

    return {
      container: css`
        ${commonContainer},
      `,
      mobileContainer: css`
        ${commonContainer},
      `
    };
  });

  return styleGenerator();
};
