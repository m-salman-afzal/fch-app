'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { Typography } from 'antd';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useConfirm } from 'vs-design-components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TCartFullfillmentPick } from '@/types/cartFulfillmentTypes';
import { TPagination } from '@/types/commonTypes';

import { getProcessedColumns } from '@/components/cartFulfillment/pick/getProcessedTableColumns';
import { getUnprocessedColumns } from '@/components/cartFulfillment/pick/getUnprocessedTableColumns';
import { PickLayout } from '@/components/cartFulfillment/pick/pickLayout';
import { useFormularyStyle } from '@/components/formulary/useFormularyStyle';

import INFO_ICON from '@/assets/icons/cartFullfillment/pick/infoIcon.svg';
import WARNING_ICON from '@/assets/icons/formulary/warningIcon.svg';
import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import { useCommonStyles } from '@/styles/useCommonStyles';
import { DEFAULT_PAGE_SIZE, PERMISSION_TYPES_BACKEND } from '@/utils/constants';
import { API_BASE_URL, CART_REQUEST_DRUGS_URL } from '@/utils/urls';

import {
  ALLOCATION_STATUS_BACKEND,
  PICK_STATUS_BACKEND,
  PICK_TABS
} from '../constants';

interface Props {
  selectedScreen: string;
}

export const PickContainer: FC<Props> = ({ selectedScreen }) => {
  const { controllConfirmWarningIcon } = useFormularyStyle();
  const isSmall = window.screen.width <= 576;
  const tabInUrl = useSearchParams().get('tab');
  const subTabInUrl = useSearchParams().get('subTab');
  const subTabFoundInPickTabs = PICK_TABS.find(
    pickTab => pickTab.value === subTabInUrl
  );
  const router = useRouter();
  const admin = useCookies().getDataFromCookie();
  const permission = admin.rbac.cartRequestDrugs;

  const { confirm } = useConfirm();
  const {
    deleteFamilyMemberConfirmIcon,
    deleteFamilyMemberConfirmIconContainer
  } = useCommonStyles();

  const { fetchData, updateData, isLoading } = useFetch();
  const [search, setSearch] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState(
    subTabInUrl && subTabFoundInPickTabs
      ? subTabInUrl
      : (PICK_TABS[0]?.value as string)
  );

  const [pickData, setPickData] = useState<TCartFullfillmentPick[]>([]);
  const [selectedUnprocessedKeys, setSelectedUnprocessedKeys] = useState<
    React.Key[]
  >([]);

  const [pickUnprocessedSelectedData, setPickUnprocessedSelectedData] =
    useState<TCartFullfillmentPick[]>([]);

  const paginationInitialValues = {
    currentPage: 1,
    perPage: DEFAULT_PAGE_SIZE.SELECTOR
  };
  const [pagination, setPagination] = useState<TPagination | undefined>(
    paginationInitialValues
  );
  const unprocessedColumns = getUnprocessedColumns();

  const onChangePickSubTabs = (changedScreen: string) => {
    setSelectedTab(changedScreen);
    router.push(
      `cartFulfillment?tab=${tabInUrl ? tabInUrl : 'pick'}&subTab=${changedScreen}`
    );
  };

  const getData = async (
    pagination: TPagination | undefined,
    search: string
  ) => {
    try {
      const url = `${API_BASE_URL}${CART_REQUEST_DRUGS_URL}picks`;

      const response = await fetchData(url, {
        ...pagination,
        pickStatus:
          selectedTab === PICK_TABS[0]?.value
            ? PICK_TABS[0]?.status
            : PICK_TABS[1]?.status,
        name: search,
        allocationStatus:
          selectedTab === PICK_TABS[0]?.value
            ? ALLOCATION_STATUS_BACKEND.NULL
            : ALLOCATION_STATUS_BACKEND.UNFULFILLED,
        type: selectedTab === PICK_TABS[1]?.value ? 'PICK' : undefined
      });

      if (response.rows.length > 0) {
        const tempData = response.rows.map((row: any, index: number) => ({
          ...row,
          key: row.formularyId
        }));
        setPickData(tempData);
        setPagination({ ...pagination, ...response.paginationInfo });

        return;
      }
      setPickData([]);
      setPagination(paginationInitialValues);

      return;
    } catch (e) {
      setPickData([]);
      setPagination(paginationInitialValues);
    }
  };

  useEffect(() => {
    setSearch('');
    getData(pagination, '');
    setPagination(paginationInitialValues);
    onClickClear();
  }, [selectedTab]);

  const onChangePagination = async (pageNumber: number, pageSize: number) => {
    const newPaginatedData = {
      ...pagination,
      currentPage: pageNumber,
      perPage: pageSize
    };
    await getData(newPaginatedData, search);
    setPagination(newPaginatedData);
  };

  const onSelectUnprocesseCheckbox = (
    record: TCartFullfillmentPick,
    selected: boolean,
    selectedRows: TCartFullfillmentPick[],
    nativeEvent: any
  ) => {
    setSelectedUnprocessedKeys(selected => {
      const currentTableDataSet = new Set(
        pickData.map(data => data.formularyId)
      );

      for (const sel of selected) {
        if (currentTableDataSet.has(sel as string)) {
          return [...selectedRows.map((row: any) => row.key)];
        }
      }

      return [...selected, ...selectedRows.map((row: any) => row.key)];
    });
    setPickUnprocessedSelectedData(selected => {
      const currentTableDataSet = new Set(
        pickData.map(data => data.formularyId)
      );

      for (const sel of selected) {
        if (currentTableDataSet.has(sel.formularyId as string)) {
          return selectedRows;
        }
      }

      return [...selected, ...selectedRows];
    });
  };

  const onSelectUnprocesseAll = (
    selected: boolean,
    selectedRows: TCartFullfillmentPick[],
    changeRows: TCartFullfillmentPick[]
  ) => {
    setSelectedUnprocessedKeys(selected => {
      const currentTableDataSet = new Set(
        pickData.map(data => data.formularyId)
      );

      for (const sel of selected) {
        if (currentTableDataSet.has(sel as string)) {
          return [...selectedRows.map((row: any) => row.key)];
        }
      }

      return [...selected, ...selectedRows.map((row: any) => row.key)];
    });
    setPickUnprocessedSelectedData(selected => {
      const currentTableDataSet = new Set(
        pickData.map(data => data.formularyId)
      );

      for (const sel of selected) {
        if (currentTableDataSet.has(sel.formularyId as string)) {
          return selectedRows;
        }
      }

      return [...selected, ...selectedRows];
    });
  };

  const onClickProcessUndo = (value: TCartFullfillmentPick) => {
    confirm({
      iconBgClass: controllConfirmWarningIcon,
      onOk: async () => {
        try {
          const url = `${API_BASE_URL}${CART_REQUEST_DRUGS_URL}picks`;

          await updateData(url, {
            formularyId: [value.formularyId],
            pickStatus: PICK_STATUS_BACKEND.UNPROCESSED,
            allocationStatus: ALLOCATION_STATUS_BACKEND.NULL,
            undo: true
          });
          getData(pagination, search);
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
            {`Are you sure you want to undo the pick of this drug?`}
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
            {`${value.name}`}
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

  const processedColumns = getProcessedColumns(
    onClickProcessUndo,
    permission === PERMISSION_TYPES_BACKEND.WRITE
  );

  const onClickClear = () => {
    setPickUnprocessedSelectedData([]);
    setSelectedUnprocessedKeys([]);
  };

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
    debounceSearch(e.target.value);
  };

  const debounceSearch = useCallback(
    debounce(search => {
      getData(pagination, search);
    }, 500),
    [selectedTab]
  );

  const onClickProcess = async () => {
    try {
      const url = `${API_BASE_URL}${CART_REQUEST_DRUGS_URL}picks`;
      const ids = pickUnprocessedSelectedData.flatMap(data => data.formularyId);
      await updateData(url, {
        formularyId: ids,
        pickStatus: PICK_STATUS_BACKEND.PROCESSED,
        allocationStatus: ALLOCATION_STATUS_BACKEND.UNFULFILLED
      });
      onClickClear();
      await getData(pagination, search);
    } catch (e) {}
  };

  return (
    <div>
      <PickLayout
        setSelectedTab={onChangePickSubTabs}
        selectedTab={selectedTab}
        pagination={pagination}
        onChangePagination={onChangePagination}
        isLoading={isLoading}
        selectedRowKeys={selectedUnprocessedKeys}
        onSelectCheckbox={onSelectUnprocesseCheckbox}
        onSelectAllCheckboxes={onSelectUnprocesseAll}
        unprocessedColumns={unprocessedColumns}
        pickData={pickData}
        processedColumns={processedColumns}
        onClickClear={onClickClear}
        selectedUnprocessedData={pickUnprocessedSelectedData}
        handleSearch={handleSearch}
        onClickProcess={onClickProcess}
        search={search}
      />
    </div>
  );
};
