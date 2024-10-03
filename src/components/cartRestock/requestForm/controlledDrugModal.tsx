import { FC, useEffect, useState } from 'react';
import { CloseOutlined, LockOutlined } from '@ant-design/icons';
import { Col, Form, Grid, Modal, Row, Typography } from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsSelectFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TControlledIds } from '@/types/cartFulfillmentTypes';
import { SelectOption } from '@/types/commonTypes';
import { TRequestForm, TRequestFormData } from '@/types/requestFormDataTypes';

import SignatureCollapsible from '@/components/common/signCollapsible/signCollapsible';

import { DRUG_CLASSES } from '@/containers/carFulfillment/constants';
import { useFetch } from '@/hooks/useFetch';
import { getCartRequestForm } from '@/utils/endpoints';
import { toBase64File } from '@/utils/sharedUtils';

import { Counter } from './counter';
import { useCartRequestormStyle } from './useRequestFormStyle';

const { useBreakpoint } = Grid;
interface props {
  isOpen: boolean;
  reviewData: TRequestFormData[];
  requestFormData: TRequestForm;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
}
export const ControlledDrugModal: FC<props> = ({
  requestFormData,
  isOpen,
  reviewData,
  isLoading,
  onSubmit,
  onCancel
}) => {
  const [controlledIds, setControlledIds] = useState<
    (SelectOption & { tr: string })[]
  >([]);
  const [pkgQty, setPkgQty] = useState(0);
  const [isPkgQty, setErrorForPkg] = useState(false);
  const [form] = Form.useForm();
  const { controlledDrugModal, errorClass, counterStyle } =
    useCartRequestormStyle();
  const { fetchData } = useFetch();
  const modelTitle = `After-hours Request: ${requestFormData?.label} (Controlled)`;
  const [drugDetails] = reviewData;
  const size = useBreakpoint();
  const handlePkgQtyChange = (value: number) => {
    setErrorForPkg(false);
    setPkgQty(value);
  };

  const getControlledIds = async () => {
    const url = `${getCartRequestForm()}/controlledIds`;
    const payload = {
      formularyId: drugDetails.formularyId
    };

    const controlledIds = (await fetchData(url, payload)) as any;
    if (controlledIds.status !== 'error') {
      setControlledIds(() => {
        return (controlledIds as TControlledIds[]).map(
          ({ controlledId, tr, controlledDrugId }) => {
            return {
              label: controlledId,
              key: controlledDrugId,
              value: controlledDrugId,
              tr: tr
            };
          }
        );
      });
    }
  };

  const onFinish = async (values: any) => {
    const formFields: any = {
      signatureImages: {},
      ...values
    };
    if (Array.isArray(values.signatureImages.receiverSignatureImage)) {
      formFields.signatureImages.receiverSignatureImage = await toBase64File(
        values.signatureImages.receiverSignatureImage[0].originFileObj
      );
    }

    if (Array.isArray(values.signatureImages.witnessSignatureImage)) {
      formFields.signatureImages.witnessSignatureImage = await toBase64File(
        values.signatureImages.witnessSignatureImage[0].originFileObj
      );
    }
    if (pkgQty === 0) {
      return;
    }
    formFields.packageQuantity = pkgQty;
    await onSubmit(formFields);
  };

  const checkBeforeSubmit = () => {
    if (pkgQty === 0) {
      setErrorForPkg(true);
    }
  };

  const onClose = () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (isOpen) {
      getControlledIds();
      form.setFieldsValue({
        drug: drugDetails.formulary.name,
        cart: requestFormData?.label
      });
    }
  }, [isOpen]);

  return (
    <Modal
      rootClassName={controlledDrugModal}
      open={isOpen}
      onCancel={onClose}
      title={modelTitle}
      footer={null}
      maskClosable={false}
      centered
      style={{
        maxWidth: 'none'
      }}
      destroyOnClose
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      width={size.xs ? '100vw' : pxToRem(872)}
    >
      <Form
        form={form}
        style={{ width: '100%' }}
        onFinish={values =>
          onFinish({
            ...values,
            controlledId: controlledIds.find(
              controlled => controlled.value === values.controlledId
            )?.label
          })
        }
        onSubmitCapture={checkBeforeSubmit}
      >
        <Row
          gutter={[24, 0]}
          style={
            size.xs
              ? {
                  overflowY: 'scroll',
                  height: '70dvh',
                  paddingInline: pxToRem(20),
                  paddingBlock: pxToRem(20)
                }
              : { padding: pxToRem(20) }
          }
        >
          <Col span={12} md={12} xs={24}>
            <Row>
              <Col span={24} style={{ marginBottom: pxToRem(32) }}>
                <Typography.Text
                  style={{
                    fontSize: pxToRem(16),
                    marginBottom: pxToRem(6),
                    fontWeight: 600
                  }}
                >
                  Pkg Qty
                </Typography.Text>
                <div style={{ marginBlockStart: pxToRem(6) }}>
                  {isOpen ? (
                    <Counter
                      initialValue="0"
                      plusButtonType={'primary'}
                      classname={counterStyle}
                      max={drugDetails?.max}
                      min={0}
                      pendingOrders={
                        drugDetails?.cartRequestForm?.packageQuantity || 0
                      }
                      onChange={handlePkgQtyChange}
                    />
                  ) : null}

                  {isPkgQty && (
                    <ErrorMessage className={errorClass}>
                      Enter Pkg Qty
                    </ErrorMessage>
                  )}
                </div>
              </Col>

              <Col span={24}>
                <BasicInputFormItem
                  placeholder={'Drug'}
                  width="100%"
                  disabled
                  suffix={<LockOutlined />}
                  formItemProps={{
                    initialValue: drugDetails && drugDetails.formulary.name,
                    name: 'drug',
                    rules: [
                      {
                        required: true,
                        message: <ErrorMessage>Enter Drug Name</ErrorMessage>
                      }
                    ]
                  }}
                />
              </Col>
              {size.xs && (
                <>
                  <Col span={24}>
                    <BasicInputFormItem
                      placeholder="Cart"
                      disabled
                      suffix={<LockOutlined />}
                      formItemProps={{
                        name: 'cart',
                        rules: [
                          {
                            required: true,
                            message: (
                              <ErrorMessage>Enter Cart Name</ErrorMessage>
                            )
                          }
                        ]
                      }}
                      width="100%"
                    />
                  </Col>
                  <Col span={24}>
                    <VsSelectFormItem
                      placeholder="Controlled ID"
                      options={controlledIds}
                      formItemProps={{
                        name: 'controlledId',
                        rules: [
                          {
                            required: true,
                            message: (
                              <ErrorMessage>Select Controlled Id</ErrorMessage>
                            )
                          }
                        ]
                      }}
                      onSelect={e => {
                        if (
                          reviewData[0]?.formulary?.drugClass !==
                          DRUG_CLASSES.ARV
                        ) {
                          form.setFieldValue(
                            'tr',
                            controlledIds.find(
                              controlled => controlled.value === e
                            )?.tr
                          );
                        }
                      }}
                    />
                  </Col>
                  {reviewData[0]?.formulary?.drugClass !== DRUG_CLASSES.ARV && (
                    <Col span={24}>
                      <BasicInputFormItem
                        placeholder="TR"
                        disabled
                        suffix={<LockOutlined />}
                        formItemProps={{
                          name: 'tr',
                          rules: [
                            {
                              required: true,
                              message: (
                                <ErrorMessage>Enter TR Name</ErrorMessage>
                              )
                            }
                          ]
                        }}
                        width="100%"
                      />
                    </Col>
                  )}
                </>
              )}

              <Col span={24}>
                <SignatureCollapsible
                  inputItemFormName={'receiverName'}
                  signatureFormName={[
                    'signatureImages',
                    'receiverSignatureImage'
                  ]}
                  inputPlaceHolder="Your Name"
                  header="Your Signature"
                  itemFormItemErrorMessage={'Enter Your Name'}
                  signatureFormErrorMessage={'Draw Signature'}
                />
              </Col>
            </Row>
          </Col>
          <Col span={12} md={12} xs={24}>
            <Row>
              {!size.xs && (
                <>
                  <Col span={24} style={{ marginBlockStart: pxToRem(42) }}>
                    <BasicInputFormItem
                      placeholder="Cart"
                      disabled
                      suffix={<LockOutlined />}
                      formItemProps={{
                        name: 'cart',
                        rules: [
                          {
                            required: true,
                            message: (
                              <ErrorMessage>Enter Cart Name</ErrorMessage>
                            )
                          }
                        ],
                        style: {
                          marginBlockEnd: pxToRem(16)
                        }
                      }}
                      width="100%"
                    />
                  </Col>
                  {reviewData[0]?.formulary?.drugClass === DRUG_CLASSES.ARV && (
                    <Col span={24}>
                      <VsSelectFormItem
                        placeholder="Controlled ID"
                        options={controlledIds}
                        formItemProps={{
                          name: 'controlledId',

                          rules: [
                            {
                              required: true,
                              message: (
                                <ErrorMessage>
                                  Select Controlled Id
                                </ErrorMessage>
                              )
                            }
                          ]
                        }}
                      />
                    </Col>
                  )}
                  {reviewData[0]?.formulary?.drugClass !== DRUG_CLASSES.ARV && (
                    <>
                      <Col span={12} style={{ paddingInlineEnd: pxToRem(8) }}>
                        <VsSelectFormItem
                          placeholder="Controlled ID"
                          options={controlledIds}
                          onSelect={e => {
                            form.setFieldValue(
                              'tr',
                              controlledIds.find(
                                controlled => controlled.value === e
                              )?.tr
                            );
                          }}
                          formItemProps={{
                            name: 'controlledId',
                            rules: [
                              {
                                required: true,
                                message: (
                                  <ErrorMessage>
                                    Select Controlled Id
                                  </ErrorMessage>
                                )
                              }
                            ]
                          }}
                        />
                      </Col>
                      <Col span={12} style={{ paddingInlineStart: pxToRem(8) }}>
                        <BasicInputFormItem
                          placeholder="TR"
                          disabled
                          suffix={<LockOutlined />}
                          formItemProps={{
                            name: 'tr',
                            rules: [
                              {
                                required: true,
                                message: (
                                  <ErrorMessage>Enter TR Name</ErrorMessage>
                                )
                              }
                            ],
                            style: {
                              marginBlockEnd: pxToRem(16)
                            }
                          }}
                          width="100%"
                        />
                      </Col>
                    </>
                  )}
                </>
              )}

              <Col
                span={24}
                style={
                  size.xs
                    ? {
                        marginBlockStart: pxToRem(16)
                      }
                    : undefined
                }
              >
                {isOpen && (
                  <SignatureCollapsible
                    inputItemFormName="witnessName"
                    signatureFormName={[
                      'signatureImages',
                      'witnessSignatureImage'
                    ]}
                    inputPlaceHolder="Witness Name"
                    header={'Witness Signature'}
                    itemFormItemErrorMessage={'Enter Witness Name'}
                    signatureFormErrorMessage={'Draw Signature'}
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row
          justify={size.xs ? 'space-between' : 'end'}
          gutter={size.xs ? undefined : 14}
          className="footer"
        >
          <Col>
            <VsButton
              size={BUTTON_SIZES.large}
              onClick={onClose}
              style={{
                width: size.xs ? pxToRem(109) : pxToRem(183)
              }}
            >
              Cancel
            </VsButton>
          </Col>
          <Col>
            <VsButton
              size={BUTTON_SIZES.large}
              style={{
                width: pxToRem(235)
              }}
              antButtonProps={{
                type: 'primary',
                htmlType: 'submit',
                loading: isLoading
              }}
            >
              Remove from Inventory
            </VsButton>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
