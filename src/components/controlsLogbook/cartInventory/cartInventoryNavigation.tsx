import { FC } from 'react';
import { Col, FormInstance, Grid, Row } from 'antd';
import { SegmentedLabeledOption } from 'antd/es/segmented';

import { TCartInventoryLogsFilterTypes } from '@/types/cartInventoryTypes';
import { SelectOption } from '@/types/commonTypes';

import TableSegmented from '@/components/common/subTabs/tableSegmented';

import { CART_INVENTORY_TABS } from '@/containers/controlsLogbook/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { InventoryActions } from './inventory/inventoryActions';
import { LogsActions } from './logs/LogsActions';

const { useBreakpoint } = Grid;

interface props {
  selectedTab: string;
  tabOptions: SegmentedLabeledOption[];
  logsFilterFormRef: FormInstance;
  cartData: SelectOption[];
  logsCarts: SelectOption[];
  selectedCart: undefined | SelectOption;
  onTabChange: (tab: string) => void;
  onCartChange: (cart: string) => void;
  onInventorySubmitClick: () => void;
  onInventorySearch: (text: string) => void;
  onLogsFilterReset: () => void;
  onLogsFilterApply: (filters: TCartInventoryLogsFilterTypes) => void;
}

export const CartInventoryNavigation: FC<props> = ({
  selectedTab,
  tabOptions,
  logsFilterFormRef,
  cartData,
  logsCarts,
  selectedCart,
  onTabChange,
  onCartChange,
  onInventorySubmitClick,
  onInventorySearch,
  onLogsFilterApply,
  onLogsFilterReset
}) => {
  const size = useBreakpoint();

  return (
    <>
      <Row style={{ padding: size.xs ? `0 ${pxToRem(20)}` : '' }}>
        <Col
          sm={12}
          xs={24}
          style={{ marginBottom: size.xs ? pxToRem(16) : 'auto' }}
        >
          <TableSegmented
            segmentedProps={{
              value: selectedTab,
              block: false,
              options: tabOptions,
              onChange: tab => onTabChange(tab as string)
            }}
          />
        </Col>
        <Col
          sm={12}
          xs={24}
          style={{ marginBottom: size.xs ? pxToRem(16) : 'auto' }}
        >
          {selectedTab === CART_INVENTORY_TABS.CART_INVENTORY && (
            <InventoryActions
              selectedCart={selectedCart}
              cartData={cartData}
              onSearch={onInventorySearch}
              onCartChange={onCartChange}
              onSubmitClick={onInventorySubmitClick}
            />
          )}

          {selectedTab === CART_INVENTORY_TABS.LOGS && (
            <LogsActions
              carts={logsCarts}
              formRef={logsFilterFormRef}
              onClickApply={onLogsFilterApply}
              onResetFilters={onLogsFilterReset}
            />
          )}
        </Col>
      </Row>
    </>
  );
};
