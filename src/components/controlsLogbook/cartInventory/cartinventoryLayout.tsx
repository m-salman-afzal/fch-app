import { FC, PropsWithChildren } from 'react';
import { Col, FormInstance, Grid, Row, Tag, Typography } from 'antd';
import { SegmentedLabeledOption } from 'antd/es/segmented';

import { TCartInventoryLogsFilterTypes } from '@/types/cartInventoryTypes';
import { SelectOption } from '@/types/commonTypes';

import { CART_INVENTORY_TABS } from '@/containers/controlsLogbook/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { CartInventoryNavigation } from './cartInventoryNavigation';

const { useBreakpoint } = Grid;

interface props {
  selectedTab: string;
  tabOptions: SegmentedLabeledOption[];
  selectedCart: undefined | SelectOption;
  logsFilterFormRef: FormInstance;
  cartData: SelectOption[];
  logsCarts: SelectOption[];
  onTabChange: (tab: string) => void;
  onCartChange: (cart: string) => void;
  onInventorySubmitClick: () => void;
  onInventorySearch: (text: string) => void;
  onLogsFilterReset: () => void;
  onLogsFilterApply: (filters: TCartInventoryLogsFilterTypes) => void;
}

export const CartInventoryLayout: FC<PropsWithChildren<props>> = ({
  tabOptions,
  selectedTab,
  selectedCart,
  logsFilterFormRef,
  children,
  cartData,
  logsCarts,
  onTabChange,
  onCartChange,
  onInventorySubmitClick,
  onInventorySearch,
  onLogsFilterReset,
  onLogsFilterApply
}) => {
  const size = useBreakpoint();

  return (
    <>
      <CartInventoryNavigation
        selectedCart={selectedCart}
        logsCarts={logsCarts}
        cartData={cartData}
        onInventorySearch={onInventorySearch}
        onInventorySubmitClick={onInventorySubmitClick}
        selectedTab={selectedTab}
        tabOptions={tabOptions}
        onTabChange={onTabChange}
        onCartChange={onCartChange}
        logsFilterFormRef={logsFilterFormRef}
        onLogsFilterReset={onLogsFilterReset}
        onLogsFilterApply={onLogsFilterApply}
      />

      {selectedCart && selectedTab === CART_INVENTORY_TABS.CART_INVENTORY && (
        <Row
          justify={'start'}
          style={{
            marginTop: pxToRem(12),
            padding: size.xs ? `0 ${pxToRem(20)}` : ''
          }}
        >
          <Col style={{ paddingLeft: pxToRem(4) }}>
            <Typography.Text>
              Cart:
              <Tag
                bordered={false}
                color="blue"
                style={{ marginLeft: pxToRem(8), fontSize: pxToRem(12) }}
              >
                {selectedCart?.label}
              </Tag>
            </Typography.Text>
          </Col>
        </Row>
      )}

      {children}
    </>
  );
};
