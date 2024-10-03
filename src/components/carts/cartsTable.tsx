import { Col, Grid, Row, Typography } from 'antd';
import { VsTable } from 'vs-design-components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TPagination } from '@/types/commonTypes';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';

import { useCartsTableStyle } from './useCartsTableStyle';

interface props {
  cartsColumns: any[];
  cartsData: any[];
  isLoading: boolean;
  paginationData: TPagination;
  onChangePagination: (pageNumber: number, pageSize: number) => void;
}
const { useBreakpoint } = Grid;

const CartsTable: React.FC<props> = ({
  cartsColumns,
  cartsData,
  isLoading,
  paginationData,
  onChangePagination
}) => {
  const isSmall = window.screen.width <= 576;
  const size = useBreakpoint();
  const { cartsTableContainer } = useCartsTableStyle();
  const { tableHeight } = useTablePaginationPosition();

  return (
    <Row>
      <Col span={24}>
        <div style={{ marginTop: pxToRem(16) }} className={cartsTableContainer}>
          <div
            style={{
              overflowY: 'auto',
              position: 'relative',
              paddingBottom: size.xs ? pxToRem(200) : pxToRem(150)
            }}
          >
            <VsTable
              tableProps={{
                columns: cartsColumns,
                dataSource: cartsData,
                loading: isLoading,
                sticky: true,
                pagination: {
                  onChange: onChangePagination,
                  total: paginationData.totalItems,
                  pageSizeOptions: !size.xs
                    ? DEFAULT_PAGE_SIZE_OPTIONS
                    : undefined,
                  showTotal: size.sm
                    ? (total, range) => {
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
                  y: cartsData.length ? tableHeight : undefined
                }
              }}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default CartsTable;
