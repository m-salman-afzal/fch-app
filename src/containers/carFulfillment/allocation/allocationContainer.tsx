'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { Form, Typography } from 'antd';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConfirm } from 'vs-design-components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import {
  TAllocationFilters,
  TCartAllocation,
  TCartAllocationControlledForm,
  TCartFilterPaginatedData
} from '@/types/cartFulfillmentTypes';
import { SelectOption, TPagination } from '@/types/commonTypes';

import { AllocationLayout } from '@/components/cartFulfillment/allocation/allocationLayout';
import { AllocationTable } from '@/components/cartFulfillment/allocation/allocationTableLayout';
import { getAllocationColumns } from '@/components/cartFulfillment/allocation/getAllocationTableColumns';
import FilterTags from '@/components/common/filterTags/filterTags';
import { useFormularyStyle } from '@/components/formulary/useFormularyStyle';

import INFO_ICON from '@/assets/icons/cartFullfillment/pick/infoIcon.svg';
import DELETEICON from '@/assets/icons/common/deleteModal.svg';
import WARNING_ICON from '@/assets/icons/formulary/warningIcon.svg';
import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import useSelectPagination from '@/hooks/useSelectPagination';
import { useCommonStyles } from '@/styles/useCommonStyles';
import { ALL, DEFAULT_PAGE_SIZE, PERMISSIONS_TYPES } from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInUTC
} from '@/utils/dateFormatsTimezones';
import { API_BASE_URL, CART_REQUEST_DRUGS_URL } from '@/utils/urls';

import {
  ALLOCATION_STATUS_BACKEND,
  ALLOCATION_TABS,
  PICK_STATUS_BACKEND
} from '../constants';
import { InitialAllocationContainer } from './initialAllocationContainer';

interface Props {
  selectedScreen: string;
}

const filterInitialValues = {
  toDate: undefined,
  fromDate: undefined,
  cartId: undefined,
  allocatedByAdminId: undefined,
  adminId: undefined
};

export const AllocationContainer: FC<Props> = ({ selectedScreen }) => {
  const { controllConfirmWarningIcon } = useFormularyStyle();
  const isSmall = window.screen.width <= 576;
  const tabInUrl = useSearchParams().get('tab');
  const subTabInUrl = useSearchParams().get('subTab');
  const subTabFoundInAllocationTabs = ALLOCATION_TABS.find(
    allTab => allTab.value === subTabInUrl
  );
  const router = useRouter();
  const admin = useCookies().getDataFromCookie();
  const permission = admin.rbac.cartRequestDrugs;

  const [selectedTab, setSelectedTab] = useState(
    subTabInUrl && subTabFoundInAllocationTabs
      ? subTabInUrl
      : (ALLOCATION_TABS[0]?.value as string)
  );
  const { fetchData, updateData, isLoading, deleteData } = useFetch();

  const { fetchData: cartFilterFetcher, isLoading: cartFilterLoading } =
    useFetch();

  const { confirm } = useConfirm();
  const {
    deleteFamilyMemberConfirmIcon,
    deleteFamilyMemberConfirmIconContainer
  } = useCommonStyles();

  const [filterForm] = Form.useForm();
  const [controlledFulfillForm] = Form.useForm();
  const paginationInitialValues = {
    currentPage: 1,
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  };
  const paginationInitialValuesNonControlled = {
    currentPage: 1,
    perPage: DEFAULT_PAGE_SIZE.SELECTOR
  };
  const [pagination, setPagination] = useState<TPagination | undefined>(
    selectedTab === ALLOCATION_TABS[1]?.value
      ? paginationInitialValues
      : paginationInitialValuesNonControlled
  );
  const [search, setSearch] = useState<string>('');

  const [selectedAllocationKeys, setSelectedAllocationKeys] = useState<
    React.Key[]
  >([]);

  const [allocationSelectedData, setAllocationSelectedData] = useState<
    TCartAllocation[]
  >([]);
  const [isFulfilled, setIsFulfilled] = useState<boolean>(false);

  const [allocationData, setAllocationData] = useState<TCartAllocation[]>([]);

  const [filters, setFilters] =
    useState<TAllocationFilters>(filterInitialValues);

  const onChangeAllocationSubTab = (changedScreen: string) => {
    setSelectedTab(changedScreen);
    router.push(
      `cartFulfillment?tab=${tabInUrl ? tabInUrl : 'allocation'}&subTab=${changedScreen}`
    );
  };

  const onSubmitFiltersForm = async (values: TAllocationFilters) => {
    setFilters(values);
    await getData(pagination, search, values);
  };

  const onResetFiltersForm = async () => {
    const tempFilters = {
      toDate: '',
      fromDate: '',
      cartId: ALL,
      allocatedByAdminId: ALL,
      adminId: ALL
    };
    filterForm.setFieldsValue(tempFilters);
  };

  const getCartFilterOptions = async (
    pagination: TPagination,
    search?: string
  ) => {
    try {
      const url = `${API_BASE_URL}${CART_REQUEST_DRUGS_URL}allCarts`;

      const response: TCartFilterPaginatedData = await cartFilterFetcher(url, {
        ...pagination,
        cart: search
      });

      if (response.rows.length > 0) {
        return {
          ...response,
          rows: response.rows.map(row => ({
            label: row.cart,
            value: row.cartId,
            key: row.cartId
          }))
        };
      }

      return {
        paginationInfo: pagination,
        rows: []
      };
    } catch (e) {
      return {
        paginationInfo: pagination,
        rows: []
      };
    }
  };

  const [adminFilterOptions, setAdminFilterOptions] = useState<{
    fulfilledByAdmins: SelectOption[];
    orderedByAdmins: SelectOption[];
  }>({
    fulfilledByAdmins: [],
    orderedByAdmins: []
  });

  const getAdminData = async () => {
    try {
      const url = `${API_BASE_URL}${CART_REQUEST_DRUGS_URL}getAdmins`;

      const response = await fetchData(url);

      if (response) {
        setAdminFilterOptions({
          fulfilledByAdmins: response.fulfilledByAdmins.map((admin: any) => ({
            key: admin.adminId,
            value: admin.adminId,
            label: `${admin.lastName}, ${admin.firstName}`
          })),
          orderedByAdmins: response.orderedByAdmins.map((admin: any) => ({
            key: admin.adminId,
            value: admin.adminId,
            label: `${admin.lastName}, ${admin.firstName}`
          }))
        });

        return;
      }

      setAdminFilterOptions({
        fulfilledByAdmins: [],
        orderedByAdmins: []
      });

      return;
    } catch (e) {
      setAdminFilterOptions({
        fulfilledByAdmins: [],
        orderedByAdmins: []
      });
    }
  };

  const getData = async (
    pagination: TPagination | undefined,
    search: string,
    filters: TAllocationFilters
  ) => {
    try {
      const url = `${API_BASE_URL}${CART_REQUEST_DRUGS_URL}allocations`;

      const response = await fetchData(url, {
        pickStatus: PICK_STATUS_BACKEND.PROCESSED,
        ...pagination,
        allocationStatus: isFulfilled
          ? ALLOCATION_STATUS_BACKEND.FULFILLED
          : ALLOCATION_STATUS_BACKEND.UNFULFILLED,
        type: isFulfilled ? 'ALLOCATION' : undefined,
        isControlled: selectedTab === ALLOCATION_TABS[1]?.value,
        name: search,
        fromDate: filters.fromDate
          ? getFormattedDateInUTC({
              date: filters.fromDate,
              format: DATE_FORMATS.YMD
            })
          : undefined,
        toDate: filters.toDate
          ? getFormattedDateInUTC({
              date: filters.toDate,
              format: DATE_FORMATS.YMD
            })
          : undefined,
        cartId: filters.cartId === ALL ? undefined : filters.cartId,
        allocatedByAdminId:
          filters.allocatedByAdminId === ALL
            ? undefined
            : filters.allocatedByAdminId,
        adminId: filters.adminId === ALL ? undefined : filters.adminId
      });

      if (response.rows.length > 0) {
        setAllocationData(
          response.rows.map((row: any) => ({
            ...row,
            key: row.cartRequestDrugId
          }))
        );

        setPagination({ ...pagination, ...response.paginationInfo });

        return;
      }
      setAllocationData([]);
      setPagination(undefined);

      return;
    } catch (e) {
      setAllocationData([]);
      setPagination(undefined);
    }
  };

  useEffect(() => {
    getAdminData();
  }, []);

  useEffect(() => {
    setSearch('');
    onResetFiltersForm();
    setFilters({
      toDate: undefined,
      fromDate: undefined,
      cartId: undefined,
      allocatedByAdminId: undefined,
      adminId: undefined
    });
    getData(
      selectedTab === ALLOCATION_TABS[1].value
        ? paginationInitialValues
        : paginationInitialValuesNonControlled,
      '',
      {}
    );
    onClickClear();
  }, [selectedTab, isFulfilled]);

  useEffect(() => {
    setIsFulfilled(false);
  }, [selectedTab]);

  const onChangePagination = async (pageNumber: number, pageSize: number) => {
    const newPaginatedData = {
      ...pagination,
      currentPage: pageNumber,
      perPage: pageSize
    };
    await getData(newPaginatedData, search, filters);
    setPagination(newPaginatedData);
  };

  const onSelectAllocationCheckbox = (
    record: TCartAllocation,
    selected: boolean,
    selectedRows: TCartAllocation[],
    nativeEvent: any
  ) => {
    setSelectedAllocationKeys(selected => {
      const currentTableDataSet = new Set(
        allocationData.map(data => data.cartRequestDrugId)
      );

      for (const sel of selected) {
        if (currentTableDataSet.has(sel as string)) {
          return [...selectedRows.map((row: any) => row.key)];
        }
      }

      return [...selected, ...selectedRows.map((row: any) => row.key)];
    });
    setAllocationSelectedData(selected => {
      const currentTableDataSet = new Set(
        allocationData.map(data => data.cartRequestDrugId)
      );

      for (const sel of selected) {
        if (currentTableDataSet.has(sel.cartRequestDrugId as string)) {
          return selectedRows;
        }
      }

      return [...selected, ...selectedRows];
    });
  };

  const onSelectAllocationAll = (
    selected: boolean,
    selectedRows: TCartAllocation[],
    changeRows: TCartAllocation[]
  ) => {
    setSelectedAllocationKeys(selected => {
      const currentTableDataSet = new Set(
        allocationData.map(data => data.cartRequestDrugId)
      );

      for (const sel of selected) {
        if (currentTableDataSet.has(sel as string)) {
          return [...selectedRows.map((row: any) => row.key)];
        }
      }

      return [...selected, ...selectedRows.map((row: any) => row.key)];
    });
    setAllocationSelectedData(selected => {
      const currentTableDataSet = new Set(
        allocationData.map(data => data.cartRequestDrugId)
      );

      for (const sel of selected) {
        if (currentTableDataSet.has(sel.cartRequestDrugId as string)) {
          return selectedRows;
        }
      }

      return [...selected, ...selectedRows];
    });
  };

  const onClickClear = () => {
    setSelectedAllocationKeys([]);
    setAllocationSelectedData([]);
  };

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
    debounceSearch(e.target.value);
  };

  const debounceSearch = useCallback(
    debounce(search => {
      getData(pagination, search, filters);
    }, 500),
    [selectedTab, isFulfilled, filters]
  );

  const onCloseFulfillModal = () => {
    controlledFulfillForm.resetFields();
  };

  const onClickFulfillmentUndo = (values: TCartAllocation) => {
    confirm({
      iconBgClass: controllConfirmWarningIcon,
      onOk: async () => {
        try {
          const url = `${API_BASE_URL}${CART_REQUEST_DRUGS_URL}allocations`;
          const response = await updateData(url, {
            cartRequestDrugId: [values.cartRequestDrugId],
            allocationStatus: ALLOCATION_STATUS_BACKEND.UNFULFILLED,
            type: 'ALLOCATION',
            undo: true
          });

          await getData(pagination, search, filters);
        } catch (e) {}
      },
      text: (
        <>
          <Typography.Paragraph
            style={{
              fontSize: pxToRem(20),
              width: pxToRem(277),
              fontWeight: 600,
              textAlign: 'center',
              marginBlockEnd: 0,
              marginBottom: pxToRem(16)
            }}
          >
            Are you sure you want to undo the allocation of this drug?
          </Typography.Paragraph>
          <Typography.Text
            style={{
              fontSize: pxToRem(14),
              fontWeight: 400,
              color: 'rgba(0, 0, 0, 0.65)',
              marginBlockEnd: 0,
              marginLeft: pxToRem(5),
              display: 'flow',
              marginBottom: 0
            }}
          >
            {`${values?.formulary?.name}`}
          </Typography.Text>
        </>
      ),
      type: `info`,
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
  };

  const onClickDelete = () => {
    confirm({
      onOk: async () => {
        try {
          const url = `${API_BASE_URL}${CART_REQUEST_DRUGS_URL}`;
          const response = await deleteData(url, {
            cartRequestDrugId: allocationSelectedData.map(
              data => data.cartRequestDrugId
            )
          });
          setSelectedAllocationKeys([]);
          setAllocationSelectedData([]);
          await getData(pagination, search, filters);
        } catch (e) {}
      },
      text: (
        <Typography.Paragraph
          style={{
            fontSize: pxToRem(20),
            width: pxToRem(277),
            fontWeight: 600,
            textAlign: 'center',
            marginBlockEnd: 0
          }}
        >
          Are you sure you want to delete the selected drugs from the list?
        </Typography.Paragraph>
      ),
      type: `destructive`,
      okText: 'Yes',
      cancelText: 'No',
      icon: (
        <div className={deleteFamilyMemberConfirmIconContainer}>
          <Image
            alt={'MSG'}
            src={DELETEICON}
            className={deleteFamilyMemberConfirmIcon}
            fill
          />
        </div>
      )
    });
  };

  const columns = getAllocationColumns(
    isFulfilled,
    onClickFulfillmentUndo,
    permission === PERMISSIONS_TYPES.WRITE
  );

  const onFulfillNonControlled = async () => {
    try {
      const url = `${API_BASE_URL}${CART_REQUEST_DRUGS_URL}allocations`;
      const ids = allocationSelectedData.map(data => data.cartRequestDrugId);
      const response = await updateData(url, {
        cartRequestDrugId: ids,
        allocationStatus: ALLOCATION_STATUS_BACKEND.FULFILLED,
        type: 'ALLOCATION'
      });

      onClickClear();

      await getData(pagination, search, filters);
    } catch (e) {}
  };

  const onFulfillControlled = async (values: TCartAllocationControlledForm) => {
    try {
      const url = `${API_BASE_URL}${CART_REQUEST_DRUGS_URL}allocations`;
      const response = await updateData(url, {
        ...values,
        witnessSignatureImage: undefined,
        receiverSignatureImage: undefined,
        signatureImages: {
          witnessSignatureImage: values.witnessSignatureImage,
          receiverSignatureImage: values.receiverSignatureImage
        },
        allocationStatus: ALLOCATION_STATUS_BACKEND.FULFILLED,
        type: 'ALLOCATION',
        pickStatus: PICK_STATUS_BACKEND.PROCESSED
      });
      controlledFulfillForm.resetFields();
      onClickClear();
      await getData(pagination, search, filters);
    } catch (e) {}
  };

  const selectWithPagination = useSelectPagination(getCartFilterOptions);

  return (
    <div>
      <AllocationLayout
        setSelectedTab={onChangeAllocationSubTab}
        selectedTab={selectedTab}
        allocationSelectedData={allocationSelectedData}
        onClickClear={onClickClear}
        filterForm={filterForm}
        setIsFulfilled={setIsFulfilled}
        controlledFulfillForm={controlledFulfillForm}
        onCloseFulfillModal={onCloseFulfillModal}
        isFulfilled={isFulfilled}
        onClickDelete={onClickDelete}
        onFulfillNonControlled={onFulfillNonControlled}
        onFulfillControlled={onFulfillControlled}
        isLoading={isLoading}
        onSearch={handleSearch}
        onSubmitFiltersForm={onSubmitFiltersForm}
        onResetFiltersForm={onResetFiltersForm}
        adminFilterOptions={adminFilterOptions}
        selectWithPagination={selectWithPagination}
        search={search}
      >
        <FilterTags<TAllocationFilters>
          filterForm={filterForm}
          filterState={filters}
          filterInitialValues={filterInitialValues}
          onChangeFilters={onSubmitFiltersForm}
          marginTop={pxToRem(12)}
          customKeys={{
            cartId: 'Cart',
            fromDate: 'Request From',
            toDate: 'Reqeust To',
            adminId: 'Ordered By',
            allocatedByAdminId: 'Fulfilled By'
          }}
          customMapForSelect={{
            cartId: selectWithPagination.options,
            adminId: adminFilterOptions.orderedByAdmins,
            allocatedByAdminId: adminFilterOptions.fulfilledByAdmins
          }}
        />
        {selectedTab !== (ALLOCATION_TABS[2]?.value as string) && (
          <AllocationTable
            selectedTab={selectedTab}
            isFulfilled={isFulfilled}
            tableColumns={columns}
            tableData={allocationData}
            pagination={pagination}
            onChangePagination={onChangePagination}
            isLoading={isLoading}
            selectedRowKeys={selectedAllocationKeys}
            onSelectCheckbox={onSelectAllocationCheckbox}
            onSelectAllCheckboxes={onSelectAllocationAll}
          />
        )}
        {selectedTab === (ALLOCATION_TABS[2]?.value as string) && (
          <InitialAllocationContainer selectedTab={selectedTab} />
        )}
      </AllocationLayout>
    </div>
  );
};
