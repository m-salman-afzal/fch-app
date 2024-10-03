import { useState } from 'react';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, FormInstance, Row, Typography } from 'antd';
import {
  DrawerFilterButton,
  FilterSearch,
  VsButton
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

const MobileInventoryActions: React.FC<props> = ({
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
  const [isSearching, setSearching] = useState<boolean>(false);

  const blurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };

  return (
    <Row
      justify={'space-between'}
      align={'middle'}
      style={{ marginBlockEnd: pxToRem(20), paddingInline: pxToRem(20) }}
    >
      <Col span={24}>
        <Typography.Text
          style={{
            fontSize: pxToRem(16),
            fontWeight: 600,
            lineHeight: pxToRem(24)
          }}
        >
          Inventory
        </Typography.Text>
      </Col>

      <Col span={24} style={{ marginBlockStart: pxToRem(9) }}>
        <Row style={{ gap: pxToRem(8) }}>
          {!(isSearching || formularyId) ? (
            <VsButton
              onClick={() => {
                setSearching(true);
              }}
              size={BUTTON_SIZES.squareIcon}
            >
              <SearchOutlined />
            </VsButton>
          ) : (
            <FilterSearch
              onBlur={blurSearch}
              onChange={e => {
                handleSearch(e);
              }}
              autoFocus={true}
              value={drugName}
              placeholder="Search User"
              width={pxToRem(250)}
            />
          )}

          <DrawerFilterButton
            handleReset={() => {
              onApplyFilter(
                {
                  controlled: ALL,
                  depleted: ALL,
                  pending: ALL,
                  status: 'active',
                  isFormulary: 'true',
                  isStock: ALL
                },
                true
              );

              filtersFormRef.setFieldsValue({
                controlled: ALL,
                depleted: ALL,
                pending: ALL,
                status: 'active',
                isFormulary: 'true',
                isStock: ALL
              });
            }}
            onClickApply={onApplyFilter}
            formRef={filtersFormRef}
            isIcon={true}
          >
            <FiltersForm showControlled={showControlled} />
          </DrawerFilterButton>
          <VsButton
            size={BUTTON_SIZES.squareIcon}
            onClick={() => getInventoryCsv(false)}
          >
            <DownloadOutlined />
          </VsButton>
          <VsButton
            size={BUTTON_SIZES.middle}
            onClick={() => getInventoryCsv(true)}
          >
            <DownloadOutlined /> Expired NDCs
          </VsButton>
          <BulkUploadModal
            isControlled={showControlled}
            setBulkUploadOption={setBulkUploadOption}
            selectedOption={bulkUploadOption}
            onFinishbulkUploadForm={onFinishbulkUploadForm}
            form={uploadForm}
          />
        </Row>
      </Col>
    </Row>
  );
};

export default MobileInventoryActions;
