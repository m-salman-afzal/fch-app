import { FC, useState } from 'react';
import { Col, Grid, Row } from 'antd';

import { TCartFullfillmentPick } from '@/types/cartFulfillmentTypes';

import { PICK_TABS } from '@/containers/carFulfillment/constants';
import PickActions from '@/containers/carFulfillment/pickActions';
import { pxToRem } from '@/utils/sharedUtils';

import TableSegmented from '../../common/subTabs/tableSegmented';

const { useBreakpoint } = Grid;

interface Props {
  setSelectedTab: (val: string) => void;
  unprocessedSelectedData: TCartFullfillmentPick[];
  onClickClear: () => void;
  handleSearch: (e: any) => void;
  onClickProcess: () => Promise<void>;
  isLoading: boolean;
  search: string;
  selectedScreen: string;
}

export const PickNavigation: FC<Props> = ({
  setSelectedTab,
  unprocessedSelectedData,
  onClickClear,
  handleSearch,
  onClickProcess,
  isLoading,
  search,
  selectedScreen
}) => {
  const size = useBreakpoint();

  const onChangeScreen = (val: any) => {
    setSelectedTab(val);
  };

  return (
    <div style={size.xs ? { paddingInline: pxToRem(20) } : {}}>
      <Row
        justify="space-between"
        align={size.md ? 'middle' : undefined}
        style={{
          gap: pxToRem(16),
          paddingTop: size.xs ? pxToRem(7) : '',
          flexDirection: size.xs ? 'column' : undefined
        }}
      >
        {size.xs && (
          <PickActions
            search={search}
            onClickClear={onClickClear}
            onSearchPick={handleSearch}
            selectedData={unprocessedSelectedData}
            onProcess={onClickProcess}
            isLoading={isLoading}
          />
        )}
        <Col style={{ marginInlineStart: size.xs ? pxToRem(-20) : undefined }}>
          <TableSegmented
            segmentedProps={{
              options: PICK_TABS,
              block: false,
              value: selectedScreen,
              onChange: onChangeScreen
            }}
          />
        </Col>

        {size.md && (
          <PickActions
            onClickClear={onClickClear}
            onSearchPick={handleSearch}
            selectedData={unprocessedSelectedData}
            onProcess={onClickProcess}
            isLoading={isLoading}
            search={search}
          />
        )}
      </Row>
    </div>
  );
};
