'use client';

import { PropsWithChildren } from 'react';
import { px2remTransformer } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import { StyleProvider, ThemeProvider } from 'antd-style';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localFont from 'next/font/local';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as theme from 'vs-design-components/src/ant-tokens/light.json';

import store, { persistedData } from '@/redux/store';

dayjs.extend(utc);

const inter = localFont({
  src: [
    {
      path: '../../../assets/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../../assets/fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../../assets/fonts/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal'
    },
    {
      path: '../../../assets/fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal'
    }
  ]
});

const px2rem = px2remTransformer({
  rootValue: 14
});

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{ token: { ...theme, fontFamily: inter.style.fontFamily } }}
    >
      <StyleProvider transformers={[px2rem]}>
        <ThemeProvider
          theme={{ token: { ...theme, fontFamily: inter.style.fontFamily } }}
        >
          <Provider store={store}>
            <PersistGate persistor={persistedData} loading={null}>
              {children}
            </PersistGate>
          </Provider>
        </ThemeProvider>
      </StyleProvider>
    </ConfigProvider>
  );
};

export default Providers;
