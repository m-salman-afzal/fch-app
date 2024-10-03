import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useNotificationsAndTasksStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      dashboardContainer: css`
        width: ${pxToRem(672)};
        margin-top: ${pxToRem(22)};
        h1.ant-typography {
          font-size: ${pxToRem(24)};
        }
      `,
      checkListContainer: css`
        padding: ${pxToRem(12)} ${pxToRem(24)};
        background: ${token.colorPrimaryBg};
        border-radius: ${pxToRem(8)};
        h1.ant-typography {
          font-size: ${pxToRem(24)};
          margin: 0;
        }

        @media screen and (max-width: 576px) {
          margin: ${pxToRem(20)};
          padding: ${pxToRem(12)} ${pxToRem(16)};
        }
      `,
      notificationContainer: css`
        background: ${token.colorBgContainer};
        border-radius: ${pxToRem(8)};
      `,
      notificationInfo: css`
        width: ${pxToRem(474)};
        padding-right: ${pxToRem(12)} !important;
      `,
      timeStamp: css`
        font-size: ${pxToRem(12)} !important;
        color: ${token.colorTextDescription};
        margin-bottom: ${pxToRem(20)} !important;
        @media screen and (max-width: 576px) {
          margin-bottom: ${pxToRem(6)} !important;
        }
      `,
      facility: css`
        color: ${token.colorTextDescription};
        font-size: ${pxToRem(12)} !important;
      `,
      notificationActionItem: css`
        padding-left: ${pxToRem(10)} !important;
        padding-right: ${pxToRem(10)} !important;
      `,
      toggleText: css`
        color: ${token.colorPrimary};
        text-decoration-line: underline;
        @media screen and (max-width: 576px) {
          text-decoration-line: none;
        }
      `,
      notificationCover: css`
        overflow: scroll;
        .ant-typography:not(.timeStamp) {
          margin-bottom: ${pxToRem(6)} !important;
          font-size: ${pxToRem(16)};
        }
        @media screen and (max-width: 576px) {
          .ant-typography:not(.timeStamp) {
            font-size: ${pxToRem(14)};
          }

          .ant-typography:not(.timeStamp) strong {
            font-size: ${pxToRem(16)};
          }
        }
      `,
      rowDivider: css`
        margin: 0;
        @media screen and (max-width: 576px) {
          margin: 0;
        }
      `,
      comments: css`
        font-size: ${pxToRem(14)};
        padding-top: ${pxToRem(6)};
        .ant-typography:not(.timeStamp) {
          font-size: ${pxToRem(14)};
        }
        @media screen and (max-width: 576px) {
          font-size: ${pxToRem(12)};
          .ant-typography:not(.timeStamp) {
            font-size: ${pxToRem(12)} !important;
          }
        }

        a {
          font-weight: 600;
          float: left;
          margin-right: ${pxToRem(4)};
          @media screen and (max-width: 576px) {
            font-weight: 400;
          }
        }
      `,
      redDot: css`
        background: ${token.colorError};
        border-radius: ${pxToRem(31)};
        width: ${pxToRem(8)};
        height: ${pxToRem(8)};
        display: inline-block;
      `,

      notificationCard: css`
        border: 1px solid transparent;
        :hover {
          border: 1px solid #4096ff;
        }
      `
    };
  });

  return styleGenerator();
};
