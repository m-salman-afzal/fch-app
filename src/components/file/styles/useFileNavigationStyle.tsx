import { createStylish } from 'antd-style';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

export const useFileNavigationStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      fileHeading: css`
        color: ${token.colorText};
        font-size: ${pxToRem(16)};
        font-weight: 600;
        line-height: ${pxToRem(24)};
      `
    };
  });

  return styleGenerator();
};
