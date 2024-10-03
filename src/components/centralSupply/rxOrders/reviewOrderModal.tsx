import React, { FC } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Col, Divider, Grid, Modal, Row, Tooltip, Typography } from 'antd';
import Image from 'next/image';
import { VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import RED_FLAG from '@/assets/icons/formulary/redFlag.svg';

import { useRxOrdersStyle } from './useRxOrdersStyle';

const { useBreakpoint } = Grid;

interface Props {
  loading?: boolean;
  onSubmit?: any;
  showModal: boolean;
  onCancel?: any;
  onCloseModal: () => void;
  reviewOrderList: any[];
}

const ReviewOrderListModal: FC<Props> = Props => {
  const {
    loading,
    onSubmit,
    showModal,
    onCancel,
    onCloseModal,
    reviewOrderList = []
  } = Props;

  const size = useBreakpoint();
  const { reviewOrderTableContainer } = useRxOrdersStyle();

  let columns: any[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      width: 65
    },
    {
      title: 'Drug',
      align: 'left',
      key: 'drugName',
      ellipsis: true,
      width: 240,
      render: (value: any) => (
        <div style={{ display: 'flex', alignItems: 'start' }}>
          <Tooltip title={value?.name} placement={`topLeft`}>
            <Typography.Text
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
            >
              {value?.name}
            </Typography.Text>
          </Tooltip>
        </div>
      )
    },
    {
      title: 'Brand Name',
      align: 'left',
      key: 'brandName',
      width: 110,
      ellipsis: true,
      render: (value: any) => (
        <Typography.Text>{value?.brandName}</Typography.Text>
      )
    },
    {
      title: 'Generic Name',
      align: 'left',
      key: 'genericName',
      width: 150,
      ellipsis: true,
      render: (value: any) => (
        <Typography.Text>{value?.genericName}</Typography.Text>
      )
    },
    {
      title: 'Controlled',
      key: 'isControlled',
      align: 'left',
      width: pxToRem(125),
      render: (value: any) => (
        <Typography.Text>
          {value.isControlled ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image alt="No Image" src={RED_FLAG} />
              <Typography.Text style={{ marginLeft: pxToRem(5) }}>
                Controlled
              </Typography.Text>
            </div>
          ) : (
            `No`
          )}
        </Typography.Text>
      )
    },
    {
      title: 'Qty Order',
      align: 'left',
      key: 'quantityOrder',
      width: pxToRem(70),
      ellipsis: true,
      render: (value: any) => (
        <Typography.Text>{value?.orderedQuantity}</Typography.Text>
      )
    }
  ];

  return (
    <Modal
      onCancel={onCloseModal}
      destroyOnClose={true}
      maskClosable={false}
      open={showModal}
      footer={null}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      width={size.xs ? '100vw' : '80%'}
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
            Review Rx Orders
          </Typography.Text>
        </Col>
        <Divider style={{ margin: 0 }} />
        <Col span={24} className={reviewOrderTableContainer}>
          <VsTable
            tableProps={{
              columns,
              dataSource: reviewOrderList.sort(function (a, b) {
                if (a?.name?.toLowerCase() < b?.name?.toLowerCase()) {
                  return -1;
                }
                if (a?.name?.toLowerCase() > b?.name?.toLowerCase()) {
                  return 1;
                }

                return 0;
              }),
              loading: loading,
              sticky: true,
              scroll: {
                x: 'max-content',
                y: 500
              },
              pagination: {
                pageSize: reviewOrderList?.length,
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
          <Row justify={size?.xs ? `center` : `end`} style={{ gap: 14 }}>
            <Col style={size?.xs ? { width: '42%' } : {}}>
              <VsButton
                antButtonProps={{
                  type: 'default',
                  loading
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
            <Col
              style={
                size?.xs ? { width: '42%' } : { paddingInlineEnd: pxToRem(20) }
              }
            >
              <VsButton
                antButtonProps={{
                  type: 'primary',
                  disabled: reviewOrderList?.length === 0,
                  loading
                }}
                size={BUTTON_SIZES.middle}
                onClick={onSubmit}
                style={
                  size?.xs
                    ? { width: '100%', height: pxToRem(40) }
                    : { width: pxToRem(183), height: pxToRem(40) }
                }
              >
                Submit
              </VsButton>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default ReviewOrderListModal;
