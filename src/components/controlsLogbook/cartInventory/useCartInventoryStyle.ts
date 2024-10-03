import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useInventoryTableStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      inventoryTableContainer: css`
        padding-top: ${pxToRem(4)};

        .ant-table-cell {
          padding-inline-start: ${pxToRem(16)} !important;

          width: ${pxToRem(407)};

          :first-child {
            width: ${pxToRem(71)} !important;
          }

          :last-child {
            width: ${pxToRem(81)} !important;
          }

          @media screen and (max-width: 1599px) {
            :nth-child(2) {
              width: ${pxToRem(194)};
            }
          }
        }

        .ant-table-wrapper {
          margin-bottom: ${pxToRem(12)};

          .ant-table-expanded-row-fixed {
            margin: ${pxToRem(-18)} ${pxToRem(-18)};
          }
        }
      `,
      inventoryLogTableContainer: css`
        .ant-table-cell {
          padding-inline-start: ${pxToRem(16)} !important;

          width: ${pxToRem(265)};

          :nth-child(6) {
            width: ${pxToRem(50)};
            padding-inline-start: 0 !important;
          }

          @media screen and (max-width: 1599px) {
            width: ${pxToRem(188)};
          }

          @media screen and (min-width: 1999px) {
            :nth-child(6) {
              width: ${pxToRem(30)};
            }
          }
        }

        .anticon {
          font-size: ${pxToRem(14)} !important;
        }
      `,
      commentBox: css`
        textarea {
          height: ${pxToRem(175)};
        }
      `,
      commentModal: css`
        margin: ${pxToRem(12)} ${pxToRem(20)} 0;
        padding: ${pxToRem(16)} ${pxToRem(13)} ${pxToRem(18)};
        border-radius: ${pxToRem(18)};
        background: ${token.colorBgContainerDisabled};
      `,
      commentModalText: css`
        font-size: ${pxToRem(14)};
        font-weight: 400;
        color: ${token.colorTextHeading};
        max-height: ${pxToRem(60)};
        overflow-y: auto;
      `,
      commentModalDate: css`
        font-size: ${pxToRem(10)};
        font-weight: 400;
        color: ${token.colorTextDescription};
      `,
      logDrugContainer: css`
        .ant-table-cell {
          padding-inline: ${pxToRem(16)} !important;
          width: ${pxToRem(155)};
          :first-child {
            width: ${pxToRem(195)};
          }
          :nth-child(4) {
            width: ${pxToRem(57)};
          }
        }
      `
    };
  });

  return styleGenerator();
};
