import { FC, useEffect, useState } from 'react';
import { FormInstance } from 'antd';
import { download, generateCsv, mkConfig } from 'export-to-csv';

import { Pagination } from '@/types/commonTypes';
import { TRequestLogs } from '@/types/requestLogsTypes';

import { RequestLogsLayout } from '@/components/cartRestock/requestLogs/requestLogsLayout';
import FilterTags from '@/components/common/filterTags/filterTags';

import { useFetch } from '@/hooks/useFetch';
import {
  ALL,
  ALL_OPTION,
  REQUEST_FORM_TYPE,
  REQUEST_FORM_TYPE_LABEL
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import {
  getCartRequestLogsExportUrl,
  getCartRequestLogsUrl
} from '@/utils/endpoints';
import { pxToRem } from '@/utils/sharedUtils';

const FILTER_REQUEST_TYPE_OPTIONS = [
  ALL_OPTION,
  {
    label: 'After-hours',
    value: REQUEST_FORM_TYPE.AFTER_HOURS,
    key: REQUEST_FORM_TYPE.AFTER_HOURS
  },
  {
    label: 'Standard',
    value: REQUEST_FORM_TYPE.STANDARD,
    key: REQUEST_FORM_TYPE.STANDARD
  }
];

interface props {
  defaultPaginationOptions: Pagination;
  searchhText: string;
  filters: any;
  requestLogsFilterRef: FormInstance<any>;
  onApplyRequestLogs: (values: any) => void;
  cartOptions: any[];
}
export const RequestLogsContainer: FC<props> = ({
  defaultPaginationOptions,
  searchhText,
  filters,
  requestLogsFilterRef,
  onApplyRequestLogs,
  cartOptions
}) => {
  const [requestLogsData, setrequestLogsData] = useState<{
    rows: TRequestLogs[];
    pagination: Pagination;
  }>({
    rows: [],
    pagination: {
      currentPage: 0,
      perPage: 0,
      totalItems: 0
    }
  });
  const [searchText, setSearchText] = useState<string | null>(null);
  const { fetchData, isLoading } = useFetch();

  const getRequestLogsData = async (payload: any) => {
    const url = getCartRequestLogsUrl();
    const logs = await fetchData(url, payload);

    if (logs.status !== 'error') {
      return setrequestLogsData(logs);
    }

    setrequestLogsData({ rows: [], pagination: defaultPaginationOptions });
  };

  const onRequestLogsTableSearch = (searchText: string, filters: any = {}) => {
    if (filters.cartId === ALL) {
      filters.cartId = null;
    }
    if (filters.type === ALL) {
      filters.type = [
        REQUEST_FORM_TYPE.STANDARD,
        REQUEST_FORM_TYPE.AFTER_HOURS
      ];
    }

    if (filters.type && !Array.isArray(filters.type)) {
      filters.type = [filters.type];
    }
    if (filters.fromDate) {
      filters.fromDate = getFormattedDateNoTimeZone({
        date: filters.fromDate,
        format: DATE_FORMATS.YMD
      });
    }
    if (filters.toDate) {
      filters.toDate = getFormattedDateNoTimeZone({
        date: filters.toDate,
        format: DATE_FORMATS.YMD
      });
    }

    const payload = {
      ...defaultPaginationOptions,
      text: searchText,
      type: [REQUEST_FORM_TYPE.STANDARD, REQUEST_FORM_TYPE.AFTER_HOURS],
      ...filters
    };
    setSearchText(searchText);
    getRequestLogsData(payload);
  };

  const downloadLogCsv = async (item: TRequestLogs) => {
    const url = getCartRequestLogsExportUrl();
    const logCsv = await fetchData(url, {
      isRequestLog: true,
      cartRequestLogId: item.cartRequestLogId
    });

    if (logCsv.status !== 'error') {
      const fileContent = logCsv.map((item: any) => {
        return {
          'Date/time': item.dateTime,
          Username: item.username,
          Cart: item.cart,
          Type: REQUEST_FORM_TYPE_LABEL[item.type],
          Drug: item.drug,
          Package: item.package ? item.package : '',
          Min: item.min,
          Max: item.max,
          'Pending orders': item.pendingOrderQuantity,
          'Package qty': item.packageQuantity,
          Controlled: item.isControlled ? 1 : 0
        };
      });
      const csvConfig = mkConfig({
        useKeysAsHeaders: true,
        fieldSeparator: ',',
        filename: `${REQUEST_FORM_TYPE_LABEL[item.type]} ${item.cart.cart} ${getFormattedDateNoTimeZone({ format: DATE_FORMATS.FILE_DATE })}`
      });
      const csv = generateCsv(csvConfig)(fileContent);
      download(csvConfig)(csv);
    }
  };

  const onRequestLogsPaginationChange = (
    pageNumber: number,
    pageSize: number
  ) => {
    const newPaginatedData = {
      ...requestLogsData.pagination,
      currentPage: pageNumber,
      perPage: pageSize
    };
    const payload = {
      text: searchText,
      type: [REQUEST_FORM_TYPE.STANDARD, REQUEST_FORM_TYPE.AFTER_HOURS],
      ...filters,
      ...newPaginatedData
    };
    getRequestLogsData(payload);
  };

  useEffect(() => {
    onRequestLogsTableSearch(searchhText, structuredClone(filters));
  }, [searchhText, filters]);

  return (
    <>
      <FilterTags
        filterForm={requestLogsFilterRef}
        filterState={filters}
        filterInitialValues={{
          formDate: undefined,
          toDate: undefined,
          type: ALL,
          cartId: ALL
        }}
        customKeys={{
          fromDate: 'From',
          toDate: 'To',
          cartId: 'Cart'
        }}
        customMapForSelect={{
          cartId: cartOptions,
          type: FILTER_REQUEST_TYPE_OPTIONS
        }}
        onChangeFilters={onApplyRequestLogs}
        marginTop={pxToRem(16)}
        marginBottom={pxToRem(-16)}
      />
      <RequestLogsLayout
        isLoading={isLoading}
        tableData={requestLogsData}
        onPaginationChange={onRequestLogsPaginationChange}
        downloadLogCsv={downloadLogCsv}
      />
    </>
  );
};
