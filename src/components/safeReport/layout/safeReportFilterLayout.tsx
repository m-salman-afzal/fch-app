import React, { PropsWithChildren, useEffect, useState } from 'react';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, FormInstance, Grid, Row } from 'antd';
import {
  DrawerFilterButton,
  FilterSearch,
  VsButton
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import useCookies from '@/hooks/useCookies';
import { PERMISSIONS_TYPES } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { SafeReportFilterForm } from '../forms/safeReportFilterForm';

interface props {
  setFilterOpen: (value: boolean) => void;
  onResetFilter: () => void;
  onApplyFilter: (values: any) => void;
  showFilterDrawer: boolean;
  form: FormInstance<any>;
  handleSearch: (val: string) => void;
  handleGenerateReport: () => void;
  onScreen: string;
}

const { useBreakpoint } = Grid;

export const SafeReportFilterLayout: React.FC<PropsWithChildren<props>> = ({
  setFilterOpen,
  onResetFilter,
  onApplyFilter,
  showFilterDrawer,
  form,
  handleSearch,
  handleGenerateReport,
  onScreen
}) => {
  const size = useBreakpoint();
  const [showSearch, setShowSearch] = useState(false);
  const { getDataFromCookie } = useCookies();
  const { rbac } = getDataFromCookie();

  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    setSearchVal('');
  }, [onScreen]);

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col>
          {size.xs && !showSearch ? (
            <VsButton
              antButtonProps={{
                icon: <SearchOutlined />
              }}
              size={BUTTON_SIZES.squareIcon}
              onClick={() => setShowSearch(true)}
            ></VsButton>
          ) : (
            <FilterSearch
              placeholder="Search Report"
              onChange={e => {
                setSearchVal(e.target.value);
                handleSearch(e.target.value);
              }}
              autoFocus={size.xs}
              onBlur={() => setShowSearch(false)}
              value={searchVal}
            />
          )}
        </Col>
        <Col>
          <DrawerFilterButton
            formRef={form}
            onClickApply={onApplyFilter}
            handleReset={onResetFilter}
            isIcon={size.xs}
          >
            <div style={{ paddingInline: pxToRem(16) }}>
              <SafeReportFilterForm form={form} onScreen={onScreen} />
            </div>
          </DrawerFilterButton>
        </Col>
        {onScreen === 'reportHistory' &&
          rbac.reports === PERMISSIONS_TYPES.WRITE && (
            <Col>
              <VsButton
                antButtonProps={{
                  type: 'primary'
                }}
                size={BUTTON_SIZES.middle}
                onClick={handleGenerateReport}
              >
                Generate Report
              </VsButton>
            </Col>
          )}
      </Row>
    </>
  );
};
