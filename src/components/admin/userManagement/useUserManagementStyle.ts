import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useUserManagementStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      userTableContainer: css`
        .ant-table-cell {
          white-space: nowrap;
          padding-inline-start: ${pxToRem(30)} !important;
          padding-inline-end: ${pxToRem(10)} !important;
          :last-child {
            width: ${pxToRem(56)} !important;
            padding-inline: ${pxToRem(10)} !important;
          }
          :nth-child(2),
          :nth-child(3),
          :nth-child(4) {
            min-width: ${pxToRem(320)} !important;
          }

          @media screen and (max-width: 1200px) {
            :nth-child(2),
            :nth-child(3),
            :nth-child(4) {
              min-width: ${pxToRem(250)} !important;
            }
          }

          @media screen and (max-width: 911px) and (min-width: 768px) {
            :nth-child(2),
            :nth-child(3),
            :nth-child(4) {
              min-width: ${pxToRem(1)} !important;
            }
          }

          @media screen and (max-width: 576px) {
            :first-child {
              padding-inline-start: ${pxToRem(20)} !important;
            }

            padding-inline-start: ${pxToRem(24)} !important;
          }
        }
      `,
      buttonIcons: css`
        .ant-btn {
          padding-inline: 0.6rem 0.1rem;
          padding-block: 0.41rem !important;
        }
      `
    };
  });

  return styleGenerator();
};
