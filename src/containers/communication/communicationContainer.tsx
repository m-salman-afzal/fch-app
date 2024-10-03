'use client';

import { useCallback, useEffect, useState } from 'react';
import { Form } from 'antd';
import debounce from 'lodash.debounce';
import { useRouter, useSearchParams } from 'next/navigation';

import { TPagination } from '@/types/commonTypes';
import { TRequest } from '@/types/fetchTypes';

import { CommunicationLayout } from '@/components/communication/communicationLayout';

import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import {
  ALL,
  ALL_OPTION,
  COMMUNICATION_SCREENS,
  CONTACT_TYPES,
  DEFAULT_PAGE_SIZE,
  PERMISSION_TYPES_BACKEND,
  PROCESS_TYPES
} from '@/utils/constants';
import { getFitlerValuesAndFilterAll } from '@/utils/getFiltersValuesAndFilterAll';
import {
  ADMIN_URL,
  API_BASE_URL,
  COMMUNICATION_URL,
  FACILITIES_URL
} from '@/utils/urls';

import { ContactsContainer } from './contactsContainer';
import { ReportsContainer } from './reportsContainer';

const filterInitialValue = {
  facilityId: ALL,
  processId: ALL
} as const;
export const CommunicationContainer = () => {
  const tabInUrl = useSearchParams().get('tab');
  const router = useRouter();
  const [filterFormRef] = Form.useForm();
  const admin = useCookies().getDataFromCookie();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(
    tabInUrl ? tabInUrl : (COMMUNICATION_SCREENS[0]?.value as string)
  );

  const fetchInstance = useFetch();

  const { fetchData, setIsLoading, fetchMultiple } = fetchInstance;

  const permission = admin.rbac.communication;
  const [searchText, setSearchText] = useState('');
  const handleFilterInput = useCallback(
    debounce(val => {
      if (selectedScreen !== COMMUNICATION_SCREENS[2].value) {
        getContacts(searchFilters, pagination, val);
      }
      setSearchText(val);
    }, 500),
    [selectedScreen]
  );
  const isSmall = window.screen.width <= 576;

  const paginationInitialValues = {
    currentPage: 1,
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  };
  const [searchFilters, setSearchFilters] = useState<any>(filterInitialValue);

  const [pagination, setPagination] = useState<TPagination | undefined>(
    paginationInitialValues
  );

  useEffect(() => {
    setSearchText('');
  }, [selectedScreen]);

  const [tableData, setTableData] = useState<any[]>([]);
  const [adminsList, setAdminsList] = useState<any>([]);
  const [admins, setAdmins] = useState<any>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [reportTypes, setReportTypes] = useState<any[]>([]);

  const mapCronsAfterFetching = (data: any[]) => {
    const contactType =
      selectedScreen === COMMUNICATION_SCREENS[0]?.value
        ? CONTACT_TYPES.INTERNAL.toUpperCase()
        : CONTACT_TYPES.EXTERNAL.toUpperCase();

    return [
      ...data
        .filter((item: any) => {
          return (
            (item.method === PROCESS_TYPES.REPORT &&
              item.type === contactType) ||
            item.type === 'BOTH'
          );
        })
        .map((item: any) => {
          return {
            label: item.processName,
            value: item.processId,
            key: item.processId
          };
        })
    ];
  };

  const getInitialData = async (
    selectedScreen: string,
    isScreenChange?: boolean
  ) => {
    const requestNames = {
      ADMIN: 'admin',
      FACILITIES: 'facilities',
      CRONS: 'crons',
      CONTACTS: 'contacts'
    };

    const adminFacilityRequest = [
      {
        requestName: requestNames.FACILITIES,
        url: `${API_BASE_URL}${FACILITIES_URL}`
      },
      {
        requestName: requestNames.ADMIN,
        url: `${API_BASE_URL}${ADMIN_URL}`
      }
    ];
    const requests: TRequest<any>[] = [
      {
        requestName: requestNames.CRONS,
        url: `${API_BASE_URL}${COMMUNICATION_URL}/getProcess`
      },
      {
        requestName: requestNames.CONTACTS,
        url: `${API_BASE_URL}${COMMUNICATION_URL}`,
        payload: {
          ...paginationInitialValues,
          type:
            selectedScreen === COMMUNICATION_SCREENS[0]?.value
              ? CONTACT_TYPES.INTERNAL.toUpperCase()
              : CONTACT_TYPES.EXTERNAL.toUpperCase()
        }
      }
    ];

    const responses = await fetchMultiple(
      isScreenChange ? requests : [...adminFacilityRequest, ...requests]
    );

    const adminResponse = responses.find(
      res => res.requestName === requestNames.ADMIN
    );
    const facilitiesResponse = responses.find(
      res => res.requestName === requestNames.FACILITIES
    );
    const cronResponse = responses.find(
      res => res.requestName === requestNames.CRONS
    );
    const contactResponse = responses.find(
      res => res.requestName === requestNames.CONTACTS
    );

    if (!isScreenChange) {
      setAdminsList([]);
      setAdmins([]);
      if (adminResponse?.value) {
        setAdminsList(adminResponse.value);
        const filtered = [
          ALL_OPTION,
          ...adminResponse?.value?.map((ad: any) => {
            return {
              label: `${ad.lastName}, ${ad.firstName}`,
              value: ad.adminId,
              key: ad.adminId
            };
          })
        ];
        setAdmins(filtered);
      }

      setFacilities([]);
      if (facilitiesResponse?.value) {
        setFacilities([
          ALL_OPTION,
          ...facilitiesResponse.value.map((fa: any) => {
            return {
              label: fa.facilityName,
              value: fa.facilityId,
              key: fa.facilityId
            };
          })
        ]);
      }
    }

    setReportTypes([]);
    if (cronResponse?.value) {
      setReportTypes(() => {
        return mapCronsAfterFetching(
          cronResponse?.value ? cronResponse.value : []
        );
      });
    }

    setTableData([]);
    setPagination(paginationInitialValues);
    if (contactResponse?.value) {
      setTableData(
        contactResponse.value?.rows?.map((contact: any) => {
          return {
            ...contact,
            key: contact.contactId
          };
        })
      );
      setPagination({
        ...paginationInitialValues,
        ...contactResponse.value.paginationInfo
      });
    }
  };

  const getContacts = async (
    searchFilters: any,
    pagination: TPagination | undefined,
    searchText: string
  ) => {
    setIsLoading(true);

    const { paginationInfo, rows } = await fetchData(
      `${API_BASE_URL}${COMMUNICATION_URL}`,
      {
        ...getFitlerValuesAndFilterAll(searchFilters),
        ...(pagination ?? paginationInitialValues),
        searchText,
        type:
          selectedScreen === COMMUNICATION_SCREENS[0]?.value
            ? CONTACT_TYPES.INTERNAL.toUpperCase()
            : CONTACT_TYPES.EXTERNAL.toUpperCase()
      }
    );
    if (rows && paginationInfo) {
      setTableData(
        rows.map((contact: any) => {
          return {
            ...contact,
            key: contact.contactId
          };
        })
      );
      setPagination({ ...pagination, ...paginationInfo });
      setIsLoading(false);

      return;
    }
    setTableData([]);
    setPagination(undefined);
    setIsLoading(false);
  };

  const onChangeScreen = (screen: string) => {
    if (screen !== COMMUNICATION_SCREENS[2]?.value) {
      setSearchFilters({
        facilityId: '',
        processId: ''
      });
      getInitialData(screen, true);
    }
    setSelectedScreen(screen);
    router.push(`/communication?tab=${screen}`);
  };

  useEffect(() => {
    getInitialData(selectedScreen);
  }, []);

  return (
    <div>
      {permission !== PERMISSION_TYPES_BACKEND.HIDE && (
        <CommunicationLayout
          setFilterOpen={setFilterOpen}
          setContactModalOpen={setContactModalOpen}
          handleFilterInput={handleFilterInput}
          filterFormRef={filterFormRef}
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
          onChangeScreen={onChangeScreen}
          selectedScreen={selectedScreen}
        >
          {selectedScreen === (COMMUNICATION_SCREENS[0].value as string) ||
          selectedScreen === (COMMUNICATION_SCREENS[1].value as string) ? (
            <ContactsContainer
              selectedScreen={selectedScreen}
              filterOpen={filterOpen}
              contactModalOpen={contactModalOpen}
              setContactModalOpen={setContactModalOpen}
              setFilterOpen={setFilterOpen}
              filterFormRef={filterFormRef}
              searchText={searchText}
              permission={permission}
              searchFilters={searchFilters}
              setSearchFilters={setSearchFilters}
              pagination={pagination}
              reportTypes={reportTypes}
              setReportTypes={setReportTypes}
              admins={admins}
              facilities={facilities}
              adminsList={adminsList}
              tableData={tableData}
              setTableData={setTableData}
              getContacts={getContacts}
              fetchInstance={fetchInstance}
            />
          ) : (
            <ReportsContainer searchText={searchText} permission={permission} />
          )}
        </CommunicationLayout>
      )}
    </div>
  );
};
