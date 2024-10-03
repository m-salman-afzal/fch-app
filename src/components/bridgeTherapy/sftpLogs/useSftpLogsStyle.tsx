import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useSFTPLogsStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      sftpLogsTableContainer: css`
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
      sftpLogsTable: css`
        .ant-tag {
          margin-inline-end: 0px;
        }
      `
    };
  });

  return styleGenerator();
};
