import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useRequestLogsStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      tableContainer: css`
        padding-block-start: ${pxToRem(16)};
        .ant-table-cell:nth-child(5) {
          max-width: ${pxToRem(58)};
        }
        .ant-table-cell:nth-child(1),
        .ant-table-cell:nth-child(2),
        .ant-table-cell:nth-child(3),
        .ant-table-cell:nth-child(4) {
          width: ${pxToRem(255)};
        }

        @media screen and (min-width: 1400px) {
          .ant-table-cell:nth-child(1),
          .ant-table-cell:nth-child(2),
          .ant-table-cell:nth-child(3),
          .ant-table-cell:nth-child(4) {
            width: ${pxToRem(282)};
          }
        }

        @media screen and (min-width: 1900px) {
          .ant-table-cell:nth-child(1),
          .ant-table-cell:nth-child(2),
          .ant-table-cell:nth-child(4) {
            width: ${pxToRem(390)};
          }

          .ant-table-cell:nth-child(3) {
            width: ${pxToRem(392)};
          }
        }

        .ant-table-cell {
          padding-inline-start: ${pxToRem(16)} !important;
          padding-inline-end: ${pxToRem(16)} !important;
        }

        @media screen and (min-width: 768px) and (max-width: 1200px) {
          .ant-table-cell:nth-child(1),
          .ant-table-cell:nth-child(2),
          .ant-table-cell:nth-child(3),
          .ant-table-cell:nth-child(4) {
            max-width: ${pxToRem(213)};
          }
        }
      `
    };
  });

  return styleGenerator();
};
