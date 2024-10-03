import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import '@/styles/globals.css';

import { Spin } from 'antd';
import dynamic from 'next/dynamic';

import Providers from '@/components/common/providers/providers';

import StyledComponentsRegistry from '@/lib/antdRegistery';

const Wrapping = dynamic(() => import('./wrapping'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw'
      }}
    >
      <Spin
        size="large"
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      />
    </div>
  )
});

const inter = localFont({
  src: [
    {
      path: '../assets/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../assets/fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../assets/fonts/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal'
    },
    {
      path: '../assets/fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal'
    }
  ]
});

export const metadata: Metadata = {
  title: 'FCH App'
};

export const viewport: Viewport = {
  maximumScale: 1.0,
  initialScale: 1.0,
  userScalable: false,
  width: 'device-width'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <Providers>
            <Wrapping>{children}</Wrapping>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
