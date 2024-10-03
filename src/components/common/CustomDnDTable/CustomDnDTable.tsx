import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext
} from '@dnd-kit/sortable';
import { Table, TableProps } from 'antd';
import { VsTable } from 'vs-design-components';

import SortableColumn from './SortableColumn';

interface props {
  columns: any[];
  dataSource: any[];
  tableProps?: TableProps<any>;
  onComplete: (data: any) => void;
  refresh?: any;
}

const CustomDnDTable: FC<props> = props => {
  const { columns, dataSource, tableProps, onComplete, refresh } = props;
  const [header, setHeaders] = useState<any[]>([]);
  const [active, setActive] = useState();
  const sensors = useSensors(
    useSensor(TouchSensor),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    window.scrollTo(0, 0);
    if (active?.id !== over?.id) {
      setHeaders((columns: any[]) => {
        const oldIndex = columns.indexOf(
          columns.find(c => c.key === active?.id)
        );
        const newIndex = columns.indexOf(
          columns.find(c => c.key === over?.id && !c.disabled)
        );
        const sortingOrder = arrayMove(columns, oldIndex, newIndex);
        if (newIndex !== -1) {
          onComplete(event);

          return sortingOrder;
        }

        return columns;
      });
    }
  };

  const handleDragStart = useCallback((event: any) => {
    setActive(event.active.id);
  }, []);

  useEffect(() => {
    setHeaders(() => {
      return columns.map((column, index) => {
        return {
          ...column,
          title: (
            <SortableColumn
              key={column.key}
              id={column.key}
              index={index}
              column={column}
              disabled={column.disabled}
            />
          ),
          render: (props: any) => {
            return (
              <SortableColumn
                key={column.key}
                id={column.key}
                index={index}
                column={column}
                disabled={true}
              >
                {column?.render(props)}
              </SortableColumn>
            );
          }
        };
      });
    });
  }, [dataSource, refresh]);

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors={sensors}
      onDragStart={handleDragStart}
    >
      <SortableContext
        items={header.filter(c => !c.disabled).map(c => c.key)}
        strategy={horizontalListSortingStrategy}
      >
        <VsTable
          tableProps={{
            ...tableProps,
            rowKey: 'id',
            columns: header,
            dataSource: dataSource
          }}
        />
      </SortableContext>
    </DndContext>
  );
};

export default CustomDnDTable;
