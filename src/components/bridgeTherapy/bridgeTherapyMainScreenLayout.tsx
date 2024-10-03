import { ChangeEvent, FC, PropsWithChildren } from 'react';
import { FormInstance } from 'antd';

import { Patient } from '@/types/patientTypes';

import { pxToRem } from '@/utils/sharedUtils';

import { BridgeTherapyNavigation } from './nav/bridgeTherapyNavigation';

interface Props {
  setFilterOpen: (val: any) => void;
  setSelectedScreen: (val: string) => void;
  setSearchValue: (e: ChangeEvent<HTMLInputElement>) => void;
  setSearchValueReset: (val: string) => void;
  setSort: (val: string) => void;
  onAddToSFTPList: () => void;
  showTableActions: boolean;
  onScreen: string;
  selectedRows: {
    key: React.Key[];
    rows: Patient[];
  };
}

export const BridgeTherapyMainScreenLayout: FC<PropsWithChildren<Props>> = ({
  setSearchValue,
  setSearchValueReset,
  setFilterOpen,
  setSort,
  setSelectedScreen,
  children,
  onAddToSFTPList,
  showTableActions,
  selectedRows,
  onScreen
}) => {
  return (
    <div>
      <BridgeTherapyNavigation
        onAddToSFTPList={onAddToSFTPList}
        showTableActions={selectedRows}
        setSearchValue={setSearchValue}
        setSearchValueReset={setSearchValueReset}
        setSort={setSort}
        setFilterOpen={setFilterOpen}
        setSelectedScreen={setSelectedScreen}
        onScreen={onScreen}
      />
      <div style={{ marginTop: pxToRem(16) }}>{children}</div>
    </div>
  );
};
