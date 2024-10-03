import { InfoCircleFilled, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Progress, Tooltip, Typography } from 'antd';
import Image from 'next/image';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { Formulary } from '@/types/formularyTypes';

import FLAG_ICON from '@/assets/icons/formulary/redFlag.svg';
import { DRUG_CLASSES } from '@/containers/carFulfillment/constants';
import { FORMULARY_PACKAGES_LABEL, PERMISSIONS_TYPES } from '@/utils/constants';
import {
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

import ColorfulPill from '../common/colorfulPill/colorfulPill';
import InventoryLevels from './inventoryLevels';

type PillClassType = {
  red: string;
  green: string;
};

export const getInventoryColumns: (
  pillClasses: PillClassType,
  toolTipContainer: any,
  onClickRecieve: (data: Formulary) => void,
  onClickSetLevels: (data: Formulary) => void,
  onClickSetStock: (data: Formulary, key?: any) => void,
  permission: string,
  showControlled: boolean
) => any[] = (
  pillClasses,
  toolTipContainer,
  onClickRecieve,
  onClickSetLevels,
  onClickSetStock,
  permission,
  showControlled
) => {
  const isSmall = window.screen.width <= 576;

  return [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      ellipsis: true,
      width: pxToRem(105 - 55),
      render: (value: any) => (
        <Tooltip title={value} placement={`topLeft`}>
          <Typography.Text>{value}</Typography.Text>
        </Tooltip>
      )
    },
    {
      key: 'drugName',
      title: 'Drug',
      ellipsis: true,
      width: pxToRem(200 - 130),
      render: (value: any) => (
        <div style={{ display: 'flex', alignItems: 'start' }}>
          <Tooltip title={value?.name} placement={`topLeft`}>
            <Typography.Text>{value?.name}</Typography.Text>
          </Tooltip>
          {value.drugClass === DRUG_CLASSES.ARV && (
            <Tooltip
              overlayInnerStyle={{
                backgroundColor: '#000000E0',
                width: pxToRem(160),
                borderRadius: pxToRem(6)
              }}
              title={'This drug is not in the Sapphire formulary'}
            >
              <InfoCircleFilled
                style={{
                  marginLeft: pxToRem(6),
                  color: '#D48806'
                }}
              />
            </Tooltip>
          )}
        </div>
      )
    },
    {
      key: 'brandName',
      title: 'Brand Name',
      dataIndex: 'brandName',
      ellipsis: true,
      width: pxToRem(120),
      render: (value: any) => (
        <Tooltip title={value} placement={`topLeft`}>
          <Typography.Text>{value}</Typography.Text>
        </Tooltip>
      )
    },
    {
      key: 'strengthUnit',
      title: 'Strength Unit',
      dataIndex: 'strengthUnit',
      ellipsis: true,
      width: pxToRem(123),
      render: (value: any) => (
        <Tooltip title={value} placement={`topLeft`}>
          <Typography.Text>{value}</Typography.Text>
        </Tooltip>
      )
    },
    {
      key: 'package',
      title: 'Package',
      dataIndex: 'package',
      ellipsis: true,
      width: pxToRem(92),
      render: (value: any) => (
        <Tooltip title={value} placement={`topLeft`}>
          <Typography.Text>{FORMULARY_PACKAGES_LABEL(value)}</Typography.Text>
        </Tooltip>
      )
    },
    {
      key: 'unitsPkg',
      title: 'Units PKG',
      dataIndex: 'unitsPkg',
      ellipsis: true,
      width: pxToRem(101),
      render: (value: any) => (
        <Tooltip title={value} placement={`topLeft`}>
          <Typography.Text>{value}</Typography.Text>
        </Tooltip>
      )
    },
    {
      key: 'release',
      title: 'Release',
      dataIndex: 'release',
      ellipsis: true,
      width: pxToRem(120 - 30),
      render: (value: any) => (
        <Tooltip title={value} placement={`topLeft`}>
          <Typography.Text>{value}</Typography.Text>
        </Tooltip>
      )
    },
    {
      key: 'genericName',
      title: 'Generic Name',
      dataIndex: 'genericName',
      ellipsis: true,
      width: pxToRem(175 - 40),
      render: (value: any) => (
        <Tooltip title={value} placement={`topLeft`}>
          <Typography.Text>{value}</Typography.Text>
        </Tooltip>
      )
    },
    {
      key: 'generic',
      title: 'Generic',
      width: pxToRem(87),
      ellipsis: true,
      render: (value: Formulary) => (
        <Tooltip title={!!value.isGeneric ? 'Yes' : 'No'} placement={`topLeft`}>
          <div>{!!value.isGeneric ? 'Yes' : 'No'}</div>
        </Tooltip>
      )
    },
    {
      key: 'drugClass',
      title: 'Drug Class',
      dataIndex: 'drugClass',
      ellipsis: true,
      width: pxToRem(135 - 25),
      render: (value: any) => (
        <Tooltip title={value} placement={`topLeft`}>
          <Typography.Text>{value}</Typography.Text>
        </Tooltip>
      )
    },
    {
      key: 'controlleId',
      title: 'Controlled',
      width: pxToRem(100),
      render: (value: Formulary) => {
        const isNull =
          value.isControlled === null || value.isControlled === undefined;

        return isNull ? (
          <></>
        ) : (
          <div>
            {!!value.isControlled ? (
              <div style={{ paddingRight: pxToRem(6) }}>
                <Image
                  style={{ marginInlineEnd: pxToRem(6) }}
                  src={FLAG_ICON}
                  width={12}
                  alt="flag"
                />
                Yes
              </div>
            ) : (
              'No'
            )}
          </div>
        );
      }
    },
    {
      title: 'Formulary',
      key: 'isFormulary',
      align: 'left',
      width: pxToRem(125),
      render: (value: any) => (
        <Typography.Text>{value.isFormulary ? 'Yes' : 'No'}</Typography.Text>
      )
    },
    {
      key: 'stock',
      title: 'Central Supply',
      width: pxToRem(130),
      render: (value: Formulary) => {
        const isNull = value.isStock === null || value.isStock === undefined;

        return isNull ? (
          <></>
        ) : (
          <ColorfulPill
            className={value.isStock ? pillClasses.green : pillClasses.red}
            text={value.isStock ? 'Yes' : 'No'}
          />
        );
      }
    },
    {
      key: 'totalQuantity',
      title: 'Qty OH',
      width: pxToRem(85),
      fixed: !isSmall ? 'right' : undefined,
      render: (value: Formulary) => (
        <div>{value.totalQuantity?.toLocaleString()}</div>
      )
    },
    {
      key: 'orderedQty',
      title: 'Ordered Qty',
      width: pxToRem(120),
      fixed: !isSmall ? 'right' : undefined,
      render: (value: Formulary) => (
        <div>
          {typeof value.orderedQuantity === 'number' &&
            value?.orderedQuantity > 0 && (
              <Image
                style={{ marginInlineEnd: pxToRem(6) }}
                src={FLAG_ICON}
                width={12}
                alt="flag"
              />
            )}
          {typeof value.orderedQuantity === 'number' &&
          value?.orderedQuantity > 0
            ? value?.orderedQuantity?.toLocaleString()
            : '-'}
        </div>
      )
    },
    {
      key: 'level',
      title: 'Level',
      width: pxToRem(51 + 11.5),
      render: (value: Formulary) => (
        <Tooltip
          rootClassName={toolTipContainer}
          style={{
            maxWidth: pxToRem(330),
            display: 'flex',
            alignItems: 'center'
          }}
          title={
            <InventoryLevels
              threshold={value.threshold}
              parLevel={value.parLevel}
              quantity={value.totalQuantity}
              min={value.min}
              max={value.max}
            />
          }
          placement="bottomRight"
        >
          <Progress
            percent={
              value.totalQuantity > 0 && !!value.threshold && !!value.parLevel
                ? value.totalQuantity < value.threshold
                  ? 10
                  : value.totalQuantity > value.parLevel
                    ? 85
                    : 55
                : 0
            }
            size={[28, 8]}
            showInfo={false}
            trailColor="#00000026"
            strokeColor={
              value.totalQuantity < value.threshold
                ? '#FF4D4F'
                : value.totalQuantity > value.parLevel
                  ? '#FFD666'
                  : '#52C41A'
            }
          />
        </Tooltip>
      ),
      fixed: !isSmall ? 'right' : undefined
    },
    permission === PERMISSIONS_TYPES.WRITE
      ? {
          key: 'actions',
          render: (values: Formulary) => {
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
                        label: 'Receive Inventory',
                        key: 0,
                        onClick: () => onClickRecieve(values)
                      },
                      {
                        label: 'Set Levels or Central Supply',
                        key: 2,
                        onClick: () => onClickSetLevels(values)
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
          fixed: !isSmall ? 'right' : undefined
        }
      : {}
  ].filter(column => {
    if (column.title === 'Controlled') {
      return showControlled;
    }

    return true;
  });
};
