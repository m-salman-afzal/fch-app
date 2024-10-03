import { FC } from 'react';
import {
  Button,
  Divider,
  Form,
  FormInstance,
  Modal,
  Row,
  TimePicker,
  Typography
} from 'antd';
import Image from 'next/image';

import Clock from '@/assets/icons/communication/Clock.svg';
import { pxToRem } from '@/utils/sharedUtils';

interface Props {
  modalOpen: boolean;
  setModalOpen: (val: boolean) => void;
  handleFormSubmit: (val: any) => void;
  formRef: FormInstance;
}

export const UpdateTimeModal: FC<Props> = ({
  modalOpen,
  setModalOpen,
  handleFormSubmit,
  formRef
}) => {
  return (
    <Modal
      footer={null}
      open={modalOpen}
      width={pxToRem(320)}
      onCancel={() => setModalOpen(false)}
    >
      <Row justify="center" style={{ paddingTop: pxToRem(20) }}>
        <Image src={Clock} alt="clock" />
      </Row>
      <Row justify="center">
        <Typography.Text
          style={{
            fontSize: pxToRem(20),
            fontWeight: 600,
            paddingTop: pxToRem(16),
            paddingBottom: pxToRem(16)
          }}
        >
          Update Time
        </Typography.Text>
      </Row>
      <Form form={formRef} onFinish={handleFormSubmit}>
        <Row justify="center">
          <div style={{ paddingInline: 20, width: '100%' }}>
            <Form.Item
              name="time"
              rules={[{ required: true, message: '' }]}
              noStyle
            >
              <TimePicker
                placeholder="Cron Time"
                size="large"
                style={{ width: '100%', borderRadius: 4, height: pxToRem(46) }}
              />
            </Form.Item>
          </div>
        </Row>
        <Divider style={{ marginBottom: 12, marginTop: 20 }} />
        <Row justify="center" style={{ width: '100%' }}>
          <div style={{ paddingInline: 20, width: '100%' }}>
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              style={{ width: '100%', borderRadius: 4 }}
            >
              Update
            </Button>
          </div>
        </Row>
      </Form>
    </Modal>
  );
};
