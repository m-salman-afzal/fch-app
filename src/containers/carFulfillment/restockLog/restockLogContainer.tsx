'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { Form } from 'antd';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import debounce from 'lodash.debounce';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  TCartRequestDrug,
  TCartRequestLog,
  TRestockLogFilters
} from '@/types/cartFulfillmentTypes';
import { SelectOption, TPagination } from '@/types/commonTypes';

import { ReStockLogLayout } from '@/components/cartFulfillment/restockLog/reStockLogLayout';
import FilterTags from '@/components/common/filterTags/filterTags';

import { useFetch } from '@/hooks/useFetch';
import { ALL, ALL_OPTION } from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInEST,
  getFormattedDateInUTC,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { pxToRem, tranformNullToString } from '@/utils/sharedUtils';
import { API_BASE_URL, CART_REQUEST_DRUGS_URL } from '@/utils/urls';

import {
  CSV_HEADERS,
  RESTOCK_LOGS_STANDARD_STATUS,
  RESTOCK_LOGS_TABS,
  RESTOCKLOGS_STATUS_TYPES
} from '../constants';
import { AfterHoursContainer } from './afterHoursContainer';
import { InitialAllocationContainer } from './initialAllocationContainer';
import { StandardContainer } from './standardContainer';

interface Props {}

const filterInitialValues = {
  formDate: undefined,
  toDate: undefined,
  status: ALL,
  userId: ALL
};

export const RestockLogContainer: FC<Props> = ({}) => {
  const router = useRouter();
  const tabInUrl = useSearchParams().get('tab');
  const subTabInUrl = useSearchParams().get('subTab');
  const subTabFoundInRequestLogsTabs = RESTOCK_LOGS_TABS.find(
    stockTab => stockTab.value === subTabInUrl
  );
  const { isLoading, setIsLoading, fetchData } = useFetch();
  const [selectedTab, setSelectedTab] = useState(
    subTabInUrl && subTabFoundInRequestLogsTabs
      ? subTabInUrl
      : (RESTOCK_LOGS_TABS[0]?.value as string)
  );
  const [filterFormRef] = Form.useForm();
  const [filterOpen, setFilterOpen] = useState(false);

  const [search, setSearch] = useState<string>('');

  const [restockLogs, setRestockLogs] = useState<any[]>([]);
  const [restockDrugs, setRestockDrugs] = useState<any[]>([]);
  const [selectedCart, setSelectedCart] = useState<TCartRequestLog | {}>({});
  const [cartRequestDrugParam, setCartRequestDrugParam] = useState<any>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedFilterAdmin, setSelectedFilterAdmin] =
    useState<SelectOption>(ALL_OPTION);
  const paginationInitialValues = {
    currentPage: 1,
    perPage: 20,
    totalPages: undefined,
    totalItems: undefined
  };
  const paginationModalInitialValues = {
    currentPage: 1,
    perPage: 20,
    totalPages: undefined,
    totalItems: undefined
  };
  const [pagination, setPagination] = useState<TPagination>(
    paginationInitialValues
  );
  const [paginationModal, setPaginationModal] = useState<TPagination>(
    paginationModalInitialValues
  );

  const [filters, setFilters] =
    useState<TRestockLogFilters>(filterInitialValues);

  const onChangeTab = (val: any) => {
    setSelectedTab(val);
    router.push(
      `cartFulfillment?tab=${tabInUrl ? tabInUrl : 'restockLogs'}&subTab=${val}`
    );
    setPagination(paginationInitialValues);
    setPaginationModal(paginationModalInitialValues);
    setRestockLogs([]);
    setRestockDrugs([]);
  };

  const csvConfig = (
    restockLogType: string,
    cartStatus: string,
    isInitalAllocatin?: boolean
  ) => {
    return mkConfig({
      columnHeaders: isInitalAllocatin
        ? CSV_HEADERS.INITIAL_ALLOCATION_LOG
        : CSV_HEADERS.FULFILLED_DELETED_NON_CONTROLLED,
      fieldSeparator: ',',
      filename: `${restockLogType} ${cartStatus} ${getFormattedDateNoTimeZone({ format: DATE_FORMATS.FILE_DATE })}`
    });
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const uniqueAdmins = Array.from(
    new Set(restockLogs.map((rL: TCartRequestLog) => rL.admin.adminId))
  );

  const userOptions = [
    ALL_OPTION,
    ...uniqueAdmins.map((adminId: string) => {
      const rL = restockLogs.find(
        (rL: TCartRequestLog) => rL.admin.adminId === adminId
      );

      return {
        label: `${rL.admin.lastName}, ${rL.admin.firstName}`,
        value: rL.admin.adminId,
        key: rL.admin.adminId
      };
    })
  ];

  if (selectedFilterAdmin.value !== ALL && restockLogs.length === 0) {
    userOptions.push(selectedFilterAdmin);
  }

  const onClickAction = async (val: TCartRequestLog) => {
    const param: any = {};
    switch (val.type) {
      case 'PICK':
        param.cartRequestPickLogId = val.cartRequestLogId;
        break;
      case 'ALLOCATION':
        param.cartRequestAllocationLogId = val.cartRequestLogId;
        break;
      case 'DELETE':
        param.cartRequestDeletionLogId = val.cartRequestLogId;
        break;
      default:
        param.cartRequestLogId = val.cartRequestLogId;
    }

    param.cartRequestLogType = val.type;
    setCartRequestDrugParam(param);

    const restockDrugsList =
      val.type === 'INITIAL_ALLOCATION'
        ? await fetchRestockDrugInitialAllocation({
            ...param,
            isRequestLog: false
          })
        : await fetchRestockDrug({
            ...param,
            isRequestLog: false
          });
    if (selectedTab === RESTOCK_LOGS_TABS[2]?.value) {
      return onClickDownload(
        selectedTab,
        restockDrugsList,
        getDisplayType(val.type)
      );
    }

    setSelectedCart({
      ...val,
      requestLogType: selectedTab,
      witnessSignature: restockDrugsList[0].witnessSignature,
      receiverSignature: restockDrugsList[0].receiverSignature,
      cart: { cart: restockDrugsList[0].cart }
    });
    setShowModal(true);
  };

  const onClickDownload = async (
    restockLogType: string,
    restockDrugsList: any[],
    cartStatus?: string
  ) => {
    if (restockDrugsList?.length > 0) {
      const updatedCartDrugs = restockDrugsList.map(
        (cD: TCartRequestDrug & { type?: 'ALLOCATED' }) => {
          const controlledTypeString =
            selectedTab === RESTOCK_LOGS_TABS[2]?.value ? '1' : 'Controlled';

          const nonControlledTypeString =
            selectedTab === RESTOCK_LOGS_TABS[2]?.value
              ? '0'
              : 'Non-Controlled';

          return {
            ...cD,
            dateTime: getFormattedDateInEST({
              date: cD.dateTime,
              format: DATE_FORMATS.YMD_HMS
            }),
            isControlled: cD.isControlled
              ? controlledTypeString
              : nonControlledTypeString,
            status: cartStatus
              ? cartStatus
              : getDisplayType((selectedCart as TCartRequestLog).type),
            tr: cD.tr ?? '',
            type:
              selectedTab === RESTOCK_LOGS_TABS[2]?.value
                ? 'Initial Allocation'
                : undefined
          };
        }
      );

      const transformedCartDrugs = updatedCartDrugs.map(uCD =>
        tranformNullToString(uCD)
      );

      const config = csvConfig(
        RESTOCK_LOGS_TABS.find(tab => tab?.value === restockLogType)?.status ||
          '',
        cartStatus
          ? cartStatus
          : getDisplayType((selectedCart as TCartRequestLog).type),
        selectedTab === RESTOCK_LOGS_TABS[2]?.value ? true : false
      );
      const csv = generateCsv(config)(transformedCartDrugs);
      download(config)(csv);
    }
  };

  const getType = (status: string) => {
    switch (status) {
      case RESTOCK_LOGS_STANDARD_STATUS.PICKED:
        return RESTOCKLOGS_STATUS_TYPES.PICKED;
      case RESTOCK_LOGS_STANDARD_STATUS.FULFILLED:
        return RESTOCKLOGS_STATUS_TYPES.ALLOCATION;
      case RESTOCK_LOGS_STANDARD_STATUS.DELETED:
        return RESTOCKLOGS_STATUS_TYPES.DELETED;
      default:
        return '';
    }
  };

  const getDisplayType = (status: string) => {
    switch (status) {
      case RESTOCKLOGS_STATUS_TYPES.PICKED:
        return RESTOCK_LOGS_STANDARD_STATUS.PICKED;
      case RESTOCKLOGS_STATUS_TYPES.ALLOCATION:
        return RESTOCK_LOGS_STANDARD_STATUS.FULFILLED;
      case RESTOCKLOGS_STATUS_TYPES.DELETED:
        return RESTOCK_LOGS_STANDARD_STATUS.DELETED;
      case RESTOCKLOGS_STATUS_TYPES.AFTER_HOUR:
        return RESTOCK_LOGS_STANDARD_STATUS.REMOVED_FROM_INVENTORY;
      case RESTOCKLOGS_STATUS_TYPES.INITIAL_ALLOCATION:
        return RESTOCK_LOGS_STANDARD_STATUS.ALLOCATED;
      default:
        return '';
    }
  };

  const onClickApply = async (data: TRestockLogFilters) => {
    const formattedData = {
      adminId: data.userId === ALL ? undefined : data.userId,
      type: data.status
        ? data.status === ALL
          ? undefined
          : [getType(data.status as string)]
        : undefined,
      fromDate: data.fromDate
        ? getFormattedDateInUTC({
            date: data.fromDate,
            format: DATE_FORMATS.YMD
          })
        : '',
      toDate: data.toDate
        ? getFormattedDateInUTC({
            date: data.toDate,
            format: DATE_FORMATS.YMD
          })
        : ''
    };

    setFilters(data);

    await fetchRestockLog({
      ...formattedData,
      ...paginationInitialValues,
      selectedTab
    });
    setFilterOpen(false);
  };

  const fetchRestockLog = async (data: any) => {
    setIsLoading(true);
    const { paginationInfo, rows } = await fetchData(
      `${API_BASE_URL}${CART_REQUEST_DRUGS_URL}/cartRequestLogs`,
      {
        ...pagination,
        ...data,
        type: data.type
          ? data.type
          : data.selectedTab === RESTOCK_LOGS_TABS[0]?.value
            ? ['PICK', 'ALLOCATION', 'DELETE']
            : data.selectedTab === RESTOCK_LOGS_TABS[1]?.value
              ? ['AFTER_HOUR']
              : ['INITIAL_ALLOCATION']
      }
    );
    if (rows && rows?.length > 0) {
      setRestockLogs(
        rows.map((cartRequestLog: any) => {
          return {
            ...cartRequestLog,
            key: cartRequestLog?.cartRequestLogId
          };
        })
      );
      setPagination({ ...pagination, ...paginationInfo });
    } else {
      setRestockLogs([]);
      setPagination(paginationInitialValues);
    }
    setIsLoading(false);
  };

  const fetchRestockDrug = async (data: any) => {
    setIsLoading(true);
    const { paginationInfo, rows } = await fetchData(
      `${API_BASE_URL}${CART_REQUEST_DRUGS_URL}`,
      { ...paginationModal, ...data }
    );
    if (rows && rows?.length > 0) {
      const restockDrugsList = rows.map((cartRequestDrug: any) => {
        return {
          ...cartRequestDrug,
          key: cartRequestDrug?.cartRequestLogDrugId
        };
      });
      setRestockDrugs(restockDrugsList);
      setPaginationModal(paginationInfo);
      setIsLoading(false);

      return restockDrugsList;
    } else {
      setRestockDrugs([]);
      setPaginationModal(paginationInitialValues);
      setIsLoading(false);

      return [];
    }
  };

  const fetchRestockDrugInitialAllocation = async (data: any) => {
    setIsLoading(true);
    const rows = await fetchData(`${API_BASE_URL}${CART_REQUEST_DRUGS_URL}`, {
      ...paginationModal,
      ...data
    });
    if (rows && rows?.length > 0) {
      const restockDrugsList = rows.map((cartRequestDrug: any) => {
        return {
          ...cartRequestDrug,
          key: cartRequestDrug?.cartRequestLogDrugId
        };
      });
      setRestockDrugs(restockDrugsList);
      setIsLoading(false);

      return restockDrugsList;
    } else {
      setRestockDrugs([]);
      setIsLoading(false);

      return [];
    }
  };

  const onChangePagination = async (pageNumber: number, pageSize: number) => {
    const newPaginatedData = {
      ...pagination,
      currentPage: pageNumber,
      perPage: pageSize
    };
    await fetchRestockLog({ ...newPaginatedData, selectedTab });
  };

  const onChangePaginationModal = async (
    pageNumber: number,
    pageSize: number
  ) => {
    const newPaginatedData = {
      ...paginationModal,
      currentPage: pageNumber,
      perPage: pageSize
    };
    await fetchRestockDrug({
      ...newPaginatedData,
      ...cartRequestDrugParam,
      isRequestLog: false
    });
  };

  const handleSearch = useCallback(
    debounce(e => {
      setSearch(e.target.value);
    }, 500),
    []
  );

  useEffect(() => {
    filterFormRef.resetFields();
    filterFormRef.setFieldsValue(filterInitialValues);
    setFilters(filterInitialValues);
  }, [selectedTab]);

  return (
    <div>
      <ReStockLogLayout
        selectedTab={selectedTab}
        onChangeTab={onChangeTab}
        setFilterOpen={setFilterOpen}
        onSearch={handleSearch}
      >
        <FilterTags<TRestockLogFilters>
          filterForm={filterFormRef}
          filterState={filters}
          filterInitialValues={filterInitialValues}
          onChangeFilters={onClickApply}
          customKeys={{
            userId: 'User',
            fromDate: 'From',
            toDate: 'To'
          }}
          customMapForSelect={{
            userId: userOptions
          }}
          marginTop={pxToRem(12)}
        />
        {selectedTab === (RESTOCK_LOGS_TABS[0]?.value as string) && (
          <StandardContainer
            isLoading={isLoading}
            selectedTab={selectedTab}
            pagination={pagination}
            onChangePagination={onChangePagination}
            paginationModal={paginationModal}
            onChangePaginationModal={onChangePaginationModal}
            filterFormRef={filterFormRef}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            onClickApply={onClickApply}
            search={search}
            onClickAction={onClickAction}
            onClickDownload={onClickDownload}
            showModal={showModal}
            handleCancel={handleCancel}
            fetchRestockLog={fetchRestockLog}
            tableData={restockLogs}
            modalTableData={restockDrugs}
            selectedCart={selectedCart}
            userOptions={userOptions}
            getType={getDisplayType}
            setSelectedFilterAdmin={setSelectedFilterAdmin}
          />
        )}
        {selectedTab === (RESTOCK_LOGS_TABS[1]?.value as string) && (
          <AfterHoursContainer
            isLoading={isLoading}
            pagination={pagination}
            onChangePagination={onChangePagination}
            paginationModal={paginationModal}
            onChangePaginationModal={onChangePaginationModal}
            filterFormRef={filterFormRef}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            onClickApply={onClickApply}
            search={search}
            onClickAction={onClickAction}
            onClickDownload={onClickDownload}
            showModal={showModal}
            handleCancel={handleCancel}
            fetchRestockLog={fetchRestockLog}
            tableData={restockLogs}
            modalTableData={restockDrugs}
            selectedCart={selectedCart}
            userOptions={userOptions}
            getType={getDisplayType}
            setSelectedFilterAdmin={setSelectedFilterAdmin}
          />
        )}
        {selectedTab === (RESTOCK_LOGS_TABS[2]?.value as string) && (
          <InitialAllocationContainer
            isLoading={isLoading}
            selectedTab={selectedTab}
            search={search}
            pagination={pagination}
            onChangePagination={onChangePagination}
            filterFormRef={filterFormRef}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            onClickApply={onClickApply}
            onClickAction={onClickAction}
            fetchRestockLog={fetchRestockLog}
            tableData={restockLogs}
            userOptions={userOptions}
            getType={getDisplayType}
            setSelectedFilterAdmin={setSelectedFilterAdmin}
          />
        )}
      </ReStockLogLayout>
    </div>
  );
};
