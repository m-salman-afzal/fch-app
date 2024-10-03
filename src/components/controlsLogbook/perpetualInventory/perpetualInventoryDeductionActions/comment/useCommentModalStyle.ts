import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useCommentModalStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      closeIcon: css`
        .ant-modal-close {
          top: 0;
          margin-block: ${pxToRem(19.5)};
        }
      `,
      timeStamp: css`
        font-size: ${pxToRem(10)} !important;
        color: ${token.colorTextDescription};
        @media screen and (max-width: 576px) {
          margin-bottom: ${pxToRem(6)} !important;
        }
      `
    };
  });

  return styleGenerator();
};
