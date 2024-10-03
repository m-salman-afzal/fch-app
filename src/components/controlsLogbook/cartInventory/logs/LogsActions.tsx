import { FC } from 'react';
import { Col, FormInstance, Grid, Row } from 'antd';
import { DrawerFilterButton } from 'vs-design-components';

import { TCartInventoryLogsFilterTypes } from '@/types/cartInventoryTypes';
import { SelectOption } from '@/types/commonTypes';

import { ALL } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { LogsFilter } from './LogsFilters';

const { useBreakpoint } = Grid;
interface props {
  carts: SelectOption[];
  formRef: FormInstance;
  onClickApply: (value: TCartInventoryLogsFilterTypes) => void;
  onResetFilters: () => void;
}

export const LogsActions: FC<props> = ({
  formRef,
  carts,
  onClickApply,
  onResetFilters
}) => {
  const size = useBreakpoint();

  return (
    <Row
      justify={size.xs ? 'start' : 'end'}
      gutter={16}
      style={{ marginBottom: pxToRem(12) }}
    >
      <Col>
        <DrawerFilterButton
          isIcon={size.xs}
          onClickApply={onClickApply}
          formRef={formRef}
          handleReset={() => {
            formRef.setFieldsValue({
              fromDate: '',
              toDate: '',
              cartId: ALL
            });
          }}
        >
          <LogsFilter cart={carts} />
        </DrawerFilterButton>
      </Col>
    </Row>
  );
};
