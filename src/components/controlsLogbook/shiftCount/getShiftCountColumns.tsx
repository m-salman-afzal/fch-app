import { Skeleton, TableColumnsType } from 'antd';
import Image from 'next/image';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import {
  TShiftCountData,
  TShiftCountLogDrugsData
} from '@/types/shiftCountTypes';

import RED_FLAG from '@/assets/icons/formulary/redFlag.svg';
import { PERMISSION_TYPES_BACKEND } from '@/utils/constants';

import { Counter } from './counter';

export const getShiftCountColumns: (
  permission: any,
  quantites: {
    countedQuantity?: number;
    perpetualInventoryId: string;
    isDiscrepancyFlag: boolean;
    isError?: boolean;
  }[],
  isLog?: boolean,
  onChangeInputFocus?: (shiftCountId: string, value?: number) => void
) => any[] = (permission, quantites, isLog, onChangeInputFocus = () => {}) => {
  let columns:
    | TableColumnsType<TShiftCountData>
    | TableColumnsType<TShiftCountLogDrugsData> = [
    {
      title: 'Row #',
      width: pxToRem(125),
      render: (value: TShiftCountData, record: TShiftCountData) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              columnGap: pxToRem(8)
            }}
          >
            {value.rowNumber}{' '}
            {value.isDiscrepancyFlag && <Image alt="No Image" src={RED_FLAG} />}
          </div>
        );
      }
    },
    {
      title: 'Drug',
      width: pxToRem(125),
      dataIndex: 'name',
      render: (value: string, record: TShiftCountData) => {
        return <div>{value}</div>;
      }
    },
    {
      title: 'Controlled ID',
      width: pxToRem(125),
      dataIndex: 'controlledId',
      render: (value: string, record: TShiftCountData) => {
        return <div>{value}</div>;
      }
    },

    {
      title: 'TR/Rx',
      width: pxToRem(125),
      render: (value: string, record: TShiftCountData) => {
        return <div>{record.tr ? record.tr : record.rx}</div>;
      }
    }
  ];
  permission === PERMISSION_TYPES_BACKEND.WRITE &&
    !isLog &&
    columns.push({
      title: 'Qty',

      render: (value: TShiftCountData, record: TShiftCountData) => {
        return (
          <Counter
            key={value.perpetualInventoryId}
            plusButtonType="primary"
            max={12500}
            min={0}
            isError={value.isError}
            isDiscrepancy={value.isDiscrepancyFlag}
            onChange={(packageQty: number) => {
              onChangeInputFocus(value.perpetualInventoryId, packageQty);
            }}
            value={value.inputQuantity}
          />
        );
      },
      width: pxToRem(125)
    });

  isLog &&
    columns.push({
      title: 'Counted Qty',
      width: pxToRem(125),
      render: (value: TShiftCountLogDrugsData) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              columnGap: pxToRem(8)
            }}
          >
            {value.countedQuantity}{' '}
            {value.countedQuantity !== value.quantityOnHand && (
              <Image alt="No Image" src={RED_FLAG} />
            )}
          </div>
        );
      }
    });

  isLog &&
    columns.push({
      title: 'Expected Qty',
      width: pxToRem(125),
      dataIndex: 'quantityOnHand'
    });

  return columns;
};
