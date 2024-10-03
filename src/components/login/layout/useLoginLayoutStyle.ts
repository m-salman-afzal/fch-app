import { createStylish } from 'antd-style';

export const useLoginLayoutStyle = (
  width?: string | number,
  height?: string | number
) => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      mainContainer: css`
        @media screen and (min-width: 576px) {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        @media screen and (max-width: 576px) {
          padding-inline: 1.714rem;
        }
      `,
      loginBox: css`
        @media screen and (min-width: 576px) {
          width: 27.25rem;
          height: auto;
          background-color: #ffffff;
          border-radius: 0.5rem;
          padding-inline: 3.42rem;
          padding-block: 2.785rem 2rem;
        }

        @media screen and (max-width: 576px) {
          padding-block-start: 5rem;
        }
      `,
      dtucImageContainer: css`
        width: 11.17rem;
        margin-right: 1.5rem;
        align-self: flex-end;
        position: unset !important;
      `,
      dtucImage: css`
        object-fit: contain;
        width: 100% !important;
        position: relative !important;
        height: unset !important;
      `
    };
  });

  return styleGenerator();
};
