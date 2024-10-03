import { FC, useEffect, useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Grid, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TCentralSupplyLogs } from '@/types/centralSupplyTypes';
import { TPagination } from '@/types/commonTypes';

import { useCentralSupplyLogsStyle } from '@/components/centralSupply/centralSupplyLogs/useCentralSupplyLogsStyle';

import { useFetch } from '@/hooks/useFetch';
import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  CENTRAL_SUPPLY_LOGS_HEADERS,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  TOAST_DURATION,
  TOAST_GENERIC_ERROR_MESSAGE
} from '@/utils/constants';
import { DATE_FORMATS } from '@/utils/dateFormatsTimezones';
import {
  centralSupplyLogDrugsUrl,
  centralSupplyLogsUrl
} from '@/utils/endpoints';
import {
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE,
  tranformNullToString
} from '@/utils/sharedUtils';
import ShowToast from '@/utils/showToast';

const { useBreakpoint } = Grid;

interface Props {
  searchValue: string;
  searchFilters: Record<string, any>;
}

export const CentralSupplyLogsContainer: FC<Props> = ({
  searchFilters,
  searchValue
}) => {
  const { logsTableContainer } = useCentralSupplyLogsStyle();
  const size = useBreakpoint();
  const { fetchData, isLoading, setIsLoading } = useFetch();
  const [centralLogs, setCentralLogs] = useState<TCentralSupplyLogs[]>([]);

  const paginationInitialValues = {
    currentPage: 1,
    perPage: size.xs ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  };

  const [pagination, setPagination] = useState<TPagination>({
    currentPage: 1,
    perPage: size.xs ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  });

  const onChangePagination = (pageNumber: number, pageSize: number) => {
    const newPaginatedData = {
      ...pagination,
      currentPage: pageNumber,
      perPage: pageSize
    };
    getCentralSupplyLogs(searchFilters, searchValue, newPaginatedData);
    setPagination(newPaginatedData);
  };

  const getCentralSupplyLogs = async (
    searchFilters: Record<string, any>,
    searchValue: string,
    pagination: TPagination
  ) => {
    setIsLoading(true);
    const res = await fetchData(centralSupplyLogsUrl(), {
      ...searchFilters,
      ...pagination,
      text: searchValue,
      fromDate:
        searchFilters.fromDate &&
        dayjs(searchFilters.fromDate).format(DATE_FORMATS.YMD),
      toDate:
        searchFilters.toDate &&
        dayjs(searchFilters.toDate).format(DATE_FORMATS.YMD),
      orderedQuantityMin:
        searchFilters.orderedUnits && searchFilters.orderedUnits[0],
      orderedQuantityMax:
        searchFilters.orderedUnits && searchFilters.orderedUnits[1]
    });

    if (res?.status === 'error') {
      setCentralLogs([]);
      setPagination({
        ...pagination,
        totalItems: 0,
        totalPages: 0
      });

      setIsLoading(false);

      return;
    }

    setCentralLogs(res.rows);
    setPagination({
      ...pagination,
      ...res.paginationInfo
    });

    setIsLoading(false);
  };

  useEffect(() => {
    getCentralSupplyLogs(searchFilters, searchValue, paginationInitialValues);
  }, [searchFilters, searchValue]);

  const columns = [
    {
      title: 'Date & Time',
      render: ({ centralSupplyLog }: TCentralSupplyLogs) => (
        <div>
          {dayjs
            .utc(`${centralSupplyLog.createdAt}`)
            .local()
            .format(DATE_FORMATS.MDY_TIME)}
        </div>
      ),
      width: size.xs ? pxToRem(200) : undefined
    },
    {
      title: 'Ordered by',
      render: ({ centralSupplyLog }: TCentralSupplyLogs) => (
        <div>{`${centralSupplyLog.admin.lastName}, ${centralSupplyLog.admin.firstName}`}</div>
      ),
      width: size.xs ? pxToRem(161) : undefined
    },
    {
      title: 'Ordered Units',
      render: ({ centralSupplyLog }: TCentralSupplyLogs) => (
        <div>{centralSupplyLog.orderedQuantity}</div>
      ),
      width: size.xs ? pxToRem(161) : undefined
    },
    {
      title: '',
      width: pxToRem(56),

      render: ({ centralSupplyLog }: TCentralSupplyLogs) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <VsButton
            style={TABLE_BUTTON_STYLE}
            size={BUTTON_SIZES.squareIcon}
            onClick={async () => {
              await onClickDownload(
                centralSupplyLog.centralSupplyLogId,
                `${centralSupplyLog.admin.lastName}, ${centralSupplyLog.admin.firstName}`
              );
            }}
          >
            <Tooltip title={'Download'}>
              <DownloadOutlined style={TABLE_BUTTON_ICON_SIZE} />
            </Tooltip>
          </VsButton>
        </div>
      )
    }
  ];

  const onClickDownload = async (id: string, orderedBy: string) => {
    try {
      let file = await fetchData(centralSupplyLogDrugsUrl(id));
      if (file.status === 'error') {
        file = [];
      }

      const csvConfig = mkConfig({
        fieldSeparator: ',',
        filename: `Central Supply Order by ${orderedBy} ${dayjs().format('MM-DD-YYYY')}`,
        columnHeaders: CENTRAL_SUPPLY_LOGS_HEADERS
      });
      const csv = generateCsv(csvConfig)(
        file.map((r: unknown) => tranformNullToString(r))
      );
      download(csvConfig)(csv);
    } catch (error) {
      ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);
    }
  };
  const { tableHeight } = useTablePaginationPosition();

  return (
    <div className={logsTableContainer}>
      <VsTable
        tableProps={{
          columns,
          loading: isLoading,
          dataSource: centralLogs,
          pagination: {
            onChange: onChangePagination,
            current: pagination.currentPage,
            total: pagination.totalItems,
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
            style: { alignItems: 'center' },
            defaultPageSize: size.xs
              ? DEFAULT_PAGE_SIZE.MOBILE
              : DEFAULT_PAGE_SIZE.DESKTOP,
            position: ['bottomCenter']
          },
          sticky: true,
          scroll: {
            // x: 'max-content',
            y: centralLogs.length > 0 ? tableHeight : undefined
          }
        }}
      />
    </div>
  );
};
