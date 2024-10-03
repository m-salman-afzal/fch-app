import { useCallback, useEffect, useState } from 'react';
import { Form, Typography } from 'antd';
import { icons } from 'antd/es/image/PreviewGroup';
import { SegmentedValue } from 'antd/es/segmented';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConfirm } from 'vs-design-components';

import { TCartData } from '@/types/cartTypes';
import { SelectOption, TPaginatedData, TPagination } from '@/types/commonTypes';
import {
  TShiftCountData,
  TShiftCountFilter,
  TShiftCountLogsData,
  TShiftCountSubmitForm,
  TShiftCountTabs
} from '@/types/shiftCountTypes';

import ShiftCountActions from '@/components/controlsLogbook/shiftCount/shiftCountActions';
import ShiftCountBlankCart from '@/components/controlsLogbook/shiftCount/shiftCountBlankCart';

import WARNING_ICON from '@/assets/icons/formulary/warningIcon.svg';
import { useFetch } from '@/hooks/useFetch';
import { useCommonStyles } from '@/styles/useCommonStyles';
import { ALL, DEFAULT_PAGE_SIZE, TOAST_DURATION } from '@/utils/constants';
import { getFitlerValuesAndFilterAll } from '@/utils/getFiltersValuesAndFilterAll';
import { pxToRem } from '@/utils/sharedUtils';
import ShowToast from '@/utils/showToast';
import { API_BASE_URL } from '@/utils/urls';

import { SHIFT_COUNT_TAB_NAMES, SHIFT_COUNT_TABS } from './constants';
import ShiftCountContainer from './shiftCountContainer';
import ShiftCountLogsContainer from './shiftCountLogsContainer';
import {
  CONTROL_LOGBOOK_ADMINISTER,
  SHIFT_COUNT,
  SHIFT_COUNT_LOGS
} from './urls';

const filterInitialValues = {
  fromDate: undefined,
  toDate: undefined,
  cartId: ALL
};
const ShiftCountMainContainer = () => {
  const isSmall = window.screen.width <= 576;
  const tabInUrl = useSearchParams().get('tab');
  const subTabInUrl = useSearchParams().get('subTab');
  const subTabFoundInShiftCountTabs = SHIFT_COUNT_TABS.find(
    allTab => allTab.value === subTabInUrl
  );
  const [selectedTab, setSelectedTab] = useState<TShiftCountTabs>(
    subTabInUrl && subTabFoundInShiftCountTabs
      ? subTabFoundInShiftCountTabs
      : SHIFT_COUNT_TABS[0]
  );

  const [notFound, setNotFound] = useState<boolean>(false);

  const router = useRouter();

  const { fetchData, isLoading, postData } = useFetch();

  const [cartOptions, setCartOptions] = useState<SelectOption[]>([]);

  const { confirm } = useConfirm();

  const getCarts = async () => {
    try {
      const url = `${API_BASE_URL}${CONTROL_LOGBOOK_ADMINISTER}/${SHIFT_COUNT}/getCarts`;
      const data: TCartData[] = await fetchData(url);

      if (data) {
        setCartOptions(
          data.map(row => ({
            value: row.cartId,
            label: row.cart,
            key: row.cartId
          }))
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    getCarts();
  }, []);

  const onChangeTab = (x: SegmentedValue) => {
    setSelectedTab(
      SHIFT_COUNT_TABS.find(tab => tab.value === x) as TShiftCountTabs
    );
    router.push(
      `/controlsLogbook?tab=${tabInUrl ? tabInUrl : 'shiftCount'}&subTab=${x}`
    );
    setLogFilters(filterInitialValues);
    setSelectedCart('');
    setShiftCountData([]);
    setShiftCountLogsData([]);
    setQuantites([]);
    setShowDiscrepancyError(false);
    setIsProceedEnabled(false);
    setIsToastShown(false);
  };

  const {
    deleteFamilyMemberConfirmIcon,
    deleteFamilyMemberConfirmIconContainer,
    confirmWarningIcon
  } = useCommonStyles();

  //Shift Count Tab -----------------------------------------------------
  const [search, setSearch] = useState<string>('');
  const [selectedCart, setSelectedCart] = useState<string>('');
  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [isProceedOpen, setIsProceedOpen] = useState<boolean>(false);
  const [showDiscrepancyError, setShowDiscrepancyError] =
    useState<boolean>(false);

  const shiftCountPaginationInitalValues = {
    perPage: 100,
    currentPage: 1
  };

  const [shiftCountProceedForm] = Form.useForm();

  const [shiftCountPagination, setShitfCountPagination] = useState<TPagination>(
    shiftCountPaginationInitalValues
  );

  const [shiftCountData, setShiftCountData] = useState<TShiftCountData[]>([]);
  const [quantities, setQuantites] = useState<
    {
      countedQuantity?: number;
      perpetualInventoryId: string;
      isDiscrepancyFlag: boolean;
      isError?: boolean;
    }[]
  >([]);

  const [isProceedEnabled, setIsProceedEnabled] = useState<boolean>(false);

  const getShiftCountData = async (
    selectedCart: string,
    pagination: TPagination,
    searchText: string,
    isSearchCall?: boolean
  ) => {
    try {
      setNotFound(false);
      const url = `${API_BASE_URL}${CONTROL_LOGBOOK_ADMINISTER}/${SHIFT_COUNT}`;
      const data: TPaginatedData<TShiftCountData> = await fetchData(url, {
        ...pagination,
        cartId: selectedCart,
        name: searchText
      });

      if (data.rows) {
        if (isSearchCall) {
          const errorCondition =
            quantities.length > 0 &&
            quantities.length !== pagination.totalItems;
          setShiftCountData(
            data.rows.map(row => {
              const currentData = quantities.find(
                q => q.perpetualInventoryId === row.perpetualInventoryId
              );

              return {
                ...row,
                key: row.perpetualInventoryId,
                inputQuantity: currentData?.countedQuantity,
                isError: currentData?.isError ?? errorCondition,
                isDiscrepancyFlag: currentData?.isDiscrepancyFlag
              };
            })
          );
        } else {
          const errorCondition =
            quantities.length > 0 &&
            quantities.length !== pagination.totalItems &&
            pagination.currentPage > 1;
          setShiftCountData(x => [
            ...x,
            ...data.rows.map(row => {
              const currentData = quantities.find(
                q => q.perpetualInventoryId === row.perpetualInventoryId
              );

              return {
                ...row,
                key: row.perpetualInventoryId,
                inputQuantity: currentData?.countedQuantity,
                isError: currentData?.isError ?? errorCondition,
                isDiscrepancyFlag: currentData?.isDiscrepancyFlag
              };
            })
          ]);
        }

        setShitfCountPagination({
          ...shiftCountPagination,
          ...data.paginationInfo
        });

        return;
      }

      if (isSearchCall) {
        setNotFound(true);
        setShitfCountPagination({
          perPage: 100,
          currentPage: 1
        });

        return;
      }

      setShiftCountData([]);

      setShitfCountPagination({
        perPage: 100,
        currentPage: 1
      });

      return;
    } catch (error) {}
  };

  const onLoadMoreShiftCount = async () => {
    const newPagination = {
      ...shiftCountPagination,
      currentPage: shiftCountPagination.currentPage + 1
    };

    await getShiftCountData(selectedCart, newPagination, search);
  };

  const onSelectCart = async (e: any) => {
    if (isProceedEnabled) {
      confirm({
        onOk: async () => {
          setShiftCountData([]);
          setIsProceedEnabled(false);
          setIsToastShown(false);
          setSearch('');
          setQuantites([]);
          setShowDiscrepancyError(false);
          setShitfCountPagination(scLogsPaginationInitialValues);
          await getShiftCountData(e, shiftCountPaginationInitalValues, '');
          setSelectedCart(e);
        },
        text: (
          <>
            <Typography.Paragraph
              style={{
                fontSize: pxToRem(20),
                fontWeight: 600,
                textAlign: 'center',
                marginBlockEnd: 0,
                marginBottom: pxToRem(16)
              }}
            >
              {` Are you sure you want to abandon this shift count?`}
            </Typography.Paragraph>
            <Typography.Text
              style={{
                fontSize: pxToRem(14),
                fontWeight: 400,
                color: 'rgba(0, 0, 0, 0.65)',
                marginBlockEnd: 0,
                paddingLeft: pxToRem(20),
                display: 'flow',
                marginBottom: 0
              }}
            >
              Cart:{' '}
              <strong>
                {cartOptions.find(cart => cart.value === selectedCart)?.label}
              </strong>
            </Typography.Text>
          </>
        ),
        type: 'info',
        iconBgClass: confirmWarningIcon,
        okText: 'Yes',
        cancelText: 'No',
        icon: (
          <div className={deleteFamilyMemberConfirmIconContainer}>
            <Image
              alt={'MSG'}
              src={WARNING_ICON}
              className={deleteFamilyMemberConfirmIcon}
              fill
            />
          </div>
        )
      });

      return;
    }
    setShiftCountData([]);
    setIsProceedEnabled(false);
    setShowDiscrepancyError(false);
    setIsToastShown(false);
    setQuantites([]);
    setSearch('');
    setShitfCountPagination(scLogsPaginationInitialValues);
    await getShiftCountData(e, shiftCountPaginationInitalValues, '');
    setSelectedCart(e);
  };

  const debounceSearch = useCallback(
    debounce(search => {
      getShiftCountData(
        selectedCart,
        shiftCountPaginationInitalValues,
        search,
        true
      );
    }, 500),
    [shiftCountPagination, selectedCart, quantities]
  );

  const onSearch = (search: any) => {
    setSearch(search.target.value);
    debounceSearch(search.target.value);
  };

  const showToastIfAllDrugsNotLoaded = () => {
    if (shiftCountData.length !== shiftCountPagination.totalItems) {
      ShowToast(
        search
          ? 'Additional drugs in the cart require a count, please clear your search to see more'
          : 'Additional drugs in the cart require a count, please scroll down to see more',
        'error',
        TOAST_DURATION
      );

      return true;
    }
  };

  const onChangeNumberInputInTable = (
    shiftCountId: string,
    value: number = 0
  ) => {
    setIsProceedEnabled(!isNaN(value));
    let filteredData = structuredClone(
      shiftCountData.filter(sc => sc.perpetualInventoryId !== shiftCountId)
    );

    const selectedData = shiftCountData.find(
      sc => sc.perpetualInventoryId === shiftCountId
    );

    const index = shiftCountData.findIndex(
      sc => sc.perpetualInventoryId === shiftCountId
    );

    if (selectedData) {
      filteredData.splice(index, 0, {
        ...selectedData,
        inputQuantity: value,
        isError: false,
        isDiscrepancyFlag: !!selectedData.isDiscrepancyFlag && !isNaN(value)
      });

      setShiftCountData(filteredData);
      let quantityFiltered = structuredClone(
        quantities.filter(q => q.perpetualInventoryId !== shiftCountId)
      );

      quantityFiltered.splice(index, 0, {
        countedQuantity: value,
        isError: false,
        perpetualInventoryId: shiftCountId,
        isDiscrepancyFlag: !!selectedData.isDiscrepancyFlag
      });

      setQuantites(quantityFiltered);
    }
  };

  const onClickProceed = () => {
    const errorMapped = structuredClone(shiftCountData).map(sc => {
      const isDiscrepancy =
        !isNaN(sc.inputQuantity as number) &&
        sc.quantityAllocated !== sc.inputQuantity;

      return {
        ...sc,
        isError:
          isNaN(sc.inputQuantity as number) || (!isToastShown && isDiscrepancy),
        isDiscrepancyFlag: isDiscrepancy,
        inputQuantity:
          !isToastShown && isDiscrepancy ? undefined : sc.inputQuantity
      };
    });

    const foundDiscrepancy = !!errorMapped.find(sc => sc.isDiscrepancyFlag);

    if (foundDiscrepancy) {
      setShiftCountData(errorMapped);
      setQuantites(q =>
        q.map(err => {
          const isDiscrepancy = !!errorMapped.find(
            e => e.perpetualInventoryId === err.perpetualInventoryId
          )?.isDiscrepancyFlag;

          return {
            perpetualInventoryId: err.perpetualInventoryId,
            isDiscrepancyFlag: isDiscrepancy,
            isError:
              isNaN(err.countedQuantity as number) ||
              (!isToastShown && isDiscrepancy),
            countedQuantity:
              !isToastShown && isDiscrepancy ? undefined : err.countedQuantity
          };
        })
      );
      setShowDiscrepancyError(true);
      showToastIfAllDrugsNotLoaded();

      if (!isToastShown) {
        ShowToast(
          'Red flag indicates inaccurate count, please recount',
          'error',
          TOAST_DURATION
        );

        setIsProceedEnabled(false);

        setIsToastShown(true);

        return;
      }
    }

    if (errorMapped.find(sc => sc.isError)) {
      setShiftCountData(errorMapped);
      setQuantites(q =>
        q.map(err => {
          const item = errorMapped.find(
            e => e.perpetualInventoryId === err.perpetualInventoryId
          );

          return {
            perpetualInventoryId: err.perpetualInventoryId,
            isDiscrepancyFlag: !!item?.isDiscrepancyFlag,
            isError: isNaN(item?.inputQuantity as number),
            countedQuantity: item?.inputQuantity
          };
        })
      );
      showToastIfAllDrugsNotLoaded();

      return;
    }

    if (showToastIfAllDrugsNotLoaded()) {
      return;
    }

    if (!foundDiscrepancy) {
      setShowDiscrepancyError(false);
    }

    setIsProceedOpen(true);

    return;
  };

  const onCloseProcessModal = () => {
    setIsProceedOpen(false);
    shiftCountProceedForm.resetFields();
  };

  const onSubmitShiftCountProceed = async (values: TShiftCountSubmitForm) => {
    try {
      const url = `${API_BASE_URL}${CONTROL_LOGBOOK_ADMINISTER}/${SHIFT_COUNT_LOGS}`;
      const data: any = await postData(url, {
        ...values,
        cartId: selectedCart,
        isDiscrepancy: showDiscrepancyError,
        shiftCountLogDrugs: shiftCountData.map(sc => ({
          ...sc,
          countedQuantity: sc.inputQuantity,
          quantityOnHand: sc.quantityAllocated,
          tr: sc.tr ? sc.tr : undefined,
          rx: sc.rx ? sc.rx : undefined,
          perpetualInventoryId:
            sc.quantityAllocated !== sc.inputQuantity
              ? sc.perpetualInventoryId
              : undefined
        }))
      });

      if (data.status === 'success') {
        onCloseProcessModal();
        setSelectedCart('');
        setShiftCountData([]);
        getCarts();
        setSearch('');
        setShowDiscrepancyError(false);
        setShitfCountPagination(shiftCountPaginationInitalValues);
        setIsProceedEnabled(false);
        setIsToastShown(false);
        setQuantites([]);

        return;
      }

      return;
    } catch (error) {}
  };

  //----------------------------------------------------------------------

  //Shitf Count Logs Tab -------------------------------------------------

  const scLogsPaginationInitialValues = {
    currentPage: 1,
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  };

  const [shiftCountLogsForm] = Form.useForm<TShiftCountFilter>();
  const [logFilters, setLogFilters] =
    useState<TShiftCountFilter>(filterInitialValues);

  const [scLogspagination, setScLogsPagination] = useState<TPagination>(
    scLogsPaginationInitialValues
  );

  const [shiftCountLogsData, setShiftCountLogsData] = useState<
    TShiftCountLogsData[]
  >([]);

  const getShiftCountLogsData = async (
    pagination: TPagination,
    filters: TShiftCountFilter
  ) => {
    try {
      const url = `${API_BASE_URL}${CONTROL_LOGBOOK_ADMINISTER}/${SHIFT_COUNT_LOGS}`;
      const data: TPaginatedData<TShiftCountLogsData> = await fetchData(url, {
        ...pagination,
        ...getFitlerValuesAndFilterAll(filters)
      });

      if (data.rows) {
        setShiftCountLogsData(
          data.rows.map(row => ({ ...row, key: row.shiftCountLogId }))
        );

        setScLogsPagination(data.paginationInfo);

        return;
      }

      setShiftCountLogsData([]);

      setScLogsPagination(scLogsPaginationInitialValues);

      return;
    } catch (error) {}
  };

  const onChangeScLogsPagination = async (page: number, pageSize: number) => {
    const newPagination: TPagination = {
      ...scLogspagination,
      perPage: pageSize,
      currentPage: page
    };
    await getShiftCountLogsData(newPagination, logFilters);
    setScLogsPagination(newPagination);
  };

  const onClickApplyScLogsFilters = async (value: TShiftCountFilter) => {
    setLogFilters(value);
    await getShiftCountLogsData(
      { ...scLogsPaginationInitialValues, currentPage: 1 },
      value
    );
  };

  const onResetScLogsFilter = () => {
    const newFilters = {
      cartId: ALL,
      fromDate: '',
      toDate: ''
    };

    shiftCountLogsForm.setFieldsValue(newFilters);
  };

  //----------------------------------------------------------------------

  const hideIfTabShiftCountAndNoCartSelected =
    !selectedCart && selectedTab.label === SHIFT_COUNT_TAB_NAMES.SHIFT_COUNT;

  return (
    <>
      <ShiftCountActions
        onSearch={onSearch}
        onClickProceed={onClickProceed}
        cartsData={cartOptions}
        onSelectCart={onSelectCart}
        selectedTab={selectedTab}
        selectedCart={selectedCart}
        isProceedEnabled={isProceedEnabled}
        shiftCountSubmitForm={shiftCountProceedForm}
        isLoading={isLoading}
        onChangeTab={onChangeTab}
        onShiftCountLogsFilterReset={onResetScLogsFilter}
        onApplyShiftCountLogsFilterForm={onClickApplyScLogsFilters}
        scLogsFilterForm={shiftCountLogsForm}
        onCloseProcessModal={onCloseProcessModal}
        onClickSubmitProcess={onSubmitShiftCountProceed}
        showDiscrepancyError={showDiscrepancyError}
        isProceedOpen={isProceedOpen}
        searchText={search}
      />

      {selectedTab.label === SHIFT_COUNT_TAB_NAMES.SHIFT_COUNT &&
        !hideIfTabShiftCountAndNoCartSelected && (
          <ShiftCountContainer
            form={shiftCountProceedForm}
            pagination={shiftCountPagination}
            selectedCart={
              cartOptions.find(cart => cart.value === selectedCart)
                ?.label as string
            }
            onLoadMore={onLoadMoreShiftCount}
            isLoading={isLoading}
            shiftCountData={notFound ? [] : shiftCountData}
            onChangeNumberInput={onChangeNumberInputInTable}
            searchText={search}
            quantities={quantities}
          />
        )}

      {hideIfTabShiftCountAndNoCartSelected && (
        <ShiftCountBlankCart
          cartOptions={cartOptions}
          isLoading={isLoading}
          onSelectCart={onSelectCart}
        />
      )}

      {selectedTab.label === SHIFT_COUNT_TAB_NAMES.LOGS && (
        <ShiftCountLogsContainer
          form={shiftCountLogsForm}
          filterState={logFilters}
          onChangeFilters={onClickApplyScLogsFilters}
          getShiftCountLogsData={getShiftCountLogsData}
          onChangePagination={onChangeScLogsPagination}
          shiftCountLogsData={shiftCountLogsData}
          pagination={scLogspagination}
          cartOptions={cartOptions}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default ShiftCountMainContainer;
