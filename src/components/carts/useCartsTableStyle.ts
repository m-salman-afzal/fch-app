import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useCartsTableStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      cartsTableContainer: css`
        .ant-table-cell {
          padding-inline-start: ${pxToRem(16)} !important;

          @media screen and (min-width: 1600px) {
            min-width: ${pxToRem(215)} !important;
          }

          @media screen and (max-width: 1599px) {
            min-width: ${pxToRem(175)} !important;
          }

          @media screen and (max-width: 1200px) {
            min-width: ${pxToRem(140)} !important;
          }

          @media screen and (max-width: 991px) {
            min-width: ${pxToRem(140)} !important;
          }

          @media screen and (max-width: 768px) {
            min-width: ${pxToRem(140)} !important;
          }

          @media screen and (max-width: 576px) {
            min-width: ${pxToRem(140)} !important;
          }
          white-space: nowrap;
          :nth-child(7) {
            min-width: ${pxToRem(56)} !important;
            width: ${pxToRem(56)} !important;
            max-width: ${pxToRem(56)} !important;
            padding-inline-start: ${pxToRem(0)} !important;
          }

          @media screen and (max-width: 576px) {
            padding-inline-end: ${pxToRem(16)} !important;
          }

          :nth-child(7) {
            padding-inline-end: ${pxToRem(0)} !important;
          }
        }
      `
    };
  });

  return styleGenerator();
};
