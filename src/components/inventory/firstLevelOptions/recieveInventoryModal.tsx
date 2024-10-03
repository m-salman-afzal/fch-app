import { FC, useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import {
  Col,
  Divider,
  Form,
  FormInstance,
  Grid,
  Modal,
  Row,
  Spin,
  Typography
} from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsAutoCompleteFormItem,
  VsButton,
  VsDatePickerFormItem,
  VsMobileDatePickerFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { Formulary } from '@/types/formularyTypes';

import { pxToRem } from '@/utils/sharedUtils';

import { useInventory } from './hooks/useInventory';

const { useBreakpoint } = Grid;

interface Props {
  showModal: boolean;
  handleCancel: () => void;
  form: FormInstance;
  formData: any;
  onFinish: (data: any) => void;
  isLoading: boolean;
  isEdit?: boolean;
}

export const RecieveInventoryModal: FC<Props> = ({
  showModal,
  handleCancel,
  form,
  onFinish,
  isLoading: loading,
  formData,
  isEdit
}) => {
  const size = useBreakpoint();
  const [disabled, setDisable] = useState(false);

  const formName = 'inventory';

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
  } = useInventory(form, formData, formName, () => setDisable(true));

  const [date, setDate] = useState<string>('');

  const watch = Form.useWatch([formName, 'expirationDate'], form);

  useEffect(() => {
    if (!!form.getFieldValue([formName, 'expirationDate'])) {
      setDate(
        form.getFieldValue([formName, 'expirationDate']).toString() ?? ''
      );

      return;
    }
    setDate('');
  }, [watch]);

  return (
    <Modal
      open={showModal}
      destroyOnClose={true}
      footer={null}
      style={{
        maxWidth: 'none',
        margin: 0
      }}
      title={
        <Typography.Title
          style={{
            marginBlock: 0,
            fontSize: pxToRem(20),
            paddingLeft: pxToRem(20)
          }}
        >
          {isEdit ? 'Edit Inventory' : 'Receive Inventory'}
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(402)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(20) }} />}
      onCancel={handleCancel}
    >
      <Divider style={{ margin: `${pxToRem(12)} 0px ${pxToRem(20)} 0px` }} />
      <Form form={form} onFinish={onFinish}>
        <div style={{ paddingInline: pxToRem(20) }}>
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
            onChange={() => setDisable(false)}
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
          />
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
            onChange={() => setDisable(false)}
            autoCompleteProps={{
              options: lotList,
              value: lotValue,
              onSelect: onSelectLot,
              onSearch: setLotValue
            }}
          />
          {size.xs ? (
            <VsMobileDatePickerFormItem
              placeholder="MM/DD/YYYY"
              seperateLabel="Expiration Date"
              width="100%"
              min={new Date('01/01/1900')}
              max={new Date('01/01/2200')}
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
          ) : (
            <VsDatePickerFormItem
              placeholder="MM/DD/YYYY"
              seperateLabel="Expiration Date"
              width="100%"
              datePickerProps={{
                minDate: new Date('01/01/1900'),
                maxDate: new Date('01/01/2200')
              }}
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
              date={date}
            />
          )}
          {!formData.isControlled && (
            <BasicInputFormItem
              placeholder="Quantity"
              width="100%"
              type="number"
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
          )}
        </div>
        <Divider style={{ margin: `${pxToRem(20)} 0px ${pxToRem(12)} 0px` }} />

        <div style={{ paddingInline: pxToRem(20) }}>
          <Row gutter={[14, 14]}>
            <Col span={12}>
              <VsButton
                style={{ width: '100%' }}
                onClick={handleCancel}
                size={BUTTON_SIZES.large}
              >
                Cancel
              </VsButton>
            </Col>
            <Col span={12}>
              <VsButton
                antButtonProps={{
                  type: 'primary',
                  htmlType: 'submit',
                  loading
                }}
                style={{ width: '100%' }}
                size={BUTTON_SIZES.large}
              >
                {isEdit ? 'Save' : 'Receive'}
              </VsButton>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};
