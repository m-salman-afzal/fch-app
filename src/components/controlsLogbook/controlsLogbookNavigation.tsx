import { FC } from 'react';
import { Col, Grid, Row, Typography } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import { VsSelectFormItem } from 'vs-design-components';

import { SelectOption } from '@/types/commonTypes';

import VsSegmented from '@/components/common/segmented/VsSegmented';

import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

interface Props {
  selectedScreen: SelectOption;
  onChangeScreen: (val: string) => void;
  controlLogBookScreens: SelectOption[];
}

export const ControlsLogbookNavigation: FC<Props> = ({
  selectedScreen,
  controlLogBookScreens,
  onChangeScreen
}) => {
  const size = useBreakpoint();

  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <Row
          style={{
            gap: pxToRem(16),
            padding: size.xs ? `0 ${pxToRem(20)}` : '',
            paddingTop: size.xs ? pxToRem(7) : ''
          }}
        >
          {size.xs && (
            <Typography.Text style={{ fontSize: pxToRem(16), fontWeight: 600 }}>
              Controls Logbook
            </Typography.Text>
          )}
          {size.xs ? (
            <Col span={24}>
              <VsSelectFormItem
                options={controlLogBookScreens}
                onChange={(e: any) => {
                  onChangeScreen(e);
                }}
                formItemProps={{
                  style: {
                    marginBlockEnd: pxToRem(10)
                  }
                }}
                height={pxToRem(32)}
                externalShowLabel={false}
                defaultValue={controlLogBookScreens[0].value as string}
              />
            </Col>
          ) : (
            <Col span={24}>
              <VsSegmented
                segmentedProps={{
                  options: controlLogBookScreens,
                  value: selectedScreen.value,
                  onChange: (val: SegmentedValue) => {
                    onChangeScreen(val as string);
                  },
                  style: {
                    maxWidth: '100%',
                    width: 'auto'
                  }
                }}
              />
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};
