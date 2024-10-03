'use client';

import { FC } from 'react';
import {
  DownloadOutlined,
  EyeOutlined,
  FlagFilled,
  MoreOutlined
} from '@ant-design/icons';
import { Col, Dropdown, FormInstance, Grid, Row, Typography } from 'antd';
import { VsButton, VsSelectFormItem, VsTooltip } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { SelectOption, TPagination } from '@/types/commonTypes';
import {
  TPerpetualInventory,
  TPerpetualInventoryDeduction,
  TSignature
} from '@/types/perpetualInventoryTypes';

import FilterTags from '@/components/common/filterTags/filterTags';

import {
  PERPETUAL_INVENTORY_DEDUCTION_TYPES,
  PERPETUAL_SIGNATURE_TYPES
} from '@/containers/controlsLogbook/constants';
import useCookies from '@/hooks/useCookies';
import { ALL, PERMISSION_TYPES_BACKEND } from '@/utils/constants';
import { DeleteOption } from '@/utils/constantsComponents';
import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import {
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE
} from '@/utils/sharedUtils';

import { nestedRowRender } from './getPerpetualInventoryNestedRows';
import { PerpetualInventoryActions } from './perpetualInventoryFilterActions';
import { PerpetualInventoryTable } from './perpetualInventoryTable/perpetualInventoryTable';
import { usePerpetualInventoryTableStyle } from './perpetualInventoryTable/usePerpetualInventoryTableStyle';

const { useBreakpoint } = Grid;

interface Props {
  isLoading: boolean;

  pagination: TPagination;
  onChangePagination: (page: number, pageSize: number) => void;

  perpetualInventories: any[];

  searching: boolean;
  setSearching: (val: boolean) => void;

  getCartsData: () => Promise<void>;

  setCartsData: (val: SelectOption[]) => void;
  selectedCart: string;

  cartsData: any[];
  onSearch: (val: any) => void;
  onClickDownload: (val: any) => void;
  onSelectCart: (val: any) => void;
  onChangeFilters: (val: any) => void;
  onClickPerpetualInventoryEdit: (val: TPerpetualInventory) => Promise<void>;
  onClickPerpetualInventoryDelete: (val: TPerpetualInventory) => Promise<void>;
  onClickDeduction: (val: TPerpetualInventory, type: string) => Promise<void>;
  onClickSignature: (
    val: any,
    signatureType: string,
    isPerpetualInventory: boolean
  ) => Promise<void>;

  onClickComment: (val: TPerpetualInventoryDeduction) => void;
  onClickPerpetualInventoryDeductionEdit: (
    val: TPerpetualInventoryDeduction,
    parent: TPerpetualInventory
  ) => void;
  onClickPerpetualInventoryDeductionDelete: (
    val: TPerpetualInventoryDeduction
  ) => Promise<void>;
  formref: FormInstance;
  searchVal: string;
}

export const PerpetualInventoryLayout: FC<Props> = ({
  searching,
  setSearching,
  onSearch,
  getCartsData,
  cartsData,
  setCartsData,
  selectedCart,
  onChangeFilters,
  onSelectCart,
  onClickDownload,
  isLoading,
  perpetualInventories,
  pagination,
  onChangePagination,
  onClickPerpetualInventoryEdit,
  onClickPerpetualInventoryDelete,
  onClickDeduction,
  onClickSignature,
  onClickComment,
  onClickPerpetualInventoryDeductionEdit,
  onClickPerpetualInventoryDeductionDelete,
  formref,
  searchVal
}) => {
  const { getDataFromCookie } = useCookies();
  const admin = getDataFromCookie();
  const size = useBreakpoint();
  const isSmall = window.screen.width <= 576;

  const getActionItems = (value: TPerpetualInventory) => {
    const items: {
      label: string | JSX.Element;
      key: number;
      disabled?: boolean;
      onClick: () => void;
    }[] = [];

    admin?.rbac?.perpetualInventory === PERMISSION_TYPES_BACKEND.WRITE &&
      items.push({
        label: 'Edit',
        key: 0,
        onClick: () => onClickPerpetualInventoryEdit(value)
      });

    admin?.rbac?.controlLogBookAdminister === PERMISSION_TYPES_BACKEND.WRITE &&
      items.push(
        {
          label: 'Administer',
          key: 1,
          disabled: !value.staffSignature,
          onClick: () => {
            onClickDeduction(
              value,
              PERPETUAL_INVENTORY_DEDUCTION_TYPES.DOSE_ADMINISTERED
            );
          }
        },
        {
          label: 'Waste',
          disabled: !value.staffSignature,
          key: 2,
          onClick: () => {
            onClickDeduction(value, PERPETUAL_INVENTORY_DEDUCTION_TYPES.WASTED);
          }
        },
        {
          label: 'Destroy',
          disabled: !value.staffSignature,
          key: 3,
          onClick: () => {
            onClickDeduction(
              value,
              PERPETUAL_INVENTORY_DEDUCTION_TYPES.DESTROYED
            );
          }
        },
        {
          label: 'Transfer',
          disabled: !value.staffSignature,
          key: 4,
          onClick: () => {
            onClickDeduction(
              value,
              PERPETUAL_INVENTORY_DEDUCTION_TYPES.TRANSFERRED
            );
          }
        }
      );

    if (value.isPatientSpecific) {
      admin?.rbac?.controlLogBookAdminister ===
        PERMISSION_TYPES_BACKEND.WRITE &&
        items.push(
          {
            label: 'Return to Patient',
            disabled: !value.staffSignature,
            key: 5,
            onClick: () => {
              onClickDeduction(
                value,
                PERPETUAL_INVENTORY_DEDUCTION_TYPES.RETURNED_TO_PATIENT
              );
            }
          },
          {
            label: 'Return to Property',
            disabled: !value.staffSignature,
            key: 5.5,
            onClick: () => {
              onClickDeduction(
                value,
                PERPETUAL_INVENTORY_DEDUCTION_TYPES.RETURNED_TO_PROPERTY
              );
            }
          }
        );
    }

    admin?.rbac?.perpetualInventory === PERMISSION_TYPES_BACKEND.WRITE &&
      items.push({
        label: <DeleteOption />,
        key: 6,
        onClick: () => onClickPerpetualInventoryDelete(value)
      });

    return items;
  };

  const perpetualInventoryColumns: any = [
    {
      title: 'Row #',
      render: (value: TPerpetualInventory) => <div>{value.rowNumber}</div>
    },
    {
      title: 'Drug',
      render: (value: TPerpetualInventory) => <div>{value.name}</div>
    },
    {
      title: 'Controlled ID',
      render: (value: TPerpetualInventory) => <div>{value.controlledId}</div>
    },
    {
      title: 'TR/Rx',
      render: (value: TPerpetualInventory) => (
        <div>{value.isPatientSpecific ? value.rx : value.tr}</div>
      )
    },
    {
      title: 'Patient Name',
      render: (value: TPerpetualInventory) => (
        <div>{value.isPatientSpecific ? value.patientName : ''}</div>
      )
    },
    {
      title: 'Provider Name',
      render: (value: TPerpetualInventory) => (
        <div>{value.isPatientSpecific ? value.providerName : ''}</div>
      )
    },
    {
      title: 'Date Received',
      key: 'action',
      render: (value: TPerpetualInventory) => {
        return (
          <div>
            {getFormattedDateInEST({
              date: value.createdAt,
              format: DATE_FORMATS.MDY_TIME
            })}
          </div>
        );
      }
    },
    {
      title: 'Qty OH',
      key: 'action',
      render: (value: TPerpetualInventory) => (
        <div>{value.quantityAllocated}</div>
      )
    },
    {
      title: 'Staff Signature',
      key: 'action',
      fixed: !isSmall ? 'right' : undefined,
      render: (value: TPerpetualInventory) => {
        return (
          <VsButton
            antButtonProps={{
              type: 'default'
            }}
            onClick={() =>
              onClickSignature(
                value,
                PERPETUAL_SIGNATURE_TYPES.STAFF_SIGNATURE,
                true
              )
            }
            style={{
              width: pxToRem(94),
              height: pxToRem(24)
            }}
            size={BUTTON_SIZES.middle}
          >
            {value.staffSignature ? (
              <EyeOutlined />
            ) : (
              <FlagFilled style={{ color: '#FF4D4F' }} />
            )}
            {value.staffSignature ? 'View' : 'Pending'}
          </VsButton>
        );
      }
    },
    {
      title: '',
      key: 'action',
      width: 58,
      fixed: !isSmall ? 'right' : undefined,
      render: (value: TPerpetualInventory) => {
        return (
          <Dropdown
            placement={'bottomRight'}
            menu={{
              items: getActionItems(value)
            }}
            trigger={['click']}
          >
            <VsButton style={TABLE_BUTTON_STYLE} size={BUTTON_SIZES.squareIcon}>
              <MoreOutlined style={TABLE_BUTTON_ICON_SIZE} />
            </VsButton>
          </Dropdown>
        );
      }
    }
  ];

  const { perpetualnventoryNestedContainer } =
    usePerpetualInventoryTableStyle();

  const expandedRenderer = nestedRowRender(
    perpetualnventoryNestedContainer,
    onClickPerpetualInventoryDeductionEdit,
    onClickPerpetualInventoryDeductionDelete,
    onClickSignature,
    onClickComment,
    admin?.rbac?.perpetualInventory
  );

  return (
    <Row>
      <Col span={24} style={{ paddingBlockEnd: pxToRem(16) }}>
        <PerpetualInventoryActions
          searching={searching}
          setSearching={setSearching}
          onSearch={onSearch}
          getCartsData={getCartsData}
          cartsData={cartsData}
          setCartsData={setCartsData}
          selectedCart={selectedCart}
          onSelectCart={onSelectCart}
          onClickDownload={onClickDownload}
          formref={formref}
          searchVal={searchVal}
        />
      </Col>
      <Col span={24}>
        <FilterTags
          filterForm={formref}
          filterState={{
            cartId: selectedCart
          }}
          customKeys={{
            cartId: 'Cart'
          }}
          customMapForSelect={{
            cartId: cartsData
          }}
          onChangeFilters={onChangeFilters}
          filterInitialValues={{
            cartId: ALL
          }}
          excludeKeys={{}}
          closable={false}
        />
      </Col>
      <Col span={24}>
        <PerpetualInventoryTable
          inventoryColumns={perpetualInventoryColumns}
          firstLevelData={perpetualInventories}
          isLoading={isLoading}
          nestedRowRender={expandedRenderer}
          pagination={pagination}
          onChangePagination={onChangePagination}
        />
      </Col>
    </Row>
  );
};
