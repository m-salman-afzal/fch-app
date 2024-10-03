import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useReferenceGuideListStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      referenceGuideListTableContainer: css`
        .ant-pagination {
          .ant-pagination-options {
            .ant-select-selector {
              border-radius: ${pxToRem(4)};
            }
          }
        }
        .ant-table-cell {
          padding-inline-start: ${pxToRem(10)} !important;
          padding-inline-end: ${pxToRem(10)} !important;
          :nth-child(1) {
            min-width: ${pxToRem(50)};
            max-width: ${pxToRem(100)};
          }
          :nth-child(2) {
            width: ${pxToRem(130)};
          }
          :nth-child(3) {
            width: ${pxToRem(110)};
          }
          :nth-child(4) {
            max-width: ${pxToRem(300)};
          }
          :nth-child(5) {
            min-width: ${pxToRem(50)};
            max-width: ${pxToRem(100)};
          }
          :nth-child(6) {
            min-width: ${pxToRem(50)};
            max-width: ${pxToRem(100)};
          }
          :nth-child(7) {
            max-width: ${pxToRem(600)};
          }
          :nth-child(8) {
            max-width: ${pxToRem(100)};
          }

          @media screen and (min-width: 768px) and (max-width: 1200px) {
            :nth-child(1) {
              min-width: ${pxToRem(50)};
              max-width: ${pxToRem(70)};
            }
            :nth-child(2) {
              min-width: ${pxToRem(100)};
              max-width: ${pxToRem(150)};
            }
            :nth-child(3) {
              min-width: ${pxToRem(100)};
              max-width: ${pxToRem(150)};
            }
            :nth-child(4) {
              min-width: ${pxToRem(150)};
              max-width: ${pxToRem(200)};
            }
            :nth-child(5) {
              min-width: ${pxToRem(50)};
              max-width: ${pxToRem(70)};
            }
            :nth-child(6) {
              min-width: ${pxToRem(50)};
              max-width: ${pxToRem(70)};
            }
            :nth-child(7) {
              min-width: ${pxToRem(200)};
              max-width: ${pxToRem(300)};
            }
            :nth-child(8) {
              max-width: ${pxToRem(100)};
            }
          }

          @media screen and (max-width: 576px) {
            :nth-child(1) {
              width: ${pxToRem(50)};
            }
            :nth-child(2) {
              width: ${pxToRem(150)};
            }
            :nth-child(3) {
              width: ${pxToRem(110)};
            }
            :nth-child(4) {
              width: ${pxToRem(250)};
            }
            :nth-child(5) {
              width: ${pxToRem(50)};
            }
            :nth-child(6) {
              width: ${pxToRem(50)};
            }
            :nth-child(7) {
              width: ${pxToRem(400)};
            }
            :nth-child(8) {
              width: ${pxToRem(50)};
            }
          }
        }
        tbody {
          font-size: ${pxToRem(12)};
          td span {
            font-size: ${pxToRem(12)};
          }
        }
      `,
      formularyActionItem: css`
        font-size: ${pxToRem(12)} !important;
      `,
      referenceGuideListTitleEditable: css`
        box-shadow: none !important;
        background-color: #f8f8f8;
        input {
          font-size: ${pxToRem(20)} !important;
          font-weight: 600;
          background-color: #f8f8f8;
          @media screen and (max-width: 576px) {
            font-size: ${pxToRem(16)} !important;
          }
        }
      `
    };
  });

  return styleGenerator();
};
