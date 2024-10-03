import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useReportDrawerStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const siderCollapseButton = css`
      position: absolute;
      top: ${pxToRem(72)};
      right: ${pxToRem(400)};
      border: none;
      z-index: 500;
      filter: drop-shadow(0px ${pxToRem(9)} ${pxToRem(28)} rgba(0, 0, 0, 0.05))
        drop-shadow(0px ${pxToRem(3)} ${pxToRem(6)} rgba(0, 0, 0, 0.12))
        drop-shadow(0px ${pxToRem(6)} ${pxToRem(16)} rgba(0, 0, 0, 0.08));

      svg {
        transform: rotate(0deg);
        opacity: 0.6;
      }

      @media screen and (max-width: 1040px) {
        right: 38.7vw;
      }

      @media screen and (max-width: 800px) {
        right: 38.7vw;
      }

      @media screen and (max-width: 576px) {
        display: none !important;
      }
    `;

    const customScrollBar = css`
      /* Chrome, Edge, and Safari */
      ::-webkit-scrollbar {
        width: ${pxToRem(4)};
      }

      ::-webkit-scrollbar-track {
        background: #ffffff00;
      }

      ::-webkit-scrollbar-thumb {
        background-color: #949494;
        border-radius: ${pxToRem(16)};
      }
    `;

    const reportBox = css`
      background-color: ${token.colorBgBase};
      height: 100%;
      border-inline-end: ${pxToRem(2)} solid ${token.colorFillContent};
      overflow-y: auto;
      overflow-x: hidden;
      @media screen and (max-width: 576px) {
        width: 100% !important;
        border-inline-end: ${pxToRem(0)} solid ${token.colorFillContent};
        overflow-y: visible;
        overflow-x: visible;
        height: auto;
      }

      @media screen and (max-width: 991px) and (min-width: 576px) {
        width: fit-content !important;
      }

      ${customScrollBar}
    `;

    return {
      commentBox: css`
        width: ${pxToRem(372)};
        height: 100%;
        background-color: ${token.colorBgContainerDisabled};
        border-block-start: ${pxToRem(1)} solid ${token.colorFillContent};
        padding-inline: ${pxToRem(20)};
        padding-block-start: ${pxToRem(16)};
        overflow-y: auto;

        ${customScrollBar}
        @media screen and (max-width: 576px) {
          width: auto !important;
          padding-inline: ${pxToRem(16)};
          overflow-y: visible;
          height: auto;
          min-height: 50%;
        }
      `,

      drawerBody: css`
        padding: 0px !important;
        display: flex;
        transition: all 100ms linear;
        overflow-y: hidden !important;
        @media screen and (max-width: 576px) {
          flex-direction: column;
          overflow-y: auto !important;
        }
      `,
      reportBox: css`
        width: ${pxToRem(623)};

        ${reportBox}
        ${customScrollBar}
      `,
      reportBoxFull: css`
        width: 100%;
        ${reportBox}
        ${customScrollBar}
      `,
      titleBox: css`
        display: flex;
        align-items: center;
        font-size: ${pxToRem(20)};
        padding-inline-start: ${pxToRem(8)};
        svg {
          color: ${token.colorTextDescription};
          cursor: pointer;
        }

        @media screen and (max-width: 576px) {
          padding-inline-start: ${pxToRem(0)};
          margin-inline-start: ${pxToRem(-8)};
        }
      `,
      titlePadding: css`
        padding-block: ${pxToRem(14)} !important;
      `,
      siderCollapseButton: css`
        ${siderCollapseButton};
      `,
      siderCollapseButtonClosed: css`
        ${siderCollapseButton};
        top: ${pxToRem(72)};
        right: ${pxToRem(5)};

        @media screen and (max-width: 1040px) {
          left: ${pxToRem(9)};
        }

        svg {
          transform: rotate(180deg);
        }
      `,
      commentBoxTitle: css`
        margin-block-start: 0 !important;
        margin-block-end: ${pxToRem(28)} !important;
        font-size: ${pxToRem(16)} !important;

        @media screen and (max-width: 576px) {
          margin-block-end: ${pxToRem(12)} !important;
        }
      `,

      commentBorder: css`
        border-block-end: ${pxToRem(1)} solid ${token.colorFillContent};
        padding-block-end: ${pxToRem(12)};
        margin-block-end: ${pxToRem(10)};
      `,
      commentName: css`
        color: ${token.colorPrimary} !important;
        font-size: ${pxToRem(12)} !important;
        font-weight: 600;
        line-height: ${pxToRem(20)};
      `,
      commentBody: css`
        color: ${token.colorTextDescription} !important;
        font-size: ${pxToRem(12)} !important;
        line-height: ${pxToRem(20)};
      `
    };
  });

  return styleGenerator();
};
