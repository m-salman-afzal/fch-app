import { useCallback, useEffect, useState } from 'react';
import { Form, Row } from 'antd';
import debounce from 'lodash.debounce';
import { useRouter, useSearchParams } from 'next/navigation';

import { TCartInventoryLogsFilterTypes } from '@/types/cartInventoryTypes';
import { TCartData } from '@/types/cartTypes';
import { SelectOption } from '@/types/commonTypes';

import FilterTags from '@/components/common/filterTags/filterTags';

import {
  CART_INVENTORY_TABS,
  CART_INVENTORY_TABS_OPTIONS
} from '@/containers/controlsLogbook/constants';
import { useFetch } from '@/hooks/useFetch';
import { ALL } from '@/utils/constants';
import {
  getAllCartInventoryLogUrl,
  getAllCartInventoryUrl
} from '@/utils/endpoints';
import { pxToRem } from '@/utils/sharedUtils';

import { CartInventoryLayout } from './cartinventoryLayout';
import { InventoryContainer } from './inventory/inventoryContainer';
import { LogsContainer } from './logs/logsContainter';

const logsFilterInitialValues = {
  fromDate: undefined,
  toDate: undefined,
  cart: ALL
};

export const CartInventoryContainer = () => {
  const router = useRouter();
  const tabInUrl = useSearchParams().get('tab');
  const subTabInUrl = useSearchParams().get('subTab');
  const isSubTab = CART_INVENTORY_TABS_OPTIONS.find(
    allTab => allTab.value === subTabInUrl
  );
  const [selectedTab, setSelectedTab] = useState(
    isSubTab ? isSubTab.value : CART_INVENTORY_TABS_OPTIONS[0].value
  );
  const [isInventorySubmitModal, setIsInventorySubmitModal] = useState(false);
  const [cartData, setCartData] = useState<SelectOption[]>([]);
  const [selectedCart, setSelectedCart] = useState<undefined | SelectOption>();
  const [searchText, setSearchText] = useState('');
  const [logsFiltersState, setLogsFiltersState] =
    useState<TCartInventoryLogsFilterTypes>({});

  const [cartsWithLogs, setCartsWithLogs] = useState<SelectOption[]>([]);

  const [logsFilterFormRef] = Form.useForm();

  const { fetchData } = useFetch();

  const getCartsData = async (isSelectCart = false) => {
    const url = `${getAllCartInventoryUrl()}/getCarts`;
    const payload = {};
    const cartData = await fetchData(url, payload);

    if (cartData.status !== 'error') {
      const mappedCarts = cartData.map((cart: TCartData) => {
        return { label: cart.cart, key: cart.cartId, value: cart.cartId };
      });
      setCartData(mappedCarts);

      if (isSelectCart) {
        setSelectedCart(mappedCarts[0]);
      }
    }
  };

  const handleOnCartChange = (cart: string) => {
    const nextCart = cartData.find(c => c.value === cart);
    setSelectedCart(nextCart);
  };

  const onLogsFilterApply = (value: TCartInventoryLogsFilterTypes) => {
    setLogsFiltersState(value);
  };

  const onTabChange = (tab: string) => {
    logsFilterFormRef.setFieldsValue({
      cart: null,
      toDate: null,
      fromDate: null
    });
    setLogsFiltersState({});

    router.push(
      `/controlsLogbook?tab=${tabInUrl ?? 'cartInventory'}&subTab=${tab}`
    );

    if (tab === CART_INVENTORY_TABS.CART_INVENTORY) {
      getCartsData(true);
      setSearchText('');
    } else {
      getCartsWithLogs();
    }

    setSelectedTab(tab);
  };

  const getCartsWithLogs = async () => {
    const url = `${getAllCartInventoryLogUrl()}/getCarts`;
    const payload = {};
    const cartData = await fetchData(url, payload);

    if (cartData.status !== 'error') {
      const mappedCarts = cartData.map((cart: Record<string, string>) => {
        return { value: cart.cart, label: cart.cart };
      });
      setCartsWithLogs(mappedCarts);
    }
  };

  const handleSearch = useCallback(
    debounce(e => {
      setSearchText(e);
    }, 500),
    []
  );

  useEffect(() => {
    getCartsData(true);
  }, []);

  return (
    <>
      <CartInventoryLayout
        logsCarts={cartsWithLogs}
        cartData={cartData}
        onInventorySearch={handleSearch}
        onInventorySubmitClick={() => setIsInventorySubmitModal(true)}
        selectedTab={selectedTab}
        tabOptions={CART_INVENTORY_TABS_OPTIONS}
        onTabChange={onTabChange}
        selectedCart={selectedCart}
        onCartChange={handleOnCartChange}
        logsFilterFormRef={logsFilterFormRef}
        onLogsFilterReset={() => {}}
        onLogsFilterApply={onLogsFilterApply}
      >
        {selectedTab === CART_INVENTORY_TABS.CART_INVENTORY && (
          <InventoryContainer
            searchText={searchText}
            selectedCart={selectedCart}
            onCloseModal={() => setIsInventorySubmitModal(false)}
            isModalOpen={isInventorySubmitModal}
            setSelectedCart={setSelectedCart}
          />
        )}

        {selectedTab === CART_INVENTORY_TABS.LOGS && (
          <>
            <FilterTags<TCartInventoryLogsFilterTypes>
              filterForm={logsFilterFormRef}
              filterState={logsFiltersState}
              filterInitialValues={logsFilterInitialValues}
              onChangeFilters={onLogsFilterApply}
              marginBottom={pxToRem(0)}
              customKeys={{
                fromDate: 'From',
                toDate: 'To'
              }}
            />
            <LogsContainer searchFilters={logsFiltersState} />
          </>
        )}
      </CartInventoryLayout>
    </>
  );
};
