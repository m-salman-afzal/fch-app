'use client';

import { useRouter } from 'next/navigation';

import { ResetType } from '@/types/authTypes';

import ResetPasswordLayout from '@/components/resetPassword/layout/resetPasswordLayout';

import { useFetch } from '@/hooks/useFetch';
import { TOAST_DURATION } from '@/utils/constants';
import ShowToast from '@/utils/showToast';
import { ADMIN_AUTH_URL, API_BASE_URL } from '@/utils/urls';

interface props {
  token: string;
}
const ResetPasswordContainer: React.FC<props> = ({ token }) => {
  const { postData, isLoading } = useFetch();
  const router = useRouter();
  const onFormSubmit = async (data: ResetType) => {
    const url = `${API_BASE_URL}${ADMIN_AUTH_URL}/resetPassword/${token}`;
    const resetPassword: any = await postData(url, data);
    if (resetPassword?.status === 'error') {
      ShowToast(resetPassword.message, 'error', TOAST_DURATION);

      return;
    }
    if (resetPassword?.status === 'success') {
      ShowToast('Please log in to continue', 'success', TOAST_DURATION);

      router.push('/login');

      return;
    }
  };

  return (
    <ResetPasswordLayout onFormSubmit={onFormSubmit} isLoading={isLoading} />
  );
};

export default ResetPasswordContainer;
