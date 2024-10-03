import {
  CommentOutlined,
  EyeOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { TableColumnsType, Tooltip } from 'antd';
import Image from 'next/image';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import type {
  TShiftCountComment,
  TShiftCountLogsData
} from '@/types/shiftCountTypes';

import RED_FLAG from '@/assets/icons/formulary/redFlag.svg';
import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import {
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

export const getShiftCountLogsColumns: (
  onClickCommentButton: (comment: TShiftCountComment) => void,
  onClickShiftCountLogView: (shitfCountLogId: string) => Promise<void>
) => TableColumnsType<TShiftCountLogsData> = (
  onClickCommentButton,
  onClickShiftCountLogView
) => {
  let columns: TableColumnsType<TShiftCountLogsData> = [
    {
      title: 'Date & Time',
      render: (value: TShiftCountLogsData) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            columnGap: pxToRem(8)
          }}
        >
          {getFormattedDateInEST({
            date: value.createdAt,
            format: DATE_FORMATS.MDY_TIME
          })}{' '}
          {value.isDiscrepancy && <Image alt="No Image" src={RED_FLAG} />}
        </div>
      ),
      width: pxToRem(120)
    },
    {
      title: 'Cart',
      width: pxToRem(100),
      dataIndex: 'cartName'
    },
    {
      title: 'Hand-Off',
      width: pxToRem(100),
      dataIndex: 'handOffName'
    },

    {
      title: 'Received',
      dataIndex: 'receiverName',
      width: pxToRem(100)
    },
    {
      title: 'Comments',
      width: pxToRem(110),

      render: (value: TShiftCountLogsData) => {
        return value.comment ? (
          <Tooltip title="View Comment">
            <div
              style={{
                border: '0px solid',
                display: 'flex',
                justifyContent: 'center',
                width: 'fit-content'
              }}
            >
              <VsButton
                onClick={() =>
                  onClickCommentButton({
                    commentText: value.comment,
                    commentDate: value.createdAt
                  })
                }
                size={BUTTON_SIZES.squareIcon}
                style={TABLE_BUTTON_STYLE}
              >
                <MessageOutlined style={TABLE_BUTTON_ICON_SIZE} />
              </VsButton>
            </div>
          </Tooltip>
        ) : (
          <></>
        );
      }
    },
    {
      width: pxToRem(58),
      render: (values: TShiftCountLogsData) => {
        return (
          <Tooltip title={'View'}>
            <div
              style={{
                border: '0px solid',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <VsButton
                onClick={() => onClickShiftCountLogView(values.shiftCountLogId)}
                style={TABLE_BUTTON_STYLE}
                size={BUTTON_SIZES.squareIcon}
              >
                <EyeOutlined style={TABLE_BUTTON_ICON_SIZE} />
              </VsButton>
            </div>
          </Tooltip>
        );
      }
    }
  ];

  return columns;
};
