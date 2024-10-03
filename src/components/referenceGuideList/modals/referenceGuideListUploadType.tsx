import { FC, useEffect, useState } from 'react';
import {
  ArrowRightOutlined,
  CheckCircleFilled,
  CloseOutlined
} from '@ant-design/icons';
import { Divider, Grid, Modal, Typography } from 'antd';
import Image from 'next/image';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import FileAddIcon from '@/assets/icons/referenceGuideList/FileAddOutlined.svg';
import FileUpdateIcon from '@/assets/icons/referenceGuideList/FileSyncOutlined.svg';
import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

export const REFERENCE_UPLOAD_OPTIONS = {
  ADD_REFERENCE: 'ADD_REFERENCE',
  UPDATE_REFERENCE: 'UPDATE_REFERENCE'
};

interface Props {
  handleNext: () => void;
  open: boolean;
  setOpen: (x: boolean) => void;
  selected: string;
  setSelected: (x: string) => void;
}

export const ReferenceGuideListUploadTypeModal: FC<Props> = ({
  handleNext,
  open,
  setOpen,
  selected,
  setSelected
}) => {
  const size = useBreakpoint();

  return (
    <Modal
      open={open}
      destroyOnClose={true}
      footer={null}
      style={{
        maxWidth: 'none',
        margin: 0
      }}
      title={
        <Typography.Title
          style={{
            marginBlock: 0,
            fontSize: pxToRem(20),
            paddingLeft: pxToRem(20),
            fontWeight: '600'
          }}
        >
          Upload Reference Guide
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100%' : pxToRem(515)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      onCancel={() => {
        setOpen(false);
        setSelected(REFERENCE_UPLOAD_OPTIONS.ADD_REFERENCE);
      }}
    >
      <Divider style={{ marginTop: pxToRem(13), marginBottom: pxToRem(15) }} />
      <div
        style={{
          paddingInline: size?.xs ? pxToRem(20) : 0,
          display: 'flex',
          flexDirection: size?.xs ? 'column' : 'row',
          width: '100%',
          columnGap: 16
        }}
      >
        <div
          style={{
            border:
              selected === REFERENCE_UPLOAD_OPTIONS.ADD_REFERENCE
                ? `${pxToRem(2)} solid #0958D9`
                : `${pxToRem(1)} solid rgba(0, 0, 0, 0.15)`,
            cursor: 'pointer',
            borderRadius: pxToRem(4),
            width: size?.xs ? '90%' : pxToRem(229.5),
            position: 'relative',
            marginLeft: size?.xs ? 0 : pxToRem(20)
          }}
          onClick={() => setSelected(REFERENCE_UPLOAD_OPTIONS.ADD_REFERENCE)}
        >
          {selected === REFERENCE_UPLOAD_OPTIONS.ADD_REFERENCE && (
            <CheckCircleFilled
              style={{
                color: '#0958D9',
                fontSize: pxToRem(24),
                position: 'absolute',
                right: pxToRem(-10),
                top: pxToRem(-10),
                background: 'white'
              }}
            />
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: pxToRem(106),
              flexDirection: 'column',
              gap: pxToRem(16)
            }}
          >
            <Image src={FileAddIcon} width={42} height={42} alt="safe icon" />
            <Typography.Text style={{ fontWeight: 600 }}>
              New Guide
            </Typography.Text>
          </div>
        </div>
        <div
          style={{
            cursor: 'pointer',
            border:
              selected === REFERENCE_UPLOAD_OPTIONS.UPDATE_REFERENCE
                ? `${pxToRem(2)} solid #0958D9`
                : `${pxToRem(1)} solid rgba(0, 0, 0, 0.15)`,
            width: size?.xs ? '90%' : pxToRem(229.5),
            borderRadius: 4,
            position: 'relative',
            marginTop: size?.xs ? pxToRem(16) : 0,
            marginRight: size?.xs ? 0 : pxToRem(20)
          }}
          onClick={() => setSelected(REFERENCE_UPLOAD_OPTIONS.UPDATE_REFERENCE)}
        >
          {selected === REFERENCE_UPLOAD_OPTIONS.UPDATE_REFERENCE && (
            <CheckCircleFilled
              style={{
                color: '#0958D9',
                fontSize: pxToRem(24),
                position: 'absolute',
                right: pxToRem(-10),
                top: pxToRem(-10),
                background: 'white'
              }}
            />
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: pxToRem(106),
              flexDirection: 'column',
              gap: pxToRem(16)
            }}
          >
            <Image
              src={FileUpdateIcon}
              width={42}
              height={42}
              alt="issue icon"
            />
            <Typography.Text style={{ fontWeight: 600 }}>
              Modify an Existing Guide
            </Typography.Text>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: size?.xs ? pxToRem(16) : pxToRem(24),
          paddingInline: pxToRem(20),
          display: 'flex',
          justifyContent: size?.xs ? 'center' : 'end',
          width: size?.xs ? '90%' : '91%'
        }}
      >
        <VsButton
          antButtonProps={{
            type: 'primary'
          }}
          onClick={handleNext}
          style={{ width: size?.xs ? '100%' : pxToRem(100) }}
        >
          <div>
            <span style={{ paddingRight: pxToRem(8) }}> Next </span>
            <ArrowRightOutlined />
          </div>
        </VsButton>
      </div>
    </Modal>
  );
};
