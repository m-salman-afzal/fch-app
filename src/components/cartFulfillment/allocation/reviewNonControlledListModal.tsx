import { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Col, Grid, Modal, Row, Typography } from 'antd';
import { VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import {
  TCartAllocation,
  TCartAllocationControlledForm
} from '@/types/cartFulfillmentTypes';

import { useAllocationTableStyle } from './allocationTableStyle';
import { getAllocationColumns } from './getAllocationTableColumns';

interface props {
  open: boolean;
  onCloseModal: () => void;
  onSubmit: (values?: TCartAllocationControlledForm) => Promise<void>;
  selectedData: TCartAllocation[];
  isLoading: boolean;
}
const { useBreakpoint } = Grid;

const ReviewNonControlledListModal: React.FC<props> = ({
  open,
  onCloseModal,
  onSubmit,
  selectedData = [],
  isLoading
}) => {
  const tableColumns = getAllocationColumns(false, () => {}, false);
  const size = useBreakpoint();
  const { modalContainer } = useAllocationTableStyle();

  return (
    <Modal
      open={open}
      destroyOnClose
      onCancel={onCloseModal}
      footer={null}
      title={
        <Typography.Title
          style={{
            paddingInlineStart: pxToRem(20),
            marginBlock: 0,
            fontSize: pxToRem(20)
          }}
        >
          Review Allocation List
        </Typography.Title>
      }
      maskClosable={false}
      centered
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      className={modalContainer}
      rootClassName={modalContainer}
    >
      <div
        style={{
          borderBlock: `${pxToRem(1)} solid #00000026`,
          marginBlockStart: pxToRem(13)
        }}
      >
        <Row style={{ paddingInline: pxToRem(20), paddingBlock: pxToRem(20) }}>
          <Col span={24}>
            <VsTable
              tableProps={{
                columns: tableColumns,
                dataSource: selectedData.sort((prev, next) => {
                  if (prev.cart.cart.localeCompare(next.cart.cart) === 0) {
                    return prev.formulary.name.localeCompare(
                      next.formulary.name
                    );
                  }

                  return prev.cart.cart.localeCompare(next.cart.cart);
                }),
                scroll: {
                  y: selectedData.length === 0 ? undefined : 500,
                  x: 'max-content'
                },
                pagination: false
              }}
            />
          </Col>
        </Row>
      </div>

      <Row
        justify={size.xs ? 'space-between' : 'end'}
        style={{ paddingInline: pxToRem(20), paddingBlockStart: pxToRem(20) }}
      >
        <VsButton
          size={BUTTON_SIZES.large}
          style={{
            width: size.xs ? '48%' : pxToRem(183),
            marginInlineEnd: !size.xs ? pxToRem(14) : undefined
          }}
          onClick={onCloseModal}
        >
          Cancel
        </VsButton>
        <VsButton
          antButtonProps={{ type: 'primary', loading: isLoading }}
          size={BUTTON_SIZES.large}
          style={{ width: size.xs ? '48%' : pxToRem(183) }}
          onClick={onSubmit}
        >
          Submit
        </VsButton>
      </Row>
    </Modal>
  );
};

export default ReviewNonControlledListModal;
