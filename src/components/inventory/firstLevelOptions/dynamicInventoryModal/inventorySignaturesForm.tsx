import { FC, useRef, useState } from 'react';
import { Col, FormInstance, Grid, Row, Typography } from 'antd';
import { validateImage } from 'image-validator';
import {
  BasicInputFormItem,
  ErrorMessage,
  UploadSignatureLayout
} from 'vs-design-components';

import { Formulary } from '@/types/formularyTypes';

import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;
interface Props {
  formRef: FormInstance;
  formData: Formulary;
}

export const InventorySignaturesForm: FC<Props> = ({ formRef, formData }) => {
  const formName = ['consent'];
  const sigRef = useRef<any>(null);
  const sigRef2 = useRef<any>(null);

  return (
    <Row style={{ paddingBlockEnd: pxToRem(20) }}>
      <Col span={24} style={{ paddingBlockEnd: pxToRem(16) }}>
        <Typography.Text
          style={{
            fontSize: pxToRem(14),
            fontWeight: 400,
            color: 'rgba(0, 0, 0, 0.65)'
          }}
        >
          {formData.name}
        </Typography.Text>
      </Col>

      <Col>
        <Typography.Text>Your Signature</Typography.Text>

        <BasicInputFormItem
          placeholder="Your Name"
          formItemProps={{
            style: { marginTop: pxToRem(16) },
            name: [...formName, 'receiverName'],
            rules: [
              {
                required: true,
                message: <ErrorMessage>Your name is required</ErrorMessage>
              }
            ]
          }}
        />
      </Col>
      <Col style={{ width: '100%' }}>
        <UploadSignatureLayout
          uploadFormItemProps={{
            name: [...formName, 'receiverSignature'],
            rules: [
              {
                required: true,
                validator: async (rule, value) => {
                  if (value?.length === 0 || !value) {
                    return Promise.reject(
                      <ErrorMessage>Upload Signature</ErrorMessage>
                    );
                  }

                  if (value[0]?.originFileObj) {
                    const isValidImage = await validateImage(
                      value[0]?.originFileObj
                    );
                    if (!isValidImage) {
                      formRef.setFieldValue(
                        [...formName, 'receiverSignature'],
                        undefined
                      );

                      return Promise.reject(
                        <ErrorMessage>
                          The file uploaded is corrupt, please upload a valid
                          file format
                        </ErrorMessage>
                      );
                    }
                  }

                  return Promise.resolve();
                }
              }
            ]
          }}
          signatureFormItemProps={{
            name: [...formName, 'receiverSignature'],
            rules: [
              {
                required: true,
                message: (
                  <ErrorMessage>Please sign in order to proceed</ErrorMessage>
                )
              }
            ]
          }}
          uploadProps={{
            accept: '.jpg, .png, .jpeg, .webp, .heic',
            maxCount: 1,
            listType: 'picture',
            beforeUpload: () => false,
            id: 'signatureUpload'
          }}
          sigRef={sigRef}
          signatureProps={{
            sigRef: sigRef,
            dataTestId: 'signatureWrite',
            clearOnResize: false
          }}
          width={'100%'}
          height="10.71rem"
        />
      </Col>

      <Col style={{ marginBlockStart: pxToRem(16) }}>
        <Typography.Text>Witness Signature</Typography.Text>
        <BasicInputFormItem
          placeholder="Witness Name"
          formItemProps={{
            style: { marginTop: pxToRem(16) },
            name: [...formName, 'witnessName'],
            rules: [
              {
                required: true,
                message: <ErrorMessage>Witness name is required</ErrorMessage>
              }
            ]
          }}
        />
      </Col>
      <Col style={{ width: '100%' }}>
        <UploadSignatureLayout
          uploadFormItemProps={{
            name: [...formName, 'witnessSignature'],
            rules: [
              {
                required: true,
                validator: async (rule, value) => {
                  if (value?.length === 0 || !value) {
                    return Promise.reject(
                      <ErrorMessage>Upload Signature</ErrorMessage>
                    );
                  }

                  if (value[0]?.originFileObj) {
                    const isValidImage = await validateImage(
                      value[0]?.originFileObj
                    );
                    if (!isValidImage) {
                      formRef.setFieldValue(
                        [...formName, 'witnessSignature'],
                        undefined
                      );

                      return Promise.reject(
                        <ErrorMessage>
                          The file uploaded is corrupt, please upload a valid
                          file format{' '}
                        </ErrorMessage>
                      );
                    }
                  }

                  return Promise.resolve();
                }
              }
            ]
          }}
          signatureFormItemProps={{
            name: [...formName, 'witnessSignature'],
            rules: [
              {
                required: true,
                message: (
                  <ErrorMessage>Please sign in order to proceed</ErrorMessage>
                )
              }
            ]
          }}
          uploadProps={{
            accept: '.jpg, .png, .jpeg, .webp, .heic',
            maxCount: 1,
            listType: 'picture',
            beforeUpload: () => false,
            id: 'signatureUpload'
          }}
          sigRef={sigRef2}
          signatureProps={{
            sigRef: sigRef2,
            dataTestId: 'signatureWrite',
            clearOnResize: false
          }}
          width={'100%'}
          height="10.71rem"
        />
      </Col>
    </Row>
  );
};
