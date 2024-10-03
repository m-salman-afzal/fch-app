import { createStylish } from 'antd-style';
import { useTableStyle } from 'vs-design-components/src/Components/Table/useTableStyle';

import { pxToRem } from '@/utils/sharedUtils';

export const useInventoryLevelsStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      inventoryLevelsTitle: css`
        color: white !important;
        font-size: ${pxToRem(16)} !important;
        font-style: normal !important;
        font-weight: 600 !important;
        line-height: 150% !important;
        margin-block: 0px !important;
        margin-bottom: 0px;
      `,

      inventoryOnHandText: css`
        color: white !important;
        font-size: ${pxToRem(12)} !important;
        line-height: ${pxToRem(20)} !important;
        margin-block: 0px !important;
        margin-bottom: 0px;
      `,
      minMaxFlex: css`
        display: flex;
        justify-content: space-between;
        align-items: center;

        border-block-start: ${pxToRem(1)} solid white !important;

        margin-block-start: ${pxToRem(3)};
        padding-block-start: ${pxToRem(3)};
      `,
      minMaxText: css`
        color: white !important;
        font-size: ${pxToRem(12)} !important;
        line-height: ${pxToRem(20)} !important;
        margin-block: 0px !important;
        margin-right: ${pxToRem(10)};
      `,

      toolTipContainer: css`
        max-width: none;
        min-width: ${pxToRem(330)};
        height: ${pxToRem(167)};
        .ant-tooltip-inner {
          height: ${pxToRem(167)};

          padding: ${pxToRem(8)} ${pxToRem(20)};
        }
      `,
      inventoryProgessBar: css`
        width: 100%;
        background-color: #accbff6b;
        height: ${pxToRem(8)};
        border-radius: ${pxToRem(8)};
        overflow: hidden;
      `,
      inventoryProgressGradient: css`
        position: relative;
        height: ${pxToRem(8)};
      `,
      nodeContainer: css`
        display: flex;
        position: relative;
        top: ${pxToRem(58)};
        z-index: 4;
      `,
      levelCircleNode: css`
        width: ${pxToRem(16)};
        height: ${pxToRem(16)};
        border-radius: 100%;
        background-color: #ffffff9c;
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          width: ${pxToRem(10)};
          height: ${pxToRem(10)};
          border-radius: 100%;
          background-color: ${token.colorSuccessBg};
        }

        margin-block-end: ${pxToRem(8)};
      `,
      nodeText: css`
        color: white;
        font-size: ${pxToRem(12)};
        font-style: normal;
        font-weight: 400;
        line-height: 166.667%;
      `
    };
  });

  return styleGenerator();
};
