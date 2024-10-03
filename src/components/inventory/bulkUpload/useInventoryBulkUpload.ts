import { createStylish } from 'antd-style';

import RecevieInventoryIcon from '@/assets/icons/inventory/receiveInventoryIcon.svg';
import { pxToRem } from '@/utils/sharedUtils';

export const useInventoryBulkUploadStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      modalTitle: css`
        margin-block: ${pxToRem(0)};
        font-size: ${pxToRem(20)} !important;
        padding-left: ${pxToRem(20)};
      `,
      optionTile: css`
        padding: ${pxToRem(12)} ${pxToRem(16)};
        text-align: center;
        cursor: pointer;
        border-radius: ${pxToRem(4)};
        border: ${pxToRem(1)} solid ${token.colorBorder};
        width: ${pxToRem(229)};
        height: ${pxToRem(106)};

        .anticon.anticon-check-circle {
          display: none;
          top: ${pxToRem(-10)};
          right: ${pxToRem(-10)};
          position: absolute;
          font-size: ${pxToRem(24)};
          color: ${token.colorPrimary};
          background: #fff;
        }

        @media only screen and (max-width: 767px) {
          width: 100%;
        }
      `,
      selectedTile: css`
        border: ${pxToRem(2)} solid #0958d9 !important;
        position: relative;

        .anticon.anticon-check-circle {
          display: block !important;
        }
      `,
      radioButton: css`
        width: 100%;
        height: 2.7857142857142856rem;
        border: 0.07142857142857142rem solid rgba(0, 0, 0, 0.15);
        align-items: center;
        border-radius: 0.2857142857142857rem;
        padding: 0.8571428571428571rem 1.1428571428571428rem;
        font-weight: 400;
        margin: 0;
      `,
      radioButtonLabel: css`
        font-weight: 600;
        display: inline-block;
        margin-bottom: ${pxToRem(16)};
      `
    };
  });

  return styleGenerator();
};
