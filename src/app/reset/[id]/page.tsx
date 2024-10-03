'use client';

import ResetPasswordContainer from '@/containers/resetPassword/resetPasswordContainer';

export default function Test({ params }: any) {
  return <ResetPasswordContainer token={params.id} />;
}
