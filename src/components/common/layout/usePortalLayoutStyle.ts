import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const usePortalLayoutStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      contentStyle: css`
        height: 90dvh;

        @media screen and (min-width: 1600px) {
          padding-inline: ${pxToRem(48)};
          padding-block-start: ${pxToRem(24)};
        }

        @media screen and (max-width: 1599px) {
          padding-inline: ${pxToRem(40)};
          padding-block-start: ${pxToRem(16)};
        }

        @media screen and (max-width: 1200px) {
          padding-inline: ${pxToRem(20)};
          padding-block-start: ${pxToRem(16)};
        }
        @media screen and (max-width: 576px) {
          padding-inline: ${pxToRem(0)};
          padding-block-start: ${pxToRem(65 + 8)};
          padding-block-end: calc(100vh - 100svh);
          height: 100dvh;
        }

        @media screen and (max-width: 1200px) and (min-width: 768px) {
          padding-inline-end: ${pxToRem(20)};
          padding-inline-start: ${pxToRem(90)};
          padding-block-start: ${pxToRem(16)};
          padding-block-end: ${pxToRem(20)};
        }
      `,

      contentStyleScroll: css`
        /* overflow-y: auto; */
        height: 90dvh;

        @media screen and (min-width: 1600px) {
          padding-inline: ${pxToRem(48)} ${pxToRem(33)};
          padding-block-start: ${pxToRem(24)};
        }

        @media screen and (max-width: 1599px) {
          padding-inline: ${pxToRem(40)} ${pxToRem(25)};
          padding-block-start: ${pxToRem(16)};
        }

        @media screen and (max-width: 1200px) {
          padding-inline: ${pxToRem(20)};
          padding-block-start: ${pxToRem(16)};
        }
        @media screen and (max-width: 576px) {
          padding-inline: ${pxToRem(20)};
          padding-block-start: ${pxToRem(8)};
          padding-block-end: ${pxToRem(20)};

          height: 100dvh;
        }

        @media screen and (max-width: 1200px) and (min-width: 768px) {
          padding-inline-end: ${pxToRem(20)};
          padding-inline-start: ${pxToRem(90)};
          padding-block-start: ${pxToRem(16)};
          padding-block-end: 2dvh;
        }
      `
    };
  });

  return styleGenerator();
};
