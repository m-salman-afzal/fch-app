import { FC, useEffect, useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Input, Row } from 'antd';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { useCounterStyle } from './useCounterStyle';

interface props {
  max: number;
  min: number;
  initialValue?: string;
  pendingOrders: number;
  onChange: (value: number) => void;
  classname?: string;
  plusButtonType?: string;
}
export const Counter: FC<props> = ({
  max,
  min,
  pendingOrders,
  onChange,
  initialValue,
  classname,
  plusButtonType
}) => {
  const [currentValue, setValue] = useState<any>(initialValue || '0');
  const { container, counterButton } = useCounterStyle();
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

    if (updatedValue >= 0 && updatedValue + pendingOrders <= Math.trunc(max)) {
      setValue(updatedValue);
      setNextButton(Math.trunc(max) <= updatedValue + pendingOrders);
      onChange(updatedValue);
    }
  };

  useEffect(() => {
    if (pendingOrders >= Math.trunc(max)) {
      setNextButton(true);
    }
  }, [pendingOrders]);

  return (
    <div className={`${container} ${classname}`}>
      <Row justify="space-around" align={'middle'}>
        <Col className={counterButton} span={6}>
          <VsButton
            size={BUTTON_SIZES.squareIcon}
            onClick={() => handleOnChange('minus')}
          >
            <MinusOutlined />
          </VsButton>
        </Col>
        <Col span={12}>
          <Input
            value={currentValue}
            onChange={e => handleOnChange('direct', e.target.value)}
          />
        </Col>
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
      </Row>
    </div>
  );
};
