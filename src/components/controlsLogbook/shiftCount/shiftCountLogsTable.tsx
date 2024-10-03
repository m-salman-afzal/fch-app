import { Grid, TableColumnsType, Typography } from 'antd';
import { VsTable } from 'vs-design-components';

import { TPagination } from '@/types/commonTypes';
import { TShiftCountLogsData } from '@/types/shiftCountTypes';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';

import { useShiftCountStyle } from './style/useShiftCountStyle';

interface props {
  columns: TableColumnsType<TShiftCountLogsData>;
  shiftCountLogsData: TShiftCountLogsData[];
  pagination: TPagination;
  onChangePagination: (page: number, pageSize: number) => void;
  isLoading: boolean;
}

const { useBreakpoint } = Grid;

const ShiftCountLogsTable: React.FC<props> = ({
  columns,
  shiftCountLogsData = [],
  pagination,
  onChangePagination,
  isLoading
}) => {
  const { logsTableContainer } = useShiftCountStyle();
  const { tableHeight } = useTablePaginationPosition();

  const isSmall = window.screen.width <= 576;

  const size = useBreakpoint();

  return (
    <div className={logsTableContainer}>
      <VsTable
        tableProps={{
          columns: columns,
          dataSource: shiftCountLogsData,
          loading: isLoading,
          pagination: {
            current: pagination.currentPage,
            showTotal: !size.xs
              ? (total, range) => {
                  return (
                    <Typography.Text>
                      Showing {range[1]} out of <strong>{total}</strong>
                    </Typography.Text>
                  );
                }
              : undefined,
            showSizeChanger: !size.xs,
            defaultPageSize: isSmall
              ? DEFAULT_PAGE_SIZE.MOBILE
              : DEFAULT_PAGE_SIZE.DESKTOP,
            pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
            size: 'small',
            position: ['bottomCenter'],
            total: pagination.totalItems,
            onChange: onChangePagination
          },
          sticky: true,
          scroll: {
            x: shiftCountLogsData.length || isSmall ? 'max-content' : undefined,
            y: shiftCountLogsData.length ? tableHeight : undefined
          }
        }}
      />
    </div>
  );
};

export default ShiftCountLogsTable;
