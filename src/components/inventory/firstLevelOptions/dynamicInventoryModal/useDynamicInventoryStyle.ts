import { createStylish } from 'antd-style';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

export const useDynamicInventoryStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      datePicker: css`
        .react-datepicker-popper {
          position: fixed !important;
        }
      `,

      inventoryContentContainer: css``,
      inventoryFormStepsContainer: css`
        padding: ${pxToRem(17)} 0 0 ${pxToRem(30)};

        @media screen and (max-width: 576px) {
          padding: ${pxToRem(14)} 0 ${pxToRem(10)} 5%;
          display: block;
          .ant-steps-item .ant-steps-item-title {
            display: none;
          }
          .ant-steps-item-active .ant-steps-item-title {
            display: block;
          }

          .ant-steps-item-tail {
            display: block !important;
          }

          .ant-steps-item:first-child .ant-steps-item-tail {
            display: none !important;
          }
        }

        .ant-steps-item-title {
          font-size: ${pxToRem(12)} !important;
        }
        .ant-steps-item-icon {
          margin-inline: 0 ${pxToRem(8)} !important;
        }
        .ant-steps-item-tail {
          padding: ${pxToRem(24)} 0 0 !important;
          @media screen and (max-width: 576px) {
            padding: ${pxToRem(4)} 0 0 0 !important;
            width: 28% !important;
          }
          :after {
            background-color: rgba(0, 0, 0, 0.06) !important;
          }
        }
      `
    };
  });

  return styleGenerator();
};
