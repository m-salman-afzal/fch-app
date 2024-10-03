import { createStylish } from 'antd-style';
import { useTableStyle } from 'vs-design-components/src/Components/Table/useTableStyle';

import { pxToRem } from '@/utils/sharedUtils';

export const useInventoryTableStyle = () => {
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
      inventorysTableContainer: css`
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

          :nth-child(16) {
            padding-inline: ${pxToRem(11.5)} !important;
            min-width: ${pxToRem(51)} !important;
          }
          :last-child {
            padding-inline: ${pxToRem(16)} !important;
            min-width: ${pxToRem(54)} !important;
            width: ${pxToRem(54)} !important;
            max-width: ${pxToRem(54)} !important;
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

      inventoryEmptyContainer: css`
        .ant-progress-line {
          margin-bottom: 0;
          margin-inline-start: ${pxToRem(4)};
          margin-inline-end: ${pxToRem(0)};
        }

        .ant-table-cell.ant-table-row-expand-icon-cell {
          width: 0px !important;
        }

        .ant-table-cell.ant-table-cell-fix-right.ant-table-cell-fix-sticky {
          :last-child {
            width: 0px !important;
            padding: 0px !important;
          }
        }

        .ant-table-cell {
          white-space: nowrap;
          width: ${pxToRem(125)} !important;
          padding-inline: ${pxToRem(16)} !important;

          :last-child {
            padding-inline: ${pxToRem(16)} !important;
            min-width: ${pxToRem(54)} !important;
            width: ${pxToRem(54)} !important;
            max-width: ${pxToRem(54)} !important;
          }

          @media screen and (max-width: 576px) {
            padding-inline: ${pxToRem(16)} !important;
          }
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

      inventoryNestedContainer: css`
        @media screen and (max-width: 576px) {
          width: calc(100% + ${pxToRem(34)});
          margin-left: ${pxToRem(-17)};
        }

        border: ${pxToRem(1)} solid ${token.colorPrimaryBorderHover};
        margin-right: ${pxToRem(1)};
        .ant-table-thead {
          background-color: ${token.colorBgBase} !important;
        }

        .ant-table-cell {
          :nth-child(1) {
            width: ${pxToRem(31)} !important;
          }

          :nth-child(5) {
            width: ${pxToRem(155)} !important;
          }
          :nth-child(6) {
            width: ${pxToRem(100)} !important;
          }
          :nth-child(7) {
            min-width: ${pxToRem(275)} !important;
            width: ${pxToRem(275)} !important;
            max-width: ${pxToRem(275)} !important;
          }
          :last-child {
            padding-inline: ${pxToRem(7.5)} !important;
            min-width: ${pxToRem(55)} !important;
            width: ${pxToRem(55)} !important;
            max-width: ${pxToRem(55)} !important;
          }
        }
      `,
      controlledIdsNestedContainer: css`
        width: 100%;
        width: calc(100% - ${pxToRem(25 - 7.5)});
        margin-left: ${pxToRem(25)};

        .ant-table-cell {
          width: unset !important;
          min-width: unset !important;
          max-width: unset !important;

          :first-child {
            width: 70% !important;
            padding-inline: ${pxToRem(16)} !important;
          }

          :last-child {
            width: ${pxToRem(54)} !important;
            min-width: ${pxToRem(54)} !important;
            max-width: ${pxToRem(55)} !important;
          }
        }
      `,
      controlledIdsNestedContainerTr: css`
        width: calc(100% - ${pxToRem(25 - 7.5)});
        margin-left: ${pxToRem(25)};

        .ant-table-cell {
          width: unset !important;
          min-width: unset !important;
          max-width: unset !important;

          :first-child {
            width: 40% !important;
            padding-inline: ${pxToRem(16)} !important;
          }
          :nth-child(2) {
            width: 33% !important;
          }
          :last-child {
            width: ${pxToRem(54)} !important;
            min-width: ${pxToRem(54)} !important;
            max-width: ${pxToRem(54)} !important;
          }
        }
      `
    };
  });

  return styleGenerator();
};
