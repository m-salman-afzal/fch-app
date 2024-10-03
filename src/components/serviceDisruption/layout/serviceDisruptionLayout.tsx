import { PropsWithChildren } from 'react';
import { DownloadOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Grid, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TPagination } from '@/types/commonTypes';
import { TServiceDisruption } from '@/types/serviceDisruptionTypes';

import useCookies from '@/hooks/useCookies';
import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  PERMISSIONS_TYPES
} from '@/utils/constants';
import { DeleteOption } from '@/utils/constantsComponents';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import {
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

import { useServiceDisruptionTableStyle } from '../styles/useServiceDisruptionTableStyle';

interface props {
  onChangePagination: (page: number, pageSize: number) => void;
  onClickDownload: (value: TServiceDisruption) => void;
  onClickDelete: (value: any) => void;

  serviceDisruptions: TServiceDisruption[];
  isLoading: boolean;
  pagination: TPagination | undefined;
}

const { useBreakpoint } = Grid;

export const ServiceDisruptionLayout: React.FC<PropsWithChildren<props>> = ({
  onChangePagination,
  onClickDownload,
  onClickDelete,
  serviceDisruptions,
  isLoading,
  pagination
}) => {
  const size = useBreakpoint();

  const { getDataFromCookie } = useCookies();
  const admin = getDataFromCookie();

  const isSmall = window.screen.width <= 576;
  const { tableHeight } = useTablePaginationPosition();

  const { container } = useServiceDisruptionTableStyle();

  const columns: ColumnsType = [
    {
      title: 'Date & Time',
      width: 200,
      render: (value: TServiceDisruption) => (
        <div>
          {getFormattedDateNoTimeZone({
            date: `${value.date} ${value.time}`,
            format: DATE_FORMATS.MDY_TIME
          })}
        </div>
      )
    },
    {
      title: 'Service',
      width: 200,
      render: (value: TServiceDisruption) => <div> {value.service}</div>
    },
    {
      title: 'Reason',
      width: 250,
      ellipsis: true,
      render: (value: TServiceDisruption) => (
        <Tooltip title={value.reason} placement="topLeft">
          <div>{value.reason}</div>
        </Tooltip>
      )
    },
    {
      title: 'Patient Count',
      width: 150,
      render: (value: TServiceDisruption) => (
        <div>{value.serviceDisruptionPatients}</div>
      )
    },
    {
      title: '',
      width: 48,
      key: 'serviceDisruptionId',
      render: (values: TServiceDisruption) => (
        <>
          {admin.rbac.serviceDisruptions === PERMISSIONS_TYPES.WRITE ? (
            <Dropdown
              trigger={['click']}
              placement={'bottomRight'}
              menu={{
                items: [
                  {
                    key: 0,
                    label: 'Download',
                    onClick: () => onClickDownload(values)
                  },
                  {
                    key: 1,
                    label: <DeleteOption />,
                    onClick: () => onClickDelete(values.serviceDisruptionId)
                  }
                ]
              }}
            >
              <VsButton
                style={TABLE_BUTTON_STYLE}
                size={BUTTON_SIZES.squareIcon}
              >
                <MoreOutlined style={TABLE_BUTTON_ICON_SIZE} />
              </VsButton>
            </Dropdown>
          ) : (
            <Tooltip key={values.serviceDisruptionId} title={'Download'}>
              <div
                key={values.serviceDisruptionId}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <VsButton
                  key={values.serviceDisruptionId}
                  size={BUTTON_SIZES.squareIcon}
                  onClick={() => onClickDownload(values)}
                  style={TABLE_BUTTON_STYLE}
                >
                  <DownloadOutlined style={TABLE_BUTTON_ICON_SIZE} />
                </VsButton>
              </div>
            </Tooltip>
          )}
        </>
      )
    }
  ];

  return (
    <>
      <div className={container}>
        <VsTable
          tableProps={{
            loading: isLoading,
            columns: columns,
            dataSource: serviceDisruptions,
            sticky: true,
            pagination: {
              showTotal: size.sm
                ? (total: any, range: any) => {
                    return (
                      <Typography.Text>
                        Showing {range[1]} out of <strong>{total}</strong>
                      </Typography.Text>
                    );
                  }
                : undefined,
              pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
              showSizeChanger: !size.xs,
              defaultPageSize: isSmall
                ? DEFAULT_PAGE_SIZE.MOBILE
                : DEFAULT_PAGE_SIZE.DESKTOP,
              size: 'small',
              position: ['bottomCenter'],
              total: pagination?.totalItems,
              onChange: onChangePagination
            },
            scroll: {
              x: 'max-content',
              y: serviceDisruptions.length === 0 ? undefined : tableHeight
            }
          }}
        />
      </div>
    </>
  );
};
