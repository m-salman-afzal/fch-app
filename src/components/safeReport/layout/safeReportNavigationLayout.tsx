import { PropsWithChildren } from 'react';
import { Grid } from 'antd';

import useCookies from '@/hooks/useCookies';
import { PERMISSIONS_TYPES, SAFE_REPORT_SCREENS } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import VsSegmented from '../../common/segmented/VsSegmented';

interface props {
  onChangeScreen: (e: any) => void;
  onScreen: string;
}

const { useBreakpoint } = Grid;

export const SafeReportNavigationLayout: React.FC<PropsWithChildren<props>> = ({
  onChangeScreen,
  onScreen,
  children
}) => {
  const size = useBreakpoint();
  const { getDataFromCookie } = useCookies();
  const admin = getDataFromCookie();

  const segments = [];
  (admin.rbac.reports !== PERMISSIONS_TYPES.HIDE ||
    admin.rbac.reportHistory !== PERMISSIONS_TYPES.HIDE) &&
    segments.push({
      label: Object.values(SAFE_REPORT_SCREENS)[0],
      value: 'reportHistory',
      key: 'reportHistory'
    });

  (admin.rbac.safeReportInvestigations !== PERMISSIONS_TYPES.HIDE ||
    admin.rbac.safeReportReviews !== PERMISSIONS_TYPES.HIDE) &&
    segments.push({
      label: Object.values(SAFE_REPORT_SCREENS)[1],
      value: 'investigationReview',
      key: 'investigationReview'
    });

  return (
    <div
      style={{
        width: '50%',
        flex: size.xs ? '0 0 90%' : '0 0 50%'
      }}
    >
      <VsSegmented
        segmentedProps={{
          options: segments,
          block: true,
          value: onScreen,
          onChange: onChangeScreen,
          style: {
            maxWidth: segments.length === 1 ? pxToRem(160) : pxToRem(327)
          }
        }}
      />
      {children}
    </div>
  );
};
