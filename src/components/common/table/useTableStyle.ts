import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useTableStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
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
      tableClassName: css`
        @media screen and (max-width: 576px) {
          margin-block-end: ${pxToRem(60)};
        }
        .ant-table-thead {
          background-color: #ebebeb;
          opacity: 1;

          .ant-table-cell {
            background-color: transparent;
            padding: 0px 0px 0px 2.14rem !important;
            height: ${pxToRem(38)};
            border-inline-start: ${pxToRem(1)} solid #d8d7d7;
            border-block-start: ${pxToRem(1)} solid #d8d7d7;

            :last-child {
              border-inline-start: ${pxToRem(1)} solid #d8d7d7;
              border-inline-end: ${pxToRem(1)} solid #d8d7d7;
            }
            :before {
              background-color: #d8d7d7 !important;
              height: 100% !important;
              width: 0px;
              display: none;
            }
          }
        }

        .ant-table-tbody {
          .ant-table-cell {
            padding: 0;
            height: ${pxToRem(38)};
            border-inline-start: ${pxToRem(1)} solid #ebebeb;

            :last-child {
              border-inline-start: ${pxToRem(1)} solid #ebebeb;
              border-inline-end: ${pxToRem(1)} solid #ebebeb;
            }
          }
        }

        .ant-table-container
          .ant-table-content
          table
          .ant-table-thead
          tr
          th:first-child {
          border-top-left-radius: 0px !important;
          border-bottom-left-radius: 0px !important;
        }

        .ant-table-container
          .ant-table-content
          table
          .ant-table-thead
          tr
          td:last-child {
          border-top-right-radius: 0px !important;
          border-bottom-right-radius: 0px !important;
        }

        .ant-pagination {
          .ant-pagination-total-text {
            margin-inline-end: auto;

            .ant-typography {
              color: #505f79;
            }
          }
          .ant-pagination-options {
            margin-inline-start: auto;

            @media screen and (max-width: 576px) {
              margin-inline-start: ${pxToRem(46)};
              display: inline;
            }
          }
          .ant-pagination-prev {
            margin-inline-end: ${pxToRem(10)};
            svg {
              color: #7a869a;
              font-size: ${pxToRem(18)};
            }
          }

          .ant-pagination-next {
            margin-inline-start: ${pxToRem(10)};
            svg {
              color: #7a869a;
              font-size: ${pxToRem(18)};
            }
          }

          :after {
            display: none;
            content: none !important;
          }

          .ant-pagination-item {
            background-color: transparent;
            border-radius: ${pxToRem(4)};
            border: none;
            min-width: ${pxToRem(24)};
            height: ${pxToRem(24)};
            line-height: ${pxToRem(24)};
            display: flex;
            justify-content: center;
            width: fit-content;
            margin-inline: ${pxToRem(4)};
            a {
              padding: 0px;
              width: fit-content;
              height: ${pxToRem(24)};
              color: #7a869a;
            }
          }

          .ant-pagination-item-active {
            background-color: ${token.colorPrimary};
            display: flex;
            justify-content: center;
            width: fit-content;
            a {
              color: ${token.colorBgBase};
              margin-inline: ${pxToRem(4)};
            }
          }

          .ant-pagination-options:after {
            content: 'Rows per page';
            padding-left: 8px;
            color: #505f79;
          }
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
