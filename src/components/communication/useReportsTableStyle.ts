import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useReportsTableStyle = () => {
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
        padding-block: ${pxToRem(8)} !important;
        :last-child {
          width: 0;
        }

        @media screen and (min-width: 1600px) {
          :nth-child(1),
          :nth-child(2),
          :nth-child(3),
          :nth-child(4) {
            min-width: ${pxToRem(392 - 16)} !important;
          }
        }

        @media screen and (max-width: 1599px) {
          :nth-child(1),
          :nth-child(2),
          :nth-child(3),
          :nth-child(4) {
            min-width: ${pxToRem(276 - 16)} !important;
          }
        }

        @media screen and (max-width: 1200px) {
          :nth-child(1),
          :nth-child(2),
          :nth-child(3),
          :nth-child(4) {
            min-width: ${pxToRem(214 - 16)} !important;
          }
        }

        @media screen and (max-width: 576px) {
          :nth-child(1),
          :nth-child(2),
          :nth-child(3),
          :nth-child(4) {
            min-width: ${pxToRem(0)} !important;
          }
        }
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
        ${commonContainer},
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
