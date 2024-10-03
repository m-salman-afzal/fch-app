import { ClockCircleOutlined } from '@ant-design/icons';
import { Col, Divider, Grid, Row, TimePicker, Typography } from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsDatePickerFormItem,
  VsFormItem,
  VsTextAreaFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { DATE_FORMATS } from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

interface Props {
  onCloseModal: () => void;
  deductionType: string;
  qtyOH: number;
  quantityDeducted: number;
}
const { useBreakpoint } = Grid;
export const PerpetualInventoryDeductionEditForm: React.FC<Props> = ({
  onCloseModal,
  deductionType,
  qtyOH,
  quantityDeducted
}: Props) => {
  const isFocused = true;
  const size = useBreakpoint();

  return (
    <Col>
      <Col
        style={{
          borderBlock: `${pxToRem(1)} solid  #00000026`,
          paddingBlockStart: pxToRem(20),
          marginBlockStart: pxToRem(12),
          paddingBlockEnd: pxToRem(20)
        }}
      >
        <Col
          style={{
            marginInline: size.xs ? pxToRem(15) : pxToRem(21)
          }}
        >
          <Row justify={'space-between'}>
            <Col>
              <VsDatePickerFormItem
                placeholder="Date"
                formItemProps={{
                  name: 'date'
                }}
                width={pxToRem(172)}
              />
            </Col>
            <Col>
              <VsFormItem
                formItemProps={{
                  name: `time`
                }}
              >
                <TimePicker
                  placeholder="Time"
                  format={DATE_FORMATS.TIME}
                  style={{
                    width: pxToRem(172),
                    height: pxToRem(48.08),
                    borderRadius: pxToRem(4)
                  }}
                  suffixIcon={
                    <>
                      {isFocused && (
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
                />
              </VsFormItem>
            </Col>
          </Row>

          {deductionType !== 'Destroyed' && deductionType !== 'Transferred' && (
            <>
              <Row>
                <Col span={24}>
                  <BasicInputFormItem
                    placeholder="Patient Name"
                    formItemProps={{
                      name: 'patientName'
                    }}
                    width="100%"
                  />
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <BasicInputFormItem
                    placeholder="Provider Name"
                    formItemProps={{
                      name: 'providerName'
                    }}
                    width="100%"
                  />
                </Col>
              </Row>
            </>
          )}
          <Row>
            <Col span={24}>
              <BasicInputFormItem
                placeholder={deductionType}
                formItemProps={{
                  name: 'quantityDeducted',
                  rules: [
                    {
                      validator: (rule, value) => {
                        value = Number(value);
                        if (!value) {
                          return Promise.reject(
                            <ErrorMessage>Enter Qty</ErrorMessage>
                          );
                        }
                        if (!/^[1-9][0-9]*$/.test(value)) {
                          return Promise.reject(
                            <ErrorMessage>Must be greater than 0</ErrorMessage>
                          );
                        }
                        if (value - quantityDeducted > qtyOH) {
                          return Promise.reject(
                            <ErrorMessage>
                              Must be less than Qty OH
                            </ErrorMessage>
                          );
                        }

                        return Promise.resolve();
                      }
                    }
                  ]
                }}
                type="number"
                width="100%"
              />
            </Col>
          </Row>

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
                          Type Details (min 10 characters)
                        </ErrorMessage>
                      )
                    }
                  ],
                  style: { marginBottom: 0 }
                }}
                width="100%"
                autoSize={{ minRows: 5 }}
                placeholder="Comment"
              />
            </Col>
          </Row>
        </Col>
      </Col>

      <Row
        justify={'space-between'}
        style={{
          paddingBlockStart: pxToRem(12),
          paddingInline: pxToRem(20)
        }}
      >
        <Col>
          <VsButton
            style={{
              width: pxToRem(174)
            }}
            size={BUTTON_SIZES.large}
            onClick={onCloseModal}
          >
            Cancel
          </VsButton>
        </Col>
        <Col>
          <VsButton
            style={{
              width: pxToRem(174)
            }}
            antButtonProps={{
              type: 'primary',
              htmlType: 'submit'
              //   loading: isLoading
            }}
            size={BUTTON_SIZES.large}
          >
            Save
          </VsButton>
        </Col>
      </Row>
    </Col>
  );
};
