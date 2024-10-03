import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useSFTPLogsTableStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const commonContainer = css`
      white-space: nowrap;
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
        padding-inline: ${pxToRem(16)} !important;
        :last-child {
          width: 0;
        }
      }
    `;

    const rowBase = css`
      background-color: var(--bg) !important;
      transition: all 0.2s ease-in-out !important;
      :hover {
        background-color: var(--bg) !important;
        filter: drop-shadow(
          0px ${pxToRem(4)} ${pxToRem(17)} rgba(0, 0, 0, 0.14)
        );
      }

      .ant-table-cell-row-hover {
        background-color: var(--bg) !important;
      }
    `;

    return {
      container: css`
        ${commonContainer},

        .ant-table-pagination-center {
        }
      `,
      mobileContainer: css`
        ${commonContainer},
        .ant-table-pagination-center {
        }
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
