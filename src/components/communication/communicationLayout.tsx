import { FC, PropsWithChildren } from 'react';
import { FormInstance } from 'antd/es/form/hooks/useForm';

import { pxToRem } from '@/utils/sharedUtils';

import { CommunicationNavigation } from './nav/communicationNavigation';

interface Props {
  setContactModalOpen: (val: boolean) => void;
  setFilterOpen: (val: any) => void;
  handleFilterInput: (val: string) => void;
  filterFormRef: FormInstance;
  searchFilters: any;
  setSearchFilters: (val: any) => void;
  onChangeScreen: (screen: string) => void;
  selectedScreen: string;
}

export const CommunicationLayout: FC<PropsWithChildren<Props>> = ({
  setFilterOpen,
  setContactModalOpen,
  handleFilterInput,
  filterFormRef,
  searchFilters,
  setSearchFilters,
  onChangeScreen,
  children,
  selectedScreen
}) => {
  return (
    <div>
      <CommunicationNavigation
        contactModalOpen={setContactModalOpen}
        setFilterOpen={setFilterOpen}
        handleFilterInput={handleFilterInput}
        filterFormRef={filterFormRef}
        searchFilters={searchFilters}
        setSearchFilters={setSearchFilters}
        onChangeScreen={onChangeScreen}
        selectedScreen={selectedScreen}
      />
      <div style={{ marginTop: pxToRem(16) }}>{children}</div>
    </div>
  );
};
