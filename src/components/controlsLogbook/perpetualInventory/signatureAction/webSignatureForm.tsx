import { useEffect, useState } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Col, Divider, Row, TimePicker, Typography } from 'antd';
import Image from 'next/image';
import {
  BasicInput,
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsDatePickerFormItem,
  VsFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import {
  TPerpetualInventory,
  TSignature
} from '@/types/perpetualInventoryTypes';

import SignatureCollapsible from '@/components/common/signCollapsible/signCollapsible';

import { PERPETUAL_SIGNATURE_TYPES } from '@/containers/controlsLogbook/constants';

interface AdministerFormProps {
  isLoading: boolean;
  onCloseModal: () => void;
  signature: TSignature;
}
export const WebSignatureForm: React.FC<AdministerFormProps> = ({
  isLoading,
  onCloseModal,
  signature
}) => {
  const getString = (type: string) => {
    switch (signature?.signatureType) {
      case PERPETUAL_SIGNATURE_TYPES.STAFF_SIGNATURE:
        return `Staff ${type}`;
      case PERPETUAL_SIGNATURE_TYPES.ADMIN_SIGNATURE:
        return `Admin ${type}`;
      case PERPETUAL_SIGNATURE_TYPES.WITNESS_SIGNATURE:
        return `Witness ${type}`;
      default:
        return '';
    }
  };

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
          paddingInline: pxToRem(20),
          width: '100%'
        }}
        wrap={false}
      >
        <Col span={24} style={{}}>
          {!signature.name && signature.isPerpetualInventory && (
            <Row>
              <Col span={24}>
                <SignatureCollapsible
                  header={'Your Signature'}
                  inputPlaceHolder={'Your Name'}
                  inputItemFormName={'staffName'}
                  itemFormItemErrorMessage={'Enter Your Name'}
                  signatureFormName={'signature'}
                  signatureFormErrorMessage={'Draw Signature'}
                />
              </Col>
            </Row>
          )}

          {((signature.name && signature.isPerpetualInventory) ||
            !signature.isPerpetualInventory) && (
            <Row>
              <Col
                span={24}
                style={{
                  border: '1px solid #EBEBEB',
                  borderRadius: pxToRem(4),
                  padding: pxToRem(16)
                }}
              >
                <Row>
                  <Typography.Title
                    style={{
                      marginBlock: 0,
                      fontSize: pxToRem(20)
                    }}
                  >
                    {getString('Signature')}
                  </Typography.Title>
                </Row>
                <Row>
                  <Divider
                    style={{
                      margin: `${pxToRem(16)} 0 ${pxToRem(16)} 0`
                    }}
                  />
                </Row>
                <Row
                  style={{
                    background: '#00000005'
                  }}
                >
                  <Image
                    className={''}
                    alt={getString('Signature')}
                    src={signature ? (signature.signatureUrl as string) : ''}
                    style={{ width: '100%' }}
                    height={206}
                    width={298}
                    priority={true}
                    loading={'eager'}
                  />
                </Row>
                <Row>
                  <Divider
                    style={{
                      margin: `${pxToRem(16)} 0 ${pxToRem(16)} 0`
                    }}
                  />
                </Row>
                <Row>
                  <BasicInput
                    placeholder={getString('Name')}
                    width={'100%'}
                    value={signature ? (signature.name as string) : ''}
                    readOnly={true}
                    externalShowLabel={true}
                    setExternalShowLabel={() => {}}
                  />
                </Row>
              </Col>
            </Row>
          )}
        </Col>
      </Row>

      {!signature.name && signature.isPerpetualInventory && (
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
      )}
    </>
  );
};
