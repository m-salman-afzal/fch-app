import { useEffect, useState } from 'react';
import { Col, Form, Grid, Row, Select, Tabs, Typography } from 'antd';
import { VsSelect, VsSelectFormItem } from 'vs-design-components';

import { Admin } from '@/types/adminTypes';
import { TPagination } from '@/types/commonTypes';
import {
  TFacilityCheckList,
  TFacilityChecklistForm,
  TFacilityCheckListIndexable,
  TSelectedAdmin
} from '@/types/facilityCheckListTypes';

import { getFacilityChecklistTabs } from '@/components/facilityChecklist/getFacilityChecklistTabs';
import FaciltyChecklistLayout from '@/components/facilityChecklist/layout/facilityChecklistLayout';
import { useFacilityClLayoutStyle } from '@/components/facilityChecklist/layout/useFacilityClLayoutStyle';

import { useFacility } from '@/hooks/useFacility';
import { useFetch } from '@/hooks/useFetch';
import { FACILITY_CHECKLIST_EVENT_PRIORITIES } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';
import {
  API_BASE_URL,
  BRIDGE_THERAPY,
  FACILITY_CHECKLIST_URL
} from '@/utils/urls';

export const FACILITY_CHECKLIST_TABS = {
  BRIDGE_THERAPY: 'BRIDGE_THERAPY',
  EXTERNAL_FACILITY_ID: 'EXTERNAL_FACILITY_ID',
  SAFE_AND_ISSUE: 'SAFE_AND_ISSUE'
};

const { useBreakpoint } = Grid;

const FacilityChecklistContainer: React.FC = () => {
  const { fetchData, postData } = useFetch();
  const size = useBreakpoint();
  const { currentFacility } = useFacility();
  const [facilityCheckListForm] = Form.useForm<TFacilityCheckListIndexable>();
  const [externalFacilityIdForm] = Form.useForm();
  const [bridgeTherapyForm] = Form.useForm();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [externalFacilityId, setExternalFacilityId] = useState<string>('');
  const [supplyDays, setSupplyDays] = useState<number | null>(null);
  const [selectedAdmins, setSelectedAdmins] = useState<TSelectedAdmin[]>([]);
  const [isFetched, setIsFetched] = useState(false);
  const [selectedTab, setSelectedTab] = useState(
    FACILITY_CHECKLIST_TABS.BRIDGE_THERAPY
  );
  const { tabStyle } = useFacilityClLayoutStyle();
  const getCurrentChecklist = async () => {
    try {
      const url = `${API_BASE_URL}${FACILITY_CHECKLIST_URL}/`;
      const tempData = await fetchData(url);

      const tempList = tempData.facilityChecklist;

      setExternalFacilityId(tempData.externalFacilityId);
      setSupplyDays(tempData.supplyDays);
      if (tempList) {
        setSelectedAdmins(
          tempList.map((list: TFacilityCheckList) => ({
            label: `${list.admin?.lastName}, ${list.admin?.firstName}`,
            value: list.adminId,
            key: list.adminId,
            event: list.event,
            roleServiceList: list.roleServiceList
          }))
        );
        tempList.forEach((list: TFacilityCheckList) =>
          facilityCheckListForm.setFieldValue(list.event, list.adminId)
        );
      }

      setIsFetched(true);
    } catch (error) {
      setIsFetched(true);
    }
  };

  const saveExternalFacilityId = async (data: any) => {
    try {
      setIsSubmitLoading(true);
      const url = `${API_BASE_URL}${FACILITY_CHECKLIST_URL}/`;
      const res = await postData(url, {
        externalFacilityId: data.externalFacilityId
      });

      if (res.externalFacilityId) {
        setExternalFacilityId(res.externalFacilityId);
      }

      setIsSubmitLoading(false);
    } catch (error) {
      setIsSubmitLoading(false);
    }
  };

  const saveSupplyDays = async (data: any) => {
    try {
      setIsSubmitLoading(true);
      const url = `${API_BASE_URL}${FACILITY_CHECKLIST_URL}/`;
      const res = await postData(url, {
        supplyDays: data.supplyDays
      });

      if (res.supplyDays) {
        setSupplyDays(res.supplyDays);
      }

      setIsSubmitLoading(false);
    } catch (error) {
      setIsSubmitLoading(false);
    }
  };

  const saveChecklist = async (values: TFacilityCheckListIndexable) => {
    try {
      setIsSubmitLoading(true);
      const keys = Object.keys(values);
      const mappedData = keys.map(key => ({
        event: key,
        adminId: values[key],
        facilityId: currentFacility.facilityId,
        priority: FACILITY_CHECKLIST_EVENT_PRIORITIES[key] ?? undefined
      }));
      const url = `${API_BASE_URL}${FACILITY_CHECKLIST_URL}/`;
      const tempList = await postData(url, {
        facilityChecklist: [...mappedData],
        externalFacilityId: values.externalFacilityId
          ? values.externalFacilityId
          : ''
      });
      if (tempList?.length > 0) {
        await getCurrentChecklist();
      }
      setIsSubmitLoading(false);
    } catch (error) {
      setIsSubmitLoading(false);
    }
  };

  const getAdminUserOptions = async (
    pagination: TPagination,
    search?: string
  ) => {
    const url = `${API_BASE_URL}${FACILITY_CHECKLIST_URL}/suggestion`;
    const suggestionList = await fetchData(url, {
      ...pagination,
      text: search
    });

    if (!suggestionList.rows) {
      return false;
    }

    return {
      paginationInfo: suggestionList.paginationInfo,
      adminList: suggestionList.rows.map(
        (admin: Admin & { roleServiceList: any[] }) => ({
          key: admin.adminId,
          label: `${admin?.lastName}, ${admin?.firstName} `,
          value: admin.adminId,
          roleServiceList: admin.roleServiceList
        })
      )
    };
  };
  useEffect(() => {
    getCurrentChecklist();
  }, []);

  const tabs = getFacilityChecklistTabs(
    selectedTab,
    selectedAdmins,
    externalFacilityId,
    supplyDays,
    isFetched
  );

  return (
    <>
      <style jsx global>
        {`
          .ant-layout-content {
            @media screen and (min-width: 577px) {
              padding-inline-end: 0 !important;
            }
          }
        `}
      </style>
      <Row
        gutter={[16, 16]}
        style={{
          height: '100vh',
          paddingBlock: pxToRem(12)
        }}
      >
        {size.xs && (
          <Col span={24} style={{ paddingInline: pxToRem(20) }}>
            <Typography.Title
              style={{
                marginBlock: 0,
                marginInline: 0,
                fontSize: pxToRem(16),
                fontWeight: 600,
                lineHeight: pxToRem(24)
              }}
            >
              Facility Checklist
            </Typography.Title>
          </Col>
        )}
        <Col
          span={size.xs ? 24 : undefined}
          style={size.xs ? { paddingInline: pxToRem(20) } : {}}
        >
          {size.xs ? (
            <VsSelectFormItem
              defaultValue={FACILITY_CHECKLIST_TABS.BRIDGE_THERAPY}
              formItemProps={{ noStyle: true }}
              onChange={setSelectedTab}
              value={selectedTab}
              externalShowLabel={false}
              options={[
                {
                  value: FACILITY_CHECKLIST_TABS.BRIDGE_THERAPY,
                  label: 'Bridge Therapy'
                },
                {
                  value: FACILITY_CHECKLIST_TABS.EXTERNAL_FACILITY_ID,
                  label: 'External Facility ID'
                },
                {
                  value: FACILITY_CHECKLIST_TABS.SAFE_AND_ISSUE,
                  label: 'SAFE & Issue Report Investigation'
                }
              ]}
            />
          ) : (
            <Tabs
              tabPosition="left"
              items={tabs}
              tabBarStyle={{
                background: '#fff',
                paddingBlock: pxToRem(10),
                paddingInlineStart: pxToRem(13),
                borderTopLeftRadius: pxToRem(8),
                borderBottomLeftRadius: pxToRem(8),
                width: pxToRem(290),
                height: 'max-content'
              }}
              className={tabStyle}
              onChange={setSelectedTab}
              activeKey={selectedTab}
            />
          )}
        </Col>
        <Col span={size.xs ? 24 : undefined}>
          <FaciltyChecklistLayout
            externalFacilityIdForm={externalFacilityIdForm}
            bridgeTherapyForm={bridgeTherapyForm}
            selectedTab={selectedTab}
            isLoading={isSubmitLoading}
            selectedAdmins={selectedAdmins}
            saveExternalFacilityId={saveExternalFacilityId}
            saveSupplyDays={saveSupplyDays}
            supplyDays={supplyDays}
            saveChecklist={saveChecklist}
            facilityChecklistForm={facilityCheckListForm}
            getAdminUserOptions={getAdminUserOptions}
            externalFacilityId={externalFacilityId}
          />
        </Col>
      </Row>
    </>
  );
};

export default FacilityChecklistContainer;
