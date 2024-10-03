import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useSiderStyle = (isCollapsed: boolean) => {
  const styleGenerator = createStylish(({ token, css }) => {
    const sider = css`
      background-color: white !important;
      padding-inline: ${pxToRem(12)};
      border-inline-end: ${pxToRem(1)} solid #d0cece;
      overflow-x: hidden;
      min-height: 100%;

      div {
        *::-webkit-scrollbar {
          display: none;
        }
      }

      @media screen and (max-width: 1200px) and (min-width: 768px) {
        position: fixed !important;
        z-index: 499 !important;
        opacity: 1;
      }
    `;
    const siderMenuItem = css`
      padding: ${pxToRem(8)};
      cursor: pointer;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      div {
        transition: opacity 200ms linear;
        font-size: ${pxToRem(12)};
        line-height: ${pxToRem(20)};
        width: ${pxToRem(200)} !important;
        white-space: nowrap;
      }

      img {
        opacity: 0.45;
      }
    `;

    const siderCollapseButton = css`
      position: absolute;
      top: ${pxToRem(13)};
      left: ${pxToRem(187)};
      transition: all linear 20;
      border: none;
      z-index: 500;
      filter: drop-shadow(0px ${pxToRem(9)} ${pxToRem(28)} rgba(0, 0, 0, 0.05))
        drop-shadow(0px ${pxToRem(3)} ${pxToRem(6)} rgba(0, 0, 0, 0.12))
        drop-shadow(0px ${pxToRem(6)} ${pxToRem(16)} rgba(0, 0, 0, 0.08));

      svg {
        transform: rotate(180deg);
        opacity: 0.6;
      }
    `;

    const siderSubMenu = css`
      .ant-collapse-header-text {
        line-height: ${pxToRem(20)};
        font-weight: 700;
        color: ${token.colorTextDescription};
        padding-inline-start: ${pxToRem(10)};
      }

      .ant-collapse {
        background-color: transparent;
        border: none;
        box-shadow: none;
        padding-block-end: ${pxToRem(8)};
      }

      .ant-collapse-item {
        border: none;
      }

      .ant-collapse-content {
        border: none;
      }

      .ant-collapse-content-box {
        padding: 0px !important;
      }

      .ant-collapse-header {
        padding: 0px !important;
      }
    `;

    return {
      sider: css`
        ${sider}
        width: ${pxToRem(200)} !important;
        min-width: ${pxToRem(200)} !important;
        max-width: ${pxToRem(200)} !important;
        flex: 0 0 ${pxToRem(200)} !important;
      `,

      siderCollapsed: css`
        ${sider}
        width: ${pxToRem(74)} !important;
        min-width: ${pxToRem(74)} !important;
        max-width: ${pxToRem(74)} !important;
        flex: 0 0 ${pxToRem(74)} !important;
      `,

      fchLogoRow: css`
        margin-inline-start: ${pxToRem(10)};
        margin-block-start: ${pxToRem(11)};
        margin-block-end: ${pxToRem(22)};
        align-self: center;
      `,
      fchLogoRowCollapsed: css`
        margin-inline-start: ${pxToRem(4)};
        margin-block-start: ${pxToRem(11)};
        margin-block-end: ${pxToRem(22)};
        align-self: center;
        overflow: hidden;
      `,

      fchLogo: css`
        object-fit: contain;
        width: ${pxToRem(154)} !important;
        height: ${pxToRem(33)}!important;
        position: relative !important;
      `,
      fchLogoCollapsed: css`
        background-color: #ffffff !important;
        position: relative;
        width: ${pxToRem(154 - 43)};
        height: ${pxToRem(43)};
        top: ${pxToRem(-35)};
        right: ${pxToRem(-38)};
        margin-block-end: ${pxToRem(-35)};
      `,

      siderSubMenu: css`
        .ant-collapse-header-text {
          font-size: ${pxToRem(12)};
        }

        ${siderSubMenu}
      `,

      siderSubMenuCollapsed: css`
        .ant-collapse-header-text {
          font-size: ${pxToRem(10)};
          padding-inline-start: ${pxToRem(0)} !important;
          text-align: center;
        }

        .ant-collapse-content.ant-collapse-content-active {
          margin-inline-start: ${pxToRem(5)};
        }

        ${siderSubMenu}
      `,

      siderMenuItem: css`
        ${siderMenuItem}
      `,
      siderMenuItemCollapsed: css`
        ${siderMenuItem}
        justify-content: start;
        height: ${pxToRem(35)};
        div {
          opacity: 0;
        }
      `,
      siderMenuItemSelected: css`
        ${siderMenuItem}
        background-color: ${token.colorFillContent};
        border-radius: ${pxToRem(6)};
        div {
          font-weight: 700;
        }

        img {
          opacity: 1;
        }
      `,
      siderMenuItemSelectedCollapsed: css`
        ${siderMenuItem}
        width: ${pxToRem(35)};
        justify-content: start;
        background-color: ${token.colorFillContent};
        border-radius: ${pxToRem(6)};
        div {
          font-weight: 700;
          opacity: 0;
        }
        width: ${pxToRem(35)};
        height: ${pxToRem(35)};

        img {
          opacity: 1;
        }
      `,
      siderMenuItemIcon: css`
        margin-inline-end: ${pxToRem(8)};
      `,
      siderMenuItemIconCollapsed: css`
        margin-inline-start: ${pxToRem(1)};
      `,
      menuItemsRowContainer: css`
        border-block-end: ${pxToRem(1)} solid #d0cece;
        margin-block-end: ${pxToRem(9)};
      `,
      siderCollapseButton: css`
        ${siderCollapseButton};
      `,
      siderCollapseButtonClosed: css`
        ${siderCollapseButton};
        top: ${pxToRem(14)};
        left: ${pxToRem(62)};

        svg {
          transform: rotate(0deg);
        }
      `,
      sideScroll: css`
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 90vh;
      `
    };
  });

  return styleGenerator();
};
