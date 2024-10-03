import { PropsWithChildren } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Form, Grid, Modal, Row, theme, Typography } from 'antd';
import { FormInstance } from 'antd/es/form';
import Dragger from 'antd/es/upload/Dragger';
import Image from 'next/image';
import { CSVLink } from 'react-csv';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import csvIcon from '@/assets/icons/bulkUpload/csvIcon.svg';
import downloadIcon from '@/assets/icons/bulkUpload/downloadIcon.svg';
import uploadFile from '@/assets/icons/bulkUpload/uploadFile.svg';
import { SERVICE_DISRUPTION_BULK_ADD_SAMPLE_FILE } from '@/utils/constants';

import { useBulkUploadModalStyle } from '../styles/useServiceDisruptionModalStyle';

interface props {
  onCloseModal: () => void;
  bulkUploadForm: FormInstance<any>;
  onFinishForm: (fileDate: any) => void;
  open: boolean;
  isLoading: boolean;
}

const { useBreakpoint } = Grid;

const { useToken } = theme;

export const BulkUploadServiceDisruptionModal: React.FC<
  PropsWithChildren<props>
> = ({ onCloseModal, open, bulkUploadForm, onFinishForm, isLoading }) => {
  const size = useBreakpoint();

  const { token } = useToken();

  const { headerClassName, uploadClassName, sampleFile, downloadText } =
    useBulkUploadModalStyle();

  return (
    <Modal
      className={headerClassName}
      open={open}
      onCancel={onCloseModal}
      destroyOnClose={true}
      footer={null}
      style={{
        maxWidth: 'none',
        margin: 0
      }}
      title={
        <Typography.Title style={{ marginBlock: 0, fontSize: pxToRem(16) }}>
          Upload
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(402)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      zIndex={2147483647}
    >
      <Form form={bulkUploadForm} onFinish={onFinishForm}>
        <span
          style={{
            fontSize: pxToRem(12),
            color: token.colorTextDescription,
            marginBlock: `${pxToRem(10)} 0`
          }}
        >
          Upload a CSV to Import Data
        </span>

        <Form.Item
          name="file"
          rules={[{ required: true, message: 'Please select a file' }]}
          style={{ marginBottom: 0 }}
        >
          <Dragger
            className={uploadClassName}
            showUploadList={{
              removeIcon: <CloseOutlined />,
              showPreviewIcon: false
            }}
            listType="picture"
            accept=".csv"
            multiple={false}
            maxCount={1}
            beforeUpload={() => false}
          >
            <div style={{ margin: 0 }}>
              <>
                <Image
                  src={uploadFile}
                  width={80}
                  height={80}
                  alt="upload Icon"
                />
                <p
                  style={{
                    fontWeight: token.fontWeightStrong,
                    margin: `${pxToRem(12)} 0 0 0`,
                    paddingBlockEnd: pxToRem(2)
                  }}
                >
                  Drag CSV here
                </p>
                <p
                  style={{
                    fontSize: token.fontSizeSM,
                    color: token.colorTextDescription,
                    margin: 0,
                    height: pxToRem(20)
                  }}
                >
                  or click to browse (10 MB max)
                </p>
              </>
            </div>
          </Dragger>
        </Form.Item>
        <Row className={sampleFile} align={'middle'}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              alt="csvIcon"
              src={csvIcon}
              style={{ paddingInlineStart: pxToRem(10) }}
            />
            <CSVLink
              data={SERVICE_DISRUPTION_BULK_ADD_SAMPLE_FILE}
              filename="Service Disruption Sample.csv"
              separator=","
              enclosingCharacter='"'
              className={downloadText}
            >
              Download Sample CSV
            </CSVLink>
          </div>
          <CSVLink
            data={SERVICE_DISRUPTION_BULK_ADD_SAMPLE_FILE}
            filename="Service Disruption Sample.csv"
            separator=","
            enclosingCharacter='"'
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Image alt="csvIcon" src={downloadIcon} />
          </CSVLink>
        </Row>
        <Row
          justify="space-between"
          style={{
            gap: pxToRem(15),
            height: pxToRem(32),
            marginTop: pxToRem(18),
            width: '100%'
          }}
        >
          <VsButton
            antButtonProps={{
              loading: isLoading
            }}
            onClick={onCloseModal}
            size={BUTTON_SIZES.large}
            style={{ width: '47%' }}
          >
            Cancel
          </VsButton>
          <VsButton
            antButtonProps={{
              type: 'primary',
              htmlType: 'submit',
              loading: isLoading
            }}
            size={BUTTON_SIZES.large}
            style={{ width: '47%' }}
          >
            Upload
          </VsButton>
        </Row>
      </Form>
    </Modal>
  );
};
