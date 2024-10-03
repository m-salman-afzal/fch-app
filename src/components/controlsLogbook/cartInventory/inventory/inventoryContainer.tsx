import { FC, useEffect, useState } from 'react';
import { Form, Grid, Pagination, Typography } from 'antd';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useVT } from 'virtualizedtableforantd4';
import { VsTable } from 'vs-design-components';

import { TCartInventory } from '@/types/cartInventoryTypes';
import * as Types from '@/types/commonTypes';

import { useFetch } from '@/hooks/useFetch';
import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  getAllCartInventoryLogUrl,
  getAllCartInventoryUrl
} from '@/utils/endpoints';
import { pxToRem } from '@/utils/sharedUtils';

import { useInventoryTableStyle } from '../useCartInventoryStyle';
import { SubmitModal } from './submitModal';

const { useBreakpoint } = Grid;

interface props {
  isModalOpen: boolean;
  onCloseModal: () => void;
  selectedCart: undefined | Types.SelectOption;
  searchText: string;
  setSelectedCart: (cart: Types.SelectOption | undefined) => void;
}

const DEFAULT_PAGINATION_VALUES = {
  perPage: 100,
  currentPage: 1,
  totalItems: 1,
  totalPages: 1
};

export const InventoryContainer: FC<props> = ({
  isModalOpen,
  searchText,
  selectedCart,
  onCloseModal,
  setSelectedCart
}) => {
  const [inventoryData, setInventoryData] = useState<TCartInventory[]>([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION_VALUES);
  const size = useBreakpoint();
  const { fetchData, isLoading, postData } = useFetch();
  const { inventoryTableContainer } = useInventoryTableStyle();
  const { tableHeight } = useTablePaginationPosition();

  const [formref] = Form.useForm();

  const isSmall = window.screen.width <= 576;

  const tableColumns = [
    {
      title: 'Row #',
      key: 'row',
      dataIndex: 'rowNumber',
      width: 71
    },

    {
      title: 'Drug',
      key: 'drug',
      dataIndex: 'name'
    },
    {
      title: 'Controlled ID',
      key: 'controlledId',
      dataIndex: 'controlledId'
    },
    {
      title: 'TR/Rx',
      key: 'tr',
      render: (value: any) => {
        return <div>{value.isPatientSpecific ? value.rx : value.tr}</div>;
      }
    },
    {
      title: 'Qty OH',
      key: 'qtyOh',
      dataIndex: 'qtyOh',
      width: 81
    }
  ];

  const getInventoryList = async (
    pagination: Types.Pagination,
    isPagination = false
  ) => {
    const url = getAllCartInventoryUrl();
    const response = await fetchData(url, {
      ...pagination,
      cartId: selectedCart?.value,
      text: searchText
    });

    if (response.status !== 'error') {
      let data;
      if (isPagination) {
        data = [...inventoryData, ...response.rows];
      } else {
        data = response.rows;
      }
      setInventoryData(data);
      setPagination({
        ...DEFAULT_PAGINATION_VALUES,
        ...response.paginationInfo
      });

      return;
    }

    if (!isPagination) {
      setInventoryData([]);
      setPagination(DEFAULT_PAGINATION_VALUES);
    }
  };

  const onSubmit = async (data: any) => {
    const url = getAllCartInventoryLogUrl();
    const isSubmitted = await postData(url, {
      ...data,
      cartId: selectedCart?.value
    });

    if (isSubmitted.status !== 'error') {
      formref.resetFields();
      setInventoryData([]);
      setSelectedCart(undefined);
      onCloseModal();
    }
  };

  useEffect(() => {
    if (!searchText && !selectedCart) {
      return;
    }
    getInventoryList(DEFAULT_PAGINATION_VALUES);
  }, [searchText, selectedCart]);

  const onPagination = () => {
    const updatePagination = {
      ...pagination,
      currentPage: pagination.currentPage + 1
    };
    setPagination(updatePagination);
    getInventoryList(updatePagination, true);
  };

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: inventoryData.length !== pagination.totalItems,
    onLoadMore: onPagination,
    rootMargin: '0px 0px 400px 0px'
  });

  return (
    <div className={inventoryTableContainer}>
      <VsTable
        tableProps={{
          loading: isLoading,
          dataSource: inventoryData,
          columns: tableColumns,
          sticky: true,
          pagination: false,
          scroll: {
            y: inventoryData.length
              ? isSmall
                ? pxToRem(450)
                : tableHeight - 50
              : undefined,
            x: 'max-content'
          },
          onRow: (data: TCartInventory, index) => {
            if (
              inventoryData.length >= 100 &&
              index === inventoryData.length - 1 &&
              inventoryData.length !== pagination.totalItems &&
              !searchText &&
              !isLoading
            ) {
              return {
                ref: sentryRef
              } as any;
            }

            return {};
          }
        }}
      />

      {inventoryData.length > 0 && (
        <Typography.Text
          style={{
            fontSize: pxToRem(12),
            lineHeight: pxToRem(20),
            color: '#505F79',
            marginBlockStart: pxToRem(10),
            paddingInlineStart: isSmall ? pxToRem(20) : undefined
          }}
        >
          <strong>{inventoryData.length}</strong> results found
        </Typography.Text>
      )}

      <SubmitModal
        open={isModalOpen}
        onCloseModal={onCloseModal}
        formRef={formref}
        isLoading={isLoading}
        handleSubmit={onSubmit}
      />
    </div>
  );
};
