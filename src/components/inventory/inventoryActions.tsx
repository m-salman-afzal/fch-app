import { useEffect } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Col, FormInstance, Row, Typography } from 'antd';
import {
  DrawerFilterButton,
  FilterSearch,
  VsButton,
  VsTooltip
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { InventoryBulkUploadTypes } from '@/types/inventoryBulkUploadTypes';

import { ALL } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import BulkUploadModal from './bulkUploadModal';
import FiltersForm from './filtersForm';

interface props {
  uploadForm: FormInstance<any>;
  filtersFormRef: FormInstance<any>;
  onApplyFilter: (values: any, reset?: boolean) => void;
  handleSearch: any;
  onFinishbulkUploadForm: (values: any) => void;
  getInventoryCsv: (isExpired?: boolean) => void;
  formularyId: string | null;
  drugName: string;
  showControlled: boolean;
  bulkUploadOption: string;
  setBulkUploadOption: (x: InventoryBulkUploadTypes) => void;
}

const InventoryActions: React.FC<props> = ({
  uploadForm,
  filtersFormRef,
  onApplyFilter,
  handleSearch,
  onFinishbulkUploadForm,
  getInventoryCsv,
  formularyId,
  drugName,
  showControlled,
  bulkUploadOption,
  setBulkUploadOption
}) => {
  return (
    <Row justify={'end'} style={{ marginBlockEnd: pxToRem(20) }}>
      <Col>
        <Row
          justify={'space-between'}
          align={'middle'}
          style={{ gap: pxToRem(8) }}
        >
          <FilterSearch
            value={drugName}
            autoFocus={formularyId ? true : undefined}
            onChange={e => {
              handleSearch(e);
            }}
            placeholder="Search Drug"
            width={pxToRem(250)}
          />
          <DrawerFilterButton
            handleReset={() => {
              onApplyFilter(
                {
                  controlled: ALL,
                  pending: ALL,
                  status: 'active',
                  isFormulary: 'true',
                  isStock: 'true',
                  depleted: 'no'
                },
                true
              );

              filtersFormRef.setFieldsValue({
                controlled: ALL,
                depleted: 'no',
                pending: ALL,
                status: 'active',
                isFormulary: 'true',
                isStock: 'true'
              });
            }}
            onClickApply={onApplyFilter}
            formRef={filtersFormRef}
            forceRender={true}
          >
            <FiltersForm showControlled={showControlled} />
          </DrawerFilterButton>
          <VsButton
            size={BUTTON_SIZES.middle}
            onClick={() => getInventoryCsv(true)}
          >
            <DownloadOutlined
              style={{
                fontSize: pxToRem(14)
              }}
            />
            Expired NDCs
          </VsButton>
          <VsButton
            size={BUTTON_SIZES.middle}
            onClick={() => getInventoryCsv(false)}
          >
            <DownloadOutlined
              style={{
                fontSize: pxToRem(14)
              }}
            />
            Download All
          </VsButton>
          <BulkUploadModal
            setBulkUploadOption={setBulkUploadOption}
            selectedOption={bulkUploadOption}
            onFinishbulkUploadForm={onFinishbulkUploadForm}
            form={uploadForm}
            isControlled={showControlled}
          />
        </Row>
      </Col>
    </Row>
  );
};

export default InventoryActions;
