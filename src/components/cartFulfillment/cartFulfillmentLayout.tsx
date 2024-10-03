import { FC, PropsWithChildren } from 'react';

import { pxToRem } from '@/utils/sharedUtils';

import { CartFulfillmentNavigation } from './cartFulfillmentNavigation';

interface Props {
  selectedScreen: string;
  setSelectedScreen: (val: string) => void;
}

export const CartFulfillmentLayout: FC<PropsWithChildren<Props>> = ({
  selectedScreen,
  setSelectedScreen,
  children
}) => {
  return (
    <div>
      <CartFulfillmentNavigation
        selectedScreen={selectedScreen}
        setSelectedScreen={setSelectedScreen}
      />
      <div style={{ marginTop: pxToRem(16) }}>{children}</div>
    </div>
  );
};
