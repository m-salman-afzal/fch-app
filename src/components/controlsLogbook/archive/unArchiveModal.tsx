import { FC } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Col, Grid, Modal, Row, Typography } from 'antd';
import Image from 'next/image';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import UNARCHIVE_SVG from '@/assets/icons/controlsLogbook/unarchive_modal.svg';
import { useCommonStyles } from '@/styles/useCommonStyles';
import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

interface Props {
  open: boolean;
  onCloseModal: () => void;
  isLoading: boolean;
  drugName: string;
  controlledId: string;
  onClickSave: () => Promise<void>;
}
export const UnArchiveModal: FC<Props> = ({
  open,
  onCloseModal,
  isLoading,
  drugName,
  controlledId,
  onClickSave
}) => {
  const size = useBreakpoint();

  const { unarchiveConfirmIcon, unarchiveConfirmIconContainer } =
    useCommonStyles();

  return (
    <Modal
      open={open}
      onCancel={onCloseModal}
      footer={null}
      style={{
        maxWidth: 'none'
      }}
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(325)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      destroyOnClose
    >
      <Row
        style={{
          borderBlockEnd: `${pxToRem(1)} solid  #00000026`,
          paddingBlockEnd: pxToRem(20)
        }}
      >
        <Col span={24} className={unarchiveConfirmIconContainer}>
          <div className={unarchiveConfirmIcon}>
            <Image alt={'MSG'} src={UNARCHIVE_SVG} width={48} height={48} />
          </div>
        </Col>
        <Col span={24}>
          <Typography.Paragraph
            style={{
              fontSize: pxToRem(20),
              fontWeight: 600,
              textAlign: 'center',
              marginBlock: pxToRem(16),
              marginBottom: pxToRem(16),
              paddingInline: pxToRem(20)
            }}
          >
            {`Are you sure you want to unarchive this Controlled ID?`}
          </Typography.Paragraph>
        </Col>

        <Row style={{ paddingInline: pxToRem(20) }}>
          <Col span={24}>
            <Typography.Text
              style={{
                color: '#000000A6',
                fontSize: pxToRem(14)
              }}
            >
              {drugName}
            </Typography.Text>
          </Col>
          <Col span={24}>
            <Typography.Text
              style={{
                color: '#000000A6',
                fontSize: pxToRem(14)
              }}
            >
              Controlled ID:{' '}
            </Typography.Text>
            <Typography.Text
              style={{
                color: '#000000E0',
                fontSize: pxToRem(14)
              }}
            >
              {controlledId}
            </Typography.Text>
          </Col>
        </Row>
      </Row>

      <Row
        justify={'space-between'}
        gutter={[14, 0]}
        style={{
          paddingBlockStart: pxToRem(12),
          paddingInline: pxToRem(20)
        }}
      >
        <Col span={12}>
          <VsButton
            style={{
              width: '100%'
            }}
            size={BUTTON_SIZES.large}
            onClick={onCloseModal}
          >
            No
          </VsButton>
        </Col>
        <Col span={12}>
          <VsButton
            style={{
              width: '100%'
            }}
            antButtonProps={{
              type: 'primary',
              loading: isLoading
            }}
            size={BUTTON_SIZES.large}
            onClick={onClickSave}
          >
            Yes
          </VsButton>
        </Col>
      </Row>
    </Modal>
  );
};
