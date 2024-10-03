import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useFacilityStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      container: css`
        margin-top: ${pxToRem(18)};
        white-space: nowrap;
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

          @media screen and (min-width: 1600px) {
            :nth-child(1) {
              width: ${pxToRem(200)} !important;
            }
            :nth-child(2) {
              width: ${pxToRem(250)} !important;
            }
            :nth-child(3) {
              min-width: ${pxToRem(250)} !important;
            }

            :nth-child(4),
            :nth-child(5),
            :nth-child(6) {
              width: ${pxToRem(130)} !important;
            }

            :nth-child(7) {
              width: ${pxToRem(56)} !important;
            }
          }

          @media screen and (max-width: 1599px) {
            :nth-child(1) {
              min-width: ${pxToRem(200)} !important;
            }
            :nth-child(2) {
              min-width: ${pxToRem(150)} !important;
            }
            :nth-child(3) {
              min-width: ${pxToRem(350)} !important;
            }
            :nth-child(4),
            :nth-child(5),
            :nth-child(6) {
              min-width: ${pxToRem(120)} !important;
            }
            :nth-child(7) {
              min-width: ${pxToRem(56)} !important;
              width: ${pxToRem(56)} !important;
              max-width: ${pxToRem(56)} !important;
            }
          }

          @media screen and (max-width: 1200px) {
            :nth-child(1) {
              min-width: ${pxToRem(200)} !important;
            }
            :nth-child(2) {
              width: ${pxToRem(95)} !important;
              min-width: ${pxToRem(95)} !important;
            }
            :nth-child(3) {
              width: ${pxToRem(150)} !important;
              min-width: ${pxToRem(150)} !important;
            }

            :nth-child(5) {
              min-width: ${pxToRem(100)} !important;
            }
            // :nth-child(6) {
            //   min-width: ${pxToRem(100)} !important;
            // }

            :nth-child(7) {
              min-width: ${pxToRem(56)} !important;
            }
          }

          @media screen and (max-width: 576px) {
            :nth-child(3) {
              min-width: ${pxToRem(150)} !important;
              width: ${pxToRem(150)} !important;
            }

            :nth-child(5) {
              min-width: ${pxToRem(120)} !important;
              width: ${pxToRem(120)} !important;
            }

            :nth-child(6) {
              min-width: ${pxToRem(100)} !important;
              width: ${pxToRem(100)} !important;
            }

            :nth-child(7) {
              min-width: ${pxToRem(56)} !important;
              width: ${pxToRem(56)} !important;
            }
          }
        }
      `
    };
  });

  return styleGenerator();
};
