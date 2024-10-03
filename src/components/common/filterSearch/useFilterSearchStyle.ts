import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useFilterSearchStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      searchBox: css`
        width: ${pxToRem(254)};
        background-color: #0000000f;
        border-radius: ${pxToRem(4)};
        border: none;
        height: ${pxToRem(32)};
        input {
          background-color: transparent;

          ::placeholder {
            color: #797979;
          }
        }

        svg {
          color: #797979;
        }

        @media screen and (max-width: 576px) {
          width: 100%;
          max-width: 211px;
        }

        @media screen and (max-width: 1200px) {
          width: 100%;
          max-width: 200px;
        }
      `,
      searchBoxFocused: css`
        width: ${pxToRem(254)};
        background-color: ${token.colorBgBase};
        border-radius: ${pxToRem(4)};
        border: ${pxToRem(1)} solid ${token.colorPrimary};
        height: ${pxToRem(32)};
        box-shadow:
          0px ${pxToRem(5)} ${pxToRem(12)} ${pxToRem(4)} rgba(0, 0, 0, 0.09),
          0px ${pxToRem(3)} ${pxToRem(6)} 0px rgba(0, 0, 0, 0.12),
          0px ${pxToRem(1)} ${pxToRem(2)} ${pxToRem(-2)} rgba(0, 0, 0, 0.16);
        input {
          background-color: transparent;

          ::placeholder {
            color: #797979;
          }
        }

        svg {
          color: #797979;
        }

        @media screen and (max-width: 576px) {
          width: 100%;
          max-width: ${pxToRem(211)};
        }
        @media screen and (max-width: 1200px) {
          width: 100%;
          max-width: ${pxToRem(200)};
        }
      `
    };
  });

  return styleGenerator();
};
