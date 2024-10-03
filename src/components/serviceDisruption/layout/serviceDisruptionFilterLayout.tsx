import React, { PropsWithChildren } from 'react';
import { FilterOutlined, UploadOutlined } from '@ant-design/icons';
import { FormInstance, Grid, Row } from 'antd';
import {
  DrawerFilter,
  DrawerFilterButton,
  VsButton,
  VsTooltip
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import useCookies from '@/hooks/useCookies';
import { PERMISSIONS_TYPES } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { ServiceDisruptionFilterForm } from '../forms/serviceDisruptionFilterForm';
import { BulkUploadServiceDisruptionModal } from '../modals/bulkUploadServiceDisruptionModal';

const { useBreakpoint } = Grid;

interface props {
  onResetFilter: () => void;
  onApplyFilter: (values: any) => void;
  onBulkUpload: (fileData: any) => void;
  onCancelModal: (props: { bulkUpload?: boolean }) => void;
  filterForm: FormInstance<any>;
  bulkUploadForm: FormInstance<any>;
  showModal: { bulkUpload: boolean };
  isLoading: boolean;
}

export const ServiceDisruptionFilterLayout: React.FC<
  PropsWithChildren<props>
> = ({
  onResetFilter,
  onApplyFilter,
  onBulkUpload,
  onCancelModal,
  filterForm,
  bulkUploadForm,
  showModal,
  isLoading
}) => {
  const size = useBreakpoint();
  const { getDataFromCookie } = useCookies();

  const admin = getDataFromCookie();

  return (
    <>
      <Row style={{ gap: pxToRem(8) }}>
        <DrawerFilterButton
          formRef={filterForm}
          onClickApply={onApplyFilter}
          handleReset={onResetFilter}
          isIcon={size.xs}
        >
          <div style={{ paddingInline: pxToRem(16) }}>
            <ServiceDisruptionFilterForm />
          </div>
        </DrawerFilterButton>

        {admin.rbac.serviceDisruptions === PERMISSIONS_TYPES.WRITE && (
          <VsButton
            antButtonProps={{
              type: 'primary'
            }}
            onClick={() => onCancelModal({ bulkUpload: true })}
            size={BUTTON_SIZES.middle}
          >
            <VsTooltip title={''} placement="bottom" arrow>
              <UploadOutlined
                style={{
                  fontSize: pxToRem(14),
                  paddingInlineEnd: pxToRem(8)
                }}
              />
              Upload
            </VsTooltip>
          </VsButton>
        )}
      </Row>

      <BulkUploadServiceDisruptionModal
        onFinishForm={onBulkUpload}
        onCloseModal={() => onCancelModal({ bulkUpload: false })}
        isLoading={isLoading}
        bulkUploadForm={bulkUploadForm}
        open={showModal.bulkUpload}
      />
    </>
  );
};
