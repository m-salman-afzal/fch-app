import { FC } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Divider, Form, Grid, Modal } from 'antd';
import {
  ErrorMessage,
  VsButton,
  VsCheckboxFormItem,
  VsSelectFormItem,
  VsTextAreaFormItem
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import useCookies from '@/hooks/useCookies';
import { useFacility } from '@/hooks/useFacility';
import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

interface Props {
  open: boolean;
  setOpen: (x: boolean) => void;
  handleFormSubmit: (data: any) => Promise<void>;
}

export const IssueReportGenerateForm: FC<Props> = ({
  open,
  setOpen,
  handleFormSubmit
}) => {
  const size = useBreakpoint();
  const [form] = Form.useForm();

  const { getDataFromCookie } = useCookies();
  const { currentFacility } = useFacility();
  const cookie = getDataFromCookie();

  const facilities = cookie?.facility?.map((f: any) => {
    return {
      key: f.facilityId,
      label: f.facilityName,
      value: f.facilityId
    };
  });

  return (
    <Modal
      title={
        <div
          style={{
            paddingLeft: 20,
            fontSize: size.xs ? 20 : 24,
            paddingTop: 14
          }}
        >
          Generate Issue Report
        </div>
      }
      styles={{
        content: {
          padding: 0
        }
      }}
      centered
      style={{ minWidth: size.xs ? '100%' : pxToRem(800) }}
      open={open}
      footer={null}
      destroyOnClose
      closeIcon={<CloseOutlined style={{ fontSize: pxToRem(26) }} />}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
    >
      <Divider style={{ marginTop: 12, marginBottom: 20 }} />
      <div style={{ paddingInline: 20, paddingBottom: 20 }}>
        <Form
          form={form}
          onFinish={async data => {
            await handleFormSubmit(data);
            form.resetFields();
          }}
          initialValues={{ facilityId: currentFacility.facilityId }}
        >
          <VsSelectFormItem
            placeholder="Facility"
            width={size.xs ? '100%' : pxToRem(365)}
            formItemProps={{ name: 'facilityId', rules: [{ required: true }] }}
            options={facilities}
            externalShowLabel={true}
            setExternalShowLabel={() => {}}
            open={false}
          />
          <VsTextAreaFormItem
            placeholder="Write Report"
            width="100%"
            autoSize={{
              maxRows: 40,
              minRows: 15
            }}
            formItemProps={{
              name: 'description',
              rules: [
                {
                  required: true,
                  validator: (rule, value) => {
                    if (value === undefined || value === null) {
                      return Promise.reject(
                        <ErrorMessage>Description is required</ErrorMessage>
                      );
                    }

                    if (value?.trim().length < 10) {
                      return Promise.reject(
                        <ErrorMessage>
                          Type Description (Min 10 Characters)
                        </ErrorMessage>
                      );
                    }

                    return Promise.resolve();
                  }
                }
              ]
            }}
          />
          <VsCheckboxFormItem
            formItemProps={{ name: 'isAnonymous' }}
            checkboxProps={{
              children: 'Submit as Anonymous',
              style: { paddingBottom: pxToRem(20) }
            }}
          />
          <VsButton
            antButtonProps={{
              type: 'primary',
              htmlType: 'submit'
            }}
            size={BUTTON_SIZES.large}
            style={{ width: pxToRem(165) }}
          >
            Submit
          </VsButton>
        </Form>
      </div>
    </Modal>
  );
};
