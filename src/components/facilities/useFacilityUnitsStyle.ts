import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useFacilityUnitsStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      facilityUnitsDrawer: css`
        .ant-form-item {
          margin-bottom: 0px !important;
        }
      `,
      unitsTableContainer: css`
        .ant-table-header {
          border-radius: 0px !important;
        }
        table {
          border-style: none;
        }

        thead > tr:nth-child(1) > th:nth-child(3) {
          border-start-end-radius: 0px !important;
        }
        thead > tr:nth-child(1) > th:nth-child(1) {
          border-radius: 0px !important;
        }
        th {
          font-size: ${pxToRem(12)};
          font-weight: 600;
        }

        tbody .ant-table-cell {
          font-size: ${pxToRem(12)} !important;
        }
        .ant-table-cell {
          :nth-child(1) {
            padding-inline-start: ${pxToRem(15)} !important;
          }
        }

        .ant-pagination-options {
          margin-right: ${pxToRem(5)};
          :after {
            content: 'Units' !important;
          }
        }
      `
    };
  });

  return styleGenerator();
};
