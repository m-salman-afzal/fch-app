import { FC } from 'react';

import { TReportData } from '@/types/safeReportTypes';

import ReportDrawer from '@/components/common/reportDrawer/reportDrawer';
import ViewReport from '@/components/investigation/layout/viewReport';

interface Props {
  isEdit: boolean;
  drawerOpen: boolean;
  setDrawerOpen: (val: boolean) => void;
  drawerData: Record<string, any>;
  handleSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export const ReviewHistoryDrawer: FC<Props> = ({
  isEdit,
  drawerOpen,
  setDrawerOpen,
  drawerData,
  isLoading
}) => {
  return (
    <ReportDrawer
      isLoading={isLoading}
      isOpen={drawerOpen}
      commentsArray={drawerData.comment}
      onClickClose={() => {
        setDrawerOpen(false);
      }}
    >
      <div>
        <ViewReport reportData={drawerData as TReportData} />
      </div>
    </ReportDrawer>
  );
};
