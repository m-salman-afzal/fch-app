import { createStylish } from 'antd-style';

import { pxToRem } from '../../../utils/sharedUtils';

export const useTreeStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      treeClassname: css`
        .ant-tree-treenode {
          :first-child {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            @media screen and (max-width: 576px) {
              flex-direction: row;
            }
          }
          :not(:first-child) {
            padding-left: ${pxToRem(125)};
            @media screen and (max-width: 576px) {
              padding-left: 0px;
              margin-right: 100px;
            }
          }

          span.ant-tree-node-selected {
            background-color: #fff;
            &:hover {
              background-color: transparent;
            }
          }
          span:hover {
            background-color: transparent;
          }
        }
        .ant-tree-indent-unit {
          @media screen and (max-width: 576px) {
            width: ${pxToRem(5)};
          }
        }
      `
    };
  });

  return styleGenerator();
};
