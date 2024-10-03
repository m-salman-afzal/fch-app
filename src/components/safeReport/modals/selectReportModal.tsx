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

import IssueIcon from '@/assets/icons/safeReport/issueIcon.svg';
import SafeIcon from '@/assets/icons/safeReport/safeIcon.svg';
import { useFetch } from '@/hooks/useFetch';
import { pxToRem } from '@/utils/sharedUtils';
import { API_BASE_URL, FACILITY_CHECKLIST_URL } from '@/utils/urls';

import { REPORT_OPTIONS } from '../layout/safeReportHistoryLayout';

const { useBreakpoint } = Grid;

interface Props {
  handleNext: () => void;
  open: boolean;
  setOpen: (x: boolean) => void;
  selected: string;
  setSelected: (x: string) => void;
  isChecklist: boolean;
}

export const SelectReportModal: FC<Props> = ({
  handleNext,
  open,
  setOpen,
  selected,
  setSelected,
  isChecklist
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
            fontSize: pxToRem(24),
            paddingLeft: pxToRem(25)
          }}
        >
          Select Report Type
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(435)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      onCancel={() => {
        setOpen(false);
        setSelected(REPORT_OPTIONS.SAFE);
      }}
    >
      <Divider style={{ marginTop: pxToRem(13), marginBottom: pxToRem(15) }} />
      <div
        style={{
          paddingInline: pxToRem(25),
          display: 'flex',
          gap: pxToRem(20)
        }}
      >
        <div
          style={{
            border:
              selected === REPORT_OPTIONS.SAFE
                ? `${pxToRem(2)} solid #0958D9`
                : `${pxToRem(1)} solid rgba(0, 0, 0, 0.15)`,
            cursor: 'pointer',
            borderRadius: 4,
            width: '100%',
            position: 'relative'
          }}
          onClick={() => setSelected(REPORT_OPTIONS.SAFE)}
        >
          {selected === REPORT_OPTIONS.SAFE && (
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
              height: pxToRem(105),
              flexDirection: 'column',
              gap: pxToRem(16)
            }}
          >
            <Image src={SafeIcon} width={42} height={42} alt="safe icon" />
            <Typography.Text style={{ fontWeight: 600 }}>SAFE</Typography.Text>
          </div>
        </div>
        <div
          style={{
            cursor: 'pointer',
            border:
              selected === REPORT_OPTIONS.ISSUE
                ? `${pxToRem(2)} solid #0958D9`
                : `${pxToRem(1)} solid rgba(0, 0, 0, 0.15)`,
            width: '100%',
            borderRadius: pxToRem(4),
            position: 'relative'
          }}
          onClick={() => setSelected(REPORT_OPTIONS.ISSUE)}
        >
          {selected === REPORT_OPTIONS.ISSUE && (
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
              height: pxToRem(105),
              flexDirection: 'column',
              gap: pxToRem(16)
            }}
          >
            <Image src={IssueIcon} width={42} height={42} alt="issue icon" />
            <Typography.Text style={{ fontWeight: 600 }}>Issue</Typography.Text>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          paddingRight: pxToRem(25),
          marginTop: pxToRem(16)
        }}
      >
        <VsButton
          antButtonProps={{
            type: 'primary',
            disabled: !isChecklist && selected === REPORT_OPTIONS.SAFE
          }}
          size={BUTTON_SIZES.large}
          onClick={handleNext}
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
