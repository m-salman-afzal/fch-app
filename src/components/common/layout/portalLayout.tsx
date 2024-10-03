'use client';

import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Grid, Layout } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

import { TFacility } from '@/types/facilityTypes';

import { FacilityContext } from '@/context/facilityContext';
import useCookies from '@/hooks/useCookies';
import { useFacility } from '@/hooks/useFacility';
import { useFetch } from '@/hooks/useFetch';
import { useSessionStorage } from '@/hooks/useSessionStorage';
import { updateUserSettingUrl } from '@/utils/endpoints';
import { API_BASE_URL } from '@/utils/urls';

import HeaderLayout from './header';
import SiderLayout from './sider';
import { usePortalLayoutStyle } from './usePortalLayoutStyle';

interface props {}

const { Content } = Layout;
const { useBreakpoint } = Grid;

const PortalLayout: React.FC<PropsWithChildren<props>> = ({ children }) => {
  const size = useBreakpoint();
  const [currentFacility, setCurrentFacility] = useState<TFacility>({
    externalFacilityId: '',
    facilityId: '',
    facilityName: '',
    supplyDays: 7
  });

  const [previousFacility, setPreviousFacility] = useState<
    TFacility | undefined
  >(undefined);

  const [isFacilityChanged, setIsFacilityChanged] = useState(false);

  const { contentStyle, contentStyleScroll } = usePortalLayoutStyle();
  const { postData, updateData } = useFetch();
  const [scrollStyle, setScrollStyle] = useState<any>(contentStyle);
  const ref = useRef<any>();
  const { getDataFromCookie } = useCookies();

  const admin = getDataFromCookie();
  const { removeAllSessionStorage, getSessionStorage, setSessionStorage } =
    useSessionStorage();

  useEffect(() => {
    const element = document.getElementsByClassName('ant-layout-content')[0];

    if (element?.clientWidth !== ref?.current?.offsetWidth) {
      setScrollStyle(contentStyleScroll);
    } else {
      setScrollStyle(contentStyle);
    }
  }, [ref]);

  const pathname = usePathname();

  const updateDefaultFacility = async (facilityId: string) => {
    await updateData(updateUserSettingUrl(admin.userSetting.userSettingId), {
      defaultFacilityId: facilityId
    });

    setIsFacilityChanged(false);
  };

  const onSelectFacility = (value: any) => {
    const selectedFacility = admin?.facility.find(
      (f: any) => f.facilityId === value.key
    );

    setCurrentFacility(selectedFacility);
    setSessionStorage({
      key: 'facility',
      value: selectedFacility
    });
    setIsFacilityChanged(true);
    window.location.reload();
  };

  useEffect(() => {
    if (pathname !== '/login' && admin.adminId) {
      !admin?.userSetting?.setting?.defaultFacilityId &&
        updateDefaultFacility(admin?.facility?.[0]?.facilityId);
      const facility = getSessionStorage('facility');
      const previousFacility = getSessionStorage('previousFacility');

      const selectedFacility = admin.facility.find(
        (f: any) => f.facilityId === admin.userSetting.setting.defaultFacilityId
      );

      const currentSelectedFacility = facility
        ? facility
        : selectedFacility
          ? selectedFacility
          : admin.facility[0];

      setCurrentFacility(currentSelectedFacility);
      previousFacility && setPreviousFacility(previousFacility);

      setSessionStorage({
        key: 'facility',
        value: currentSelectedFacility
      });
    }
  }, []);

  useEffect(() => {
    if (pathname !== '/login' && admin.adminId && isFacilityChanged) {
      updateDefaultFacility(currentFacility.facilityId);
    }
  }, [currentFacility]);

  useEffect(() => {
    const targetNode = document;
    const observerConfig = { childList: true, subtree: true };
    const mutationCallback = (mutationsList: any) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          for (const removedNode of mutation.removedNodes) {
            if (
              (removedNode?.classList
                ?.toString()
                ?.includes('ant-drawer-mask') ||
                removedNode?.classList
                  ?.toString()
                  ?.includes('ant-modal-root')) &&
              /iPhone|iPod/.test(navigator.userAgent)
            ) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        }
      }
    };

    const observer = new MutationObserver(mutationCallback);
    observer.observe(targetNode, observerConfig);

    return () => observer.disconnect();
  }, []);

  const { removeAllCookies } = useCookies();

  const router = useRouter();

  const logoutUser = async () => {
    const url = `${API_BASE_URL}auth/logout`;
    const response = await postData(url, {});

    if (response.status !== 'error') {
      removeAllCookies();
      removeAllSessionStorage();
      router.push('/login');
    }
  };

  return (
    <>
      {currentFacility.facilityId && (
        <Layout style={{ minHeight: '100vh' }}>
          <FacilityContext.Provider
            value={{
              currentFacility,
              setCurrentFacility,
              previousFacility,
              setPreviousFacility
            }}
          >
            {size.sm && <SiderLayout logoutUser={logoutUser} />}
            <Layout ref={ref}>
              <HeaderLayout
                logoutUser={logoutUser}
                onSelectFacility={onSelectFacility}
                currentFacility={currentFacility}
              />
              <Content className={scrollStyle}>{children}</Content>
            </Layout>
          </FacilityContext.Provider>
        </Layout>
      )}
    </>
  );
};

export default PortalLayout;
