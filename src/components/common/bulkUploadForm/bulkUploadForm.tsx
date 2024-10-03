import { CloseOutlined } from '@ant-design/icons';
import {
  Col,
  Form,
  FormInstance,
  Grid,
  Modal,
  Row,
  theme,
  Typography,
  Upload
} from 'antd';
import Image from 'next/image';
import { CSVLink } from 'react-csv';
import { ErrorMessage, VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import csvIcon from '@/assets/icons/bulkUpload/csvIcon.svg';
import downloadIcon from '@/assets/icons/bulkUpload/downloadIcon.svg';
import uploadFile from '@/assets/icons/bulkUpload/uploadFile.svg';
import useCookies from '@/hooks/useCookies';
import { PERMISSION_TYPES_BACKEND } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useBulkUploadModalStyle } from './usebulkUploadFormStyle';

interface props {
  onCloseModal: () => void;
  onFinishForm: (values: any) => void;
  form: FormInstance;
  isLoading: boolean;
  sampleData?: any;
  fileName: string;
}

const { useToken } = theme;
const { Dragger } = Upload;

const BulkUploadForm: React.FC<props> = ({
  onCloseModal,
  onFinishForm,
  form,
  isLoading,
  sampleData,
  fileName
}) => {
  const { token } = useToken();

  const {
    headerClassName,
    uploadClassName,
    downloadText,
    sampleFile,
    formErrorFix
  } = useBulkUploadModalStyle();

  const admin = useCookies().getDataFromCookie();
  const permission = admin.rbac.cartRequestDrugs;

  return (
    <Form
      form={form}
      onFinish={onFinishForm}
      style={{ paddingBlockStart: pxToRem(12), paddingBlockEnd: pxToRem(16) }}
    >
      <Typography.Title
        style={{
          marginBlock: 0,
          fontSize: pxToRem(20)
        }}
      >
        Upload
      </Typography.Title>

      <span
        style={{
          fontSize: pxToRem(12),
          color: token.colorTextDescription
        }}
      >
        Upload a CSV to Import Data
      </span>

      <Form.Item
        name="file"
        rules={[
          {
            required: true,
            message: <ErrorMessage>Please select a file</ErrorMessage>
          }
        ]}
        style={{ marginBottom: 0 }}
        className={formErrorFix}
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
                or <a style={{ textDecoration: 'underline' }}>click</a> to
                browse (10 MB max)
              </p>
            </>
          </div>
        </Dragger>
      </Form.Item>
      <Row className={sampleFile} justify={'space-between'}>
        <Row style={{ display: 'flex', alignItems: 'center' }}>
          <Col
            style={{
              paddingInlineStart: pxToRem(10),
              paddingInlineEnd: pxToRem(14),
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Image
              alt="csvIcon"
              src={csvIcon}
              style={{
                width: pxToRem(26),
                height: pxToRem(29)
              }}
            />
          </Col>
          <Col>
            <CSVLink
              data={sampleData}
              filename={fileName}
              separator=","
              enclosingCharacter='"'
              className={downloadText}
              style={{
                paddingInlineStart: 0
              }}
            >
              Download Sample CSV
            </CSVLink>
          </Col>
        </Row>
        <Col>
          <CSVLink
            data={sampleData}
            filename={fileName}
            separator=","
            enclosingCharacter='"'
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Image
              alt="downloadIcon"
              src={downloadIcon}
              style={{ font: pxToRem(26) }}
            />
          </CSVLink>
        </Col>
      </Row>
      <Row
        justify="end"
        style={{
          gap: pxToRem(15),
          height: pxToRem(32),
          marginTop: pxToRem(18)
        }}
      >
        <VsButton
          antButtonProps={{
            loading: isLoading,
            disabled: permission !== PERMISSION_TYPES_BACKEND.WRITE
          }}
          style={{
            width: pxToRem(113)
          }}
          size={BUTTON_SIZES.middle}
          onClick={onCloseModal}
        >
          Cancel
        </VsButton>
        <Form.Item>
          <VsButton
            antButtonProps={{
              type: 'primary',
              htmlType: 'submit',
              loading: isLoading,
              disabled: permission !== PERMISSION_TYPES_BACKEND.WRITE
            }}
            style={{
              width: pxToRem(113)
            }}
            size={BUTTON_SIZES.middle}
          >
            Upload
          </VsButton>
        </Form.Item>
      </Row>
    </Form>
  );
};

export default BulkUploadForm;
