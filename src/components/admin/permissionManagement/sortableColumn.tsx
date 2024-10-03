import React, { CSSProperties, FC, ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tooltip } from 'antd';

interface props {
  id: string;
  disabled?: boolean | undefined;
  style?: CSSProperties;
  column: any;
  index: number;
  children?: any;
  trigger: ReactNode;
  className?: string;
}

const SortableColumn: FC<props> = ({
  id,
  disabled = false,
  column,
  children,
  trigger,
  className
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id,
    disabled,
    transition: {
      duration: 450,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      <span
        {...attributes}
        {...listeners}
        style={{
          cursor: disabled ? 'default' : isDragging ? 'pointer' : 'move'
        }}
      >
        {trigger}
      </span>
    </div>
  );
};

export default SortableColumn;
