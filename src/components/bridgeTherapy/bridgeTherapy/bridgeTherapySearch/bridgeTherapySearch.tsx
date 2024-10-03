import { ChangeEvent, FC, useState } from 'react';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Grid, Row, Typography } from 'antd';
import { FilterSearch, VsButton, VsTooltip } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { pxToRem } from '@/utils/sharedUtils';

interface Props {
  setSearchValue: (e: ChangeEvent<HTMLInputElement>) => void;
  setFilterOpen: (val: boolean) => void;
}

const { useBreakpoint } = Grid;

export const BridgeTherapySearch: FC<Props> = ({
  setSearchValue,
  setFilterOpen
}) => {
  const size = useBreakpoint();

  const [isSearching, setSearching] = useState<boolean>(false);
  const blurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };

  return (
    <Row gutter={[8, 8]}>
      <Col>
        {size.xs && !isSearching ? (
          <VsButton
            size={BUTTON_SIZES.squareIcon}
            onClick={() => {
              setSearching(true);
            }}
          >
            <SearchOutlined />
          </VsButton>
        ) : (
          <FilterSearch
            onBlur={blurSearch}
            onChange={setSearchValue}
            placeholder="Search"
            width={pxToRem(255)}
          />
        )}
      </Col>

      <Col>
        <VsButton
          size={size.xs ? BUTTON_SIZES.squareIcon : BUTTON_SIZES.middle}
          onClick={() => setFilterOpen(true)}
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
  );
};
