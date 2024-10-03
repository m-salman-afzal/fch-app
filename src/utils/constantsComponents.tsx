import { pxToRem } from './sharedUtils';

export const DeleteOption = () => {
  return (
    <div
      style={{
        borderBlockStart: `${pxToRem(1)} solid #BFBFBF`,
        paddingBlockStart: pxToRem(8)
      }}
    >
      Delete
    </div>
  );
};
