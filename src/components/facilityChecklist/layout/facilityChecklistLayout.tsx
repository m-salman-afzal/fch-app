import { FormInstance, Typography } from 'antd';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { Pagination, SelectOption, TPagination } from '@/types/commonTypes';
import {
  TFacilityCheckList,
  TFacilityChecklistForm,
  TFacilityCheckListIndexable,
  TSelectedAdmin
} from '@/types/facilityCheckListTypes';

import { FACILITY_CHECKLIST_TABS } from '@/containers/facilityChecklist/facilityChecklistContainer';

import { BridgeTherapyForm } from '../forms/bridgeTherapyForm';
import { ExternalFacilityIdForm } from '../forms/externalFacilityIdForm';
import SafeInvestigationForm from '../forms/safeInvestigationForm';
import { useFacilityClLayoutStyle } from './useFacilityClLayoutStyle';

interface props {
  selectedAdmins: TSelectedAdmin[];
  saveChecklist: (values: TFacilityCheckListIndexable) => Promise<void>;
  saveExternalFacilityId: (data: any) => Promise<void>;
  saveSupplyDays: (data: any) => Promise<void>;
  facilityChecklistForm: FormInstance<TFacilityCheckListIndexable>;
  getAdminUserOptions: (pagination: TPagination) => any;
  externalFacilityId: string;
  isLoading: boolean;
  selectedTab: string;
  externalFacilityIdForm: FormInstance;
  bridgeTherapyForm: FormInstance;
  supplyDays: number | null;
}

const FaciltyChecklistLayout: React.FC<props> = ({
  selectedAdmins,
  saveChecklist,
  facilityChecklistForm,
  getAdminUserOptions,
  externalFacilityId,
  isLoading,
  selectedTab,
  externalFacilityIdForm,
  bridgeTherapyForm,
  saveExternalFacilityId,
  supplyDays,
  saveSupplyDays
}) => {
  const { mainContainer, centerAlign } = useFacilityClLayoutStyle();

  let toRender;
  switch (selectedTab) {
    case FACILITY_CHECKLIST_TABS.BRIDGE_THERAPY:
      toRender = (
        <BridgeTherapyForm
          isLoading={isLoading}
          form={bridgeTherapyForm}
          supplyDays={supplyDays}
          onFinish={saveSupplyDays}
        />
      );
      break;
    case FACILITY_CHECKLIST_TABS.EXTERNAL_FACILITY_ID:
      toRender = (
        <ExternalFacilityIdForm
          externalFacilityId={externalFacilityId}
          isLoading={isLoading}
          form={externalFacilityIdForm}
          onFinish={saveExternalFacilityId}
        />
      );
      break;
    case FACILITY_CHECKLIST_TABS.SAFE_AND_ISSUE:
      toRender = (
        <SafeInvestigationForm
          isLoading={isLoading}
          selectedAdmins={selectedAdmins}
          form={facilityChecklistForm}
          onFinish={saveChecklist}
          getAdminUserOptions={getAdminUserOptions}
        />
      );
      break;
  }

  return (
    <div className={centerAlign}>
      <div className={mainContainer}>
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: pxToRem(8),
            paddingBottom: pxToRem(24)
          }}
        >
          {toRender}
        </div>
      </div>
    </div>
  );
};

export default FaciltyChecklistLayout;
