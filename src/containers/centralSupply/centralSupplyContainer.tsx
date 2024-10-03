import React, { useCallback, useEffect, useState } from 'react';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Form, Row, Typography } from 'antd';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import debounce from 'lodash.debounce';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DrawerFilterButton,
  FilterSearch,
  VsButton,
  VsFormItem,
  VsSegmented
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import {
  TCentralSupplyFilters,
  TOrderedUnits
} from '@/types/centralSupplyTypes';

import { CentralSupplyLogsFilters } from '@/components/centralSupply/centralSupplyLogs/centralSupplyLogsFilters';
import { RxOrdersFilters } from '@/components/centralSupply/rxOrders/rxOrdersFilters';
import FilterTags from '@/components/common/filterTags/filterTags';

import useCookies from '@/hooks/useCookies';
import { useFacility } from '@/hooks/useFacility';
import { useFetch } from '@/hooks/useFetch';
import {
  ALL,
  ALL_OPTION,
  ANONYMOUS_OPTION,
  CENTRAL_SUPPLY_HEADERS,
  PERMISSIONS_TYPES
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import {
  centralSupplyOrderedUnitsUrl,
  downloadCentralSupplyLogsUrl
} from '@/utils/endpoints';
import { pxToRem } from '@/utils/sharedUtils';

import { CentralSupplyLogsContainer } from './centralSupplyLogsContainer';
import { RxOrdersContainer } from './rxOrdersContainer';

const resetValuesCentralSupplyFilter = {
  isFormulary: ALL,
  isControlled: ALL,
  fromDate: undefined,
  toDate: undefined,
  orderedQuantityMin: undefined,
  orderedQuantityMax: undefined,
  isDepleted: ALL
};
export const CentralSupplyContainer = () => {
  const tabInUrl = useSearchParams().get('tab');
  const router = useRouter();
  const { getDataFromCookie } = useCookies();
  const [filtersFormRef] = Form.useForm();
  const [searchFormRef] = Form.useForm();
  const tabOptions = [
    { label: 'Rx Orders', value: 'rxOrders', key: 'rxOrders' },
    { label: 'Logs', value: 'logs', key: 'logs' }
  ];
  const [onScreen, setOnScreen] = useState<string>(
    tabInUrl ? tabInUrl : 'rxOrders'
  );
  const isSmall = window.screen.width <= 576;
  const [isSearching, setSearching] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [searchFilters, setSearchFilters] = useState<TCentralSupplyFilters>(
    !tabInUrl || tabInUrl === tabOptions[0]?.value
      ? {
          isFormulary: 'true'
        }
      : {}
  );
  const [orderedUnits, setOrderedUnits] = useState<TOrderedUnits>({
    orderedQuantityMin: 0,
    orderedQuantityMax: 0,
    calculatedOrderedQuantityMin: 0,
    calculatedOrderedQuantityMax: 0
  });
  const [reviewOrderButtonDisabled, setReviewOrderButtonDisabled] =
    useState<boolean>(true);
  const { currentFacility } = useFacility();

  const downloadCentralSupplyCsvConfig = mkConfig({
    columnHeaders: CENTRAL_SUPPLY_HEADERS,
    fieldSeparator: ',',
    filename: `CentralSupply - ${currentFacility.facilityName} - ${getFormattedDateNoTimeZone({ format: DATE_FORMATS.FILE_DATE })}`
  });

  const isControlledAvailable =
    getDataFromCookie()?.rbac.formularyNonControlled !==
      PERMISSIONS_TYPES.HIDE &&
    getDataFromCookie()?.rbac.formularyControlled !== PERMISSIONS_TYPES.HIDE;

  const { fetchData } = useFetch();

  const blurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };

  const setSearch = useCallback(
    debounce(val => {
      setSearchValue(val?.target?.value);
    }, 500),
    []
  );

  const getOrderedUnitsRange = async () => {
    const res = await fetchData(centralSupplyOrderedUnitsUrl());
    if (res?.status === 'error') {
      return;
    }
    setOrderedUnits(res);
  };

  useEffect(() => {
    getOrderedUnitsRange();
  }, []);

  const onChangeScreen = async (screen: string) => {
    searchFormRef.resetFields();
    filtersFormRef.resetFields();
    setSearchValue('');
    setSearchFilters(screen === 'rxOrders' ? { isFormulary: 'true' } : {});
    isSmall && setSearching(false);
    setOnScreen(screen);
    router?.push(`/centralSupply?tab=${screen}`);
    await getOrderedUnitsRange();
    setShowReviewModal(false);
    setReviewOrderButtonDisabled(true);
  };

  const onClickReviewOrder = () => {
    setShowReviewModal(!showReviewModal);
  };

  const onSubmitFilters = async (data: any) => {
    setSearchFilters(data);
  };

  const handleResetFilters = () => {
    filtersFormRef.resetFields();
  };

  const getMinMaxComparisonForTags = (isMin?: boolean) => {
    if (isMin) {
      return onScreen === tabOptions[0]?.value
        ? orderedUnits.calculatedOrderedQuantityMin
        : orderedUnits.orderedQuantityMin;
    }

    return onScreen === tabOptions[0]?.value
      ? orderedUnits.calculatedOrderedQuantityMax
      : orderedUnits.orderedQuantityMax;
  };

  const downloadCentralSupplyCsv = async () => {
    const res = await fetchData(downloadCentralSupplyLogsUrl());
    if (res) {
      const fileContent = res.length ? res : [];
      const csv = generateCsv(downloadCentralSupplyCsvConfig)(fileContent);

      download(downloadCentralSupplyCsvConfig)(csv);

      return;
    }
  };

  return (
    <>
      <Row
        justify={`space-between`}
        style={{ paddingInline: isSmall ? pxToRem(20) : pxToRem(0) }}
        gutter={[0, 16]}
      >
        {isSmall && (
          <Col
            span={24}
            style={{
              fontSize: pxToRem(16),
              fontWeight: 600
            }}
          >
            <Typography.Text>Central Supply</Typography.Text>
          </Col>
        )}
        <Col md={8} xs={18} lg={6}>
          <VsSegmented
            segmentedProps={{
              options: tabOptions,
              defaultValue: tabOptions[0]?.value,
              block: true,
              value: onScreen,
              onChange: (screen: any) => onChangeScreen(screen)
            }}
          />
        </Col>
        <Col
          style={
            isSmall
              ? {
                  display: 'flex',
                  justifyContent: isSearching && isSmall ? 'start' : 'end',
                  alignItems: 'center'
                }
              : {}
          }
        >
          <Row style={{ gap: isSmall ? pxToRem(8) : pxToRem(8) }}>
            {isSmall && !isSearching ? (
              <VsButton
                onClick={() => {
                  setSearching(true);
                }}
                size={BUTTON_SIZES.squareIcon}
              >
                <SearchOutlined />
              </VsButton>
            ) : (
              <Form form={searchFormRef}>
                <VsFormItem
                  formItemProps={{
                    name: 'textValue',
                    required: false,
                    style: { marginBottom: 0 }
                  }}
                >
                  <FilterSearch
                    placeholder="Search"
                    autoFocus={isSmall ? true : false}
                    onChange={setSearch}
                    onBlur={blurSearch}
                    width={
                      window.innerWidth >= 1920 ? pxToRem(254) : pxToRem(182)
                    }
                  />
                </VsFormItem>
              </Form>
            )}
            <DrawerFilterButton
              isIcon={isSmall}
              handleReset={handleResetFilters}
              onClickApply={onSubmitFilters}
              formRef={filtersFormRef}
            >
              {onScreen === tabOptions[0]?.value ? (
                <RxOrdersFilters
                  orderedUnits={orderedUnits}
                  isControlledAvailable={isControlledAvailable}
                />
              ) : (
                <CentralSupplyLogsFilters orderedUnits={orderedUnits} />
              )}
            </DrawerFilterButton>

            {onScreen === tabOptions[0]?.value && (
              <VsButton
                size={isSmall ? BUTTON_SIZES.squareIcon : BUTTON_SIZES.middle}
                onClick={() => downloadCentralSupplyCsv()}
              >
                <DownloadOutlined
                  style={{
                    fontSize: pxToRem(14)
                  }}
                />
                {isSmall ? undefined : 'Download'}
              </VsButton>
            )}
            {onScreen === tabOptions[0]?.value &&
              getDataFromCookie()?.rbac?.inventory ===
                PERMISSIONS_TYPES.WRITE && (
                <VsButton
                  size={BUTTON_SIZES.middle}
                  onClick={onClickReviewOrder}
                  antButtonProps={{
                    type: 'primary',
                    disabled: reviewOrderButtonDisabled
                  }}
                >
                  Review Order
                </VsButton>
              )}
          </Row>
        </Col>
      </Row>

      <FilterTags<TCentralSupplyFilters>
        filterForm={filtersFormRef}
        filterState={searchFilters}
        filterInitialValues={{
          ...resetValuesCentralSupplyFilter,
          orderedQuantityMin: getMinMaxComparisonForTags(true),
          orderedQuantityMax: getMinMaxComparisonForTags()
        }}
        onChangeFilters={onSubmitFilters}
        customKeys={{
          isFormulary: 'Formulary',
          isControlled: 'Controlled',
          isDepleted: 'Depleted',
          fromDate: 'From',
          toDate: 'To',
          orderedQuantityMin:
            onScreen === tabOptions[0]?.value
              ? 'Qty Order Min'
              : 'Ordered Units Min',
          orderedQuantityMax:
            onScreen === tabOptions[0]?.value
              ? 'Qty Order Max'
              : 'Ordered Units Max'
        }}
        customMapForSelect={{
          isFormulary: [ALL_OPTION, ...ANONYMOUS_OPTION],
          isControlled: [ALL_OPTION, ...ANONYMOUS_OPTION],
          isDepleted: [ALL_OPTION, ...ANONYMOUS_OPTION]
        }}
        marginBottom={pxToRem(-16)}
        marginTop={pxToRem(16)}
        excludeKeys={{
          orderedUnits: true,
          orderedQuantity: true,
          orderedQuantityMin:
            searchFilters.orderedQuantityMin ===
            getMinMaxComparisonForTags(true),
          orderedQuantityMax:
            searchFilters.orderedQuantityMax === getMinMaxComparisonForTags()
        }}
        rangeKeys={{
          orderedQuantity: ['orderedQuantityMin', 'orderedQuantityMax']
        }}
      />
      {onScreen === tabOptions[0]?.value ? (
        <RxOrdersContainer
          searchValue={searchValue}
          showReviewModal={showReviewModal}
          searchFilters={searchFilters}
          onCancelReviewModal={onClickReviewOrder}
          setReviewOrderButtonDisabled={setReviewOrderButtonDisabled}
          onChangeScreen={onChangeScreen}
        />
      ) : (
        <CentralSupplyLogsContainer
          searchValue={searchValue}
          searchFilters={searchFilters}
        />
      )}
    </>
  );
};
