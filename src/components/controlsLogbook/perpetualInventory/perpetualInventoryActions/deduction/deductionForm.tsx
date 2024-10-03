import { useEffect, useState } from 'react';
import { ClockCircleOutlined, LockOutlined } from '@ant-design/icons';
import { Col, Grid, Row, TimePicker, Typography } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsDatePickerFormItem,
  VsFormItem,
  VsSelectFormItem,
  VsTextAreaFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TPerpetualInventory } from '@/types/perpetualInventoryTypes';

import SignatureCollapsible from '@/components/common/signCollapsible/signCollapsible';
import { useDynamicSafeReportStyle } from '@/components/dynamicSafeReportForm/useDynamicSafeReportStyle';

import { PERPETUAL_INVENTORY_DEDUCTION_TYPES } from '@/containers/controlsLogbook/constants';
import { DATE_FORMATS } from '@/utils/dateFormatsTimezones';

interface AdministerFormProps {
  isLoading: boolean;
  carts: any;
  perpetualInventory: TPerpetualInventory;
  onCloseModal: () => void;
  size: any;
}
export const WebAdministerForm: React.FC<AdministerFormProps> = ({
  isLoading,
  carts,
  onCloseModal,
  perpetualInventory,
  size
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const { safeReportTimePicker } = useDynamicSafeReportStyle();

  const form = useFormInstance();

  const showComment = () => {
    if (perpetualInventory) {
      const { deductionType } = perpetualInventory;

      switch (deductionType) {
        case PERPETUAL_INVENTORY_DEDUCTION_TYPES.DOSE_ADMINISTERED:
          return false;

        case PERPETUAL_INVENTORY_DEDUCTION_TYPES.WASTED:
          return true;

        case PERPETUAL_INVENTORY_DEDUCTION_TYPES.DESTROYED:
          return true;

        case PERPETUAL_INVENTORY_DEDUCTION_TYPES.TRANSFERRED:
          return true;

        case PERPETUAL_INVENTORY_DEDUCTION_TYPES.RETURNED_TO_PATIENT:
          return false;

        case PERPETUAL_INVENTORY_DEDUCTION_TYPES.RETURNED_TO_PROPERTY:
          return false;

        default:
          return false;
      }
    }

    return false;
  };

  const showCartDropDown = () => {
    if (perpetualInventory) {
      const { deductionType } = perpetualInventory;

      return deductionType === PERPETUAL_INVENTORY_DEDUCTION_TYPES.TRANSFERRED;
    }

    return false;
  };

  return (
    <Row
      style={{
        overflowY: size.xs ? 'scroll' : undefined,
        height: size.xs ? '70dvh' : undefined
      }}
    >
      <Col
        style={{
          paddingBlockStart: pxToRem(20),
          paddingInline: pxToRem(20),
          borderBlock: `${pxToRem(1)} solid  #00000026`
        }}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Row>
              <Col span={12} style={{ paddingRight: pxToRem(8) }}>
                <VsDatePickerFormItem
                  placeholder="Date"
                  formItemProps={{
                    name: 'date'
                  }}
                  width="100%"
                />
              </Col>

              <Col span={12} style={{ paddingInlineStart: pxToRem(8) }}>
                <VsFormItem
                  formItemProps={{
                    name: 'time'
                  }}
                >
                  <TimePicker
                    placeholder="Time"
                    format={DATE_FORMATS.TIME}
                    style={{
                      width: `100%`,
                      height: pxToRem(48.08),
                      borderRadius: pxToRem(4)
                    }}
                    suffixIcon={
                      <>
                        {(isFocused || form.getFieldValue('time')) && (
                          <Typography.Text
                            style={{
                              zIndex: 1,
                              top: pxToRem(-22),
                              left: pxToRem(5),
                              fontSize: pxToRem(12),
                              backgroundColor: `white`,
                              color: `rgba(0, 0, 0, 0.45)`,
                              position: `absolute`,
                              padding: `0px 0.29rem 0.29rem 0.29rem`,
                              fontFamily: `inter`
                            }}
                          >
                            Time
                          </Typography.Text>
                        )}
                        <ClockCircleOutlined />
                      </>
                    }
                    onBlur={e => {
                      setIsFocused(e?.target?.value ? true : false);
                    }}
                    onFocus={e => {
                      setIsFocused(true);
                    }}
                    className={safeReportTimePicker}
                  />
                </VsFormItem>
              </Col>
            </Row>
          </Col>

          <Col xs={24} sm={12}>
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={showCartDropDown() ? 10 : 24}>
                <BasicInputFormItem
                  placeholder={'Qty'}
                  formItemProps={{
                    name: 'quantityDeducted',
                    rules: [
                      {
                        validator: (rule, val) => {
                          if (!val) {
                            return Promise.reject(
                              <ErrorMessage>Enter Qty</ErrorMessage>
                            );
                          }
                          if (!/^[1-9][0-9]*$/.test(val)) {
                            return Promise.reject(
                              <ErrorMessage>
                                Must be greater than 0
                              </ErrorMessage>
                            );
                          }
                          if (val > perpetualInventory.quantityAllocated) {
                            return Promise.reject(
                              <ErrorMessage>
                                Must be less than Qty OH
                              </ErrorMessage>
                            );
                          }

                          return Promise.resolve();
                        },
                        required: true
                      }
                    ]
                  }}
                  width="100%"
                  type="number"
                />
              </Col>

              {showCartDropDown() && (
                <Col xs={24} sm={14}>
                  <VsSelectFormItem
                    placeholder="Cart"
                    formItemProps={{
                      name: 'cartId',
                      rules: [
                        {
                          required: true,
                          message: <ErrorMessage>Select Cart</ErrorMessage>
                        }
                      ]
                    }}
                    width="100%"
                    loading={isLoading}
                    options={carts}
                  />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Row>
              <Col span={24}>
                <BasicInputFormItem
                  placeholder="Patient Name"
                  formItemProps={{
                    name: 'patientName',
                    required: true,
                    rules: [
                      {
                        required: true,
                        message: <ErrorMessage>Enter Patient Name</ErrorMessage>
                      }
                    ]
                  }}
                  disabled={perpetualInventory?.isPatientSpecific}
                  suffix={
                    perpetualInventory?.isPatientSpecific ? (
                      <LockOutlined />
                    ) : undefined
                  }
                  width="100%"
                />
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={12}>
            <Row>
              <Col span={24}>
                <BasicInputFormItem
                  placeholder="Provider Name"
                  formItemProps={{
                    name: 'providerName',
                    rules: [
                      {
                        required: true,
                        message: (
                          <ErrorMessage>Enter Provider Name</ErrorMessage>
                        )
                      }
                    ]
                  }}
                  width="100%"
                  disabled={perpetualInventory?.isPatientSpecific}
                  suffix={
                    perpetualInventory?.isPatientSpecific ? (
                      <LockOutlined />
                    ) : undefined
                  }
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={[16, 0]} style={{ paddingBlockEnd: pxToRem(20) }}>
          <Col xs={24} sm={12}>
            <SignatureCollapsible
              header={`${
                perpetualInventory.deductionType ===
                PERPETUAL_INVENTORY_DEDUCTION_TYPES.DESTROYED
                  ? 'Pharmacist'
                  : 'Your'
              } Signature`}
              inputPlaceHolder={`${
                perpetualInventory.deductionType ===
                PERPETUAL_INVENTORY_DEDUCTION_TYPES.DESTROYED
                  ? 'Pharmacist'
                  : 'Your'
              } Name`}
              inputItemFormName={'adminName'}
              itemFormItemErrorMessage={'Enter Your Name'}
              signatureFormName={'adminSignature'}
              signatureFormErrorMessage={'Draw Signature'}
            />
          </Col>

          <Col xs={24} sm={12}>
            <SignatureCollapsible
              header={'Witness Signature'}
              inputPlaceHolder={'Witness Name'}
              inputItemFormName={'witnessName'}
              itemFormItemErrorMessage={'Enter Witness Name'}
              signatureFormName={'witnessSignature'}
              signatureFormErrorMessage={'Draw Signature'}
            />
          </Col>
        </Row>
        {perpetualInventory.deductionType ===
          PERPETUAL_INVENTORY_DEDUCTION_TYPES.DESTROYED && (
          <Row gutter={[16, 0]} style={{ paddingBlockEnd: pxToRem(20) }}>
            <Col xs={24} sm={12}>
              <SignatureCollapsible
                header={'Nurse Signature'}
                inputPlaceHolder={'Nurse Name'}
                inputItemFormName={'nurseName'}
                itemFormItemErrorMessage={'Enter Nurse Name'}
                signatureFormName={'nurseSignature'}
                signatureFormErrorMessage={'Draw Signature'}
              />
            </Col>
          </Row>
        )}

        {showComment() && (
          <Row>
            <Col span={24}>
              <VsTextAreaFormItem
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
                  ]
                }}
                width="100%"
                autoSize={{ minRows: 5 }}
                placeholder="Comment"
              />
            </Col>
          </Row>
        )}
      </Col>

      <Col span={24}>
        <Row
          justify={'end'}
          style={{ marginBlockStart: pxToRem(12), paddingInline: pxToRem(20) }}
        >
          <VsButton
            style={{ width: pxToRem(130), marginInlineEnd: pxToRem(14) }}
            size={BUTTON_SIZES.large}
            onClick={onCloseModal}
          >
            Cancel
          </VsButton>
          <VsButton
            antButtonProps={{
              type: 'primary',
              htmlType: 'submit',
              loading: isLoading
            }}
            style={{ width: pxToRem(130) }}
            size={BUTTON_SIZES.large}
          >
            Save
          </VsButton>
        </Row>
      </Col>
    </Row>
  );
};
