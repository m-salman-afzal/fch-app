import { useCallback, useEffect, useState } from 'react';
import Icon, { BellOutlined, DownOutlined } from '@ant-design/icons';
import {
  Badge,
  Col,
  Dropdown,
  Grid,
  Layout,
  Popover,
  Row,
  Typography
} from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TFacility } from '@/types/facilityTypes';

import { FacilitySelectorSvg } from '@/components/bridgeTherapy/styles/svgs';

import useCookies from '@/hooks/useCookies';
import { useFacility } from '@/hooks/useFacility';
import { useFetch } from '@/hooks/useFetch';
import { useSocketHandler } from '@/hooks/useSocket';
import {
  DEFAULT_PAGINATION_VALUES,
  NOTIFICATION_TYPE,
  PERMISSION_PRIORITY,
  PERMISSION_TYPES_BACKEND,
  SOCKET_EVENTS
} from '@/utils/constants';
import {
  getNotificationUrl,
  markAsReadNotificationUrl
} from '@/utils/endpoints';
import { MENU_ITEMS } from '@/utils/menuItems';
import { setNotificationText } from '@/utils/notificationUtils';
import { pxToRem } from '@/utils/sharedUtils';

import MobileHeaderMenu from './mobileMenu';
import { NotificaitonContent } from './notificationContent';
import { ProfileDropdown } from './profileDropdown';
import { useHeaderStyle } from './useHeaderStyle';

interface props {
  logoutUser: () => void;
  onSelectFacility: (value: any) => void;
  currentFacility: TFacility;
}
const { Header } = Layout;

const FACILITY_FREE_ROUTES = [
  '/notificationsAndTasks',
  '/formulary',
  '/admins',
  '/facilities',
  '/logs',
  '/communication',
  '/fileManager'
];

const defaultPaginationValues = {
  ...DEFAULT_PAGINATION_VALUES,
  totalPages: 1,
  perPage: 10
};

const HeaderLayout: React.FC<props> = ({
  logoutUser,
  onSelectFacility,
  currentFacility
}) => {
  const router = useRouter();
  const { header, counterContainer, headerFeatureName, counterStyle } =
    useHeaderStyle();
  const { useBreakpoint } = Grid;
  const { getDataFromCookie } = useCookies();
  const admin = getDataFromCookie();
  const size = useBreakpoint();
  const name = usePathname();
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [notifications, setNotifications] = useState<Record<string, any>[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [pagination, setPagination] = useState(defaultPaginationValues);

  const { fetchData, isLoading, setIsLoading } = useFetch();
  const { updateData } = useFetch();

  const params = useSearchParams();
  const { onChangeFacilityForNotification } = useFacility({ admin });

  const markAsRead = async (notification: Record<string, any>) => {
    const url = `${markAsReadNotificationUrl()}/${notification.notificationAdminId}`;
    await updateData(url, { isRead: true });
  };

  const openReport = async (notification: Record<string, any>) => {
    if (!notification.isRead) {
      await markAsRead(notification);
    }

    onChangeFacilityForNotification(notification.facilityId);

    try {
      const newParams = new URLSearchParams(params.toString());

      if (notification.safeReport) {
        newParams.set('reportId', notification.report.reportId);
        window.location.replace(`/safeReporting?${newParams.toString()}`);
      }
      if (notification.controlledDrug) {
        newParams.set(
          'controlledDrugId',
          notification.controlledDrug.controlledDrugId
        );
        window.location.replace(`/controlsLogbook?${newParams.toString()}`);
      }
      if (notification.formulary && !notification?.controlledDrug) {
        newParams.set('formularyId', notification.formulary.formularyId);
        window.location.replace(`/inventory?${newParams.toString()}`);
      }
      if (
        notification.notificationType ===
        NOTIFICATION_TYPE.FACILITY_CHECKLIST_INCOMPLETE
      ) {
        window.location.replace(`/facilityChecklist`);
      }

      if (
        notification.shiftCountLogId &&
        PERMISSION_PRIORITY[admin?.rbac?.controlLogBookAdminister] <= 2
      ) {
        newParams.set('shiftCountLogId', notification.shiftCountLogId);
        window.location.replace(
          `/controlsLogbook?tab=shiftCount&subTab=shiftCountLogs&${newParams.toString()}`
        );
      }

      await getNotifications();
      setNotificationOpen(false);
    } catch (err) {
      setNotificationOpen(false);
    }
  };

  const { isConnected, subscribeEvent, unSubscribeEvent } = useSocketHandler(
    admin.adminId
  );

  const notificationEventHandler = useCallback(
    (data: Record<string, any>) => {
      if (data.isFacilityChecklistComplete) {
        setNotifications(prevNotifications =>
          prevNotifications.filter(
            n => n.notificationAdminId !== data.notificationAdminId
          )
        );
        setNotificationCount(prevCount => prevCount - 1);

        return;
      }

      const text = setNotificationText(data);
      const formattedNotification = {
        ...data,
        ...text,
        key: data.notificationId
      };

      setNotifications(prevNotifications => [
        formattedNotification,
        ...prevNotifications
      ]);
      setNotificationCount(prevCount => prevCount + 1);
    },
    [
      setNotifications,
      setNotificationCount,
      setNotificationText,
      notificationCount,
      notifications
    ]
  );

  const notificationCountEventHandler = useCallback(
    (data: Record<string, any>) => {
      setNotificationCount(data.notificationCount);
    },
    [setNotificationCount, notificationCount]
  );

  useEffect(() => {
    if (isConnected) {
      subscribeEvent(
        SOCKET_EVENTS.RECEIVE_NOTIFICATION,
        notificationEventHandler
      );

      subscribeEvent(
        SOCKET_EVENTS.NOTIFICATION_COUNT,
        notificationCountEventHandler
      );
    }

    return () => {
      unSubscribeEvent(
        SOCKET_EVENTS.RECEIVE_NOTIFICATION,
        notificationEventHandler
      );

      unSubscribeEvent(
        SOCKET_EVENTS.NOTIFICATION_COUNT,
        notificationCountEventHandler
      );
    };
  }, [isConnected, notificationEventHandler]);

  const getNotifications = async (paginationInfo = pagination) => {
    try {
      setIsLoading(true);
      const url = getNotificationUrl();
      const payload = {
        ...paginationInfo,
        isAlert: true
      };
      const notificationData = await fetchData(url, payload);

      if (notificationData.status === 'error') {
        setNotifications([]);
        setNotificationCount(0);
        setIsLoading(false);
      }

      if (notificationData.rows) {
        const mappedNotificationText = notificationData.rows.map(
          (notification: Record<string, any>) => {
            const text = setNotificationText(notification);

            return {
              ...notification,
              ...text,
              key: notification.notificationId
            };
          }
        );

        const newNotifications =
          paginationInfo.currentPage === 1
            ? mappedNotificationText
            : [...notifications, ...mappedNotificationText];

        setNotifications(newNotifications);
        setPagination({ ...pagination, ...notificationData.paginationInfo });
        setNotificationCount(notificationData.paginationInfo.totalItems);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const onScrollPagination = async (event: any) => {
    if (event?.target) {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
        if (pagination.currentPage < pagination.totalPages) {
          const currentPagination = {
            ...pagination,
            currentPage: pagination.currentPage + 1
          };
          await getNotifications(currentPagination);
        }
      }
    }
  };

  const getRoleForHeader = (roles: any[]) => {
    const position = roles.map((role: any) => role.position);
    const highestPostion = Math.min(...position);
    const highestRole = roles.find(role => role.position === highestPostion);

    return highestRole?.name ? highestRole.name : '';
  };

  const pathname = usePathname();

  const facilities = admin?.facility?.map((f: any) => {
    return {
      key: f.facilityId,
      label: f.facilityName,
      value: f.facilityId
    };
  });

  return (
    <Header className={header}>
      <Row
        style={{
          height: '100%',
          gap: pxToRem(16)
        }}
        align="middle"
        justify={size.xs ? 'start' : 'space-between'}
      >
        {size.xs && (
          <MobileHeaderMenu logoutUser={logoutUser} selectedPage={''} />
        )}
        {size.sm && (
          <Col style={{ height: '100%' }}>
            <Typography.Text className={headerFeatureName}>
              {MENU_ITEMS.find(({ url }) => `${url}` === pathname)?.label}
            </Typography.Text>
          </Col>
        )}
        <Row align="middle" style={size.xs ? {} : { gap: pxToRem(15) }}>
          {!FACILITY_FREE_ROUTES.includes(name) && (
            <Col
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Dropdown
                trigger={['click']}
                menu={{
                  selectable: true,
                  multiple: false,
                  items: facilities,
                  onSelect: onSelectFacility,
                  defaultActiveFirst: false,
                  defaultSelectedKeys: [currentFacility.facilityId]
                }}
              >
                <VsButton
                  size={BUTTON_SIZES.middle}
                  style={{
                    paddingInlineStart: pxToRem(4),
                    paddingInlineEnd: pxToRem(9)
                  }}
                >
                  <Row justify={'space-between'} align={'middle'}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                        paddingInlineEnd: pxToRem(7.5)
                      }}
                    >
                      <Col
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          paddingInlineEnd: pxToRem(7.5)
                        }}
                      >
                        <Icon
                          component={FacilitySelectorSvg}
                          style={{
                            background: 'black',
                            border: pxToRem(5),
                            width: pxToRem(23),
                            height: pxToRem(23),
                            borderRadius: pxToRem(5),
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        />
                      </Col>

                      <span
                        style={{
                          fontSize: pxToRem(14),
                          maxWidth: size.xs ? pxToRem(120) : undefined,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {currentFacility.facilityName}
                      </span>
                    </div>
                    <Col style={{ display: 'flex', alignItems: 'center' }}>
                      <DownOutlined />
                    </Col>
                  </Row>
                </VsButton>
              </Dropdown>
            </Col>
          )}

          {admin.rbac.notificationsAndTasks !==
            PERMISSION_TYPES_BACKEND.HIDE && (
            <Col
              style={size.xs ? { position: 'fixed', right: 85, top: 15 } : {}}
            >
              <Popover
                trigger={['click']}
                arrow={false}
                destroyTooltipOnHide
                content={
                  <NotificaitonContent
                    onScrollPagination={onScrollPagination}
                    closeNotification={() => setNotificationOpen(false)}
                    notifications={notifications}
                    openReport={openReport}
                    isLoading={isLoading}
                  />
                }
                placement={size.xs ? 'bottom' : 'bottomLeft'}
                overlayStyle={size.xs ? {} : { top: pxToRem(60) }}
                overlayInnerStyle={{ padding: pxToRem(0) }}
                open={notificationOpen}
                onOpenChange={async val => {
                  setNotificationOpen(val);

                  if (val) {
                    await getNotifications();

                    return;
                  }
                  setNotifications([]);
                  setPagination(defaultPaginationValues);
                }}
              >
                <div className={counterContainer} style={{ cursor: 'pointer' }}>
                  <Badge count={notificationCount} className={counterStyle}>
                    <BellOutlined style={{ fontSize: pxToRem(16) }} />
                  </Badge>
                </div>
              </Popover>
            </Col>
          )}
          <Col
            span={size.xs ? 1 : undefined}
            style={size.xs ? { position: 'fixed', right: 60, top: 15 } : {}}
          >
            <Row>
              <ProfileDropdown
                admin={admin}
                logoutUser={logoutUser}
                getRoleForHeader={getRoleForHeader}
              />
            </Row>
          </Col>
        </Row>
      </Row>
    </Header>
  );
};

export default HeaderLayout;
