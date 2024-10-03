import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useSafeReportHistoryTableStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      tableClassName: css`
        margin-top: ${pxToRem(18)};

        .ant-table-cell {
          padding-inline-start: ${pxToRem(16)} !important;

          :first-child {
            min-width: ${pxToRem(137)} !important;
          }

          :nth-child(2) {
            min-width: ${pxToRem(119)} !important;
          }

          :nth-child(3) {
            min-width: ${pxToRem(162)} !important;
          }

          :nth-child(4) {
            min-width: ${pxToRem(162)} !important;
          }

          :nth-child(5) {
            min-width: ${pxToRem(162)} !important;
          }

          :nth-child(6) {
            min-width: ${pxToRem(162)} !important;
          }

          :nth-child(7) {
            min-width: ${pxToRem(125)} !important;
          }

          :last-child {
            min-width: ${pxToRem(56)} !important;
            padding-block: ${pxToRem(8)} !important;
            padding-inline: ${pxToRem(10)} !important;
          }

          @media screen and (max-width: 576px) {
            padding-inline-start: ${pxToRem(16)} !important;

            :first-child {
              min-width: ${pxToRem(137)} !important;
            }

            :nth-child(2) {
              min-width: ${pxToRem(119)} !important;
            }

            :nth-child(3) {
              min-width: ${pxToRem(162)} !important;
            }

            :nth-child(4) {
              min-width: ${pxToRem(162)} !important;
            }

            :nth-child(5) {
              min-width: ${pxToRem(162)} !important;
            }

            :nth-child(6) {
              min-width: ${pxToRem(162)} !important;
            }

            :nth-child(7) {
              min-width: ${pxToRem(125)} !important;
            }

            :last-child {
              width: ${pxToRem(130)} !important;
              padding-inline: ${pxToRem(16)} !important;
            }
          }
        }
      `
    };
  });

  return styleGenerator();
};
