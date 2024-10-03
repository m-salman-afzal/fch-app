import { createStylish } from 'antd-style';

import { useTableStyle } from '@/components/common/table/useTableStyle';

import { pxToRem } from '@/utils/sharedUtils';

export const usePermissionManagementStyle = () => {
  const { rowLight, rowDark } = useTableStyle();

  const styleGenerator = createStylish(({ token, css }) => {
    const permissionButton = css`
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: ${pxToRem(12)};
      border: none;
      padding-block: 0;
      padding-inline: ${pxToRem(9)} !important;
      width: ${pxToRem(62)};
      height: ${pxToRem(24)};

      .anticon-down {
        margin-inline-start: ${pxToRem(2)} !important;
      }
      svg {
        font-size: ${pxToRem(14)};
      }
    `;

    return {
      permissionButtonBase: css`
        ${permissionButton}
      `,
      permissionButtonEdit: css`
        ${permissionButton}
        background-color: #D9F7BE80;
        color: ${token.colorSuccessText};
      `,
      permissionButtonView: css`
        ${permissionButton}
        background-color: ${token.colorWarningBg};
        color: ${token.colorWarningText};
      `,
      permissionButtonHide: css`
        ${permissionButton}
        background-color: ${token.colorErrorBg};
        color: ${token.colorErrorText};
      `,

      permissionButtonError: css`
        ${permissionButton}
        background-color: ${token.colorError};
      `,
      permissionContainer: css`
        .ant-table-cell {
          word-break: break-word;

          height: ${pxToRem(40)} !important;
        }

        .ant-table-cell-with-append {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        div:first-child {
          width: 100%;
        }
        .ant-table-header,
        table {
          border-radius: 0 !important;
          th,
          td {
            first-child {
              width: ${pxToRem(48)} !important;
            }
            :nth-child(2) {
              width: ${pxToRem(215)};
            }
          }
        }
        .ant-table table th:first-child,
        .ant-table table th:last-child {
          border-start-start-radius: 0 !important;
        }
        .ant-table table th {
          padding-inline-start: ${pxToRem(16)} !important;
          padding-inline-end: ${pxToRem(16)} !important;
          padding-top: ${pxToRem(5)} !important;
          padding-bottom: ${pxToRem(5)} !important;
        }

        .ant-table table td {
          padding-inline-start: ${pxToRem(0)} !important;
          padding-inline-end: ${pxToRem(0)} !important;
        }

        th.ant-table-cell {
          background-color: #ebebeb !important;
        }

        .ant-table-cell.ant-table-cell-fix-left.ant-table-cell-fix-sticky {
          background-color: #ebebeb !important;
        }

        .ant-table-cell.ant-table-cell-fix-left.ant-table-cell-fix-left-last.ant-table-cell-with-append {
          display: flex;
          align-items: center;
          column-gap: ${pxToRem(8)};
          .ant-table-row-indent {
            display: none;
          }
        }

        @media screen and (max-width: 576px) {
          .ant-table-cell.ant-table-cell-with-append {
            display: flex;
            align-items: center;
            column-gap: ${pxToRem(8)};
            .ant-table-row-indent {
              display: none;
            }
          }
        }
      `,
      row: css`
        ${rowLight}
        :hover {
          filter: unset !important;
          background-color: unset !important;
        }

        .ant-table-cell-row-hover {
          background-color: white !important;
        }
      `,

      rowDark: css`
        background-color: #fafafa !important;
        transition: all 0.2s ease-in-out !important;
        :hover {
          background-color: #fafafa !important;
          filter: drop-shadow(0px 4px 17px rgba(0, 0, 0, 0.14));
        }

        .ant-table-cell-row-hover {
          background-color: #fafafa !important;
        }

        .ant-table-cell.ant-table-cell.ant-table-cell-fix-left {
          background-color: #fafafa !important;
        }

        .ant-table-cell.ant-table-cell-fix-left.ant-table-cell-with-append {
          border-bottom: unset;
        }
      `
    };
  });

  return styleGenerator();
};
