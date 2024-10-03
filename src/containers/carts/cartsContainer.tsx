import { useCallback, useEffect, useState } from 'react';
import { Form, Typography } from 'antd';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import { ErrorMessage, useConfirm } from 'vs-design-components';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import { CartForm, TCartData, TReferenceGuide } from '@/types/cartTypes';
import { SelectOption, TPagination } from '@/types/commonTypes';

import CartInfoModal from '@/components/carts/cartInfoModal';
import CartsActions from '@/components/carts/cartsActions';
import CartsTable from '@/components/carts/cartsTable';
import { getCartsColumns } from '@/components/carts/getCartsColums';
import MobileCartActions from '@/components/carts/mobileCartActions';

import DELETEICON from '@/assets/icons/common/deleteModal.svg';
import useCookies from '@/hooks/useCookies';
import { useFacility } from '@/hooks/useFacility';
import { useFetch } from '@/hooks/useFetch';
import { useCommonStyles } from '@/styles/useCommonStyles';
import {
  DEFAULT_PAGE_SIZE,
  TOAST_DURATION,
  TOAST_GENERIC_ERROR_MESSAGE
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import {
  getDowntimeMedpassLastUpdateUrl,
  getReferenceGuideUrl
} from '@/utils/endpoints';
import ShowToast from '@/utils/showToast';
import { API_BASE_URL, CARTS_URL } from '@/utils/urls';

const CartsContainer: React.FC = () => {
  const [cartForm] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isSmall = window.screen.width <= 576;
  const [editId, setEditId] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [cartData, setCartData] = useState<TCartData[]>([]);
  const [unitsOptions, setUnitOptions] = useState<SelectOption[]>([]);
  const [referenceGuide, setReferenceGuide] = useState<SelectOption[]>([]);
  const { currentFacility } = useFacility();

  const { confirm } = useConfirm();
  const {
    deleteFamilyMemberConfirmIcon,
    deleteFamilyMemberConfirmIconContainer
  } = useCommonStyles();

  const paginationInitialValues = {
    currentPage: 1,
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  };
  const [pagination, setPagination] = useState<TPagination>(
    paginationInitialValues
  );
  const [lastUpdate, setLastUpdate] = useState('NA');

  const admin = useCookies().getDataFromCookie();
  const permission = admin.rbac.carts;
  const [totalItems, setTotalItems] = useState<number>(0);
  const [existingCartList, setExistingCartList] = useState<string[]>([]);
  const { fetchData, postData, updateData, deleteData, isLoading } = useFetch();
  const onCloseModal = () => {
    setIsOpen(false);
    cartForm.resetFields();
    setEditId('');
  };

  const onClickOpenModal = () => {
    setIsOpen(true);
  };

  const onClickEdit = async (value: TCartData) => {
    cartForm.setFieldsValue({
      ...value,
      units: value.units.map(unit => unit.facilityUnitId)
    });

    if (value.referenceGuide.isDeleted) {
      cartForm.resetFields(['referenceGuideId']);
    }

    await getUnitOptions(value.cartId);
    setIsOpen(x => {
      setEditId(value.cartId);

      return true;
    });
  };

  const getCartData = async (pagination: TPagination, search: string) => {
    try {
      const url = `${API_BASE_URL}${CARTS_URL}`;
      const response = await fetchData(url, { cart: search, ...pagination });
      if (response?.rows?.length > 0) {
        if (search?.length === 0) {
          setTotalItems(response.paginationInfo.totalItems);
        }
        setPagination({
          ...pagination,
          ...response.paginationInfo
        });
        setCartData(
          response.rows.map((row: any) => ({ ...row, key: row.cartId }))
        );
      }
    } catch (error) {}
  };

  const onFinishForm = async (values: CartForm) => {
    try {
      const url = `${API_BASE_URL}${CARTS_URL}/`;

      if (editId.length > 0) {
        const url = `${API_BASE_URL}${CARTS_URL}${currentFacility.facilityId}`;

        const response = await updateData(url, {
          ...values,
          facilityId: currentFacility,
          cartId: editId
        });

        await getCartData(pagination, search);
        await getUnitOptions();

        onCloseModal();
        validateCart(response);

        return;
      }
      const response = await postData(url, {
        ...values,
        facilityId: currentFacility.facilityId
      });

      if (response.cart) {
        await getCartData(pagination, search);
        await getUnitOptions();
        onCloseModal();
      }

      validateCart(response);
    } catch (error) {}
  };

  const validateCart = (response: any) => {
    if (
      response.status === 'error' &&
      response.message === 'Cart already exists'
    ) {
      cartForm.setFields([
        {
          name: 'cart',
          errors: [(<ErrorMessage>Cart already exists</ErrorMessage>) as any]
        }
      ]);

      return;
    }

    setExistingCartList(preState => {
      return [response.cart, ...preState];
    });
  };

  const onDeleteCart = (wholeCart: TCartData) => {
    const { cartId, cart } = wholeCart;
    confirm({
      onOk: async () => {
        const url = `${API_BASE_URL}${CARTS_URL}${currentFacility.facilityId}`;
        const deleteAdmin = await deleteData(url, { cartId });
        if (deleteAdmin) {
          getCartData(pagination, search);
        } else {
          ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error', TOAST_DURATION);
        }
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
            Are you sure you want to delete this cart?
          </Typography.Paragraph>
          <Typography.Text
            style={{
              fontSize: pxToRem(14),
              fontWeight: 400,
              color: 'rgba(0, 0, 0, 0.65)',
              marginBlockEnd: 0,
              marginLeft: pxToRem(5)
            }}
          >
            Cart:{' '}
            <span
              style={{
                color: 'rgba(0, 0, 0, 0.88)'
              }}
            >{`${cart}`}</span>
          </Typography.Text>
        </>
      ),
      type: 'destructive',
      okText: 'Yes',
      cancelText: 'No',
      icon: (
        <div className={deleteFamilyMemberConfirmIconContainer}>
          <Image
            className={deleteFamilyMemberConfirmIcon}
            alt={'MSG'}
            fill={true}
            src={DELETEICON}
          />
        </div>
      )
    });
  };

  const columns = getCartsColumns(
    onClickEdit,
    onDeleteCart,
    permission,
    lastUpdate
  );

  const onChangePagination = async (pageNumber: number, pageSize: number) => {
    const newPaginatedData = {
      ...pagination,
      currentPage: pageNumber,
      perPage: pageSize
    };
    await getCartData(newPaginatedData, search);
    setPagination(newPaginatedData);
  };
  const handleSearch = useCallback(
    debounce(e => {
      setSearch(e.target.value);
    }, 500),
    []
  );
  useEffect(() => {
    getCartData(pagination, search);
  }, [search]);

  useEffect(() => {
    getDowntimeMedpassLastUpdate();
    getReferenceGuide();
    getExistingCart();
  }, []);

  const getDowntimeMedpassLastUpdate = async () => {
    try {
      const lastUpdate = await fetchData(getDowntimeMedpassLastUpdateUrl(), {});
      if (lastUpdate) {
        const dateTime = getFormattedDateNoTimeZone({
          date: lastUpdate?.lastUpdate,
          format: DATE_FORMATS.MDY_TIME
        });
        setLastUpdate(dateTime);
      }
    } catch (error) {}
  };

  const getUnitOptions = async (editId?: string) => {
    const url = `${API_BASE_URL}facilityUnits/unassigned?facilityId=${currentFacility.facilityId}`;
    const response = await fetchData(url);
    let mappedOptions = [];
    if (response.status !== 'error') {
      mappedOptions = response?.map((unit: any) => ({
        value: unit.facilityUnitId,
        label: unit.unit,
        key: unit.facilityUnitId
      }));
    }
    if (editId) {
      const selectedOptionsMap = cartData
        .find(cart => cart.cartId === editId)
        ?.units.map(unit => ({
          label: unit.unit,
          value: unit.facilityUnitId,
          key: unit.facilityUnitId
        }));

      if (!selectedOptionsMap) {
        return;
      }

      setUnitOptions([...selectedOptionsMap, ...mappedOptions]);

      return;
    }
    setUnitOptions(mappedOptions);
  };

  const getReferenceGuide = async () => {
    const url = getReferenceGuideUrl();

    const referenceGuide = await fetchData(url);

    if (referenceGuide.status !== 'error') {
      const referenceGuideOptions = referenceGuide.map(
        (item: TReferenceGuide) => {
          return {
            label: item.name,
            value: item.referenceGuideId,
            key: item.referenceGuideId
          };
        }
      );

      setReferenceGuide(referenceGuideOptions);
    }
  };

  const getExistingCart = async () => {
    const url = `${API_BASE_URL}${CARTS_URL}names`;
    const response = await fetchData(url, {});

    if (response.status !== 'error') {
      setExistingCartList(response);
    }
  };

  const checkExistingCart = (search: string) => {
    return existingCartList.find(cart => cart === search) ? true : false;
  };

  return (
    <>
      <CartInfoModal
        editId={editId}
        form={cartForm}
        open={isOpen}
        onFinishForm={onFinishForm}
        isLoading={isLoading}
        onCloseModal={onCloseModal}
        unitsOptions={unitsOptions}
        getUnitOptions={getUnitOptions}
        getExistingCart={checkExistingCart}
        referenceGuide={referenceGuide}
      />
      {isSmall ? (
        <MobileCartActions
          cartCount={totalItems}
          onSearchCart={handleSearch}
          onOpenModal={onClickOpenModal}
        />
      ) : (
        <CartsActions
          cartCount={totalItems}
          onSearchCart={handleSearch}
          onOpenModal={onClickOpenModal}
        />
      )}
      <CartsTable
        cartsColumns={columns}
        cartsData={cartData}
        isLoading={isLoading}
        paginationData={pagination}
        onChangePagination={onChangePagination}
      />
    </>
  );
};

export default CartsContainer;
