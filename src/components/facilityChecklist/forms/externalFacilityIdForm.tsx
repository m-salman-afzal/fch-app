import { FC, useEffect, useState } from 'react';
import { Form, FormInstance, Typography } from 'antd';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsButton
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import useCookies from '@/hooks/useCookies';
import { PERMISSION_TYPES_BACKEND } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

interface Props {
  externalFacilityId: string;
  isLoading: boolean;
  form: FormInstance;
  onFinish: (data: any) => Promise<void>;
}

export const ExternalFacilityIdForm: FC<Props> = ({
  externalFacilityId,
  isLoading,
  form,
  onFinish
}) => {
  const isSmall = window.screen.width <= 576;

  const admin = useCookies().getDataFromCookie();
  const permission = admin.rbac.facilityChecklist;

  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

  useEffect(() => {
    form.setFieldValue('externalFacilityId', externalFacilityId);
  }, [externalFacilityId]);

  const watch = Form.useWatch([], form);

  useEffect(() => {
    const match = [];
    for (const item in watch) {
      if (
        item === 'externalFacilityId' &&
        (watch[item] as any) === externalFacilityId
      ) {
        match.push(true);
      }
    }

    if (match.length === 1) {
      setIsSaveDisabled(true);
    } else {
      setIsSaveDisabled(false);
    }
  }, [watch, externalFacilityId]);

  const onClickCancel = () => {
    form.resetFields();
    form.setFieldValue('externalFacilityId', externalFacilityId);
    setIsSaveDisabled(true);
  };

  const titlesStyle = {
    marginBlockStart: 0,
    fontSize: pxToRem(16),
    fontWeight: 600,
    lineHeight: pxToRem(24)
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
          External Facility ID
        </Typography.Title>
        <BasicInputFormItem
          formItemProps={{
            name: 'externalFacilityId',
            rules: [
              {
                required: true,
                message: <ErrorMessage>Enter External Facility ID</ErrorMessage>
              }
            ]
          }}
          defaultValue={externalFacilityId}
          placeholder={'External Facility ID'}
          width="100%"
        />
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
