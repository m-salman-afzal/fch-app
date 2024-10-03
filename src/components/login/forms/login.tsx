import { Button, Col, Form, FormInstance, Grid, Row } from 'antd';
import Image from 'next/image';
import { BasicInputFormItem, VsButton } from 'vs-design-components';
import {
  ErrorMessage,
  PasswordInputFormItem
} from 'vs-design-components/src/Components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { LoginType } from '@/types/authTypes';

import GOOGLE_ICON from '@/assets/icons/common/google.svg';
import { EMAIL_PATTERN } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';
import { API_BASE_URL } from '@/utils/urls';

interface props {
  formName?: any;
  form: FormInstance<LoginType>;
  onSubmitForm: (values: LoginType) => void;
  isLoading: boolean;
  onClickForgetPassword: () => void;
}

const { useBreakpoint } = Grid;
const LoginForm: React.FC<props> = ({
  formName = 'login',
  form,
  onSubmitForm,
  isLoading,
  onClickForgetPassword
}) => {
  const isSmallscreen = window.screen.width < 576;

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
                name: 'email',
                rules: [
                  {
                    required: true,
                    pattern: EMAIL_PATTERN,
                    message: <ErrorMessage>Enter Email</ErrorMessage>
                  }
                ],
                validateTrigger: ['onSubmit']
              }}
            />
            <PasswordInputFormItem
              dataTestId="password"
              placeholder="Password"
              width={'100%'}
              type="password"
              formItemProps={{
                name: 'password',
                rules: [
                  {
                    required: true,
                    message: <ErrorMessage>Enter Password</ErrorMessage>
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
            size={BUTTON_SIZES.large}
            style={{ width: '100%' }}
          >
            Login
          </VsButton>
        </Row>
        <Row style={{ marginBlockStart: pxToRem(8) }} justify={'end'}>
          <Col>
            <Button
              style={{
                lineHeight: pxToRem(22),
                color: '#000000A6',
                padding: 0
              }}
              type="link"
              onClick={onClickForgetPassword}
            >
              Forgot Password?
            </Button>
          </Col>
        </Row>

        <Row style={{ marginBlockStart: pxToRem(14) }} justify={'start'}>
          {!isSmallscreen ? (
            <Col span={24} style={{ color: '#00000026' }}>
              ____________________________
              <text
                style={{
                  position: 'relative',
                  top: pxToRem(6),
                  marginInline: pxToRem(8),
                  color: '#000000A6'
                }}
              >
                Or
              </text>
              ____________________________
            </Col>
          ) : (
            <Col span={24} style={{ color: '#00000026', display: 'flex' }}>
              <div
                style={{
                  width: '100%',
                  borderBottom: `${pxToRem(1)} solid #00000026`
                }}
              ></div>
              <div
                style={{
                  position: 'relative',
                  top: pxToRem(10),
                  marginInline: pxToRem(8),
                  color: '#000000A6'
                }}
              >
                Or
              </div>
              <div
                style={{
                  width: '100%',
                  borderBottom: `${pxToRem(1)} solid #00000026`
                }}
              ></div>
            </Col>
          )}
        </Row>
        <Row
          style={{
            marginBlockStart: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center  '
          }}
        >
          <VsButton
            antButtonProps={{
              href: `${API_BASE_URL}saml/login`
            }}
            size={BUTTON_SIZES.large}
            style={{
              marginBlockStart: '1rem', //Temporary arrangement we need to avoid using inline styles as much as possible
              display: 'flex', //Temporary arrangement we need to avoid using inline styles as much as possible
              alignItems: 'center', //Temporary arrangement we need to avoid using inline styles as much as possible
              justifyContent: 'center', //Temporary arrangement we need to avoid using inline styles as much as possible,
              color: '#000000A6',
              width: '100%'
            }}
            onClick={() => {
              window.scrollTo(0, 0);
            }}
          >
            <Image
              src={GOOGLE_ICON}
              alt={'Google'}
              width={22}
              height={22}
              style={{ marginInlineEnd: pxToRem(5) }}
            />{' '}
            Sign in with Google
          </VsButton>
        </Row>
      </Form>
    </>
  );
};

export default LoginForm;
