import { createStylish } from 'antd-style';

import { pxToRem } from '@/utils/sharedUtils';

export const useFileTableStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      tableClassName: css`
        .ant-table-cell {
          white-space: nowrap;
          padding-inline: ${pxToRem(16)} !important;

          :first-child {
            width: calc(100% * 0.3) !important;
          }

          :nth-child(2) {
            width: calc(100% * 0.7) !important;
          }

          :last-child {
            max-width: ${pxToRem(130)} !important;
          }

          @media screen and (min-width: 1600px) {
            :nth-child(3),
            :nth-child(4),
            :nth-child(5),
            :nth-child(6) {
              min-width: ${pxToRem(200)} !important;
            }
          }

          @media screen and (max-width: 1599px) {
            :nth-child(3),
            :nth-child(4),
            :nth-child(5),
            :nth-child(6) {
              min-width: ${pxToRem(160)} !important;
            }
          }

          @media screen and (max-width: 1200px) {
            :nth-child(3),
            :nth-child(4),
            :nth-child(5),
            :nth-child(6) {
              min-width: ${pxToRem(93 + 16)} !important;
            }
          }

          @media screen and (max-width: 576px) {
          }
        }
      `,
      referenceGuideClassName: css`
        .ant-table-cell {
          white-space: nowrap;
          padding-inline: ${pxToRem(16)} !important;

          :nth-child(1) {
            width: calc(100% * 0.2) !important;
          }

          :nth-child(2) {
            width: calc(100% * 0.4) !important;
          }

          :nth-child(3) {
            width: calc(100% * 0.4) !important;
          }

          :last-child {
            max-width: ${pxToRem(130)} !important;
          }

          @media screen and (min-width: 1600px) {
            :nth-child(4),
            :nth-child(5),
            :nth-child(6),
            :nth-child(7) {
              min-width: ${pxToRem(200)} !important;
            }
          }

          @media screen and (max-width: 1599px) {
            :nth-child(4),
            :nth-child(5),
            :nth-child(6) {
              min-width: ${pxToRem(100)} !important;
            }
            :nth-child(7) {
              min-width: ${pxToRem(200)} !important;
            }
          }

          @media screen and (max-width: 1200px) {
            :nth-child(4),
            :nth-child(5),
            :nth-child(6) {
              min-width: ${pxToRem(100)} !important;
            }
            :nth-child(7) {
              min-width: ${pxToRem(200)} !important;
            }
          }

          @media screen and (max-width: 576px) {
            :nth-child(4),
            :nth-child(5),
            :nth-child(6) {
              min-width: ${pxToRem(100)} !important;
            }
            :nth-child(1),
            :nth-child(2),
            :nth-child(3),
            :nth-child(7) {
              min-width: ${pxToRem(0)} !important;
              width: unset !important;
            }
          }
        }
      `,
      inventoryClassName: css`
        .ant-table-cell {
          white-space: nowrap;
          padding-inline: ${pxToRem(16)} !important;

          :first-child {
            width: calc(100% * 0.3) !important;
          }

          :nth-child(2) {
            width: calc(100% * 0.4) !important;
          }

          :nth-child(3) {
            width: calc(100% * 0.3) !important;
          }

          :last-child {
            max-width: ${pxToRem(130)} !important;
          }

          @media screen and (min-width: 1600px) {
            :nth-child(4),
            :nth-child(5),
            :nth-child(6) {
              min-width: ${pxToRem(200)} !important;
            }
          }

          @media screen and (max-width: 1599px) {
            :nth-child(4),
            :nth-child(5),
            :nth-child(6) {
              min-width: ${pxToRem(160)} !important;
            }
          }

          @media screen and (max-width: 1200px) {
            :nth-child(4),
            :nth-child(5),
            :nth-child(6) {
              min-width: ${pxToRem(93 + 16)} !important;
            }
          }

          @media screen and (max-width: 576px) {
          }
        }
      `,
      serviceDisruptionClassName: css`
        .ant-table-cell {
          white-space: nowrap;
          padding-inline: ${pxToRem(16)} !important;

          :first-child {
            width: calc(100% * 0.3) !important;
          }

          :nth-child(2) {
            width: calc(100% * 0.4) !important;
          }

          :nth-child(3) {
            width: calc(100% * 0.3) !important;
          }

          :last-child {
            max-width: ${pxToRem(130)} !important;
          }

          @media screen and (min-width: 1600px) {
            :nth-child(4),
            :nth-child(5) {
              min-width: ${pxToRem(200)} !important;
            }
          }

          @media screen and (max-width: 1599px) {
            :nth-child(4),
            :nth-child(5) {
              min-width: ${pxToRem(160)} !important;
            }
          }

          @media screen and (max-width: 1200px) {
            :nth-child(4),
            :nth-child(5) {
              min-width: ${pxToRem(93 + 16)} !important;
            }
          }

          @media screen and (max-width: 576px) {
          }
        }
      `
    };
  });

  return styleGenerator();
};
