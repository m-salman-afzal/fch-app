import { useState } from 'react';
import axios from 'axios';
import { anyOf, createRegExp, exactly, not } from 'magic-regexp';
import { useRouter } from 'next/navigation';

import { TRequest } from '@/types/fetchTypes';

import { TOAST_DURATION, TOAST_GENERIC_ERROR_MESSAGE } from '@/utils/constants';
import ShowToast from '@/utils/showToast';

import useCookies from './useCookies';
import { useFacility } from './useFacility';
import { useSessionStorage } from './useSessionStorage';

export const useFetch = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<any>();
  const { currentFacility } = useFacility();
  const router = useRouter();
  const { removeAllCookies } = useCookies();
  const { removeAllSessionStorage } = useSessionStorage();

  const checkEmpty = (payload: any) => {
    const newObject: any = {};
    for (let key in payload) {
      newObject[key] = !!payload[key]
        ? payload[key]
        : payload[key] === false
          ? false
          : undefined;
    }

    return newObject;
  };

  const logout = () => {
    removeAllCookies();
    removeAllSessionStorage();
    router.push('/login');
  };
  const filterOutRoutes = createRegExp(
    anyOf(
      'facilityId',
      '/admins',
      '/facilities',
      '/communication',
      '/roles',
      exactly('/formulary').notBefore('Levels'),
      '/serviceList',
      'roleServiceList',
      '/userSettings',
      '/facilityUnits',
      '/files',
      '/notificationsAndTasks'
    )
  );

  const attachFacilityIdToPayload = (url: string, payload: any) => {
    return !filterOutRoutes.test(url)
      ? {
          ...payload,
          facilityId: payload.facilityId ?? currentFacility.facilityId
        }
      : payload;
  };

  const preparePayload = (url: string, payload: any) => {
    return checkEmpty(attachFacilityIdToPayload(url, payload));
  };

  const cleanPayload = (payload: any) => {
    if (payload) {
      if (typeof payload === 'object' && !Array.isArray(payload)) {
        const cleaned: any = {};

        if (payload?.length > 0) {
          return payload;
        }

        for (const item in payload) {
          if (typeof payload[item] === 'string') {
            cleaned[item] = payload[item].trim();
          } else {
            cleaned[item] = cleanPayload(payload[item]);
          }
        }

        return cleaned;
      }

      if (Array.isArray(payload)) {
        const cleaned: any[] = [];

        for (const item of payload) {
          let cleanedItem;
          if (typeof item === 'string') {
            cleanedItem = item.trim();
          } else {
            cleanedItem = cleanPayload(item);
          }

          cleaned.push(cleanedItem);
        }

        return cleaned;
      }
    }

    return payload;
  };

  const attachFacilityIdToQuery = (url: string) => {
    return !filterOutRoutes.test(url)
      ? `${url}?facilityId=${currentFacility.facilityId}`
      : url;
  };

  const fetchData = async (url: string, payload?: any) => {
    setIsLoading(true);
    try {
      const response: any = await axios.get(attachFacilityIdToQuery(url), {
        params: checkEmpty(cleanPayload(payload)),
        withCredentials: true
      });
      setIsLoading(false);

      return response.data;
    } catch (e: any) {
      setIsLoading(false);
      if (e.response?.data) {
        if (e.response?.data?.reload || e.response.status === 401) {
          return logout();
        }

        return e.response.data;
      }
      ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);

      return;
    }
  };

  const autoRefreshFetchData = async (url: string, payload?: any) => {
    try {
      const response: any = await axios.get(attachFacilityIdToQuery(url), {
        params: checkEmpty(cleanPayload(payload)),
        withCredentials: true
      });

      return response.data.body;
    } catch (e: any) {
      if (e.response?.data) {
        if (e.response?.data?.reload || e.response.status === 401) {
          return logout();
        }

        return e.response.data;
      }

      return;
    }
  };

  const postData = async (url: string, payload?: any) => {
    setIsLoading(true);
    try {
      const response: any = await axios.post(
        attachFacilityIdToQuery(url),
        preparePayload(url, cleanPayload(payload)),
        {
          withCredentials: true
        }
      );
      setIsLoading(false);

      return response.data;
    } catch (e: any) {
      setIsLoading(false);

      if (e.response?.data) {
        if (e.response?.data?.reload || e.response.status === 401) {
          return logout();
        }

        return e.response.data;
      }
      ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);

      return;
    }
  };

  const updateData = async (url: string, payload?: any) => {
    setIsLoading(true);
    try {
      const response: any = await axios.put(
        attachFacilityIdToQuery(url),
        attachFacilityIdToPayload(url, cleanPayload(payload)),
        {
          withCredentials: true
        }
      );
      setIsLoading(false);

      return response.data;
    } catch (e: any) {
      setIsLoading(false);

      if (e.response?.data) {
        if (e.response?.data?.reload || e.response.status === 401) {
          return logout();
        }

        return e.response.data;
      }
      ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);

      return;
    }
  };

  const deleteData = async (url: string, payload?: any, bodyPayload?: any) => {
    setIsLoading(true);
    try {
      const response: any = await axios.delete(attachFacilityIdToQuery(url), {
        params: cleanPayload(payload),
        data: cleanPayload(bodyPayload),
        withCredentials: true
      });
      setIsLoading(false);

      return response.data ? response.data : { status: 'success' };
    } catch (e: any) {
      setIsLoading(false);
      if (e.response?.data) {
        if (e.response?.data?.reload || e.response.status === 401) {
          return logout();
        }

        return e.response.data;
      }
      ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);

      return { status: 'error' };
    }
  };

  const fetchMultiple = async <T>(requests: TRequest<T>[]) => {
    setIsLoading(true);
    const promises = requests.map(req =>
      axios.get(attachFacilityIdToQuery(req.url), {
        params: checkEmpty(cleanPayload(req.payload)),
        withCredentials: true
      })
    );

    const settledPromises = await Promise.allSettled(promises);
    setIsLoading(false);

    return settledPromises.map((pro, index) => {
      if (pro.status === 'rejected') {
        return {
          status: 'error',
          value: false,
          requestName: requests[index].requestName
        };
      }

      return {
        status: 'success',
        value: pro.value.data,
        requestName: requests[index].requestName
      };
    });
  };

  return {
    isLoading,
    isError,
    setIsLoading,
    fetchData,
    postData,
    updateData,
    deleteData,
    autoRefreshFetchData,
    checkEmpty,
    fetchMultiple
  };
};
