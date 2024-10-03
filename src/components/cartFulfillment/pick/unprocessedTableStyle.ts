import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useUnprocessedTableStyle = () => {
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

      tbody .ant-table-cell svg {
        font-size: ${pxToRem(14)} !important;
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
        :first-child {
          width: ${pxToRem(48)} !important;
          min-width: ${pxToRem(48)} !important;
          max-width: ${pxToRem(48)} !important;
        }

        :nth-child(3) {
          min-width: ${pxToRem(110)};
          width: 10%;
          max-width: ${pxToRem(185)} !important;
        }
        :nth-child(4) {
          min-width: ${pxToRem(100)};
          width: 10%;
          max-width: ${pxToRem(185)} !important;
        }
      }
    `;

    const rowBase = css`
      background-color: var(--bg) !important;
      transition: all 0.2s ease-in-out !important;
      :hover {
        background-color: var(--bg) !important;
        filter: drop-shadow(0px 4px 17px rgba(0, 0, 0, 0.14));
        .ant-table-cell-fix-right {
          background-color: var(--bg) !important;
        }
      }

      .ant-table-cell-row-hover {
        background-color: var(--bg) !important;
      }
      .ant-table-cell-fix-right {
        background-color: var(--bg) !important;
      }
    `;

    return {
      container: css`
        ${commonContainer}
      `,
      containerReadRbac: css`
        ${commonContainer}
        .ant-table-cell {
          padding-inline-start: ${pxToRem(16)} !important;
          padding-inline-end: ${pxToRem(16)} !important;
          white-space: nowrap;
          :first-child {
            width: unset !important;
            min-width: unset !important;
            max-width: unset !important;
          }

          :nth-child(3) {
            min-width: ${pxToRem(110)};
            width: 10%;
            max-width: ${pxToRem(185)} !important;
          }
          :nth-child(4) {
            min-width: ${pxToRem(100)};
            width: 10%;
            max-width: ${pxToRem(185)} !important;
          }
        }
      `,
      mobileContainer: css`
        ${commonContainer},
      `,
      rowLight: css`
        --bg: ${token.colorBgBase};

        ${rowBase}
      `,
      rowDark: css`
        --bg: #fafafa;

        ${rowBase}
      `,
      warningRow: css`
        --bg: ${token.colorWarningBg};
        ${rowBase}
      `,
      modalContainer: css`
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

        :first-child {
          max-width: ${pxToRem(250)}
        }

        :nth-child(2) {
          min-width: ${pxToRem(110)};
          width: 20%;
        }
        :nth-child(3) {
          min-width: ${pxToRem(100)};
          width: 20%;


        }
      }
        }
      `
    };
  });

  return styleGenerator();
};
