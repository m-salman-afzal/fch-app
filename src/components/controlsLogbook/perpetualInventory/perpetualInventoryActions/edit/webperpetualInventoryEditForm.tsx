import { useEffect, useState } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Col, Divider, Form, Row, TimePicker, Typography } from 'antd';
import Image from 'next/image';
import {
  BasicInput,
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsDatePickerFormItem,
  VsFormItem,
  VsTextAreaFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TPerpetualInventory } from '@/types/perpetualInventoryTypes';

interface FirstLevelEditFormProps {
  isLoading: boolean;
  onCloseModal: () => void;
  perpetualInventory: TPerpetualInventory;
}
export const WebSignatureForm: React.FC<FirstLevelEditFormProps> = ({
  isLoading,
  onCloseModal,
  perpetualInventory
}) => {
  return (
    <>
      <Divider
        style={{
          margin: `${pxToRem(12)} 0 ${pxToRem(20)} 0`,
          borderColor: '#00000026'
        }}
      />
      <Row
        style={{
          paddingInline: pxToRem(22.5),
          width: '100%'
        }}
      >
        <Col span={24}>
          <BasicInputFormItem
            placeholder="Controlled ID"
            formItemProps={{
              name: 'controlledId',
              rules: [
                {
                  required: true,
                  message: <ErrorMessage>Enter Controlled Id</ErrorMessage>
                }
              ]
            }}
            width="auto"
          />
        </Col>
        {(perpetualInventory.tr || perpetualInventory.rx) && (
          <Col span={24}>
            <BasicInputFormItem
              placeholder="TR/Rx"
              formItemProps={{
                name: 'trx',
                rules: [
                  {
                    required: true,
                    message: <ErrorMessage>Enter TR/Rx</ErrorMessage>
                  }
                ]
              }}
              width="100%"
            />
          </Col>
        )}
        {perpetualInventory.isPatientSpecific && (
          <Col span={24}>
            <BasicInputFormItem
              placeholder="Patient Name"
              formItemProps={{
                name: 'patientName',
                rules: [
                  {
                    required: true,
                    message: <ErrorMessage>Enter Patient Name</ErrorMessage>
                  }
                ]
              }}
              width="100%"
            />
          </Col>
        )}
        {perpetualInventory.isPatientSpecific && (
          <Col span={24}>
            <BasicInputFormItem
              placeholder="Provider Name"
              formItemProps={{
                name: 'providerName',
                rules: [
                  {
                    required: true,
                    message: <ErrorMessage>Enter Provider Name</ErrorMessage>
                  }
                ]
              }}
              width="100%"
            />
          </Col>
        )}
        <Col span={24}>
          <BasicInputFormItem
            placeholder="Qty OH"
            formItemProps={{
              name: 'qtyOH',
              rules: [
                {
                  required: true,
                  message: <ErrorMessage>Enter Quantity Allocated</ErrorMessage>
                }
              ]
            }}
            width="100%"
          />
        </Col>
        <Col span={24}>
          <VsTextAreaFormItem
            placeholder="Comment"
            width="100%"
            autoSize={{
              maxRows: 40,
              minRows: 8
            }}
            formItemProps={{
              name: 'comment',
              rules: [
                {
                  required: true,
                  min: 10,
                  message: (
                    <ErrorMessage>
                      Enter Comment (min 10 characters)
                    </ErrorMessage>
                  )
                }
              ],
              style: {
                marginBottom: 0
              }
            }}
          />
        </Col>
      </Row>

      <Row>
        <Divider
          style={{
            margin: `${pxToRem(20)} 0 ${pxToRem(12)} 0`,
            borderColor: '#00000026'
          }}
        />

        <Col span={24}>
          <Row
            gutter={[14, 0]}
            style={{
              paddingInline: pxToRem(20)
            }}
          >
            <Col span={12}>
              <VsButton
                style={{ width: '100%' }}
                size={BUTTON_SIZES.large}
                onClick={onCloseModal}
              >
                Cancel
              </VsButton>
            </Col>
            <Col span={12}>
              <VsButton
                antButtonProps={{
                  type: 'primary',
                  htmlType: 'submit',
                  loading: isLoading
                }}
                style={{ width: '100%' }}
                size={BUTTON_SIZES.large}
              >
                Save
              </VsButton>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
