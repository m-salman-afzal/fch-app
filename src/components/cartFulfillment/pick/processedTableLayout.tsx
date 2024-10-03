import { Col, Grid, Row, Typography } from 'antd';
import { VsTable } from 'vs-design-components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TPagination } from '@/types/commonTypes';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';

import { useProcessedTableStyle } from './processedTableStyle';

interface props {
  processedColumns: any[];
  processedData: any[];
  isLoading: boolean;
  paginationData: TPagination | undefined;
  onChangePagination: (pageNumber: number, pageSize: number) => void;
}
const { useBreakpoint } = Grid;

const ProcessedTable: React.FC<props> = ({
  processedColumns,
  processedData,
  isLoading,
  paginationData,
  onChangePagination
}) => {
  const isSmall = window.screen.width <= 576;
  const size = useBreakpoint();
  const { container } = useProcessedTableStyle();

  const { tableHeight } = useTablePaginationPosition();

  return (
    <div className={container} style={{ width: '100%' }}>
      <div
        style={{
          overflowY: 'auto',
          position: 'relative',
          paddingBottom: size.xs ? pxToRem(200) : pxToRem(150)
        }}
      >
        <VsTable
          tableProps={{
            columns: processedColumns,
            dataSource: processedData,
            loading: isLoading,
            sticky: true,
            pagination: {
              onChange: onChangePagination,
              total: paginationData?.totalItems,
              pageSizeOptions: !size.xs ? DEFAULT_PAGE_SIZE_OPTIONS : undefined,
              showTotal: size.sm
                ? (total: any, range: any) => {
                    return (
                      <Typography.Text>
                        Showing {range[1]} out of <strong>{total}</strong>
                      </Typography.Text>
                    );
                  }
                : undefined,
              showSizeChanger: !size.xs,
              size: 'small',
              defaultPageSize: isSmall
                ? DEFAULT_PAGE_SIZE.MOBILE
                : DEFAULT_PAGE_SIZE.DESKTOP,

              position: ['bottomCenter']
            },
            scroll: {
              x: 'max-content',
              y: processedData.length ? tableHeight : undefined
            }
          }}
        />
      </div>
    </div>
  );
};

export default ProcessedTable;
