import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useReStockLogTableStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const commonContainer = css`
      white-space: nowrap;

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
        padding-inline: ${pxToRem(16)} !important;
        padding-block: ${pxToRem(8)} !important;
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
        filter: drop-shadow(0px 4px 17px rgba(0, 0, 0, 0.14));
      }

      .ant-table-cell-row-hover {
        background-color: var(--bg) !important;
      }
    `;

    return {
      standardAfterHoursContainer: css`
        ${commonContainer},
        .ant-table-cell {
          @media screen and (min-width: 1600px) {
            :nth-child(1),
            :nth-child(2),
            :nth-child(3),
            :nth-child(4),
            :nth-child(5),
            :nth-child(6) {
              min-width: ${pxToRem(260)} !important;
            }
          }

          @media screen and (max-width: 1599px) {
            :nth-child(1),
            :nth-child(2),
            :nth-child(3),
            :nth-child(4),
            :nth-child(5),
            :nth-child(6) {
              min-width: ${pxToRem(180)} !important;
            }
          }

          @media screen and (max-width: 1200px) {
            :nth-child(1),
            :nth-child(2),
            :nth-child(3),
            :nth-child(4),
            :nth-child(6),
            :nth-child(5) {
              min-width: ${pxToRem(156)} !important;
            }
          }

          @media screen and (max-width: 576px) {
            :nth-child(1),
            :nth-child(2),
            :nth-child(3) {
              min-width: ${pxToRem(0)} !important;
            }
            :nth-child(4) {
              min-width: ${pxToRem(110)} !important;
            }
            :nth-child(5) {
              min-width: ${pxToRem(100)} !important;
            }
            :nth-child(6) {
              min-width: ${pxToRem(0)} !important;
            }
          }
        }
      `,
      initalAllocationContainer: css`
        ${commonContainer},
        .ant-table-cell {
          @media screen and (min-width: 1600px) {
            :nth-child(1),
            :nth-child(2),
            :nth-child(3),
            :nth-child(4),
            :nth-child(5) {
              min-width: ${pxToRem(300)}!important;
            }
          }

          @media screen and (max-width: 1599px) {
            :nth-child(1),
            :nth-child(2),
            :nth-child(3),
            :nth-child(4),
            :nth-child(5) {
              min-width: ${pxToRem(220)} !important;
            }
          }

          @media screen and (max-width: 1200px) {
            :nth-child(1),
            :nth-child(2),
            :nth-child(3) :nth-child(4),
            :nth-child(5) {
              min-width: ${pxToRem(170)} !important;
            }
          }

          @media screen and (max-width: 576px) {
            :nth-child(1),
            :nth-child(2),
            :nth-child(3) {
              min-width: ${pxToRem(110)} !important;
            }
            :nth-child(4) {
              min-width: ${pxToRem(100)} !important;
            }
            :nth-child(5) {
              min-width: ${pxToRem(0)} !important;
            }
          }
        }
      `,
      withCartContainer: css`
        ${commonContainer},

        .ant-table-cell {
          @media screen and (min-width: 1600px) {
            :nth-child(1),
            :nth-child(2),
            :nth-child(3) {
              min-width: ${pxToRem(221)}!important;
            }
          }

          @media screen and (max-width: 1599px) {
            :nth-child(1),
            :nth-child(2),
            :nth-child(3) {
              min-width: ${pxToRem(221)} !important;
            }
          }

          @media screen and (max-width: 1200px) {
            :nth-child(1),
            :nth-child(2),
            :nth-child(3) {
              min-width: ${pxToRem(160)} !important;
            }
          }

          @media screen and (max-width: 576px) {
            :nth-child(1) {
              min-width: ${pxToRem(216)} !important;
            }
            :nth-child(2) {
              min-width: ${pxToRem(68)} !important;
            }
            :nth-child(3) {
              min-width: ${pxToRem(68)} !important;
            }
          }
        }
      `,
      withoutCartContainer: css`
        ${commonContainer},

        .ant-table-cell {
          @media screen and (min-width: 1600px) {
            :nth-child(1),
            :nth-child(2) {
              min-width: ${pxToRem(332)}!important;
            }
          }

          @media screen and (max-width: 1599px) {
            :nth-child(1),
            :nth-child(2) {
              min-width: ${pxToRem(332)} !important;
            }
          }

          @media screen and (max-width: 1200px) {
            :nth-child(1),
            :nth-child(2) {
              min-width: ${pxToRem(214)} !important;
            }
          }

          @media screen and (max-width: 576px) {
            :nth-child(1) {
              min-width: ${pxToRem(282)} !important;
            }
            :nth-child(2) {
              min-width: ${pxToRem(68)} !important;
            }
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
