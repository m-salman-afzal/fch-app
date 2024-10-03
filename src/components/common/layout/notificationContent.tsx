import { FC } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Col, Grid, Row, Spin, Typography } from 'antd';
import Image from 'next/image';

import letterBox from '@/assets/icons/notification/letterBox.svg';
import useCookies from '@/hooks/useCookies';
import { NOTIFICATION_TYPE, PERMISSIONS_TYPES } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { NotificationCard } from './notificationCard';
import { useHeaderStyle } from './useHeaderStyle';

const { useBreakpoint } = Grid;

interface Props {
  closeNotification: () => void;
  onScrollPagination: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  notifications: unknown[];
  openReport: (val: any) => void;
  isLoading: boolean;
}

export const NotificaitonContent: FC<Props> = ({
  closeNotification,
  onScrollPagination,
  notifications,
  openReport,
  isLoading
}) => {
  const { getDataFromCookie } = useCookies();
  const size = useBreakpoint();
  const admin = getDataFromCookie();

  const isViewAccess = (reportData: any, permission?: string) => {
    if (admin.rbac?.adminDashboard !== PERMISSIONS_TYPES.WRITE) {
      return false;
    }

    return true;
  };

  const { notificationContainer } = useHeaderStyle();

  return (
    <Spin spinning={isLoading}>
      <div
        className={notificationContainer}
        style={{
          width: size.xs ? '100%' : pxToRem(370),
          height: size.xs ? 'calc(100dvh - 90px)' : pxToRem(580),
          paddingBlock: pxToRem(20)
        }}
      >
        <div
          style={{
            marginBottom: pxToRem(12),
            paddingInline: pxToRem(20),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography.Text
            style={{
              fontSize: pxToRem(20),
              fontWeight: 600,
              lineHeight: pxToRem(28)
            }}
          >
            Notifications & Tasks
          </Typography.Text>
          {size.xs && (
            <CloseOutlined
              style={{ color: '#00000073', fontSize: pxToRem(22) }}
              onClick={closeNotification}
            />
          )}
        </div>

        {notifications.length ? (
          <div
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              height: size.xs ? 'calc(100dvh - 110px)' : pxToRem(550)
            }}
            onScroll={onScrollPagination}
          >
            {notifications.map((notification: any) => (
              <NotificationCard
                notification={notification}
                key={notification.notificationId}
                openReport={openReport}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              height: '100%',
              width: size.xs ? '100vw' : '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Row>
              <Col
                span={24}
                style={{
                  textAlign: 'center'
                }}
              >
                <Image src={letterBox} alt={'letterBox'} />
                <Typography.Paragraph style={{ paddingTop: pxToRem(20) }}>
                  You don&apos;t have any new notifications
                </Typography.Paragraph>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </Spin>
  );
};
