import {
  DownloadOutlined,
  DownOutlined,
  FilterOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Col, Dropdown, Form, FormInstance, Grid, Row, Typography } from 'antd';
import {
  FilterSearch,
  VsButton,
  VsFormItem,
  VsTooltip
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { pxToRem } from '@/utils/sharedUtils';

interface props {
  searching: boolean;
  setSearching: (val: boolean) => void;
  onSearch: (val: any) => void;
  formRef: FormInstance;
  setShowFilterDrawer: (val: boolean) => void;
}
const { useBreakpoint } = Grid;

export const DiscrepancyLogAction = ({
  searching,
  setSearching,
  onSearch,
  formRef,
  setShowFilterDrawer
}: props) => {
  const size = useBreakpoint();

  const onBlurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };

  return (
    <>
      <Col span={24}>
        <Row
          gutter={8}
          justify={size.xs ? 'start' : 'end'}
          style={{
            height: pxToRem(32),
            marginInline: 0,
            paddingInline: size.xs ? pxToRem(20) : undefined
          }}
        >
          <Col style={{ height: pxToRem(32) }}>
            {size.xs && !searching ? (
              <VsButton
                onClick={() => {
                  setSearching(true);
                }}
                size={BUTTON_SIZES.squareIcon}
              >
                <SearchOutlined style={{ fontSize: pxToRem(16) }} />
              </VsButton>
            ) : (
              <FilterSearch
                onBlur={onBlurSearch}
                onChange={onSearch}
                autoFocus={size.xs}
                placeholder="Search"
                width={pxToRem(250)}
              />
            )}
          </Col>
          <Col>
            <VsButton
              size={size.xs ? BUTTON_SIZES.squareIcon : BUTTON_SIZES.middle}
              onClick={() => setShowFilterDrawer(true)}
            >
              <FilterOutlined
                style={{
                  fontSize: size.xs ? pxToRem(16) : pxToRem(14)
                }}
              />
              {!size.xs && 'Filters'}
            </VsButton>
          </Col>
        </Row>
      </Col>
    </>
  );
};
