import { Divider } from 'antd';
import Image from 'next/image';

import type { TSelectedAdmin } from '@/types/facilityCheckListTypes';

import FLAG_FILLED from '@/assets/icons/facilityChecklist/FlagFilled.svg';
import { FACILITY_CHECKLIST_TABS } from '@/containers/facilityChecklist/facilityChecklistContainer';
import { FACILITY_CHECKLIST_ITEMS } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

export const getFacilityChecklistTabs = (
  selectedTab: string,
  selectedAdmins: TSelectedAdmin[],
  externalFacilityId: string,
  supplyDays: number | null,
  isFetched: boolean
) => {
  return [
    {
      label: (
        <div>
          <div
            style={{
              color: 'black',
              fontWeight:
                selectedTab === FACILITY_CHECKLIST_TABS.BRIDGE_THERAPY
                  ? 600
                  : 400,
              width: pxToRem(275),
              height: pxToRem(50),
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'end',
              marginTop: 0
            }}
          >
            <div
              style={{
                background:
                  selectedTab === FACILITY_CHECKLIST_TABS.BRIDGE_THERAPY
                    ? '#E6F4FF'
                    : '#fff',
                padding: pxToRem(14),
                width: '100%',
                textAlign: 'start',
                borderRadius: pxToRem(4),
                display: 'flex',
                alignItems: 'center',
                gap: pxToRem(10)
              }}
            >
              Bridge Therapy
              {!supplyDays && isFetched && (
                <Image src={FLAG_FILLED} width={16} height={16} alt="flag" />
              )}
            </div>
          </div>

          <div
            style={{
              marginInlineStart: pxToRem(10),
              marginInlineEnd: pxToRem(24),
              marginBlock: 0
            }}
          >
            <Divider style={{ marginInlineEnd: pxToRem(24), marginBlock: 0 }} />
          </div>
        </div>
      ),

      key: FACILITY_CHECKLIST_TABS.BRIDGE_THERAPY
    },
    {
      label: (
        <div>
          <div
            style={{
              color: 'black',
              width: pxToRem(275),
              height: pxToRem(50),
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'end',
              marginTop: 0
            }}
          >
            <div
              style={{
                background:
                  selectedTab === FACILITY_CHECKLIST_TABS.EXTERNAL_FACILITY_ID
                    ? '#E6F4FF'
                    : '#fff',
                fontWeight:
                  selectedTab === FACILITY_CHECKLIST_TABS.EXTERNAL_FACILITY_ID
                    ? 600
                    : 400,
                padding: pxToRem(14),
                width: '100%',
                textAlign: 'start',
                borderRadius: pxToRem(4),
                display: 'flex',
                alignItems: 'center',
                gap: pxToRem(10)
              }}
            >
              External Facility ID
              {!externalFacilityId && isFetched && (
                <Image src={FLAG_FILLED} width={16} height={16} alt="flag" />
              )}
            </div>
          </div>

          <div
            style={{
              marginInlineStart: pxToRem(10),
              marginInlineEnd: pxToRem(24),
              marginBlock: 0
            }}
          >
            <Divider style={{ marginInlineEnd: pxToRem(24), marginBlock: 0 }} />
          </div>
        </div>
      ),
      key: FACILITY_CHECKLIST_TABS.EXTERNAL_FACILITY_ID
    },
    {
      label: (
        <div
          style={{
            color: 'black',
            fontWeight:
              selectedTab === FACILITY_CHECKLIST_TABS.SAFE_AND_ISSUE
                ? 600
                : 400,
            width: pxToRem(275),
            height: pxToRem(50),
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'end'
          }}
        >
          <div
            style={{
              background:
                selectedTab === FACILITY_CHECKLIST_TABS.SAFE_AND_ISSUE
                  ? '#E6F4FF'
                  : '#fff',
              padding: pxToRem(14),
              width: '100%',
              textAlign: 'start',
              borderRadius: pxToRem(4),
              display: 'flex',
              alignItems: 'center',
              gap: pxToRem(10)
            }}
          >
            SAFE & Issue Report Investigation
            {selectedAdmins.length !== FACILITY_CHECKLIST_ITEMS.length &&
              isFetched && (
                <Image src={FLAG_FILLED} width={16} height={16} alt="flag" />
              )}
          </div>
        </div>
      ),
      key: FACILITY_CHECKLIST_TABS.SAFE_AND_ISSUE
    }
  ];
};
