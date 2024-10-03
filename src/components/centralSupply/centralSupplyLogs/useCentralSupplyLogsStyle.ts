import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useCentralSupplyLogsStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      logsTableContainer: css`
        padding-block-start: ${pxToRem(16)};
        .ant-table-thead {
          .ant-table-cell-fix-right {
            background-color: #ebebeb !important;
          }
        }
        .ant-table-cell {
          padding-inline-start: ${pxToRem(16)} !important;
          padding-inline-end: ${pxToRem(16)} !important;

          :first-child {
            min-width: ${pxToRem(161)} !important;
          }

          :nth-child(2) {
            min-width: ${pxToRem(161)} !important;
            max-width: ${pxToRem(364)} !important;
          }

          :nth-child(3) {
            min-width: ${pxToRem(161)} !important;
            max-width: ${pxToRem(364)} !important;
          }

          :last-child {
            padding-inline-start: ${pxToRem(0)} !important;
            padding-inline-end: ${pxToRem(0)} !important;
            max-width: ${pxToRem(56)} !important;
            width: ${pxToRem(56)} !important;
            min-width: ${pxToRem(56)} !important;
          }
        }
        tbody {
          .ant-table-cell svg {
            font-size: ${pxToRem(12)} !important;
          }
        }
      `
    };
  });

  return styleGenerator();
};
