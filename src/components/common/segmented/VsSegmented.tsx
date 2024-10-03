import { Segmented, SegmentedProps } from 'antd';

import { useSegmentedStyle } from './useSegmentedStyle';

interface props {
  segmentedProps: SegmentedProps;
}

const VsSegmented: React.FC<props> = ({ segmentedProps }) => {
  const { segmented } = useSegmentedStyle();

  return <Segmented {...segmentedProps} ref={null} className={segmented} />;
};

export default VsSegmented;
