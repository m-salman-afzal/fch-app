'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Form, Grid, Tag, theme, Tooltip, Typography } from 'antd';
import debounce from 'lodash.debounce';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TPagination } from '@/types/commonTypes';

import { LogsLayout } from '@/components/logs/logsLayout';

import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import { DEFAULT_PAGE_SIZE, PERMISSION_TYPES_BACKEND } from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInEST,
  getFormattedDateInUTC,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { getFitlerValuesAndFilterAll } from '@/utils/getFiltersValuesAndFilterAll';
import {
  convertTimeIn12HourFormat,
  getNewPaginationState,
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';
import { API_BASE_URL, AUDIT_LOG_URL } from '@/utils/urls';

import { searchingInitialValues } from './logsIntialValues';

const { Text } = Typography;
const { useToken } = theme;
const { useBreakpoint } = Grid;

export const LogsContainer = () => {
  const isSmall = window.innerWidth <= 576;

  const paginationInitialValues = {
    currentPage: 1,
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  };
  const size = useBreakpoint();
  const admin = useCookies().getDataFromCookie();

  const { token } = useToken();

  const [searchFormRef] = Form.useForm();

  const { isLoading, setIsLoading, fetchData } = useFetch();

  const [searchingFilter, setSearchingFilter] = useState<any>({
    ...searchingInitialValues
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  let patientImageId = useRef<string>('');
  const [paginatedData, setPaginatedData] = useState<TPagination | undefined>(
    paginationInitialValues
  );
  const [modalTable, setModalTable] = useState<any>([]);
  const [changedValues, setChangedValues] = useState<any>([]);
  const [changeLogCreateAt, setChandeLogCreateAt] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchResult, setSearchResult] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const getAuditLogs = async (
    pagination: TPagination | undefined,
    filters: any
  ) => {
    setTableLoading(true);
    try {
      const log = await fetchData(`${API_BASE_URL}${AUDIT_LOG_URL}/`, {
        ...(pagination ?? paginationInitialValues),
        ...getFitlerValuesAndFilterAll(filters)
      });
      if (log?.status === 'error') {
        setAuditLogs([]);
        setPaginatedData(undefined);
        setTableLoading(false);

        return;
      }
      setPaginatedData({
        ...(pagination ?? paginationInitialValues),
        ...log.paginationInfo
      });
      setAuditLogs(log.rows);
      setTableLoading(false);
    } catch (e) {
      setTableLoading(false);
      setAuditLogs([]);
      setPaginatedData(undefined);
    }
  };

  useEffect(() => {
    getAuditLogs(paginatedData, searchingFilter);
  }, []);

  const handleSelectedUser = async (val: Record<string, any>) => {
    const data = { adminId: val.key };
    const filter = { ...searchingFilter, ...data };
    setSearchingFilter(filter);
    await getAuditLogs(paginatedData, searchingFilter);
  };

  const searchLogs = async (text: string) => {
    const url = `${API_BASE_URL}${AUDIT_LOG_URL}/search`;
    const data = await fetchData(url, {
      text,
      currentPage: 1,
      perPage: 100
    });
    if (data.status !== 'error') {
      const result = data.rows.map((obj: any) => {
        return {
          key: obj.entity.adminId,
          label: `${obj.entity.lastName}, ${obj.entity.firstName}`,
          value: `${obj.entity.lastName}, ${obj.entity.firstName}`
        };
      });
      setSearchResult(result);
    }
  };

  const handleFormSubmit = async (data: any) => {
    const formattedData = {
      ...searchingFilter,
      portalType: data.portalType,
      action: data.action,
      entity: data.entity,
      text: data.text,
      fromDate: data.fromDate
        ? getFormattedDateInUTC({
            date: data.fromDate,
            format: DATE_FORMATS.YMD
          })
        : undefined,
      toDate: data.toDate
        ? getFormattedDateInUTC({
            date: data.toDate,
            format: DATE_FORMATS.YMD
          })
        : undefined,
      currentPage: 0
    };
    setSearchingFilter({
      ...formattedData
    });

    await getAuditLogs(paginatedData, formattedData);
  };

  const handleReset = async () => {
    setSearchResult([]);
    const filters = {
      ...searchingFilter,
      ...{ adminId: '' }
      // ...paginatedData
    };
    setSearchingFilter(filters);
    await getAuditLogs(paginatedData, filters);
  };

  useEffect(() => {
    if (searchValue) {
      searchLogs(searchValue);

      return;
    }
    handleReset();
  }, [searchValue]);

  const handleSearch = useCallback(
    debounce(val => {
      setSearchValue(val);
    }, 500),
    []
  );

  const tableColumns = [
    {
      title: 'Date & Time',
      key: 'createdAt',
      render: (value: any) => {
        return (
          <div>
            {getFormattedDateInEST({
              date: value.auditLog.createdAt,
              format: DATE_FORMATS.MDY_TIME
            })}
          </div>
        );
      }
    },
    {
      title: 'Name',
      key: 'name',
      render: (value: any) => (
        <Text>
          {value?.admin?.lastName
            ? value.admin.lastName
            : value?.patient?.lastName
              ? value.patient.lastName
              : JSON.parse(value.auditLog.data).patient.lastName}
          {', '}
          {value?.admin?.firstName
            ? value.admin.firstName
            : value?.patient?.firstName
              ? value.patient.firstName
              : JSON.parse(value.auditLog.data).patient.firstName}
        </Text>
      )
    },
    {
      title: 'Entity',
      key: 'entity',
      render: (value: any) => (
        <Tag
          style={
            value.auditLog.entity === 'Admin'
              ? {
                  borderRadius: 12,
                  color: token.colorSuccessText,
                  background: '#D9F7BE80'
                }
              : value.auditLog.entity === 'SafeReport'
                ? {
                    borderRadius: 12,
                    color: token.colorErrorText,
                    background: token.colorErrorBg
                  }
                : value.auditLog.entity === 'Formulary'
                  ? {
                      borderRadius: 12,
                      color: token.colorInfoText,
                      background: token.colorInfoBg
                    }
                  : value.auditLog.entity === 'Inventory'
                    ? {
                        color: token.colorWarningTextActive,
                        background: token.colorWarningBg,
                        borderRadius: 12
                      }
                    : { borderRadius: 12 }
          }
        >
          {value.auditLog.entity === 'InventoryControl'
            ? 'Controlled Inventory'
            : value.auditLog.entity}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (value: any) => (
        <Text>{`${value.auditLog.action.charAt(0)}${value.auditLog.action
          .slice(1)
          .toLowerCase()}`}</Text>
      )
    },
    {
      title: '',
      key: 'viewDetails',
      width: pxToRem(58),
      render: (value: any) => (
        <div
          style={{
            border: '0px solid',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <VsButton
            style={TABLE_BUTTON_STYLE}
            antButtonProps={{
              icon: (
                <Tooltip title={'View'}>
                  <EyeOutlined style={TABLE_BUTTON_ICON_SIZE} />
                </Tooltip>
              )
            }}
            size={BUTTON_SIZES.squareIcon}
            onClick={() => onClickViewDetails(value)}
          ></VsButton>
        </div>
      )
    }
  ];

  const onClickViewDetails = async (data: any) => {
    const formattedData = {
      entity: searchingFilter.entity,
      entityId: data.auditLog.entityId
    };
    const objectPayload = JSON.parse(data.auditLog.data);
    patientImageId = objectPayload.patientId;
    const { rows } = await fetchData(
      `${API_BASE_URL}${AUDIT_LOG_URL}`,
      formattedData
    );
    const indexOfTable = rows.findIndex(
      (logs: any) => logs.auditLog.auditLogId === data.auditLog.auditLogId
    );
    setIsLoading(false);
    setIsShowModal(true);
    formatComparisonTable(rows, indexOfTable, data.auditLog.createdAt);
  };

  const formatComparisonTable = (
    dataList: any[],
    index: number,
    createdAt: string
  ) => {
    const object = generateObjects(index, dataList);
    const keysOfObject = [];
    const objectToIterate: any =
      object.afterObject === 'N/A' ? object.beforeObject : object.afterObject;
    for (const payloadKeys in objectToIterate) {
      if (typeof objectToIterate[payloadKeys] === 'object') {
        for (const keys in objectToIterate[payloadKeys]) {
          if (!keys.includes('Id') && !keys.includes('idType')) {
            const isConverted = convertObjectIntoArray(
              object?.afterObject[payloadKeys],
              object?.beforeObject[payloadKeys],
              keys
            );
            keysOfObject.push({ ...isConverted });
          }
        }
      } else {
        if (!payloadKeys.includes('Id') && !payloadKeys.includes('idType')) {
          const isConverted = convertObjectIntoArray(
            object.afterObject,
            object.beforeObject,
            payloadKeys
          );
          keysOfObject.push({ ...isConverted });
        }
      }
    }

    const changedValues = keysOfObject.filter(
      (obj: any) => obj.afterChange !== obj.beforeChange
    );
    setChangedValues(changedValues);
    setChandeLogCreateAt(createdAt);

    const unchanged = keysOfObject
      .filter((obj: any) => obj.afterChange === obj.beforeChange)
      .map((val: any) => {
        return { field: val.field, value: val.afterChange };
      });

    const mergedObjects: any = {};

    // WARN: added for merging same field values
    unchanged.forEach(obj => {
      if (!mergedObjects[obj.field]) {
        mergedObjects[obj.field] = { ...obj };
      }
    });

    setModalTable(Object.values(mergedObjects));
  };

  const generateObjects = (index: number, dataList: any[]) => {
    const isDeleteMethod = dataList[index].auditLog.method === 'DELETE';
    const isPostMethod = dataList[index].auditLog.method === 'POST';
    if (isDeleteMethod) {
      return {
        beforeObject: JSON.parse(dataList[index]?.auditLog?.data),
        afterObject: 'N/A'
      };
    }
    if (isPostMethod) {
      return {
        afterObject: JSON.parse(dataList[index]?.auditLog?.data),
        beforeObject: 'N/A'
      };
    }

    return {
      afterObject: JSON.parse(dataList[index]?.auditLog?.data),
      beforeObject: dataList[index + 1]
        ? JSON.parse(dataList[index + 1]?.auditLog?.data)
        : 'N/A'
    };
  };

  const convertObjectIntoArray = (
    afterObject: any,
    beforeOject: any,
    key: string
  ) => {
    let formattedObject = {};
    formattedObject = {
      field: key,
      afterChange: convertDataInFormat(afterObject, key),
      beforeChange: convertDataInFormat(beforeOject, key)
    };

    return formattedObject;
  };

  const convertDataInFormat = (data: any, keys: string) => {
    if (!data || data === 'N/A' || data[keys] === null) {
      return 'N/A';
    }
    data = data[keys];
    if (
      `${data}`.includes('-') &&
      (keys.includes('Date') || keys.includes('dob'))
    ) {
      return getFormattedDateNoTimeZone({
        date: data,
        format: DATE_FORMATS.MDY
      });
    }
    if (`${data}`.includes(':') && keys.includes('Time')) {
      return convertTimeIn12HourFormat(data);
    }
    if (keys.includes('isFamilyMember')) {
      return data ? 'True' : 'False';
    }
    if (keys.includes('Signature')) {
      return (
        <a type="link" href={data} target="_blank">
          Show Image
        </a>
      );
    }

    return `${data}`;
  };

  const onChangePagination = async (page: number, pageSize: number) => {
    const newPaginatedData = getNewPaginationState(
      { page, pageSize },
      paginatedData
    );
    setPaginatedData(newPaginatedData);
    await getAuditLogs(newPaginatedData, searchingFilter);
  };

  const handelSortChange = (sort: string) => {
    const data = { ...searchingFilter, sort };
    setSearchingFilter(data);
    getAuditLogs(paginatedData, searchingFilter);
  };

  return (
    <>
      {admin.rbac.auditLog !== PERMISSION_TYPES_BACKEND.HIDE && (
        <LogsLayout
          tableColumns={tableColumns}
          isLoading={tableLoading}
          tableData={auditLogs}
          pagination={paginatedData}
          onChangePagination={onChangePagination}
          handleModalClose={() => {
            setIsShowModal(false);
          }}
          showModal={isShowModal}
          modalTableData={modalTable}
          changedData={changedValues}
          changeLogCreateAt={changeLogCreateAt}
          setSearchValue={handleSearch}
          setLogType={() => {}}
          searchResult={searchResult}
          setSelectedUser={handleSelectedUser}
          setSort={handelSortChange}
          filterFormRef={searchFormRef}
          handleFormSubmit={handleFormSubmit}
          searchingFilter={searchingFilter}
        />
      )}
    </>
  );
};
