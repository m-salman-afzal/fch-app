import React from 'react';
import { MinusOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { Formulary } from '@/types/formularyTypes';
import { Inventory } from '@/types/inventoryTypes';

import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';

import { PERMISSIONS_TYPES } from '@/utils/constants';
import { DeleteOption } from '@/utils/constantsComponents';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone,
  getIsBeforeDate
} from '@/utils/dateFormatsTimezones';
import {
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

import nestedNdcControlledRender from './getNdcNestedControlledIdRows';

const nestedRowRender = (
  pillClasses: any,
  inventoryNestedContainer: any,
  onClickInventoryEdit: any,
  onClickDelete: any,
  onClickActivate: any,
  expandedKeys: any[],
  setExpandedKeys: (keys: any[]) => void,
  controlledIdsNestedContainer: {
    controlledIdsNestedContainer: any;
    controlledIdsNestedContainerTr: any;
  },
  onClickControlledIdDelete: any,
  onClickControlledIdEdit: any,
  rowExpandableHide: any,
  permission: string
) => {
  const controlledRowRenderer = nestedNdcControlledRender(
    onClickControlledIdEdit,
    onClickControlledIdDelete,
    controlledIdsNestedContainer,
    permission
  );
  const rowClassName: any = (record: any) => {
    if (!record?.isControlled) {
      return rowExpandableHide;
    }

    return '';
  };
  const expandedRenderer = (parentValues: Formulary) => {
    const columns = [
      {
        key: 'ndc',
        title: 'NDC',
        dataIndex: 'ndc'
      },
      {
        key: 'manufacturer',
        title: 'Manufacturer',
        dataIndex: 'manufacturer'
      },
      {
        key: 'lotNo',
        title: 'Lot No',
        dataIndex: 'lotNo'
      },
      {
        key: 'expirationDate',
        title: 'Expiration Date',
        render: (values: Inventory) => (
          <div>
            {getFormattedDateNoTimeZone({
              date: values?.expirationDate,
              format: DATE_FORMATS.MDY
            })}
          </div>
        )
      },
      {
        key: 'status',
        title: 'Status',
        render: (values: Inventory) => (
          <ColorfulPill
            className={values.isActive ? pillClasses.green : pillClasses.grey}
            text={values.isActive ? 'Active' : 'Inactive'}
          />
        )
      },
      {
        key: 'quantity',
        title: 'Quantity',
        render: (values: Inventory) => (
          <div>{values.quantity.toLocaleString()}</div>
        )
      },
      permission === PERMISSIONS_TYPES.WRITE
        ? {
            key: 'actions',
            render: (values: Inventory) => (
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
                        onClick: () =>
                          onClickInventoryEdit(values, parentValues)
                      },
                      {
                        label: values.isActive ? 'Deactivate' : 'Activate',
                        key: 1,
                        disabled: getIsBeforeDate(
                          getFormattedDateNoTimeZone({
                            date: values?.expirationDate,
                            startOf: 'day'
                          }),
                          getFormattedDateNoTimeZone({ startOf: 'day' }),
                          'day'
                        ),
                        onClick: () => onClickActivate(values, parentValues)
                      },
                      {
                        label: <DeleteOption />,
                        key: 2,
                        onClick: () => onClickDelete(values, parentValues)
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
            )
          }
        : {
            key: 'actions'
          }
    ];

    return (
      <div className={inventoryNestedContainer}>
        <VsTable
          tableProps={{
            dataSource: parentValues.inventory,
            columns: columns,
            pagination: false,
            scroll: { x: 'auto' },
            rowClassName,
            expandable: {
              columnWidth: pxToRem(31),
              onExpand: (expanded, record) => {
                if (expanded) {
                  setExpandedKeys([record.inventoryId]);

                  return;
                }
                setExpandedKeys([]);
              },
              expandedRowRender: controlledRowRenderer,
              expandedRowKeys: expandedKeys,
              expandIcon: expandable => (
                <Button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: pxToRem(4),
                    height: pxToRem(18),
                    width: pxToRem(18),
                    padding: 0
                  }}
                  size="small"
                  shape="default"
                  onClick={e => expandable.onExpand(expandable.record, e)}
                  icon={
                    expandable.expanded ? (
                      <MinusOutlined
                        style={{
                          width: pxToRem(12),
                          height: pxToRem(12),
                          fontSize: pxToRem(12)
                        }}
                      />
                    ) : (
                      <PlusOutlined
                        style={{
                          width: pxToRem(12),
                          height: pxToRem(12),
                          fontSize: pxToRem(12)
                        }}
                      />
                    )
                  }
                ></Button>
              )
            }
          }}
        />
      </div>
    );
  };

  return expandedRenderer;
};

export default nestedRowRender;
