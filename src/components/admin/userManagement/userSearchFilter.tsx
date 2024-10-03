import { ChangeEvent, FC, useState } from 'react';
import {
  DownloadOutlined,
  DownOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { Col, Dropdown, Grid, Row, Typography } from 'antd';
import { CSVLink } from 'react-csv';
import { VsButton } from 'vs-design-components';
import { FilterSearch, VsTooltip } from 'vs-design-components/src/Components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { UserFilters } from '@/types/adminTypes';
import { SelectOption } from '@/types/commonTypes';

import {
  ADMINS_CSV_HEADERS,
  ALL,
  ALL_OPTION,
  PERMISSION_TYPES_BACKEND
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';

interface props {
  csvAdmins: any;
  onSearchName: (e: ChangeEvent<HTMLInputElement>) => void;
  openBulkUploadModel: () => void;
  onSelectRoles: (e: any) => void;
  onSelectFacility: (e: any) => void;
  openNewUserModal: () => void;
  roleOptions: SelectOption[];
  facilitiesOptions: SelectOption[];
  filters: UserFilters;
  userManagementAccess: boolean;
}

const { useBreakpoint } = Grid;

const UserSearchFilter: FC<props> = ({
  csvAdmins,
  roleOptions,
  facilitiesOptions,
  filters,
  userManagementAccess,
  onSearchName,
  openBulkUploadModel,
  onSelectRoles,
  onSelectFacility,
  openNewUserModal
}) => {
  const size = useBreakpoint();
  const [roleSelectOpen, setRoleSelectOpen] = useState(false);
  const [facilitySelectOpen, setFacilitySelectOpen] = useState(false);
  const roleFitlerItems = [ALL_OPTION, ...roleOptions];

  const facilityFitlerItems = [ALL_OPTION, ...facilitiesOptions];
  const [isSearching, setSearching] = useState<boolean>(false);

  const blurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };

  return (
    <>
      <Row justify={size.xs ? 'start' : 'end'} gutter={[0, 8]}>
        <Col style={{ marginInlineEnd: pxToRem(8) }}>
          {size.xs && !isSearching ? (
            <VsButton
              onClick={() => {
                setSearching(true);
              }}
              size={BUTTON_SIZES.squareIcon}
            >
              <SearchOutlined style={{ fontSize: pxToRem(16) }} />
            </VsButton>
          ) : (
            <FilterSearch
              onBlur={blurSearch}
              onChange={onSearchName}
              autoFocus={size.xs}
              placeholder="Search User"
              width={pxToRem(250)}
            />
          )}
        </Col>

        <Col style={{ marginInlineEnd: pxToRem(8) }}>
          <Dropdown
            trigger={['click']}
            open={roleSelectOpen}
            onOpenChange={setRoleSelectOpen}
            menu={{
              selectable: true,
              multiple: true,
              items: roleFitlerItems,
              onSelect: onSelectRoles,
              selectedKeys: filters.role,
              onDeselect: onSelectRoles
            }}
          >
            <VsButton
              size={BUTTON_SIZES.middle}
              style={{
                width: pxToRem(91)
              }}
              onClick={() => setRoleSelectOpen(!roleSelectOpen)}
            >
              <DownOutlined /> Roles
            </VsButton>
          </Dropdown>
        </Col>
        <Col style={{ marginInlineEnd: pxToRem(8) }}>
          <Dropdown
            trigger={['click']}
            open={facilitySelectOpen}
            onOpenChange={setFacilitySelectOpen}
            menu={{
              selectable: true,
              multiple: true,
              items: facilityFitlerItems,
              onSelect: onSelectFacility,
              selectedKeys: filters.facility,
              onDeselect: onSelectFacility
            }}
          >
            <VsButton
              size={BUTTON_SIZES.middle}
              style={{
                width: pxToRem(91)
              }}
              onClick={() => setFacilitySelectOpen(!facilitySelectOpen)}
            >
              <DownOutlined /> Facility
            </VsButton>
          </Dropdown>
        </Col>

        <Col
          style={{
            marginInlineEnd:
              userManagementAccess === PERMISSION_TYPES_BACKEND.WRITE
                ? pxToRem(8)
                : pxToRem(0)
          }}
        >
          <VsButton
            size={!size.xxl ? BUTTON_SIZES.squareIcon : BUTTON_SIZES.middle}
          >
            <CSVLink
              enclosingCharacter=""
              data={csvAdmins}
              headers={ADMINS_CSV_HEADERS}
              filename={`FCH-APP User List ${getFormattedDateNoTimeZone({ format: DATE_FORMATS.FILE_DATE })}.csv`}
            >
              <VsTooltip
                title={!size.xxl && 'Download'}
                placement="bottom"
                arrow
              >
                <DownloadOutlined
                  style={{
                    fontSize: !size.xxl ? pxToRem(16) : pxToRem(14),
                    paddingInlineEnd: !size.xxl ? undefined : pxToRem(8),
                    display: !size.xxl ? 'flex' : undefined,
                    alignItems: !size.xxl ? 'center' : undefined
                  }}
                />
                {size.xxl && <Typography.Text>{'Download'}</Typography.Text>}
              </VsTooltip>
            </CSVLink>
          </VsButton>
        </Col>

        <Col style={{ marginInlineEnd: pxToRem(8) }}>
          {userManagementAccess === PERMISSION_TYPES_BACKEND.WRITE && (
            <VsButton
              onClick={() => openBulkUploadModel()}
              size={!size.xxl ? BUTTON_SIZES.squareIcon : BUTTON_SIZES.middle}
            >
              <VsTooltip title={!size.xxl && 'Upload'} placement="bottom" arrow>
                <UploadOutlined
                  style={{
                    fontSize: !size.xxl ? pxToRem(16) : pxToRem(14),
                    paddingInlineEnd: !size.xxl ? undefined : pxToRem(8),
                    display: !size.xxl ? 'flex' : undefined,
                    alignItems: !size.xxl ? 'center' : undefined
                  }}
                />
                {size.xxl && <Typography.Text>{'Upload'}</Typography.Text>}
              </VsTooltip>
            </VsButton>
          )}
        </Col>

        {!size.xs &&
          userManagementAccess === PERMISSION_TYPES_BACKEND.WRITE && (
            <Col>
              <VsButton
                antButtonProps={{
                  type: 'primary'
                }}
                size={BUTTON_SIZES.middle}
                style={{
                  width: 'fit-content'
                }}
                onClick={openNewUserModal}
              >
                <PlusOutlined />
                Add User
              </VsButton>
            </Col>
          )}
      </Row>

      {size.xs && userManagementAccess === PERMISSION_TYPES_BACKEND.WRITE && (
        <Row justify={'start'}>
          <Col>
            <VsButton
              antButtonProps={{
                type: 'primary'
              }}
              size={BUTTON_SIZES.middle}
              style={{
                width: pxToRem(111)
              }}
              onClick={openNewUserModal}
            >
              <PlusOutlined />
              Add User
            </VsButton>
          </Col>
        </Row>
      )}
    </>
  );
};

export default UserSearchFilter;
