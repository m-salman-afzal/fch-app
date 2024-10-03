import { FC, useState } from 'react';
import { Col, Grid, Row, Typography } from 'antd';
import { VsSelectFormItem } from 'vs-design-components';

import VsSegmented from '@/components/common/segmented/VsSegmented';

import { CART_FULFILLMENT_SCREENS } from '@/containers/carFulfillment/constants';
import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

interface Props {
  selectedScreen: string;
  setSelectedScreen: (val: string) => void;
}

export const CartFulfillmentNavigation: FC<Props> = ({
  selectedScreen,
  setSelectedScreen
}) => {
  const size = useBreakpoint();

  return (
    <div style={size.xs ? { paddingInline: pxToRem(20) } : {}}>
      <Row
        justify={'space-between'}
        style={{ gap: pxToRem(16), paddingTop: size.xs ? pxToRem(7) : '' }}
      >
        {size.xs && (
          <Typography.Text style={{ fontSize: pxToRem(16), fontWeight: 600 }}>
            Cart Fulfillment
          </Typography.Text>
        )}
        {size.xs ? (
          <Col span={24}>
            <VsSelectFormItem
              options={CART_FULFILLMENT_SCREENS}
              onChange={(e: any) => {
                setSelectedScreen(e);
              }}
              formItemProps={{
                style: {
                  marginBlockEnd: pxToRem(10)
                }
              }}
              height={pxToRem(32)}
              value={selectedScreen}
              width={'100%'}
              externalShowLabel={false}
              defaultValue={CART_FULFILLMENT_SCREENS[0]?.value}
            />
          </Col>
        ) : (
          <VsSegmented
            segmentedProps={{
              options: CART_FULFILLMENT_SCREENS,
              defaultValue: CART_FULFILLMENT_SCREENS[0]?.value,
              block: true,
              value: selectedScreen,
              onChange: (val: any) => {
                setSelectedScreen(val);
              },
              style: { width: '80%' }
            }}
          />
        )}
      </Row>
    </div>
  );
};
