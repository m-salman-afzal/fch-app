import { Fragment } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Col, Grid, Modal, Row, Typography } from 'antd';

import { TShiftCountComment } from '@/types/shiftCountTypes';

import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import { useShiftCountStyle } from './style/useShiftCountStyle';

interface props {
  onCloseModal: () => void;
  openedComment?: TShiftCountComment;
}

const { useBreakpoint } = Grid;

const ViewCommentModal: React.FC<props> = ({ openedComment, onCloseModal }) => {
  const size = useBreakpoint();

  const { messageStyle, messageDateTime } = useShiftCountStyle();

  return (
    <Modal
      open={!!openedComment}
      onCancel={onCloseModal}
      footer={null}
      style={{
        maxWidth: 'none'
      }}
      title={
        <Typography.Title
          style={{
            paddingInlineStart: pxToRem(20),
            paddingBlockEnd: pxToRem(10),
            marginBlock: 0,
            fontSize: pxToRem(20),
            lineHeight: 0.9
          }}
        >
          Comment
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(533)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(20) }} />}
      destroyOnClose
    >
      <Row
        style={{
          borderBlockStart: `${pxToRem(1)} solid  #00000026`,
          paddingInline: pxToRem(20),
          paddingBlockStart: pxToRem(20)
        }}
      >
        <Col span={24}>
          <Col className={messageStyle} span={24}>
            <Row
              style={{
                overflowY: 'auto',
                maxHeight: size.xs ? '70vh' : '50vh',
                fontSize: pxToRem(14),
                paddingBlockEnd: pxToRem(12)
              }}
            >
              {openedComment?.commentText &&
                openedComment?.commentText.split('<br/>').map((line, index) => (
                  <Fragment key={index}>
                    {line}
                    <br />
                  </Fragment>
                ))}
            </Row>
            <Row className={messageDateTime}>
              {getFormattedDateInEST({
                date: `${openedComment?.commentDate}`,
                format: DATE_FORMATS.MDY_TIME
              })}
            </Row>
          </Col>
        </Col>
      </Row>
    </Modal>
  );
};

export default ViewCommentModal;
