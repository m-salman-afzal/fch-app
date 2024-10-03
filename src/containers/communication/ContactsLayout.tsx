import { FC } from 'react';
import { FormInstance } from 'antd';

import { TPagination } from '@/types/commonTypes';

import { ContactsTable } from '@/components/communication/contactsTable';
import { CommunicationFilter } from '@/components/communication/filters/contactsFilter';
import { getContactsColumns } from '@/components/communication/getContactsColumnts';
import { ContactFormModal } from '@/components/communication/modals/contactModal';
import { useContactsTableStyle } from '@/components/communication/useContactsTableStyle';

import { COMMUNICATION_SCREENS, CONTACT_TYPES } from '@/utils/constants';

interface Props {
  contactModalOpen: boolean;
  contactIdToEdit: string;
  tableData: any[];
  setTableData: (val: any[]) => void;
  filterFormRef: FormInstance;
  contactFormRef: FormInstance;
  setFilterOpen: (val: any) => void;
  filterOpen: boolean;
  searchText: string;
  permission: string;
  admins: any[];
  facilities: any[];
  reportTypes: any[];
  getAllCrons: (type: any) => void;
  getContacts: (
    val: any,
    pagination: TPagination | undefined,
    searchText: string
  ) => Promise<void>;
  showMoreFacility: (val: any) => void;
  showMoreReports: (val: any) => void;
  editContact: (val: any) => void;
  onClickDelete: (val: any) => void;
  onSubmitCronContactForm: (val: any) => Promise<boolean>;
  onCancelContactForm: (val: any) => void;
  onSelectName: (val: any, options: any) => void;
  searchFilters: any;
  setSearchFilters: (val: any) => void;
  isLoading: boolean;
  contactFormFacilities: any[];
  selectedScreen: string;
  pagination: TPagination | undefined;
  onChangePagination: (pageNumber: number, pageSize: number) => void;
  onSubmitContactForm: (data: any) => void;
  onFilterSubmit: (data: any) => void;
}

export const ContactsLayout: FC<Props> = ({
  selectedScreen,
  contactModalOpen,
  contactIdToEdit,
  tableData,
  filterOpen,
  setFilterOpen,
  filterFormRef,
  contactFormRef,
  permission,
  admins,
  facilities,
  reportTypes,
  showMoreFacility,
  showMoreReports,
  editContact,
  onClickDelete,
  onCancelContactForm,
  onSelectName,
  searchFilters,
  isLoading,
  contactFormFacilities,
  pagination,
  onChangePagination,
  onSubmitContactForm,
  onFilterSubmit
}) => {
  const columns = getContactsColumns(
    editContact,
    onClickDelete,
    permission,
    showMoreFacility,
    showMoreReports,
    searchFilters
  );

  return (
    <div>
      <ContactsTable
        useTableStyle={useContactsTableStyle}
        tableColumns={columns}
        tableData={tableData}
        pagination={pagination}
        isLoading={isLoading}
        onChangePagination={onChangePagination}
      />
      <ContactFormModal
        isLoading={isLoading}
        type={
          selectedScreen === COMMUNICATION_SCREENS[0].value
            ? CONTACT_TYPES.INTERNAL
            : CONTACT_TYPES.EXTERNAL
        }
        action={contactIdToEdit ? 'Edit' : 'Add'}
        setOpen={onCancelContactForm}
        open={contactModalOpen}
        facilites={
          selectedScreen === COMMUNICATION_SCREENS[0].value
            ? contactFormFacilities
            : facilities
        }
        reports={reportTypes}
        handleContactFormSubmit={onSubmitContactForm}
        contactFormRef={contactFormRef}
        admins={admins}
        onSelectName={onSelectName}
      />
      <CommunicationFilter
        filterOpen={filterOpen}
        setFilerOpen={() => setFilterOpen((x: any) => !x)}
        handleReset={() => {
          filterFormRef.resetFields();
        }}
        onClickApply={onFilterSubmit}
        filterFormRef={filterFormRef}
        facilities={facilities}
        reports={reportTypes}
      />
    </div>
  );
};
