import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useHeaderStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      header: css`
        width: 100%;
        height: ${pxToRem(54)};
        background-color: ${token.colorBgBase};
        padding-inline: ${pxToRem(40)};
        border-bottom: ${pxToRem(1)} solid #d0cece;
        line-height: ${pxToRem(54)};

        @media screen and (min-width: 1600px) {
          padding-inline: ${pxToRem(49)} ${pxToRem(48)};
        }
        @media screen and (max-width: 1599px) {
          padding-inline: ${pxToRem(40)};
        }
        @media screen and (max-width: 1200px) {
          padding-inline: ${pxToRem(20)};
        }
        @media screen and (max-width: 576px) {
          position: fixed;
          z-index: 2;
          padding-inline: ${pxToRem(20)};
          background-color: ${token.colorBgBase};
          border-bottom: none;
          height: ${pxToRem(65)};
        }

        @media screen and (max-width: 1200px) and (min-width: 768px) {
          padding-inline-end: ${pxToRem(20)};
          padding-inline-start: ${pxToRem(90)};
        }
      `,

      headerButtons: css`
        display: flex;
        justify-content: space-between;
      `,

      messageDropMenu: css`
        display: flex;
        justify-content: center;
        align-items: center;
      `,

      messageButton: css`
        background: ${token.colorBgBase};
        box-shadow: 0 0 0 #e6f4ff;
        height: 3rem !important;
        width: 3rem !important;

        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.86rem;
        border: none;
        :hover {
          background: #131212;
        }
        :active {
          background: #131212;
        }
        a {
          display: flex;
          flex-align: center;
        }
      `,

      profileButton: css`
        background: ${token.colorBgBase};
        box-shadow: 0 0 0 #e6f4ff;
        height: ${pxToRem(34)};
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0rem;
        padding-inline: 0.3rem !important;
        border: ${pxToRem(1)} solid ${token.colorFillContentHover};
        :hover {
          background: #131212;
        }
        a {
          display: flex;
          flex-align: center;
        }


        @media screen and (max-width: 576px) {
          background-color: transparent;
        }

        }
      `,

      profileAvatarLogoutModal: css`
        background: transparent;
        box-shadow: 0 0 0 #e6f4ff;
        justify-content: center;
        margin-right: 0.86rem;
        :hover {
          background: transparent;
        }
      `,

      avatarBg: css`
        background-color: transparent;
        border-radius: 50%;
        display: flex;
        width: ${pxToRem(28)};
      `,
      logoutButton: css`
        background-color: ${token.colorPrimaryBg};
        border-radius: 0.29rem;
        color: ${token.colorPrimary};
        line-height: 0;
        border: none;
      `,
      logoutWrap: css`
        font-size: 1rem;
        box-shadow:
          0px 0.642rem 2rem 0.571rem rgba(0, 0, 0, 0.05),
          0px 0.214rem 0.428rem -0.285rem rgba(0, 0, 0, 0.12),
          0px 0.428rem 1.142rem 0px rgba(0, 0, 0, 0.08);

        border-radius: ${pxToRem(4)};
        border: ${pxToRem(1)} solid #e5e5e5;
        .ant-popover-content {
          background: transparent !important;
        }

        .ant-popover-arrow {
          display: none;
        }
      `,
      subTitle: css`
        font-size: ${pxToRem(12)} !important;
        color: ${token.colorTextLabel};
        overflow: hidden;
        text-overflow: ellipsis;
      `,

      heading: css`
        font-size: ${pxToRem(14)} !important;
        color: ${token.colorTextHeading};
        font-weight: 600;
        line-height: ${pxToRem(22)};
      `,
      headerMessage: css`
        display: flex;
        align-items: center;
        margin-inline-end: ${pxToRem(18)};

        .ant-scroll-number {
          top: ${pxToRem(7)};
          z-index: 9;
        }
      `,
      headerFeatureName: css`
        color: ${token.colorText};
        font-size: ${pxToRem(16)};
        font-style: normal;
        font-weight: 600;
        line-height: ${pxToRem(24)} !important;
      `,

      mobileMenu: css`
        position: relative;
        top: 1rem;
        left: 0px;
        /* TODO: commenting it for now */
        /* z-index: 9000; */
        display: flex;
        justify-content: center;
        flex-direction: column;
        background-color: black;
        width: 100%;
        padding-inline: 2.86rem;
        padding-block-end: 4.29rem;
        .ant-menu-item-selected {
          background-color: transparent !important;
          color: white;
        }

        .ant-menu-item {
          font-size: ${pxToRem(20)};
          height: max-content !important;
          border-bottom: 0.07rem solid #ffffff80;
          border-radius: 0px !important;
          padding-inline: 0.5rem 1.142rem;
          margin: 0;
          padding-block: ${pxToRem(16)};
        }

        .ant-menu-submenu-title {
          background-color: black !important;
          border-radius: 0px !important;
        }
      `,

      mobileMenuHeader: css`
        width: 100%;
        position: fixed;
        top: 0px;
        left: 0;
        line-height: ${pxToRem(65)};
        z-index: 1010;
        background-color: black !important;
        height: fit-content;
        :after {
          content: '';
          width: ${pxToRem(62)};
        }
      `,
      menuItem: css`
        font-size: ${pxToRem(20)};
        line-height: ${pxToRem(22)};
        color: #ffffff;
        opacity: 0.5;
      `,
      menuItemActive: css`
        font-size: ${pxToRem(20)};
        line-height: ${pxToRem(22)};
        color: #ffffff;
      `,
      logOutMenuItem: css`
        font-size: ${pxToRem(20)};
        line-height: ${pxToRem(22)};
        color: #ffffff;
        opacity: 0.5;
        border: none !important;
        margin-block-start: ${pxToRem(66)} !important;
      `,
      fchLogoContainer: css`
        margin-inline-start: ${pxToRem(17)};
        height: ${pxToRem(26)};
        line-height: 100%;
      `,
      mobileHeaderMenuButton: css`
        background-color: transparent;
        border: none;
        line-height: 100%;
        svg {
          color: ${token.colorText};
          font-size: ${pxToRem(24)};
        }
        padding-block: 0;
        box-shadow: none;
      `,
      mobileHeaderMenuButtonContainer: css`
        height: ${pxToRem(32)};
        line-height: 100%;
      `,
      mobileHeaderMenuCloseButton: css`
        background: #131212;
        box-shadow: 0 0 0 #e6f4ff;
        height: ${pxToRem(42)} !important;
        width: ${pxToRem(42)} !important;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-inline-start: ${pxToRem(20)};
        border: none;
        :hover {
          background: #131212;
        }
        :active {
          background: #131212;
        }
        a {
          display: flex;
          flex-align: center;
        }
      `,
      defaultLocationContainer: css`
        .ant-select-selector {
          padding: ${pxToRem(4)} ${pxToRem(10)} !important;
          font-size: ${pxToRem(12)};
        }

        .ant-select-selection-search-input {
          font-size: ${pxToRem(12)} !important;
        }
        .ant-select-selection-placeholder {
          font-size: ${pxToRem(12)} !important;
        }
      `,

      signatureInputContaienr: css`
        .ant-input-affix-wrapper {
          padding: ${pxToRem(6)} ${pxToRem(7)} ${pxToRem(6)} ${pxToRem(16)} !important;
        }

        .ant-btn {
          padding: 0;
          height: ${pxToRem(24)} !important;
          width: ${pxToRem(24)};
        }
      `,

      counterStyle: css`
        .ant-badge-count {
          min-width: ${pxToRem(12)};
          height: ${pxToRem(12)};
          font-size: ${pxToRem(10)};
          line-height: ${pxToRem(12)};
          background-color: #cf1322;
        }
        .ant-badge-multiple-words {
          padding: 0 0.27143rem;
        }
      `,

      counterContainer: css`
        border: 1px solid #00000026;
        width: ${pxToRem(33)};
        height: ${pxToRem(33)};
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: ${pxToRem(4)};
        :hover {
          border: 1px solid #4096ff;
        }
      `,
      notificationContainer: css`
        box-shadow:
          0px 6px 16px 0px rgba(0, 0, 0, 0.08),
          0px 3px 6px -4px rgba(0, 0, 0, 0.12),
          0px 9px 28px 8px rgba(0, 0, 0, 0.05);

        border-radius: 8px;
      `
    };
  });

  return styleGenerator();
};
