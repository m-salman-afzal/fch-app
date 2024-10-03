import { Col, Form, FormInstance, Row } from 'antd';
import { BasicInputFormItem, VsButton } from 'vs-design-components';
import { ErrorMessage } from 'vs-design-components/src/Components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { EMAIL_PATTERN } from '@/utils/constants';

interface props {
  formName?: any;
  form: FormInstance<{ email: string }>;
  onSubmitForm: (values: { email: string }) => void;
  isLoading: boolean;
}

const ForgotForm: React.FC<props> = ({
  formName = 'forgot',
  form,
  onSubmitForm,
  isLoading
}) => {
  return (
    <>
      <Form form={form} name={formName} onFinish={onSubmitForm}>
        <Row>
          <Col span={24}>
            <BasicInputFormItem
              dataTestId="email"
              placeholder="Email"
              width={'100%'}
              formItemProps={{
                name: ['email'],
                rules: [
                  {
                    required: true,
                    pattern: EMAIL_PATTERN,
                    message: <ErrorMessage>Enter Email</ErrorMessage>
                  }
                ]
              }}
            />
          </Col>
        </Row>
        <Row>
          <VsButton
            antButtonProps={{
              type: 'primary',
              htmlType: 'submit',
              loading: isLoading
            }}
            size={BUTTON_SIZES.large}
            style={{ width: '100%' }}
          >
            Reset Password
          </VsButton>
        </Row>
      </Form>
    </>
  );
};

export default ForgotForm;
