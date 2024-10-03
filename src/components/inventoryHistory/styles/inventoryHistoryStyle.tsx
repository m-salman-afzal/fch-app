import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useInventoryHistoryStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      inventoryHistoryTable: css`
        .ant-table-cell {
          padding: 0 ${pxToRem(16)} !important;

          .ant-btn {
            width: ${pxToRem(24)};
            height: ${pxToRem(24)};
          }
        }
      `,
      datePicker: css`
        .react-datepicker-popper {
          position: fixed !important;
        }

        .react-datepicker__month-text.react-datepicker__month-0.react-datepicker__month-text--disabled.react-datepicker__month-text--keyboard-selected {
          background-color: transparent !important;
          color: inherit !important;
          outline: none !important;
          /* -webkit-writing-mode: vertical-rl; */
          font-weight: inherit;
        }
      `
    };
  });

  return styleGenerator();
};
