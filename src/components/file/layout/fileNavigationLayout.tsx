import { PropsWithChildren } from 'react';
import { Col, Grid, Row } from 'antd';
import { VsSegmented, VsSelectFormItem } from 'vs-design-components';

import { FILE_NAVIGATION_OPTIONS } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

interface props {
  onChangeScreen: (e: any) => void;
  onScreen: string;
}
const { useBreakpoint } = Grid;
export const FileNavigationLayout: React.FC<PropsWithChildren<props>> = ({
  onChangeScreen,
  onScreen
}) => {
  const size = useBreakpoint();

  return (
    <Row justify="space-between" style={{ gap: pxToRem(16) }}>
      <Col span={24} style={{ height: pxToRem(32) }}>
        <VsSelectFormItem
          options={FILE_NAVIGATION_OPTIONS}
          onChange={onChangeScreen}
          height={pxToRem(32)}
          width={size.sm ? pxToRem(250) : undefined}
          externalShowLabel={false}
          value={onScreen}
          defaultValue={FILE_NAVIGATION_OPTIONS[0].value}
        />
      </Col>
    </Row>
  );
};
