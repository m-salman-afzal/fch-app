import { CloseOutlined } from '@ant-design/icons';
import {
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
import {
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsSelectFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import csvIcon from '@/assets/icons/bulkUpload/csvIcon.svg';
import downloadIcon from '@/assets/icons/bulkUpload/downloadIcon.svg';
import uploadFile from '@/assets/icons/bulkUpload/uploadFile.svg';
import { pxToRem } from '@/utils/sharedUtils';

import { useBulkUploadModalStyle } from '../../common/bulkUpload/usebulkUploadStyle';

interface props {
  onCloseModal: () => void;
  onFinishForm: (values: any) => void;
  open: boolean;
  form: FormInstance;
  isLoading: boolean;
  sampleData?: any;
  fileName: string;
  selectedReferenceGuideListUploadType: string;
  referenceGuideOptions: any[];
}
const { useBreakpoint } = Grid;
const { useToken } = theme;
const { Dragger } = Upload;

const BulkUploadReferenceGuideListModal: React.FC<props> = ({
  onCloseModal,
  onFinishForm,
  open,
  form,
  isLoading,
  sampleData,
  fileName,
  selectedReferenceGuideListUploadType,
  referenceGuideOptions = []
}) => {
  const size = useBreakpoint();
  const { token } = useToken();

  const {
    headerClassName,
    uploadClassName,
    downloadText,
    sampleFile,
    formErrorFix
  } = useBulkUploadModalStyle();

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
        <Typography.Title style={{ marginBlock: 0, fontSize: pxToRem(20) }}>
          {selectedReferenceGuideListUploadType === 'ADD_REFERENCE'
            ? 'Upload New Guide'
            : 'Modify an Existing Guide'}
        </Typography.Title>
      }
      maskClosable={false}
      centered
      width={size.xs ? '100vw' : pxToRem(402)}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
    >
      <Form form={form} onFinish={onFinishForm}>
        <span
          style={{
            fontSize: pxToRem(12),
            color: token.colorTextDescription,
            marginBlock: `${pxToRem(10)} 0`
          }}
        >
          Upload a CSV to import data
        </span>
        {selectedReferenceGuideListUploadType === 'ADD_REFERENCE' ? (
          <BasicInputFormItem
            width="100%"
            placeholder={'Reference Guide Name'}
            formItemProps={{
              name: 'name',
              rules: [
                {
                  required: true,
                  message: <ErrorMessage>Type name</ErrorMessage>
                }
              ],

              style: {
                marginTop: pxToRem(16),
                marginBottom: pxToRem(18)
              }
            }}
          />
        ) : (
          <VsSelectFormItem
            placeholder="Reference Guide"
            options={referenceGuideOptions}
            formItemProps={{
              name: 'referenceGuideId',
              rules: [
                {
                  required: true,
                  message: (
                    <ErrorMessage>Please select a reference guide</ErrorMessage>
                  )
                }
              ],

              style: {
                marginTop: pxToRem(16),
                marginBottom: pxToRem(18)
              }
            }}
          ></VsSelectFormItem>
        )}

        <Form.Item
          name="file"
          rules={[
            {
              required: true,
              message: (
                <ErrorMessage
                  customStyle={{
                    marginBlockEnd: pxToRem(10),
                    display: 'flex',
                    columnGap: pxToRem(5),
                    color: '#cf1322',
                    fontSize: pxToRem(12)
                  }}
                >
                  Please select a file
                </ErrorMessage>
              )
            }
          ]}
          style={{ marginBottom: 0, marginTop: -10 }}
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
        <Row className={sampleFile} align={'middle'}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              alt="csvIcon"
              src={csvIcon}
              style={{ paddingInlineStart: pxToRem(10) }}
            />
            <CSVLink
              data={sampleData}
              filename={fileName}
              separator=","
              enclosingCharacter='"'
              className={downloadText}
            >
              Download Sample CSV
            </CSVLink>
          </div>
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
            <Image alt="csvIcon" src={downloadIcon} />
          </CSVLink>
        </Row>
        <Row
          justify={'space-between'}
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
            style={{
              width: '47%'
            }}
            size={BUTTON_SIZES.large}
            onClick={onCloseModal}
          >
            Cancel
          </VsButton>

          <VsButton
            antButtonProps={{
              type: 'primary',
              htmlType: 'submit',
              loading: isLoading
            }}
            style={{
              width: '47%'
            }}
            size={BUTTON_SIZES.large}
          >
            Upload
          </VsButton>
        </Row>
      </Form>
    </Modal>
  );
};

export default BulkUploadReferenceGuideListModal;
