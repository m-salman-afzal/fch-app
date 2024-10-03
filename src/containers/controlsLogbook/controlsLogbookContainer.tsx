'use client';

import { FC, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { SelectOption } from '@/types/commonTypes';
import { TControlLogBookScreenKeys } from '@/types/controlLogbookTypes';

import { CartInventoryContainer } from '@/components/controlsLogbook/cartInventory/cartInventoryContainer';
import { ControlsLogbookLayout } from '@/components/controlsLogbook/controlsLogbookLayout';

import useCookies from '@/hooks/useCookies';
import { PERMISSION_PRIORITY } from '@/utils/constants';

import { ArchiveContainer } from './archiveContainer';
import { CONTROLS_LOGBOOK_SCREENS } from './constants';
import { DiscrepencyLogsContainer } from './discrepencyLogsContainer';
import { PerpetualInventoryContainer } from './perpetualInventoryContainer';
import ShiftCountMainContainer from './shiftCount/mainContainer';

interface Props {}

export const ControlsLogbookContainer: FC<Props> = ({}) => {
  const { getDataFromCookie } = useCookies();

  const admin = getDataFromCookie();

  const getScreensRbac = () => {
    const screens = Object.keys(CONTROLS_LOGBOOK_SCREENS).map(screen => ({
      value: screen,
      label: CONTROLS_LOGBOOK_SCREENS[screen as TControlLogBookScreenKeys],
      key: screen
    }));

    let rbacScreen: SelectOption[] = [];

    if (PERMISSION_PRIORITY[admin?.rbac?.perpetualInventory] <= 2) {
      rbacScreen = [
        screens.find(
          val => val.label === CONTROLS_LOGBOOK_SCREENS.perpetualInventory
        ) as SelectOption
      ];
    }

    if (PERMISSION_PRIORITY[admin?.rbac?.controlLogBookAdminister] <= 2) {
      rbacScreen = [
        ...rbacScreen,
        ...screens.filter(
          val => val.label !== CONTROLS_LOGBOOK_SCREENS.perpetualInventory
        )
      ];
    }

    return rbacScreen;
  };

  const controlLogBookScreens = getScreensRbac();

  const tabInUrl = useSearchParams().get('tab');
  const tabFoundInClbkTabs = controlLogBookScreens.find(
    allTab => allTab.value === tabInUrl
  );
  const router = useRouter();

  const onChangeScreen = (val: string) => {
    setSelectedScreen(
      controlLogBookScreens.find(item => item.value === val) as SelectOption
    );
    router.push(`/controlsLogbook?tab=${val}`);
  };

  const getSelectedScreenWithRbac = () => {
    if (
      tabFoundInClbkTabs &&
      PERMISSION_PRIORITY[admin?.rbac?.controlLogBookAdminister] <= 2 &&
      tabFoundInClbkTabs.label !== CONTROLS_LOGBOOK_SCREENS.perpetualInventory
    ) {
      return tabFoundInClbkTabs;
    }

    if (PERMISSION_PRIORITY[admin?.rbac?.perpetualInventory] <= 2)
      return controlLogBookScreens.find(
        item =>
          item.label === (CONTROLS_LOGBOOK_SCREENS.perpetualInventory as string)
      ) as SelectOption;

    if (PERMISSION_PRIORITY[admin?.rbac?.controlLogBookAdminister] <= 2) {
      return controlLogBookScreens.find(
        item => item.label === (CONTROLS_LOGBOOK_SCREENS.archive as string)
      ) as SelectOption;
    }

    return controlLogBookScreens.find(
      item =>
        item.label === (CONTROLS_LOGBOOK_SCREENS.perpetualInventory as string)
    ) as SelectOption;
  };

  const [selectedScreen, setSelectedScreen] = useState<SelectOption>(
    getSelectedScreenWithRbac()
  );

  return (
    <div>
      <ControlsLogbookLayout
        selectedScreen={selectedScreen}
        onChangeScreen={onChangeScreen}
        controlLogBookScreens={controlLogBookScreens}
      >
        {selectedScreen.label ===
          (CONTROLS_LOGBOOK_SCREENS.perpetualInventory as string) && (
          <PerpetualInventoryContainer />
        )}
        {selectedScreen.label ===
          (CONTROLS_LOGBOOK_SCREENS.archive as string) && <ArchiveContainer />}

        {selectedScreen.label ===
          (CONTROLS_LOGBOOK_SCREENS.discrepancyLogs as string) && (
          <DiscrepencyLogsContainer />
        )}
        {selectedScreen.label ===
          (CONTROLS_LOGBOOK_SCREENS.shiftCount as string) && (
          <ShiftCountMainContainer />
        )}
        {selectedScreen.label ===
          (CONTROLS_LOGBOOK_SCREENS.cartInventory as string) && (
          <CartInventoryContainer />
        )}
      </ControlsLogbookLayout>
    </div>
  );
};
