import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useShiftCountStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      tableContainer: css`
        .ant-table-cell {
          padding-inline: ${pxToRem(16)} !important;

          width: 25%;

          :first-child {
            width: 7%;

            @media screen and (max-width: 1024px) {
              width: 15%;
            }
          }

          :nth-child(2) {
            width: 40%;
          }

          :last-child {
            width: 8%;
          }
        }
      `,

      tableLogDrugContainer: css`
        .ant-table-cell {
          padding-inline: ${pxToRem(16)} !important;

          width: 14%;

          :first-child {
            width: 8%;

            @media screen and (max-width: 1200px) {
              width: 9%;
            }

            @media screen and (max-width: 1024px) {
              width: 8%;
            }
          }

          :nth-child(2) {
            width: 30%;

            @media screen and (max-width: 1200px) {
              width: 20%;
            }

            @media screen and (max-width: 1024px) {
              width: 20%;
              min-width: ${pxToRem(300)};
            }
          }

          :nth-child(3) {
            width: 18%;

            @media screen and (max-width: 1024px) {
              width: 18%;
              min-width: ${pxToRem(220)};
            }
          }

          :nth-child(5),
          :nth-child(6) {
            width: 11%;

            @media screen and (max-width: 1280px) {
              width: 13%;
            }

            @media screen and (max-width: 1024px) {
              width: 13%;
              min-width: ${pxToRem(125)};
            }
          }
        }
      `,

      logsTableContainer: css`
        .ant-table-cell {
          padding-inline: ${pxToRem(16)} !important;

          svg {
            font-size: ${pxToRem(13.5)};
          }

          width: 24%;
          min-width: ${pxToRem(122)};

          :first-child {
            min-width: ${pxToRem(150)};
          }

          :nth-child(5) {
            width: 7.5%;
          }

          :last-child {
            max-width: ${pxToRem(58)};
            width: ${pxToRem(58)};
            min-width: ${pxToRem(58)};
          }
        }
      `,

      messageStyle: css`
        border-radius: ${pxToRem(18)};
        padding-block: ${pxToRem(16)};
        padding-inline: ${pxToRem(13)};
        background: ${token.colorBgContainerDisabled};
      `,
      messageDateTime: css`
        color: ${token.colorTextDescription};
        font-size: ${pxToRem(10)} !important;
        font-weight: 400;
        line-height: ${pxToRem(20)};
      `,
      blankCartText: css`
        color: ${token.colorTextHeading};
        text-align: center;

        font-size: ${pxToRem(20)};
        font-style: normal;
        font-weight: 600;
        line-height: 140%;
      `,

      blankCartIcon: css`
        width: ${pxToRem(80)};
        height: ${pxToRem(80)};
        flex-shrink: 0;
        border-radius: ${pxToRem(40)};
        background: ${token.colorPrimaryBg};

        display: flex;
        justify-content: center;
        align-items: center;
      `,
      blankCartMainDiv: css`
        margin-block-start: ${pxToRem(20)};

        padding: ${pxToRem(20)};

        border-radius: ${pxToRem(8)};
        background: ${token.colorBorderBg};

        width: ${pxToRem(330)};
        height: ${pxToRem(260)};

        @media screen and (max-width: 576px) {
          width: 100%;
        }
      `,
      blankCartPadding: css`
        @media screen and (max-width: 576px) {
          padding-inline: 20px;
        }
      `
    };
  });

  return styleGenerator();
};
