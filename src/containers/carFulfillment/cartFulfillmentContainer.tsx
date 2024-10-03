'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { CartFulfillmentLayout } from '@/components/cartFulfillment/cartFulfillmentLayout';

import useCookies from '@/hooks/useCookies';
import { PERMISSION_TYPES_BACKEND } from '@/utils/constants';

import { AllocationContainer } from './allocation/allocationContainer';
import { CART_FULFILLMENT_SCREENS } from './constants';
import { PickContainer } from './pick/pickContainer';
import { RestockLogContainer } from './restockLog/restockLogContainer';

export const CartFulfillmentContainer = () => {
  const isSmall = window.screen.width <= 576;
  const tabInUrl = useSearchParams().get('tab');
  const router = useRouter();
  const [selectedScreen, setSelectedScreen] = useState(
    tabInUrl ? tabInUrl : 'pick'
  );

  const admin = useCookies().getDataFromCookie();
  const permission = admin.rbac.cartRequestDrugs;

  const onChangeScreen = (screen: string) => {
    setSelectedScreen(screen);
    router.push(`/cartFulfillment?tab=${screen}`);
  };

  return (
    <div>
      {permission !== PERMISSION_TYPES_BACKEND.HIDE && (
        <CartFulfillmentLayout
          selectedScreen={selectedScreen}
          setSelectedScreen={onChangeScreen}
        >
          {selectedScreen ===
            (CART_FULFILLMENT_SCREENS[0]?.value as string) && (
            <PickContainer selectedScreen={selectedScreen} />
          )}
          {selectedScreen ===
            (CART_FULFILLMENT_SCREENS[1]?.value as string) && (
            <AllocationContainer selectedScreen={selectedScreen} />
          )}
          {selectedScreen ===
            (CART_FULFILLMENT_SCREENS[2]?.value as string) && (
            <RestockLogContainer />
          )}
        </CartFulfillmentLayout>
      )}
    </div>
  );
};
