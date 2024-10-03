'use client';

import { PropsWithChildren, useEffect } from 'react';
import { redirect, usePathname } from 'next/navigation';

import useCookies from '@/hooks/useCookies';
import { MENU_ITEMS } from '@/utils/menuItems';
import { firstAllowedRoute, isRouteAllowed } from '@/utils/sharedUtils';

const AuthRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { getDataFromCookie } = useCookies();

  const admin = getDataFromCookie();

  const pathname = usePathname();
  const backendUrl = MENU_ITEMS.find(item => item.url === pathname)?.backendUrl;

  useEffect(() => {
    if (
      pathname === '/forbiddenAccess' &&
      firstAllowedRoute(admin) !== '/forbiddenAccess'
    ) {
      redirect(firstAllowedRoute(admin) as string);
    }

    if (isRouteAllowed(backendUrl ?? [''], admin)) {
      redirect(firstAllowedRoute(admin) as string);
    }

    if (
      pathname !== '/login' &&
      !pathname.includes('/reset') &&
      !admin?.adminId
    ) {
      redirect('/login');
    }

    if (pathname === '/login' && admin?.adminId) {
      redirect(firstAllowedRoute(admin) as string);
    }
  }, [admin]);

  return <>{children}</>;
};

export default AuthRoute;
