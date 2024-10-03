import { FC, PropsWithChildren, useState } from 'react';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { Checkbox, Col, Drawer, Form, FormInstance, Grid, Row } from 'antd';
import {
  FilterSearch,
  VsButton,
  VsFormItem,
  VsTable,
  VsTooltip
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import useCookies from '@/hooks/useCookies';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  PERMISSIONS_TYPES
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useFacilityUnitsStyle } from '../useFacilityUnitsStyle';

interface Props {
  facilityUnits?: any[];
  facility?: any;
  unitsOpen: boolean;
  onCloseUnitsDrawer: () => void;
  onClickSave: (val: any) => void;
  formRef: FormInstance;
  onChangeUnitsMainSelectionBox: any;
  onChangeSingleUnitSelectionBox: any;
  handleUnitsFilterInput: any;
  unitsPaginationInfo: any;
  onChangePagination: any;
  loading?: any;
  updatedUnits?: any;
  searchInputRef: any;
}

const { useBreakpoint } = Grid;

export const FacilityUnitsDrawer: FC<PropsWithChildren<Props>> = ({
  facilityUnits = [],
  facility,
  unitsOpen,
  onCloseUnitsDrawer,
  onClickSave,
  onChangeUnitsMainSelectionBox,
  onChangeSingleUnitSelectionBox,
  handleUnitsFilterInput,
  unitsPaginationInfo,
  onChangePagination,
  loading = false,
  updatedUnits = {},
  searchInputRef
}) => {
  const admin = useCookies().getDataFromCookie();
  const size = useBreakpoint();
  const isSmallScreenSzie = window.screen.width < 576;
  const { unitsTableContainer, facilityUnitsDrawer } = useFacilityUnitsStyle();
  const [isSearching, setSearching] = useState<boolean>(false);

  const facilityUnitColumns: any[] = [
    {
      title: 'Units',
      dataIndex: 'unit',
      key: 'name',
      align: 'left',
      width: '30%'
    },
    {
      title: (
        <Checkbox
          style={{ fontSize: pxToRem(12), fontWeight: 600 }}
          onChange={(checkedValue: any) =>
            onChangeUnitsMainSelectionBox(
              checkedValue?.target?.checked,
              'isCart'
            )
          }
          checked={
            facilityUnits.filter(unit => unit?.isCart).length ===
            facilityUnits?.length
          }
          disabled={admin?.rbac?.facilityUnits !== PERMISSIONS_TYPES.WRITE}
        >
          Cart Assignment
        </Checkbox>
      ),
      key: 'catAssignment',
      align: 'center',
      width: '40%',
      render: (value: any) => (
        <Checkbox
          checked={value.isCart}
          onChange={(checkedValue: any) =>
            onChangeSingleUnitSelectionBox(
              value?.facilityUnitId,
              checkedValue?.target?.checked,
              'isCart'
            )
          }
          disabled={admin?.rbac?.facilityUnits !== PERMISSIONS_TYPES.WRITE}
        />
      )
    }
    // {
    //   title: (
    //     <Checkbox
    //       style={{ fontSize: pxToRem(12), fontWeight: 600 }}
    //       onChange={(checkedValue: any) =>
    //         onChangeUnitsMainSelectionBox(
    //           checkedValue?.target?.checked,
    //           'isHnP'
    //         )
    //       }
    //       checked={
    //         facilityUnits.filter(unit => unit?.isHnP).length ===
    //         facilityUnits?.length
    //       }
    //       disabled={admin?.rbac?.facilityUnits !== PERMISSIONS_TYPES.WRITE}
    //     >
    //       H&P
    //     </Checkbox>
    //   ),
    //   key: 'h&p',
    //   align: 'center',
    //   width: '30%',
    //   render: (value: any) => (
    //     <Checkbox
    //       checked={value.isHnP}
    //       onChange={(checkedValue: any) =>
    //         onChangeSingleUnitSelectionBox(
    //           value?.facilityUnitId,
    //           checkedValue?.target?.checked,
    //           'isHnP'
    //         )
    //       }
    //       disabled={admin?.rbac?.facilityUnits !== PERMISSIONS_TYPES.WRITE}
    //     />
    //   )
    // }
  ];
  const blurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };

  return (
    <Drawer
      open={unitsOpen}
      width={pxToRem(493)}
      onClose={onCloseUnitsDrawer}
      placement={size.xs ? 'bottom' : 'right'}
      closable={false}
      styles={{
        body: {
          paddingInline: 0,
          paddingBlock: pxToRem(10),
          overflow: 'hidden'
        }
      }}
      getContainer={size.xs ? 'body' : undefined}
      height="90%"
      className={facilityUnitsDrawer}
    >
      <Form
        form={searchInputRef}
        onFinish={onClickSave}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%'
        }}
      >
        <Row
          justify="space-between"
          align={'middle'}
          style={{
            paddingInline: pxToRem(16),
            borderBottom: `${pxToRem(1)} solid rgba(229, 228, 228, 1)`,
            paddingBottom: pxToRem(6)
          }}
        >
          <Col
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <VsTooltip
              title={facility?.facilityName}
              placement={size.xs ? 'top' : 'left'}
              open={
                unitsOpen && facility?.facilityName.length > 22
                  ? undefined
                  : false
              }
              arrow
            >
              <div
                style={{
                  fontSize: pxToRem(20),
                  fontWeight: 600,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: pxToRem(250)
                }}
              >
                {facility?.facilityName}
              </div>
            </VsTooltip>
            <span
              style={{
                fontSize: pxToRem(12),
                color: 'rgba(121, 121, 121, 1)'
              }}
            >
              Deselect checkboxes to exclude units
            </span>
          </Col>
          <Row align={`middle`}>
            <Col style={{ marginRight: pxToRem(10) }}>
              {size.xs && !isSearching && (
                <VsButton
                  size={BUTTON_SIZES.squareIcon}
                  onClick={() => {
                    setSearching(true);
                  }}
                >
                  <SearchOutlined />
                </VsButton>
              )}
              {!size.xs && (
                <VsFormItem
                  formItemProps={{
                    name: 'unitSearch'
                  }}
                >
                  <FilterSearch
                    placeholder={'Search Unit'}
                    width={pxToRem(169)}
                    onChange={(e: any) =>
                      handleUnitsFilterInput(e?.target?.value)
                    }
                    autoFocus={size.xs}
                    onBlur={blurSearch}
                  />
                </VsFormItem>
              )}
            </Col>
            <Col>
              <CloseOutlined
                style={{
                  fontSize: pxToRem(16.55),
                  color: '#687182',
                  cursor: 'pointer'
                }}
                onClick={onCloseUnitsDrawer}
              />
            </Col>
          </Row>
          {size.xs && isSearching && (
            <Row>
              <Col>
                <VsFormItem
                  formItemProps={{
                    name: 'unitSearch'
                  }}
                >
                  <FilterSearch
                    placeholder={'Search Unit'}
                    width={pxToRem(169)}
                    onChange={(e: any) =>
                      handleUnitsFilterInput(e?.target?.value)
                    }
                    autoFocus={size.xs}
                    onBlur={blurSearch}
                  />
                </VsFormItem>
              </Col>
            </Row>
          )}
        </Row>
        <div
          style={{
            overflowY: 'auto',
            padding: `0 ${pxToRem(10)} ${pxToRem(10)} ${pxToRem(10)}`,
            height: '100dvh'
          }}
          className={unitsTableContainer}
        >
          <VsTable
            tableProps={{
              dataSource: facilityUnits,
              columns: facilityUnitColumns,
              pagination: {
                defaultPageSize: isSmallScreenSzie
                  ? DEFAULT_PAGE_SIZE.MOBILE
                  : DEFAULT_PAGE_SIZE.DESKTOP,
                pageSize: unitsPaginationInfo?.perPage,
                total: unitsPaginationInfo?.totalItems,
                showSizeChanger: isSmallScreenSzie ? false : true,
                pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
                size: 'small',
                position: isSmallScreenSzie ? ['bottomCenter'] : ['bottomLeft'],
                current: unitsPaginationInfo?.currentPage,
                onChange: (page, pageSize) => onChangePagination(page, pageSize)
              },
              loading: loading,
              sticky: true
            }}
          />
        </div>
        <Row
          justify="end"
          style={{
            paddingInline: pxToRem(17),
            borderTop: `${pxToRem(1)} solid rgba(229, 228, 228, 1)`,
            paddingTop: pxToRem(7)
          }}
        >
          <Col
            span={12}
            style={{
              paddingInlineEnd: size.xs ? pxToRem(7) : pxToRem(5)
            }}
          >
            <VsButton
              style={{ width: '100%' }}
              onClick={onCloseUnitsDrawer}
              size={BUTTON_SIZES.large}
            >
              Cancel
            </VsButton>
          </Col>
          <Col
            span={12}
            style={{ paddingInlineStart: size.xs ? pxToRem(7) : pxToRem(5) }}
          >
            <VsButton
              antButtonProps={{
                type: 'primary',
                htmlType: 'submit',
                disabled:
                  admin?.rbac?.facilityUnits !== PERMISSIONS_TYPES.WRITE ||
                  Object.keys(updatedUnits).length === 0
              }}
              style={{ width: '100%' }}
              size={BUTTON_SIZES.large}
            >
              Save
            </VsButton>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};
