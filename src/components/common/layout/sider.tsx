import { Fragment, useState } from 'react';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Layout, Row } from 'antd';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import FCHLOGO from '@/assets/FirstClass Healthcare Logo.svg';
import LogoutMenuIcon from '@/assets/icons/sideMenu/logout.svg';
import useCookies from '@/hooks/useCookies';
import { useFacility } from '@/hooks/useFacility';
import {
  ADMIN_MENU_ITEMS,
  DashboardMenuItem,
  MEDICAL_ITEMS,
  PHARMACY_ITEMS
} from '@/utils/menuItems';
import { isRouteAllowed, pxToRem } from '@/utils/sharedUtils';

import { useSiderStyle } from './useSiderStyle';

interface props {
  logoutUser: () => void;
}

const { Sider } = Layout;
const SiderLayout: React.FC<props> = ({ logoutUser }) => {
  const { getDataFromCookie } = useCookies();
  const admin = getDataFromCookie();
  const { restoreFacility } = useFacility({ admin });

  const router = useRouter();
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    window.innerWidth < 1200
  );
  const {
    sider,
    siderCollapsed,
    siderSubMenu,
    fchLogo,
    fchLogoRow,
    fchLogoRowCollapsed,
    fchLogoCollapsed,
    siderMenuItem,
    siderMenuItemCollapsed,
    siderMenuItemSelected,
    siderMenuItemSelectedCollapsed,
    siderMenuItemIcon,
    siderMenuItemIconCollapsed,
    menuItemsRowContainer,
    siderCollapseButton,
    siderCollapseButtonClosed,
    sideScroll,
    siderSubMenuCollapsed
  } = useSiderStyle(isCollapsed);

  const closeSiderButton = () => {
    setIsCollapsed(x => !x);
  };

  const medicalList = MEDICAL_ITEMS.map(({ backendUrl }: DashboardMenuItem) => {
    return !isRouteAllowed(backendUrl, admin);
  }).filter(x => x === true);

  const pharmacyList = PHARMACY_ITEMS.map(
    ({ backendUrl }: DashboardMenuItem) => {
      return !isRouteAllowed(backendUrl, admin);
    }
  ).filter(x => x === true);

  const adminList = ADMIN_MENU_ITEMS.map(
    ({ backendUrl }: DashboardMenuItem) => {
      return !isRouteAllowed(backendUrl, admin);
    }
  ).filter(x => x === true);

  const onClick = (url: string) => {
    restoreFacility();
    router.push(`${url}`);
  };

  return (
    <>
      {' '}
      <Button
        className={
          isCollapsed ? siderCollapseButtonClosed : siderCollapseButton
        }
        onClick={closeSiderButton}
        shape="circle"
        style={{
          minWidth: pxToRem(24),
          width: pxToRem(24),
          height: pxToRem(24),
          lineHeight: pxToRem(24),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <MenuUnfoldOutlined />
      </Button>
      <Sider
        className={isCollapsed ? siderCollapsed : sider}
        trigger={null}
        collapsible
        collapsedWidth={`${pxToRem(75)}`}
        collapsed={isCollapsed}
      >
        <Row
          className={isCollapsed ? fchLogoRowCollapsed : fchLogoRow}
          style={{ position: 'relative' }}
        >
          <Image
            className={fchLogo}
            alt={'Firstclass Care'}
            src={FCHLOGO}
            fill={true}
            priority={true}
          />
          {isCollapsed && <div className={fchLogoCollapsed}></div>}
        </Row>
        <div className={sideScroll}>
          <Row className={menuItemsRowContainer}>
            <Col
              className={isCollapsed ? siderSubMenuCollapsed : siderSubMenu}
              span={24}
            >
              <Collapse
                defaultActiveKey={medicalList.length ? ['1'] : ['0']}
                expandIconPosition="end"
                expandIcon={isCollapsed ? () => null : undefined}
                collapsible={medicalList.length ? 'icon' : 'disabled'}
              >
                <Collapse.Panel header={'Medical'} key={'1'}>
                  {MEDICAL_ITEMS.map(
                    ({
                      label,
                      featureName,
                      url,
                      icon,
                      backendUrl
                    }: DashboardMenuItem) => {
                      return !isRouteAllowed(backendUrl, admin) ? (
                        <Row
                          className={
                            pathname === url
                              ? isCollapsed
                                ? siderMenuItemSelectedCollapsed
                                : siderMenuItemSelected
                              : isCollapsed
                                ? siderMenuItemCollapsed
                                : siderMenuItem
                          }
                          onClick={() => onClick(url)}
                          key={featureName}
                        >
                          <Image
                            className={
                              !isCollapsed
                                ? siderMenuItemIcon
                                : siderMenuItemIconCollapsed
                            }
                            width={17}
                            alt={'icon'}
                            src={icon}
                          />{' '}
                          <div>{label}</div>
                        </Row>
                      ) : (
                        <Fragment key={featureName} />
                      );
                    }
                  )}
                </Collapse.Panel>
              </Collapse>
            </Col>

            <Col
              className={isCollapsed ? siderSubMenuCollapsed : siderSubMenu}
              span={24}
            >
              {' '}
              <Collapse
                defaultActiveKey={pharmacyList.length ? ['1'] : ['0']}
                expandIconPosition="end"
                expandIcon={isCollapsed ? () => null : undefined}
                collapsible={pharmacyList.length ? 'icon' : 'disabled'}
              >
                <Collapse.Panel header={'Pharmacy'} key={'1'}>
                  {PHARMACY_ITEMS.map(
                    ({
                      label,
                      featureName,
                      url,
                      icon,
                      backendUrl
                    }: DashboardMenuItem) => {
                      return !isRouteAllowed(backendUrl, admin) ? (
                        <Row
                          className={
                            pathname === url
                              ? isCollapsed
                                ? siderMenuItemSelectedCollapsed
                                : siderMenuItemSelected
                              : isCollapsed
                                ? siderMenuItemCollapsed
                                : siderMenuItem
                          }
                          onClick={() => onClick(url)}
                          key={featureName}
                        >
                          <Image
                            className={
                              !isCollapsed
                                ? siderMenuItemIcon
                                : siderMenuItemIconCollapsed
                            }
                            width={17}
                            alt={'icon'}
                            src={icon}
                          />{' '}
                          <div>{label}</div>
                        </Row>
                      ) : (
                        <Fragment key={featureName} />
                      );
                    }
                  )}
                </Collapse.Panel>
              </Collapse>
            </Col>

            <Col
              className={isCollapsed ? siderSubMenuCollapsed : siderSubMenu}
              span={24}
            >
              {' '}
              <Collapse
                defaultActiveKey={adminList.length ? ['1'] : ['0']}
                expandIconPosition="end"
                expandIcon={isCollapsed ? () => null : undefined}
                collapsible={adminList.length ? 'icon' : 'disabled'}
                style={{ paddingBottom: pxToRem(25) }}
              >
                <Collapse.Panel header={'Admin'} key={'1'}>
                  {ADMIN_MENU_ITEMS.map(
                    ({
                      label,
                      featureName,
                      url,
                      icon,
                      backendUrl
                    }: DashboardMenuItem) => {
                      return !isRouteAllowed(backendUrl, admin) ? (
                        <Row
                          className={
                            pathname === url
                              ? isCollapsed
                                ? siderMenuItemSelectedCollapsed
                                : siderMenuItemSelected
                              : isCollapsed
                                ? siderMenuItemCollapsed
                                : siderMenuItem
                          }
                          onClick={() => onClick(url)}
                          key={featureName}
                        >
                          <Image
                            className={
                              !isCollapsed
                                ? siderMenuItemIcon
                                : siderMenuItemIconCollapsed
                            }
                            width={17}
                            alt={'icon'}
                            src={icon}
                          />{' '}
                          <div>{label}</div>
                        </Row>
                      ) : (
                        <Fragment key={featureName} />
                      );
                    }
                  )}
                </Collapse.Panel>
              </Collapse>
            </Col>
          </Row>

          <Row>
            <Col
              className={isCollapsed ? siderMenuItemCollapsed : siderMenuItem}
              onClick={logoutUser}
              span={24}
              style={{ marginInlineStart: isCollapsed ? pxToRem(5) : 0 }}
            >
              <Image
                className={
                  !isCollapsed ? siderMenuItemIcon : siderMenuItemIconCollapsed
                }
                width={17}
                alt={'icon'}
                src={LogoutMenuIcon}
              />{' '}
              <div>Logout</div>
            </Col>
          </Row>
        </div>
      </Sider>
    </>
  );
};

export default SiderLayout;
