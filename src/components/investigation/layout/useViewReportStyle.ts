import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useViewReportStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const sbarrText = `
         color: ${token.colorText}
        font-size: ${pxToRem(14)};
        font-style: normal;
        font-weight: 400;
        line-height: ${pxToRem(22)};
        word-break: auto-phrase;
`;

    return {
      reportTitleClass: css`
        color: #000;
        font-family: Inter;
        font-size: ${pxToRem(20)};
        font-style: normal;
        font-weight: 600;
        line-height: ${pxToRem(28)};

        padding-block-end: ${pxToRem(24)};
        border-block-end: ${pxToRem(1)} solid ${token.colorFillContent};
        margin-block-end: ${pxToRem(24)};
      `,
      viewReportContainer: css`
        padding-inline: ${pxToRem(32)};
        padding-block-start: ${pxToRem(24)};
        width: ${pxToRem(623)};

        @media screen and (max-width: 576px) {
          padding-inline: ${pxToRem(16)};
          width: fit-content;
        }
      `,

      viewReportSubHeading: css`
        color: ${token.colorTextHeading}.;

        font-size: ${pxToRem(14)};
        font-style: normal;
        font-weight: 600;
        line-height: ${pxToRem(22)};
      `,

      viewReportSecion: css`
        padding-block-end: ${pxToRem(24)};
        border-block-end: ${pxToRem(1)} solid ${token.colorFillContent};
        margin-block-end: ${pxToRem(24)};
      `,

      viewReportInfoText: css`
        color: ${token.colorText};
        font-size: ${pxToRem(12)};
        font-style: normal;
        font-weight: 400;
        line-height: ${pxToRem(20)};

        margin-block-start: ${pxToRem(12)};
      `,
      sbarrBox: css`
        width: ${pxToRem(474)};
        height: auto;
        min-height: ${pxToRem(69)};
        border-radius: ${pxToRem(4)};
        border: ${pxToRem(1)} solid ${token.colorBorder};
        padding: ${pxToRem(12)} ${pxToRem(16)};
        margin-block-end: ${pxToRem(6)};

        @media screen and (max-width: 991px) {
          width: auto;
        }
      `,
      sbarrLabel: css`
        width: fit-content;
        background: ${token.colorBgBase};
        color: ${token.colorTextLabel};
        font-size: ${pxToRem(12)};
        font-style: normal;
        font-weight: 400;
        line-height: ${pxToRem(20)};

        position: relative;
        top: ${pxToRem(10)};
        left: ${pxToRem(16)};
        z-index: 2;
      `,
      sbarrText: css`
        ${sbarrText}
        max-height: ${pxToRem(84)};
        overflow-y: hidden;
      `,
      sbarrTextExpanded: css`
        ${sbarrText}
        max-height: unset !important;
      `,
      viewMoreButton: css`
        color: ${token.colorPrimary};
        cursor: pointer;
        margin-block-start: ${pxToRem(12)};
        font-size: ${pxToRem(12)};
      `
    };
  });

  return styleGenerator();
};
