import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { Col, Form, Grid, Row } from 'antd';
import { download, mkConfig } from 'export-to-csv';
import debounce from 'lodash.debounce';
import { useRouter, useSearchParams } from 'next/navigation';

import { TPagination } from '@/types/commonTypes';
import { TFile, TFileFilter } from '@/types/fileTypes';

import FilterTags from '@/components/common/filterTags/filterTags';
import { FileFilterLayout } from '@/components/file/layout/fileFilterLayout';
import { FileNavigationLayout } from '@/components/file/layout/fileNavigationLayout';
import { FileTableLayout } from '@/components/file/layout/fileTableLayout';

import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import {
  ALL,
  ALL_OPTION,
  DEFAULT_PAGE_SIZE,
  FILE_NAVIGATION_OPTIONS,
  FILE_REPOSITORY,
  FILE_STATUS,
  FILE_STATUS_OPTIONS,
  INVENTORY_AND_FORMULARY_LEVEL_REPOSITORY,
  TOAST_DURATION,
  TOAST_GENERIC_ERROR_MESSAGE
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInUTC,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { downloadFileUrl, getFileUrl } from '@/utils/endpoints';
import { pxToRem } from '@/utils/sharedUtils';
import ShowToast from '@/utils/showToast';

const { useBreakpoint } = Grid;
const filtersInitalValues = {
  fromDate: undefined,
  toDate: undefined,
  status: ALL,
  facilityId: ALL
};
export const FACILITY_FREE_TABS = ['userManagement', 'formulary'];
type TStatus = { status?: string; isEf?: boolean };
export const FileContainer = () => {
  const { getDataFromCookie } = useCookies();
  const admin = getDataFromCookie();
  const tabInUrl = useSearchParams().get('tab');
  const router = useRouter();
  const size = useBreakpoint();
  const isSmall = window.screen.width <= 576;
  const { fetchData } = useFetch();
  const [filterForm] = Form.useForm<TFileFilter>();
  const [onScreen, setScreen] = useState(
    tabInUrl ? tabInUrl : FILE_NAVIGATION_OPTIONS[0]?.value
  );
  const [searchClicked, setSearchClicked] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [pagination, setPagination] = useState<TPagination>({
    currentPage: 1,
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  });
  const [file, setFile] = useState<TFile[]>([]);
  const [filters, setFilters] = useState<TFileFilter>(filtersInitalValues);
  const [status, setStatus] = useState<TStatus>({
    status: undefined,
    isEf: undefined
  });
  const [repository, setRepository] = useState<string>(
    tabInUrl
      ? (FILE_NAVIGATION_OPTIONS.find(navOption => navOption.value === tabInUrl)
          ?.status as string)
      : FILE_NAVIGATION_OPTIONS[0].status
  );
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const onChangeScreen = async (e: SetStateAction<string>) => {
    router?.push(`/fileManager?tab=${e}`);
    setScreen(e);
    setSearchVal('');
    onResetFilter();
    setFilters(filtersInitalValues);
    setSearchText('');
    setStatus({});
    const repository = FILE_NAVIGATION_OPTIONS.find(
      navOption => navOption.value === e
    )?.status as string;

    setRepository(repository ?? '');
    await getFiles({
      filters: {
        ...filtersInitalValues,
        facilityId:
          FACILITY_FREE_TABS.indexOf(e as string) === -1 ? ALL : undefined
      },
      pagination: pagination,
      repository: repository,
      searchText: '',
      status: {}
    });
  };
  const onResetFilter = () => {
    filterForm.resetFields();
  };

  const getFiles = async ({
    filters,
    pagination,
    repository,
    searchText,
    status
  }: {
    filters?: any;
    pagination?: TPagination;
    repository: string;
    searchText: string;
    status: TStatus;
  }) => {
    try {
      setIsLoading(true);
      const searchFilters = {
        ...pagination,
        ...filters,
        repository:
          repository === FILE_REPOSITORY.INITIAL_ALLOCATION
            ? FILE_REPOSITORY.CART_REQUEST_LOG
            : repository === INVENTORY_AND_FORMULARY_LEVEL_REPOSITORY.INVENTORY
              ? INVENTORY_AND_FORMULARY_LEVEL_REPOSITORY.INVENTORY_AND_FORMULARY_LEVELS
              : repository,
        text: searchText,
        ...status,
        status: status.status === ALL ? undefined : status.status,
        facilityId: filters.facilityId === ALL ? undefined : filters.facilityId
      };
      const { totalItems, totalPages, ...newSearchFilters } = searchFilters;
      const files = await fetchData(getFileUrl(), newSearchFilters);

      if (files.status === 'error') {
        setFile([]);
        setIsLoading(false);

        setPagination({
          ...(pagination as TPagination),
          totalItems: 0,
          totalPages: 0
        });

        return;
      }

      const filesWithKeys = files.rows.map((file: TFile) => {
        return { ...file, key: file.fileId };
      });

      setFile(filesWithKeys);
      setPagination({
        ...(pagination as TPagination),
        totalItems: files.paginationInfo.totalItems,
        totalPages: files.paginationInfo.totalPages
      });
      setIsLoading(false);
    } catch (error) {
      ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);
    }
  };

  useEffect(() => {
    getFiles({
      filters: {
        ...filters,
        facilityId:
          FACILITY_FREE_TABS.indexOf(onScreen) === -1 ? ALL : undefined
      },
      pagination: pagination,
      repository: repository,
      searchText: searchText,
      status: status
    });
  }, []);

  const onSearchName = useCallback(
    debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
      const repository =
        FILE_NAVIGATION_OPTIONS.find(navOption => navOption.value === onScreen)
          ?.status ?? '';

      const searchFilters = {
        ...filters,
        text: e.target.value,
        repository:
          repository === FILE_REPOSITORY.INITIAL_ALLOCATION
            ? FILE_REPOSITORY.CART_REQUEST_LOG
            : repository
      };
      setSearchText(e.target.value);

      await getFiles({
        filters: searchFilters,
        pagination: pagination,
        repository: repository,
        searchText: e.target.value,
        status: status
      });
    }, 500),
    [onScreen, searchText, repository]
  );

  const onApplyFilter = async (values: any) => {
    const getStatus = () => {
      switch (values.status) {
        case FILE_STATUS.PROCESSED:
          return { status: FILE_STATUS.PROCESSED };

        case FILE_STATUS.PARTIAL:
          return { status: FILE_STATUS.PARTIAL };

        case FILE_STATUS.FAILED:
          return { status: FILE_STATUS.FAILED };

        case FILE_STATUS.QUEUED:
          return { status: FILE_STATUS.QUEUED };

        default:
          return { status: undefined };
      }
    };

    setStatus(getStatus());

    const searchFilters = {
      ...values,
      fromDate:
        values.fromDate &&
        getFormattedDateInUTC({
          date: values.fromDate,
          format: DATE_FORMATS.YMD
        }),
      toDate:
        values.toDate &&
        getFormattedDateInUTC({
          date: values.toDate,
          format: DATE_FORMATS.YMD
        })
    };

    setFilters({ ...filters, ...searchFilters });
    setShowFilterDrawer(false);

    await getFiles({
      filters: { ...filters, ...searchFilters },
      pagination: pagination,
      repository: repository,
      searchText: searchText,
      status: getStatus()
    });
  };

  const onChangePagination = async (page: number, pageSize: number) => {
    const updatedPagination = {
      ...pagination,
      currentPage: page,
      perPage: pageSize
    };

    setPagination(updatedPagination);

    await getFiles({
      filters: filters,
      pagination: updatedPagination,
      repository: repository,
      searchText: searchText,
      status: status
    });
  };

  const onClickErrorDownload = async (value: TFile) => {
    try {
      const file = await fetchData(downloadFileUrl(value.fileId), {
        isEf: value.isEf
      });
      if (file.status === 'error') {
        ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);

        return;
      }

      const csvConfig = mkConfig({
        useKeysAsHeaders: true,
        fieldSeparator: ',',
        filename: file.fileName
      });
      download(csvConfig)(file.fileContent);
    } catch (error) {
      ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);
    }
  };

  const onClickUploadedDownload = async (value: TFile) => {
    try {
      const file = await fetchData(downloadFileUrl(value.fileId));
      if (file.status === 'error') {
        ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);

        return;
      }

      const csvConfig = mkConfig({
        useKeysAsHeaders: true,
        fieldSeparator: ',',
        filename: file.fileName
      });
      download(csvConfig)(file.fileContent);
    } catch (error) {
      ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);
    }
  };

  return (
    <>
      <Row
        align={'middle'}
        justify={'space-between'}
        style={{
          flexWrap: size.xs ? 'wrap-reverse' : undefined,
          paddingInline: size.xs ? pxToRem(15) : undefined,
          marginBottom: pxToRem(16)
        }}
      >
        <Col span={size.xs ? 24 : 12}>
          <FileNavigationLayout
            onScreen={onScreen}
            onChangeScreen={onChangeScreen}
          />
        </Col>

        <Col span={size.xs ? 24 : 12}>
          <FileFilterLayout
            form={filterForm}
            onResetFilter={onResetFilter}
            onApplyFilter={onApplyFilter}
            searchClicked={searchClicked}
            setSearchClicked={setSearchClicked}
            showFilterDrawer={showFilterDrawer}
            setShowFilterDrawer={setShowFilterDrawer}
            onSearchName={onSearchName}
            onScreen={onScreen}
            searchVal={searchVal}
            setSearchVal={setSearchVal}
          />
        </Col>
      </Row>

      <FilterTags<TFileFilter>
        filterForm={filterForm}
        filterState={filters}
        filterInitialValues={filtersInitalValues}
        onChangeFilters={onApplyFilter}
        marginTop={pxToRem(0)}
        marginBottom={pxToRem(0)}
        customKeys={{
          facilityId: 'Facility'
        }}
        customMapForSelect={{
          facilityId: [
            ALL_OPTION,
            ...admin.facility.map((fa: any) => {
              return {
                label: fa.facilityName,
                value: fa.facilityId,
                key: fa.facilityId
              };
            })
          ],
          status: [ALL_OPTION, ...FILE_STATUS_OPTIONS]
        }}
        excludeKeys={{
          isEf: true
        }}
      />
      <FileTableLayout
        isLoading={isLoading}
        files={file}
        onChangePagination={onChangePagination}
        pagination={pagination}
        onScreen={onScreen}
        onClickErrorDownload={onClickErrorDownload}
        onClickUploadedDownload={onClickUploadedDownload}
      />
    </>
  );
};
