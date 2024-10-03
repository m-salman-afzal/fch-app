import React, { FC, useEffect, useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { FormInstance, Grid, Tooltip, Typography } from 'antd';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TAdmin } from '@/types/adminTypes';
import { BridgeTherapy } from '@/types/bridgeTherapyTypes';

import SFTPLogsLayout from '@/components/bridgeTherapy/sftpLogs/sftpLogsLayout';

import { useFacility } from '@/hooks/useFacility';
import { useFetch } from '@/hooks/useFetch';
import AdminService from '@/services/AdminService';
import {
  ALL_OPTION,
  BRIDGE_THERAPY_FILTER_TYPES,
  DEFAULT_PAGE_SIZE
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInEST,
  getFormattedDateInUTC
} from '@/utils/dateFormatsTimezones';
import { getBridgeTherapyAdmins } from '@/utils/endpoints';
import { getFitlerValuesAndFilterAll } from '@/utils/getFiltersValuesAndFilterAll';
import {
  getNewPaginationState,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';
import ShowToast from '@/utils/showToast';
import { API_BASE_URL, BRIDGE_THERAPY } from '@/utils/urls';

import PatientService from '../../services/PatientService';
import {
  searchingInitialValuesSftpLogs,
  TSFTPLogFilter
} from './sftpLogsIntialValues';

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface Props {
  filterOpen: boolean;
  setFilterOpen: (val: any) => void;
  filterFormRef: FormInstance;
  searchingFilter: TSFTPLogFilter;
  setSearchingFilter: (val: any) => void;
  sort: string;
  setSort: (val: string) => void;
  onScreen: string;
}
const SFTPLogsContainer: FC<Props> = ({
  filterOpen,
  setFilterOpen,
  filterFormRef,
  searchingFilter,
  setSearchingFilter,
  sort,
  setSort,
  onScreen
}) => {
  const isSmall = window.screen.width <= 576;
  const size = useBreakpoint();
  const [filterTags, setFilterTags] = useState<TSFTPLogFilter>(searchingFilter);
  const paginationInitialValues = {
    currentPage: 1,
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  };

  const { currentFacility } = useFacility();
  const [allAdmins, setAllAdmins] = useState<any>([]);

  const downloadLogFile = async (log: any) => {
    const { bridgeTherapyLogId, filename } = log;
    setIsLoading(true);
    const therapyLogsData = await PatientService.downloadBridgeTherapyLogFile({
      bridgeTherapyLogId,
      facilityId: currentFacility.facilityId
    });
    if (therapyLogsData) {
      const element = document.createElement('a');
      const file = new Blob([therapyLogsData.file], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${log.filename}`;
      document.body.appendChild(element);
      element.click();
    } else {
      ShowToast('File not found', 'error', 5);
    }
    setIsLoading(false);
  };
  const { isLoading, setIsLoading, fetchData } = useFetch();
  const [bridgeTherapyList, setBridgeTherapyList] = useState<BridgeTherapy[]>(
    []
  );
  const [pagination, setPagination] = useState<any>(paginationInitialValues);

  const getAllBridgeTherapyLogs = async (
    pagination: any,
    searchingFilter: any
  ) => {
    const bridgeTherapys = await fetchData(
      `${API_BASE_URL}${BRIDGE_THERAPY}/`,
      { ...pagination, ...getFitlerValuesAndFilterAll(searchingFilter) }
    );

    setIsLoading(false);
    if (bridgeTherapys?.status === 'error') {
      setBridgeTherapyList([]);
      setPagination(paginationInitialValues);

      return;
    }
    setPagination({
      ...bridgeTherapys.paginationInfo,
      perPage: pagination.perPage
    });

    const bridgeTherapysWithKey = bridgeTherapys.rows.map(
      (bridgeTherapy: BridgeTherapy) => {
        return { ...bridgeTherapy, key: bridgeTherapy.bridgeTherapyLogId };
      }
    );
    setBridgeTherapyList(bridgeTherapysWithKey);

    return;
  };

  const getAllAdmins = async (searchFilters: { text?: string }) => {
    setIsLoading(true);
    const res = await fetchData(getBridgeTherapyAdmins(), searchFilters);
    if (res?.status === 'error') {
      return;
    }

    const adminsFilter = res.map((r: TAdmin) => {
      return {
        label: `${r.lastName}, ${r.firstName}`,
        value: `${r.lastName}, ${r.firstName}`,
        key: r.adminId
      };
    });
    setAllAdmins(res?.length ? [ALL_OPTION, ...adminsFilter] : res);
    setIsLoading(false);
  };

  const onChangePagination = async (page: number, pageSize: number) => {
    const newPaginatedData = getNewPaginationState(
      { page, pageSize },
      pagination
    );
    getAllBridgeTherapyLogs(newPaginatedData, searchingFilter);
  };

  const handleSortChange = (sort: string) => {
    const sortSearchingFilter = { ...searchingFilter, sort };
    setSearchingFilter(sortSearchingFilter);

    getAllBridgeTherapyLogs(paginationInitialValues, sortSearchingFilter);
  };

  const bridgeTherapyColumns: any = [
    {
      title: 'File Name',
      key: 'filName',
      render: (value: any) => <Text>{`${value.filename}`}</Text>
    },
    {
      title: 'Uploaded By',
      key: 'adminName',
      align: 'left',
      render: (value: any) => (
        <Text>{`${value.admin.lastName}, ${value.admin.firstName}`}</Text>
      )
    },
    {
      title: 'Uploaded At',
      key: 'createdAt',
      render: (value: any) => (
        <Text>
          {getFormattedDateInEST({
            date: value.createdAt,
            format: DATE_FORMATS.MDY_TIME
          })}
        </Text>
      )
    },
    {
      title: '',
      key: 'action',
      render: (value: any) => {
        return (
          <Tooltip title={'Download'}>
            <div style={{ width: 'fit-content' }}>
              <VsButton
                size={BUTTON_SIZES.squareIcon}
                style={TABLE_BUTTON_STYLE}
                onClick={() => {
                  downloadLogFile(value);
                }}
              >
                <DownloadOutlined style={TABLE_BUTTON_ICON_SIZE} />
              </VsButton>
            </div>
          </Tooltip>
        );
      }
    }
  ];

  const onClickApply = async (data: TSFTPLogFilter, isClearAll?: boolean) => {
    setFilterTags(data);
    let date;
    if (data.bridgeTherapyLogCreatedAt)
      date = getFormattedDateInUTC({
        date: data.bridgeTherapyLogCreatedAt,
        format: DATE_FORMATS.YMD
      });

    const newSearchingFilter = {
      ...data,
      bridgeTherapyLogCreatedAt: date
    };

    if ('adminName' in data) {
      newSearchingFilter.adminId = allAdmins.find(
        (admin: any) => admin.value === data.adminName
      )?.key;
      delete newSearchingFilter.adminName;
    }
    setSearchingFilter(newSearchingFilter);
    getAllBridgeTherapyLogs(paginationInitialValues, newSearchingFilter);

    if (!isClearAll) {
      setFilterOpen(false);
    }
  };

  useEffect(() => {
    getAllAdmins({});
  }, []);

  useEffect(() => {
    handleSortChange(sort);
  }, [sort]);

  useEffect(() => {
    setFilterTags(searchingInitialValuesSftpLogs);
  }, [onScreen]);

  return (
    <>
      <SFTPLogsLayout
        bridgeTherapyColumns={bridgeTherapyColumns}
        bridgeTherapyList={bridgeTherapyList}
        isLoading={isLoading}
        pagination={pagination}
        onChangePagination={onChangePagination}
        filterFormRef={filterFormRef}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        onClickApply={onClickApply}
        allAdmins={allAdmins}
        filterTagsState={filterTags}
      />
    </>
  );
};

export default SFTPLogsContainer;
