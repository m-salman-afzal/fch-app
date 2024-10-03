import { FC, useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Col, Dropdown, Grid, Row, Typography } from 'antd';
import { VsButton, VsSelectFormItem } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import VsSegmented from '@/components/common/segmented/VsSegmented';

import { NOTIFICATIONS_AND_TASKS_SCREENS } from '@/containers/notificationsAndTasks/constants';
import { ALL_OPTION } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

interface Props {
  selectedScreen: string;
  onScreenChange: (screen: any) => void;
  facilities: any[];
  onChangeFacilityFilter: (val: any) => void;
}

export const NotificationsAndTasksNavigation: FC<Props> = ({
  selectedScreen,
  onScreenChange,
  facilities,
  onChangeFacilityFilter
}) => {
  const size = useBreakpoint();
  const SCREENS = NOTIFICATIONS_AND_TASKS_SCREENS;
  const [currentFacility, setCurrentFacility] = useState<string>('All');

  return (
    <Row
      justify="space-between"
      style={{
        width: pxToRem(668),
        gap: size.xs ? pxToRem(16) : undefined,
        paddingInline: size.xs ? pxToRem(20) : undefined,
        paddingTop: size.xs ? pxToRem(7) : ''
      }}
    >
      {size.xs && (
        <Col span={24}>
          <Typography.Text style={{ fontSize: pxToRem(16), fontWeight: 600 }}>
            Notifications & Tasks
          </Typography.Text>
        </Col>
      )}

      <Col xs={24} md={12} style={{ height: pxToRem(32) }}>
        <VsSegmented
          segmentedProps={{
            options: SCREENS,
            defaultValue: SCREENS[0].value,
            block: true,
            value: selectedScreen,
            onChange: onScreenChange
          }}
        />
      </Col>
      {facilities.length > 0 && (
        <Col xs={size.xs ? 24 : undefined} style={{ height: pxToRem(32) }}>
          <Dropdown
            placement="bottomRight"
            trigger={['click']}
            menu={{
              selectable: true,
              multiple: false,
              items: facilities,
              onSelect: val => {
                setCurrentFacility(
                  facilities.find(f => f.key === val.key).label
                );
                onChangeFacilityFilter(val);
              },
              defaultSelectedKeys: [ALL_OPTION.key]
            }}
          >
            <VsButton
              size={BUTTON_SIZES.middle}
              style={{
                paddingInlineStart: pxToRem(9),
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
                  <span
                    style={{
                      fontSize: pxToRem(14)
                    }}
                  >
                    {currentFacility}
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
    </Row>
  );
};
