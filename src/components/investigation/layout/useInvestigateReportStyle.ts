import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useInvestigateReportStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      investigateReportContainer: css`
        padding-inline: ${pxToRem(32)};

        min-width: ${pxToRem(623)};
        max-width: ${pxToRem(623)};
        width: 100%;
        @media screen and (max-width: 576px) {
          padding-inline: ${pxToRem(16)};
          min-width: unset;
        }
        padding-block-start: ${pxToRem(24)};
      `,
      titleClass: css`
        padding-block-end: ${pxToRem(24)};
        border-block-end: ${pxToRem(1)} solid ${token.colorFillContent};
        margin-block-end: ${pxToRem(24)};
      `,
      investigationTitle: css`
        color: #000;
        font-family: Inter;
        font-size: ${pxToRem(24)} !important;
        font-style: normal;
        font-weight: 600;
        line-height: ${pxToRem(28)} !important;
        margin-top: 0px !important;
        margin-bottom: ${pxToRem(24)} !important;
      `,

      subHeading: css`
        color: ${token.colorTextLabel};
        font-size: ${pxToRem(16)};
        font-style: normal;
        font-weight: 600;
        line-height: ${pxToRem(24)};
      `,
      investigateReportSecion: css`
        padding-block-end: ${pxToRem(24)};
        border-block-end: ${pxToRem(1)} solid ${token.colorFillContent};
        margin-block-end: ${pxToRem(24)};
      `,

      investigateReportSecionEnd: css`
        padding-block-end: ${pxToRem(12)};
        border-block-end: ${pxToRem(0)} solid ${token.colorFillContent};
        margin-block-end: ${pxToRem(0)};
      `,

      ownerPill: css`
        background-color: ${token.colorPrimaryBg};
        color: ${token.colorPrimaryText};
      `,
      radioGroup: css`
        padding-inline: ${pxToRem(16)};
        padding-block: ${pxToRem(10)};
        border: ${pxToRem(2)} solid ${token.colorFillContent};
        border-radius: ${pxToRem(4)};
        margin-block-end: ${pxToRem(12)};
      `,
      radioText: css`
        color: ${token.colorText};

        font-size: ${pxToRem(14)};
        font-style: normal;
        font-weight: 600;
        line-height: ${pxToRem(22)};
      `,

      reviewText: css`
        max-height: ${pxToRem(220)};
        overflow: hidden;
        color: ${token.colorText};
        font-size: ${pxToRem(14)};
        font-style: normal;
        font-weight: 400;
        line-height: ${pxToRem(22)};
        padding-inline: ${pxToRem(16)};
        word-break: auto-phrase;
      `,
      reviewTextFull: css`
        max-height: unset !important;
        color: ${token.colorText};
        font-size: ${pxToRem(14)};
        font-style: normal;
        font-weight: 400;
        line-height: ${pxToRem(22)};
        padding-inline: ${pxToRem(16)};
        word-break: break-all;
      `,
      viewMoreButton: css`
        color: ${token.colorPrimary};
        cursor: pointer;
        margin-block-start: ${pxToRem(16)};
        padding-inline: ${pxToRem(16)};

        margin-block-end: ${pxToRem(16)};
      `,
      reviewFindingsYes: css`
        border-block-end: ${pxToRem(1)} solid ${token.colorFillContent};
        padding-inline: ${pxToRem(16)};
        padding-block: ${pxToRem(12)};
        margin-block-end: ${pxToRem(10)};
      `,
      assigneeContainer: css`
        display: flex;
        width: auto;
        margin-block-start: ${pxToRem(16)};
        row-gap: ${pxToRem(10)};
        flex-wrap: wrap;
      `
    };
  });

  return styleGenerator();
};
