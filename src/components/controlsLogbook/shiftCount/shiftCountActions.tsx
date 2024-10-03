import { useState } from 'react';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Dropdown, FormInstance, Grid, Row } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import {
  DrawerFilterButton,
  FilterSearch,
  VsButton
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import type {
  TShiftCountFilter,
  TShiftCountSubmitForm,
  TShiftCountTabs
} from '@/types/shiftCountTypes';

import TableSegmented from '@/components/common/subTabs/tableSegmented';

import {
  SHIFT_COUNT_TAB_NAMES,
  SHIFT_COUNT_TABS
} from '@/containers/controlsLogbook/shiftCount/constants';
import useCookies from '@/hooks/useCookies';
import { PERMISSION_TYPES_BACKEND, PERMISSIONS_TYPES } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import ShiftCountLogsFilterForm from './shiftCountLogsFilterForm';
import ProcessModalButton from './shiftCountProcessModalBtn';

interface props {
  onSearch: (e: any) => void;
  onClickProceed: () => void;
  cartsData: any[];
  onSelectCart: (val: any) => void;
  selectedCart: string;
  selectedTab: TShiftCountTabs;
  isProceedEnabled: boolean;
  shiftCountSubmitForm: FormInstance<TShiftCountSubmitForm>;
  isLoading: boolean;
  onChangeTab: (x: SegmentedValue) => void;
  onShiftCountLogsFilterReset: () => void;
  onApplyShiftCountLogsFilterForm: (values: TShiftCountFilter) => Promise<void>;
  scLogsFilterForm: FormInstance<TShiftCountFilter>;
  onCloseProcessModal: () => void;
  onClickSubmitProcess: (values: any) => void;
  showDiscrepancyError: boolean;
  isProceedOpen: boolean;
  searchText: string;
}

const { useBreakpoint } = Grid;

const ShiftCountActions: React.FC<props> = ({
  onSearch,
  onClickProceed,
  cartsData = [],
  onSelectCart,
  isProceedEnabled,
  shiftCountSubmitForm,
  isLoading,
  selectedTab,
  onChangeTab,
  scLogsFilterForm,
  onApplyShiftCountLogsFilterForm,
  onShiftCountLogsFilterReset,
  onCloseProcessModal,
  onClickSubmitProcess,
  selectedCart,
  showDiscrepancyError,
  isProceedOpen,
  searchText
}) => {
  const [searching, setSearching] = useState<boolean>(false);

  const { getDataFromCookie } = useCookies();
  const permission = getDataFromCookie()?.rbac?.controlLogBookAdminister;
  const blurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };
  const size = useBreakpoint();

  const hideIfTabShiftCountAndNoCartSelected =
    !selectedCart && selectedTab.label === SHIFT_COUNT_TAB_NAMES.SHIFT_COUNT;

  return (
    <Row
      justify={
        size.xs
          ? selectedTab.label === SHIFT_COUNT_TAB_NAMES.LOGS
            ? 'space-between'
            : 'start'
          : 'space-between'
      }
      style={{
        rowGap: pxToRem(16),
        paddingInline: size.xs ? pxToRem(20) : undefined
      }}
    >
      <Col>
        <TableSegmented
          segmentedProps={{
            options: SHIFT_COUNT_TABS,
            onChange: (x: SegmentedValue) => {
              onChangeTab(x);
            },
            value: selectedTab.value
          }}
        />
      </Col>
      {!hideIfTabShiftCountAndNoCartSelected && (
        <Col>
          <Row justify={size.xs ? 'start' : 'end'} style={{ gap: pxToRem(8) }}>
            {selectedTab.label === SHIFT_COUNT_TAB_NAMES.SHIFT_COUNT && (
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
                    value={searchText}
                    onBlur={blurSearch}
                    onChange={onSearch}
                    autoFocus={size.xs}
                    placeholder="Search"
                    width={size.xs ? '100%' : pxToRem(250)}
                  />
                )}
              </Col>
            )}

            {selectedTab.label === SHIFT_COUNT_TAB_NAMES.SHIFT_COUNT && (
              <>
                <Col style={{ height: pxToRem(32) }}>
                  <Dropdown
                    trigger={['click']}
                    menu={{
                      selectable: true,
                      selectedKeys: [selectedCart],
                      multiple: false,
                      items: cartsData,
                      onSelect: e => {
                        onSelectCart(e.key);
                      }
                    }}
                  >
                    <VsButton size={BUTTON_SIZES.middle}>
                      Select Cart <DownOutlined />
                    </VsButton>
                  </Dropdown>
                </Col>

                {permission === PERMISSIONS_TYPES.WRITE && (
                  <Col style={{ height: pxToRem(32) }}>
                    <ProcessModalButton
                      isProceedEnabled={isProceedEnabled}
                      onClickProceed={onClickProceed}
                      onCloseModal={onCloseProcessModal}
                      shiftCountSubmitForm={shiftCountSubmitForm}
                      onClickSubmit={onClickSubmitProcess}
                      isLoading={isLoading}
                      showDiscrepancyError={showDiscrepancyError}
                      open={isProceedOpen}
                    />
                  </Col>
                )}
              </>
            )}

            {selectedTab.label === SHIFT_COUNT_TAB_NAMES.LOGS && (
              <>
                <DrawerFilterButton
                  handleReset={onShiftCountLogsFilterReset}
                  onClickApply={onApplyShiftCountLogsFilterForm}
                  formRef={scLogsFilterForm}
                  isIcon={size.xs}
                >
                  <ShiftCountLogsFilterForm cartOptions={cartsData} />
                </DrawerFilterButton>
              </>
            )}
          </Row>
        </Col>
      )}
    </Row>
  );
};

export default ShiftCountActions;
