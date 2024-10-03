import { FC } from 'react';
import { Col, Grid, Row, Spin, Typography } from 'antd';
import Image from 'next/image';

import letterBox from '@/assets/icons/notification/letterBox.svg';
import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import { pxToRem } from '@/utils/sharedUtils';

import { NotificationsAndTasksNavigation } from './notificationsAndTasksNavigation';
import { useNotificationsAndTasksStyle } from './useNotificationsAndTasksStyle';

const { useBreakpoint } = Grid;

interface props {
  selectedScreen: string;
  onScreenChange: (screen: any) => void;
  facilities: any[];
  onChangeFacilityFilter: (val: string) => void;
  onScrollPagination: (event: any) => void;
  notifications: any[];
  children?: any;
  isLoading: boolean;
}
export const NotificationsAndTasksLayout: FC<props> = ({
  selectedScreen,
  onScreenChange,
  facilities,
  onChangeFacilityFilter,
  onScrollPagination,
  notifications,
  isLoading,
  children
}) => {
  const { dashboardContainer, notificationContainer, notificationCover } =
    useNotificationsAndTasksStyle();

  const getMaxHeight = () => {
    const screenWidth = window.screen.width;
    switch (screenWidth) {
      case 3840:
        return window.innerHeight - 275;
      case 2560:
        return window.innerHeight - 225;
      default:
        return window.innerHeight - 175;
    }
  };

  return (
    <Row justify={'center'} align={'middle'}>
      <Col>
        <Row>
          <NotificationsAndTasksNavigation
            selectedScreen={selectedScreen}
            onScreenChange={onScreenChange}
            facilities={facilities}
            onChangeFacilityFilter={onChangeFacilityFilter}
          />
        </Row>
        <Row>
          <Col className={dashboardContainer}>
            <Spin spinning={isLoading}>
              <Row className={notificationContainer} justify={'start'}>
                <Col
                  span={24}
                  className={notificationCover}
                  onScroll={onScrollPagination}
                  style={{
                    maxHeight: getMaxHeight()
                  }}
                >
                  {children}

                  {!notifications.length && (
                    <Row style={{ height: '100%' }}>
                      <Col
                        span={24}
                        style={{
                          textAlign: 'center',
                          marginBlock: pxToRem(72)
                        }}
                      >
                        <Image src={letterBox} alt={'letterBox'} />
                        <Typography.Paragraph
                          style={{ paddingTop: pxToRem(20) }}
                        >
                          You don&apos;t have any new notifications
                        </Typography.Paragraph>
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            </Spin>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
