import { createStylish } from 'antd-style';

export const useChangeLogCardStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      tooltipStyle: css`
        .ant-tooltip-inner {
          background-color: ${token.colorBgBase};
          border-radius: ${token.borderRadiusSM};
          color: ${token.colorText};
        }
      `
    };
  });

  return styleGenerator();
};
