import { FC, useEffect, useState } from 'react';
import { Form, FormInstance, Radio, Typography } from 'antd';
import { ErrorMessage, VsButton, VsFormItem } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import useCookies from '@/hooks/useCookies';
import { PERMISSION_TYPES_BACKEND } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

interface Props {
  isLoading: boolean;
  form: FormInstance;
  supplyDays: number | null;
  onFinish: (data: any) => Promise<void>;
}

export const BridgeTherapyForm: FC<Props> = ({
  isLoading,
  form,
  supplyDays,
  onFinish
}) => {
  const isSmall = window.screen.width <= 576;

  const admin = useCookies().getDataFromCookie();
  const permission = admin.rbac.facilityChecklist;

  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

  useEffect(() => {
    form.setFieldValue('supplyDays', supplyDays);
  }, [supplyDays]);

  const watch = Form.useWatch([], form);

  useEffect(() => {
    const match = [];
    for (const item in watch) {
      if (item === 'supplyDays' && (watch[item] as any) === supplyDays) {
        match.push(true);
      }
    }

    if (match.length === 1) {
      setIsSaveDisabled(true);
    } else {
      setIsSaveDisabled(false);
    }
  }, [watch, supplyDays]);

  const titlesStyle = {
    marginBlockStart: 0,
    fontSize: pxToRem(16),
    fontWeight: 600,
    lineHeight: pxToRem(24)
  };

  const onClickCancel = () => {
    form.resetFields();
    form.setFieldValue('supplyDays', supplyDays);
    setIsSaveDisabled(true);
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <div
        style={{
          paddingInline: pxToRem(24),
          paddingBlockStart: pxToRem(24),
          borderBlockEnd: `${pxToRem(1)} solid #E5E4E4`
        }}
      >
        <Typography.Title
          style={{ ...titlesStyle, marginBlockEnd: pxToRem(16) }}
        >
          Bridge Therapy{' '}
          <Typography.Text style={{ fontWeight: 400 }}>
            (Supply Days)
          </Typography.Text>
        </Typography.Title>

        <VsFormItem
          formItemProps={{
            rules: [
              {
                required: true,
                message: <ErrorMessage>Specify one of the above</ErrorMessage>
              }
            ],
            name: 'supplyDays'
          }}
        >
          <Radio.Group
            name="supplyDays"
            style={{
              display: 'flex',
              gap: pxToRem(12),
              justifyContent: 'space-between'
            }}
          >
            <Radio
              style={{
                borderRadius: pxToRem(4),
                paddingInline: pxToRem(16),
                paddingBlock: pxToRem(12),
                border: `${pxToRem(1)} solid #00000026`,
                marginInlineEnd: 0,
                width: '100%'
              }}
              value={7}
            >
              7 Days
            </Radio>
            <Radio
              style={{
                borderRadius: pxToRem(4),
                paddingInline: pxToRem(16),
                paddingBlock: pxToRem(12),
                border: `${pxToRem(1)} solid #00000026`,
                marginInlineEnd: 0,
                width: '100%'
              }}
              value={30}
            >
              30 Days
            </Radio>
          </Radio.Group>
        </VsFormItem>
      </div>

      {permission === PERMISSION_TYPES_BACKEND.WRITE && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            paddingBlockStart: pxToRem(21),
            paddingInline: pxToRem(24),
            justifyContent: 'end'
          }}
        >
          <VsButton
            size={BUTTON_SIZES.middle}
            onClick={onClickCancel}
            style={{
              marginInlineEnd: pxToRem(10),
              width: isSmall ? '100%' : pxToRem(139)
            }}
          >
            Cancel
          </VsButton>
          <VsButton
            antButtonProps={{
              type: 'primary',

              htmlType: 'submit',
              disabled: isSaveDisabled,
              loading: isLoading
            }}
            size={BUTTON_SIZES.middle}
            style={{
              width: isSmall ? '100%' : pxToRem(139)
            }}
          >
            Save
          </VsButton>
        </div>
      )}
    </Form>
  );
};
