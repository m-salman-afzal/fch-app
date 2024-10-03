import { useState } from 'react';
import { defaultAnnouncements } from '@dnd-kit/core';
import { defaultAnimateLayoutChanges } from '@dnd-kit/sortable';
import { Col, Form, Row, Spin } from 'antd';
import Image from 'next/image';
import {
  ErrorMessage,
  VsButton,
  VsSelect,
  VsSelectFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { SelectOption } from '@/types/commonTypes';

import CartIcon from '@/assets/icons/shiftCount/CartIcon.svg';
import { pxToRem } from '@/utils/sharedUtils';

import { useShiftCountStyle } from './style/useShiftCountStyle';

interface props {
  cartOptions: SelectOption[];
  onSelectCart: (value: string) => void;
  isLoading: boolean;
}

const ShiftCountBlankCart: React.FC<props> = ({
  cartOptions = [],
  onSelectCart,
  isLoading
}) => {
  const { blankCartIcon, blankCartText, blankCartMainDiv, blankCartPadding } =
    useShiftCountStyle();

  return (
    <div className={blankCartPadding}>
      <div className={blankCartMainDiv}>
        <Spin spinning={isLoading}>
          <Row justify={'center'}>
            <div className={blankCartIcon}>
              <Image
                style={{ marginRight: pxToRem(5) }}
                src={CartIcon}
                alt={'Cart Icon'}
              />
            </div>
          </Row>
          <Row
            justify={'center'}
            className={blankCartText}
            style={{ marginBlockStart: pxToRem(16) }}
          >
            Please Select Cart
          </Row>
          <Form onFinish={value => onSelectCart(value.cart)}>
            <Row justify={'center'} style={{ marginBlockStart: pxToRem(16) }}>
              <VsSelectFormItem
                width="100%"
                formItemProps={{
                  style: {
                    width: '100%',
                    marginBottom: 0
                  },
                  name: 'cart',
                  rules: [
                    {
                      required: true,
                      message: <ErrorMessage>Select Cart</ErrorMessage>
                    }
                  ]
                }}
                placeholder="Select Cart"
                isThin={true}
                options={cartOptions}
                height={pxToRem(32)}
              />
            </Row>

            <Row style={{ marginBlockStart: pxToRem(16) }}>
              <VsButton
                antButtonProps={{
                  type: 'primary',
                  htmlType: 'submit'
                }}
                size={BUTTON_SIZES.middle}
                style={{
                  width: '100%'
                }}
              >
                Select Cart
              </VsButton>
            </Row>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default ShiftCountBlankCart;
