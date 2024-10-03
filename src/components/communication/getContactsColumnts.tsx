import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Typography } from 'antd';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { PERMISSION_TYPES_BACKEND } from '@/utils/constants';
import { DeleteOption } from '@/utils/constantsComponents';
import {
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

export const getContactsColumns: (
  onClickEdit: (data: any) => void,
  onClickDelete: (data: any) => void,
  permission: any,
  showMoreFacility: (val: any) => void,
  showMoreReports: (val: any) => void,
  searchFilters: any
) => any[] = (
  onClickEdit,
  onClickDelete,
  permission,
  showMoreFacility,
  showMoreReports,
  searchFilters
) => {
  let columns: any[] = [
    {
      title: 'Name',
      key: 'name',
      width: pxToRem(214),
      render: (value: any) => {
        return (
          <Typography.Text>{`${value.lastName}, ${value.firstName}`}</Typography.Text>
        );
      }
    },
    {
      title: 'Email',
      key: 'Email',
      width: pxToRem(275),
      render: (value: any) => {
        return <Typography.Text>{value.email}</Typography.Text>;
      }
    },
    {
      title: 'Facility',
      key: 'Facility',
      width: pxToRem(214),
      render: (value: any) => {
        return (
          <div style={{ display: 'inline-flex' }}>
            {value.facility[0]?.facilityName}
            {showMoreFacility(value.facility)}
          </div>
        );
      }
    },
    {
      title: 'Report',
      key: 'Report',
      width: pxToRem(214),
      render: (value: any) => {
        return (
          <div style={{ display: 'inline-flex' }}>
            {value.process[0]?.processName}
            {showMoreReports(value.process)}
          </div>
        );
      }
    }
  ];
  permission === PERMISSION_TYPES_BACKEND.WRITE &&
    columns.push({
      title: '',
      key: 'actions',
      width: 56,
      render: (value: any) => {
        return (
          <>
            {
              <Dropdown
                placement={'bottomRight'}
                trigger={['click']}
                key={value}
                menu={{
                  items: [
                    {
                      key: 1,
                      label: 'Edit',
                      onClick: () => {
                        onClickEdit(value);
                      }
                    },
                    {
                      key: 2,
                      label: <DeleteOption />,
                      onClick: () => {
                        onClickDelete({
                          ...value,
                          contactId: value.contactId,
                          ...searchFilters
                        });
                      }
                    }
                  ]
                }}
              >
                <VsButton
                  antButtonProps={{
                    icon: <MoreOutlined style={TABLE_BUTTON_ICON_SIZE} />
                  }}
                  style={TABLE_BUTTON_STYLE}
                  size={BUTTON_SIZES.squareIcon}
                />
              </Dropdown>
            }
          </>
        );
      }
    });

  return columns;
};
