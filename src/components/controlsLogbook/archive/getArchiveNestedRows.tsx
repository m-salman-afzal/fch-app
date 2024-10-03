import React from 'react';
import { EyeOutlined, MessageOutlined, MoreOutlined } from '@ant-design/icons';
import { VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import {
  TPerpetualInventory,
  TPerpetualInventoryDeduction
} from '@/types/perpetualInventoryTypes';

import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import {
  PERPETUAL_INVENTORY_DEDUCTION_TYPES,
  PERPETUAL_SIGNATURE_TYPES
} from '../../../containers/controlsLogbook/constants';

export const nestedRowRender = (
  inventoryNestedContainer: any,
  onClickSignature: any,
  onClickComment: any
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
        title: 'Provider',
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
        dataIndex: 'adminName'
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
              style={{
                width: pxToRem(24),
                height: pxToRem(24)
              }}
              size={BUTTON_SIZES.squareIcon}
            >
              <EyeOutlined />
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
              style={{
                width: pxToRem(24),
                height: pxToRem(24)
              }}
              size={BUTTON_SIZES.small}
            >
              <EyeOutlined />
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
