import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useSftpPatientsReviewListStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      sftpPatientReviewListTableContainer: css`
        padding-inline: ${pxToRem(20)};
        white-space: nowrap;
        .ant-table-thead {
          .ant-typography {
            font-size: ${pxToRem(14)}!important;
          }
        }

        .ant-table-tbody {
          .ant-typography {
            font-size: ${pxToRem(12)}!important;
          }
        }
        .ant-table-cell {
          padding-inline: ${pxToRem(16)}!important;

          :nth-child(2) {
            min-width: ${pxToRem(102)} !important;
          }
          :nth-child(3) {
            min-width: ${pxToRem(94)} !important;
          }
          :nth-child(4) {
            min-width: ${pxToRem(116)} !important;
          }
          :nth-child(5) {
            min-width: ${pxToRem(138)} !important;
          }
          :nth-child(6),
          :nth-child(7) {
            min-width: ${pxToRem(138)} !important;
          }

          :last-child {
            width: 0;
          }

          @media screen and (max-width: 911px) {
            :nth-child(1) {
              max-width: ${pxToRem(158)} !important;
            }
            :nth-child(2),
            :nth-child(3),
            :nth-child(5) {
              padding-inline-end: ${pxToRem(16)}!important;
              min-width: 0 !important;
            }
            :nth-child(4),
            :nth-child(6) {
              padding-inline-end: ${pxToRem(16)}!important;
            }
          }
        }
      `,
      buttonIcons: css`
        .ant-btn {
          padding-inline: 0.6rem 0.1rem;
          padding-block: 0.41rem !important;
        }
      `,
      noSupplyDays: css`
        .ant-table {
          .ant-table-cell:nth-child(7) {
            min-width: ${pxToRem(58)} !important;
          }
        }
      `
    };
  });

  return styleGenerator();
};
