import { MoreOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { ControlledDrug } from '@/types/inventoryTypes';

import { PERMISSIONS_TYPES } from '@/utils/constants';
import { DeleteOption } from '@/utils/constantsComponents';
import {
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

export const ANTIRETROVIRAL = 'Antiretroviral';
const nestedNdcControlledRender = (
  onClickControlledIdEdit: any,
  onClickControlledIdDelete: any,
  controlledIdsNestedContainer: any,
  permission: string
) => {
  const expandedNdcControlledIdsRender = (parentValues: any) => {
    const columns = [
      {
        title: 'Controlled ID',
        dataIndex: 'controlledId',
        key: 'controlledId'
      },
      parentValues?.isControlled && parentValues?.drugClass !== ANTIRETROVIRAL
        ? {
            title: 'TR',
            dataIndex: 'tr',
            key: 'tr'
          }
        : {},

      {
        title: 'Quantity',
        key: 'controlledQuantity',
        render: (values: any) => (
          <>{values.controlledQuantity?.toLocaleString()}</>
        )
      },
      permission === PERMISSIONS_TYPES.WRITE
        ? {
            key: 'actions',
            render: (values: ControlledDrug) => (
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
                          onClickControlledIdEdit(values, parentValues)
                      },
                      {
                        label: <DeleteOption />,
                        key: 2,
                        onClick: () =>
                          onClickControlledIdDelete(values, parentValues)
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
        : {}
    ];

    return (
      <div
        className={
          parentValues.drugClass === ANTIRETROVIRAL
            ? controlledIdsNestedContainer.controlledIdsNestedContainer
            : controlledIdsNestedContainer.controlledIdsNestedContainerTr
        }
      >
        <VsTable
          tableProps={{
            id: 'controlledIdTable',
            dataSource: parentValues?.controlledDrug as ControlledDrug[],
            columns: columns.filter((col: any) => {
              return col?.key;
            }),
            pagination: false,
            scroll: { x: 'auto' }
          }}
        />
      </div>
    );
  };

  return expandedNdcControlledIdsRender;
};

export default nestedNdcControlledRender;
