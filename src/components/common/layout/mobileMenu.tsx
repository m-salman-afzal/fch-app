import { useState } from 'react';
import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Col, Menu, MenuProps, Row, Typography } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import FCHLOGO from '@/assets/FirstClass Healthcare Logo.svg';
import useCookies from '@/hooks/useCookies';
import { MENU_ITEMS } from '@/utils/menuItems';
import { isRouteAllowed, pxToRem } from '@/utils/sharedUtils';

import { useHeaderStyle } from './useHeaderStyle';

interface props {
  selectedPage: string;
  logoutUser: () => void;
}

const MobileHeaderMenu: React.FC<props> = ({ selectedPage, logoutUser }) => {
  const [menuMobileOpen, setMenuMobileOpen] = useState<boolean>(false);
  const {
    mobileMenu,
    mobileMenuHeader,
    menuItem,
    menuItemActive,
    fchLogoContainer,
    mobileHeaderMenuButton,
    mobileHeaderMenuButtonContainer,
    logOutMenuItem,
    mobileHeaderMenuCloseButton
  } = useHeaderStyle();
  const router = useRouter();

  const { getDataFromCookie } = useCookies();
  const admin = getDataFromCookie();

  const menuItems = MENU_ITEMS.filter(
    item => !isRouteAllowed(item.backendUrl, admin)
  );

  const onSelectMenuItem = (key: any) => {
    if (key.key === 'logout') {
      logoutUser();

      return;
    }
    setMenuMobileOpen(false);
    document.body.style.overflow = '';
    router.push(key.key);
  };

  const items: MenuProps['items'] = [
    ...menuItems.map(item => {
      return {
        className: item.url === selectedPage ? menuItemActive : menuItem,
        key: item.featureName,
        label: item.label
      };
    }),
    { key: 'logout', className: logOutMenuItem, label: 'Log Out' }
  ];

  return (
    <>
      {!menuMobileOpen && (
        <Row align={'middle'}>
          <Col className={mobileHeaderMenuButtonContainer}>
            <Button
              shape="circle"
              className={mobileHeaderMenuButton}
              onClick={() => {
                setMenuMobileOpen(true);
                document.body.style.overflow = 'hidden';
              }}
            >
              <MenuOutlined />
            </Button>
          </Col>
        </Row>
      )}
      {menuMobileOpen && (
        <div
          style={{
            height: '100dvh',
            overflowY: 'auto',
            marginBlockStart: pxToRem(40),
            width: '200%',
            marginInline: pxToRem(-20)
          }}
        >
          <Row
            align="middle"
            className={mobileMenuHeader}
            justify={'space-between'}
          >
            <Col>
              <Button
                className={mobileHeaderMenuCloseButton}
                type="link"
                shape="circle"
                onClick={() => {
                  setMenuMobileOpen(false);
                  document.body.style.overflow = '';
                }}
              >
                <CloseOutlined
                  style={{ color: 'white', fontSize: '1.42rem' }}
                />
              </Button>
            </Col>
            <Col style={{ marginBlockStart: pxToRem(4) }}>
              <Typography.Text
                style={{
                  fontSize: '1.42rem',
                  color: '#FFFFFF80'
                }}
              >
                MENU
              </Typography.Text>
            </Col>
          </Row>

          <Menu
            className={mobileMenu}
            onSelect={onSelectMenuItem}
            theme="dark"
            mode="vertical"
            items={items}
          />
        </div>
      )}
    </>
  );
};

export default MobileHeaderMenu;
