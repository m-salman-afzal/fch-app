import React, { useEffect, useState } from 'react';
import { Col, Form, Grid, Row, Typography } from 'antd';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import Image from 'next/image';
import { useConfirm } from 'vs-design-components/src/Components';

import { TPagination } from '@/types/commonTypes';
import {
  TServiceDisruption,
  TServiceDisruptionFilters
} from '@/types/serviceDisruptionTypes';

import FilterTags from '@/components/common/filterTags/filterTags';
import { ServiceDisruptionFilterLayout } from '@/components/serviceDisruption/layout/serviceDisruptionFilterLayout';
import { ServiceDisruptionLayout } from '@/components/serviceDisruption/layout/serviceDisruptionLayout';
import { useServiceDisruptionNavigationStyle } from '@/components/serviceDisruption/styles/useServiceDisruptionNavigationStyle';

import DELETE_ICON from '@/assets/icons/common/deleteModal.svg';
import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import { useCommonStyles } from '@/styles/useCommonStyles';
import {
  ALL,
  ALL_OPTION,
  DEFAULT_PAGE_SIZE,
  DISRIPTION_SERVICE_REASONS,
  FILE_EXTENSIONS,
  HVAS_COUNTY_SERVICES,
  PERMISSIONS_TYPES
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import {
  bulkUpsertServiceDisruptionUrl,
  getServiceDisruptionPatientsUrl,
  getServiceDisruptionUrl
} from '@/utils/endpoints';
import { pxToRem, toBase64File } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

const PATIENTS_CSV_HEADERS = [
  'patientName',
  'patientNumber',
  'date',
  'time',
  'service',
  'reason',
  'comments',
  'delayPeriod'
];

const filterInitialValues = {
  date: undefined,
  service: ALL,
  reason: ALL
} as const;

export const ServiceDisruptionContainer = () => {
  const { getDataFromCookie } = useCookies();
  const admin = getDataFromCookie();
  const { serviceDisruptionHeading } = useServiceDisruptionNavigationStyle();
  const size = useBreakpoint();
  const [filterForm] = Form.useForm<TServiceDisruptionFilters>();
  const [bulkUploadForm] = Form.useForm();
  const isSmall = window.screen.width <= 576;

  const paginationInitialValues = {
    currentPage: 1,
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  };

  const { fetchData, isLoading, postData, deleteData } = useFetch();

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const [filteredServiceDisruption, setFilteredServiceDisruption] = useState<
    TServiceDisruption[]
  >([]);

  const [pagination, setPagination] = useState<TPagination | undefined>(
    paginationInitialValues
  );

  const [filters, setFilters] =
    useState<TServiceDisruptionFilters>(filterInitialValues);

  const [showModal, setShowModal] = useState({
    bulkUpload: false
  });

  const onResetFilter = () => {
    filterForm.resetFields();
  };

  const onShowModal = (props: { bulkUpload?: boolean }) => {
    'bulkUpload' in props &&
      setShowModal({
        ...showModal,
        bulkUpload: props.bulkUpload as boolean
      });
  };

  const onClickDownload = async (value: TServiceDisruption) => {
    const csvConfig = mkConfig({
      columnHeaders: PATIENTS_CSV_HEADERS,
      useKeysAsHeaders: false,
      fieldSeparator: ',',
      filename: `${value.date}_${value.service}_${value.reason}`
    });
    const serviceDisruptionPatients = await fetchData(
      getServiceDisruptionPatientsUrl(),
      { serviceDisruptionId: value.serviceDisruptionId }
    );
    const formattedDate = serviceDisruptionPatients.map((sip: any) => ({
      ...sip,
      date: getFormattedDateNoTimeZone({
        date: sip.date,
        format: DATE_FORMATS.MDY
      })
    }));
    if (formattedDate?.length > 0) {
      const csv = generateCsv(csvConfig)(formattedDate);
      download(csvConfig)(csv);
    }
  };

  const { confirm } = useConfirm();
  const {
    deleteFamilyMemberConfirmIcon,
    deleteFamilyMemberConfirmIconContainer
  } = useCommonStyles();

  const handleDeleteServiceDisruption = async (serviceDisruptionId: string) => {
    const res = await deleteData(
      `${getServiceDisruptionUrl()}/${serviceDisruptionId}`
    );
    if (res.status !== 'error') {
      await getServiceDisruption({ filters, pagination });
    }
  };

  const onClickDelete = async (serviceDisruptionId: string) => {
    confirm({
      onOk: async () => {
        await handleDeleteServiceDisruption(serviceDisruptionId);
      },
      text: (
        <Typography.Paragraph
          style={{
            fontSize: pxToRem(20),
            width: pxToRem(277),
            fontWeight: 600,
            textAlign: 'center',
            marginBlockEnd: 0
          }}
        >
          Are you sure you want to delete this record?
        </Typography.Paragraph>
      ),
      type: 'destructive',
      okText: 'Yes',
      cancelText: 'No',
      icon: (
        <div className={deleteFamilyMemberConfirmIconContainer}>
          <Image
            alt={'MSG'}
            src={DELETE_ICON}
            className={deleteFamilyMemberConfirmIcon}
            fill
          />
        </div>
      )
    });
  };

  const setFilterOpen = async (value: boolean) => {
    setShowFilterDrawer(value);
  };

  const getServiceDisruption = async ({
    filters,
    pagination
  }: {
    filters?: TServiceDisruptionFilters;
    pagination?: TPagination;
  }) => {
    try {
      const isPagination = pagination ?? paginationInitialValues;
      const serviceDisruptions = await fetchData(getServiceDisruptionUrl(), {
        ...isPagination,
        ...filters,
        service: filters?.service === ALL ? undefined : filters?.service,
        reason: filters?.reason === ALL ? undefined : filters?.reason
      });
      if (serviceDisruptions.status === 'error') {
        setFilteredServiceDisruption([]);
        setPagination(undefined);

        return;
      }

      const serviceDisruptionWithKeys = serviceDisruptions.rows.map(
        (sf: TServiceDisruption) => {
          return {
            ...sf,
            key: sf.serviceDisruptionId
          };
        }
      );

      setFilteredServiceDisruption(serviceDisruptionWithKeys);
      setPagination({
        ...isPagination,
        ...serviceDisruptions.paginationInfo,
        totalItems: serviceDisruptions.paginationInfo.totalItems,
        totalPages: serviceDisruptions.paginationInfo.totalPages
      });
    } catch (error) {
      setFilteredServiceDisruption([]);
      setPagination(undefined);
    }
  };

  useEffect(() => {
    getServiceDisruption({ pagination: pagination });
  }, []);

  const onApplyFilter = async (values: TServiceDisruptionFilters) => {
    const newFilters = {
      ...values,
      date:
        values.date &&
        getFormattedDateNoTimeZone({
          date: values.date,
          format: DATE_FORMATS.YMD
        }),
      service: values.service === ALL ? undefined : values.service,
      reason: values.reason === ALL ? undefined : values.reason
    };

    setFilters(newFilters);

    await getServiceDisruption({
      filters: newFilters,
      pagination: pagination
    });

    setShowFilterDrawer(false);
  };

  const onChangePagination = async (page: number, pageSize: number) => {
    const updatedPagination = {
      ...pagination,
      currentPage: page,
      perPage: pageSize
    };

    setPagination(updatedPagination);
    await getServiceDisruption({
      filters: filters,
      pagination: updatedPagination
    });
  };

  const onBulkUpload = async (fileData: any) => {
    const { file } = fileData;

    const fileContent = (await toBase64File(
      file.fileList[0].originFileObj
    )) as string;
    const content = fileContent.split('base64,')[1];

    const fileNameArray = file.file.name.split('.');
    fileNameArray.pop();

    await postData(bulkUpsertServiceDisruptionUrl(), {
      fileContent: content,
      fileExtension: FILE_EXTENSIONS.CSV,
      fileName: fileNameArray.join('.'),
      process: 'BULK_ADD_SERVICE_DISRUPTION',
      repository: 'SERVICE_DISRUPTION'
    });

    setShowModal({ bulkUpload: false });
  };

  return (
    <>
      {admin.rbac.serviceDisruptions !== PERMISSIONS_TYPES.HIDE && (
        <>
          <Col style={{ paddingInline: size.xs ? pxToRem(20) : undefined }}>
            <Row
              align={'middle'}
              justify={size.xs ? 'start' : 'end'}
              gutter={[1, 16]}
            >
              <Col>
                <Row>
                  <Col className={serviceDisruptionHeading}>
                    {size.xs && 'Service Disruption'}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <ServiceDisruptionFilterLayout
                      onResetFilter={onResetFilter}
                      onApplyFilter={onApplyFilter}
                      onBulkUpload={onBulkUpload}
                      onCancelModal={onShowModal}
                      filterForm={filterForm}
                      bulkUploadForm={bulkUploadForm}
                      showModal={showModal}
                      isLoading={isLoading}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>

          <FilterTags<TServiceDisruptionFilters>
            filterForm={filterForm}
            filterState={filters}
            filterInitialValues={filterInitialValues}
            onChangeFilters={onApplyFilter}
            marginBottom={pxToRem(-18)}
            marginTop={pxToRem(16)}
            customMapForSelect={{
              reason: [ALL_OPTION, ...DISRIPTION_SERVICE_REASONS],
              service: [ALL_OPTION, ...HVAS_COUNTY_SERVICES]
            }}
          />
          <ServiceDisruptionLayout
            onChangePagination={onChangePagination}
            onClickDownload={onClickDownload}
            onClickDelete={onClickDelete}
            serviceDisruptions={filteredServiceDisruption}
            isLoading={isLoading}
            pagination={pagination}
          />
        </>
      )}
    </>
  );
};
