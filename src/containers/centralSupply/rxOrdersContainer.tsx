import { useEffect, useState } from 'react';
import { InfoCircleFilled } from '@ant-design/icons';
import { Grid, Input, Tooltip, Typography } from 'antd';
import { TableProps } from 'antd/es/table';
import Image from 'next/image';
import { VsTable } from 'vs-design-components';

import { TPagination } from '@/types/commonTypes';
import { Formulary } from '@/types/formularyTypes';

import ReviewOrderListModal from '@/components/centralSupply/rxOrders/reviewOrderModal';
import { useRxOrdersStyle } from '@/components/centralSupply/rxOrders/useRxOrdersStyle';
import { useFormularyStyle } from '@/components/formulary/useFormularyStyle';

import RED_FLAG from '@/assets/icons/formulary/redFlag.svg';
import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  ANTIRETROVIRAL,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  FORMULARY_PACKAGES,
  PERMISSIONS_TYPES
} from '@/utils/constants';
import { getFitlerValuesAndFilterAll } from '@/utils/getFiltersValuesAndFilterAll';
import { pxToRem } from '@/utils/sharedUtils';
import { API_BASE_URL, INVENTORY_URL } from '@/utils/urls';

const { useBreakpoint } = Grid;

interface props {
  searchValue?: string;
  showReviewModal?: boolean;
  onCancelReviewModal: () => void;
  searchFilters?: any;
  setReviewOrderButtonDisabled: (value: boolean) => void;
  onChangeScreen: (screen: string) => void;
}

export const RxOrdersContainer: React.FC<props> = ({
  searchValue,
  showReviewModal = false,
  onCancelReviewModal,
  searchFilters,
  setReviewOrderButtonDisabled,
  onChangeScreen
}) => {
  const { getDataFromCookie } = useCookies();
  const { ordersTableContainer, noDataTableContainer } = useRxOrdersStyle();
  const { tableToolTipIcon } = useFormularyStyle();
  const size = useBreakpoint();
  const isSmall = window.screen.width <= 576;
  const [reviewOrderList, setReviewOrderList] = useState<Formulary[]>([]);
  const [checkedOrderList, setCheckedOrderList] = useState<string[]>([]);
  const { fetchData, isLoading, postData, setIsLoading } = useFetch();
  const [rxOrdersList, setRxOrdersList] = useState<Formulary[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<TPagination>({
    currentPage: 1,
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP,
    totalItems: 0,
    totalPages: 0
  });

  const { tableHeight } = useTablePaginationPosition();

  let columns: TableProps<Formulary>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      width: pxToRem(65),
      ellipsis: true
    },
    {
      title: 'Drug',
      align: 'left',
      key: 'drugName',
      width: pxToRem(201),
      ellipsis: true,
      render: (value: Formulary) => (
        <div style={{ display: 'flex', alignItems: 'start' }}>
          <Tooltip title={value?.name} placement={`topLeft`}>
            <Typography.Text
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
            >
              {value?.name}
            </Typography.Text>
          </Tooltip>
          {value.drugClass === ANTIRETROVIRAL && (
            <Tooltip
              overlayInnerStyle={{
                backgroundColor: '#000000E0',
                width: pxToRem(160),
                borderRadius: pxToRem(6)
              }}
              title={'This drug is not in the Sapphire formulary'}
            >
              <InfoCircleFilled className={tableToolTipIcon} />
            </Tooltip>
          )}
        </div>
      )
    },
    {
      title: 'Brand Name',
      align: 'left',
      key: 'brandName',
      render: (value: Formulary) => (
        <Typography.Text>{value?.brandName}</Typography.Text>
      )
    },
    {
      title: 'Strength Unit',
      align: 'left',
      key: 'strengthUnit',
      width: pxToRem(110),
      ellipsis: true,
      render: (value: Formulary) => (
        <Typography.Text>{value?.strengthUnit}</Typography.Text>
      )
    },
    {
      title: 'Package',
      align: 'left',
      key: 'package',
      width: pxToRem(110),
      ellipsis: true,
      render: (value: Formulary) => (
        <Typography.Text>
          {getFormularyPackageLabelByValue(value?.package)}
        </Typography.Text>
      )
    },
    {
      title: 'Units PKG',
      align: 'left',
      key: 'unitsPkg',
      width: pxToRem(110),
      ellipsis: true,
      render: (value: Formulary) => (
        <Typography.Text>{value?.unitsPkg}</Typography.Text>
      )
    },
    {
      title: 'Release',
      align: 'left',
      key: 'release',
      width: pxToRem(110),
      ellipsis: true,
      render: (value: Formulary) => (
        <Typography.Text>{value?.release}</Typography.Text>
      )
    },
    {
      title: 'Generic Name',
      align: 'left',
      key: 'genericName',
      width: pxToRem(150),
      ellipsis: true,
      render: (value: Formulary) => (
        <Typography.Text>{value?.genericName}</Typography.Text>
      )
    },
    {
      title: 'Generic',
      key: 'isGeneric',
      align: 'left',
      width: pxToRem(90),
      ellipsis: true,
      render: (value: Formulary) => (
        <Typography.Text>{value.isGeneric ? `Yes` : `No`}</Typography.Text>
      )
    },
    {
      title: 'Drug Class',
      align: 'left',
      key: 'drugClass',
      width: pxToRem(130),
      ellipsis: true,
      render: (value: Formulary) => (
        <Typography.Text>{value?.drugClass}</Typography.Text>
      )
    },
    {
      title: 'Controlled',
      key: 'isControlled',
      align: 'left',
      width: pxToRem(125),
      ellipsis: true,
      render: (value: Formulary) => (
        <Typography.Text>
          {value.isControlled ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image alt="No Image" src={RED_FLAG} />
              <Typography.Text style={{ marginLeft: pxToRem(5) }}>
                Yes
              </Typography.Text>
            </div>
          ) : (
            `No`
          )}
        </Typography.Text>
      )
    },
    {
      title: 'Formulary',
      align: 'left',
      key: 'isFormulary',
      width: pxToRem(125),
      ellipsis: true,
      render: (value: Formulary) => (
        <Typography.Text>{value?.isFormulary ? `Yes` : `No`}</Typography.Text>
      )
    },
    {
      title: 'Qty OH',
      align: 'left',
      key: 'onHand',
      width: pxToRem(110),
      ellipsis: true,
      render: (value: Formulary) => (
        <Typography.Text>{value?.totalQuantity}</Typography.Text>
      )
    },
    getDataFromCookie()?.rbac?.inventory === PERMISSIONS_TYPES.WRITE
      ? {
          title: 'Qty Order',
          key: 'qtyOrder',
          align: `center`,
          fixed: 'right',
          width: pxToRem(100),
          ellipsis: true,
          render: (value: Formulary) => (
            <Input
              style={{
                width: pxToRem(64),
                padding: pxToRem(2),
                borderRadius: pxToRem(4),
                textAlign: 'center',
                fontSize: pxToRem(12)
              }}
              disabled={checkedOrderList.indexOf(value?.formularyId) === -1}
              type={`number`}
              value={value?.orderedQuantity}
              onChange={(e: any) => {
                onChangeOrderQuantity(value?.formularyId, e?.target?.value);
              }}
            />
          )
        }
      : {}
  ];

  const getFormularyPackageLabelByValue = (value: string) => {
    for (const formularyPackage of FORMULARY_PACKAGES) {
      if (value === formularyPackage?.value) {
        return formularyPackage?.label;
      }
    }

    return '';
  };

  const onChangeOrderQuantity = (formularyId: string, value: number) => {
    setRxOrdersList(
      rxOrdersList.map((order: Formulary) => {
        return {
          ...order,
          orderedQuantity:
            order?.key === formularyId ? value : order?.orderedQuantity
        };
      })
    );
    setReviewOrderList(
      reviewOrderList.map((order: Formulary) => {
        return {
          ...order,
          orderedQuantity:
            order?.key === formularyId ? value : order?.orderedQuantity
        };
      })
    );
  };

  const onSelectSingleRow = (record: Formulary, selected: boolean) => {
    if (selected) {
      setReviewOrderList([...reviewOrderList, ...[record]]);
      setCheckedOrderList([...checkedOrderList, ...[record?.formularyId]]);
      setReviewOrderButtonDisabled(false);
    } else {
      let filteredSelectedOrders = checkedOrderList.filter((key: string) => {
        return record.key !== key;
      });
      let filteredReviewList = reviewOrderList.filter((order: Formulary) => {
        return record.key !== order.key;
      });
      let filteredRxOrderList = rxOrdersList.map((order: Formulary) => {
        return {
          ...order,
          orderedQuantity:
            order.key === record.key
              ? order.originalOrderedQuantity
              : order.orderedQuantity
        };
      });
      setReviewOrderList([...filteredReviewList]);
      setCheckedOrderList([...filteredSelectedOrders]);
      setRxOrdersList(filteredRxOrderList);
      setReviewOrderButtonDisabled(filteredSelectedOrders?.length === 0);
    }
  };

  const onSelectMultipleRows = (
    selected: boolean,
    selectedRows: Formulary[],
    changeRows: Formulary[]
  ) => {
    if (selected) {
      let filteredSelectedOrders: string[] = [];
      let filteredReviewList: Formulary[] = [];
      for (const order of selectedRows) {
        if (order && checkedOrderList.indexOf(order?.formularyId) === -1) {
          filteredSelectedOrders.push(order?.formularyId);
          filteredReviewList.push(order);
        }
      }
      setCheckedOrderList([...checkedOrderList, ...filteredSelectedOrders]);
      setReviewOrderList([...reviewOrderList, ...filteredReviewList]);
      setReviewOrderButtonDisabled(false);
    } else {
      let tempNotSelectedOrders = changeRows.map(
        (order: Formulary) => order?.formularyId
      );
      let filteredSelectedOrders: string[] = [];
      let filteredReviewList: Formulary[] = [];
      for (const formularyId of checkedOrderList) {
        if (tempNotSelectedOrders.indexOf(formularyId) === -1) {
          filteredSelectedOrders.push(formularyId);
          let ifOrderFoundInOrdersList = reviewOrderList.find(
            (tempOrder: Formulary) => tempOrder?.formularyId === formularyId
          );
          if (ifOrderFoundInOrdersList) {
            filteredReviewList.push(ifOrderFoundInOrdersList);
          }
        }
      }
      let filteredRxOrderList = rxOrdersList.map((order: Formulary) => {
        const ifOrderPresentInDom = changeRows?.find(
          (tempRow: Formulary) => tempRow?.formularyId === order?.formularyId
        );

        return {
          ...order,
          orderedQuantity: ifOrderPresentInDom
            ? order.originalOrderedQuantity
            : order.orderedQuantity
        };
      });
      setCheckedOrderList([...filteredSelectedOrders]);
      setReviewOrderList([...filteredReviewList]);
      setRxOrdersList(filteredRxOrderList);
      setReviewOrderButtonDisabled(filteredSelectedOrders?.length === 0);
    }
  };

  const onChangePagination = async (pageNumber: number, pageSize: number) => {
    let filters = {
      name: searchValue,
      ...searchFilters,
      orderedQuantityMin:
        searchFilters?.orderedQuantity?.length > 0
          ? searchFilters?.orderedQuantity?.[0]
          : false,
      orderedQuantityMax:
        searchFilters?.orderedQuantity?.length > 0
          ? searchFilters?.orderedQuantity?.[1]
          : false,
      orderedQuantity: false,
      currentPage: pageNumber,
      perPage: pageSize
    };
    setPaginationInfo({
      ...paginationInfo,
      currentPage: pageNumber,
      perPage: pageSize
    });
    await getRxOrders(filters);
  };

  const getRxOrders = async (filters: any) => {
    setIsLoading(true);
    const response = await fetchData(
      `${API_BASE_URL}${INVENTORY_URL}/centralSupply/rxOrders`,
      getFitlerValuesAndFilterAll(filters)
    );
    if (response?.rows?.length > 0) {
      setRxOrdersList(
        response?.rows?.map((rxOrder: any) => {
          const { orderedQuantity, totalQuantity } = rxOrder;
          const ifAlreadyExistsInReviewList = reviewOrderList.find(
            (tempOrder: any) =>
              tempOrder?.formularyId === rxOrder?.formulary?.formularyId
          );

          return {
            ...rxOrder?.formulary,
            orderedQuantity: ifAlreadyExistsInReviewList
              ? ifAlreadyExistsInReviewList?.orderedQuantity
              : orderedQuantity,
            originalOrderedQuantity: orderedQuantity,
            totalQuantity,
            key: rxOrder?.formulary?.formularyId
          };
        })
      );
      setPaginationInfo({
        ...response?.paginationInfo,
        perPage: filters?.perPage
      });
    } else {
      setRxOrdersList([]);
      setPaginationInfo({
        perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP,
        currentPage: 1,
        totalItems: 0,
        totalPages: 0
      });
    }
    setIsLoading(false);
  };

  const onSubmitReviewModal = async () => {
    setIsLoading(true);
    const placeOrders = await postData(
      `${API_BASE_URL}${INVENTORY_URL}/centralSupply/rxOrders`,
      {
        rxOrder: reviewOrderList.map((tempOrder: Formulary) => {
          const { formularyId, orderedQuantity } = tempOrder;

          return {
            formularyId,
            orderedQuantity: Number(orderedQuantity)
          };
        })
      }
    );
    if (placeOrders?.status !== 'error') {
      setReviewOrderList([]);
      setCheckedOrderList([]);
      onChangeScreen('rxOrders');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getRxOrders({
      name: searchValue,
      ...searchFilters,
      orderedQuantityMin:
        searchFilters?.orderedQuantity?.length > 0
          ? searchFilters?.orderedQuantity?.[0]
          : false,
      orderedQuantityMax:
        searchFilters?.orderedQuantity?.length > 0
          ? searchFilters?.orderedQuantity?.[1]
          : false,
      orderedQuantity: false,
      perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP,
      currentPage: 1,
      totalItems: 0,
      totalPages: 0
    });
  }, [searchValue, searchFilters]);

  return (
    <div
      className={
        rxOrdersList?.length > 0
          ? ordersTableContainer
          : window.innerWidth >= 2160
            ? ordersTableContainer
            : noDataTableContainer
      }
    >
      <VsTable
        tableProps={{
          dataSource: rxOrdersList,
          columns: columns.filter(tempCol => tempCol.key),
          rowSelection: {
            onSelect: onSelectSingleRow,
            onSelectAll: onSelectMultipleRows,
            selectedRowKeys: checkedOrderList
          },
          loading: isLoading,
          pagination: {
            onChange: onChangePagination,
            total: paginationInfo?.totalItems || 0,
            pageSizeOptions: !size.xs ? DEFAULT_PAGE_SIZE_OPTIONS : undefined,
            showTotal: size.sm
              ? (total, range) => {
                  return (
                    <Typography.Text>
                      Showing {range[1]} out of <strong>{total}</strong>
                    </Typography.Text>
                  );
                }
              : undefined,
            showSizeChanger: !size.xs,
            size: 'small',
            style: { alignItems: 'center' },
            defaultPageSize: isSmall
              ? DEFAULT_PAGE_SIZE.MOBILE
              : DEFAULT_PAGE_SIZE.DESKTOP,
            position: ['bottomCenter']
          },
          sticky: true,
          scroll: {
            x: 'max-content',
            y: rxOrdersList.length > 0 ? tableHeight : undefined
          }
        }}
      ></VsTable>
      <ReviewOrderListModal
        showModal={showReviewModal}
        reviewOrderList={reviewOrderList}
        onCloseModal={onCancelReviewModal}
        onCancel={onCancelReviewModal}
        onSubmit={onSubmitReviewModal}
        loading={isLoading}
      />
    </div>
  );
};
