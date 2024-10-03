import { useEffect, useState } from 'react';
import { Form } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';

import { TCartData } from '@/types/cartTypes';
import { Pagination, SelectOption } from '@/types/commonTypes';

import { CartRestockLayout } from '@/components/cartRestock/cartRestockLayout';

import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import {
  CART_RESTOCK_SCREENS,
  DEFAULT_PAGE_SIZE,
  PERMISSIONS_TYPES
} from '@/utils/constants';
import { getcartUrl } from '@/utils/endpoints';

export const CartRestockContainer = () => {
  const { getDataFromCookie } = useCookies();
  const { cartRequestForms, referenceGuide } = getDataFromCookie()?.rbac;
  const tabInUrl = useSearchParams().get('tab');
  const router = useRouter();
  const tabOptions = CART_RESTOCK_SCREENS.filter(item => {
    if (
      (item?.label === 'Reference Guides' || item?.label === 'Request Logs') &&
      referenceGuide === PERMISSIONS_TYPES.HIDE
    ) {
      return false;
    }
    if (
      item?.label === 'Request Form' &&
      cartRequestForms === PERMISSIONS_TYPES.HIDE
    ) {
      return false;
    }

    return true;
  });
  const isSmall = window.screen.width <= 576;
  const defaultPaginationOptions = {
    currentPage: 1,
    perPage: 20,
    totalItems: 20,
    totalPages: 1
  };
  const [onScreen, setOnScreen] = useState<string>(
    tabInUrl ? tabInUrl : 'referenceGuide'
  );
  const [requestLogsFilterRef] = Form.useForm();
  const [requestLogsSearchText, setRequestLogsSearchText] = useState<any>();
  const [requestLogsFilters, setRequestLogsFilters] = useState<any>();
  const [cartData, setCartData] = useState<SelectOption[]>([]);
  const [cartSearchText, setCartSearchText] = useState<any>('');
  const [cartPagination, setCartPanigation] = useState(
    defaultPaginationOptions
  );
  const { fetchData } = useFetch();

  const getCartsData = async (pagination: Pagination, search?: string) => {
    const url = getcartUrl();
    const payload = {
      ...pagination,
      cart: search || cartSearchText
    };
    const cartData = await fetchData(url, payload);
    setCartSearchText(search);
    if (cartData.status !== 'error') {
      setCartData(prevState => {
        return [
          ...prevState,
          ...cartData.rows.map((cart: TCartData) => {
            return { label: cart.cart, key: cart.cartId, value: cart.cartId };
          })
        ];
      });

      setCartPanigation(cartData.paginationInfo);
    }
  };

  const onTabChange = (tabName: string) => {
    setRequestLogsFilters({});
    requestLogsFilterRef.resetFields();
    setRequestLogsSearchText(null);
    setOnScreen(tabName);
    router.push(`/cartRestock?tab=${tabName}`);
  };

  const onRequestLogsTableSearch = (searchText: string) => {
    setRequestLogsSearchText(searchText);
  };

  const onApplyRequestLogs = (values: any) => {
    setRequestLogsFilters(values);
  };

  const onCartSearch = (value: string) => {
    setCartData([]);
    getCartsData(defaultPaginationOptions, value);
  };

  const onScrollCartList = () => {
    const updatedPagination = {
      ...cartPagination,
      currentPage: cartPagination.currentPage + 1,
      perPage: 20
    };

    if (updatedPagination.currentPage <= cartPagination.totalPages) {
      getCartsData(updatedPagination);
    }
  };

  useEffect(() => {
    setCartData([]);
    getCartsData(defaultPaginationOptions);
  }, [onScreen]);

  return (
    <CartRestockLayout
      onCartSearch={onCartSearch}
      cartSearchText={cartSearchText}
      onScrollCartList={onScrollCartList}
      defaultPaginationOptions={defaultPaginationOptions}
      segmentedMenuItems={tabOptions}
      onScreen={onScreen}
      currentView={''}
      cartData={cartData}
      requestLogsFilterRef={requestLogsFilterRef}
      requestLogsfilters={requestLogsFilters}
      requestLogsSearchText={requestLogsSearchText}
      setScreen={onTabChange}
      onRequestLogsTableSearch={onRequestLogsTableSearch}
      onApplyRequestLogs={onApplyRequestLogs}
    />
  );
};
