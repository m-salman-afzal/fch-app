import { InfoCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TCartAllocation } from '@/types/cartFulfillmentTypes';

import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import {
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

export const getAllocationColumns: (
  isFulfilled: boolean,
  onClickFulfilledUndo: (values: TCartAllocation) => void,
  permission: boolean
) => any[] = (isFulfilled, onClickFulfilledUndo, permission) => {
  const isSmall = window.screen.width <= 576;
  const columns = [
    {
      title: 'Drug',
      width: isSmall ? 150 : undefined,
      render: (value: TCartAllocation) => {
        return (
          <div>
            {value?.formulary?.name}{' '}
            {!value?.containsActive && !isFulfilled && (
              <Tooltip title="There is no inventory associated with this drug">
                <InfoCircleOutlined
                  style={{
                    fontSize: pxToRem(18),
                    color: '#FAAD14',
                    marginInlineStart: pxToRem(5)
                  }}
                />
              </Tooltip>
            )}
          </div>
        );
      }
    },
    {
      title: 'Request Date',
      width: isSmall ? 150 : undefined,

      render: (value: TCartAllocation) => {
        return (
          <div>
            {getFormattedDateInEST({
              date: value?.createdAt,
              format: DATE_FORMATS.MDY
            })}
          </div>
        );
      }
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
      title: 'Cart',
      width: isSmall ? 150 : undefined,

      render: (value: TCartAllocation) => {
        return <div>{value?.cart?.cart}</div>;
      }
    },
    {
      title: 'Ordered By',
      width: isSmall ? 150 : undefined,

      render: (value: TCartAllocation) => {
        return (
          <div>
            {value?.orderedByAdmin?.lastName},{' '}
            {value?.orderedByAdmin?.firstName}
          </div>
        );
      }
    }
  ];

  const columnsWithFulfilled = [
    ...columns.slice(0, 1),
    {
      title: 'Fulfilled Date',
      width: isSmall ? 150 : undefined,

      render: (value: TCartAllocation) => {
        return (
          <div>
            {getFormattedDateInEST({
              date: value?.allocatedAt,
              format: DATE_FORMATS.MDY
            })}
          </div>
        );
      }
    },
    ...columns.slice(1, 6),
    {
      title: 'Fulfilled By',
      width: isSmall ? 150 : undefined,
      render: (value: TCartAllocation) => {
        return (
          <div>
            {value?.allocatedByAdmin?.lastName},{' '}
            {value?.allocatedByAdmin?.firstName}
          </div>
        );
      }
    }
  ];

  const action = {
    width: pxToRem(58),
    render: (values: TCartAllocation) => {
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
              onClick={() => onClickFulfilledUndo(values)}
              style={TABLE_BUTTON_STYLE}
              size={BUTTON_SIZES.squareIcon}
            >
              <RollbackOutlined style={TABLE_BUTTON_ICON_SIZE} />
            </VsButton>
          </div>
        </Tooltip>
      );
    }
  } as any;

  return isFulfilled
    ? permission
      ? [...columnsWithFulfilled, action]
      : columnsWithFulfilled
    : columns;
};
