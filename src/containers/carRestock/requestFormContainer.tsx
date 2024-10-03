import { FC, useEffect, useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Typography } from 'antd';
import { useConfirm } from 'vs-design-components/src/Components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { TCartData } from '@/types/cartTypes';
import { Pagination, SelectOption } from '@/types/commonTypes';
import { TRequestForm, TRequestFormData } from '@/types/requestFormDataTypes';

import { RequestFormLayout } from '@/components/cartRestock/requestForm/requestFormLayout';

import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import { PERMISSIONS_TYPES, REQUEST_FORM_TYPE } from '@/utils/constants';
import { getCartRequestForm, getcartUrl } from '@/utils/endpoints';

import { CONTROLLED_TYPES } from '../carFulfillment/constants';

interface props {
  defaultPaginationOptions: any;
}

export const RequestFormContainer: FC<props> = ({
  defaultPaginationOptions
}) => {
  const [requestFormSelectedItems, setRequestSelectedItems] = useState<any>([]);
  const [requestFormTableData, setRequestFormTableData] = useState<{
    rows: TRequestFormData[];
    pagination: Pagination;
  }>({
    rows: [],
    pagination: {
      currentPage: 0,
      perPage: 0,
      totalItems: 0
    }
  });

  const [isRequestFormSubmit, setIsRequestFormSubmit] = useState(false);
  const [requestFormData, setRequestFormData] = useState<TRequestForm>();
  const [requestForm] = Form.useForm();
  const { getDataFromCookie } = useCookies();
  const { cartRequestForms } = getDataFromCookie()?.rbac;
  const [cartData, setCartData] = useState<SelectOption[]>([]);
  const [isReviewModal, setReviewModal] = useState(false);
  const [filteredCartList, setSearchedCart] = useState<any>([]);
  const [reviewData, setReviewData] = useState<TRequestFormData[]>([]);
  const [searchText, setSearchText] = useState('');
  const [cartPagination, setCartPanigation] = useState(
    defaultPaginationOptions
  );
  const [cartSearchText, setCartSearchText] = useState<any>('');

  const { fetchData, postData, isLoading } = useFetch();
  const { confirm } = useConfirm();

  const getCartsData = async (pagination: Pagination, search?: string) => {
    const url = getcartUrl();
    const payload = {
      ...pagination,
      cart: search || searchText
    };
    const cartData = await fetchData(url, payload);
    setCartSearchText(search);
    if (cartData.status !== 'error') {
      setCartData(prevState => {
        return [
          ...prevState,
          ...cartData.rows.map((cart: TCartData) => {
            return {
              label: cart.cart,
              key: cart.cartId,
              value: cart.cartId,
              note: cart.referenceGuide?.note
            };
          })
        ];
      });

      setCartPanigation(cartData.paginationInfo);
    }
  };

  const onRequestFormSubmit = async (values: TRequestForm) => {
    try {
      if (values.type === REQUEST_FORM_TYPE.AFTER_HOURS) {
        values.isControlled = values.drugType === 'controlled';
      }
      const payload = {
        ...{
          ...defaultPaginationOptions,
          perPage: 100
        },
        ...values,
        controlledType: CONTROLLED_TYPES.STOCK
      };
      await getReferenceGuide(payload);
      const cart: any = cartData.find(
        (cart: any) => cart.value === values.cartId
      );
      setIsRequestFormSubmit(true);
      setRequestFormData({ ...values, ...cart });
    } catch (error) {}
  };

  const mapReviewData = (item: TRequestFormData) => {
    const isAdded = reviewData.find(
      i => i.referenceGuideDrugId === item.referenceGuideDrugId
    );
    if (isAdded) {
      item.__temp_pkgQty = isAdded.__temp_pkgQty;
    }

    return { ...item, key: item.referenceGuideDrugId };
  };

  const getReferenceGuide = async (payload: any) => {
    const url = getCartRequestForm();
    const referenceGuide = await fetchData(url, payload);

    if (referenceGuide.status !== 'error') {
      referenceGuide.rows = referenceGuide.rows.map(mapReviewData);
      setRequestFormTableData(referenceGuide);

      return;
    }
    setRequestFormTableData({ rows: [], pagination: {} } as any);
  };

  const resetRequestFormScreen = () => {
    setReviewModal(false);
    requestForm.resetFields();
    setIsRequestFormSubmit(false);
    setReviewData([]);
    setRequestSelectedItems([]);
    setRequestFormData({ type: REQUEST_FORM_TYPE.STANDARD } as TRequestForm);
  };

  const backToRequestForm = () => {
    setIsRequestFormSubmit(false);
    setReviewData([]);
    setRequestSelectedItems([]);
  };

  const onRequstItemSelect = (value: TRequestFormData) => {
    const indexValue = value.key;
    const isAlreadyExist = requestFormSelectedItems.includes(indexValue);
    const updatedItems = isAlreadyExist
      ? requestFormSelectedItems.filter((item: any) => item !== indexValue)
      : [...requestFormSelectedItems, indexValue];

    if (
      requestFormData?.type === REQUEST_FORM_TYPE.AFTER_HOURS &&
      requestFormData?.isControlled
    ) {
      setReviewData([value]);
      setRequestSelectedItems([indexValue]);
    } else {
      setReviewData((prevState: TRequestFormData[]) => {
        if (isAlreadyExist) {
          return prevState.filter(
            item => item.referenceGuideDrugId !== value.referenceGuideDrugId
          );
        }

        return prevState;
      });
      setRequestSelectedItems(updatedItems);
    }

    if (isAlreadyExist) {
      setRequestFormTableData(prevState => {
        return {
          ...prevState,
          rows: prevState.rows.map(item => {
            if (indexValue === item.referenceGuideDrugId) {
              item.__temp_pkgQty = 0;
            }

            return item;
          })
        };
      });
    }
  };

  const onControlledRequestSubmit = async (values: any) => {
    const payload = {
      ...values,
      controlledType: CONTROLLED_TYPES.STOCK,
      type: REQUEST_FORM_TYPE.AFTER_HOURS,
      requestForm: reviewData.map(item => {
        return {
          cartId: requestFormData?.cartId,
          referenceGuideDrugId: item.referenceGuideDrugId,
          packageQuantity: values.packageQuantity,
          pendingOrderQuantity: item.cartRequestForm?.pendingOrderQuantity || 0,
          formularyId: item.formularyId
        };
      })
    };
    const url = getCartRequestForm();
    const response = await postData(url, payload);

    if (response.status !== 'error') {
      resetRequestFormScreen();
    }
  };

  const requestReviewSubmit = async () => {
    const payload = {
      type: requestFormData?.type,
      requestForm: reviewData.map(item => {
        return {
          cartId: requestFormData?.cartId,
          referenceGuideDrugId: item.referenceGuideDrugId,
          packageQuantity: item.__temp_pkgQty,
          pendingOrderQuantity: item.cartRequestForm?.pendingOrderQuantity || 0,
          formularyId: item.formularyId
        };
      })
    };

    const url = getCartRequestForm();
    const response = await postData(url, payload);

    if (response.status !== 'error') {
      resetRequestFormScreen();
    }
  };

  const requestFormSelectAll = (status: boolean) => {
    if (status) {
      const selectedItem = requestFormTableData.rows.map(item => item.key);
      setRequestSelectedItems(selectedItem);

      return;
    }

    setRequestSelectedItems([]);
  };
  const onClearRequestFormSelection = () => {
    confirm({
      onOk: async () => {
        setReviewData([]);
        setRequestSelectedItems([]);
        const updatedItems = requestFormTableData.rows.map(item => {
          delete item.__temp_pkgQty;

          return item;
        });

        setRequestFormTableData(prevState => {
          return { ...prevState, rows: updatedItems };
        });
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
          Are you sure you want to clear all the selected drugs from your
          request form?
        </Typography.Paragraph>
      ),
      type: 'warning',
      okText: 'Yes',
      cancelText: 'No',
      icon: (
        <InfoCircleOutlined
          style={{ fontSize: pxToRem(57), color: '#FAAD14' }}
        />
      )
    });
  };

  const onPackageQtyChange = (referenceGuideDrugId: string, value: number) => {
    const updatedItems: TRequestFormData[] = requestFormTableData.rows.map(
      item => {
        if (item.referenceGuideDrugId === referenceGuideDrugId && value > 0) {
          item.__temp_pkgQty = value;
        }

        return item;
      }
    );

    setReviewData((prevState: TRequestFormData[]) => {
      const currentItem = requestFormTableData.rows.find(
        i => i.referenceGuideDrugId === referenceGuideDrugId
      ) as TRequestFormData;
      const isAlreadyExist = prevState.find(
        i => i.referenceGuideDrugId === referenceGuideDrugId
      );
      if (isAlreadyExist) {
        return prevState
          .map(item => {
            if (item.referenceGuideDrugId === referenceGuideDrugId) {
              item.__temp_pkgQty = value;
            }

            return item;
          })
          .filter(item => item.__temp_pkgQty && item.__temp_pkgQty > 0);
      }

      return [...prevState, currentItem];
    });

    setRequestFormTableData(prevState => {
      return { ...prevState, rows: updatedItems };
    });
  };

  const onRequestFormPaginationChange = (
    pageNumber: number,
    pageSize: number
  ) => {
    const newPaginatedData = {
      ...requestFormTableData.pagination,
      currentPage: pageNumber,
      perPage: pageSize
    };
    const payload = {
      ...requestFormData,
      ...newPaginatedData,
      name: searchText
    };
    getReferenceGuide(payload);
  };

  const onRequestFormTableSearch = async (searchTextValue: string) => {
    const payload = {
      ...defaultPaginationOptions,
      ...requestFormData,
      name: searchTextValue
    };
    setSearchText(searchTextValue);
    getReferenceGuide(payload);
  };

  const onCartSearch = (value: string) => {
    setCartData([]);
    getCartsData(defaultPaginationOptions, value);
  };

  const onScrollCartList = () => {
    const updatedPagination = {
      ...cartPagination,
      perPage: 20,
      currentPage: cartPagination.currentPage + 1
    };

    if (updatedPagination.currentPage <= cartPagination.totalPages) {
      getCartsData(updatedPagination);
    }
  };
  useEffect(() => {
    getCartsData(defaultPaginationOptions);
  }, []);
  const isWriteAccess = cartRequestForms === PERMISSIONS_TYPES.WRITE;

  return (
    <RequestFormLayout
      searchText={searchText}
      onScrollCartList={onScrollCartList}
      isWriteAccess={isWriteAccess}
      filteredCartList={filteredCartList}
      onCartSearch={onCartSearch}
      backToRequestForm={backToRequestForm}
      cartData={cartData}
      requestFormData={requestFormData}
      requestForm={requestForm}
      selectedItems={requestFormSelectedItems}
      requestTableData={requestFormTableData}
      isRequestFormSubmit={isRequestFormSubmit}
      onRequestFormSubmit={onRequestFormSubmit}
      onRequestSelectItems={onRequstItemSelect}
      isReviewModal={isReviewModal}
      setReviewModal={setReviewModal}
      reviewData={reviewData}
      isLoading={isLoading}
      clearSelection={onClearRequestFormSelection}
      selectAll={requestFormSelectAll}
      onPackageQtyChange={onPackageQtyChange}
      requestReviewSubmit={requestReviewSubmit}
      onPaginationChange={onRequestFormPaginationChange}
      onSearch={onRequestFormTableSearch}
      onControlledRequestSubmit={onControlledRequestSubmit}
    />
  );
};
