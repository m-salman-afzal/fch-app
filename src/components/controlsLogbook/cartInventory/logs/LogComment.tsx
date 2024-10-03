import { FC } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Divider, Grid, Modal, Typography } from 'antd';

import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import { useInventoryTableStyle } from '../useCartInventoryStyle';

const { useBreakpoint } = Grid;
interface props {
  isOpen: boolean;
  comment?: string;
  dateTime?: string;
  onClose: () => void;
}

export const LogComment: FC<props> = ({
  isOpen,
  comment,
  onClose,
  dateTime
}) => {
  const size = useBreakpoint();
  const { commentModal, commentModalText, commentModalDate } =
    useInventoryTableStyle();

  return (
    <Modal
      title={
        <Typography.Title
          style={{
            paddingInlineStart: pxToRem(20),
            marginBlock: 0,
            fontSize: pxToRem(20)
          }}
        >
          Comment
        </Typography.Title>
      }
      open={isOpen}
      onCancel={onClose}
      destroyOnClose
      maskClosable={false}
      footer={null}
      centered
      width={size.xs ? '100vw' : pxToRem(573)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
    >
      <Divider
        style={{
          margin: `${pxToRem(12)} 0 0 0`,
          borderColor: '#00000026'
        }}
      />
      <div className={commentModal}>
        <Typography.Paragraph className={commentModalText}>
          {comment}
        </Typography.Paragraph>
        <Typography.Text className={commentModalDate}>
          {getFormattedDateNoTimeZone({
            date: dateTime,
            format: DATE_FORMATS.MDY_TIME
          })}
        </Typography.Text>
      </div>
    </Modal>
  );
};
