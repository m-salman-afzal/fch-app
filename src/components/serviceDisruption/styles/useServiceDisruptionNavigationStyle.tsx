import { createStylish } from 'antd-style';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

export const useServiceDisruptionNavigationStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      serviceDisruptionHeading: css`
        color: ${token.colorText};
        font-size: ${pxToRem(16)};
        font-weight: 600;
        line-height: ${pxToRem(24)};

        @media screen and (max-width: 576px) {
          padding-bottom: ${pxToRem(16)};
        }
      `
    };
  });

  return styleGenerator();
};
