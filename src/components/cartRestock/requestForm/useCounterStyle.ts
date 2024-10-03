import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useCounterStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      container: css`
        width: ${pxToRem(84)};
        height: ${pxToRem(30)};
        padding: ${pxToRem(5)} ${pxToRem(5)};
        border-radius: ${pxToRem(4)};
        border: ${pxToRem(1)} solid ${token.colorBorder};
        background: #fff;

        .ant-input {
          background: transparent;
          border: none;
          height: ${pxToRem(16)};
          padding: 0;
          border-radius: 0;
          text-align: center;
          :focus {
            outline: none;
            border: none !important;
            box-shadow: none;
          }

          ::placeholder {
            font-size: ${pxToRem(12)};
          }
        }
      `,
      counterButton: css`
        .ant-btn {
          width: ${pxToRem(16)};
          height: ${pxToRem(16)};
        }
      `,
      inputError: css`
        border: ${pxToRem(1)} solid ${token.colorErrorActive};
      `
    };
  });

  return styleGenerator();
};
