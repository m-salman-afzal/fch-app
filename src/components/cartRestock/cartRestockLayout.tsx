import { FC } from 'react';
import { Col, Grid, Row } from 'antd';
import debounce from 'lodash.debounce';
import { DrawerFilterButton, VsSegmented } from 'vs-design-components';

import { RequestFormContainer } from '@/containers/carRestock/requestFormContainer';
import { RequestLogsContainer } from '@/containers/carRestock/requestLogsContainer';
import { ReferenceGuideListContainer } from '@/containers/referenceGuideList/referenceGuideListContainer';
import { ALL } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import FilterSearch from '../common/filterSearch/filterSearch';
import { RequestLogsFilter } from './requestLogs/requestLogsFilter';

interface props {
  segmentedMenuItems: any;
  onScreen: string;
  setScreen: (tab: string) => void;
  currentView: string;
  cartData: any;
  requestLogsFilterRef: any;
  defaultPaginationOptions: any;
  requestLogsSearchText: string;
  requestLogsfilters: any;
  onRequestLogsTableSearch: (search: string) => void;
  onApplyRequestLogs: (values: any) => void;
  onCartSearch: (values: any) => void;
  cartSearchText: string;
  onScrollCartList: () => void;
}

const { useBreakpoint } = Grid;

export const CartRestockLayout: FC<props> = ({
  segmentedMenuItems,
  onScreen,
  cartData,
  requestLogsFilterRef,
  defaultPaginationOptions,
  requestLogsSearchText,
  requestLogsfilters,
  onCartSearch,
  cartSearchText,
  onScrollCartList,
  onApplyRequestLogs,
  setScreen,
  onRequestLogsTableSearch
}) => {
  const size = useBreakpoint();
  const handleSearch = debounce(e => {
    onRequestLogsTableSearch(e.target.value);
  }, 500);

  return (
    <>
      <Row>
        <Col
          md={8}
          xs={24}
          lg={8}
          style={{
            padding: size.xs ? `${pxToRem(7)} ${pxToRem(20)}` : pxToRem(0)
          }}
        >
          <VsSegmented
            segmentedProps={{
              options: segmentedMenuItems,
              defaultValue: segmentedMenuItems[0],
              block: true,
              value: onScreen,
              onChange: (e: any) => {
                setScreen(e);
              }
            }}
          />
        </Col>
        {onScreen === 'requestLogs' && (
          <Col
            md={16}
            xs={24}
            style={{
              padding: size.xs ? `${pxToRem(0)} ${pxToRem(20)}` : pxToRem(0)
            }}
          >
            <Row justify={size.xs ? 'start' : 'end'}>
              <Col
                md={7}
                xs={22}
                style={{ paddingInlineEnd: size.xs ? pxToRem(11) : pxToRem(8) }}
              >
                <Row justify={'end'}>
                  <FilterSearch
                    style={{ maxWidth: size.xs ? pxToRem(350) : '100%' }}
                    placeholder={'Search User Name'}
                    onChange={e => handleSearch(e)}
                  />
                </Row>
              </Col>
              <Col span={size.xs ? 2 : 'auto'}>
                <DrawerFilterButton
                  isIcon={size.xs}
                  onClickApply={onApplyRequestLogs}
                  formRef={requestLogsFilterRef}
                  handleReset={() => {
                    requestLogsFilterRef.setFieldsValue({
                      fromDate: '',
                      toDate: '',
                      type: ALL,
                      cartId: ALL
                    });
                  }}
                >
                  <RequestLogsFilter
                    cart={cartData}
                    onCartSearch={onCartSearch}
                    onScroll={onScrollCartList}
                  />
                </DrawerFilterButton>
              </Col>
            </Row>
          </Col>
        )}
      </Row>

      {onScreen === 'referenceGuide' && <ReferenceGuideListContainer />}

      {onScreen === 'requestForm' && (
        <RequestFormContainer
          defaultPaginationOptions={defaultPaginationOptions}
        />
      )}

      {onScreen === 'requestLogs' && (
        <RequestLogsContainer
          filters={requestLogsfilters}
          searchhText={requestLogsSearchText}
          defaultPaginationOptions={defaultPaginationOptions}
          requestLogsFilterRef={requestLogsFilterRef}
          onApplyRequestLogs={onApplyRequestLogs}
          cartOptions={cartData}
        />
      )}
    </>
  );
};
