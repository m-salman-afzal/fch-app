import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useRxOrdersStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      ordersTableContainer: css`
        padding-block-start: ${pxToRem(16)};
        .ant-table-thead {
          .ant-table-cell-fix-right {
            background-color: #ebebeb !important;
          }
        }
        .ant-table-cell {
          padding-inline-start: ${pxToRem(16)} !important;
          padding-inline-end: ${pxToRem(16)} !important;
          :nth-child(1) {
            width: ${pxToRem(50)} !important;
          }
          :nth-child(2) {
            width: ${pxToRem(65)} !important;
          }
          :nth-child(4) {
            width: ${pxToRem(150)} !important;
          }
          :nth-child(5) {
            width: ${pxToRem(150)} !important;
          }
          :nth-child(6) {
            width: ${pxToRem(100)} !important;
          }
          :nth-child(7) {
            width: ${pxToRem(115)} !important;
          }
          :nth-child(8) {
            width: ${pxToRem(100)} !important;
          }
          :nth-child(10) {
            width: ${pxToRem(100)} !important;
          }
          :nth-child(14) {
            width: ${pxToRem(100)} !important;
          }
          :nth-child(15) {
            width: ${pxToRem(100)} !important;
          }
        }
        tbody {
          .ant-table-cell svg {
            font-size: ${pxToRem(16)} !important;
          }
        }
      `,
      noDataTableContainer: css`
        padding-block-start: ${pxToRem(16)};
        .ant-table-thead {
          .ant-table-cell-fix-right {
            background-color: #ebebeb !important;
          }
        }
        .ant-table-cell {
          padding-inline-start: ${pxToRem(16)} !important;
          padding-inline-end: ${pxToRem(16)} !important;
          :nth-child(1) {
            width: ${pxToRem(50)} !important;
          }
          :nth-child(2) {
            width: ${pxToRem(50)} !important;
          }
          :nth-child(3) {
            width: ${pxToRem(90)} !important;
          }
          :nth-child(4) {
            width: ${pxToRem(150)} !important;
          }
          :nth-child(5) {
            width: ${pxToRem(150)} !important;
          }
          :nth-child(6) {
            width: ${pxToRem(100)} !important;
          }
          :nth-child(7) {
            width: ${pxToRem(115)} !important;
          }
          :nth-child(8) {
            width: ${pxToRem(100)} !important;
          }
          :nth-child(9) {
            width: ${pxToRem(150)} !important;
          }
          :nth-child(10) {
            width: ${pxToRem(100)} !important;
          }
          :nth-child(11) {
            width: ${pxToRem(120)} !important;
          }
          :nth-child(12) {
            width: ${pxToRem(120)} !important;
          }
          :nth-child(13) {
            width: ${pxToRem(125)} !important;
          }
          :nth-child(14) {
            width: ${pxToRem(100)} !important;
          }
          :nth-child(15) {
            width: ${pxToRem(100)} !important;
          }
        }
        tbody {
          .ant-table-cell svg {
            font-size: ${pxToRem(16)} !important;
          }
        }
      `,
      reviewOrderTableContainer: css`
        padding-inline: ${pxToRem(20)};
        white-space: nowrap;
        .ant-table-cell {
          padding-inline: ${pxToRem(16)}!important;
          :nth-child(2) {
            max-width: ${pxToRem(400)} !important;
          }
          :nth-child(3) {
            width: ${pxToRem(150)} !important;
          }
          :nth-child(4) {
            width: ${pxToRem(150)} !important;
          }
          :nth-child(5) {
            width: ${pxToRem(120)} !important;
          }
          :nth-child(6) {
            width: ${pxToRem(120)} !important;
          }
        }
      `,
      centralSupplyFilterSlider: css`
        .ant-slider:hover {
          .ant-slider-track {
            background-color: #0858d9;
          }
        }
        .ant-slider-track {
          background-color: #0858d9;
        }
        .ant-slider-handle::after {
          box-shadow: 0 0 0 0.14286rem #0858d9 !important;
        }
      `
    };
  });

  return styleGenerator();
};
