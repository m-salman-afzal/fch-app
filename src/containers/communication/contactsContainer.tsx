import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { current } from '@reduxjs/toolkit';
import { Form, FormInstance, Tooltip, Typography } from 'antd';
import Image from 'next/image';
import { useConfirm } from 'vs-design-components';

import { TPagination } from '@/types/commonTypes';
import { TCommuncationFilters } from '@/types/communicationTypes';

import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';
import FilterTags from '@/components/common/filterTags/filterTags';

import DELETEICON from '@/assets/icons/common/deleteModal.svg';
import { useFetch } from '@/hooks/useFetch';
import { useCommonStyles } from '@/styles/useCommonStyles';
import {
  ALL,
  ALL_OPTION,
  COMMUNICATION_SCREENS,
  CONTACT_TYPES,
  PROCESS_TYPES,
  TOAST_DURATION,
  TOAST_GENERIC_ERROR_MESSAGE
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';
import ShowToast from '@/utils/showToast';
import { ADMIN_URL, API_BASE_URL, COMMUNICATION_URL } from '@/utils/urls';

import { ContactsLayout } from './ContactsLayout';

interface Props {
  selectedScreen: string;
  contactModalOpen: boolean;
  setContactModalOpen: (val: boolean) => void;
  filterOpen: boolean;
  setFilterOpen: (val: any) => void;
  filterFormRef: FormInstance;
  searchText: string;
  permission: string;
  searchFilters: any;
  setSearchFilters: (val: any) => void;
  pagination: TPagination | undefined;
  tableData: any[];
  adminsList: any[];
  admins: any[];
  facilities: any[];
  reportTypes: any[];
  getContacts: (
    searchFilters: any,
    pagination: TPagination | undefined,
    searchText: string
  ) => Promise<void>;

  setTableData: Dispatch<SetStateAction<any[]>>;
  setReportTypes: Dispatch<SetStateAction<any[]>>;
  fetchInstance: any;
}
const filterInitialValue = {
  searchText: ALL,
  facilityId: ALL,
  processId: ALL
} as const;
export const ContactsContainer: FC<Props> = ({
  selectedScreen,
  contactModalOpen,
  setContactModalOpen,
  filterOpen,
  setFilterOpen,
  filterFormRef,
  searchText,
  permission,
  searchFilters,
  setSearchFilters,
  pagination,
  admins,
  adminsList,
  facilities,
  reportTypes,
  tableData,
  getContacts,
  setTableData,
  setReportTypes,
  fetchInstance
}) => {
  const {
    fetchData,
    deleteData,
    setIsLoading,
    postData,
    updateData,
    isLoading
  } = fetchInstance;

  const {
    deleteFamilyMemberConfirmIcon,
    deleteFamilyMemberConfirmIconContainer
  } = useCommonStyles();
  const [contactFormRef] = Form.useForm();
  const [contactIdToEdit, setContactIdToEdit] = useState<any>(null);
  const [contactFormFacilities, setContactFormFacilities] = useState<any[]>([]);
  const { confirm } = useConfirm();

  const addCronContact = async (contactData: any) => {
    setIsLoading(true);

    const savedContact: any = await postData(
      `${API_BASE_URL}${COMMUNICATION_URL}/add`,
      contactData
    );

    if (savedContact?.status !== 'error') {
      await getContacts(searchFilters, pagination, searchText);
      onCancelContactForm();
    } else {
      onCancelContactForm();
      ShowToast('Contact already exists', 'error', 5);
    }
    setIsLoading(false);

    return true;
  };

  const updateContact = async (contactData: any) => {
    setIsLoading(true);

    contactData.facilityId = contactData.facilityId.map(
      (fac: any) => fac.value ?? fac
    );

    contactData.processId = contactData.processId.map(
      (proc: any) => proc.value ?? proc
    );
    const updatedContact: any = await updateData(
      `${API_BASE_URL}${COMMUNICATION_URL}/edit/${contactIdToEdit}`,
      contactData
    );

    if (!(updatedContact.status === 'error')) {
      setUpdatedContactInDom(updatedContact);
      onCancelContactForm();
    } else {
      ShowToast('Contact already exists', 'error', 5);
      onCancelContactForm();
    }
    setIsLoading(false);

    return true;
  };

  const onSelectName = (value: any, option: any) => {
    const selectedAdmin = adminsList.filter(
      (admin: any) => admin.adminId === value
    )[0];

    const some = [
      ALL_OPTION,
      ...selectedAdmin.facility.map((fa: any) => {
        return {
          label: fa.facilityName,
          value: fa.facilityId,
          key: fa.facilityId
        };
      })
    ];
    setContactFormFacilities(some);
    contactFormRef.setFieldsValue({ facilityId: undefined });

    contactFormRef.setFieldsValue({ email: selectedAdmin.email });
  };

  const editContact = async (contactData: any) => {
    let { firstName, lastName, email, type, facility, contactId, adminId } =
      contactData;

    setContactModalOpen(true);
    setContactIdToEdit(contactId);

    if (adminId) {
      const admin = await fetchData(`${API_BASE_URL}${ADMIN_URL}`, {
        email
      });

      setContactFormFacilities([
        ALL_OPTION,
        ...admin[0].facility.map((fa: any) => {
          return {
            label: fa.facilityName,
            value: fa.facilityId,
            key: fa.facilityId
          };
        })
      ]);
    }

    const valsF = facility?.map((fa: any) => {
      return {
        label: fa.facilityName,
        value: fa.facilityId,
        key: fa.facilityId
      };
    });

    const valsP = contactData.process?.map((p: any) => {
      return {
        label: p.processName,
        value: p.processId,
        key: p.processId
      };
    });

    contactFormRef.setFieldsValue({
      email,
      type,
      facilityId: valsF,
      processId: valsP
    });

    type === 'INTERNAL'
      ? contactFormRef.setFieldValue('contactName', `${lastName}, ${firstName}`)
      : contactFormRef.setFieldsValue({
          firstName,
          lastName
        });
  };

  const showMoreFacility = (facilities: any[]) => {
    if (facilities.length > 1) {
      const facilityList = facilities?.toSpliced(0, 1).map(i => i.facilityName);
      const htmlContent = (
        <div>
          {facilityList.map((item, index) => {
            return (
              <span key={index} style={{ display: 'flex' }}>{`${
                index + 1
              }. ${item}`}</span>
            );
          })}
        </div>
      );

      return (
        <Tooltip title={htmlContent}>
          {' '}
          <ColorfulPill
            style={{ marginLeft: pxToRem(10) }}
            text={`+${facilityList.length}`}
          />
        </Tooltip>
      );
    }

    return null;
  };

  const showMoreReports = (reports: any[]) => {
    if (reports.length > 1) {
      const facilityList = reports?.toSpliced(0, 1).map(i => i.processName);
      const htmlContent = (
        <div>
          {facilityList.map((item, index) => {
            return (
              <span key={index} style={{ display: 'flex' }}>{`${
                index + 1
              }. ${item}`}</span>
            );
          })}
        </div>
      );

      return (
        <Tooltip title={htmlContent}>
          {' '}
          <ColorfulPill
            style={{ marginLeft: pxToRem(10) }}
            text={`+${facilityList.length}`}
          />
        </Tooltip>
      );
    }

    return null;
  };

  const onCancelContactForm = () => {
    setContactModalOpen(false);
    contactFormRef.resetFields();
    setContactIdToEdit(null);
    // setAdmins([]);
  };

  const onSubmitCronContactForm = async (contactData: any) => {
    if (contactData.type === CONTACT_TYPES.INTERNAL.toUpperCase()) {
      contactData.adminId = contactIdToEdit
        ? contactData.adminId
        : contactData.contactName;
      contactData.contactName = undefined;
      contactData.email = undefined;
    }

    if (contactIdToEdit) {
      return await updateContact(contactData);
    }

    return await addCronContact(contactData);
  };

  const getAllCrons = async (type: string) => {
    setIsLoading(true);
    const allCrons = await fetchData(
      `${API_BASE_URL}${COMMUNICATION_URL}/getProcess`
    );

    if (allCrons?.length > 0) {
      setReportTypes(() => {
        return [
          ...allCrons
            .filter((item: any) => {
              return (
                (item.method === PROCESS_TYPES.REPORT && item.type === type) ||
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
      });
    } else {
      setReportTypes([]);
    }
    setIsLoading(false);
  };

  const onChangeFilters = (values: TCommuncationFilters) => {
    setSearchFilters(values);
    getContacts(values, pagination, searchText);
  };

  const onSubmitContactForm = async (data: any) => {
    await onSubmitCronContactForm({
      ...data,
      type:
        selectedScreen === COMMUNICATION_SCREENS[0]?.value
          ? CONTACT_TYPES.INTERNAL.toUpperCase()
          : CONTACT_TYPES.EXTERNAL.toUpperCase()
    });
  };

  const onChangePagination = async (pageNumber: number, pageSize: number) => {
    const newPaginatedData = {
      ...pagination,
      currentPage: pageNumber,
      perPage: pageSize
    };

    await getContacts(searchFilters, newPaginatedData, searchText);
  };

  const onFilterSubmit = async (data: any) => {
    const newSearchFilters = {
      ...searchFilters,
      ...data,
      processId: data.processId === ALL ? undefined : data.processId,
      facilityId: data.facilityId === ALL ? undefined : data.facilityId
    };
    setSearchFilters(newSearchFilters);
    setFilterOpen(false);
    await getContacts(newSearchFilters, pagination, searchText);
  };

  const onClickDelete = (val: any) => {
    let { contactId } = val;
    confirm({
      onOk: async () => {
        const deleteAdmin = await deleteData(
          `${API_BASE_URL}${COMMUNICATION_URL}/remove/${contactId}`
        );
        if (deleteAdmin) {
          setIsLoading(false);
        } else {
          ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);
          setIsLoading(false);
        }
        getContacts(searchFilters, pagination, searchText);
      },
      text: (
        <>
          <Typography.Paragraph
            style={{
              fontSize: pxToRem(20),
              fontWeight: 600,
              textAlign: 'center',
              marginBlockEnd: 0,
              marginBottom: pxToRem(16)
            }}
          >
            Are you sure you want to delete this contact?
          </Typography.Paragraph>
          <Typography.Text
            style={{
              fontSize: pxToRem(14),
              fontWeight: 400,
              color: 'rgba(0, 0, 0, 0.65)',
              marginBlockEnd: 0,
              marginLeft: pxToRem(5)
            }}
          >
            Contact:{' '}
            <span
              style={{
                color: 'rgba(0, 0, 0, 0.88)'
              }}
            >{`${val.lastName}, ${val.firstName}`}</span>
          </Typography.Text>
        </>
      ),
      type: 'destructive',
      okText: 'Yes',
      cancelText: 'No',
      icon: (
        <div className={deleteFamilyMemberConfirmIconContainer}>
          <Image
            className={deleteFamilyMemberConfirmIcon}
            alt={'MSG'}
            fill={true}
            src={DELETEICON}
          />
        </div>
      )
    });
  };

  const setUpdatedContactInDom = (updatedContact: any) => {
    updatedContact.key = updatedContact.contactId;
    updatedContact.facilityIds = updatedContact.facility.map(
      (fac: any) => fac.facilityId
    );
    updatedContact.facilityName = updatedContact.facility.map(
      (fac: any) => fac.facilityName
    );
    updatedContact.process = updatedContact.process.map((process: any) => {
      process.key = process.processId;

      return process;
    });
    let newCronContactsArray: any = [];
    for (const contact of JSON.parse(JSON.stringify(tableData))) {
      if (contact.contactId === updatedContact.contactId) {
        newCronContactsArray.push(updatedContact);
      } else {
        newCronContactsArray.push(contact);
      }
    }
    setTableData(JSON.parse(JSON.stringify(newCronContactsArray)));
  };

  return (
    <>
      <FilterTags<TCommuncationFilters>
        filterForm={filterFormRef}
        filterState={searchFilters}
        filterInitialValues={filterInitialValue}
        onChangeFilters={onChangeFilters}
        marginBottom={0}
        marginTop={0}
        customMapForSelect={{
          facilityId: [ALL_OPTION, ...facilities],
          processId: [ALL_OPTION, ...reportTypes]
        }}
        customKeys={{
          facilityId: 'Facility',
          processId: 'Report'
        }}
        excludeKeys={{
          type: true,
          searchText: true,
          currentPage: true
        }}
      />
      <ContactsLayout
        selectedScreen={selectedScreen}
        isLoading={isLoading}
        contactModalOpen={contactModalOpen}
        contactIdToEdit={contactIdToEdit}
        tableData={tableData}
        setTableData={setTableData}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        filterFormRef={filterFormRef}
        contactFormRef={contactFormRef}
        searchText={searchText}
        permission={permission}
        admins={admins}
        facilities={facilities}
        reportTypes={reportTypes}
        getAllCrons={getAllCrons}
        getContacts={getContacts}
        showMoreFacility={showMoreFacility}
        showMoreReports={showMoreReports}
        editContact={editContact}
        onClickDelete={onClickDelete}
        onSubmitCronContactForm={onSubmitCronContactForm}
        onCancelContactForm={onCancelContactForm}
        onSelectName={onSelectName}
        searchFilters={{
          ...searchFilters,
          type:
            selectedScreen === COMMUNICATION_SCREENS[0]?.value
              ? 'INTERNAL'
              : 'EXTERNAL'
        }}
        setSearchFilters={setSearchFilters}
        contactFormFacilities={contactFormFacilities}
        pagination={pagination}
        onChangePagination={onChangePagination}
        onFilterSubmit={onFilterSubmit}
        onSubmitContactForm={onSubmitContactForm}
      />
    </>
  );
};
