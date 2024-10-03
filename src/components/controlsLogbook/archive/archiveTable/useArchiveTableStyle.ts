import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useArchiveTableStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
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
      perpetualInventoryTableContainer: css`
        .ant-progress-line {
          margin-bottom: 0;
          margin-inline-start: ${pxToRem(4)};
          margin-inline-end: ${pxToRem(0)};
        }

        .ant-table-cell {
          white-space: nowrap;
          padding-inline: ${pxToRem(16)} !important;

          :first-child {
            padding-inline: ${pxToRem(7.5)} !important;
          }

          :nth-child(2) {
            width: ${pxToRem(74)} !important;
          }

          :nth-child(3) {
            min-width: ${pxToRem(65)} !important;
          }

          :nth-child(4) {
            min-width: ${pxToRem(121)} !important;
          }

          :nth-child(5) {
            min-width: ${pxToRem(81)} !important;
          }

          :nth-child(6) {
            min-width: ${pxToRem(81)} !important;
          }

          :nth-child(7) {
            min-width: ${pxToRem(89)} !important;
          }

          :nth-child(8) {
            min-width: ${pxToRem(130)} !important;
          }

          :nth-child(9) {
            width: ${pxToRem(81)} !important;
          }

          :nth-child(10) {
            width: ${pxToRem(126)} !important;
          }

          @media screen and (max-width: 576px) {
            padding-inline: ${pxToRem(16)} !important;
          }
        }

        .ant-table-row > .ant-table-cell-row-hover {
          background: unset;
        }

        .ant-table-expanded-row-fixed {
          padding-inline: 0px;
        }

        .ant-table-thead {
          .ant-table-cell-fix-right {
            background-color: #ebebeb !important;
          }
        }

        tbody {
          .ant-table-cell svg {
            font-size: ${pxToRem(16)} !important;
          }
        }
      `,

      selectedRow: css`
        background-color: ${token.colorPrimaryBg} !important;

        :hover {
          background: ${token.colorPrimaryBg} !important;
          .ant-table-cell-fix-right {
            background-color: ${token.colorPrimaryBg} !important;
            border-inline-start: unset;
          }
        }
        .ant-table-cell {
          border: ${pxToRem(1)} solid ${token.colorPrimaryBorderHover};
        }
        .ant-table-row > .ant-table-cell-row-hover {
          background: unset !important;
          .ant-table-cell-fix-right {
            background-color: ${token.colorPrimaryBg} !important;
            border-inline-start: unset;
          }
        }
        .ant-table-cell-fix-right {
          background-color: ${token.colorPrimaryBg} !important;
          border-inline-start: unset;
        }
      `,

      rowLight: css`
        --bg: ${token.colorBgBase};

        ${rowBase}
      `,
      rowDark: css`
        --bg: #fafafa;

        ${rowBase}
      `,
      rowExpandableHide: css`
        .ant-table-row-expand-icon-cell button {
          display: none !important;
        }
      `,

      perpetualnventoryNestedContainer: css`
        @media screen and (max-width: 576px) {
          width: calc(100% + ${pxToRem(34)});
          margin-left: ${pxToRem(-17)};
        }

        border: ${pxToRem(1)} solid ${token.colorPrimaryBorderHover};
        margin-right: ${pxToRem(1)};
        .ant-table-thead {
          background-color: ${token.colorBgBase} !important;
          .ant-table-cell {
            font-size: ${pxToRem(14)} !important;
          }
        }

        .ant-table-cell {
          font-size: ${pxToRem(12)} !important;

          :nth-child(1) {
            padding-inline: ${pxToRem(16)} !important;
            width: unset !important;
            min-width: ${pxToRem(115)} !important;
          }
          :nth-child(2) {
            width: unset !important;
            min-width: ${pxToRem(123)} !important;
          }
          :nth-child(3) {
            width: unset !important;
            min-width: ${pxToRem(89)} !important;
          }
          :nth-child(4) {
            min-width: unset !important;
            width: ${pxToRem(114)} !important;
          }
          :nth-child(5) {
            min-width: unset !important;
            width: ${pxToRem(84)} !important;
          }
          :nth-child(6) {
            min-width: unset !important;
            width: ${pxToRem(102)} !important;
          }
          :nth-child(7) {
            min-width: unset !important;
            width: ${pxToRem(112)} !important;
          }
          :nth-child(8) {
            min-width: unset !important;
            width: ${pxToRem(95)} !important;
          }
          :nth-child(9) {
            width: unset !important;
            min-width: ${pxToRem(97)} !important;
          }
          :nth-child(10) {
            min-width: unset !important;
            width: ${pxToRem(133)} !important;
          }
          :nth-child(11) {
            min-width: unset !important;
            width: ${pxToRem(88)} !important;
          }
          :nth-child(12) {
            min-width: unset !important;
            width: ${pxToRem(81)} !important;
          }
        }
      `
    };
  });

  return styleGenerator();
};
