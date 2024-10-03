import { Form, Grid, theme, Typography } from 'antd';
import Head from 'next/head';
import Image from 'next/image';

import { ResetType } from '@/types/authTypes';

import FORGOTICON from '@/assets/icons/forgotPassword/forgotPassword.svg';
import { pxToRem } from '@/utils/sharedUtils';

import { useLoginLayoutStyle } from '../../login/layout/useLoginLayoutStyle';
import ResetForm from '../forms/resetForm';

const { useBreakpoint } = Grid;
const { useToken } = theme;

interface props {
  onFormSubmit: (values: ResetType) => void;
  isLoading: boolean;
}
const ResetPasswordLayout: React.FC<props> = ({ onFormSubmit, isLoading }) => {
  const { token } = useToken();
  const { mainContainer, loginBox } = useLoginLayoutStyle();
  const [resetFormInstance] = Form.useForm();

  const size = useBreakpoint();

  return (
    <>
      <Head>
        <style>{size.md && 'body { background-color: #efefef; }'}</style>
      </Head>
      <div className={mainContainer}>
        <div className={loginBox}>
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
              <Image
                width={28}
                height={28}
                src={FORGOTICON}
                alt="forgot"
                style={{ fontSize: pxToRem(28) }}
              />
            </div>
            <Typography.Title
              style={{
                fontSize: pxToRem(30),
                lineHeight: pxToRem(38),
                marginBlock: `${pxToRem(32)} ${pxToRem(10)}`,
                fontWeight: 600
              }}
            >
              Reset Password
            </Typography.Title>
            <Typography.Text
              style={{
                textAlign: 'center',
                color: token.colorTextLabel,
                lineHeight: pxToRem(22),
                fontWeight: 400
              }}
            >
              Enter your new password
            </Typography.Text>
          </div>

          <ResetForm
            form={resetFormInstance}
            onSubmitForm={onFormSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default ResetPasswordLayout;
