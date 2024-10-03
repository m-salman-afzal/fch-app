import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useCartRequestTableStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      tableContainer: css`
        .ant-table-cell:nth-child(1) {
          width: ${pxToRem(48)};
        }
        .ant-table-cell:not(.ant-table-cell:first-child) {
          padding-inline-start: ${pxToRem(16)} !important;
        }
        .ant-table-cell:nth-child(2) {
        }
        .ant-table-cell:nth-child(3) {
          width: ${pxToRem(150)};
        }

        .ant-table-cell:nth-child(4),
        .ant-table-cell:nth-child(5) {
          width: ${pxToRem(150)};
        }
        .ant-table-cell:nth-child(6) {
          width: ${pxToRem(150)};
        }
        .ant-table-cell:nth-child(7) {
          width: ${pxToRem(120)};
        }

        .disabled-row {
          color: rgba(0, 0, 0, 0.25);

          .ant-checkbox-wrapper,
          .ant-radio-wrapper {
            pointer-events: none;
          }
        }
      `,
      searchBar: css`
        .ant-input-affix-wrapper {
          background: rgba(0, 0, 0, 0.06);
          width: ${pxToRem(255)};
          .anticon {
            color: #797979;
          }
          input {
            background: rgb(233 233 233);
          }
        }
      `,
      reviewModal: css`
        @media screen and (min-width: 1440px) {
          width: 80% !important;
          max-width: ${pxToRem(1440)};

          .ant-table-cell {
            :nth-child(3) {
              width: 7.5% !important;
            }
            :nth-child(4) {
              width: 7.5% !important;
            }

            :nth-child(5) {
              width: 12% !important;
            }
            :nth-child(6) {
              width: 12% !important;
            }
          }
        }

        width: ${pxToRem(800)} !important;

        @media screen and (max-width: 576px) {
          position: absolute;
          bottom: 0;
          .ant-modal-content {
            position: absolute;
            bottom: 0;
            width: 108%;
          }
        }

        .ant-modal-content {
          padding: 0;
          .ant-modal-close-icon svg {
            width: ${pxToRem(26)};
            height: ${pxToRem(26)};
          }
        }

        .ant-modal-body {
          padding: ${pxToRem(20)};
        }

        .ant-modal-header {
          padding: ${pxToRem(12)} ${pxToRem(20)};
          margin-bottom: 0;
          border-bottom: ${pxToRem(1)} solid ${token.colorBorder};

          .ant-modal-title {
            font-size: ${pxToRem(20)};
          }
        }

        .ant-modal-footer {
          border-top: ${pxToRem(1)} solid ${token.colorBorder};
          margin-top: 0;
          padding: ${pxToRem(12)} ${pxToRem(20)};
        }
        .ant-table-wrapper
          .ant-table-container
          table
          > thead
          > tr:first-child
          > *:last-child {
          border-start-end-radius: 0;
        }

        .ant-table-cell {
          padding-inline-start: ${pxToRem(16)} !important;
        }
        .ant-table-cell:first-child {
          min-width: ${pxToRem(174)};
          max-width: ${pxToRem(250)};
          padding-inline-end: ${pxToRem(16)} !important;
        }
        .ant-table-cell:nth-child(2) {
          max-width: ${pxToRem(110)};
          min-width: ${pxToRem(85)};
        }

        .ant-table-cell:nth-child(3),
        .ant-table-cell:nth-child(4) {
          width: ${pxToRem(65)};
          padding-inline-end: ${pxToRem(16)};
        }

        .ant-table-cell:nth-child(5) {
          width: ${pxToRem(132)};
        }

        .ant-table-cell:nth-child(6) {
          width: ${pxToRem(80)};
        }
      `,
      heading: css`
        margin-bottom: 0 !important;
        display: inline;
        font-size: ${pxToRem(20)};
        font-weight: 600;
        @media screen and (max-width: 576px) {
          font-size: ${pxToRem(16)};
        }
      `,
      stickyTable: css`
        @media screen and (max-width: 576px) {
          .ant-table-cell:nth-child(7) {
            position: sticky !important;
            z-index: 2;
            right: ${pxToRem(4)};
            background: #ffffff;
          }

          .ant-table-thead .ant-table-cell:nth-child(7) {
            background-color: #ebebeb;
            right: ${pxToRem(4)};
          }
        }
      `,
      disabledIcon: css`
        color: ${token.colorWarning};
        cursor: pointer;
      `
    };
  });

  return styleGenerator();
};
