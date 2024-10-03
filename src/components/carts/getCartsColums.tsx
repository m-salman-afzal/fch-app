import { InfoCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Tag, Tooltip, Typography } from 'antd';
import Image from 'next/image';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TCartData } from '@/types/cartTypes';

import RED_FLAG from '@/assets/icons/formulary/redFlag.svg';
import { PERMISSION_TYPES_BACKEND } from '@/utils/constants';
import { DeleteOption } from '@/utils/constantsComponents';
import {
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

export const getCartsColumns: (
  onClickEdit: (data: any) => void,
  onClickDelete: (data: any) => void,
  permission: any,
  lastUpdate: any
) => any[] = (onClickEdit, onClickDelete, permission, lastUpdate) => {
  const isSmall = window.screen.width <= 576;
  const isIPhone = /iPhone|iPod/.test(navigator.userAgent);

  let columns: any[] = [
    {
      title: 'Cart',
      dataIndex: 'cart',
      width: isIPhone ? 150 : undefined,
      ellipsis: isIPhone ? true : undefined
    },
    {
      title: 'Reference Guide',
      width: isIPhone ? 150 : undefined,
      ellipsis: isIPhone ? true : undefined,
      render: (value: TCartData) => {
        return value?.referenceGuide?.isDeleted ? (
          <Typography.Text>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image alt="No Image" src={RED_FLAG} />
              <Typography.Text style={{ marginLeft: pxToRem(5) }}>
                {value?.referenceGuide?.name}
              </Typography.Text>
            </div>
          </Typography.Text>
        ) : (
          <Typography.Text>{value?.referenceGuide?.name}</Typography.Text>
        );
      }
    },
    {
      title: 'Assigned Units',
      width: isIPhone ? 225 : undefined,
      ellipsis: isIPhone ? true : undefined,
      render: (value: TCartData) => {
        return (
          <span>
            {value.units
              .slice(0, 5)
              .map(unit => unit.unit)
              .join(', ')}{' '}
            {value.units.length > 5 && ', '}
            <Tooltip
              title={value.units
                .slice(5, value.units.length)
                .map(unit => unit.unit)
                .join(', ')}
              trigger={['hover']}
            >
              {value.units.length > 5 && (
                <Tag
                  style={{
                    borderRadius: pxToRem(10),
                    height: pxToRem(20),
                    border: 'none',
                    minWidth: pxToRem(14),
                    backgroundColor: '#0000000F'
                  }}
                >
                  +{value.units.length - 5}
                </Tag>
              )}
            </Tooltip>
          </span>
        );
      }
    },
    {
      title: (value: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Patient Count
          <Tooltip
            style={{ marginInlineStart: pxToRem(6) }}
            title={`Updated at ${lastUpdate}`}
          >
            <InfoCircleOutlined
              style={{
                marginInlineStart: pxToRem(6),
                fontSize: pxToRem(16),
                color: '#00000073'
              }}
            />
          </Tooltip>
        </div>
      ),
      dataIndex: 'patientCount',
      width: isIPhone ? 145 : undefined,
      ellipsis: isIPhone ? true : undefined
    },
    {
      title: (value: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Drug Count
          <Tooltip title={`Updated at ${lastUpdate}`}>
            <InfoCircleOutlined
              style={{
                marginInlineStart: pxToRem(6),
                fontSize: pxToRem(16),
                color: '#00000073'
              }}
            />
          </Tooltip>
        </div>
      ),
      dataIndex: 'drugCount',
      width: isIPhone ? 130 : undefined,
      ellipsis: isIPhone ? true : undefined
    },
    {
      title: (value: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Total Qty
          <Tooltip
            style={{ marginInlineStart: pxToRem(6) }}
            title={`Updated at ${lastUpdate}`}
          >
            <InfoCircleOutlined
              style={{
                marginInlineStart: pxToRem(6),
                fontSize: pxToRem(16),
                color: '#00000073'
              }}
            />
          </Tooltip>
        </div>
      ),
      dataIndex: 'quantity',
      width: isIPhone ? 130 : undefined,
      ellipsis: isIPhone ? true : undefined
    }
  ];
  permission === PERMISSION_TYPES_BACKEND.WRITE &&
    columns.push({
      render: (value: TCartData) => {
        return (
          <div
            style={{
              border: '0px solid',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Dropdown
              placement={'bottomRight'}
              menu={{
                items: [
                  {
                    label: 'Edit',
                    key: 0,
                    onClick: () => onClickEdit(value)
                  },
                  {
                    label: <DeleteOption />,
                    key: 1,
                    onClick: () => onClickDelete(value)
                  }
                ]
              }}
              trigger={['click']}
            >
              <VsButton
                style={TABLE_BUTTON_STYLE}
                size={BUTTON_SIZES.squareIcon}
              >
                <MoreOutlined style={TABLE_BUTTON_ICON_SIZE} />
              </VsButton>
            </Dropdown>
          </div>
        );
      },
      width: isIPhone ? 59 : undefined,
      ellipsis: isIPhone ? true : undefined
    });

  return columns;
};
