import React, { FC, useEffect, useState } from 'react';
import { FormInstance, Tooltip, Typography } from 'antd';
import { VsSelect } from 'vs-design-components';

import { Facility } from '@/types/adminTypes';
import { Patient } from '@/types/patientTypes';

import BridgeTherapyLayout from '@/components/bridgeTherapy/bridgeTherapy/bridgeTherapyLayout';
import { useBridgeTherapyStyle } from '@/components/bridgeTherapy/bridgeTherapy/useBridgeTherapyStyle';
import SftpPatientsReviewList from '@/components/bridgeTherapy/sftpPatientsReviewList';
import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';
import { usePillStyle } from '@/components/common/colorfulPill/usePillStyle';

import { useFacility } from '@/hooks/useFacility';
import { useFetch } from '@/hooks/useFetch';
import {
  ALL,
  BRIDGE_THERAPY_FILTER_TYPES,
  BRIDGE_THERAPY_SUPPLY_DAYS
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { getNewPaginationState, pxToRem } from '@/utils/sharedUtils';
import ShowToast from '@/utils/showToast';
import { API_BASE_URL, BRIDGE_THERAPY, FACILITIES_URL } from '@/utils/urls';

import {
  ACTIVE_STATUS,
  RELEASED_STATUS,
  searchingInitialValuesBridgeTherapy,
  TBridgeTherapyFilterTypes
} from './bridgeTherapyIntialValues';

const { Text } = Typography;

interface Props {
  filterOpen: boolean;
  setFilterOpen: (val: any) => void;
  filterFormRef: FormInstance;
  searchValue: string;
  setSearchValue: (val: string) => void;
  searchingFilter: TBridgeTherapyFilterTypes;
  onScreen: string;
  onChangeScreen: (val: any) => void;
  selectedPatients: any[];
  setSelectedPatients: (val: any) => void;
  setSearchingFilter: (val: any) => void;
  sftpPatientsList: any[];
  setSftpPatientsList: (val: any) => void;
  selectedPatientIds: any[];
  setSelectedPatientIds: (val: any) => void;
  showBulkModal: boolean;
  setShowBulkModal: (val: boolean) => void;
  selectedRowKeys: React.Key[];
  onSelectChange: (
    selectedRowKeys: React.Key[],
    selectedRows: Patient[]
  ) => void;
  onAddToSFTPList: () => void;
  showTableActions: boolean;
  setShowTableActions: (val: boolean) => void;
  onSelectCheckbox: (
    record: any,
    selected: any,
    selectedRows: any,
    nativeEvent: any
  ) => void;
  onSelectAllCheckboxes: (
    selected: any,
    selectedRows: any,
    changeRows: any
  ) => void;
  setSelectedRows: ({ key: [], rows: [] }) => void;
  onSupplyDayChange: (record: Patient, value: string) => void;
  selectedRows: {
    key: React.Key[];
    rows: Patient[];
  };
}

const BridgeTherapyContainer: FC<Props> = ({
  filterOpen,
  setFilterOpen,
  filterFormRef,
  searchValue,
  setSearchValue,
  searchingFilter,
  setSearchingFilter,
  onScreen,
  onChangeScreen,
  selectedPatients,
  setSelectedPatients,
  sftpPatientsList,
  setSftpPatientsList,
  selectedPatientIds,
  setSelectedPatientIds,
  showBulkModal,
  setShowBulkModal,
  selectedRowKeys,
  onSelectChange,
  onAddToSFTPList,
  showTableActions,
  setShowTableActions,
  onSelectCheckbox,
  onSelectAllCheckboxes,
  setSelectedRows,
  onSupplyDayChange,
  selectedRows
}) => {
  const isSmall = window.screen.width <= 576;

  const paginationInitialValues = {
    currentPage: 1,
    perPage: 100
  };

  const { currentFacility } = useFacility();
  const { bluePill, greenPill } = usePillStyle();
  const { selectBox, selectBoxItem } = useBridgeTherapyStyle();
  const { isLoading, setIsLoading, fetchData, postData } = useFetch();
  const [patientList, setPatientList] = useState<Patient[]>([]);
  const [facilitySupplyDays, setFacilitySupplyDays] = useState(false);
  const [filterTags, setFilterTags] = useState<TBridgeTherapyFilterTypes>({
    status: BRIDGE_THERAPY_FILTER_TYPES.RELEASED_7_DAYS
  });
  const [pagination, setPagination] = useState<any>({
    ...paginationInitialValues
  });

  const onCancelBulkUploadModal = () => {
    setShowBulkModal(false);
  };
  const getFacility = async () => {
    const facilities = await fetchData(`${API_BASE_URL}${FACILITIES_URL}`, {});
    if (facilities) {
      const supplyDays =
        facilities.find(
          (fc: Facility) => fc.facilityId === currentFacility.facilityId
        )?.supplyDays || 7;

      const isSupplyDays = supplyDays !== BRIDGE_THERAPY_SUPPLY_DAYS[0].value;
      setFacilitySupplyDays(isSupplyDays);
    }
  };
  const uploadSftpList = async () => {
    const bridgeTherapy = sftpPatientsList.map((patient: any) => {
      return { patientId: patient.patientId, supplyDays: patient.supplyDays };
    });

    const uploadedList = await postData(`${API_BASE_URL}${BRIDGE_THERAPY}/`, {
      bridgeTherapy,
      facilityId: currentFacility.facilityId
    });

    if (uploadedList) {
      onCancelBulkUploadModal();

      await getAllPatients(pagination, searchingFilter, searchValue, true);
      setSftpPatientsList([]);
      setSelectedPatientIds([]);
      setSelectedPatients([]);
      setSelectedRows({ key: [], rows: [] });
    } else {
      ShowToast('Can not upload SFTP file, Try again', 'error', 5);
    }
  };

  const getAllPatients = async (
    pagination: any,
    searchingFilter: any,
    searchValue: string,
    isReset?: boolean
  ) => {
    const patients = await fetchData(
      `${API_BASE_URL}${BRIDGE_THERAPY}/patients/`,
      {
        ...pagination,
        ...searchingFilter,
        searchText: searchValue
      }
    );

    setIsLoading(false);
    if (patients?.status === 'error') {
      // ShowToast(patients.message, patients.status, 5);
      setPatientList([]);
      setPagination(paginationInitialValues);

      return;
    }
    setPagination({
      ...patients.paginationInfo,
      perPage: pagination.perPage
    });
    const patientsWithKey = patients.rows.map((patient: Patient) => {
      const ischecked = selectedRows.rows.find(
        pat => !isReset && pat.patientId === patient.patientId
      );

      return {
        ...patient,
        key: patient.patientId,
        supplyDays: ischecked?.supplyDays || BRIDGE_THERAPY_SUPPLY_DAYS[0].value
      };
    });
    setPatientList(patientsWithKey);

    return;
  };

  const getDropdownValue = (patient: Patient) => {
    return (
      selectedRows.rows.find(pt => pt.patientId === patient.patientId)
        ?.supplyDays || patient.supplyDays
    );
  };
  const patientColumns: any = [
    {
      title: 'Name',
      width: 215,
      ellipsis: true,
      render: (value: Patient) => (
        <Tooltip title={value.name} placement="topLeft">
          <Text>{`${value.name}`}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Status',
      width: 145,
      render: (value: Patient) => (
        <ColorfulPill
          className={value.status === 'RELEASED' ? greenPill : bluePill}
          key={value.status}
          text={value.status}
        />
      )
    },
    {
      title: 'DOB',
      width: 145,
      render: (value: Patient) => (
        <Text>
          {getFormattedDateNoTimeZone({
            date: value.dob,
            format: DATE_FORMATS.MDY
          })}
        </Text>
      )
    },
    {
      title: 'Location',
      width: 145,
      render: (value: Patient) => (
        <Text>{value.location ? `${value.location}` : ''}</Text>
      )
    },
    {
      title: 'Booking Date',
      width: 145,
      render: (value: Patient) => (
        <Text>
          {value.lastBookedDate
            ? `${getFormattedDateNoTimeZone({ date: value.lastBookedDate, format: DATE_FORMATS.MDY })}`
            : ''}
        </Text>
      )
    },
    {
      title: 'Release Date',
      width: 145,
      render: (value: Patient) => (
        <Text>
          {value.lastReleaseDate
            ? `${getFormattedDateNoTimeZone({ date: value.lastReleaseDate, format: DATE_FORMATS.MDY })}`
            : ''}
        </Text>
      )
    },
    {
      title: 'Supply Days',
      width: 145,
      render: (value: Patient) => {
        return (
          <div className={selectBox}>
            <VsSelect
              onChange={(val: any) => onSupplyDayChange(value, val)}
              popupClassName={selectBoxItem}
              disabled={!selectedRowKeys.includes(value.patientId)}
              placeholder=""
              value={getDropdownValue(value)}
              options={BRIDGE_THERAPY_SUPPLY_DAYS}
            />
          </div>
        );
      }
    }
  ].filter(column => {
    if (column.title === 'Supply Days') {
      return facilitySupplyDays;
    }

    return true;
  });

  const removePatientFromSftpList = (patient: any) => {
    const filteredSftpPatients = sftpPatientsList.filter((sftpPatient: any) => {
      return sftpPatient.patientId !== patient.patientId;
    });
    setSftpPatientsList([...filteredSftpPatients]);
    const tempSelectedPatientIds = selectedPatientIds.filter(
      (patientId: any) => {
        return patient.patientId !== patientId;
      }
    );
    setSelectedPatientIds([...tempSelectedPatientIds]);
    const tempSelectedPatients = selectedPatients.filter((tempPatient: any) => {
      return patient.patientId !== tempPatient.patientId;
    });
    setSelectedPatients([...tempSelectedPatients]);

    setSelectedRows({
      key: [...tempSelectedPatientIds],
      rows: [...tempSelectedPatients]
    });

    setShowTableActions(tempSelectedPatientIds.length > 0);
  };

  const onClickApply = async (data: any, isClearAll?: boolean) => {
    setFilterTags({
      ...data,
      status:
        data.status === BRIDGE_THERAPY_FILTER_TYPES.ALL_PATIENTS
          ? ALL
          : data.status
    });
    let tempFilterData = {
      ...data,
      fromDate:
        data.status === BRIDGE_THERAPY_FILTER_TYPES.RELEASED ||
        data.status === BRIDGE_THERAPY_FILTER_TYPES.RELEASED_7_DAYS
          ? data?.fromDate
            ? getFormattedDateNoTimeZone({
                date: data?.fromDate,
                format: DATE_FORMATS.YMD
              })
            : data.status !== BRIDGE_THERAPY_FILTER_TYPES.RELEASED
              ? getFormattedDateNoTimeZone({
                  subtract: { amount: 1, unit: 'day' },
                  format: DATE_FORMATS.YMD
                })
              : undefined
          : undefined,
      toDate:
        data.status === BRIDGE_THERAPY_FILTER_TYPES.RELEASED ||
        data.status === BRIDGE_THERAPY_FILTER_TYPES.RELEASED_7_DAYS
          ? data?.toDate
            ? getFormattedDateNoTimeZone({
                date: data?.toDate,
                format: DATE_FORMATS.YMD
              })
            : data.status !== BRIDGE_THERAPY_FILTER_TYPES.RELEASED
              ? getFormattedDateNoTimeZone({
                  subtract: { amount: 1, unit: 'day' },
                  format: DATE_FORMATS.YMD
                })
              : undefined
          : undefined,
      status:
        data.status === BRIDGE_THERAPY_FILTER_TYPES.ALL_PATIENTS
          ? undefined
          : data.status === BRIDGE_THERAPY_FILTER_TYPES.ALL_ACTIVE
            ? ACTIVE_STATUS
            : RELEASED_STATUS,
      lastBookedDate:
        data.status === BRIDGE_THERAPY_FILTER_TYPES.RELEASED_7_DAYS
          ? getFormattedDateNoTimeZone({
              subtract: { amount: 6, unit: 'days' },
              format: DATE_FORMATS.YMD
            })
          : undefined
    };

    if (
      tempFilterData.status === BRIDGE_THERAPY_FILTER_TYPES.RELEASED &&
      !(tempFilterData.toDate && tempFilterData.fromDate)
    ) {
      tempFilterData.toDate = tempFilterData.fromDate = undefined;
    }

    setSearchingFilter({
      ...tempFilterData
    });
    setSelectedRows({
      key: [],
      rows: []
    });
    setSelectedPatientIds([]);
    setSelectedPatients([]);
    setShowTableActions(false);

    getAllPatients(pagination, tempFilterData, searchValue);

    if (!isClearAll) {
      setFilterOpen(false);
    }
  };

  const handleReset = async () => {
    getAllPatients(
      paginationInitialValues,
      {
        ...searchingFilter
      },
      searchValue
    );
  };

  useEffect(() => {
    if (searchValue) {
      getAllPatients(
        paginationInitialValues,
        {
          ...searchingFilter
        },
        searchValue
      );

      return;
    }
    handleReset();
  }, [searchValue]);

  useEffect(() => {
    getFacility();
  }, []);

  const onChangePagination = async (page: number, pageSize: number) => {
    const newpagination = getNewPaginationState({ page, pageSize }, pagination);
    await getAllPatients(newpagination, searchingFilter, searchValue);
  };

  useEffect(() => {
    setFilterTags({ status: BRIDGE_THERAPY_FILTER_TYPES.RELEASED_7_DAYS });
    filterFormRef.setFieldsValue({
      status: BRIDGE_THERAPY_FILTER_TYPES.RELEASED_7_DAYS
    });
  }, [onScreen]);

  return (
    <>
      <BridgeTherapyLayout
        onScreen={onScreen}
        onChangeScreen={onChangeScreen}
        patientColumns={patientColumns}
        patientList={patientList}
        pagination={pagination}
        onChangePagination={onChangePagination}
        isLoading={isLoading}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={onSelectChange}
        onClickApply={onClickApply}
        filterFormRef={filterFormRef}
        setFilterOpen={setFilterOpen}
        filterOpen={filterOpen}
        onAddToSFTPList={onAddToSFTPList}
        showTableActions={showTableActions}
        onSelectCheckbox={onSelectCheckbox}
        onSelectAllCheckboxes={onSelectAllCheckboxes}
        filterTagState={filterTags}
      />

      <SftpPatientsReviewList
        loading={isLoading}
        showSupplyDays={facilitySupplyDays}
        showModal={showBulkModal}
        sftpPatientsList={sftpPatientsList}
        onSubmit={uploadSftpList}
        removePatientFromList={removePatientFromSftpList}
        onCancel={onCancelBulkUploadModal}
        onCloseModal={() => setShowBulkModal(false)}
      />
    </>
  );
};

export default BridgeTherapyContainer;
