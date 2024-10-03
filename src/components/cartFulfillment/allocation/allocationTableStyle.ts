import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useAllocationTableStyle = () => {
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
        :first-child {
          width: ${pxToRem(48)} !important;
          min-width: ${pxToRem(48)} !important;
          max-width: ${pxToRem(48)} !important;
        }

        :nth-child(4) {
          width: 10%;
          min-width: ${pxToRem(110)} !important;
        }

        :nth-child(5) {
          width: 10%;
          min-width: ${pxToRem(110)} !important;
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
        ${commonContainer},
        .ant-table-cell {
          padding-inline-start: ${pxToRem(16)} !important;
          padding-inline-end: ${pxToRem(16)} !important;
          white-space: nowrap;

          min-width: ${pxToRem(120)};

          :first-child {
            width: unset;
            min-width: unset;
            max-width: unset;
          }
        }
      `,
      fulfilledContainer: css`
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

        .ant-table-cell {
          padding-inline-start: ${pxToRem(16)} !important;
          padding-inline-end: ${pxToRem(16)} !important;
          white-space: nowrap;

          min-width: ${pxToRem(120)} !important;

          :first-child {
            width: unset !important;
            min-width: unset !important;
            max-width: unset !important;
          }

          :last-child {
            width: unset !important;
            min-width: unset !important;
            max-width: unset !important;
          }

          :nth-child(3) {
            width: 10%;
            min-width: ${pxToRem(110)} !important;
          }

          :nth-child(4) {
            width: 10%;
            min-width: ${pxToRem(110)} !important;
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
        ${rowBase}
        .ant-table-cell {
          color: ${token.colorTextDisabled};
        }
      `,
      modalContainer: css`
        @media screen and (min-width: 1440px) {
          width: 88% !important;
          max-width: ${pxToRem(1440)};
        }

        width: ${pxToRem(947)} !important;

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
          min-width: ${pxToRem(150)};

          @media screen and (min-width: 1440px) {
            :nth-child(2) {
              width: 12%;
            }
            :nth-child(3) {
              width: 10%;
            }
            :nth-child(4) {
              width: 10%;
            }
            :nth-child(5) {
              width: 10%;
            }
            :nth-child(6) {
              width: 15%;
            }
          }
        }
      `
    };
  });

  return styleGenerator();
};
