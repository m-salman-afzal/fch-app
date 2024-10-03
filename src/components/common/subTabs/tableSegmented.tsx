import { Segmented, SegmentedProps } from 'antd';

import { useTableSegmentedStyle } from './useTableSegmentedStyle';

interface props {
  segmentedProps: SegmentedProps;
}

const TableSegmented: React.FC<props> = ({ segmentedProps }) => {
  const { segmented } = useTableSegmentedStyle();

  return <Segmented {...segmentedProps} ref={null} className={segmented} />;
};

export default TableSegmented;
