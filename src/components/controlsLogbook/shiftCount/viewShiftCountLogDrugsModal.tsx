import { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Col, Grid, Modal, Row, Typography } from 'antd';
import { VsTable } from 'vs-design-components';

import { TPagination } from '@/types/commonTypes';
import { TShiftCountLogDrugsData } from '@/types/shiftCountTypes';

import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { getShiftCountColumns } from './getShiftCountColumns';
import { useShiftCountStyle } from './style/useShiftCountStyle';

interface props {
  open: boolean;
  onCloseModal: () => void;
  scLogDrugs: TShiftCountLogDrugsData[];
  isLoading: boolean;
  pagination: TPagination;
  onChangePagination: (page: number, pageSize: number) => Promise<void>;
}

const { useBreakpoint } = Grid;

const ViewShiftCountLogDrugsModal: React.FC<props> = ({
  onCloseModal,
  open,
  scLogDrugs = [],
  onChangePagination,
  isLoading,
  pagination
}) => {
  const isSmall = window.screen.width <= 576;

  const size = useBreakpoint();

  const columns = getShiftCountColumns('', [], true);

  const { tableLogDrugContainer } = useShiftCountStyle();

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
          Shift Count Log
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : '80dvw'}
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
        <Col span={24} className={tableLogDrugContainer}>
          <VsTable
            tableProps={{
              columns: columns,
              dataSource: scLogDrugs,
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
                y: scLogDrugs.length ? 662 : undefined
              }
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ViewShiftCountLogDrugsModal;
