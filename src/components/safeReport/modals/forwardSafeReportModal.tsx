import { PropsWithChildren } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Col, Divider, Grid, Modal, Row, Typography } from 'antd';
import { BasicInput, VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { useSafeReportModalStyle } from '../styles/useSafeReportModalStyle';

interface props {
  onCloseModal: () => void;
  onSetForwarEmail: (value: string) => void;
  onForwardSubmit: () => void;
  onForwardCancel: () => void;
  open: boolean;
  isLoading: boolean;
}

const { useBreakpoint } = Grid;

export const ForwardSafeReportModal: React.FC<PropsWithChildren<props>> = ({
  onCloseModal,
  onSetForwarEmail,
  onForwardSubmit,
  onForwardCancel,
  isLoading,
  open
}) => {
  const size = useBreakpoint();
  const { divider, headerClassName, email, emailButton } =
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
          Send Report
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(493)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      zIndex={2147483647}
    >
      <Divider className={divider} />
      <Row className={email}>
        <BasicInput
          placeholder="Email"
          width="100%"
          onChange={value => onSetForwarEmail(value.target.value)}
          size="small"
        />
      </Row>
      <Divider className={divider} />
      <Col span={24}>
        <Row className={emailButton}>
          <Col span={11}>
            <VsButton
              antButtonProps={{
                loading: isLoading,
                onSubmit: onForwardCancel
              }}
              onClick={onForwardCancel}
              size={BUTTON_SIZES.large}
              style={{ width: '100%' }}
            >
              Cancel
            </VsButton>
          </Col>

          <Col span={11}>
            <VsButton
              antButtonProps={{
                loading: isLoading,
                type: 'primary',
                onSubmit: onForwardSubmit
              }}
              size={BUTTON_SIZES.large}
              style={{ width: '100%' }}
              onClick={onForwardSubmit}
            >
              Send
            </VsButton>
          </Col>
        </Row>
      </Col>
    </Modal>
  );
};
