import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useFormularyStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const rowBase = css`
      background-color: var(--bg) !important;
      transition: all 0.2s ease-in-out !important;
      :hover {
        background-color: var(--bg) !important;
        filter: drop-shadow(0px 4px 17px rgba(0, 0, 0, 0.14));
        .ant-table-cell-fix-right {
          background-color: var(--bg) !important;
        }
      }

      .ant-table-cell-row-hover {
        background-color: var(--bg) !important;
      }
      .ant-table-cell-fix-right {
        background-color: var(--bg) !important;
      }
    `;

    return {
      tableToolTipIcon: css`
        margin-left: ${pxToRem(6)};
        color: ${token.colorWarningActive};
      `,
      formularyTableContainer: css`
        white-space: nowrap;
        .ant-table-thead {
          .ant-table-cell {
            font-size: ${pxToRem(14)};
          }
          .ant-table-cell-fix-right {
            background-color: #ebebeb !important;
          }
        }
        .ant-table-tbody {
          .ant-table-cell {
            font-size: ${pxToRem(12)};
          }

          svg {
            font-size: ${pxToRem(16)};
          }
        }

        .ant-table-cell {
          padding-inline-start: ${pxToRem(10)} !important;
          padding-inline-end: ${pxToRem(10)} !important;
          :nth-child(1) {
            width: ${pxToRem(65)};
          }
          :nth-child(2) {
            max-width: ${pxToRem(240)};
          }
          :nth-child(3) {
            max-width: ${pxToRem(150)};
          }
          :nth-child(4) {
            max-width: ${pxToRem(174)};
          }
          :nth-child(5) {
            min-width: ${pxToRem(80)} !important;
          }
          :nth-child(6) {
            max-width: ${pxToRem(131)};
          }
          :nth-child(7) {
            max-width: ${pxToRem(117)};
          }
          :nth-child(8) {
            max-width: ${pxToRem(100)};
          }
          :nth-child(9) {
            max-width: ${pxToRem(100)};
          }
          :last-child(10) {
            max-width: ${pxToRem(48)};
            padding-inline: ${pxToRem(10)} !important;
          }

          @media screen and (max-width: 1200px) and (min-width: 768px) {
            :nth-child(2) {
              max-width: ${pxToRem(65)};
            }
            :nth-child(3) {
              max-width: ${pxToRem(201)};
            }
            :nth-child(4) {
              max-width: ${pxToRem(150)};
            }
            :nth-child(5) {
              max-width: ${pxToRem(174)};
            }
            :nth-child(6) {
              min-width: ${pxToRem(80)} !important;
            }
            :nth-child(7) {
              max-width: ${pxToRem(131)};
            }
            :nth-child(8) {
              max-width: ${pxToRem(110)};
            }
            :nth-child(9) {
              max-width: ${pxToRem(110)};
            }
            :last-child(10) {
              max-width: ${pxToRem(100)};
            }
          }

          @media screen and (max-width: 576px) {
            :nth-child(2) {
              max-width: ${pxToRem(65)};
            }
            :nth-child(3) {
              max-width: ${pxToRem(201)};
            }
            :nth-child(4) {
              max-width: ${pxToRem(150)};
            }
            :nth-child(5) {
              max-width: ${pxToRem(174)};
            }
            :nth-child(6) {
              min-width: ${pxToRem(80)} !important;
            }
            :nth-child(7) {
              max-width: ${pxToRem(131)};
            }
            :nth-child(8) {
              max-width: ${pxToRem(110)};
            }
            :nth-child(9) {
              max-width: ${pxToRem(110)};
            }
            :last-child {
              max-width: ${pxToRem(100)};
            }
          }
        }
      `,
      formularyActionItem: css`
        font-size: ${pxToRem(12)} !important;
      `,
      drugNameRadioGroup: css`
        display: flex;
        justify-content: center;
        column-gap: ${pxToRem(11)};
        @media screen and (max-width: 576px) {
          flex-direction: column;
          align-items: center;
          row-gap: ${pxToRem(10)};
        }
        label {
          width: ${pxToRem(311)};
          height: ${pxToRem(68)};
          border: ${pxToRem(1)} solid rgba(0, 0, 0, 0.15);
          border-radius: ${pxToRem(4)};
          margin-inline-end: 0;
          position: relative;
          :hover {
            border: ${pxToRem(1)} solid #0958d9;
          }
        }
        .selectedRadioButton {
          border: ${pxToRem(1)} solid #0958d9;
        }
        label > span:nth-child(1) {
          position: absolute;
          top: ${pxToRem(12)};
          left: ${pxToRem(10)};
        }

        label > span:nth-child(2) {
          position: absolute;
          font-weight: 600;
          top: ${pxToRem(9)};
          left: ${pxToRem(24)};
        }

        span.radioButtonSubtitle {
          color: rgba(0, 0, 0, 0.45);
          font-size: ${pxToRem(12)};
          font-weight: 400;
          position: absolute;
          width: ${pxToRem(260)};
          top: ${pxToRem(23)};
          left: ${pxToRem(9)};
        }
      `,
      switchContainer: css`
        height: ${pxToRem(44)};
        align-items: center;
        margin-left: ${pxToRem(25)};
        @media screen and (max-width: 576px) {
          margin-left: 0;
        }
        .switchSupportingText {
          display: flex;
          flex-direction: column;
          margin-left: ${pxToRem(20)};
        }
        .switchMainTitle {
          font-weight: 600;
        }
        .switchSubTitle {
          font-size: ${pxToRem(12)};
          color: rgba(0, 0, 0, 0.45);
        }
      `,
      controllConfirmDestructiveIcon: css`
        border-radius: 50%;
        background-color: ${token.colorErrorBg};
        padding: 1rem;
      `,
      controllConfirmWarningIcon: css`
        border-radius: 50%;
        background-color: ${token.colorWarningBg};
        padding: 1rem;
      `,
      rowLight: css`
        --bg: ${token.colorBgBase};
        ${rowBase}
      `,
      rowDark: css`
        --bg: #fafafa;
        ${rowBase}
      `
    };
  });

  return styleGenerator();
};
