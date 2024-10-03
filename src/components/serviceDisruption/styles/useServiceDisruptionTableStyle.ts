import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useServiceDisruptionTableStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const commonContainer = css`
      white-space: nowrap;
      margin-top: ${pxToRem(18)};
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
          :nth-child(1) {
            min-width: ${pxToRem(471 - 16)};
          }
          :nth-child(2) {
            min-width: ${pxToRem(471 - 16)};
          }
          :nth-child(3) {
            min-width: ${pxToRem(471 - 16)};
          }
          :nth-child(4) {
            min-width: ${pxToRem(154 - 16)};
          }
        }

        @media screen and (max-width: 1599px) {
          :nth-child(1) {
            min-width: ${pxToRem(282 - 16)};
          }
          :nth-child(2) {
            min-width: ${pxToRem(250 - 16)};
          }
          :nth-child(3) {
            min-width: ${pxToRem(355 - 16)};
          }
          :nth-child(4) {
            min-width: ${pxToRem(154 - 16)};
          }
        }

        @media screen and (max-width: 1200px) {
          :nth-child(1) {
            min-width: ${pxToRem(234 - 16)};
          }
          :nth-child(2) {
            min-width: ${pxToRem(234 - 16)};
          }
          :nth-child(3) {
            min-width: ${pxToRem(234 - 16)};
          }
          :nth-child(4) {
            min-width: ${pxToRem(154 - 16)};
          }
        }

        @media screen and (max-width: 576px) {
          :nth-child(1) {
            min-width: ${pxToRem(164 - 16)};
          }
          :nth-child(2) {
            min-width: ${pxToRem(164 - 16)};
          }
          :nth-child(3) {
            min-width: ${pxToRem(164 - 16)};
          }
          :nth-child(4) {
            min-width: ${pxToRem(154 - 16)};
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
