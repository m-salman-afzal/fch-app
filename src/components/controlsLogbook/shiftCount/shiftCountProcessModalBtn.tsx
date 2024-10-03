import { useState } from 'react';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import ShiftCountProcessModal, {
  ProcessModalProps
} from './shiftCountProceedModal';

type props = {
  isProceedEnabled: boolean;
  onClickProceed: () => void;
} & ProcessModalProps;

const ProcessModalButton: React.FC<props> = props => {
  return (
    <>
      <ShiftCountProcessModal {...props} />
      <VsButton
        antButtonProps={{
          type: 'primary',
          disabled: !props.isProceedEnabled
        }}
        onClick={props.onClickProceed}
        size={BUTTON_SIZES.middle}
      >
        Proceed
      </VsButton>
    </>
  );
};

export default ProcessModalButton;
