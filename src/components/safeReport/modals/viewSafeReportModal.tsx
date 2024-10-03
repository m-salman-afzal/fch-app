import { Fragment, PropsWithChildren } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Col, Divider, Grid, Modal, Row, Typography } from 'antd';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';

import { useSafeReportModalStyle } from '../styles/useSafeReportModalStyle';

interface props {
  onCloseModal: () => void;
  open: boolean;
  safeReportMessage: Partial<{
    description: string;
    createdAt: string;
  }>;
}

const { useBreakpoint } = Grid;

export const ViewSafeReportModal: React.FC<PropsWithChildren<props>> = ({
  onCloseModal,
  open,
  safeReportMessage
}) => {
  const size = useBreakpoint();
  const { divider, headerClassName, safeReportMessageStyle, messageDateTime } =
    useSafeReportModalStyle();

  return (
    <Modal
      className={headerClassName}
      open={open}
      onCancel={onCloseModal}
      destroyOnClose={true}
      footer={null}
      style={{
        maxWidth: 'none',
        margin: 0
      }}
      title={
        <Typography.Title style={{ marginBlock: 0, fontSize: pxToRem(20) }}>
          Report
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : '50vw'}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
    >
      <Divider className={divider} />
      <Row style={{ paddingInline: pxToRem(20) }}>
        <Col className={safeReportMessageStyle} span={24}>
          <Row
            style={{
              overflowY: 'auto',
              maxHeight: size.xs ? '70vh' : '50vh',
              fontSize: pxToRem(14)
            }}
          >
            {safeReportMessage.description &&
              safeReportMessage.description
                .split('<br/>')
                .map((line, index) => (
                  <Fragment key={index}>
                    {line}
                    <br />
                  </Fragment>
                ))}
          </Row>
          <Row className={messageDateTime}>
            {getFormattedDateInEST({
              date: `${safeReportMessage.createdAt}`,
              format: DATE_FORMATS.MDY_TIME
            })}
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};
