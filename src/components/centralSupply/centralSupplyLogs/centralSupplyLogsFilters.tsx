import { FC, useEffect, useState } from 'react';
import {
  Col,
  Form,
  Grid,
  InputNumber,
  Row,
  Slider,
  theme,
  Typography
} from 'antd';
import dayjs from 'dayjs';
import {
  ErrorMessage,
  VsDatePickerFormItem,
  VsFormItem,
  VsMobileDatePickerFormItem
} from 'vs-design-components';

import { TOrderedUnits } from '@/types/centralSupplyTypes';

import { useLogSearchStyle } from '@/components/logs/logsSearch/useLogsSearchStyle';

import { pxToRem } from '@/utils/sharedUtils';

import { useRxOrdersStyle } from '../rxOrders/useRxOrdersStyle';

const { useBreakpoint } = Grid;
const { useToken } = theme;
interface Props {
  orderedUnits: TOrderedUnits;
}
export const CentralSupplyLogsFilters: FC<Props> = ({ orderedUnits }) => {
  const filterFormRef = Form.useFormInstance();
  const { token } = useToken();
  const { formItemWrappingDiv } = useLogSearchStyle();
  const size = useBreakpoint();

  const [orderedItemsRange, setOrderedItemsRange] = useState<number[]>([
    orderedUnits.orderedQuantityMin,
    orderedUnits.orderedQuantityMax
  ]);

  const { centralSupplyFilterSlider } = useRxOrdersStyle();

  const watch = Form.useWatch('orderedUnits', filterFormRef);

  const toWatch = Form.useWatch(['toDate'], filterFormRef);
  const fromWatch = Form.useWatch(['fromDate'], filterFormRef);

  useEffect(() => {
    if (watch === undefined) {
      setOrderedItemsRange([
        orderedUnits.orderedQuantityMin,
        orderedUnits.orderedQuantityMax
      ]);
    }
  }, [watch]);

  useEffect(() => {
    filterFormRef.setFieldsValue({
      orderedQuantityMin: orderedUnits.orderedQuantityMin,
      orderedQuantityMax: orderedUnits.orderedQuantityMax
    });
  }, [orderedUnits]);

  return (
    <div style={{ paddingInline: pxToRem(20), paddingTop: pxToRem(6) }}>
      <div className={formItemWrappingDiv}>
        {size.xs ? (
          <VsMobileDatePickerFormItem
            seperateLabel={'From'}
            placeholder="MM/DD/YYYY"
            max={toWatch ?? new Date('01/01/2200')}
            width="100%"
            formItemProps={{
              name: 'fromDate'
            }}
          />
        ) : (
          <div style={{ marginBlockEnd: pxToRem(20) }}>
            <VsDatePickerFormItem
              seperateLabel={'From'}
              placeholder="MM/DD/YYYY"
              width="100%"
              datePickerProps={{
                minDate: new Date('01/01/1900'),
                maxDate: toWatch ?? new Date('01/01/2200')
              }}
              formItemProps={{
                name: 'fromDate'
              }}
              toFromDate={toWatch}
            />
          </div>
        )}
      </div>

      <div className={formItemWrappingDiv}>
        {size.xs ? (
          <VsMobileDatePickerFormItem
            seperateLabel={'To'}
            placeholder="MM/DD/YYYY"
            width="100%"
            min={fromWatch ?? new Date('1/1/1900')}
            formItemProps={{
              name: 'toDate'
            }}
          />
        ) : (
          <div style={{ marginBlockEnd: pxToRem(20) }}>
            <VsDatePickerFormItem
              seperateLabel={'To'}
              placeholder="MM/DD/YYYY"
              width="100%"
              datePickerProps={{
                minDate: fromWatch ?? new Date('01/01/1900'),
                maxDate: new Date('01/01/2200')
              }}
              formItemProps={{
                name: 'toDate'
              }}
              toFromDate={fromWatch}
            />
          </div>
        )}
      </div>

      <div
        style={{
          height: pxToRem(81),
          border: `1px solid #00000026`,
          borderRadius: pxToRem(4),
          padding: `${pxToRem(12)} ${pxToRem(16)} ${pxToRem(12)} ${pxToRem(16)}`,
          gap: pxToRem(8),
          display: 'flex',
          flexDirection: 'column'
        }}
        className={centralSupplyFilterSlider}
      >
        <Typography.Text
          style={{
            color: token.colorTextTertiary,
            fontSize: pxToRem(14),
            fontWeight: 400
          }}
        >
          Ordered Units
        </Typography.Text>
        <VsFormItem
          formItemProps={{
            noStyle: true,
            name: 'orderedUnits',
            required: true
          }}
        >
          <Slider
            style={{
              margin: `0 ${pxToRem(7)} 0 ${pxToRem(7)}`
            }}
            range
            min={orderedUnits.orderedQuantityMin}
            max={orderedUnits.orderedQuantityMax}
            defaultValue={[
              orderedUnits.orderedQuantityMin,
              orderedUnits.orderedQuantityMax
            ]}
            onChange={val => {
              setOrderedItemsRange(val);
              filterFormRef.setFieldsValue({
                orderedQuantityMin: val[0],
                orderedQuantityMax: val[1]
              });
            }}
            value={orderedItemsRange}
          />
        </VsFormItem>
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <VsFormItem
              formItemProps={{
                initialValue: orderedUnits.orderedQuantityMin,
                name: 'orderedQuantityMin',
                noStyle: true
              }}
            >
              <InputNumber
                style={{ borderRadius: pxToRem(4), width: '100%' }}
                min={orderedUnits.orderedQuantityMin}
                max={orderedItemsRange[1] - 1}
                onChange={e => {
                  if (e) {
                    setOrderedItemsRange([e, orderedItemsRange[1]]);
                    filterFormRef.setFieldValue('orderedUnits', [
                      e,
                      orderedItemsRange[1]
                    ]);
                  }
                }}
              />
            </VsFormItem>
          </Col>
          <Col span={12}>
            <VsFormItem
              formItemProps={{
                initialValue: orderedUnits.orderedQuantityMax,
                name: 'orderedQuantityMax',
                noStyle: true
              }}
            >
              <InputNumber
                style={{ borderRadius: pxToRem(4), width: '100%' }}
                min={orderedItemsRange[0] + 1}
                max={orderedUnits.orderedQuantityMax}
                onChange={e => {
                  if (e) {
                    setOrderedItemsRange([orderedItemsRange[0], e]);

                    filterFormRef.setFieldValue('orderedUnits', [
                      orderedItemsRange[0],
                      e
                    ]);
                  }
                }}
              />
            </VsFormItem>
          </Col>
        </Row>
      </div>
    </div>
  );
};
