import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useSignatureCollapseStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      collapseContainer: css`
        .ant-collapse {
          border-radius: ${pxToRem(4)};
          background-color: unset;
          padding-inline: ${pxToRem(20)};
          padding-block: ${pxToRem(16)};
          border-bottom: ${pxToRem(1)} solid ${token.colorBorder};
        }

        .ant-collapse > .ant-collapse-item > .ant-collapse-header {
          padding: unset;
        }

        .ant-collapse-content {
          margin-block-start: ${pxToRem(16)};
        }
        .ant-collapse .ant-collapse-content > .ant-collapse-content-box {
          padding: unset;
          padding-block-start: ${pxToRem(16)};
        }

        .ant-collapse-header-text {
          color: ${token.colorTextHeading};
          font-size: ${pxToRem(16)};
          font-style: normal;
          font-weight: 600;
          line-height: 150%;
        }

        .ant-collapse > .ant-collapse-item {
          border-bottom: unset;
        }

        .ant-collapse-content {
          border-top: ${pxToRem(1)} solid ${token.colorBorder};
          border-bottom: unset;
        }
      `
    };
  });

  return styleGenerator();
};
