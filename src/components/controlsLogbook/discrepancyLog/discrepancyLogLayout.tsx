import { MessageOutlined } from '@ant-design/icons';
import { Col, FormInstance, Tooltip } from 'antd';
import { ColumnProps } from 'antd/es/table';
import Image from 'next/image';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { SelectOption, TPagination } from '@/types/commonTypes';
import { TDiscrepancyLog } from '@/types/discrepancyLogTypes';

import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';
import { usePillStyle } from '@/components/common/colorfulPill/usePillStyle';
import FilterTags from '@/components/common/filterTags/filterTags';

import RED_FLAG from '@/assets/icons/formulary/redFlag.svg';
import { PERPETUAL_INVENTORY_DEDUCTION_TYPES } from '@/containers/controlsLogbook/constants';
import { ALL } from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import { DiscrepancyLogAction } from './discrepancyLogAction';
import {
  DISCREPANCY_LOG_TYPES,
  DISCREPANCY_LOG_TYPES_FILTERS
} from './discrepancyLogConstant';
import { DiscrepancyLogFilter } from './discrepancyLogFilter';
import { DiscrepancyLogTable } from './discrepancyLogTable';

interface props {
  logs: TDiscrepancyLog[];
  onClickComment: (val: TDiscrepancyLog) => void;
  onChangePagination: (page: number, pageSize: number) => void;
  searching: boolean;
  setSearching: (val: boolean) => void;
  onSearch: (val: any) => void;
  formRef: FormInstance;
  setShowFilterDrawer: (val: boolean) => void;
  showFilterDrawer: boolean;
  handleReset: () => void;
  onClickApply: (val: any) => void;
  cartsData: SelectOption[];
  handleCartSearch: (val: string) => void;
  filterState: any;
  pagination: TPagination;
}

export const DiscrepancyLogLayout = ({
  logs,
  onClickComment,
  onChangePagination,
  searching,
  setSearching,
  onSearch,
  formRef,
  setShowFilterDrawer,
  showFilterDrawer,
  handleReset,
  onClickApply,
  cartsData,
  handleCartSearch,
  filterState,
  pagination
}: props) => {
  const { redPill, greenPill, yellowPill } = usePillStyle();

  const setTypePill = (type: string) => {
    switch (type) {
      case 'EDIT':
        return {
          pillStyle: greenPill,
          text: 'Edit'
        };

      case 'DELETE':
        return {
          pillStyle: redPill,
          text: 'Delete'
        };

      case 'SHIFT_COUNT_LOG':
        return {
          pillStyle: yellowPill,
          text: 'Discerpancy'
        };

      default:
        return {
          pillStyle: '',
          text: ''
        };
    }
  };

  const columns: ColumnProps<TDiscrepancyLog[]>[] = [
    {
      title: 'Date Received',
      width: pxToRem(142),
      render: (value: TDiscrepancyLog) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              columnGap: pxToRem(8)
            }}
          >
            {getFormattedDateInEST({
              date: value.createdAt,
              format: DATE_FORMATS.MDY_TIME
            })}
            {'    '}
            {value.type === DISCREPANCY_LOG_TYPES.SHIFT_COUNT_LOG && (
              <Image alt="No Image" src={RED_FLAG} />
            )}
          </div>
        );
      }
    },
    {
      title: 'Type',
      width: pxToRem(121),
      render: (value: TDiscrepancyLog) => {
        const { pillStyle, text } = setTypePill(value.type);

        return <ColorfulPill className={pillStyle} text={text} />;
      }
    },
    {
      title: 'Cart',
      width: pxToRem(90),

      render: (value: TDiscrepancyLog) => {
        return <div>{value.cart.cart}</div>;
      }
    },
    {
      title: 'Level',
      width: pxToRem(68),

      render: (value: TDiscrepancyLog) => {
        return <div>{value.level}</div>;
      }
    },
    {
      title: 'Row #',
      width: pxToRem(71),

      render: (value: TDiscrepancyLog) => {
        return (
          <div>
            {value.level === 1 ||
            value.type === DISCREPANCY_LOG_TYPES.SHIFT_COUNT_LOG
              ? value.perpetualInventory?.rowNumber
              : value.perpetualInventoryDeduction?.perpetualInventory.rowNumber}
          </div>
        );
      }
    },
    {
      title: 'Drug',
      width: pxToRem(194),

      render: (value: TDiscrepancyLog) => {
        return (
          <div>
            {value.type === DISCREPANCY_LOG_TYPES.SHIFT_COUNT_LOG
              ? value?.perpetualInventory?.name
              : value.level === 1
                ? value.perpetualInventory?.name
                : value.perpetualInventoryDeduction?.perpetualInventory.name}
          </div>
        );
      }
    },
    {
      title: 'Controlled ID',
      width: pxToRem(151),

      render: (value: TDiscrepancyLog) => {
        return (
          <div>
            {value.type === DISCREPANCY_LOG_TYPES.SHIFT_COUNT_LOG
              ? value.perpetualInventory?.controlledId
              : value.level === 1
                ? value.perpetualInventory?.controlledId
                : value.perpetualInventoryDeduction?.perpetualInventory
                    .controlledId}
          </div>
        );
      }
    },
    {
      title: 'TR/Rx',
      width: pxToRem(81),

      render: (value: TDiscrepancyLog) => {
        return (
          <div>
            {value.type === DISCREPANCY_LOG_TYPES.SHIFT_COUNT_LOG
              ? value.perpetualInventory?.tr ?? value.perpetualInventory?.rx
              : value.level === 1
                ? value.perpetualInventory?.tr ?? value.perpetualInventory?.rx
                : value.perpetualInventoryDeduction?.perpetualInventory.tr ??
                  value.perpetualInventoryDeduction?.perpetualInventory.rx}
          </div>
        );
      }
    },
    {
      title: 'Patient Name',
      width: pxToRem(151),

      render: (value: TDiscrepancyLog) => {
        return (
          <div>
            {value.level === 1
              ? value.perpetualInventory?.patientName
              : value.perpetualInventoryDeduction?.perpetualInventory
                  .patientName}
          </div>
        );
      }
    },
    {
      title: 'Provider Name',
      width: pxToRem(151),

      render: (value: TDiscrepancyLog) => {
        return (
          <div>
            {value.level === 1
              ? value.perpetualInventory?.providerName
              : value.perpetualInventoryDeduction?.perpetualInventory
                  .providerName}
          </div>
        );
      }
    },
    {
      title: 'Dose Admin',
      width: pxToRem(120),

      render: (value: TDiscrepancyLog) => {
        return (
          <div>
            {value.perpetualInventoryDeduction?.type ===
            PERPETUAL_INVENTORY_DEDUCTION_TYPES.DOSE_ADMINISTERED
              ? value.quantityDeducted
              : ''}
          </div>
        );
      }
    },
    {
      title: 'Wasted',
      width: pxToRem(90),

      render: (value: TDiscrepancyLog) => {
        return (
          <div>
            {value.perpetualInventoryDeduction?.type ===
            PERPETUAL_INVENTORY_DEDUCTION_TYPES.WASTED
              ? value.quantityDeducted
              : ''}
          </div>
        );
      }
    },
    {
      title: 'Destroyed',
      width: pxToRem(110),

      render: (value: TDiscrepancyLog) => {
        return (
          <div>
            {value.perpetualInventoryDeduction?.type ===
            PERPETUAL_INVENTORY_DEDUCTION_TYPES.DESTROYED
              ? value.quantityDeducted
              : ''}
          </div>
        );
      }
    },
    {
      title: 'Transferred',
      width: pxToRem(120),

      render: (value: TDiscrepancyLog) => {
        return (
          <div>
            {value.perpetualInventoryDeduction?.type ===
            PERPETUAL_INVENTORY_DEDUCTION_TYPES.TRANSFERRED
              ? value.quantityDeducted
              : ''}
          </div>
        );
      }
    },
    {
      title: 'Returned',
      width: pxToRem(100),

      render: (value: TDiscrepancyLog) => {
        return (
          <div>
            {value.perpetualInventoryDeduction?.type ===
              PERPETUAL_INVENTORY_DEDUCTION_TYPES.RETURNED_TO_PATIENT ||
            value.perpetualInventoryDeduction?.type ===
              PERPETUAL_INVENTORY_DEDUCTION_TYPES.RETURNED_TO_PROPERTY
              ? value.quantityDeducted
              : ''}
          </div>
        );
      }
    },
    {
      title: 'Name',
      width: pxToRem(151),

      render: (value: TDiscrepancyLog) => {
        return (
          <div>{`${value.admin?.lastName}, ${value.admin?.firstName}`}</div>
        );
      }
    },

    {
      title: 'Hand-off',
      width: pxToRem(151),
      render: (value: TDiscrepancyLog) => {
        return <div>{value.handOffName}</div>;
      }
    },
    {
      title: 'Received',
      width: pxToRem(151),

      render: (value: TDiscrepancyLog) => {
        return <div>{value.receiverName}</div>;
      }
    },
    {
      title: 'Comment',
      width: pxToRem(106),

      render: (value: TDiscrepancyLog) => (
        <Tooltip title="View Comment">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 'fit-content'
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
        </Tooltip>
      )
    },
    {
      title: 'Qty OH',
      width: pxToRem(100),
      render: (value: TDiscrepancyLog) => {
        return <div>{value.quantityAllocated}</div>;
      }
    },
    {
      title: 'Expected Qty',
      width: pxToRem(130),
      render: (value: TDiscrepancyLog) => {
        return <div>{value.expectedQuantity}</div>;
      }
    }
  ];

  return (
    <>
      <Col span={24} style={{ paddingBlockEnd: pxToRem(16) }}>
        <DiscrepancyLogAction
          searching={searching}
          setSearching={setSearching}
          onSearch={onSearch}
          formRef={formRef}
          setShowFilterDrawer={setShowFilterDrawer}
        />
      </Col>
      <Col span={24}>
        <FilterTags
          filterForm={formRef}
          filterState={filterState}
          customKeys={{
            cartId: 'Cart',
            type: 'Type',
            toDate: 'To Date',
            fromDate: 'From Date'
          }}
          customMapForSelect={{
            cartId: cartsData,
            type: DISCREPANCY_LOG_TYPES_FILTERS
          }}
          onChangeFilters={onClickApply}
          filterInitialValues={{
            cartId: ALL,
            type: ALL
          }}
        />
      </Col>
      <DiscrepancyLogTable
        columns={columns}
        data={logs}
        isLoading={false}
        onChangePagination={onChangePagination}
        pagination={pagination}
      />

      <DiscrepancyLogFilter
        filterFormRef={formRef}
        filterOpen={showFilterDrawer}
        handleReset={handleReset}
        onClickApply={onClickApply}
        setFilerOpen={() => setShowFilterDrawer(!showFilterDrawer)}
        cartsData={cartsData}
        handleCartSearch={handleCartSearch}
      />
    </>
  );
};
