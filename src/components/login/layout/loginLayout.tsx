import React from 'react';
import { LockOutlined } from '@ant-design/icons';
import { Form, FormInstance, Grid, theme, Typography } from 'antd';
import Image from 'next/image';

import { LoginType } from '@/types/authTypes';

import FCHLOGO from '@/assets/FirstClass Healthcare Logo.svg';
import { pxToRem } from '@/utils/sharedUtils';

import ForgotForm from '../forms/forgot';
import LoginForm from '../forms/login';
import { useLoginLayoutStyle } from './useLoginLayoutStyle';

interface props {
  onSubmitForm: any;
  isLoading: boolean;
  isForgotPassword: boolean;
  onClickForgotPassword: () => void;
  onSubmitForgotForm: (values: { email: string }) => void;
  loginForm: FormInstance<LoginType>;
}

const { useBreakpoint } = Grid;
const { useToken } = theme;
const LoginLayout: React.FC<props> = ({
  onSubmitForm,
  isLoading,
  isForgotPassword,
  onClickForgotPassword,
  onSubmitForgotForm,
  loginForm
}) => {
  const { token } = useToken();
  const { mainContainer, loginBox, dtucImage, dtucImageContainer } =
    useLoginLayoutStyle();
  const [forgetFormInstance] = Form.useForm();

  const size = useBreakpoint();

  return (
    <>
      <div className={mainContainer}>
        <div className={loginBox}>
          {!isForgotPassword && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBlockEnd: '2.285rem'
                }}
              >
                <div className={dtucImageContainer}>
                  <Image
                    className={dtucImage}
                    alt={'Firstclass Healthcare'}
                    src={FCHLOGO}
                    fill={true}
                  />
                </div>
              </div>

              <Typography.Title
                style={{ fontSize: '2.142rem', marginBottom: '1.5rem' }}
              >
                Login
              </Typography.Title>
            </>
          )}

          {isForgotPassword && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                marginBlockEnd: pxToRem(24)
              }}
            >
              <div
                style={{
                  borderRadius: '100%',
                  border: `${pxToRem(1)} solid ${token.colorBorder}`,
                  width: 'fit-content',
                  padding: pxToRem(20)
                }}
              >
                <LockOutlined style={{ fontSize: pxToRem(28) }} />
              </div>
              <Typography.Title
                style={{
                  fontSize: pxToRem(30),
                  lineHeight: pxToRem(38),
                  marginBlock: `${pxToRem(32)} ${pxToRem(10)}`,
                  fontWeight: 600
                }}
              >
                Forgot Password?
              </Typography.Title>
              <Typography.Text
                style={{
                  textAlign: 'center',
                  color: token.colorTextLabel,
                  lineHeight: pxToRem(22),
                  fontWeight: 400
                }}
              >
                Enter the email address associated with your account and we will
                send you a link to reset your password
              </Typography.Text>
            </div>
          )}

          {!isForgotPassword ? (
            <LoginForm
              form={loginForm}
              onSubmitForm={onSubmitForm}
              isLoading={isLoading}
              onClickForgetPassword={onClickForgotPassword}
            />
          ) : (
            <ForgotForm
              form={forgetFormInstance}
              onSubmitForm={onSubmitForgotForm}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default LoginLayout;
