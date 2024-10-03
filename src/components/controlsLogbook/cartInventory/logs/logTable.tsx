import { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Col, Grid, Modal, Row, Typography } from 'antd';
import { VsTable } from 'vs-design-components';

import { TPagination } from '@/types/commonTypes';

import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useInventoryTableStyle } from '../useCartInventoryStyle';

interface props {
  open: boolean;
  onCloseModal: () => void;
  drugLogsData: any[];
  isLoading: boolean;
  pagination: TPagination;
  onChangePagination: (page: number, pageSize: number) => Promise<void>;
}

const { useBreakpoint } = Grid;

export const LogDrugsModal: React.FC<props> = ({
  onCloseModal,
  open,
  drugLogsData = [],
  onChangePagination,
  isLoading,
  pagination
}) => {
  const isSmall = window.screen.width <= 576;

  const size = useBreakpoint();

  const { logDrugContainer } = useInventoryTableStyle();

  const tableColumns = [
    {
      title: 'Drug',
      key: 'drug',
      dataIndex: 'name'
    },
    {
      title: 'Controlled ID',
      key: 'controlledId',
      dataIndex: 'controlledId'
    },
    {
      title: 'TR/Rx',
      key: 'tr',
      dataIndex: 'tr'
    },
    {
      title: 'Qty',
      key: 'qty',
      dataIndex: 'quantity',
      width: 81
    }
  ];

  return (
    <Modal
      open={open}
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
          Cart Inventory Log
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : '75%'}
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
        <Col span={24} className={logDrugContainer}>
          <VsTable
            tableProps={{
              columns: tableColumns,
              dataSource: drugLogsData,
              loading: isLoading,
              pagination: {
                current: pagination.currentPage,
                showTotal: !size.xs
                  ? (total, range) => {
                      return (
                        <Typography.Text>
                          Showing {range[1]} out of <strong>{total}</strong>
                        </Typography.Text>
                      );
                    }
                  : undefined,
                showSizeChanger: !size.xs,
                defaultPageSize: isSmall
                  ? DEFAULT_PAGE_SIZE.MOBILE
                  : DEFAULT_PAGE_SIZE.DESKTOP,
                pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
                size: 'small',
                position: ['bottomCenter'],
                total: pagination.totalItems,
                onChange: onChangePagination
              },
              sticky: true,
              scroll: {
                x: 'max-content',
                y: drugLogsData.length ? 662 : undefined
              }
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};
