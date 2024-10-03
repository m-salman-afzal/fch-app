import { FC } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Col, Modal, Row } from 'antd';
import { VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TRequestForm } from '@/types/requestFormDataTypes';

import { EllipsisTooltip } from '@/components/common/ellipsisTooltip/ellipsisTooltip';

import { REQUEST_FORM_TYPE } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useCartRequestTableStyle } from './useRequestFormTableStyle';

interface props {
  tableData: any[];
  onCancel: () => void;
  onSubmit: () => void;
  isOpen: boolean;
  requestFormData: TRequestForm;
  isLoading: boolean;
}

export const ReviewModal: FC<props> = ({
  tableData,
  onCancel,
  onSubmit,
  isOpen,
  requestFormData,
  isLoading
}) => {
  const modalTitle =
    requestFormData?.type === REQUEST_FORM_TYPE.AFTER_HOURS
      ? `After-hours Request: ${requestFormData?.label}`
      : `Standard Request: ${requestFormData?.label}`;
  const REVIEW_TABLE_COLUMNS = [
    {
      title: 'Drug',
      ellipsis: {
        showTitle: false
      },
      render: (value: any) => {
        return <EllipsisTooltip text={value.formulary.name} />;
      }
    },
    {
      title: 'Package',
      render: (value: any) => {
        return value.formulary.package;
      }
    },
    {
      title: 'Min',
      render: (value: any) => {
        return value.min;
      }
    },
    {
      title: 'Max',
      render: (value: any) => {
        return value.max;
      }
    },
    {
      title: 'Pending Orders',
      render: (value: any) => {
        return value.cartRequestForm?.pendingOrderQuantity || '-';
      }
    },
    {
      title: 'Pkg Qty',
      dataIndex: '__temp_pkgQty'
    }
  ];

  const { reviewModal } = useCartRequestTableStyle();
  const isSmall = window.screen.width <= 576;

  return (
    <Modal
      centered={!isSmall}
      rootClassName={reviewModal}
      className={reviewModal}
      title={modalTitle}
      open={isOpen}
      onCancel={onCancel}
      maskClosable={false}
      destroyOnClose={true}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      footer={
        <Row justify={'end'} gutter={14}>
          <Col>
            <VsButton
              onClick={onCancel}
              size={BUTTON_SIZES.large}
              style={{
                width: pxToRem(183)
              }}
            >
              Cancel
            </VsButton>
          </Col>
          <Col>
            <VsButton
              onClick={onSubmit}
              size={BUTTON_SIZES.large}
              style={{
                width:
                  requestFormData?.type === REQUEST_FORM_TYPE.AFTER_HOURS
                    ? undefined
                    : pxToRem(183)
              }}
              antButtonProps={{
                type: 'primary',
                loading: isLoading,
                disabled: !tableData.length
              }}
            >
              {requestFormData?.type === REQUEST_FORM_TYPE.AFTER_HOURS
                ? 'Remove from Inventory'
                : 'Submit'}
            </VsButton>
          </Col>
        </Row>
      }
    >
      <VsTable
        tableProps={{
          pagination: false,
          dataSource: tableData,
          columns: REVIEW_TABLE_COLUMNS,
          scroll: {
            x: 'max-content',
            y: 350
          }
        }}
      />
    </Modal>
  );
};
