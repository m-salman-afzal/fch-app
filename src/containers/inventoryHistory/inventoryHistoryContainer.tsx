import React, { useEffect, useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Form, Tooltip } from 'antd';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { Pagination } from '@/types/commonTypes';
import {
  TInventoryHistory,
  TInventoryHistoryDateFilters
} from '@/types/InventoryHistoryTypes';

import { InventoryHistoryLayout } from '@/components/inventoryHistory/layout/inventoryHistoryLayout';

import { useFacility } from '@/hooks/useFacility';
import { useFetch } from '@/hooks/useFetch';
import {
  DEFAULT_PAGINATION_VALUES,
  INVENTORY_COLUMN_HEADERS
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInEST,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { getInventoryHistoryList } from '@/utils/endpoints';
import { tranformNullToString } from '@/utils/sharedUtils';

const defaultDateRange = {
  dateFrom: getFormattedDateInEST({
    subtract: {
      unit: 'days',
      amount: 89
    },
    format: DATE_FORMATS.YMD
  }),
  dateTo: getFormattedDateInEST({
    format: DATE_FORMATS.YMD
  })
};

export const InventoryHistoryContainer = () => {
  const [formRef] = Form.useForm();

  const [inventoryHistoryList, setInventoryHistoryList] = useState<
    TInventoryHistory[]
  >([]);

  const [pagination, setPagination] = useState<Pagination>(
    DEFAULT_PAGINATION_VALUES
  );

  const { fetchData, isLoading } = useFetch();

  const [dates, setToDates] = useState<TInventoryHistoryDateFilters>({
    dateFrom: undefined,
    dateTo: undefined
  });

  const { currentFacility } = useFacility();

  const onClickDownload = async (item: TInventoryHistory) => {
    const url = `${getInventoryHistoryList()}/download/${item.inventoryHistoryId}`;
    const inventory = await fetchData(url);
    if (inventory) {
      const fileContent = inventory.length ? inventory : [{ '': '' }];
      const csvConfig = mkConfig({
        fieldSeparator: ',',
        columnHeaders: INVENTORY_COLUMN_HEADERS,
        filename: `FCH Inventory - ${currentFacility.facilityName} - ${getFormattedDateNoTimeZone({ date: item.createdAt, format: DATE_FORMATS.FILE_DATE })}`
      });
      const csv = generateCsv(csvConfig)(
        fileContent
          .map((res: any) => ({
            ...res,
            expirationDate:
              getFormattedDateNoTimeZone({
                date: res.expirationDate,
                format: DATE_FORMATS.MDY
              }) === 'Invalid Date'
                ? ''
                : getFormattedDateNoTimeZone({
                    date: res.expirationDate,
                    format: DATE_FORMATS.MDY
                  })
          }))
          .map((res: any) => tranformNullToString(res))
      );
      download(csvConfig)(csv);
    }
  };

  const onFilterReset = () => {
    formRef.resetFields();
  };

  const onFilterApply = (fields: TInventoryHistoryDateFilters) => {
    let updatedDates = fields;
    if (fields.dateFrom) {
      updatedDates = {
        ...updatedDates,
        dateFrom: getFormattedDateInEST({
          date: fields.dateFrom,
          format: DATE_FORMATS.YMD
        })
      };
    }

    if (fields.dateTo) {
      updatedDates = {
        ...updatedDates,
        dateTo: getFormattedDateInEST({
          date: fields.dateTo,
          format: DATE_FORMATS.YMD
        })
      };
    }

    setToDates(updatedDates);

    const paylaod = {
      ...DEFAULT_PAGINATION_VALUES,
      ...updatedDates
    };

    getInventoryHistory(paylaod);
  };

  const getInventoryHistory = async (paylaod: any) => {
    const data = await fetchData(getInventoryHistoryList(), {
      ...paylaod,
      fromDate: !paylaod.dateFrom
        ? defaultDateRange.dateFrom
        : paylaod.dateFrom,
      toDate: !paylaod.dateTo ? defaultDateRange.dateTo : paylaod.dateTo
    });

    if (data.status !== 'error') {
      setInventoryHistoryList(data.rows);

      return setPagination(preState => {
        return { ...preState, ...data.paginationInfo };
      });
    }

    setInventoryHistoryList([]);

    setPagination(DEFAULT_PAGINATION_VALUES);
  };

  const onPaginationChange = (pageNumber: number, perPage: number) => {
    const updatedPagination = {
      ...pagination,
      currentPage: pageNumber,
      perPage
    };

    setPagination(updatedPagination);

    getInventoryHistory({ ...dates, ...updatedPagination });
  };

  useEffect(() => {
    getInventoryHistory({ ...dates, ...pagination });
  }, []);

  const tableColumns = [
    {
      title: 'Date & Time',
      render: (item: any) => {
        return getFormattedDateInEST({
          date: item.createdAt,
          format: DATE_FORMATS.MDY_TIME
        });
      }
    },
    {
      title: '',
      width: 56,
      align: 'center',

      render: (item: any) => {
        return (
          <VsButton size={BUTTON_SIZES.squareIcon}>
            <Tooltip title={'Download'}>
              <DownloadOutlined onClick={() => onClickDownload(item)} />
            </Tooltip>
          </VsButton>
        );
      }
    }
  ];

  return (
    <>
      <InventoryHistoryLayout
        data={inventoryHistoryList}
        tableColumns={tableColumns}
        onFilterApply={onFilterApply}
        onFilterReset={onFilterReset}
        onClickDownload={onClickDownload}
        formRef={formRef}
        isLoading={isLoading}
        onPaginationChange={onPaginationChange}
        pagination={pagination}
        filterDate={dates}
      />
    </>
  );
};
