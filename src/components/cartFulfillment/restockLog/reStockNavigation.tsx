import { FC, useState } from 'react';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Grid, Row, Typography } from 'antd';
import { FilterSearch, VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { RESTOCK_LOGS_TABS } from '@/containers/carFulfillment/constants';
import { pxToRem } from '@/utils/sharedUtils';

import TableSegmented from '../../common/subTabs/tableSegmented';

const { useBreakpoint } = Grid;

interface Props {
  selectedTab: string;
  onChangeTab: (val: any) => void;
  setFilterOpen: (val: any) => void;
  onSearch: (e: any) => void;
}

export const ReStockNavigation: FC<Props> = ({
  selectedTab,
  onChangeTab,
  setFilterOpen,
  onSearch
}) => {
  const size = useBreakpoint();
  const [searching, setSearching] = useState<boolean>(false);
  const [inputText, setInputText] = useState('');

  const blurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };

  return (
    <div>
      <Row
        justify="space-between"
        style={{
          gap: size.xs ? pxToRem(24) : pxToRem(16),
          paddingTop: size.xs ? pxToRem(0) : ''
        }}
      >
        <Col span={size.xs ? 24 : undefined} order={size.xs ? 2 : 1}>
          <TableSegmented
            segmentedProps={{
              options: RESTOCK_LOGS_TABS,
              block: false,
              value: selectedTab,
              onChange: onChangeTab
            }}
          />
        </Col>
        <Col
          span={size.xs ? 24 : undefined}
          order={size.xs ? 1 : 2}
          style={{ paddingInlineStart: size.xs ? pxToRem(20) : undefined }}
        >
          <Row style={{ gap: pxToRem(8), display: 'flex' }}>
            <Col>
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
                  onBlur={blurSearch}
                  onChange={onSearch}
                  autoFocus={size.xs}
                  placeholder="Search User"
                  width={pxToRem(250)}
                />
              )}
            </Col>

            <Row gutter={[8, 8]}>
              <Col>
                <VsButton
                  size={BUTTON_SIZES.middle}
                  onClick={() => setFilterOpen(true)}
                >
                  <FilterOutlined
                    style={{
                      fontSize: pxToRem(14)
                    }}
                  />
                  Filters
                </VsButton>
              </Col>
            </Row>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
