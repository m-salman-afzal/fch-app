import Cookies from 'js-cookie';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { AdminLogout } from '@/redux/slices/adminSlice';
import { formatCookie } from '@/utils/sharedUtils';

const useCookies = () => {
  const admin: any = useAppSelector(state => state.AdminAuth);
  const dispatch = useAppDispatch();
  const getDataFromCookie = (cookieType: string = 'session') => {
    if (admin?.admin?.isLoggedIn && !!getBackendCookie()) {
      return admin.admin;
    }

    return { rbac: {}, facility: [], role: [], userSetting: {} };
  };

  const getBackendCookie = () => {
    if (Cookies.get('connect.sid')) {
      return Cookies.get('connect.sid');
    }

    return false;
  };
  const logout = () => {
    dispatch(AdminLogout());
  };

  const removeAllCookies = () => {
    Cookies.remove('connect.sid');
    localStorage.removeItem('persist:root');
    logout();
  };

  return {
    getDataFromCookie,
    removeAllCookies,
    getBackendCookie
  };
};

export default useCookies;
