import { createStylish } from 'antd-style';

export const useStepsStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      stepsWidth: css`
        width: 100%;

        .ant-steps-item-title {
          font-size: 0.857rem !important;
        }

        @media screen and (max-width: 576px) {
          .ant-steps-item-title {
            font-size: 0.785rem !important;
          }

          .ant-steps-item-icon {
            width: 1.714rem;
            height: 1.714rem;
            line-height: 21.714rem;
          }

          .ant-steps-item-container {
            display: flex !important;
            flex-direction: column;
            width: fit-content;
          }
        }
      `,

      stepsTitle: css`
        cursor: pointer;
        font-size: 0.857rem !important;

        @media screen and (max-width: 576px) {
          font-size: 0.785rem !important;
        }
      `
    };
  });

  return styleGenerator();
};
