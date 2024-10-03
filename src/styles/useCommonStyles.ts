import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useCommonStyles = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      deleteFamilyMemberConfirmIconContainer: css`
        display: flex;
        justify-content: center;
        width: 4.14rem;
        // position: unset !important;
      `,
      deleteFamilyMemberConfirmIcon: css`
        object-fit: contain;
        width: 100% !important;
        position: relative !important;
        height: unset !important;
      `,
      deleteConfirmIconContainer: css`
        display: flex;
        justify-content: center;
        align-items: center;
        width: ${pxToRem(80)} !important;
        height: ${pxToRem(80)} !important;
      `,
      deleteConfirmIcon: css`
        border-radius: 50%;
        background-color: ${token.colorErrorBg};
        padding: 1rem;
      `,
      unarchiveConfirmIcon: css`
        border-radius: 50%;
        background-color: ${token.colorWarningOutline};
        width: ${pxToRem(86)} !important;
        height: ${pxToRem(86)} !important;
        display: flex;
        justify-content: center;
        align-items: center;
      `,

      unarchiveConfirmIconContainer: css`
        display: flex;
        justify-content: center;
        align-items: center;
      `,
      confirmWarningIcon: css`
        border-radius: 50%;
        background-color: ${token.colorWarningBg};
        padding: 1rem;
      `
    };
  });

  return styleGenerator();
};
