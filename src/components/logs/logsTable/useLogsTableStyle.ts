import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useLogTableStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const commonContainer = css`
      .ant-table-thead {
        .ant-table-cell {
          background-color: #ebebeb !important;

          padding-block: 0.57rem !important; /* 8px / 14 */
          padding-inline: 2.14rem 5.71rem !important; /* 30px 80px / 14 */

          :last-child {
            padding-block: ${pxToRem(8)} !important;
            padding-inline: ${pxToRem(10)} !important;
          }
        }
      }
      .ant-table-tbody {
        .ant-table-cell {
          padding-block: 0.57rem !important; /* 8px / 14 */
          padding-inline: ${pxToRem(16)} !important

          :last-child {
            padding-block: ${pxToRem(8)} !important;
            padding-inline: ${pxToRem(10)} !important;
          }
        }
      }

      .ant-table {
        border-radius: 0.29rem; /* 4px / 14 */
        border: 0.07rem solid ${token.colorBorderSecondary};
      }
      .ant-table-thead {
        .ant-table-cell {
          padding-block: 0.57rem; /* 8px / 14 */
          padding-inline: ${pxToRem(16)} !important;
        }
      }
      .ant-table-cell {
        padding-block: 0.71rem; /* 10px / 14 */
        padding-inline: ${pxToRem(16)} !important;
      }
      .ant-table-row-expand-icon-cell {
        background: none;
      }
      .ant-table-expanded-row {
        background-color: ${token.colorBgBase} !important;
        border: none !important;

        .ant-table-thead {
          .ant-table-cell {
            padding-block: 0 !important;
          }
        }

        .ant-table-sticky-scroll {
          display: none;
        }
        .ant-table-cell {
          background-color: ${token.colorBgBase} !important;
          border: none;
          padding-block: 0 !important;
          :before {
            background-color: #ffffff00 !important;
          }
        }

        .ant-table {
          border: none;
        }
      }

      .ant-table-cell.ant-table-row-expand-icon-cell svg path:nth-child(2) {
        color: ${token.colorBorder};
      }
      .ant-table-cell.ant-table-row-expand-icon-cell svg path:nth-child(1) {
        color: #687182;
      }
      .ant-dropdown-trigger.ant-dropdown-link {
        color: #687182;
      }
    `;

    const rowBase = css`
      background-color: var(--bg) !important;
      transition: all 0.2s ease-in-out !important;
      :hover {
        background-color: var(--bg) !important;
        filter: drop-shadow(0px 4px 17px rgba(0, 0, 0, 0.14));
      }

      .ant-table-cell-row-hover {
        background-color: var(--bg) !important;
      }
    `;

    return {
      container: css`
        ${commonContainer}

        .ant-table-cell {
          :last-child {
            width: ${pxToRem(65)} !important;
            min-width: ${pxToRem(65)} !important;
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
      `
    };
  });

  return styleGenerator();
};
