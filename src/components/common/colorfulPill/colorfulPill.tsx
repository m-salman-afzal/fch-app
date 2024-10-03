import { CSSProperties } from 'react';
import { Tag } from 'antd';

import { usePillStyle } from './usePillStyle';

interface props {
  text: string;
  closeIcon?: any;
  className?: any;
  style?: CSSProperties;
}

const ColorfulPill: React.FC<props> = ({
  text,
  closeIcon,
  className,
  style
}) => {
  const { pillStyle } = usePillStyle();

  return (
    <Tag
      style={style}
      className={`${className} ${pillStyle}`}
      bordered={false}
      closeIcon={closeIcon}
    >
      {text}
    </Tag>
  );
};

export default ColorfulPill;
