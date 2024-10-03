import { useState } from 'react';
import { FormInstance } from 'antd';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import {
  TCartAllocation,
  TCartAllocationControlledForm
} from '@/types/cartFulfillmentTypes';

import ReviewControlledModal from './reviewControlledModal';
import ReviewNonControlledListModal from './reviewNonControlledListModal';

interface props {
  isControlled: boolean;
  onClick: () => void;
  onCloseModal: () => void;
  onSubmit: (values?: TCartAllocationControlledForm) => Promise<void>;
  selectedData: TCartAllocation[];
  controlledFulfillForm: FormInstance<any>;
  isLoading: boolean;
}

const FulfillModalButton: React.FC<props> = ({
  isControlled,
  onClick,
  onCloseModal,
  onSubmit,
  controlledFulfillForm,
  selectedData,
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

  const onClickSubmit = async (values?: TCartAllocationControlledForm) => {
    await onSubmit(values);

    if (!isLoading) {
      setOpen(false);
    }
    setOpen(false);
  };

  return (
    <>
      <VsButton
        antButtonProps={{ type: 'primary' }}
        size={BUTTON_SIZES.middle}
        onClick={onClickButton}
      >
        Fulfill
      </VsButton>
      {isControlled ? (
        <ReviewControlledModal
          open={open}
          onCloseModal={onClose}
          onSubmit={onClickSubmit}
          selectedData={selectedData}
          controlledFulfillForm={controlledFulfillForm}
          isLoading={isLoading}
        />
      ) : (
        <ReviewNonControlledListModal
          open={open}
          onCloseModal={onClose}
          onSubmit={onClickSubmit}
          selectedData={selectedData}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default FulfillModalButton;
