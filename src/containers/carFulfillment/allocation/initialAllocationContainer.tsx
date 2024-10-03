'use client';

import { FC } from 'react';
import { Form, Grid } from 'antd';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import BulkUploadForm from '@/components/common/bulkUploadForm/bulkUploadForm';

import { useFetch } from '@/hooks/useFetch';
import {
  INITIAL_ALLOCATION_BULK_UPLOAD_SAMPLE_FILE,
  TOAST_DURATION,
  TOAST_MESSAGES
} from '@/utils/constants';
import { bulkUpsertAdminUrl, bulkUpsertCartUrl } from '@/utils/endpoints';
import { toBase64File } from '@/utils/sharedUtils';
import ShowToast from '@/utils/showToast';

const { useBreakpoint } = Grid;

interface Props {
  selectedTab: string;
}

export const InitialAllocationContainer: FC<Props> = ({ selectedTab }) => {
  const size = useBreakpoint();
  const { isLoading, setIsLoading, fetchData, updateData, postData } =
    useFetch();
  const [bulkUploadFormRef] = Form.useForm();

  const onCancelBulkUploadModal = () => {
    bulkUploadFormRef.resetFields();
  };

  const onSubmitBulkUploadModal = async (data: any) => {
    setIsLoading(true);
    const {
      file: { file }
    } = data;
    const csvFile: any = await toBase64File(file);
    const fileNameArray = file.name.split('.');
    fileNameArray.pop();

    let csv = csvFile.split('base64,')[1];
    data.fileContent = csv;
    data.fileName = fileNameArray.join('.');
    data.process = 'BULK_ADD_INITIAL_ALLOCATION';
    data.fileExtension = 'csv';
    data.repository = 'CART_REQUEST_LOG';

    const url = bulkUpsertCartUrl();
    const uploadCsv = await postData(url, data);
    if (uploadCsv.status === 'error') {
      ShowToast(TOAST_MESSAGES.ERROR.FILE_UPLOAD, 'error', TOAST_DURATION);
    }
    onCancelBulkUploadModal();
    setIsLoading(false);
  };

  return (
    <div
      style={{
        width: size.xs ? '100%' : pxToRem(375),
        background: '#FFFFFF',
        paddingInline: pxToRem(15)
      }}
    >
      <BulkUploadForm
        sampleData={INITIAL_ALLOCATION_BULK_UPLOAD_SAMPLE_FILE}
        onCloseModal={onCancelBulkUploadModal}
        onFinishForm={onSubmitBulkUploadModal}
        form={bulkUploadFormRef}
        isLoading={isLoading}
        fileName={'Sample Initial Allocation File'}
      />
    </div>
  );
};
