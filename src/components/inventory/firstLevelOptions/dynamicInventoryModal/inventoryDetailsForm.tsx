import { FC, useEffect, useState } from 'react';
import {
  Col,
  Form,
  FormInstance,
  Grid,
  Radio,
  Row,
  Spin,
  Typography
} from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsAutoCompleteFormItem,
  VsDatePickerFormItem,
  VsFormItem,
  VsSelectFormItem
} from 'vs-design-components';

import { Formulary } from '@/types/formularyTypes';

import { ANTIRETROVIRAL, CONTROLLED_TYPES } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useInventory } from '../hooks/useInventory';
import { useDynamicInventoryStyle } from './useDynamicInventoryStyle';

const { useBreakpoint } = Grid;

const CONTROLLED_TYPE_OPTIONS = [
  { label: 'Stock', value: 'STOCK', key: 'stock' },
  {
    label: 'Patient Specific',
    value: 'PATIENT_SPECIFIC',
    key: 'patientSpecific'
  }
];
interface Props {
  formRef: FormInstance;
  formData: Formulary;
  carts: any[];
}

export const InventoryDetailsForm: FC<Props> = ({
  formRef,
  formData,
  carts
}) => {
  const size = useBreakpoint();
  const formName = 'inventory';
  const { datePicker } = useDynamicInventoryStyle();
  const radioStyle = {
    border: `${pxToRem(1)} solid #00000026`,
    paddingInline: pxToRem(10),
    paddingBlock: pxToRem(12),
    width: pxToRem(158),
    marginInlineEnd: 0,
    borderRadius: pxToRem(4)
  };
  const [disabled, setDisable] = useState(false);

  const {
    isLoading,
    ndcList,
    ndcValue,
    lotList,
    lotValue,
    delayOnChangeNdc,
    onSelectLot,
    onSelectNdc,
    setLotValue,
    setNdcValue
  } = useInventory(formRef, formData, formName, () => setDisable(true));
  const [date, setDate] = useState<string>('');
  const watch = Form.useWatch([formName, 'expirationDate']);
  const [selectedControlledType, setSelectedControlledType] =
    useState<string>('STOCK');
  useEffect(() => {
    if (!!formRef.getFieldValue([formName, 'expirationDate'])) {
      setDate(formRef.getFieldValue([formName, 'expirationDate']).toString());

      return;
    }
    setDate('');
  }, [watch]);
  useEffect(() => {
    if (formData?.isControlled) {
      formRef.setFieldsValue({
        controlledType: 'STOCK'
      });
    }
  }, [formData]);

  return (
    <Row>
      <Col span={24}>
        <Row style={{ paddingBlockEnd: pxToRem(16) }}>
          <Typography.Text
            style={{
              fontSize: pxToRem(14),
              fontWeight: 400,
              color: 'rgba(0, 0, 0, 0.65)'
            }}
          >
            {formData.name}
          </Typography.Text>
        </Row>
        {!size.xs && formData?.isControlled && (
          <Row gutter={[16, 0]}>
            <Col>
              <VsFormItem
                formItemProps={{
                  name: 'controlledType',
                  rules: [
                    {
                      required: true,
                      message: <ErrorMessage>Select stock type</ErrorMessage>
                    }
                  ]
                }}
              >
                <Radio.Group
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    columnGap: pxToRem(14)
                  }}
                  name="controlledType"
                  value={selectedControlledType}
                  onChange={(e: any) => {
                    setSelectedControlledType(e?.target?.value);
                  }}
                >
                  <Radio value={'STOCK'} style={radioStyle}>
                    Stock
                  </Radio>
                  <Radio
                    value={CONTROLLED_TYPES.PATIENT_SPECIFIC}
                    style={radioStyle}
                  >
                    Patient Specific
                  </Radio>
                </Radio.Group>
              </VsFormItem>
            </Col>
          </Row>
        )}
        {size.xs && formData?.isControlled && (
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <VsSelectFormItem
                placeholder="Stock Type"
                formItemProps={{
                  name: 'controlledType',
                  rules: [
                    {
                      required: true,
                      message: <ErrorMessage>Select stock type</ErrorMessage>
                    }
                  ]
                }}
                options={CONTROLLED_TYPE_OPTIONS}
                onChange={(value: any) => {
                  setSelectedControlledType(value);
                }}
              />
            </Col>
          </Row>
        )}

        <Row gutter={[16, 0]}>
          <Col span={size.xs ? 24 : 12}>
            <VsAutoCompleteFormItem
              placeholder="NDC"
              width="100%"
              formItemProps={{
                name: [formName, 'ndc'],
                rules: [
                  {
                    message: <ErrorMessage>NDC is required</ErrorMessage>,
                    required: true
                  }
                ]
              }}
              onFocus={delayOnChangeNdc}
              autoCompleteProps={{
                options: ndcList,
                notFoundContent: isLoading ? (
                  <Spin size={'small'} spinning={isLoading} />
                ) : (
                  'No NDC found'
                ),
                onSearch: setNdcValue,
                value: ndcValue,
                onSelect: onSelectNdc
              }}
              onChange={() => setDisable(false)}
            />
          </Col>
          <Col span={size.xs ? 24 : 12}>
            <BasicInputFormItem
              placeholder="Manufacturer"
              width="100%"
              formItemProps={{
                name: [formName, 'manufacturer'],
                rules: [
                  {
                    message: (
                      <ErrorMessage>Manufacturer is required</ErrorMessage>
                    ),
                    required: true
                  }
                ]
              }}
              disabled={disabled}
            />
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col span={size.xs ? 24 : 12}>
            <VsAutoCompleteFormItem
              placeholder="Lot No"
              width="100%"
              formItemProps={{
                name: [formName, 'lotNo'],
                rules: [
                  {
                    message: <ErrorMessage>LotNo is required</ErrorMessage>,
                    required: true
                  }
                ]
              }}
              autoCompleteProps={{
                options: lotList,
                value: lotValue,
                onSelect: onSelectLot,
                onSearch: setLotValue
              }}
              onChange={() => setDisable(false)}
            />
          </Col>
          <Col span={size.xs ? 24 : 12} className={datePicker}>
            <VsDatePickerFormItem
              placeholder="MM/DD/YYYY"
              seperateLabel="Expiration Date"
              width="100%"
              datePickerProps={{
                minDate: new Date('01/01/1900'),
                maxDate: new Date('01/01/2200')
              }}
              date={date}
              formItemProps={{
                name: [formName, 'expirationDate'],
                rules: [
                  {
                    message: (
                      <ErrorMessage>Expiration Date is required</ErrorMessage>
                    ),
                    required: true
                  }
                ]
              }}
              disabled={disabled}
            />
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          {formData?.isControlled && (
            <Col span={size.xs ? 24 : 12}>
              <BasicInputFormItem
                placeholder="Controlled ID"
                width="100%"
                formItemProps={{
                  name: [formName, 'controlledId'],
                  rules: [
                    {
                      message: (
                        <ErrorMessage>Controlled ID is required</ErrorMessage>
                      ),
                      required: true
                    }
                  ]
                }}
              />
            </Col>
          )}

          <Col span={size.xs ? 24 : 12}>
            <BasicInputFormItem
              placeholder="Quantity"
              width="100%"
              type="number"
              min={0}
              formItemProps={{
                name: [formName, 'quantity'],
                rules: [
                  {
                    validator: (rule, val) => {
                      if (!val) {
                        return Promise.reject(
                          <ErrorMessage>Quantity is required</ErrorMessage>
                        );
                      }
                      if (!/^(0|[1-9][0-9]*)$/.test(val)) {
                        return Promise.reject(
                          <ErrorMessage>
                            Must be equal to or greater than 0
                          </ErrorMessage>
                        );
                      }

                      return Promise.resolve();
                    },
                    required: true
                  }
                ]
              }}
            />
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          {selectedControlledType === CONTROLLED_TYPES.PATIENT_SPECIFIC &&
            formData?.isControlled && (
              <Col span={size.xs ? 24 : 12}>
                <BasicInputFormItem
                  placeholder="Patient Name"
                  width="100%"
                  formItemProps={{
                    name: [formName, 'patientName'],
                    rules: [
                      {
                        message: (
                          <ErrorMessage>Patient name is required</ErrorMessage>
                        ),
                        required: true
                      }
                    ]
                  }}
                />
              </Col>
            )}

          {selectedControlledType === CONTROLLED_TYPES.PATIENT_SPECIFIC && (
            <Col span={size.xs ? 24 : 12}>
              <VsSelectFormItem
                placeholder="Cart"
                formItemProps={{
                  name: [formName, 'cartId'],
                  rules: [
                    {
                      required: true,
                      message: <ErrorMessage>Cart is required</ErrorMessage>
                    }
                  ]
                }}
                options={carts}
                showSearch={true}
                filterOption={(inputValue: string, option: any) => {
                  if (
                    option?.label
                      ?.toLowerCase()
                      ?.indexOf(inputValue?.toLowerCase()) !== -1
                  ) {
                    return true;
                  }

                  return false;
                }}
              />
            </Col>
          )}
        </Row>

        <Row gutter={[16, 0]}>
          {selectedControlledType === CONTROLLED_TYPES.PATIENT_SPECIFIC &&
            formData?.isControlled && (
              <Col span={size.xs ? 24 : 12}>
                <BasicInputFormItem
                  placeholder="Provider Name"
                  width="100%"
                  formItemProps={{
                    name: [formName, 'providerName'],
                    rules: [
                      {
                        message: (
                          <ErrorMessage>Provider name is required</ErrorMessage>
                        ),
                        required: true
                      }
                    ]
                  }}
                />
              </Col>
            )}
          {formData?.drugClass !== ANTIRETROVIRAL &&
            formData?.isControlled &&
            selectedControlledType === 'STOCK' && (
              <Col span={size.xs ? 24 : 12}>
                <BasicInputFormItem
                  placeholder="TR"
                  width="100%"
                  formItemProps={{
                    name: [formName, 'tr'],
                    rules: [
                      {
                        message: <ErrorMessage>TR is required</ErrorMessage>,
                        required: true
                      }
                    ]
                  }}
                />
              </Col>
            )}
          {formData?.drugClass !== ANTIRETROVIRAL &&
            formData?.isControlled &&
            selectedControlledType !== 'STOCK' && (
              <Col span={size.xs ? 24 : 12}>
                <BasicInputFormItem
                  placeholder="Rx"
                  width="100%"
                  formItemProps={{
                    name: [formName, 'rx']
                  }}
                />
              </Col>
            )}
        </Row>
      </Col>
    </Row>
  );
};
