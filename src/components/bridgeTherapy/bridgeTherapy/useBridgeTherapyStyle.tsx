import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useBridgeTherapyStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const selectBox = css`
      .ant-select-single {
        height: ${pxToRem(26)} !important;
        width: ${pxToRem(80)} !important;
        .ant-select-selector {
          padding: ${pxToRem(2)} ${pxToRem(6)} !important;
        }
      }

      .ant-select-selector {
        background: ${token.colorBgContainer} !important;
      }
    `;

    return {
      bridgeTherapyTableContainer: css`
        .ant-table-cell {
          white-space: nowrap;
          @media screen and (min-width: 1600px) {
            padding-inline-start: ${pxToRem(16.6)} !important;

            :first-child {
              // padding-inline-start: ${pxToRem(33.58)} !important;
              // padding-inline-end: ${pxToRem(33.58)} !important;
            }

            :last-child {
              // padding-inline-start: ${pxToRem(30.0)} !important;
              // padding-inline-end: ${pxToRem(30.0)} !important;
            }
          }

          @media screen and (max-width: 1599px) {
            // padding-inline-start: ${pxToRem(43.0)} !important;

            :first-child {
              // padding-inline-start: ${pxToRem(30)} !important;
              // padding-inline-end: ${pxToRem(30)} !important;
            }

            :last-child {
              // padding-inline-start: ${pxToRem(20.0)} !important;
              // padding-inline-end: ${pxToRem(20.0)} !important;
            }
          }

          @media screen and (max-width: 1280px) and (min-width: 768px) {
            padding-inline-start: ${pxToRem(21.0)} !important;
            padding-inline-end: ${pxToRem(21.0)} !important;

            :first-child {
              // padding-inline-start: ${pxToRem(29)} !important;
              // padding-inline-end: ${pxToRem(29)} !important;
            }
          }

          @media screen and (max-width: 767px) {
            // padding-inline-start: ${pxToRem(21)} !important;
            // padding-inline-end: ${pxToRem(21.0)} !important;

            :first-child {
              // padding-inline-start: ${pxToRem(24.2)} !important;
              // padding-inline-end: ${pxToRem(24.2)} !important;
            }
          }
        }
      `,
      bridgeTherapyTable: css`
        .ant-tag {
          margin-inline-end: 0px;
        }
      `,
      selectBox: css`
        ${selectBox}
        .ant-typography {
          display: none;
        }
      `,
      selectBoxItem: css`
        .ant-select-item {
          padding: ${pxToRem(2)} ${pxToRem(6)};
          line-height: ${pxToRem(21)}!important;
          min-height: ${pxToRem(26)};
        }
      `,
      selectBoxItemReview: css`
        ${selectBox}
        .ant-typography {
          display: none;
        }
        .ant-select {
          text-align: center;
        }

        .ant-select-arrow {
          display: none;
        }
        .ant-select-selection-item {
          padding-inline-end: 0 !important;
        }
      `
    };
  });

  return styleGenerator();
};
