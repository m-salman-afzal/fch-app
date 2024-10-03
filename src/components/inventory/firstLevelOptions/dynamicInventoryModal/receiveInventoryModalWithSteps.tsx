import { FC, useEffect, useState } from 'react';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseOutlined
} from '@ant-design/icons';
import {
  Col,
  Divider,
  Form,
  FormInstance,
  Grid,
  Modal,
  Row,
  Steps,
  Typography
} from 'antd';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { Formulary } from '@/types/formularyTypes';

import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import { InventoryDetailsForm } from './inventoryDetailsForm';
import { InventorySetLevelsForm } from './inventorySetLevelsForm';
import { InventorySignaturesForm } from './inventorySignaturesForm';
import { useDynamicInventoryStyle } from './useDynamicInventoryStyle';

const { useBreakpoint } = Grid;
interface Props {
  open: boolean;
  isLoading: boolean;
  formRef: FormInstance;
  onCloseInventoryModal: () => void;
  currentInventoryFormStep: number;
  onChangeStepNumber: (current: number) => void;
  onClickBackButton: () => void;
  handleFormSubmit: (val: any) => void;
  formData: Formulary;
  carts: any[];
  steps: any[];
}

export const ReceiveInventoryModalWithSteps: FC<Props> = ({
  open,
  isLoading,
  formRef,
  onCloseInventoryModal,
  currentInventoryFormStep = 0,
  onChangeStepNumber,
  onClickBackButton,
  handleFormSubmit,
  formData,
  carts,
  steps
}) => {
  const { inventoryFormStepsContainer } = useDynamicInventoryStyle();

  const items = steps.map(item => ({ key: item.title, title: item.title }));

  const size = useBreakpoint();

  return (
    <Modal
      open={open}
      footer={null}
      destroyOnClose
      width={size.xs ? '100%' : pxToRem(680)}
      style={{
        maxWidth: 'none',
        margin: 0
      }}
      styles={{
        content: {
          padding: 0
        }
      }}
      onCancel={onCloseInventoryModal}
      maskClosable={false}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(20) }} />}
      centered
    >
      <Row style={{ flexDirection: size.xs ? `column` : `row` }} wrap={false}>
        <Col
          style={{
            paddingBlockStart: pxToRem(21),
            background: 'rgba(0, 0, 0, 0.04)',
            minWidth: size.xs ? `100%` : pxToRem(185)
          }}
        >
          {!size.xs && (
            <Typography.Title
              style={{
                paddingInlineStart: pxToRem(30),
                fontWeight: 600,
                fontSize: pxToRem(14),
                lineHeight: pxToRem(22),
                marginBlock: 0
              }}
            >
              Receive Inventory
            </Typography.Title>
          )}
          <Steps
            className={inventoryFormStepsContainer}
            current={currentInventoryFormStep}
            items={items}
            size={`small`}
            direction={size.xs ? `horizontal` : `vertical`}
            onChange={onChangeStepNumber}
            responsive={false}
          />
        </Col>
        <Col>
          <Form
            form={formRef}
            onFinish={handleFormSubmit}
            style={{
              display: `flex`,
              flexDirection: `column`,
              justifyContent: `center`,
              alignItems: `center`
            }}
            scrollToFirstError={true}
          >
            <Row
              style={{
                height: size.xs ? pxToRem(500) : `100%`,
                overflow: 'auto',
                scrollBehavior: 'smooth',
                justifyContent: size.xs ? `flex-start` : `center`,
                display: size.xs ? `block` : `flex`
              }}
            >
              <Col
                span={24}
                style={{
                  // width: size.xs ? 'auto' : pxToRem(500),
                  paddingInline: pxToRem(20),
                  paddingBlock: pxToRem(14)
                }}
              >
                <Typography.Text
                  style={{
                    fontWeight: 600,
                    fontSize: pxToRem(24)
                  }}
                >
                  {steps[currentInventoryFormStep].title}
                </Typography.Text>
              </Col>
              <Divider style={{ marginBlock: 0 }} />
              <Col
                span={24}
                style={{
                  paddingBlockStart: pxToRem(14),
                  paddingInline: pxToRem(20)
                }}
              >
                {steps[currentInventoryFormStep].title === 'Set Levels' && (
                  <InventorySetLevelsForm
                    formRef={formRef}
                    formData={formData}
                  />
                )}
                {steps[currentInventoryFormStep].title ===
                  'Inventory Details' && (
                  <InventoryDetailsForm
                    formRef={formRef}
                    formData={formData}
                    carts={carts}
                  />
                )}
                {steps[currentInventoryFormStep].title === 'Signatures' && (
                  <InventorySignaturesForm
                    formRef={formRef}
                    formData={formData}
                  />
                )}
              </Col>
            </Row>
            <Row
              justify={
                size.xs
                  ? `center`
                  : currentInventoryFormStep === 0
                    ? `end`
                    : `space-between`
              }
              style={{
                paddingTop: 0,
                paddingBottom: pxToRem(24),
                paddingInline: pxToRem(20),
                width: '100%'
              }}
            >
              {currentInventoryFormStep > 0 && (
                <Col span={12} style={{ paddingInlineEnd: pxToRem(7.5) }}>
                  <VsButton
                    style={{ width: size.xs ? '100%' : pxToRem(100) }}
                    size={BUTTON_SIZES.large}
                    onClick={onClickBackButton}
                  >
                    <ArrowLeftOutlined />
                    Back
                  </VsButton>
                </Col>
              )}
              <Col
                span={currentInventoryFormStep === 0 ? 24 : 12}
                style={{
                  paddingInlineStart:
                    currentInventoryFormStep === 0 ? undefined : pxToRem(7.5)
                }}
              >
                <Row justify={'end'}>
                  <VsButton
                    antButtonProps={{
                      type: 'primary',
                      htmlType: 'submit',
                      loading: isLoading
                    }}
                    style={{
                      width: size.xs
                        ? '100%'
                        : isLoading
                          ? undefined
                          : pxToRem(100)
                    }}
                    size={BUTTON_SIZES.large}
                  >
                    {currentInventoryFormStep < steps.length - 1 ? (
                      <>
                        Next
                        <ArrowRightOutlined style={{ marginLeft: 8 }} />
                      </>
                    ) : (
                      `Receive`
                    )}
                  </VsButton>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};
