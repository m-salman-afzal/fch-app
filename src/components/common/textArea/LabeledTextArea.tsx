import { FC, useState } from 'react';
import { Form, Typography } from 'antd';
import Input, { TextAreaProps } from 'antd/es/input';
import { useBasicInputStyle } from 'vs-design-components/src/Components/BasicInput/useBasicInputStyle';

type Props = TextAreaProps & {
  width?: string;
};
export const LabeledTextArea: FC<Props> = props => {
  const [showLabel, setShowLabel] = useState<boolean>(true);

  const [labelActive, setLabelActive] = useState<boolean>(false);
  const { errors } = Form.Item.useStatus();
  const { label, input, container, labelAct, labelError } = useBasicInputStyle(
    props.width,
    false
  );

  return (
    <div className={container} style={{ width: props.width }}>
      {(showLabel || props.disabled) && (
        <Typography.Paragraph
          disabled={props.disabled}
          className={
            errors.length > 0 ? labelError : labelActive ? labelAct : label
          }
        >
          {props.placeholder}
        </Typography.Paragraph>
      )}
      <Input.TextArea
        {...props}
        className={input}
        style={{ width: '100%' }}
        placeholder={showLabel ? '' : props.placeholder}
        onFocus={e => {
          setShowLabel(true);
          setLabelActive(true);
          props.onFocus && props.onFocus(e);
        }}
        onBlur={e => {
          e.target.value.length <= 0 && setShowLabel(false);
          setLabelActive(false);
          props.onBlur && props.onBlur(e);
        }}
      />
    </div>
  );
};
