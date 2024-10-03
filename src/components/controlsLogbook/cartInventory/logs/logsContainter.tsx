import { FC, useEffect, useState } from 'react';
import Icon, {
  CommentOutlined,
  EyeOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { Grid, Row, Tooltip, Typography } from 'antd';
import { VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import {
  TCartInventoryLogs,
  TCartInventoryLogsFilterTypes
} from '@/types/cartInventoryTypes';
import { Pagination } from '@/types/commonTypes';

import { useFetch } from '@/hooks/useFetch';
import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  ALL,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  DEFAULT_PAGINATION_VALUES
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInEST,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { getAllCartInventoryLogUrl } from '@/utils/endpoints';
import {
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

import { useInventoryTableStyle } from '../useCartInventoryStyle';
import { LogComment } from './LogComment';
import { LogDrugsModal } from './logTable';

interface props {
  searchFilters: TCartInventoryLogsFilterTypes;
}

const { useBreakpoint } = Grid;

export const LogsContainer: FC<props> = ({ searchFilters }) => {
  const [logsData, setLogsData] = useState<TCartInventoryLogs[]>([]);
  const [pagiantion, setPagination] = useState(DEFAULT_PAGINATION_VALUES);

  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comment, setComment] = useState<any>();

  const [currentDrugLogId, setCurrentDrugLogId] = useState('');
  const [isDrugLogOpen, setIsDrugLogOpen] = useState(false);
  const [drugLogsData, setDrugLogsData] = useState([]);
  const [drugLogspagiantion, setDrugLogsPagination] = useState(
    DEFAULT_PAGINATION_VALUES
  );

  const size = useBreakpoint();

  const { fetchData, isLoading } = useFetch();

  const { inventoryLogTableContainer } = useInventoryTableStyle();
  const { tableHeight } = useTablePaginationPosition();

  const isSmall = window.screen.width <= 576;
  const tableColumns = [
    {
      title: 'Date Received',
      key: 'receivedDate',
      render: (data: TCartInventoryLogs) => {
        return (
          <div>
            {getFormattedDateNoTimeZone({
              date: data.createdAt,
              format: DATE_FORMATS.MDY_TIME
            })}
          </div>
        );
      }
    },

    {
      title: 'Cart',
      key: 'cart',
      dataIndex: 'cart'
    },
    {
      title: 'Counted By',
      key: 'countedBy',
      dataIndex: 'countedBy'
    },
    {
      title: 'Witness',
      key: 'witness',
      dataIndex: 'witnessName'
    },
    {
      title: 'Comments',
      key: 'comments',
      render: (value: TCartInventoryLogs) => {
        return (
          <Tooltip title="Comment">
            <div
              style={{
                border: '0px solid',
                display: 'flex',
                justifyContent: 'start',
                width: pxToRem(24)
              }}
            >
              <VsButton
                antButtonProps={{
                  type: 'default'
                }}
                onClick={() => showComment(value)}
                style={{
                  width: pxToRem(24),
                  height: pxToRem(24)
                }}
                size={BUTTON_SIZES.small}
              >
                <MessageOutlined />
              </VsButton>
            </div>
          </Tooltip>
        );
      }
    },
    {
      title: '',
      key: 'action',
      render: (value: TCartInventoryLogs) => {
        return (
          <Tooltip title="View">
            <div
              style={{
                border: '0px solid',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <VsButton
                onClick={() => showDrugLogs(value)}
                style={TABLE_BUTTON_STYLE}
                size={BUTTON_SIZES.squareIcon}
              >
                <EyeOutlined style={TABLE_BUTTON_ICON_SIZE} />
              </VsButton>
            </div>
          </Tooltip>
        );
      }
    }
  ];

  const getCartInventoryLogs = async (currentPagination: Pagination) => {
    const url = getAllCartInventoryLogUrl();

    const filters = {
      fromDate: searchFilters.fromDate
        ? getFormattedDateInEST({
            date: searchFilters.fromDate,
            format: DATE_FORMATS.YMD
          })
        : null,
      toDate: searchFilters.toDate
        ? getFormattedDateInEST({
            date: searchFilters.toDate,
            format: DATE_FORMATS.YMD
          })
        : null,
      cart: searchFilters.cart === ALL ? null : searchFilters.cart
    };

    const response = await fetchData(url, { ...currentPagination, ...filters });

    if (response.status !== 'error') {
      setLogsData(response.rows);
      setPagination({ ...pagiantion, ...response.paginationInfo });

      return;
    }

    setLogsData([]);
    setPagination(DEFAULT_PAGINATION_VALUES);
  };

  const onChangePagination = (page: number, pageSize: number) => {
    const updatedPagination = {
      ...pagiantion,
      currentPage: page,
      pageSize: pageSize
    };

    getCartInventoryLogs(updatedPagination);
  };

  const closeCommentModal = () => {
    setIsCommentOpen(false);
  };

  const showComment = (value: TCartInventoryLogs) => {
    setIsCommentOpen(true);
    setComment(value);
  };

  const showDrugLogs = (value: TCartInventoryLogs) => {
    setCurrentDrugLogId(value.cartInventoryLogsId);
    setIsDrugLogOpen(true);
    getDrugLogs(DEFAULT_PAGINATION_VALUES, value.cartInventoryLogsId);
  };

  const getDrugLogs = async (pagination: Pagination, logId: string) => {
    const url = `${getAllCartInventoryLogUrl()}/${logId}`;
    const response = await fetchData(url, { ...pagination });

    if (response.status !== 'error') {
      setDrugLogsData(response.rows);
      setDrugLogsPagination({
        ...drugLogspagiantion,
        ...response.paginationInfo
      });
    }
  };

  const onCloseLogsDrugModal = () => {
    setIsDrugLogOpen(false);
    setDrugLogsData([]);
    setDrugLogsPagination(DEFAULT_PAGINATION_VALUES);
    setCurrentDrugLogId('');
  };

  const onDrugLogsPaginationChange = async (page: number, perPage: number) => {
    const updatedPagination = {
      ...drugLogspagiantion,
      currentPage: page,
      perPage
    };

    getDrugLogs(updatedPagination, currentDrugLogId);
  };

  useEffect(() => {
    getCartInventoryLogs(DEFAULT_PAGINATION_VALUES);
  }, [searchFilters]);

  return (
    <>
      <div className={inventoryLogTableContainer}>
        <VsTable
          tableProps={{
            loading: isLoading,
            dataSource: logsData,
            columns: tableColumns,
            sticky: true,
            pagination: {
              current: pagiantion.currentPage,
              total: pagiantion.totalItems,
              onChange: onChangePagination,
              pageSizeOptions: !size.xs ? DEFAULT_PAGE_SIZE_OPTIONS : undefined,
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
              y: logsData.length ? tableHeight : undefined
            },
            style: {
              width: size.xs ? '100%' : ''
            }
          }}
        />
      </div>
      <LogComment
        isOpen={isCommentOpen}
        comment={comment?.comment}
        dateTime={comment?.createdAt}
        onClose={closeCommentModal}
      />
      <LogDrugsModal
        open={isDrugLogOpen}
        onCloseModal={onCloseLogsDrugModal}
        drugLogsData={drugLogsData}
        isLoading={isLoading}
        pagination={drugLogspagiantion}
        onChangePagination={onDrugLogsPaginationChange}
      />
    </>
  );
};
