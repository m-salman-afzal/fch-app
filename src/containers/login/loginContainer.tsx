import { useEffect, useState } from 'react';
import { Col, Form, Row, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { ErrorMessage } from 'vs-design-components/src/Components';

import { LoginType } from '@/types/authTypes';

import LoginLayout from '@/components/login/layout/loginLayout';

import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import { useAppDispatch } from '@/redux/hooks';
import { AdminLogin } from '@/redux/slices/adminSlice';
import AuthService from '@/services/authService';
import { TOAST_DURATION, TOAST_GENERIC_ERROR_MESSAGE } from '@/utils/constants';
import ShowToast from '@/utils/showToast';
import { ADMIN_AUTH_URL, API_BASE_URL } from '@/utils/urls';

const LoginContainer: React.FC = () => {
  const router = useRouter();
  const { postData, isLoading, setIsLoading, fetchData } = useFetch();
  const [isForgotPassword, setForgotPassword] = useState<boolean>(false);
  const [isLoadinAdminDetails, setIsLoadinAdminDetails] = useState(false);

  const [loginForm] = Form.useForm();
  const dispatch = useAppDispatch();

  const { getBackendCookie } = useCookies();

  const isSeassion = getBackendCookie();

  const onClickForgotPassword = () => {
    setForgotPassword(true);
  };

  const getAdmin = async () => {
    setIsLoadinAdminDetails(true);
    const url = `${API_BASE_URL}${ADMIN_AUTH_URL}/admin`;

    const admin = await fetchData(url, {});

    if (admin.status !== 'error') {
      dispatch(AdminLogin(admin));
      router.push('/notificationsAndTasks');
    }

    setIsLoadinAdminDetails(false);
  };

  const onSubmitForm = async (values: LoginType) => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    const loginData = await AuthService.login(values);

    if (loginData.status === 'success') {
      await getAdmin();
    }
    if (loginData.status === 'error') {
      if (loginData?.passwordExpired) {
        const errorArray: any = [
          <ErrorMessage key={0}>
            Password has expired, please reset your password
          </ErrorMessage>
        ];

        loginForm.setFields([
          {
            name: 'password',
            errors: errorArray
          }
        ]);

        setIsLoading(false);

        return;
      }
      if (loginData?.message === 'Invalid Credentials') {
        const errorArray: any = [
          <ErrorMessage key={0}>This user does not exist</ErrorMessage>
        ];

        loginForm.setFields([
          {
            name: 'email',
            errors: errorArray
          }
        ]);

        setIsLoading(false);

        return;
      }
      if (loginData?.message.includes('Password')) {
        const errorArray: any = [
          <ErrorMessage key={0}>{loginData?.message}</ErrorMessage>
        ];

        loginForm.setFields([
          {
            name: 'password',
            errors: errorArray
          }
        ]);

        setIsLoading(false);

        return;
      }

      if (loginData.message === 'Version mismatched') {
        ShowToast(
          'We have released a new version of the app, please reload and try again',
          'error',
          TOAST_DURATION
        );
        setIsLoading(false);

        return;
      } else {
        ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);
        setIsLoading(false);
      }

      setIsLoading(false);
    }
  };

  const onSubmitForgotForm = async (values: { email: string }) => {
    const url = `${API_BASE_URL}${ADMIN_AUTH_URL}/forgotPassword`;
    const appVersion = process.env.NEXT_PUBLIC_APP_VERSION;
    const forgotPassword = await postData(url, {
      ...values,
      appVersion: appVersion
    });
    if (forgotPassword.status === 'success') {
      ShowToast(
        'A password reset link has been sent to your email',
        'success',
        TOAST_DURATION
      );
      setForgotPassword(false);

      return;
    }
  };

  useEffect(() => {
    if (isSeassion) {
      getAdmin();
    }
  }, []);
  const isSmallscreen = window.screen.width < 576;

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: isSmallscreen ? 'white' : undefined
      }}
    >
      {isLoadinAdminDetails ? (
        <Row justify="center" align={'middle'} style={{ height: '100vh' }}>
          <Col>
            {' '}
            <Spin size="large" />
          </Col>
        </Row>
      ) : (
        <LoginLayout
          isForgotPassword={isForgotPassword}
          onClickForgotPassword={onClickForgotPassword}
          onSubmitForm={onSubmitForm}
          isLoading={isLoading}
          onSubmitForgotForm={onSubmitForgotForm}
          loginForm={loginForm}
        />
      )}
    </div>
  );
};

export default LoginContainer;
