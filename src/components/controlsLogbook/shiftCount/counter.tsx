import { validateHeaderValue } from 'http';
import { FC, useEffect, useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Input, Row } from 'antd';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { useCounterStyle } from './style/useCounterStyle';

interface props {
  key?: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  classname?: string;
  plusButtonType?: string;
  isError?: boolean;
  isDiscrepancy?: boolean;
  value?: number;
}
export const Counter: FC<props> = ({
  max,
  onChange,
  classname,
  plusButtonType,
  isError,
  isDiscrepancy,
  key,
  value
}) => {
  const [currentValue, setValue] = useState<any>(undefined);
  const { container, counterButton, inputError, hideNumber } =
    useCounterStyle();
  const [isDisabledNext, setNextButton] = useState(false);
  const handleOnChange = (
    action: 'plus' | 'minus' | 'direct',
    value?: string
  ) => {
    let updatedValue: any;
    if (action === 'direct') {
      updatedValue = value ? parseInt(value) : 0;
    } else {
      updatedValue =
        action === 'minus'
          ? parseInt(currentValue) - 1
          : parseInt(currentValue) + 1;
    }

    if (updatedValue >= 0 && updatedValue <= Math.trunc(max)) {
      setValue(updatedValue);
      setNextButton(Math.trunc(max) <= updatedValue);
      onChange(updatedValue);
    }
  };

  useEffect(() => {
    if (isError) {
      setValue(undefined);

      return;
    }

    if (value) {
      setValue(value);
      onChange(value);
    }
  }, [isError, value, isDiscrepancy]);

  const hideWhenNoValueAndScl = isNaN(currentValue);

  return (
    <div
      className={`${container} ${classname} ${isError ? inputError : undefined}`}
    >
      <Row justify="space-around" align={'middle'}>
        {!hideWhenNoValueAndScl && (
          <Col className={counterButton} span={6}>
            <VsButton
              size={BUTTON_SIZES.squareIcon}
              onClick={() => handleOnChange('minus')}
            >
              <MinusOutlined />
            </VsButton>
          </Col>
        )}
        <Col className={hideNumber} span={hideWhenNoValueAndScl ? 24 : 12}>
          <Input
            value={currentValue ?? undefined}
            placeholder={'Enter Qty'}
            onChange={e => handleOnChange('direct', e.target.value)}
            width={'100%'}
            type="number"
          />
        </Col>
        {!hideWhenNoValueAndScl && (
          <Col className={counterButton} span={6}>
            <VsButton
              antButtonProps={{
                disabled: isDisabledNext,
                type: plusButtonType || ('default' as any)
              }}
              size={BUTTON_SIZES.squareIcon}
              onClick={() => handleOnChange('plus')}
            >
              <PlusOutlined />
            </VsButton>
          </Col>
        )}
      </Row>
    </div>
  );
};
