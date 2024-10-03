import React, { useEffect, useRef, useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

export const EllipsisTooltip = ({ text }: any) => {
  const textRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const { clientWidth, scrollWidth } = textRef.current;
      setIsOverflow(scrollWidth > clientWidth);
    }
  }, [text]);

  return (
    <Tooltip title={isOverflow ? text : ''}>
      <div
        ref={textRef}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {text}
        {isOverflow && <InfoCircleOutlined style={{ marginLeft: 8 }} />}
      </div>
    </Tooltip>
  );
};
