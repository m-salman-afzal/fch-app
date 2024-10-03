import { LockOutlined } from '@ant-design/icons';
import { Col, Form, Radio, Row } from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsSelectFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { SelectOption } from '@/types/commonTypes';

import SignatureCollapsible from '@/components/common/signCollapsible/signCollapsible';

interface ControlledFormProps {
  isLoading: boolean;
  controlledList: SelectOption[];
  controlledLoading: boolean;
  onCloseModal: () => void;
  isAntiretroviral: boolean;
  onSelect: (e: any) => void;
}
const MobileControlledForm: React.FC<ControlledFormProps> = ({
  isLoading,
  controlledList,
  controlledLoading,
  onCloseModal,
  isAntiretroviral,
  onSelect
}) => {
  return (
    <>
      <Row
        style={{
          overflowY: 'scroll',
          height: '70dvh',
          paddingInline: pxToRem(20),
          paddingBlock: pxToRem(20),
          borderBlock: `${pxToRem(1)} solid  #00000026`
        }}
      >
        <Col span={24}>
          <BasicInputFormItem
            placeholder="Drug"
            disabled
            suffix={<LockOutlined />}
            formItemProps={{
              name: 'drug'
            }}
            width="100%"
          />
        </Col>

        <Col span={24} style={{ display: 'flex', rowGap: pxToRem(14) }}>
          <div style={{ marginInlineEnd: pxToRem(14) }}>
            <BasicInputFormItem
              placeholder="Pkg Quantity"
              disabled
              suffix={<LockOutlined />}
              formItemProps={{
                name: 'packageQuantity'
              }}
              width="100%"
            />
          </div>
          <div>
            <BasicInputFormItem
              placeholder="Total Units"
              disabled
              suffix={<LockOutlined />}
              formItemProps={{
                name: 'totalUnits'
              }}
              width="100%"
            />
          </div>
        </Col>
        <Col span={24}>
          <BasicInputFormItem
            placeholder="Cart"
            disabled
            suffix={<LockOutlined />}
            formItemProps={{
              name: 'cart'
            }}
            width="100%"
          />
        </Col>
        <Col span={24}>
          <VsSelectFormItem
            placeholder="Controlled ID"
            onSelect={e => {
              if (!isAntiretroviral) {
                onSelect(e);
              }
            }}
            formItemProps={{
              name: 'controlledId',
              rules: [
                {
                  required: true,
                  message: <ErrorMessage>Select Controlled ID</ErrorMessage>
                }
              ]
            }}
            width="100%"
            loading={controlledLoading}
            options={controlledList}
          />
        </Col>
        {!isAntiretroviral && (
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
                    message: <ErrorMessage>Enter TR Name</ErrorMessage>
                  }
                ]
              }}
              width="100%"
            />
          </Col>
        )}
        <Col span={24} style={{ marginBlockEnd: pxToRem(16) }}>
          <SignatureCollapsible
            header={'Witness Signature'}
            inputPlaceHolder={'Witness Name'}
            inputItemFormName={'witnessName'}
            itemFormItemErrorMessage={'Enter Witness Name'}
            signatureFormName={'witnessSignatureImage'}
            signatureFormErrorMessage={'Draw Signature'}
          />
        </Col>
        <Col span={24}>
          <SignatureCollapsible
            header={'Your Signature'}
            inputPlaceHolder={'Your Name'}
            inputItemFormName={'receiverName'}
            itemFormItemErrorMessage={'Enter Your Name'}
            signatureFormName={'receiverSignatureImage'}
            signatureFormErrorMessage={'Draw Signature'}
          />
        </Col>
      </Row>

      <Row
        justify={'space-between'}
        style={{
          marginBlockStart: pxToRem(16),
          paddingInline: pxToRem(20),
          width: '100%'
        }}
      >
        <VsButton
          style={{ width: '48%', marginInlineEnd: pxToRem(14) }}
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
          style={{ width: '46%' }}
          size={BUTTON_SIZES.large}
        >
          Submit
        </VsButton>
      </Row>
    </>
  );
};

export default MobileControlledForm;
