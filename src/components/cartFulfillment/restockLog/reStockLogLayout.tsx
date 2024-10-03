import { FC, PropsWithChildren } from 'react';

import { pxToRem } from '@/utils/sharedUtils';

import { ReStockNavigation } from './reStockNavigation';

interface Props {
  selectedTab: string;
  onChangeTab: (val: any) => void;
  setFilterOpen: (val: any) => void;
  onSearch: (e: any) => void;
}

export const ReStockLogLayout: FC<PropsWithChildren<Props>> = ({
  selectedTab,
  onChangeTab,
  setFilterOpen,
  onSearch,
  children
}) => {
  return (
    <div>
      <ReStockNavigation
        setFilterOpen={setFilterOpen}
        onSearch={onSearch}
        selectedTab={selectedTab}
        onChangeTab={onChangeTab}
      />
      <div>{children}</div>
    </div>
  );
};
