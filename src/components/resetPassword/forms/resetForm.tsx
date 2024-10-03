import { Col, Form, FormInstance, Row } from 'antd';
import { VsButton } from 'vs-design-components';
import {
  ErrorMessage,
  PasswordInputFormItem
} from 'vs-design-components/src/Components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { ResetType } from '@/types/authTypes';

interface props {
  formName?: any;
  form: FormInstance<ResetType>;
  onSubmitForm: (values: ResetType) => void;
  isLoading: boolean;
}

const passwordValidator =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,50}$/;
const ResetForm: React.FC<props> = ({
  formName = 'reset',
  form,
  onSubmitForm,
  isLoading
}) => {
  return (
    <>
      <Form form={form} name={formName} onFinish={onSubmitForm}>
        <Row>
          <Col span={24}>
            <PasswordInputFormItem
              dataTestId="password"
              placeholder="Password"
              width={'100%'}
              type="password"
              formItemProps={{
                name: ['password'],
                rules: [
                  {
                    required: true,
                    validator: (_, value) => {
                      if (!(value?.length >= 0)) {
                        return Promise.reject(
                          <ErrorMessage>Enter password</ErrorMessage>
                        );
                      }
                      if (!passwordValidator.test(value)) {
                        return Promise.reject(
                          <ErrorMessage>
                            Password must be at least 8 characters long, contain
                            1 upper and lower case letter, 1 special character,
                            and 1 number
                          </ErrorMessage>
                        );
                      }

                      return Promise.resolve();
                    }
                  }
                ],
                validateTrigger: ['onSubmit']
              }}
            />
            <PasswordInputFormItem
              dataTestId="retypePassword"
              placeholder="ReType Password"
              width={'100%'}
              type="password"
              formItemProps={{
                name: ['confirmPassword'],
                rules: [
                  {
                    required: true,
                    validator: (_, value) => {
                      if (!(value?.length >= 0)) {
                        return Promise.reject(
                          <ErrorMessage>ReType password</ErrorMessage>
                        );
                      }
                      if (value !== form.getFieldValue(['password'])) {
                        return Promise.reject(
                          <ErrorMessage>Passwords do not match</ErrorMessage>
                        );
                      }

                      return Promise.resolve();
                    }
                  }
                ],
                validateTrigger: ['onSubmit']
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
            style={{ width: '100%' }}
            size={BUTTON_SIZES.large}
          >
            Reset Password
          </VsButton>
        </Row>
      </Form>
    </>
  );
};

export default ResetForm;
