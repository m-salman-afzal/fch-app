import { createStylish } from 'antd-style';

export const useAllocationFilterStyle = () => {
  const styleGenerator = createStylish(({ token, css }) => {
    return {
      datePicker: css`
        .react-datepicker-popper {
          position: fixed !important;
        }
      `
    };
  });

  return styleGenerator();
};
