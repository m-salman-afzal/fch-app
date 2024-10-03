import React from 'react';
import { EyeOutlined, MessageOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TPerpetualInventoryDeduction } from '@/types/perpetualInventoryTypes';

import { PERMISSIONS_TYPES } from '@/utils/constants';
import { DeleteOption } from '@/utils/constantsComponents';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import {
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

import {
  PERPETUAL_INVENTORY_DEDUCTION_TYPES,
  PERPETUAL_SIGNATURE_TYPES
} from '../../../containers/controlsLogbook/constants';

export const nestedRowRender = (
  inventoryNestedContainer: any,
  onClickEdit: any,
  onClickDelete: any,
  onClickSignature: any,
  onClickComment: any,
  permission: string
) => {
  const expandedRenderer = (parentvalue: any) => {
    const columns = [
      {
        title: 'Date & Time',
        key: 'date',
        render: (value: TPerpetualInventoryDeduction) => (
          <div>
            {getFormattedDateNoTimeZone({
              date: `${value.date} ${value.time}`,
              format: DATE_FORMATS.MDY_TIME
            })}
          </div>
        )
      },
      {
        title: 'Patient Name',
        key: 'patientName',
        dataIndex: 'patientName'
      },
      {
        title: 'Provider Name',
        key: 'providerName',
        render: (value: TPerpetualInventoryDeduction) => (
          <div>{value.providerName}</div>
        )
      },
      {
        title: 'Dose Admin',
        key: 'doseAdministered',
        render: (value: TPerpetualInventoryDeduction) => (
          <div>
            {value.type ===
              PERPETUAL_INVENTORY_DEDUCTION_TYPES.DOSE_ADMINISTERED &&
              value.quantityDeducted}
          </div>
        )
      },
      {
        title: 'Wasted',
        key: 'wasted',
        render: (value: TPerpetualInventoryDeduction) => (
          <div>
            {value.type === PERPETUAL_INVENTORY_DEDUCTION_TYPES.WASTED &&
              value.quantityDeducted}
          </div>
        )
      },
      {
        title: 'Destroyed',
        key: 'destroyed',
        render: (value: TPerpetualInventoryDeduction) => (
          <div>
            {value.type === PERPETUAL_INVENTORY_DEDUCTION_TYPES.DESTROYED &&
              value.quantityDeducted}
          </div>
        )
      },
      {
        title: 'Transferred',
        key: 'transfered',
        render: (value: TPerpetualInventoryDeduction) => (
          <div>
            {value.type === PERPETUAL_INVENTORY_DEDUCTION_TYPES.TRANSFERRED &&
              value.quantityDeducted}
          </div>
        )
      },
      {
        title: 'Returned',
        key: 'quantity',
        render: (value: TPerpetualInventoryDeduction) => (
          <div>
            {(value.type ===
              PERPETUAL_INVENTORY_DEDUCTION_TYPES.RETURNED_TO_PATIENT ||
              value.type ===
                PERPETUAL_INVENTORY_DEDUCTION_TYPES.RETURNED_TO_PROPERTY) &&
              value.quantityDeducted}
          </div>
        )
      },
      {
        title: 'Admin By',
        key: 'adminName',
        render: (value: TPerpetualInventoryDeduction) => (
          <div>{`${value.admin.lastName}, ${value.admin.firstName}`}</div>
        )
      },
      {
        title: 'Staff Signature',
        key: 'quantity',
        render: (value: TPerpetualInventoryDeduction) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <VsButton
              antButtonProps={{
                type: 'default'
              }}
              onClick={() =>
                onClickSignature(
                  value,
                  PERPETUAL_SIGNATURE_TYPES.STAFF_SIGNATURE,
                  false
                )
              }
              style={TABLE_BUTTON_STYLE}
              size={BUTTON_SIZES.squareIcon}
            >
              <EyeOutlined style={TABLE_BUTTON_ICON_SIZE} />
            </VsButton>
          </div>
        )
      },
      {
        title: 'Witness',
        key: 'quantity',
        render: (value: TPerpetualInventoryDeduction) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <VsButton
              antButtonProps={{
                type: 'default'
              }}
              onClick={() =>
                onClickSignature(
                  value,
                  PERPETUAL_SIGNATURE_TYPES.WITNESS_SIGNATURE,
                  false
                )
              }
              style={TABLE_BUTTON_STYLE}
              size={BUTTON_SIZES.squareIcon}
            >
              <EyeOutlined style={TABLE_BUTTON_ICON_SIZE} />
            </VsButton>
          </div>
        )
      },
      {
        title: 'Comments',
        key: 'quantity',
        render: (value: TPerpetualInventoryDeduction) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {value.comment ? (
              <VsButton
                antButtonProps={{
                  type: 'default'
                }}
                onClick={() => onClickComment(value)}
                style={{
                  width: pxToRem(24),
                  height: pxToRem(24)
                }}
                size={BUTTON_SIZES.small}
              >
                <MessageOutlined
                  style={{
                    fontSize: pxToRem(20)
                  }}
                />
              </VsButton>
            ) : (
              ''
            )}
          </div>
        )
      }
    ];

    permission === PERMISSIONS_TYPES.WRITE &&
      columns.push({
        title: '',
        key: 'actions',
        render: (value: TPerpetualInventoryDeduction) => (
          <Dropdown
            placement={'bottomRight'}
            menu={{
              items: [
                {
                  label: 'Edit',
                  key: 0,
                  onClick: () => onClickEdit(value, parentvalue)
                },
                {
                  label: <DeleteOption />,
                  key: 2,
                  onClick: () => onClickDelete(value, parentvalue)
                }
              ]
            }}
            trigger={['click']}
          >
            <VsButton style={TABLE_BUTTON_STYLE} size={BUTTON_SIZES.squareIcon}>
              <MoreOutlined style={TABLE_BUTTON_ICON_SIZE} />
            </VsButton>
          </Dropdown>
        )
      });

    return (
      <div className={inventoryNestedContainer}>
        <VsTable
          tableProps={{
            dataSource: parentvalue.perpetualInventoryDeduction,
            columns: columns,
            pagination: false,
            scroll: {
              x: parentvalue.perpetualInventoryDeduction.length
                ? 'auto'
                : undefined,
              y: undefined
            }
          }}
        />
      </div>
    );
  };

  return expandedRenderer;
};
