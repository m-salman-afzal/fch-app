import { createStylish } from 'antd-style';

export const useInventoryStepsStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    const commonSteps = css`
      .ant-steps-item-title {
        font-size: 0.86rem;
      }

      .ant-steps-item-icon {
        width: 2rem;
        height: 2rem;
        line-height: 2rem;
        font-size: 1rem;
        @media screen and (max-width: 576px) {
          width: 1.6rem;
          height: 1.6rem;
          line-height: 1.5rem;
          font-size: 0.8rem;
        }
      }

      @media screen and (max-width: 576px) {
        padding-inline: 1.43rem 1.43rem;

        .ant-steps-item-title {
          font-size: 0.79rem !important;
        }

        .ant-steps-item-container {
          display: flex;
          flex-direction: column;
          width: fit-content;
        }
      }

      @media screen and (max-width: 768px) {
        padding-inline: 1.43rem 1.43rem;
      }
    `;

    return {
      appointmentSteps: css`
        ${commonSteps}
      `,
      singleAppointmentStep: css`
        ${commonSteps}

        .ant-steps-item-title {
          font-size: 0.86rem;
          display: none;
        }

        .ant-steps-item-icon {
          width: 2rem;
          height: 2rem;
          line-height: 2rem;
          font-size: 1rem;
          display: none;
          @media screen and (max-width: 576px) {
            width: 1.6rem;
            height: 1.6rem;
            line-height: 1.5rem;
            font-size: 0.8rem;
          }
        }
      `
    };
  });

  return styleGenerator();
};
