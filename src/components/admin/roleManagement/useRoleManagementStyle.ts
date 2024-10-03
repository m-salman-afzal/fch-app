import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useRoleManagementStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      roleCard: css`
        background: ${token.colorBorderBg};
        padding: ${pxToRem(14)} ${pxToRem(14)};
        border-radius: ${pxToRem(4)};
        border-radius: ${pxToRem(8)};
        border-left: ${pxToRem(5)} solid #791eef;
      `,
      roleColorPicker: css`
        padding: ${pxToRem(4)};
        border-radius: ${pxToRem(4)};
        border: ${pxToRem(1)} solid ${token.colorBorder};
        background: ${token.colorBgContainer};
        height: ${pxToRem(36)};

        span {
          color: ${token.colorTextTertiary};

          font-size: ${pxToRem(14)};
          font-style: normal;
          font-weight: 400;
          line-height: ${pxToRem(22)};
        }
        .ant-form-item {
          margin-bottom: 0;
        }
      `
    };
  });

  return styleGenerator();
};
