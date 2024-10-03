import { RollbackOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TCartFullfillmentPick } from '@/types/cartFulfillmentTypes';

import { ALLOCATION_STATUS_BACKEND } from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import {
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

export const getProcessedColumns: (
  onClickProfitUndo: (value: TCartFullfillmentPick) => void,
  permisson: boolean
) => any[] = (onClickProfitUndo, permission) => {
  const isSmall = window.screen.width <= 576;

  const dataArray = [
    {
      title: 'Date & Time',
      width: isSmall ? 150 : undefined,
      render: (value: TCartFullfillmentPick) => (
        <div>
          {getFormattedDateInEST({
            date: value?.pickedAt,
            format: DATE_FORMATS.MDY_TIME
          })}
        </div>
      )
    },
    {
      title: 'Drug',
      width: isSmall ? 150 : undefined,
      dataIndex: 'name'
    },
    {
      title: 'Package Qty',
      width: isSmall ? 150 : undefined,
      dataIndex: 'packageQuantity'
    },
    {
      title: 'Total Units',
      width: isSmall ? 150 : undefined,
      dataIndex: 'totalUnits'
    },
    {
      title: 'User',
      width: isSmall ? 150 : undefined,
      render: (values: TCartFullfillmentPick) => {
        return (
          <div>
            {values?.pickedByAdmin?.lastName},{' '}
            {values?.pickedByAdmin?.firstName}
          </div>
        );
      }
    }
  ];

  const action = {
    width: isSmall ? 58 : undefined,
    render: (values: TCartFullfillmentPick) => {
      return (
        <Tooltip title={'Undo'}>
          <div
            style={{
              border: '0px solid',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <VsButton
              antButtonProps={{
                disabled:
                  values.allocationStatus ===
                  ALLOCATION_STATUS_BACKEND.FULFILLED
              }}
              onClick={() => {
                onClickProfitUndo(values);
              }}
              style={TABLE_BUTTON_STYLE}
              size={BUTTON_SIZES.squareIcon}
            >
              <RollbackOutlined style={TABLE_BUTTON_ICON_SIZE} />
            </VsButton>
          </div>
        </Tooltip>
      );
    }
  };

  return permission ? [...dataArray, action] : dataArray;
};
