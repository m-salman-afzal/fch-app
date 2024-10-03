import React, { CSSProperties, FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface props {
  id: string;
  disabled?: boolean | undefined;
  style?: CSSProperties;
  column: any;
  index: number;
  children?: any;
}

const SortableColumn: FC<props> = ({
  id,
  disabled = false,
  column,
  children
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
    transition: transition,
    cursor: disabled ? 'default' : isDragging ? 'pointer' : 'move'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children ? children : column.title}
    </div>
  );
};

export default SortableColumn;
