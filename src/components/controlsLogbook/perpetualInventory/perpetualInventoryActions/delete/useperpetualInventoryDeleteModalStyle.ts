import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const usefirstLevelDeleteModalStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      deleteModal: css`
        .ant-modal-content {
          padding-block-start: 0;
          padding-block-end: ${pxToRem(20)};
        }
      `
    };
  });

  return styleGenerator();
};
