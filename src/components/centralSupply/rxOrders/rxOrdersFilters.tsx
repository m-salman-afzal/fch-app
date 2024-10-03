import { useEffect, useState } from 'react';
import { Col, Form, Grid, Input, Row, Slider, theme, Typography } from 'antd';
import { VsFormItem, VsSelectFormItem } from 'vs-design-components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TOrderedUnits } from '@/types/centralSupplyTypes';

import { ALL, ALL_OPTION, ANONYMOUS_OPTION } from '@/utils/constants';

import { useRxOrdersStyle } from './useRxOrdersStyle';

const { useBreakpoint } = Grid;
const { useToken } = theme;

interface props {
  orderedUnits: TOrderedUnits;
  isControlledAvailable: boolean;
}

export const RxOrdersFilters: React.FC<props> = ({
  orderedUnits,
  isControlledAvailable
}) => {
  const filterFormRef = Form.useFormInstance();
  const size = useBreakpoint();
  const { token } = useToken();
  const [orderedItemsRange, setOrderedItemsRange] = useState<number[]>([
    orderedUnits.calculatedOrderedQuantityMin,
    orderedUnits.calculatedOrderedQuantityMax
  ]);
  const { centralSupplyFilterSlider } = useRxOrdersStyle();

  const watch = Form.useWatch('orderedQuantity', filterFormRef);

  useEffect(() => {
    if (watch === undefined) {
      setOrderedItemsRange([
        orderedUnits.calculatedOrderedQuantityMin,
        orderedUnits.calculatedOrderedQuantityMax
      ]);
    }
  }, [watch]);

  useEffect(() => {
    filterFormRef.setFieldsValue({
      orderedQuantityMin: orderedUnits.calculatedOrderedQuantityMin,
      orderedQuantityMax: orderedUnits.calculatedOrderedQuantityMax
    });
  }, [orderedUnits]);

  return (
    <div style={{ paddingInline: pxToRem(17) }}>
      {isControlledAvailable && (
        <VsSelectFormItem
          options={[ALL_OPTION, ...ANONYMOUS_OPTION]}
          placeholder="Controlled"
          formItemProps={{
            name: 'isControlled',
            initialValue: ALL
          }}
          externalShowLabel={true}
        />
      )}

      <VsSelectFormItem
        options={[ALL_OPTION, ...ANONYMOUS_OPTION]}
        placeholder="Depleted"
        formItemProps={{
          name: 'isDepleted',
          initialValue: ALL
        }}
        externalShowLabel={true}
      />
      <VsSelectFormItem
        options={[ALL_OPTION, ...ANONYMOUS_OPTION]}
        placeholder="Formulary"
        formItemProps={{
          name: 'isFormulary',
          initialValue: 'true'
        }}
        externalShowLabel={true}
      />
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
          Qty Order
        </Typography.Text>
        <VsFormItem
          formItemProps={{
            noStyle: true,
            name: 'orderedQuantity',
            required: true
          }}
        >
          <Slider
            style={{
              margin: `0 ${pxToRem(7)} 0 ${pxToRem(7)}`
            }}
            range
            min={orderedUnits.calculatedOrderedQuantityMin}
            max={orderedUnits.calculatedOrderedQuantityMax}
            defaultValue={[
              orderedUnits.calculatedOrderedQuantityMin,
              orderedUnits.calculatedOrderedQuantityMax
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
                initialValue: orderedUnits.calculatedOrderedQuantityMin,
                name: 'orderedQuantityMin',
                noStyle: true
              }}
            >
              <Input
                style={{ borderRadius: pxToRem(4), width: '100%' }}
                min={orderedUnits.calculatedOrderedQuantityMin}
                max={orderedItemsRange[1] - 1}
                type={`number`}
                onChange={e => {
                  if (e) {
                    setOrderedItemsRange([
                      Number(e?.target?.value),
                      orderedItemsRange[1]
                    ]);
                    filterFormRef.setFieldValue('orderedQuantity', [
                      Number(e?.target?.value),
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
                initialValue: orderedUnits.calculatedOrderedQuantityMax,
                name: 'orderedQuantityMax',
                noStyle: true
              }}
            >
              <Input
                style={{ borderRadius: pxToRem(4), width: '100%' }}
                min={orderedItemsRange[0] + 1}
                max={orderedUnits.calculatedOrderedQuantityMax}
                type={`number`}
                onChange={e => {
                  if (e) {
                    setOrderedItemsRange([
                      orderedItemsRange[0],
                      Number(e?.target?.value)
                    ]);

                    filterFormRef.setFieldValue('orderedQuantity', [
                      orderedItemsRange[0],
                      Number(e?.target?.value)
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
