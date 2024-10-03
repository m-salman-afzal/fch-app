import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useProcessedTableStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const commonContainer = css`
      .ant-table-wrapper
        .ant-table-container
        table
        > thead
        > tr:first-child
        > *:first-child {
        border-start-start-radius: unset;
      }

      .ant-table-wrapper
        .ant-table-container
        table
        > thead
        > tr:first-child
        > *:last-child {
        border-start-end-radius: unset;
      }

      .ant-table-wrapper .ant-table .ant-table-header {
        border-radius: 0px 0px 0px 0px;
      }

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

        :nth-child(3) {
          width: 10%;
          min-width: ${pxToRem(110)};
        }
        :nth-child(4) {
          width: 10%;
          min-width: ${pxToRem(100)};
        }

        :nth-child(6) {
          width: ${pxToRem(58)};
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
