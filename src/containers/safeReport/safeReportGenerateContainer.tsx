import { Form } from 'antd';

import { TReportData } from '@/types/safeReportTypes';

import { SafeReportGenerateLayout } from '@/components/safeReport/layout/safeReportGenerateLayout';

import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';

// import { addSafeReportUrl } from '@/utils/endpoints';

export const SafeReportGenerateContainer = () => {
  const [form] = Form.useForm<TReportData>();
  const { postData, isLoading } = useFetch();
  const { getDataFromCookie } = useCookies();
  const admin = getDataFromCookie();

  const onFinishForm = async (values: TReportData) => {
    try {
      // await postData(addSafeReportUrl(), {
      //   ...values,
      //   anonymous: values.isAnonymous ? 'true' : 'false',
      //   // report: values.report.replaceAll('\n', '<br/>'),
      //   adminId: admin.adminId
      // });

      form.resetFields();
    } catch (error) {}
  };

  return (
    <SafeReportGenerateLayout
      onFinishForm={onFinishForm}
      form={form}
      isLoading={isLoading}
    />
  );
};
