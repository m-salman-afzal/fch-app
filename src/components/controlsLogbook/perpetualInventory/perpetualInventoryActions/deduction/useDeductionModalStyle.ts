import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useAdministerModalStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      closeIcon: css`
        .ant-modal-close {
          top: 0;
          margin-block: ${pxToRem(19.5)};
        }
      `
    };
  });

  return styleGenerator();
};
