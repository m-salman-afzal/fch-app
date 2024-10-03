import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useFacilityClLayoutStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const isIPhone = /iPad|iPhone|iPod/.test(navigator.userAgent);

    return {
      centerAlign: css`
        overflow-y: auto;
        overflow-x: hidden;
        height: calc(100% - ${pxToRem(24)});
        width: 100%;

        @media screen and (max-height: 760px) {
          height: calc(100% - ${pxToRem(150)});
        }
        @media screen and (max-width: 576px) {
          overflow-x: hidden;
          overflow-y: auto;
          height: 100dvh;
          .ant-typography {
            z-index: 1 !important;
          }
        }
      `,
      mainContainer: css`
        width: ${pxToRem(550)};
        // min-height: ${pxToRem(705)};
        border-radius: ${pxToRem(8)};
        padding-block-end: ${pxToRem(24)};
        // margin-block-start: ${pxToRem(20)};
        @media screen and (max-width: 576px) {
          width: 100%;
          border-radius: ${pxToRem(0)};
          margin-block-start: ${pxToRem(0)};
          padding-block-end: calc(
            100vh - 100dvh + ${isIPhone ? pxToRem(220) : pxToRem(220)}
          );
          // border-block-start: ${pxToRem(2)} solid ${token.colorBorder};
        }
      `,

      tabStyle: css`
        .ant-tabs-tab {
          padding: 0px !important;
          margin: 0px !important;
        }
        .ant-tabs-content-holder {
          width: 0px !important;
        }
      `
    };
  });

  return styleGenerator();
};
