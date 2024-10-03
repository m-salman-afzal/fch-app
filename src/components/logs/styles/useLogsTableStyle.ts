import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useLogsTableStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const common = css`
      padding-inline-start: ${pxToRem(16)} !important;
      padding-inline-end: ${pxToRem(16)} !important;
      :nth-child(1) {
        max-width: ${pxToRem(260)} !important;
      }
      :nth-child(2) {
        max-width: ${pxToRem(365)} !important;
      }
      :nth-child(3) {
        max-width: ${pxToRem(565)} !important;
      }
      :nth-child(4) {
        max-width: ${pxToRem(305)} !important;
      }
    `;

    return {
      logTableContainer: css`
        .ant-table-thead {
          .ant-table-cell {
            white-space: nowrap;
            ${common},
            @media screen and (max-width: 1200px) and (min-width: 576px) {
              ${common},
            }

            @media screen and (max-width: 576px) {
              ${common},
            }

            tbody {
              font-size: ${pxToRem(12)};
              td span {
                font-size: ${pxToRem(12)};
              }
            }
          }
        }

        .ant-table-tbody {
          .ant-table-cell {
            white-space: nowrap;
            ${common},

            @media screen and (max-width: 1200px) and (min-width: 576px) {
              ${common},
            }

            @media screen and (max-width: 576px) {
              ${common},
            }

            tbody {
              font-size: ${pxToRem(12)};
              td span {
                font-size: ${pxToRem(12)};
              }
            }
          }
        }
      `
    };
  });

  return styleGenerator();
};
