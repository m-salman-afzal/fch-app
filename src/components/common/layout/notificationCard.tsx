import { FC } from 'react';
import { Col, Divider, Grid, Row, Typography } from 'antd';
import Image from 'next/image';

import { useNotificationsAndTasksStyle } from '@/components/notificationsAndTasks/useNotificationsAndTasksStyle';

import clipboardIcon from '@/assets/icons/common/clipboard.svg';
import shieldIcon from '@/assets/icons/common/shield.svg';
import infoCircle from '@/assets/icons/facilityChecklist/InfoCircleOutlined.svg';
import { NOTIFICATION_TYPE } from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import ShowMoreText from '../showMoreText/showMoreText';

interface Props {
  notification: Record<string, any>;
  openReport: (val: any) => void;
}

const { useBreakpoint } = Grid;

export const NotificationCard: FC<Props> = ({ notification, openReport }) => {
  const { toggleText, comments, redDot, notificationCard } =
    useNotificationsAndTasksStyle();
  const size = useBreakpoint();

  return (
    <Row
      style={{
        gap: pxToRem(5),
        cursor: 'pointer',
        paddingInline: pxToRem(20),
        paddingBlockStart: pxToRem(12)
      }}
      onClick={() => openReport(notification)}
      className={notificationCard}
    >
      <Col>
        <Image
          src={
            notification.formulary || notification.cart
              ? clipboardIcon
              : notification.notificationType ===
                  NOTIFICATION_TYPE.FACILITY_CHECKLIST_INCOMPLETE
                ? infoCircle
                : shieldIcon
          }
          alt={''}
          width={32}
          height={32}
        />
      </Col>
      <Col>{!notification.isRead && <div className={redDot}></div>}</Col>
      <Col span={20}>
        <Typography.Text>
          <strong
            style={{
              display: 'inline-block',
              maxWidth: pxToRem(370),
              wordWrap: 'break-word'
            }}
          >
            {notification.title}
          </strong>
        </Typography.Text>
        <Row gutter={[20, 0]} style={{ width: '100%' }}>
          <Col style={{ paddingRight: 0 }}>
            <Typography.Paragraph style={{ margin: 0 }}>
              {notification.text}
            </Typography.Paragraph>
            {(notification?.notificationType ===
              NOTIFICATION_TYPE.CONTROLLED_DRUG_DELETE ||
              notification?.notificationType ===
                NOTIFICATION_TYPE.CONTROLLED_DRUG_STATUS ||
              notification.notificationType ===
                NOTIFICATION_TYPE.DISCREPANCY) && (
              <Typography.Paragraph style={{ margin: 0 }}>
                {notification.subText}
              </Typography.Paragraph>
            )}
            {notification.safeAssignmentComment && (
              <Row>
                <Col className={comments} span={24}>
                  <Divider
                    style={{
                      margin: 0,
                      marginBottom: pxToRem(6)
                    }}
                  />
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    <a>
                      {`${notification.safeAssignmentComment?.admin?.lastName}, ${notification.safeAssignmentComment?.admin?.firstName}`}
                    </a>
                    <ShowMoreText
                      charlimit={50}
                      moreText="View Full Comment"
                      lessText="Hide Full Comment"
                      toggleTextClass={toggleText}
                    >
                      {notification.safeAssignmentComment.comment}
                    </ShowMoreText>
                  </Typography.Paragraph>
                </Col>
              </Row>
            )}

            {size.xs && (
              <Typography.Paragraph
                style={{
                  margin: 0,
                  marginBottom: 0,
                  fontSize: pxToRem(12),
                  color: '#00000073',
                  paddingTop: pxToRem(5)
                }}
              >
                {notification.facilityName}
              </Typography.Paragraph>
            )}
            <Typography.Paragraph
              style={{
                margin: 0,
                marginBottom: 0,
                fontSize: pxToRem(12),
                color: '#00000073',
                paddingTop: size.xs ? 0 : pxToRem(5)
              }}
            >
              {`${notification.notificationType !== NOTIFICATION_TYPE.FACILITY_CHECKLIST_INCOMPLETE && !size.xs ? `${notification.facilityName} - ` : ''}${getFormattedDateInEST(
                {
                  date: notification.dateTime,
                  format: DATE_FORMATS.MDY_TIME
                }
              )}`}
            </Typography.Paragraph>
          </Col>
        </Row>
      </Col>

      <Divider
        style={{
          marginBlockStart: pxToRem(7),
          marginBlockEnd: 0
        }}
      />
    </Row>
  );
};
