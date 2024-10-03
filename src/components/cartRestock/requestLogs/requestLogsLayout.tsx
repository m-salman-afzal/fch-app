import { FC } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Col, Grid, Row, theme, Tooltip, Typography } from 'antd';
import { VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TRequestLogs } from '@/types/requestLogsTypes';

import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';
import { tagRender } from '@/components/common/tagsForSelect/tags';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  REQUEST_FORM_TYPE,
  REQUEST_FORM_TYPE_LABEL
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import {
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

import { useRequestLogsStyle } from './useRequestLogsStyle';

interface props {
  tableData: any;
  downloadLogCsv: (value: TRequestLogs) => void;
  onPaginationChange: (currentPage: number, perPage: number) => void;
  isLoading: boolean;
}
const { useBreakpoint } = Grid;
const { useToken } = theme;
export const RequestLogsLayout: FC<props> = ({
  tableData,
  isLoading,
  downloadLogCsv,
  onPaginationChange
}) => {
  const { token } = useToken();

  const { tableContainer } = useRequestLogsStyle();
  const size = useBreakpoint();
  const isSmall = window.screen.width <= 576;
  const { tableHeight } = useTablePaginationPosition();

  const columns = [
    {
      title: 'Date & Time',
      width: isSmall ? 150 : undefined,
      render: (value: TRequestLogs) =>
        getFormattedDateInEST({
          date: value?.createdAt,
          format: DATE_FORMATS.MDY_TIME
        })
    },

    {
      title: 'User',
      width: isSmall ? 150 : undefined,
      render: (value: TRequestLogs) => {
        return `${value.admin.lastName}, ${value.admin.firstName}`;
      }
    },
    {
      title: 'Cart',
      width: isSmall ? 150 : undefined,
      render: (value: TRequestLogs) => {
        return value.cart.cart;
      }
    },
    {
      title: 'Type',
      width: isSmall ? 150 : undefined,
      render: (value: TRequestLogs) => {
        const style = {
          background: token.colorInfoBg,
          color: token.colorInfoText
        };

        return (
          <ColorfulPill
            text={REQUEST_FORM_TYPE_LABEL[value.type]}
            style={value.type === REQUEST_FORM_TYPE.STANDARD ? style : {}}
          />
        );
      }
    },
    {
      title: '',
      width: pxToRem(56),
      render: (value: TRequestLogs) => {
        return (
          <Tooltip title={'Download'} key={value.cartRequestLogId}>
            <div>
              <VsButton
                size={BUTTON_SIZES.squareIcon}
                style={TABLE_BUTTON_STYLE}
                onClick={() => {
                  downloadLogCsv(value);
                }}
              >
                <DownloadOutlined style={TABLE_BUTTON_ICON_SIZE} />
              </VsButton>
            </div>
          </Tooltip>
        );
      }
    }
  ];

  return (
    <div className={tableContainer}>
      <Row justify="start">
        <Col span={24}>
          <VsTable
            tableProps={{
              loading: isLoading,
              dataSource: tableData?.rows,
              columns,
              pagination: {
                onChange: onPaginationChange,
                total: tableData?.paginationInfo?.totalItems,
                pageSizeOptions: !size.xs
                  ? DEFAULT_PAGE_SIZE_OPTIONS
                  : undefined,
                showTotal: size.sm
                  ? (total, range) => {
                      return (
                        <Typography.Text>
                          Showing {range[1]} out of <strong>{total}</strong>
                        </Typography.Text>
                      );
                    }
                  : undefined,
                showSizeChanger: !size.xs,
                size: 'small',
                style: { alignItems: 'center' },
                defaultPageSize: isSmall
                  ? DEFAULT_PAGE_SIZE.MOBILE
                  : DEFAULT_PAGE_SIZE.DESKTOP,
                position: ['bottomCenter']
              },
              sticky: true,
              scroll: {
                x: 'max-content',
                y: tableData?.rows?.length === 0 ? undefined : tableHeight
              }
            }}
          />
        </Col>
      </Row>
    </div>
  );
};
