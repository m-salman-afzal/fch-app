import { FC, PropsWithChildren } from 'react';

import { SelectOption } from '@/types/commonTypes';

import { pxToRem } from '@/utils/sharedUtils';

import { ControlsLogbookNavigation } from './controlsLogbookNavigation';

interface Props {
  selectedScreen: SelectOption;
  onChangeScreen: (val: string) => void;
  controlLogBookScreens: SelectOption[];
}

export const ControlsLogbookLayout: FC<PropsWithChildren<Props>> = ({
  selectedScreen,
  onChangeScreen,
  controlLogBookScreens,
  children
}) => {
  return (
    <div>
      <ControlsLogbookNavigation
        selectedScreen={selectedScreen}
        onChangeScreen={onChangeScreen}
        controlLogBookScreens={controlLogBookScreens}
      />
      <div style={{ marginTop: pxToRem(16) }}>{children}</div>
    </div>
  );
};
