import { useEffect, useRef } from 'react';
import { Spin, TableColumnsType } from 'antd';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { VsTable } from 'vs-design-components';

import { TPagination } from '@/types/commonTypes';
import { TShiftCountData } from '@/types/shiftCountTypes';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import { pxToRem } from '@/utils/sharedUtils';

import { useShiftCountStyle } from './style/useShiftCountStyle';

interface props {
  columns: TableColumnsType<TShiftCountData>;
  shiftCountData: TShiftCountData[];
  isLoading: boolean;
  pagination: TPagination;
  onLoadMore: () => {};
  searchText: string;
}

const ShiftCountTable: React.FC<props> = ({
  columns,
  shiftCountData = [],
  isLoading,
  pagination,
  onLoadMore,
  searchText
}) => {
  const { tableContainer } = useShiftCountStyle();
  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: shiftCountData.length !== pagination.totalItems,
    onLoadMore: onLoadMore,
    rootMargin: '0px 0px 400px 0px'
  });
  const { tableHeight } = useTablePaginationPosition();

  const leaveSpaceFromEnd = tableHeight - 50;

  const isSmall = window.screen.width <= 576;

  return (
    <div className={tableContainer}>
      <VsTable
        tableProps={{
          columns: columns,
          dataSource: shiftCountData,
          pagination: false,
          sticky: true,
          loading: isLoading,
          scroll: {
            x: shiftCountData.length || isSmall ? 'max-content' : undefined,
            y: shiftCountData.length
              ? isSmall
                ? pxToRem(450)
                : leaveSpaceFromEnd
              : undefined
          },
          onRow: (data: TShiftCountData, index) => {
            if (
              shiftCountData.length >= 100 &&
              index === shiftCountData.length - 1 &&
              shiftCountData.length !== pagination.totalItems &&
              !searchText &&
              !isLoading
            ) {
              return {
                ref: sentryRef
              } as any;
            }

            return {};
          }
        }}
      />
      <div
        style={{
          fontSize: pxToRem(12),
          lineHeight: pxToRem(20),
          color: '#505F79',
          marginBlockStart: pxToRem(10),
          paddingInlineStart: isSmall ? pxToRem(20) : undefined
        }}
      >
        <strong> {shiftCountData.length}</strong> results found
      </div>
    </div>
  );
};

export default ShiftCountTable;
