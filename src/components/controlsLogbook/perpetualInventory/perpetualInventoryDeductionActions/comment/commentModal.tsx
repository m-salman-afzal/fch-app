import { CloseOutlined } from '@ant-design/icons';
import { Col, Divider, Grid, Modal, Row, Typography } from 'antd';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TPerpetualInventoryDeduction } from '@/types/perpetualInventoryTypes';

import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';

import { useCommentModalStyle } from './useCommentModalStyle';

interface Props {
  open: boolean;
  onCloseModal: () => void;
  perpetualInventoryDeduction: TPerpetualInventoryDeduction;
}

const { useBreakpoint } = Grid;

export const CommentModal: React.FC<Props> = ({
  open,
  onCloseModal,
  perpetualInventoryDeduction
}) => {
  const size = useBreakpoint();
  const { closeIcon, timeStamp } = useCommentModalStyle();

  return (
    <Modal
      open={open}
      onCancel={onCloseModal}
      footer={null}
      style={{
        maxWidth: 'none'
      }}
      className={closeIcon}
      title={
        <Typography.Title
          style={{
            fontSize: pxToRem(20),
            lineHeight: pxToRem(28),
            marginBlock: 0,
            paddingInlineStart: pxToRem(20)
          }}
        >
          Comment
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(573)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(24) }} />}
      destroyOnClose={true}
      styles={{
        content: { paddingBlock: pxToRem(19.5) },
        header: { marginBottom: 0, paddingBlockEnd: pxToRem(19.5) }
      }}
    >
      <div>
        <Divider
          style={{
            margin: 0,
            borderColor: '#00000026'
          }}
        />
        {perpetualInventoryDeduction && (
          <Col
            style={{
              borderRadius: pxToRem(18),
              padding: pxToRem(16),
              marginBlockStart: pxToRem(20),
              marginInline: pxToRem(20),
              background: 'rgba(0, 0, 0, 0.04)'
            }}
          >
            <Typography.Paragraph
              style={{
                marginBlockEnd: pxToRem(0),
                fontSize: pxToRem(14),
                fontWeight: 400
              }}
            >
              {perpetualInventoryDeduction.comment}{' '}
            </Typography.Paragraph>

            <Typography.Paragraph
              className={timeStamp}
              style={{
                marginBlockEnd: pxToRem(0),
                marginBlockStart: pxToRem(13)
              }}
            >
              {getFormattedDateInEST({
                date: perpetualInventoryDeduction.dateTime,
                format: DATE_FORMATS.MDY_TIME
              })}
            </Typography.Paragraph>
          </Col>
        )}
      </div>
    </Modal>
  );
};
