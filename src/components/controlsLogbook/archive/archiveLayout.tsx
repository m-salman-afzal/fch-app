import { FC } from 'react';
import { EyeOutlined, FlagFilled } from '@ant-design/icons';
import { Col, FormInstance, Grid, Row, Tooltip, Typography } from 'antd';
import Image from 'next/image';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { SelectOption, TPagination } from '@/types/commonTypes';
import {
  TPerpetualInventory,
  TPerpetualInventoryDeduction
} from '@/types/perpetualInventoryTypes';

import FilterTags from '@/components/common/filterTags/filterTags';

import UNARCHIVE_SVG from '@/assets/icons/controlsLogbook/unarchive.svg';
import { PERPETUAL_SIGNATURE_TYPES } from '@/containers/controlsLogbook/constants';
import useCookies from '@/hooks/useCookies';
import { ALL, PERMISSIONS_TYPES } from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import { PerpetualInventoryActions } from '../perpetualInventory/perpetualInventoryFilterActions';
import { ArchiveTable } from './archiveTable/archiveTable';
import { useArchiveTableStyle } from './archiveTable/useArchiveTableStyle';
import { nestedRowRender } from './getArchiveNestedRows';

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
  onClickSignature: (
    val: any,
    signatureType: string,
    isFirstLevel: boolean
  ) => Promise<void>;
  formref: FormInstance;
  setUnarchiveOpen: (x: TPerpetualInventory) => void;

  onClickComment: (val: TPerpetualInventoryDeduction) => void;
  searchVal: string;
}

export const ArchiveLayout: FC<Props> = ({
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
  onClickSignature,
  formref,
  setUnarchiveOpen,
  onClickComment,
  searchVal
}) => {
  const { getDataFromCookie } = useCookies();

  const admin = getDataFromCookie();
  const size = useBreakpoint();
  const isSmall = window.screen.width <= 576;

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
      title: 'Patient',
      render: (value: TPerpetualInventory) => <div>{value.patientName}</div>
    },
    {
      title: 'Provider',
      render: (value: TPerpetualInventory) => <div>{value.providerName}</div>
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
    }
  ];

  admin?.rbac?.perpetualInventory === PERMISSIONS_TYPES.WRITE &&
    perpetualInventoryColumns.push({
      title: '',
      key: 'action',
      width: 58,
      fixed: !isSmall ? 'right' : undefined,
      render: (value: TPerpetualInventory) => {
        return (
          <Tooltip title="Unarchive">
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
                onClick={() => setUnarchiveOpen(value)}
                style={{
                  width: pxToRem(24),
                  height: pxToRem(24)
                }}
                size={BUTTON_SIZES.small}
              >
                <Image src={UNARCHIVE_SVG} alt="icon" />
              </VsButton>
            </div>
          </Tooltip>
        );
      }
    });

  const { perpetualnventoryNestedContainer } = useArchiveTableStyle();

  const expandedRenderer = nestedRowRender(
    perpetualnventoryNestedContainer,
    onClickSignature,
    onClickComment
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
        <ArchiveTable
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
