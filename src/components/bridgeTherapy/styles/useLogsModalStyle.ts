import { createStylish } from 'antd-style';

export const useLogsModalStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      tableClassName: css`
      .ant-table-thead {

          .ant-table-cell{
            :last-child {
              padding-inline-end = 0px !important
            }
          }
          :last-child {
            border-start-end-radius = 0px;
            padding-inline-end = 0px !important
          }
        :nth-child(0) {
            border-start-end-radius = 0px;
        }

      }
      `
    };
  });

  return styleGenerator();
};
