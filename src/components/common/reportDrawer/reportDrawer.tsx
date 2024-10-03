import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState
} from 'react';
import { CloseOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Row, Typography } from 'antd';
import { VsButton, VsTextArea } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TSafeAssignmentComment } from '@/types/safeReportTypes';

import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import { useReportDrawerStyle } from './useReportDrawerStyle';

interface props {
  afterOpenChange?: (open: boolean) => void;
  isOpen: boolean;
  titleCtas?: ReactNode;
  onClickClose?: () => void;
  commentsArray: TSafeAssignmentComment[];
  isNewComment?: boolean;
  onClickCommentCancel?: () => void;
  onClickCommentSubmit?: (value: string) => Promise<void>;
  commentSubmitButtonText?: string;
  destroyOncllose?: boolean;
  isLoading?: boolean;
}

interface NewCommentProps {
  onClickCancel: () => void;
  onClickSubmit: (commentDetails: string) => Promise<void>;
  submitButtonText: string;
  isLoading?: boolean;
}
const NewComment: React.FC<NewCommentProps> = ({
  onClickCancel,
  onClickSubmit,
  submitButtonText,
  isLoading
}) => {
  const [commentText, setCommentText] = useState<string>('');
  const isSmall = window.screen.width <= 576;

  return (
    <>
      <Row>
        <Col span={24}>
          {' '}
          <VsTextArea
            onChange={e => setCommentText(e.target.value)}
            width="100%"
            autoSize={{ minRows: 8 }}
            placeholder="Comment (Optional)"
          />
        </Col>
      </Row>
      <Row
        style={{
          gap: !isSmall ? pxToRem(10) : undefined,
          marginBlockStart: pxToRem(16),
          marginBlockEnd: pxToRem(28)
        }}
        gutter={isSmall ? [10, 0] : undefined}
      >
        <Col xs={12} md={6} lg={5}>
          <VsButton
            style={{ width: isSmall ? '100%' : 'fit-content' }}
            size={BUTTON_SIZES.middle}
            onClick={onClickCancel}
          >
            Cancel
          </VsButton>
        </Col>

        <Col xs={12} md={12} lg={9}>
          {' '}
          <VsButton
            antButtonProps={{
              type: 'primary',
              loading: isLoading
            }}
            size={BUTTON_SIZES.middle}
            style={{ width: isSmall ? '100%' : 'fit-content' }}
            onClick={() => onClickSubmit(commentText)}
          >
            {submitButtonText}
          </VsButton>
        </Col>
      </Row>
    </>
  );
};
const ReportDrawer: React.FC<PropsWithChildren<props>> = ({
  children,
  isOpen,
  afterOpenChange,
  titleCtas,
  onClickClose = () => {},
  commentsArray = [],
  isNewComment,
  onClickCommentCancel = () => {},
  onClickCommentSubmit = async (e: string) => {},
  commentSubmitButtonText = '',
  destroyOncllose,
  isLoading
}) => {
  const {
    commentBox,
    drawerBody,
    reportBox,
    reportBoxFull,
    titleBox,
    titlePadding,
    siderCollapseButton,
    siderCollapseButtonClosed,
    commentBoxTitle,
    commentName,
    commentBody,
    commentBorder
  } = useReportDrawerStyle();
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false);
  const onClickComments = () => {
    setCommentsOpen(x => !x);
  };
  const isSmall = window.screen.width <= 576;

  useEffect(() => {
    if (isNewComment) {
      setCommentsOpen(isNewComment);
    }
  }, [isNewComment]);

  useEffect(() => {
    if (commentsArray.length > 0) {
      setCommentsOpen(true);

      return;
    }
    setCommentsOpen(false);
  }, [commentsArray, isOpen]);

  return (
    <Drawer
      classNames={{
        body: drawerBody,
        header: titlePadding
      }}
      height={isSmall && isNewComment ? 'auto' : '90%'}
      getContainer={isSmall ? 'body' : undefined}
      width={isSmall ? '100%' : 'fit-content'}
      open={isOpen}
      afterOpenChange={afterOpenChange}
      title={
        <div className={titleBox}>
          <div
            style={{
              marginInlineEnd: 'auto',
              minWidth: pxToRem(80)
            }}
          >
            {isSmall && isNewComment ? commentSubmitButtonText : 'Report'}
          </div>
          {isSmall && isNewComment ? <></> : titleCtas}
          <CloseOutlined
            style={{ marginInlineEnd: isSmall ? pxToRem(-8) : undefined }}
            onClick={onClickClose}
          />
        </div>
      }
      closeIcon={null}
      placement={isSmall ? 'bottom' : 'right'}
      destroyOnClose={destroyOncllose}
    >
      {isSmall && isNewComment ? (
        <div
          style={{ paddingInline: pxToRem(12), marginBlockStart: pxToRem(14) }}
        >
          <NewComment
            onClickCancel={onClickCommentCancel}
            onClickSubmit={onClickCommentSubmit}
            submitButtonText={commentSubmitButtonText}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <>
          {' '}
          <div className={commentsOpen ? reportBox : reportBoxFull}>
            {children}
          </div>
          <Button
            className={
              commentsOpen ? siderCollapseButton : siderCollapseButtonClosed
            }
            onClick={onClickComments}
            shape="circle"
            style={{
              minWidth: pxToRem(24),
              width: pxToRem(24),
              height: pxToRem(24),
              lineHeight: pxToRem(24),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MenuUnfoldOutlined />
          </Button>
          {commentsOpen && (
            <div className={commentBox}>
              <Typography.Title className={commentBoxTitle}>
                Comments
              </Typography.Title>
              {isNewComment && (
                <NewComment
                  onClickCancel={onClickCommentCancel}
                  onClickSubmit={onClickCommentSubmit}
                  submitButtonText={commentSubmitButtonText}
                  isLoading={isLoading}
                />
              )}
              {commentsArray.map(comment => (
                <div
                  className={commentBorder}
                  key={comment.safeAssignmentCommentId}
                >
                  <Typography.Text className={commentName}>
                    {comment.admin.lastName}, {comment.admin.firstName}
                  </Typography.Text>{' '}
                  <Typography.Text className={commentBody}>
                    {comment.comment}
                  </Typography.Text>
                  <div className={commentBody}>
                    {getFormattedDateInEST({
                      date: comment?.createdAt,
                      format: DATE_FORMATS.MDY_TIME
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Drawer>
  );
};

export default ReportDrawer;
