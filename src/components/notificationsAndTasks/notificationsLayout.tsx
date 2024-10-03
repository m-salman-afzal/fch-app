import { FC, useState } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Divider,
  Dropdown,
  Grid,
  Row,
  Spin,
  theme,
  Typography
} from 'antd';
import Image from 'next/image';
import { VsButton, VsTooltip } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import clipboardIcon from '@/assets/icons/common/clipboard.svg';
import infoCircleIcon from '@/assets/icons/common/infoCircleOutlined.svg';
import shieldIcon from '@/assets/icons/common/shield.svg';
import unarchiveIcon from '@/assets/icons/notification/unarchive.svg';
import useCookies from '@/hooks/useCookies';
import {
  NOTIFICATION_TYPE,
  PERMISSION_PRIORITY,
  PERMISSIONS_TYPES
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import ShowMoreText from '../common/showMoreText/showMoreText';
import { useNotificationsAndTasksStyle } from './useNotificationsAndTasksStyle';

const { useBreakpoint } = Grid;
interface props {
  notifications: any;
  markAsArchive: (notification: any) => void;
  markAsRead: (notification: any, isRead: boolean) => void;
  onViewNotification: (notification: any) => void;
  isTask: (notification: any) => boolean;
}
export const NotificationsLayout: FC<props> = ({
  notifications,
  markAsArchive,
  markAsRead,
  onViewNotification,
  isTask
}) => {
  const {
    notificationInfo,
    facility,
    timeStamp,
    notificationActionItem,
    toggleText,
    rowDivider,
    comments,
    redDot
  } = useNotificationsAndTasksStyle();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { getDataFromCookie } = useCookies();
  const { rbac } = getDataFromCookie();
  const size = useBreakpoint();

  const getIcon = (notification: any) => {
    return isTask(notification)
      ? infoCircleIcon
      : notification.formulary || notification.cart
        ? clipboardIcon
        : shieldIcon;
  };

  return (
    <div>
      {notifications.map((notification: any, index: number) => {
        return (
          <div key={notification.key}>
            <Row
              wrap={false}
              style={{
                border:
                  hoveredIndex === index
                    ? '1px solid #69b1ff'
                    : '1px solid transparent',
                background: notification.isRead ? '' : '#F5F5F5',
                cursor: !isTask(notification) ? 'pointer' : undefined,
                paddingBlockStart:
                  index === 0
                    ? size.xs
                      ? pxToRem(20)
                      : pxToRem(24)
                    : size.xs
                      ? pxToRem(12)
                      : pxToRem(20),
                paddingBlockEnd:
                  index === notifications.length - 1
                    ? size.xs
                      ? pxToRem(20)
                      : pxToRem(24)
                    : size.xs
                      ? pxToRem(12)
                      : pxToRem(20),
                paddingInline: pxToRem(20)
              }}
              key={notification.key}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(event: any) => {
                event.stopPropagation();
                !isTask(notification) && onViewNotification(notification);
              }}
            >
              <Col
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  minWidth: pxToRem(49),
                  height: pxToRem(49)
                }}
              >
                <Image src={getIcon(notification)} alt={''} />
              </Col>

              <Col
                style={{
                  paddingInline: pxToRem(7),
                  minWidth: pxToRem(22),
                  paddingBlockStart: pxToRem(1.57142857142)
                }}
              >
                {!notification.isRead && <div className={redDot}></div>}
              </Col>

              <Col flex={'auto'}>
                <Row wrap={false}>
                  <Col
                    className={notificationInfo}
                    flex={!size.md ? 'auto' : undefined}
                  >
                    <Row>
                      <Typography.Text>
                        <strong
                          style={{
                            display: 'inline-block',
                            maxWidth: pxToRem(474),
                            wordWrap: 'break-word'
                          }}
                        >
                          {notification.title}
                        </strong>
                      </Typography.Text>
                    </Row>

                    <Row>
                      <Typography.Paragraph>
                        {notification.text}
                      </Typography.Paragraph>
                    </Row>

                    {(notification?.notificationType ===
                      NOTIFICATION_TYPE?.CONTROLLED_DRUG_DELETE ||
                      notification?.notificationType ===
                        NOTIFICATION_TYPE.CONTROLLED_DRUG_STATUS) && (
                      <Row>
                        <Typography.Paragraph>
                          {notification.subText}
                        </Typography.Paragraph>
                      </Row>
                    )}

                    {notification.safeAssignmentComment && (
                      <Row className={comments}>
                        <Divider
                          style={{
                            margin: 0,
                            marginBottom: pxToRem(6),
                            width: pxToRem(466)
                          }}
                        />
                        <Typography.Paragraph>
                          <a>
                            {`${notification.safeAssignmentComment?.admin?.lastName}, ${notification.safeAssignmentComment?.admin?.firstName}`}
                          </a>
                          <ShowMoreText
                            charlimit={200}
                            moreText="View Full Comment"
                            lessText="Hide Full Comment"
                            toggleTextClass={toggleText}
                          >
                            {notification.safeAssignmentComment.comment}{' '}
                          </ShowMoreText>
                        </Typography.Paragraph>
                      </Row>
                    )}
                  </Col>

                  <Col flex={size.md ? 'auto' : undefined}>
                    {isTask(notification) ? (
                      !notification.isArchived &&
                      size.md && (
                        <VsButton
                          onClick={() => {
                            onViewNotification(notification);
                          }}
                          antButtonProps={{
                            type: 'primary'
                          }}
                          style={{
                            width: pxToRem(80),
                            height: pxToRem(24),
                            paddingInline: pxToRem(8),
                            fontSize: pxToRem(14),
                            marginBlockEnd: pxToRem(6)
                          }}
                        >
                          Complete
                        </VsButton>
                      )
                    ) : (
                      <Row justify={'end'}>
                        <Col style={{ width: pxToRem(24) }}>
                          {notification.isArchived ? (
                            <VsButton
                              onClick={(event: any) => {
                                event.stopPropagation();
                                markAsArchive(notification);
                              }}
                              size={BUTTON_SIZES.small}
                              style={{
                                width: pxToRem(24),
                                height: pxToRem(24)
                              }}
                            >
                              <VsTooltip
                                title={'Unarchive'}
                                placement="bottom"
                                arrow
                              >
                                <Image src={unarchiveIcon} alt={''} />
                              </VsTooltip>
                            </VsButton>
                          ) : (
                            notification.isRead === 1 && (
                              <Dropdown
                                trigger={['click']}
                                key={notification}
                                placement={'bottomRight'}
                                menu={{
                                  items: [
                                    {
                                      key: 1,
                                      label: 'View',
                                      className: notificationActionItem,
                                      onClick: (event: any) => {
                                        event.domEvent.stopPropagation();
                                        onViewNotification(notification);
                                      }
                                    },
                                    {
                                      key: 2,
                                      label: 'Unread',
                                      className: notificationActionItem,
                                      onClick: (event: any) => {
                                        event.domEvent.stopPropagation();
                                        markAsRead(notification, false);
                                      }
                                    },
                                    {
                                      key: 3,
                                      label: 'Archive',
                                      className: notificationActionItem,
                                      onClick: (event: any) => {
                                        event.domEvent.stopPropagation();
                                        markAsArchive(notification);
                                      }
                                    }
                                  ].filter(item => {
                                    if (
                                      PERMISSION_PRIORITY[
                                        rbac[notification?.rbac] as string
                                      ] >
                                      PERMISSION_PRIORITY[
                                        notification?.minPermission as string
                                      ]
                                    ) {
                                      return item.key !== 1;
                                    }

                                    return item;
                                  })
                                }}
                              >
                                <Button
                                  onClick={(event: any) => {
                                    event.stopPropagation();
                                  }}
                                  icon={<MoreOutlined />}
                                  size="small"
                                />
                              </Dropdown>
                            )
                          )}
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Row>
                <Row justify={'space-between'}>
                  {!isTask(notification) && (
                    <Col>
                      <Typography.Paragraph className={facility}>
                        {notification.facilityName}
                      </Typography.Paragraph>
                    </Col>
                  )}
                  <Col>
                    <Typography.Paragraph className={timeStamp}>
                      {getFormattedDateInEST({
                        date: notification.dateTime,
                        format: DATE_FORMATS.MDY_TIME
                      })}
                    </Typography.Paragraph>
                  </Col>
                </Row>
                {isTask(notification) && !size.md && (
                  <Row>
                    <VsButton
                      onClick={() => {
                        onViewNotification(notification);
                      }}
                      antButtonProps={{
                        type: 'primary'
                      }}
                      style={{
                        width: pxToRem(80),
                        height: pxToRem(24),
                        paddingInline: pxToRem(8),
                        fontSize: pxToRem(14),
                        marginBlockEnd: pxToRem(6)
                      }}
                    >
                      Complete
                    </VsButton>
                  </Row>
                )}
              </Col>
            </Row>
            {index < notifications.length - 1 && (
              <Divider className={rowDivider} />
            )}
          </div>
        );
      })}
    </div>
  );
};
