import { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Col, Grid, Modal, Row, Typography } from 'antd';
import { VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TCartFullfillmentPick } from '@/types/cartFulfillmentTypes';

import { getUnprocessedColumns } from './getUnprocessedTableColumns';
import { useUnprocessedTableStyle } from './unprocessedTableStyle';

interface props {
  onClick: () => void;
  onCloseModal: () => void;
  onProcess: () => Promise<void>;
  selectedData: TCartFullfillmentPick[];
  isLoading: boolean;
}
const { useBreakpoint } = Grid;

const ReviewPickListModal: React.FC<props> = ({
  onClick,
  onCloseModal,
  onProcess,
  selectedData = [],
  isLoading
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const onClickButton = () => {
    setOpen(true);
    onClick();
  };

  const onClose = () => {
    onCloseModal();
    setOpen(false);
  };

  const onClickProcess = async () => {
    await onProcess();

    if (!isLoading) {
      setOpen(false);
    }
    setOpen(false);
  };

  const tableColumns = getUnprocessedColumns();
  const size = useBreakpoint();
  const { modalContainer } = useUnprocessedTableStyle();

  return (
    <>
      <VsButton
        onClick={onClickButton}
        size={BUTTON_SIZES.middle}
        antButtonProps={{ type: 'primary' }}
        style={{ marginInlineStart: pxToRem(8) }}
      >
        Process
      </VsButton>
      <Modal
        open={open}
        destroyOnClose
        onCancel={onClose}
        footer={null}
        style={{
          maxWidth: pxToRem(900)
        }}
        title={
          <Typography.Title
            style={{
              paddingInlineStart: pxToRem(20),
              marginBlock: 0,
              fontSize: pxToRem(20)
            }}
          >
            Review Pick List
          </Typography.Title>
        }
        maskClosable={false}
        centered
        width={size.xs ? '100vw' : pxToRem(900)}
        closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      >
        <div
          style={{
            borderBlock: `${pxToRem(1)} solid #00000026`,
            marginBlockStart: pxToRem(13)
          }}
          className={modalContainer}
        >
          <Row
            style={{ paddingInline: pxToRem(20), paddingBlock: pxToRem(20) }}
          >
            <Col span={24}>
              <VsTable
                tableProps={{
                  columns: tableColumns,
                  dataSource: selectedData,
                  scroll: {
                    x: 'max-content',
                    y: selectedData.length === 0 ? undefined : 500
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
            onClick={onClose}
            antButtonProps={{ loading: isLoading }}
          >
            Cancel
          </VsButton>
          <VsButton
            antButtonProps={{ type: 'primary', loading: isLoading }}
            size={BUTTON_SIZES.large}
            style={{ width: size.xs ? '48%' : pxToRem(183) }}
            onClick={onClickProcess}
          >
            Process
          </VsButton>
        </Row>
      </Modal>
    </>
  );
};

export default ReviewPickListModal;
