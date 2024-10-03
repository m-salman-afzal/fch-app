import { FC, useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Divider, Grid, Modal, Typography } from 'antd';

import { InventoryBulkUploadTypes } from '@/types/inventoryBulkUploadTypes';

import { INVENTORY_BULK_OPTIONS } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { BulkUploadOptions } from './bulkUploadOptions';
import { InventoryReceiveOptions } from './receiveInventoryOptions';
import { useInventoryBulkUploadStyle } from './useInventoryBulkUpload';

const { useBreakpoint } = Grid;

interface Props {
  handleNext: () => void;
  open: boolean;
  setOpen: (x: boolean) => void;
  selected: string;
  setSelected: (x: InventoryBulkUploadTypes) => void;
  isControlled: boolean;
}

export const InventoryBulkUploadTypeModal: FC<Props> = ({
  open,
  setOpen,
  selected,
  setSelected,
  isControlled
}) => {
  const size = useBreakpoint();
  const { modalTitle } = useInventoryBulkUploadStyle();
  const [selectedOption, setSelectedOption] = useState(
    INVENTORY_BULK_OPTIONS.RECEIVE_INVENTORY
  );

  const [showReceiveInventoryOption, setReceiveInventoryOption] =
    useState(false);

  const handleSetlevelNext = () => {
    if (selectedOption === INVENTORY_BULK_OPTIONS.SET_LEVEL) {
      setOpen(false);

      return setSelected({ bulkUploadType: selectedOption });
    }

    setReceiveInventoryOption(true);
  };

  const handleInventoryOptionNext = (options: any) => {
    setOpen(false);
    setSelected({ bulkUploadType: selectedOption, ...options });
  };

  const restoreToDefaultState = () => {
    setSelectedOption(INVENTORY_BULK_OPTIONS.RECEIVE_INVENTORY);
    setReceiveInventoryOption(false);
  };

  useEffect(() => {
    restoreToDefaultState();
  }, [open]);

  const getComponent = () => {
    switch (showReceiveInventoryOption) {
      case true:
        return (
          <InventoryReceiveOptions
            isControlled={isControlled}
            handleNext={handleInventoryOptionNext}
          />
        );
      default:
        return (
          <BulkUploadOptions
            handleNext={handleSetlevelNext}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        );
    }
  };

  return (
    <Modal
      open={open}
      destroyOnClose={true}
      footer={null}
      style={{
        maxWidth: 'none',
        margin: 0
      }}
      title={
        <Typography.Title className={modalTitle}>Bulk Upload</Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100%' : pxToRem(515)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      onCancel={() => {
        setOpen(false);
        restoreToDefaultState();
      }}
    >
      <Divider style={{ marginTop: pxToRem(12), marginBottom: pxToRem(20) }} />

      {getComponent()}
    </Modal>
  );
};
