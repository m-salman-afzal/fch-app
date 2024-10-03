import { useCallback, useEffect, useRef, useState } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Tooltip, Typography } from 'antd';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { FacilitiesLayout } from '@/components/facilities/facilitiesLayout';

import EditOutlinedIcon from '@/assets/icons/common/EditOutlined.svg';
import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import {
  DEFAULT_PAGE_SIZE,
  PERMISSION_TYPES_BACKEND,
  PERMISSIONS_TYPES
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import {
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE,
  toTitleCase
} from '@/utils/sharedUtils';
import {
  API_BASE_URL,
  FACILITIES_UNIT_URL,
  FACILITIES_URL
} from '@/utils/urls';

export const FacilitiesContainer = () => {
  const isSmallScreenSzie = window.screen.width < 576;
  const { fetchData, postData, updateData, isLoading, setIsLoading } =
    useFetch();
  const admin = useCookies().getDataFromCookie();
  const [formRef] = Form.useForm();
  const [unitSearchInputRef] = Form.useForm();
  const [facilities, setFacilities] = useState<any[]>([]);
  const [facilityToEdit, setFacilityToEdit] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [unitsDrawerOpen, setUnitsDrawerOpen] = useState(false);
  const [unitsTextValue, setUnitsTextValue] = useState<string>('');

  const [facilityUnitFilters, setFacilityUnitFilters] = useState<any>({
    unit: '',
    currentPage: 1,
    perPage: isSmallScreenSzie
      ? DEFAULT_PAGE_SIZE.MOBILE
      : DEFAULT_PAGE_SIZE.DESKTOP,
    facilityId: ''
  });
  const [facilityIdToEdit, setFacilityIdToEdit] = useState<string>('');
  const [facilityUnits, setFacilityUnits] = useState<any[]>([]);
  const [updatedFacilityUnits, setUpdatedFacilityUnits] = useState<any>({});
  const [facilityUnitsPaginationInfo, setFacilityUnitsPaginationInfo] =
    useState<any>({
      currentPage: 0,
      perPage: isSmallScreenSzie
        ? DEFAULT_PAGE_SIZE.MOBILE
        : DEFAULT_PAGE_SIZE.DESKTOP,
      totalItems: 0,
      totalPages: 0
    });

  useEffect(() => {
    fetchFacilitiesAndContacts({});
  }, []);

  const handleFilterInput = useCallback(
    debounce(val => {
      fetchFacilitiesAndContacts({ text: val });
    }, 500),
    []
  );

  useEffect(() => {
    if (facilityUnitFilters?.facilityId) {
      fetchFacilityUnitsByText();
    }
  }, [unitsTextValue]);

  const handleUnitsFilterInput = useCallback(
    debounce(val => {
      setUnitsTextValue(val);
    }, 500),
    []
  );

  const onCancelFacilityForm = () => {
    formRef.resetFields();
    setFacilityToEdit(undefined);
    setShowModal(false);
    setIsLoading(false);
  };

  const addFacility = async (data: any) => {
    setIsLoading(true);
    data.facilityName = toTitleCase(data.facilityName);
    const addedFacility: any = await postData(
      `${API_BASE_URL}${FACILITIES_URL}/add`,
      data
    );
    if (addedFacility.message === 'Already exists') {
      setIsLoading(false);

      return;
    }
    if (addedFacility) {
      addedFacility.key = addedFacility.facilityId;
      let newFacilitiesArray = [...[addedFacility], ...facilities];
      setFacilities(newFacilitiesArray);
      onCancelFacilityForm();
    }
    setIsLoading(false);

    return true;
  };

  const fetchFacilitiesAndContacts = async (filters: any) => {
    setIsLoading(true);
    const facilities = await fetchData(
      `${API_BASE_URL}${FACILITIES_URL}`,
      filters
    );
    if (facilities?.status === 'error') {
      setFacilities([]);
    } else {
      setFacilities(facilities);
    }
    setIsLoading(false);
  };

  const onSubmitFacilityForm = async (facilityData: any) => {
    facilityData.population = facilityData.population
      ? parseInt(facilityData.population)
      : 0;
    facilityData.launchDate = facilityData.launchDate
      ? getFormattedDateNoTimeZone({
          date: facilityData.launchDate,
          format: DATE_FORMATS.YMD
        })
      : undefined;

    if (!facilityToEdit) {
      return await addFacility(facilityData);
    }

    return await updateFacility(facilityData);
  };

  const updateFacility = async (facilityData: any) => {
    setIsLoading(true);
    const { facilityId } = facilityToEdit;
    facilityData.facilityId = facilityId;
    facilityData.facilityName = toTitleCase(facilityData.facilityName);

    const updatedFacility: any = await updateData(
      `${API_BASE_URL}${FACILITIES_URL}/edit/${facilityId}`,
      facilityData
    );
    if (updatedFacility?.status === 'error') {
      setIsLoading(false);

      return;
    }
    if (updatedFacility) {
      fetchFacilitiesAndContacts({});
      onCancelFacilityForm();
    }
    setIsLoading(false);

    return true;
  };

  const editFacility = async (value: any) => {
    setShowModal(true);
    setFacilityToEdit(value);
    let { facilityName, externalFacilityId, population, address, launchDate } =
      value;

    formRef.setFieldsValue({
      facilityName,
      externalFacilityId,
      population,
      address,
      launchDate:
        launchDate &&
        getFormattedDateNoTimeZone({
          date: launchDate,
          format: DATE_FORMATS.MDY
        })
    });
  };

  const onClickEditFacilityUnits = async (facilityId: string) => {
    let filters = {
      ...facilityUnitFilters,
      facilityId
    };
    setFacilityUnitFilters(filters);
    await getFacilityUnits(filters);
  };

  const fetchFacilityUnitsByText = async () => {
    let filters = {
      ...facilityUnitFilters,
      unit: unitsTextValue,
      currentPage: 1,
      perPage: isSmallScreenSzie
        ? DEFAULT_PAGE_SIZE.MOBILE
        : DEFAULT_PAGE_SIZE.DESKTOP
    };
    setFacilityUnitFilters(filters);
    await getFacilityUnits(filters);
  };

  const getFacilityUnits = async (filters: any) => {
    setIsLoading(true);
    const { paginationInfo, rows } = await fetchData(
      `${API_BASE_URL}${FACILITIES_UNIT_URL}`,
      filters
    );
    if (rows && rows?.length) {
      let filteredUnits = [];
      for (const unit of rows) {
        let isCart = updatedFacilityUnits?.[unit?.facilityUnitId]
          ? updatedFacilityUnits?.[unit?.facilityUnitId]?.isCart
          : unit?.isCart;
        let isHnP = updatedFacilityUnits?.[unit?.facilityUnitId]
          ? updatedFacilityUnits?.[unit?.facilityUnitId]?.isHnP
          : unit?.isHnP;
        let stateUnit = {
          ...unit,
          key: unit?.facilityUnitId,
          isCart,
          isHnP
        };
        filteredUnits.push(stateUnit);
      }
      setFacilityIdToEdit(filters.facilityId);
      setFacilityUnits(filteredUnits);
      setFacilityUnitsPaginationInfo((currentInfo: any) => ({
        ...currentInfo,
        ...paginationInfo
      }));
      setUnitsDrawerOpen(true);
    } else {
      setFacilityIdToEdit('');
      setFacilityUnits([]);
      setFacilityUnitsPaginationInfo({
        currentPage: 0,
        perPage: isSmallScreenSzie
          ? DEFAULT_PAGE_SIZE.MOBILE
          : DEFAULT_PAGE_SIZE.DESKTOP,
        totalItems: 0,
        totalPages: 0
      });
    }
    setIsLoading(false);
  };

  const onCloseUnitsDrawer = () => {
    unitSearchInputRef.resetFields();
    setFacilityIdToEdit('');
    setFacilityUnits([]);
    setUpdatedFacilityUnits({});
    setFacilityUnitFilters({
      unit: '',
      currentPage: 1,
      perPage: isSmallScreenSzie
        ? DEFAULT_PAGE_SIZE.MOBILE
        : DEFAULT_PAGE_SIZE.DESKTOP,
      facilityId: ''
    });
    setFacilityUnitsPaginationInfo({
      perPage: isSmallScreenSzie
        ? DEFAULT_PAGE_SIZE.MOBILE
        : DEFAULT_PAGE_SIZE.DESKTOP,
      currentPage: 0,
      totalItems: 0,
      totalPages: 0
    });
    setUnitsDrawerOpen(false);
  };

  const onChangeUnitsMainSelectionBox = (value: boolean, type: string) => {
    let filteredUnits = facilityUnits.map((unit: any) => {
      unit[type] = value;

      return unit;
    });
    let updatedFilteredUnits: any = { ...updatedFacilityUnits };
    for (const unit of facilityUnits) {
      let isCart =
        type === 'isCart'
          ? value
          : updatedFacilityUnits?.[unit?.facilityUnitId]
            ? updatedFacilityUnits?.[unit?.facilityUnitId]?.isCart
            : unit?.isCart;
      let isHnP =
        type === 'isHnP'
          ? value
          : updatedFacilityUnits?.[unit?.facilityUnitId]
            ? updatedFacilityUnits?.[unit?.facilityUnitId]?.isHnP
            : unit?.isHnP;
      updatedFilteredUnits[unit?.facilityUnitId] = {
        facilityUnitId: unit?.facilityUnitId,
        isCart,
        isHnP
      };
    }
    setUpdatedFacilityUnits(updatedFilteredUnits);
    setFacilityUnits(filteredUnits);
  };

  const onChangeSingleUnitSelectionBox = (
    facilityUnitId: string,
    value: boolean,
    type: string
  ) => {
    let filteredUnits = facilityUnits.map((unit: any) => {
      if (unit?.facilityUnitId === facilityUnitId) {
        unit[type] = value;
      }

      return unit;
    });
    let copiedUpdatedUnits = { ...updatedFacilityUnits };
    let existingUnit = facilityUnits.find((unit: any) => {
      return unit?.facilityUnitId === facilityUnitId;
    });
    let isCart =
      type === 'isCart'
        ? value
        : updatedFacilityUnits?.[facilityUnitId]
          ? updatedFacilityUnits?.[facilityUnitId]?.isCart
          : existingUnit?.isCart;
    let isHnP =
      type === 'isHnP'
        ? value
        : updatedFacilityUnits?.[facilityUnitId]
          ? updatedFacilityUnits?.[facilityUnitId]?.isHnP
          : existingUnit?.isHnP;
    copiedUpdatedUnits[facilityUnitId] = {
      facilityUnitId,
      isCart,
      isHnP
    };
    setUpdatedFacilityUnits(copiedUpdatedUnits);
    setFacilityUnits(filteredUnits);
  };

  const onUnitsPaginationChange = async (
    currentPage: number,
    perPage: number
  ) => {
    let filters = {
      ...facilityUnitFilters,
      currentPage,
      perPage
    };
    setFacilityUnitsPaginationInfo((currentInfo: any) => ({
      ...currentInfo,
      perPage,
      currentPage
    }));
    setFacilityUnitFilters(filters);
    await getFacilityUnits(filters);
  };

  const onSaveChangedUnits = async () => {
    if (Object.keys(updatedFacilityUnits)?.length === 0) {
      onCloseUnitsDrawer();

      return;
    }
    setIsLoading(true);
    let changedUnits = [...Object.values(updatedFacilityUnits)];
    changedUnits = changedUnits.map((unit: any) => {
      return {
        ...unit,
        isCart: unit?.isCart ? 1 : 0,
        isHnP: unit?.isHnP ? 1 : 0
      };
    });
    const updatedUnits = await updateData(
      `${API_BASE_URL}${FACILITIES_UNIT_URL}`,
      { units: changedUnits }
    );
    if (updatedUnits?.status === 'success') {
      onCloseUnitsDrawer();
    }
    setIsLoading(false);
  };

  let facilityColumns: any[] = [
    {
      title: 'Facility',
      dataIndex: 'facilityName',
      key: 'name'
    },
    admin?.rbac?.facilityUnits !== PERMISSIONS_TYPES.HIDE && {
      title: 'Units',
      key: 'units',
      render: (value: any) =>
        value?.unitsCount ? (
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.06)',
              padding: `${pxToRem(2)} ${pxToRem(5)} ${pxToRem(2)} ${pxToRem(5)}`,
              borderRadius: pxToRem(12),
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              justifyContent: 'center',
              width: 'fit-content'
            }}
            onClick={() => onClickEditFacilityUnits(value?.facilityId)}
          >
            <Typography.Text style={{ fontSize: pxToRem(12) }}>
              {value?.unitsCount}
            </Typography.Text>
            {admin?.rbac?.facilityUnits === PERMISSIONS_TYPES.WRITE && (
              <Image
                style={{ marginLeft: pxToRem(5) }}
                src={EditOutlinedIcon}
                alt={'No Messsage'}
              ></Image>
            )}
          </div>
        ) : (
          <Typography.Text>-</Typography.Text>
        )
    },

    {
      title: 'Address',
      key: 'address',
      render: (value: any) => (value.address ? value.address : '-')
    },
    {
      title: 'Population',
      key: 'population',
      render: (value: any) => <div>{value.population?.toLocaleString()}</div>
    },
    {
      title: 'Launch Date',
      key: 'launchDate',
      render: (value: any) => {
        return (
          <Typography.Text>
            {value.launchDate
              ? `${getFormattedDateNoTimeZone({ date: value.launchDate, format: DATE_FORMATS.MDY })}`
              : ''}
          </Typography.Text>
        );
      }
    },
    {
      title: 'FCH Staff',
      key: 'staff',
      render: (value: any) => <div>{value.staffCount?.toLocaleString()}</div>
    }
  ];

  admin.rbac.facilities === PERMISSION_TYPES_BACKEND.WRITE &&
    facilityColumns.push({
      title: '',
      key: 'action',
      align: 'center',
      render: (value: any) => (
        <Dropdown
          placement={'bottomRight'}
          trigger={['click']}
          key={value}
          menu={{
            items: [
              {
                key: 1,
                label: 'Edit',
                onClick: () => {
                  editFacility(value);
                }
              }
            ]
          }}
        >
          <VsButton
            antButtonProps={{
              icon: <MoreOutlined style={TABLE_BUTTON_ICON_SIZE} />
            }}
            size={BUTTON_SIZES.squareIcon}
            style={TABLE_BUTTON_STYLE}
          />
        </Dropdown>
      )
    });

  return (
    <div>
      {admin.rbac.facilities !== PERMISSION_TYPES_BACKEND.HIDE && (
        <FacilitiesLayout
          isLoading={isLoading}
          tableColumns={facilityColumns.filter(col => col)}
          tableData={facilities}
          handleFilterInput={handleFilterInput}
          facilityFormRef={formRef}
          handleFacilityFormSubmit={onSubmitFacilityForm}
          modalTitle={facilityToEdit ? 'Edit Facility' : 'Add New Facility'}
          addFacilityModal={showModal}
          addFacilityModalOpen={setShowModal}
          tableLoading={isLoading}
          facilityExists={facilities}
          facilityToEdit={facilityToEdit}
          unitsDrawerOpen={unitsDrawerOpen}
          onCloseUnitsDrawer={onCloseUnitsDrawer}
          facilityUnits={facilityUnits}
          facilityIdToEdit={facilityIdToEdit}
          onChangeUnitsMainSelectionBox={onChangeUnitsMainSelectionBox}
          onChangeSingleUnitSelectionBox={onChangeSingleUnitSelectionBox}
          handleUnitsFilterInput={handleUnitsFilterInput}
          unitsPaginationInfo={facilityUnitsPaginationInfo}
          onUnitsPaginationChange={onUnitsPaginationChange}
          onSaveChangedUnits={onSaveChangedUnits}
          updatedFacilityUnits={updatedFacilityUnits}
          unitSearchInputRef={unitSearchInputRef}
          onCancelFacilitiesModal={onCancelFacilityForm}
        />
      )}
    </div>
  );
};
