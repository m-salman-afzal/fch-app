import { FC, useEffect } from 'react';
import { Col, Divider, FormInstance, Grid, Row, Typography } from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsSelectFormItem
} from 'vs-design-components';

import { Formulary } from '@/types/formularyTypes';

import { BOOLEAN_SELECT } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;
interface Props {
  formRef: FormInstance;
  formData: Formulary;
}

export const InventorySetLevelsForm: FC<Props> = ({ formRef, formData }) => {
  const size = useBreakpoint();
  const formName = 'levels';

  return (
    <div>
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
      <Row gutter={[8, 8]} style={{ width: '100%' }}>
        <Col span={size.xs ? 24 : 12}>
          <BasicInputFormItem
            placeholder="Par Level"
            width="100%"
            type="number"
            formItemProps={{
              name: [formName, 'parLevel'],
              rules: [
                {
                  required: true,
                  type: 'number',
                  validator: (rule, val) => {
                    if (!val) {
                      return Promise.reject(
                        <ErrorMessage>Par level is required</ErrorMessage>
                      );
                    }
                    if (!/^[1-9][0-9]*$/.test(val)) {
                      return Promise.reject(
                        <ErrorMessage>Must be greater than 0</ErrorMessage>
                      );
                    }

                    return Promise.resolve();
                  }
                }
              ]
            }}
          />
        </Col>
        <Col span={size.xs ? 24 : 12}>
          <BasicInputFormItem
            placeholder="Threshold"
            width="100%"
            type="number"
            formItemProps={{
              name: [formName, 'threshold'],
              rules: [
                {
                  required: true,
                  type: 'number',
                  validator: (rule, val) => {
                    if (!val) {
                      return Promise.reject(
                        <ErrorMessage>Threshold level is required</ErrorMessage>
                      );
                    }
                    if (!/^[1-9][0-9]*$/.test(val)) {
                      return Promise.reject(
                        <ErrorMessage>Must be greater than 0</ErrorMessage>
                      );
                    }

                    if (
                      Number(formRef.getFieldValue([formName, 'parLevel'])) <=
                      Number(val)
                    ) {
                      return Promise.reject(
                        <ErrorMessage>
                          Threshold should be less than Par level
                        </ErrorMessage>
                      );
                    }

                    return Promise.resolve();
                  }
                }
              ]
            }}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]} style={{ width: '100%' }}>
        <Col span={size.xs ? 24 : 12}>
          <BasicInputFormItem
            placeholder="Min"
            width="100%"
            type="number"
            formItemProps={{
              name: [formName, 'minLevel'],
              rules: [
                {
                  required: true,
                  type: 'number',
                  validator: (rule, val) => {
                    if (!val) {
                      return Promise.reject(
                        <ErrorMessage>Min level is required</ErrorMessage>
                      );
                    }
                    if (!/^[1-9][0-9]*$/.test(val)) {
                      return Promise.reject(
                        <ErrorMessage>Must be greater than 0</ErrorMessage>
                      );
                    }

                    return Promise.resolve();
                  }
                }
              ]
            }}
          />
        </Col>
        <Col span={size.xs ? 24 : 12}>
          <BasicInputFormItem
            type="number"
            placeholder="Max"
            width="100%"
            formItemProps={{
              name: [formName, 'maxLevel'],
              rules: [
                {
                  required: true,
                  type: 'number',
                  validator: (rule, val) => {
                    if (!val) {
                      return Promise.reject(
                        <ErrorMessage>Max level is required</ErrorMessage>
                      );
                    }
                    if (!/^[1-9][0-9]*$/.test(val)) {
                      return Promise.reject(
                        <ErrorMessage>Must be greater than 0</ErrorMessage>
                      );
                    }

                    if (
                      Number(formRef.getFieldValue([formName, 'minLevel'])) >=
                      Number(val)
                    ) {
                      return Promise.reject(
                        <ErrorMessage>
                          Max value must be greater than min
                        </ErrorMessage>
                      );
                    }

                    return Promise.resolve();
                  }
                }
              ]
            }}
          />
        </Col>
      </Row>
      <Row gutter={[8, 8]} style={{ width: '100%' }}>
        <Col span={size.xs ? 24 : 12}>
          <VsSelectFormItem
            options={BOOLEAN_SELECT}
            placeholder="Central Supply"
            formItemProps={{
              name: [formName, 'isStock'],
              rules: [
                {
                  required: true,
                  message: 'Central supply is required'
                }
              ],
              initialValue: false
            }}
            externalShowLabel={true}
          />
        </Col>
      </Row>
    </div>
  );
};
