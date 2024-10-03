import React, { FC } from 'react';
import Icon, { CloseOutlined } from '@ant-design/icons';
import { Col, Divider, Grid, Modal, Row, Tooltip, Typography } from 'antd';
import { VsButton, VsSelect, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';
import { usePillStyle } from '@/components/common/colorfulPill/usePillStyle';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  BRIDGE_THERAPY_SUPPLY_DAYS,
  PATIENT_STATUS_ACTIVE_RELEASED
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';

import { useBridgeTherapyStyle } from './bridgeTherapy/useBridgeTherapyStyle';
import { DeleteSvg } from './styles/svgs';
import { useSftpPatientsReviewListStyle } from './useSftpPatientsReviewListStyle';

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface Props {
  formRef?: any;
  loading: boolean;
  onSubmit?: any;
  showModal: boolean;
  onCancel?: any;
  sftpPatientsList?: any[];
  removePatientFromList?: any;
  showSupplyDays: boolean;
  onCloseModal: () => void;
}

const SftpPatientsReviewList: FC<Props> = Props => {
  const {
    loading,
    onSubmit,
    showModal,
    onCancel,
    sftpPatientsList = [],
    removePatientFromList,
    showSupplyDays,
    onCloseModal
  } = Props;

  const size = useBreakpoint();
  const { bluePill, greenPill } = usePillStyle();
  const { sftpPatientReviewListTableContainer, noSupplyDays } =
    useSftpPatientsReviewListStyle();
  const { tableHeight } = useTablePaginationPosition();

  const { selectBoxItemReview, selectBoxItem } = useBridgeTherapyStyle();

  const getStatusType = (statusType: string) => {
    for (const status of PATIENT_STATUS_ACTIVE_RELEASED) {
      if (status.value === statusType) {
        return status.label;
      }
    }

    return statusType;
  };

  const patientColumns: any = [
    {
      title: 'Name',
      key: 'name',
      align: 'left',
      ellipsis: true,
      render: (value: any) => (
        // <Text>{`${value.name}`}</Text>
        <Tooltip title={value?.name} placement={`topLeft`}>
          <Typography.Text>{value?.name}</Typography.Text>
        </Tooltip>
      )
    },
    {
      title: 'Status',
      key: 'status',
      align: 'left',
      render: (value: any) => (
        <ColorfulPill
          className={value.status === 'RELEASED' ? greenPill : bluePill}
          key={value.status}
          text={value.status}
        />
      )
    },
    {
      title: 'DOB',
      key: 'birthDate',
      align: 'left',
      render: (value: any) => (
        <Text>{`${getFormattedDateNoTimeZone({ date: value.dob, format: DATE_FORMATS.MDY })}`}</Text>
      )
    },
    {
      title: 'Booking Date',
      key: 'bookingDate',
      align: 'left',
      render: (value: any) => (
        <Text>
          {value.lastBookedDate
            ? `${getFormattedDateNoTimeZone({ date: value.lastBookedDate, format: DATE_FORMATS.MDY })}`
            : ''}
        </Text>
      )
    },
    {
      title: 'Location',
      key: 'location',
      align: 'left',
      render: (value: any) => (
        <Text>{value.location ? `${value.location}` : ''}</Text>
      )
    },
    {
      title: 'Released Date',
      key: 'releasedDate',
      align: 'left',
      render: (value: any) => (
        <Text>
          {value.lastReleaseDate
            ? `${getFormattedDateNoTimeZone({ date: value.lastReleaseDate, format: DATE_FORMATS.MDY })}`
            : ''}
        </Text>
      )
    },
    {
      title: 'Supply Days',
      render: (value: any) => {
        return (
          <div className={selectBoxItemReview}>
            {
              BRIDGE_THERAPY_SUPPLY_DAYS.find(
                sp => sp.value === value.supplyDays
              )?.label
            }
          </div>
        );
      }
    },
    {
      title: '',
      key: 'action',
      align: 'left',
      render: (value: any) => (
        <VsButton
          antButtonProps={{
            icon: <Icon component={DeleteSvg} />
          }}
          size={BUTTON_SIZES.squareIcon}
          onClick={() => {
            removePatientFromList(value);
          }}
        ></VsButton>
      )
    }
  ].filter(column => {
    if (column.title === 'Supply Days') {
      return showSupplyDays;
    }

    return true;
  });

  return (
    <Modal
      onCancel={onCloseModal}
      destroyOnClose={true}
      maskClosable={false}
      open={showModal}
      footer={null}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      width={size.xs ? '100vw' : pxToRem(1200)}
      style={{
        maxWidth: size.xs ? 'none' : ''
      }}
      centered
    >
      <Row style={{ gap: pxToRem(14) }}>
        <Col span={24}>
          <Typography.Text
            style={{
              paddingInlineStart: pxToRem(20),
              fontSize: pxToRem(20),
              fontWeight: 600,
              lineHeight: pxToRem(28)
            }}
          >
            Review SFTP List
          </Typography.Text>
        </Col>
        <Divider style={{ margin: 0 }} />
        <Col
          span={24}
          className={`${sftpPatientReviewListTableContainer} ${showSupplyDays ? '' : noSupplyDays}`}
        >
          <VsTable
            tableProps={{
              columns: patientColumns,
              dataSource: sftpPatientsList,
              loading: loading,
              scroll: {
                x: 'auto',
                y: sftpPatientsList.length === 0 ? undefined : tableHeight
              },
              pagination: {
                pageSize: sftpPatientsList.length,
                showSizeChanger: false,
                position: ['none']
              },
              style: {
                width: size.xs ? '100%' : ''
              }
            }}
          />
        </Col>
        <Divider style={{ margin: 0 }} />
        <Col span={24}>
          <Row justify={'end'} style={{ gap: 14 }}>
            <Col>
              <VsButton
                antButtonProps={{
                  loading: loading,
                  type: 'default'
                }}
                size={BUTTON_SIZES.middle}
                onClick={onCancel}
                style={
                  size?.xs
                    ? { width: '100%', height: pxToRem(40) }
                    : { width: pxToRem(183), height: pxToRem(40) }
                }
              >
                Cancel
              </VsButton>
            </Col>
            <Col style={{ paddingInlineEnd: pxToRem(20) }}>
              <VsButton
                antButtonProps={{
                  loading: loading,
                  type: 'primary',
                  disabled: sftpPatientsList.length === 0
                }}
                size={BUTTON_SIZES.middle}
                onClick={onSubmit}
                style={
                  size?.xs
                    ? { width: '100%', height: pxToRem(40) }
                    : { width: pxToRem(183), height: pxToRem(40) }
                }
              >
                Upload List
              </VsButton>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default SftpPatientsReviewList;
