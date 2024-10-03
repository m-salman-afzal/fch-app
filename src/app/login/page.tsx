'use client';

import dynamic from 'next/dynamic';

const LoginContainer = dynamic(
  () => import('../../containers/login/loginContainer'),
  {
    ssr: false
  }
);
export default function Login() {
  return <LoginContainer />;
}
