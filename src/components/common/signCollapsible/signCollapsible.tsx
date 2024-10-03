import { useEffect, useRef, useState } from 'react';
import { UpOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { validateImage } from 'image-validator';
import {
  BasicInputFormItem,
  ErrorMessage,
  UploadSignatureLayout
} from 'vs-design-components';

import { pxToRem } from '@/utils/sharedUtils';

import { useSignatureCollapseStyle } from './useSignatureCollapsibleStyle';

interface props {
  header: string;
  inputPlaceHolder: string;
  inputItemFormName: string;
  itemFormItemErrorMessage: string;
  signatureFormName: string | string[];
  signatureFormErrorMessage: string;
  signHeight?: string;
}

const SignatureCollapsible: React.FC<props> = ({
  header,
  inputPlaceHolder,
  inputItemFormName,
  itemFormItemErrorMessage,
  signatureFormName,
  signatureFormErrorMessage,
  signHeight = pxToRem(258)
}) => {
  const sigRef = useRef<any>();
  const [modalSignatureFix, setModalSignatureFix] = useState<boolean>(false);
  const { collapseContainer } = useSignatureCollapseStyle();
  const form = useFormInstance();
  useEffect(() => {
    setModalSignatureFix(true);
  });

  return (
    <div className={collapseContainer}>
      <Collapse
        defaultActiveKey={'1'}
        expandIconPosition="end"
        expandIcon={panelProps => {
          return (
            <UpOutlined
              style={{
                transform: !panelProps.isActive ? 'rotate(180deg)' : undefined,
                transition: 'all 100ms linear'
              }}
            />
          );
        }}
      >
        <Collapse.Panel header={header} key={'1'}>
          {modalSignatureFix && (
            <UploadSignatureLayout
              sigRef={sigRef}
              width={'100%'}
              height={signHeight}
              uploadProps={{
                accept: '.jpg, .png, .jpeg, .webp, .heic',
                maxCount: 1,
                listType: 'picture',
                beforeUpload: () => false,
                id: 'signatureUpload'
              }}
              signatureFormItemProps={{
                name: signatureFormName,
                style: {
                  height: signHeight
                },
                rules: [
                  {
                    required: true,
                    message: (
                      <ErrorMessage>{signatureFormErrorMessage}</ErrorMessage>
                    )
                  }
                ]
              }}
              uploadFormItemProps={{
                name: signatureFormName,
                style: {
                  height: signHeight
                },
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
                          form.setFieldValue(signatureFormName, undefined);

                          return Promise.reject(
                            <ErrorMessage>
                              The file uploaded is corrupt, please upload a
                              valid file format
                            </ErrorMessage>
                          );
                        }
                      }

                      return Promise.resolve();
                    }
                  }
                ]
              }}
            />
          )}
          <div style={{ marginBlockStart: pxToRem(16) }}>
            <BasicInputFormItem
              placeholder={inputPlaceHolder}
              width="100%"
              formItemProps={{
                name: inputItemFormName,
                style: {
                  marginBottom: pxToRem(0)
                },
                rules: [
                  {
                    required: true,
                    message: (
                      <ErrorMessage>{itemFormItemErrorMessage}</ErrorMessage>
                    )
                  }
                ]
              }}
            />
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default SignatureCollapsible;
