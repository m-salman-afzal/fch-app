import { Button, Col, Grid, Row, Tag, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { VsTable } from 'vs-design-components';

import { Admin, UserFilters } from '@/types/adminTypes';
import { SelectOption } from '@/types/commonTypes';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  ALL,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useUserManagementStyle } from './useUserManagementStyle';

interface props {
  adminList: Admin[];
  adminUserTableColumns: ColumnsType<Admin>;
  isLoading: boolean;
  roleOptions: SelectOption[];
  filters: UserFilters;
  onCloseTag: (e: any, type: 'role' | 'facility') => void;
  onPressClearAll: () => void;
  facilitiesOptions: SelectOption[];
}

const { useBreakpoint } = Grid;

const UserLayout: React.FC<props> = ({
  adminList,
  adminUserTableColumns,
  isLoading,
  roleOptions,
  filters,
  facilitiesOptions,
  onCloseTag,
  onPressClearAll
}) => {
  const roleFitlerItems = [{ label: ALL, key: ALL, value: '' }, ...roleOptions];

  const facilityFitlerItems = [
    { label: ALL, key: ALL, value: '' },

    ...facilitiesOptions
  ];

  const size = useBreakpoint();
  const { userTableContainer } = useUserManagementStyle();
  const isFilterAvailable =
    filters.role.filter(key => key !== ALL).length > 0 ||
    filters.facility.filter(key => key !== ALL).length > 0;
  const isSmall = window.screen.width <= 576;

  const minusValueFromTableHeight = window.screen.width >= 3840 ? 50 : 20;
  const { tableHeight } = useTablePaginationPosition();

  return (
    <>
      {isFilterAvailable && (
        <Row
          align={'middle'}
          style={{ paddingInlineStart: size.xs ? pxToRem(20) : undefined }}
        >
          {filters.role.filter(key => key !== ALL).length > 0 && (
            <>
              <Typography.Text style={{ marginInlineEnd: pxToRem(4) }}>
                Roles:{' '}
              </Typography.Text>
              {filters.role.map(key => (
                <Tag
                  bordered={false}
                  onClose={() => onCloseTag(key, 'role')}
                  closable
                  key={key}
                  color="blue"
                >
                  {roleFitlerItems?.find(role => role.key === key)?.label}
                </Tag>
              ))}
            </>
          )}
          {filters.facility.filter(key => key !== ALL).length > 0 && (
            <>
              <Typography.Text style={{ marginInlineEnd: pxToRem(4) }}>
                Facility:{' '}
              </Typography.Text>
              {filters.facility.map(key => (
                <Tag
                  bordered={false}
                  onClose={() => onCloseTag(key, 'facility')}
                  closable
                  key={key}
                  color="blue"
                >
                  {facilityFitlerItems?.find(role => role.key === key)?.label}
                </Tag>
              ))}
            </>
          )}

          <Button
            style={{ paddingInline: 0 }}
            onClick={onPressClearAll}
            type={'link'}
          >
            <u>Clear All</u>
          </Button>
        </Row>
      )}{' '}
      <Row
        style={{
          margin: size.xs ? '0px -0.4rem' : 'auto',
          paddingBlockEnd: size.xs ? pxToRem(80) : 0
        }}
      >
        <Col className={userTableContainer} span={24}>
          <VsTable
            tableProps={{
              columns: adminUserTableColumns,
              dataSource: adminList,
              loading: isLoading,
              sticky: true,
              pagination: {
                pageSizeOptions: !size.xs
                  ? DEFAULT_PAGE_SIZE_OPTIONS
                  : undefined,
                showTotal: size.sm
                  ? (total, range) => {
                      return (
                        <Typography.Text>
                          Showing {range[1]} out of <strong>{total}</strong>
                        </Typography.Text>
                      );
                    }
                  : undefined,
                showSizeChanger: !size.xs,
                size: 'small',
                defaultPageSize: isSmall
                  ? DEFAULT_PAGE_SIZE.MOBILE
                  : DEFAULT_PAGE_SIZE.DESKTOP,

                position: ['bottomCenter']
              },
              scroll: {
                x: 'max-content',
                y: adminList.length
                  ? tableHeight - minusValueFromTableHeight
                  : undefined
              }
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default UserLayout;
