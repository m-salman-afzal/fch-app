import React, { PropsWithChildren } from 'react';
import { DownloadOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Grid, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TPagination } from '@/types/commonTypes';
import { TFile } from '@/types/fileTypes';

import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';
import { usePillStyle } from '@/components/common/colorfulPill/usePillStyle';

import { FACILITY_FREE_TABS } from '@/containers/file/fileContainer';
import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  FILE_NAVIGATION_OPTIONS,
  FILE_STATUS
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

import { useFileTableStyle } from '../styles/useFileTableStyle';

interface props {
  isLoading: boolean;
  files: TFile[];
  pagination: TPagination;
  onChangePagination: (page: number, pageSize: number) => void;
  onScreen: string;
  onClickUploadedDownload: (value: TFile) => void;
  onClickErrorDownload: (value: TFile) => void;
}

const { useBreakpoint } = Grid;
export const FileTableLayout: React.FC<PropsWithChildren<props>> = ({
  isLoading,
  files,
  pagination,
  onChangePagination,
  onScreen,
  onClickUploadedDownload,
  onClickErrorDownload
}) => {
  const size = useBreakpoint();
  const isSmall = window.screen.width <= 576;
  const {
    referenceGuideClassName,
    tableClassName,
    inventoryClassName,
    serviceDisruptionClassName
  } = useFileTableStyle();
  const { redPill, greenPill, greyPill, yellowPill } = usePillStyle();
  const statusColor = {
    Success: greenPill,
    Failed: redPill,
    Partial: yellowPill,
    'In Process': greyPill
  };

  const { tableHeight } = useTablePaginationPosition();

  const setStatus = (status: string) => {
    switch (status) {
      case FILE_STATUS.PROCESSED:
        return 'Success';

      case FILE_STATUS.PARTIAL:
        return 'Partial';

      case FILE_STATUS.FAILED:
        return 'Failed';

      case FILE_STATUS.QUEUED:
      case FILE_STATUS.RECEIVED:
      default:
        return 'In Process';
    }
  };

  const userColumns: ColumnsType = [
    {
      title: 'Date & Time',
      width: 160,
      render: (value: TFile) => (
        <div>
          {getFormattedDateInEST({
            date: value?.createdAt,
            format: DATE_FORMATS.MDY_TIME
          })}
        </div>
      )
    },
    {
      title: 'User',
      width: 160,
      render: (value: TFile) => (
        <div>{`${value.admin ? value.admin.lastName : '-'}, ${value.admin ? value.admin.firstName : '-'}`}</div>
      )
    },
    {
      title: 'Facility',
      width: 130,
      render: (value: TFile) => <div>{value.facilityName}</div>
    }
  ].filter(item => {
    if (
      FACILITY_FREE_TABS.indexOf(onScreen) !== -1 &&
      item.title === 'Facility'
    ) {
      return false;
    }

    return true;
  });

  const infoColumns: ColumnsType =
    onScreen !== 'inventory' && onScreen !== 'initialAllocation'
      ? [
          {
            title: 'Add',
            width: 130,
            render: (value: TFile) => (
              <div>{value.info ? value.info.addedCount : '-'}</div>
            )
          },
          {
            title: 'Edit',
            width: 130,
            render: (value: TFile) => (
              <div>{value.info ? value.info.updatedCount : '-'}</div>
            )
          },
          {
            title: 'Delete',
            width: 130,
            render: (value: TFile) => (
              <div>{value.info ? value.info.removedCount : '-'}</div>
            )
          }
        ]
      : [
          {
            title: 'Drug Count',
            width: 130,
            render: (value: TFile) => (
              <div>{value.info ? value.info.drugCount : '-'}</div>
            )
          },
          {
            title: 'Total Units',
            width: 130,
            render: (value: TFile) => (
              <div>
                {value.info
                  ? onScreen === 'inventory'
                    ? value.info.inventoryQuantity ?? 0
                    : value.info.totalUnits ?? 0
                  : '-'}
              </div>
            )
          }
        ];

  const statusColumns: ColumnsType = [
    {
      title: 'Failed',
      width: 130,
      render: (value: TFile) => (
        <div>{value.info ? value.info.failedCount : '-'}</div>
      )
    },
    {
      title: 'Status',
      width: 140,
      render: (value: TFile) => (
        <ColorfulPill
          className={statusColor[setStatus(value.status)]}
          text={`${setStatus(value.status)}`}
        />
      )
    },
    {
      title: '',
      width: 130,
      render: (value: TFile) => (
        <>
          <div>
            {value.isEf ? (
              <Dropdown
                placement={'bottomRight'}
                menu={{
                  items: [
                    {
                      label: 'Uploaded File',
                      key: 0,
                      icon: <DownloadOutlined />
                    },
                    {
                      label: 'Error File',
                      key: 1,
                      icon: <DownloadOutlined />
                    }
                  ],
                  onClick: items =>
                    items.key === '0'
                      ? onClickUploadedDownload(value)
                      : onClickErrorDownload(value)
                }}
                trigger={['click']}
              >
                <VsButton
                  antButtonProps={{
                    icon: <MoreOutlined style={TABLE_BUTTON_ICON_SIZE} />
                  }}
                  style={TABLE_BUTTON_STYLE}
                  size={BUTTON_SIZES.squareIcon}
                ></VsButton>
              </Dropdown>
            ) : (
              <Tooltip title={'Download'}>
                <div>
                  <VsButton
                    onClick={() => onClickUploadedDownload(value)}
                    style={TABLE_BUTTON_STYLE}
                    size={BUTTON_SIZES.squareIcon}
                  >
                    <DownloadOutlined style={TABLE_BUTTON_ICON_SIZE} />
                  </VsButton>
                </div>
              </Tooltip>
            )}
          </div>
        </>
      )
    }
  ];

  const columns = [...userColumns, ...infoColumns, ...statusColumns].filter(
    item => {
      if (
        onScreen === 'serviceDisruption' &&
        (item.title === 'Edit' || item.title === 'Delete')
      ) {
        return false;
      }

      return true;
    }
  );

  return (
    <>
      <div
        className={
          onScreen === 'referenceGuide'
            ? referenceGuideClassName
            : onScreen === 'inventory' || onScreen === 'initialAllocation'
              ? inventoryClassName
              : onScreen === 'serviceDisruption'
                ? serviceDisruptionClassName
                : tableClassName
        }
        style={{
          overflowY: 'auto',
          position: 'relative',
          paddingBottom: size.xs ? pxToRem(200) : pxToRem(150)
        }}
      >
        <VsTable
          tableProps={{
            loading: isLoading,
            columns: columns,
            dataSource: files,
            pagination: {
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
              defaultPageSize: isSmall
                ? DEFAULT_PAGE_SIZE.MOBILE
                : DEFAULT_PAGE_SIZE.DESKTOP,
              pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
              size: 'small',
              position: ['bottomCenter'],
              total: pagination.totalItems,
              onChange: onChangePagination
            },
            scroll: {
              x: 'max-content',
              y: files.length ? tableHeight : undefined
            }
          }}
        />
      </div>
    </>
  );
};
