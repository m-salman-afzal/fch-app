import { FC } from 'react';
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  Col,
  Divider,
  Form,
  FormInstance,
  Grid,
  Modal,
  Row,
  Typography
} from 'antd';
import {
  ErrorMessage,
  VsButton,
  VsTextAreaFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TReferenceGuide } from '@/types/referenceGuideTypes';

import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

interface Props {
  noteFormRef: FormInstance;
  handleNoteFormSubmit: (val: any) => void;
  open: boolean;
  setOpenNoteForm: (val: boolean) => void;
  selectedReferenceGuide: TReferenceGuide | undefined;
  deleteReferenceGuideNote: () => void;
}

export const ReferenceGuideNoteModal: FC<Props> = ({
  noteFormRef,
  handleNoteFormSubmit,
  open,
  setOpenNoteForm,
  selectedReferenceGuide,
  deleteReferenceGuideNote
}) => {
  const size = useBreakpoint();

  return (
    <Modal
      open={open}
      footer={null}
      destroyOnClose
      title={
        <Row
          style={{
            paddingLeft: pxToRem(20),
            display: 'flex',
            alignItems: 'center',
            height: pxToRem(65)
          }}
        >
          <Col>
            <Typography.Title
              style={{
                fontSize: pxToRem(20),
                marginRight: pxToRem(12),
                marginBlock: 0
              }}
            >
              {selectedReferenceGuide?.note ? 'Edit Note' : 'Add Note'}
            </Typography.Title>
          </Col>

          {selectedReferenceGuide?.note && (
            <Col>
              <VsButton
                style={{
                  borderRadius: pxToRem(4),
                  width: pxToRem(24),
                  height: pxToRem(24)
                }}
                size={BUTTON_SIZES.squareIcon}
                antButtonProps={{ danger: true }}
                onClick={() => deleteReferenceGuideNote()}
              >
                <DeleteOutlined />
              </VsButton>
            </Col>
          )}
        </Row>
      }
      width={size.xs ? '100%' : pxToRem(402)}
      style={{
        maxWidth: 'none',
        margin: 0
      }}
      styles={{
        content: {
          padding: 0
        },
        header: { margin: 0 }
      }}
      onCancel={() => {
        setOpenNoteForm(false);
        noteFormRef.resetFields();
      }}
      maskClosable={false}
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(20) }} />}
      centered
    >
      <Divider style={{ marginTop: 0, marginBottom: 20 }} />
      <Form
        form={noteFormRef}
        onFinish={handleNoteFormSubmit}
        style={{
          width: '100%',
          display: `flex`,
          flexDirection: `column`,
          justifyContent: `center`,
          alignItems: `center`
        }}
        scrollToFirstError={true}
      >
        <Row
          style={{
            width: '100%',
            justifyContent: 'center',
            columnGap: pxToRem(11),
            overflow: 'auto',
            scrollBehavior: `smooth`
          }}
        >
          <Col style={{ width: '90%' }}>
            <VsTextAreaFormItem
              placeholder="Type here"
              rows={10}
              width="100%"
              formItemProps={{
                style: { marginBottom: pxToRem(20) },
                rules: [
                  {
                    required: true,
                    message: <ErrorMessage>Enter Note</ErrorMessage>
                  }
                ],
                name: 'note'
              }}
            />
          </Col>
        </Row>
        <Divider style={{ marginTop: 0, marginBottom: 12 }} />
        <Row
          justify={`center`}
          style={{
            paddingBottom: pxToRem(12),
            columnGap: pxToRem(11),
            width: '97%'
          }}
        >
          <Col style={{ width: '45%' }}>
            <VsButton
              size={BUTTON_SIZES.large}
              style={{ width: '100%' }}
              onClick={() => {
                setOpenNoteForm(false);
                noteFormRef.resetFields();
              }}
            >
              Cancel
            </VsButton>
          </Col>
          <Col style={{ width: '45%' }}>
            <VsButton
              antButtonProps={{
                type: 'primary',
                htmlType: 'submit'
              }}
              size={BUTTON_SIZES.large}
              style={{ width: '100%' }}
            >
              Save
            </VsButton>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
