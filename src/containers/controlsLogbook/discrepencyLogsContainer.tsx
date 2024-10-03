'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { Form } from 'antd';
import debounce from 'lodash.debounce';

import { TCartData } from '@/types/cartTypes';
import { SelectOption, TPagination } from '@/types/commonTypes';
import { TDiscrepancyLog } from '@/types/discrepancyLogTypes';

import { DISCREPANCY_LOG_FILTER_INITIAL_VALUES } from '@/components/controlsLogbook/discrepancyLog/discrepancyLogConstant';
import { DiscrepancyLogLayout } from '@/components/controlsLogbook/discrepancyLog/discrepancyLogLayout';
import { CommentModal } from '@/components/controlsLogbook/perpetualInventory/perpetualInventoryDeductionActions/comment/commentModal';

import { useFetch } from '@/hooks/useFetch';
import { ALL, ALL_OPTION } from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { getCartsUrl, getDiscrepancyLogsUrl } from '@/utils/endpoints';
import { getFitlerValuesAndFilterAll } from '@/utils/getFiltersValuesAndFilterAll';

import { paginationInitialValues } from './constants';

export const DiscrepencyLogsContainer: FC = () => {
  const { fetchData } = useFetch();
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState<TPagination>(
    paginationInitialValues
  );
  const [formRef] = Form.useForm();

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const [cartsData, setCartsData] = useState<SelectOption[]>([]);
  const [selectedCartsData, setSelectedCartsData] = useState<SelectOption[]>(
    []
  );
  const [discrepancyLog, setDiscrepancyLog] = useState<TDiscrepancyLog[]>([]);
  const [selectedDiscrepancyLog, setSelectedDiscrepancyLog] = useState<
    TDiscrepancyLog | undefined
  >(undefined);

  const getCartsData = async () => {
    const url = getCartsUrl();
    const payload = {};
    const cartData = await fetchData(url, payload);
    if (cartData.status !== 'error') {
      setCartsData([
        ...cartData.map((cart: TCartData) => {
          return { label: cart.cart, key: cart.cartId, value: cart.cartId };
        })
      ]);

      setSelectedCartsData([
        ...cartData.map((cart: TCartData) => {
          return { label: cart.cart, key: cart.cartId, value: cart.cartId };
        })
      ]);
    }
  };

  const handleCartSearch = (value: string) => {
    const asd = cartsData.filter((cart: SelectOption) =>
      cart.label.toLowerCase().includes(value.toLowerCase())
    );

    setSelectedCartsData(
      cartsData.filter((cart: SelectOption) =>
        cart.label.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const getDiscrepancyLogs = async (filters: any, pagination: TPagination) => {
    const data = await fetchData(getDiscrepancyLogsUrl(), {
      ...getFitlerValuesAndFilterAll(filters),
      ...pagination
    });
    if (data.status === 'error') {
      setDiscrepancyLog([]);
      setPagination(paginationInitialValues);

      return;
    }

    const logs = data.rows.map((r: TDiscrepancyLog) => ({
      ...r,
      key: r.discrepancyLogId
    }));

    setDiscrepancyLog(logs);
    setPagination({ ...pagination, ...data.paginationInfo });
  };

  useEffect(() => {
    getCartsData();
    getDiscrepancyLogs(DISCREPANCY_LOG_FILTER_INITIAL_VALUES, pagination);
  }, []);

  const onClickComment = (discrepancyLog: TDiscrepancyLog) => {
    setShowCommentModal(true);
    setSelectedDiscrepancyLog({
      ...discrepancyLog,
      dateTime: discrepancyLog.createdAt
    });
  };

  const onCloseCommentModal = () => {
    setShowCommentModal(false);
  };

  const onChangePagination = async (page: number, pageSize: number) => {
    setPagination({ ...pagination, currentPage: page, perPage: pageSize });
    await getDiscrepancyLogs(filters, { currentPage: page, perPage: pageSize });
  };

  const onSearch = useCallback(
    debounce(e => {
      getDiscrepancyLogs(
        {
          name: e.target.value
        },
        pagination
      );
    }, 500),
    []
  );

  const handleReset = async () => {
    formRef.resetFields();
    setFilters({});
    // getDiscrepancyLogs(DISCREPANCY_LOG_FILTER_INITIAL_VALUES, pagination);
  };

  const onClickApply = async () => {
    const values = formRef.getFieldsValue();
    const newFilters = {
      ...filters,
      ...values
    };
    setFilters(newFilters);
    await getDiscrepancyLogs(newFilters, pagination);
    setShowFilterDrawer(false);
  };

  return (
    <div>
      <DiscrepancyLogLayout
        logs={discrepancyLog}
        onClickComment={onClickComment}
        onChangePagination={onChangePagination}
        formRef={formRef}
        searching={searching}
        setSearching={setSearching}
        onSearch={onSearch}
        setShowFilterDrawer={setShowFilterDrawer}
        showFilterDrawer={showFilterDrawer}
        handleReset={handleReset}
        cartsData={selectedCartsData}
        onClickApply={onClickApply}
        handleCartSearch={handleCartSearch}
        filterState={filters}
        pagination={pagination}
      />
      <CommentModal
        open={showCommentModal}
        onCloseModal={onCloseCommentModal}
        perpetualInventoryDeduction={selectedDiscrepancyLog as never}
      />
    </div>
  );
};
