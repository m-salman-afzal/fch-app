'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import PortalLayout from '@/components/common/layout/portalLayout';

import AuthRoute from '@/containers/auth/authRoute';

const Wrapping = ({ children }: any) => {
  const pathname = usePathname();

  if (window.screen.width >= 2560) {
    document.documentElement.style.fontSize = '18px';
  }

  if (window.screen.width >= 3840) {
    document.documentElement.style.fontSize = '20px';
  }

  return (
    <AuthRoute>
      {pathname !== '/login' && !pathname.includes('/reset') ? (
        <PortalLayout>{children}</PortalLayout>
      ) : (
        <>{children}</>
      )}
    </AuthRoute>
  );
};

export default Wrapping;
