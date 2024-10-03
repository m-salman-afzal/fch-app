'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Form, Grid } from 'antd';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CSVLink } from 'react-csv';

import { TCartData } from '@/types/cartTypes';
import { SelectOption, TPagination } from '@/types/commonTypes';
import {
  TPerpetualInventory,
  TPerpetualInventoryDeduction,
  TPerpetualInventoryFilters,
  TSignature
} from '@/types/perpetualInventoryTypes';

import { DeductionModal } from '@/components/controlsLogbook/perpetualInventory/perpetualInventoryActions/deduction/deductionActionModal';
import { PerpetualInventoryDeleteModal } from '@/components/controlsLogbook/perpetualInventory/perpetualInventoryActions/delete/perpetualInventoryDeleteModal';
import { PerpetualInventoryEditModal } from '@/components/controlsLogbook/perpetualInventory/perpetualInventoryActions/edit/perpetualInventoryEditModal';
import { CommentModal } from '@/components/controlsLogbook/perpetualInventory/perpetualInventoryDeductionActions/comment/commentModal';
import { PerpetualInventoryDeductionDeleteModal } from '@/components/controlsLogbook/perpetualInventory/perpetualInventoryDeductionActions/perpetualInventoryDeductionDeleteModal';
import { PerpetualInventoryDeductionEditModal } from '@/components/controlsLogbook/perpetualInventory/perpetualInventoryDeductionActions/perpetualInventoryDeductionEditModal';
import { PerpetualInventoryLayout } from '@/components/controlsLogbook/perpetualInventory/perpetualInventoryLayout';
import { SignatureActionModal } from '@/components/controlsLogbook/perpetualInventory/signatureAction/signatureModal';

import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import { ALL_OPTION, DEFAULT_PAGINATION_VALUES } from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInUTC,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import {
  addPerpetualInventoryDeductionUrl,
  addStaffSignatureUrl,
  editPerpetualInventoryDeductionUrl,
  getAllPerpetualInventoryUrl,
  getCartsUrl,
  getPerpetualInventoryCartsUrl,
  getPerpetualInventorySignatureUrl,
  getPerpetualInventoryUrl,
  removePerpetualInventoryDeductionUrl
} from '@/utils/endpoints';
import { getFitlerValuesAndFilterAll } from '@/utils/getFiltersValuesAndFilterAll';

import {
  CSV_HEADERS,
  filterInitialValues,
  paginationInitialValues,
  PERPETUAL_INVENTORY_DEDUCTION_TYPES
} from './constants';

const { useBreakpoint } = Grid;

export const PerpetualInventoryContainer: FC = () => {
  const size = useBreakpoint();

  const { isLoading, setIsLoading, fetchData, updateData, deleteData } =
    useFetch();
  const downloadCsvLink = useRef<any>();

  const [pagination, setPagination] = useState<TPagination>(
    paginationInitialValues
  );
  const [controlledDrugId, setControlledDrugId] = useState<string | null>(
    useSearchParams().get('controlledDrugId')
  );
  const [cartsData, setCartsData] = useState<SelectOption[]>([]);
  const [transferCartsData, setTransferCartsData] = useState<SelectOption[]>(
    []
  );
  const [searching, setSearching] = useState<boolean>(false);
  const [selectedCart, setSelectedCart] = useState<string>('');
  const [perpetualInventories, setPerpetualInventories] = useState<any>([]);
  const [perpetualInventoryForCsv, setPerpetualInventoryForCSV] = useState([]);

  const [selectedPerpetualInventory, setSelectedPerpetualInventory] = useState<
    (TPerpetualInventory & Partial<{ deductionType: string }>) | undefined
  >(undefined);

  const [
    selectedPerpetualInventoryDeduction,
    setSelectedPerpetualInventoryDeduction
  ] = useState<TPerpetualInventoryDeduction | undefined>(undefined);

  const [
    perpInvDeductionEditModalOpen,
    setPerpetualInventoryDeductionEditModalOpen
  ] = useState(false);
  const [
    perpInvDeductionDeleteModalOpen,
    setPerpetualInventoryDeductionDeleteModalOpen
  ] = useState(false);

  const [signature, setSignature] = useState<TSignature>({});
  const [deductionType, setDeductionType] = useState('');

  const [searchVal, setSearchVal] = useState<string>('');
  const [deductionModalOpen, setDeductionModalOpen] = useState<boolean>(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState<boolean>(false);
  const [commentModalOpen, setCommentModalOpen] = useState<boolean>(false);
  const [perpetualInventoryEditModalOpen, setPerpetualInventoryEditModalOpen] =
    useState<boolean>(false);
  const [
    perpetualInventoryDeleteModalOpen,
    setPerpetualInventoryDeleteModalOpen
  ] = useState<boolean>(false);

  const [signatureFormref] = Form.useForm();
  const [filtersformRef] = Form.useForm();
  const [formRef] = Form.useForm();

  const getPerpetualInventory = async (
    searchFilters: TPerpetualInventoryFilters,
    paginationInfo = pagination
  ) => {
    try {
      const url = getPerpetualInventoryUrl();
      const payload = {
        controlledDrugId,
        ...paginationInfo,
        ...searchFilters
      };
      if (payload?.controlledDrugId) {
        setControlledDrugId(null);
        delete payload.cartId;
      }
      const nfs = await fetchData(url, getFitlerValuesAndFilterAll(payload));
      if (nfs.status === 'error') {
        setPerpetualInventories([]);
      }

      if (nfs.rows) {
        if (payload?.controlledDrugId) {
          setSearchVal(nfs?.rows?.[0]?.name);
          setSelectedCart(nfs?.rows?.[0]?.cartId);
        }
        const perpetualInventories = nfs.rows.map((perpetualInventory: any) => {
          return {
            ...perpetualInventory,
            perpetualInventoryDeduction:
              perpetualInventory.perpetualInventoryDeduction.map((pID: any) => {
                return {
                  ...pID,
                  key: pID.perpetualInventoryDeductionId
                };
              }),
            key: perpetualInventory.perpetualInventoryId
          };
        });

        setPerpetualInventories(perpetualInventories);
        setPagination({ ...pagination, ...nfs.paginationInfo });
      }

      if (nfs.status === 'error') {
        setPerpetualInventories([]);
        setPagination({
          ...pagination,
          totalItems: 0,
          totalPages: 0
        });
        setIsLoading(false);

        return;
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: any) => {
    setControlledDrugId(null);
    setSearchVal(e.target.value);
    handleInputSearch(e);
  };

  const handleInputSearch = useCallback(
    debounce(e => {
      getPerpetualInventory(
        {
          cartId: selectedCart,
          text: e.target.value
        },
        paginationInitialValues
      );
    }, 500),
    [controlledDrugId, selectedCart]
  );

  const addPerpetualInventoryDeduction = async (
    perpetualnventoryDeduction: TPerpetualInventoryDeduction
  ) => {
    if (selectedPerpetualInventory) {
      const perpetualInventoryId =
        selectedPerpetualInventory.perpetualInventoryId;
      const url = `${addPerpetualInventoryDeductionUrl()}/${perpetualInventoryId}`;
      const payload = perpetualnventoryDeduction;
      payload.quantityDeducted = Number(
        perpetualnventoryDeduction.quantityDeducted
      );
      payload.type = perpetualnventoryDeduction.deductionType;
      payload.signatureImages = {
        adminSignature: perpetualnventoryDeduction.adminSignature,
        witnessSignature: perpetualnventoryDeduction.witnessSignature,
        nurseSignature: perpetualnventoryDeduction.nurseSignature
          ? perpetualnventoryDeduction.nurseSignature
          : undefined
      };
      payload.date = getFormattedDateNoTimeZone({
        date: perpetualnventoryDeduction.date,
        format: DATE_FORMATS.YMD
      });
      payload.time = getFormattedDateNoTimeZone({
        date: perpetualnventoryDeduction.time,
        format: DATE_FORMATS.HMS_TIME
      });

      const response = await updateData(url, payload);
      if (response?.status !== 'error') {
        await getCartsData(true);
        await getPerpetualInventory(
          { text: searchVal, cartId: selectedCart },
          pagination
        );
        setSelectedPerpetualInventory(undefined);
      }
      onCloseDeductionModal();
    }
  };

  const perpetualInventoryEdit = async (
    perpetualInventoryEditFormData: any
  ) => {
    if (selectedPerpetualInventory) {
      const perpetualInventoryId =
        selectedPerpetualInventory.perpetualInventoryId;
      const url = `${getPerpetualInventoryUrl()}/${perpetualInventoryId}`;
      const payload = perpetualInventoryEditFormData;
      payload.quantityAllocated = Number(perpetualInventoryEditFormData.qtyOH);
      if (selectedPerpetualInventory.isPatientSpecific)
        payload.rx = perpetualInventoryEditFormData.trx;
      if (!selectedPerpetualInventory.isPatientSpecific)
        payload.tr = perpetualInventoryEditFormData.trx;

      const response = await updateData(url, payload);
      if (response?.status !== 'error') {
        await getPerpetualInventory(
          { text: searchVal, cartId: selectedCart },
          pagination
        );
        setSelectedPerpetualInventory(undefined);
      }
      onClosePerpetualInventoryEditModal();
    }
  };

  const perpetualInventoryDelete = async (
    perpetualInventoryDeleteFormData: any
  ) => {
    if (selectedPerpetualInventory) {
      const perpetualInventoryId =
        selectedPerpetualInventory.perpetualInventoryId;
      const url = `${getPerpetualInventoryUrl()}/${perpetualInventoryId}`;

      const payload = { comment: perpetualInventoryDeleteFormData.comment };

      const response = await deleteData(url, undefined, payload);
      if (response?.status !== 'error') {
        await getPerpetualInventory(
          { text: searchVal, cartId: selectedCart },
          DEFAULT_PAGINATION_VALUES
        );
      }
      onClosePerpetualInventoryDeleteModal();
    }
  };

  const addStaffSignature = async (signatureData: any) => {
    if (selectedPerpetualInventory) {
      const perpetualInventoryId =
        selectedPerpetualInventory.perpetualInventoryId;
      const url = `${addStaffSignatureUrl()}/${perpetualInventoryId}`;
      const payload = {
        staffName: signatureData.staffName,
        staffSignature: signatureData.signature
      };
      const response = await updateData(url, payload);
      if (response?.status !== 'error') {
        await getPerpetualInventory(
          { text: searchVal, cartId: selectedCart },
          pagination
        );
        setSelectedPerpetualInventory(undefined);
      }
      onCloseSignatureModal();
    }
  };

  const perpetualInventoryDeductionEdit = async () => {
    const perpetualInventoryDeductionId = formRef.getFieldValue(
      'perpetualInventoryDeductionId'
    );

    const payload = {
      ...formRef.getFieldsValue(),
      date: getFormattedDateNoTimeZone({
        date: formRef.getFieldValue('date'),
        format: DATE_FORMATS.YMD
      }),
      time: getFormattedDateNoTimeZone({
        date: formRef.getFieldValue('time'),
        format: DATE_FORMATS.HMS_TIME
      }),
      quantityDeducted: Number(formRef.getFieldsValue()['quantityDeducted']),
      type: 'EDIT',
      level: 2
    };

    await updateData(
      editPerpetualInventoryDeductionUrl(perpetualInventoryDeductionId),
      payload
    );

    formRef.resetFields();
    setPerpetualInventoryDeductionEditModalOpen(false);

    await getPerpetualInventory(
      { text: searchVal, cartId: selectedCart },
      pagination
    );
  };

  const perpetualInventoryDeductionDelete = async () => {
    const comment = formRef.getFieldValue('comment');
    const perpetualInventoryDeductionId = formRef.getFieldValue(
      'perpetualInventoryDeductionId'
    );

    await deleteData(
      removePerpetualInventoryDeductionUrl(perpetualInventoryDeductionId),
      {
        comment: comment,
        type: 'DELETE',
        level: 2
      }
    );

    formRef.resetFields();
    setPerpetualInventoryDeductionDeleteModalOpen(false);

    await getPerpetualInventory(
      { text: searchVal, cartId: selectedCart },
      pagination
    );
  };

  const getPerpetualInventoryInventorySignature = async (
    perpetualInventory: any,
    signatureType: string,
    isPerpetualInventorySignature: boolean
  ) => {
    try {
      const url = getPerpetualInventorySignatureUrl();
      const payload: any = { signatureType: signatureType };
      if (isPerpetualInventorySignature) {
        payload.perpetualInventoryId = perpetualInventory.perpetualInventoryId;
      }

      if (!isPerpetualInventorySignature) {
        payload.perpetualInventoryDeductionId =
          perpetualInventory.perpetualInventoryDeductionId;
        payload.signatureType = signatureType;
      }

      const signatureData = await fetchData(url, payload);

      if (signatureData.status === 'error') {
        setSignature({
          isPerpetualInventory: isPerpetualInventorySignature,
          signatureType: signatureType
        });

        return;
      }
      setSignature({
        ...signatureData,
        isPerpetualInventory: isPerpetualInventorySignature,
        signatureType: signatureType
      });
    } catch (error) {}
  };

  const getCartsData = async (skipPerpCall: boolean = false) => {
    const url = getPerpetualInventoryCartsUrl();
    const payload = {};
    const result = await fetchData(url, payload);
    if (result.status !== 'error') {
      setCartsData(
        result.map((cart: TCartData) => {
          return { label: cart.cart, key: cart.cartId, value: cart.cartId };
        })
      );
      if (!skipPerpCall) {
        setSelectedCart(result[0].cartId);
        await getPerpetualInventory(
          { text: searchVal, cartId: result[0].cartId },
          pagination
        );
      }
    }
  };

  const getTransferCartsData = async () => {
    const url = getCartsUrl();
    const payload = {};
    const result = await fetchData(url, payload);
    if (result.status !== 'error') {
      setTransferCartsData(
        result.map((cart: TCartData) => {
          return { label: cart.cart, key: cart.cartId, value: cart.cartId };
        })
      );
    }
  };

  const chooseDeductionType = (
    perpetualInventory: TPerpetualInventoryDeduction
  ) => {
    switch (perpetualInventory.type) {
      case PERPETUAL_INVENTORY_DEDUCTION_TYPES.DOSE_ADMINISTERED:
        return 'Dose Administered';

      case PERPETUAL_INVENTORY_DEDUCTION_TYPES.WASTED:
        return 'Wasted';

      case PERPETUAL_INVENTORY_DEDUCTION_TYPES.DESTROYED:
        return 'Destroyed';

      case PERPETUAL_INVENTORY_DEDUCTION_TYPES.TRANSFERRED:
        return 'Transfered';

      case PERPETUAL_INVENTORY_DEDUCTION_TYPES.RETURNED_TO_PATIENT:
        return 'Returned To Patient';

      case PERPETUAL_INVENTORY_DEDUCTION_TYPES.RETURNED_TO_PROPERTY:
        return 'Returned To Property';

      default:
        return '';
    }
  };

  const onSelectCart = async (val: any) => {
    setSelectedCart(val);
    setSearchVal('');
    await getPerpetualInventory({ text: '', cartId: val }, pagination);
  };

  const onChangeFilters = async (val: any) => {
    const { cartId } = val;
    setSelectedCart(cartId);
    await getPerpetualInventory(
      { text: searchVal, cartId: cartId },
      pagination
    );
  };

  const onClickDownload = async () => {
    setIsLoading(true);
    const url = getAllPerpetualInventoryUrl();
    const data = await fetchData(url, {
      cartId: selectedCart
    });
    if (data && data.length > 0) {
      const mappedData = data.map((row: any) => {
        return {
          ...row,
          createdAt: dayjs(row.createdAt).format(DATE_FORMATS.YMD),
          dateTime:
            row.date && row.time
              ? `${dayjs(row.date).format(DATE_FORMATS.YMD)} ${row.time}`
              : null
        };
      });
      setPerpetualInventoryForCSV(mappedData);

      setTimeout(() => {
        downloadCsvLink?.current?.link?.click();
      });

      setIsLoading(false);

      return;
    }

    downloadCsvLink?.current?.link?.click();

    setIsLoading(false);
  };

  const onChangePagination = async (pageNumber: number, pageSize: number) => {
    const newPagination = {
      ...pagination,
      currentPage: pageNumber,
      perPage: pageSize
    };
    await getPerpetualInventory(
      { text: searchVal, cartId: selectedCart },
      newPagination
    );
  };

  const onClickPerpetualInventoryEdit = async (perpetualInventory: any) => {
    setPerpetualInventoryEditModalOpen(true);
    setSelectedPerpetualInventory(perpetualInventory);
  };

  const onClickPerpetualInventoryDelete = async (perpetualInventory: any) => {
    setPerpetualInventoryDeleteModalOpen(true);
    setSelectedPerpetualInventory(perpetualInventory);
  };

  const onClickDeduction = async (
    perpetualInventory: TPerpetualInventory,
    type: string
  ) => {
    formRef.setFieldValue('date', dayjs().format(DATE_FORMATS.MDY));
    formRef.setFieldValue('time', dayjs());
    setSelectedPerpetualInventory({
      ...perpetualInventory,
      deductionType: type
    });
    await getTransferCartsData();
    setDeductionModalOpen(true);
  };

  const onClickSignature = async (
    perpetual: any,
    signatureType: string,
    isPerpetualInventorySignature: boolean
  ) => {
    if (
      perpetual.staffSignature ||
      perpetual.witnessSignature ||
      perpetual.adminSignature
    ) {
      setSignature({
        isPerpetualInventory: isPerpetualInventorySignature,
        signatureType: signatureType
      });
      await getPerpetualInventoryInventorySignature(
        perpetual,
        signatureType,
        isPerpetualInventorySignature
      );
      setSignatureModalOpen(true);

      return;
    }
    isPerpetualInventorySignature && setSelectedPerpetualInventory(perpetual);
    setSignature({
      isPerpetualInventory: isPerpetualInventorySignature,
      signatureType: signatureType
    });
    setSignatureModalOpen(true);
  };

  const onClickPerpetualInventoryDeductionEdit = (
    perpetualInventoryDeduction: TPerpetualInventoryDeduction,
    perpetualInventory: TPerpetualInventory
  ) => {
    const dedType = chooseDeductionType(perpetualInventoryDeduction);
    setDeductionType(dedType);

    formRef.setFieldsValue({
      date: getFormattedDateNoTimeZone({
        date: perpetualInventoryDeduction.date,
        format: DATE_FORMATS.MDY
      }),
      time: dayjs(perpetualInventoryDeduction.time, 'HH:mm'),
      providerName: perpetualInventoryDeduction.providerName,
      patientName: perpetualInventoryDeduction.patientName,
      quantityDeducted: perpetualInventoryDeduction.quantityDeducted
    });

    formRef.setFieldValue(
      'perpetualInventoryDeductionId',
      perpetualInventoryDeduction.perpetualInventoryDeductionId
    );

    formRef.setFieldValue(
      'perpetualInventoryQtyOH',
      perpetualInventory.quantityAllocated
    );

    setPerpetualInventoryDeductionEditModalOpen(true);
  };

  const onClickPerpetualInventoryDeductionDelete = async (
    perpetualInventoryDeduction: TPerpetualInventoryDeduction
  ) => {
    formRef.resetFields();
    formRef.setFieldValue(
      'perpetualInventoryDeductionId',
      perpetualInventoryDeduction.perpetualInventoryDeductionId
    );

    setPerpetualInventoryDeductionDeleteModalOpen(true);
  };

  const onClickComment = async (
    perpetualInventoryDeduction: TPerpetualInventoryDeduction
  ) => {
    setSelectedPerpetualInventoryDeduction(perpetualInventoryDeduction);
    setCommentModalOpen(true);
  };

  const onClosePerpetualInventoryDeductionEditModal = () => {
    formRef.resetFields();
    setPerpetualInventoryDeductionEditModalOpen(false);
  };

  const onClosePerpetualInventoryDeductionDeleteModal = () => {
    formRef.resetFields();
    setPerpetualInventoryDeductionDeleteModalOpen(false);
  };

  const onClosePerpetualInventoryEditModal = () => {
    formRef.resetFields();
    setPerpetualInventoryEditModalOpen(false);
  };

  const onClosePerpetualInventoryDeleteModal = () => {
    formRef.resetFields();
    setPerpetualInventoryDeleteModalOpen(false);
  };

  const onCloseDeductionModal = () => {
    formRef.resetFields();
    setDeductionModalOpen(false);
  };

  const onCloseSignatureModal = () => {
    signatureFormref.resetFields();
    setSignatureModalOpen(false);
    setSignature({});
  };

  const onCloseCommentModal = () => {
    setCommentModalOpen(false);
    setSelectedPerpetualInventoryDeduction(undefined);
  };

  useEffect(() => {
    if (controlledDrugId) {
      window.history.pushState(null, '', '/controlsLogbook');
    }
    getCartsData();
  }, []);

  return (
    <div>
      <PerpetualInventoryLayout
        searching={searching}
        setSearching={setSearching}
        onSearch={handleSearch}
        getCartsData={getCartsData}
        cartsData={cartsData}
        setCartsData={setCartsData}
        selectedCart={selectedCart}
        onSelectCart={onSelectCart}
        onChangeFilters={onChangeFilters}
        onClickDownload={onClickDownload}
        isLoading={isLoading}
        perpetualInventories={perpetualInventories}
        pagination={pagination}
        onChangePagination={onChangePagination}
        onClickPerpetualInventoryEdit={onClickPerpetualInventoryEdit}
        onClickPerpetualInventoryDelete={onClickPerpetualInventoryDelete}
        onClickDeduction={onClickDeduction}
        onClickComment={onClickComment}
        onClickPerpetualInventoryDeductionEdit={
          onClickPerpetualInventoryDeductionEdit
        }
        onClickPerpetualInventoryDeductionDelete={
          onClickPerpetualInventoryDeductionDelete
        }
        onClickSignature={onClickSignature}
        formref={filtersformRef}
        searchVal={searchVal}
      />
      <PerpetualInventoryEditModal
        open={perpetualInventoryEditModalOpen}
        onCloseModal={onClosePerpetualInventoryEditModal}
        formRef={formRef}
        isLoading={isLoading}
        handlePerpetualInventoryEditSubmit={perpetualInventoryEdit}
        perpetualInventory={selectedPerpetualInventory as TPerpetualInventory}
      />
      <PerpetualInventoryDeleteModal
        open={perpetualInventoryDeleteModalOpen}
        onCloseModal={onClosePerpetualInventoryDeleteModal}
        deleteForm={formRef}
        onFinish={perpetualInventoryDelete}
        perpetualInventory={selectedPerpetualInventory as TPerpetualInventory}
      />
      <PerpetualInventoryDeductionEditModal
        open={perpInvDeductionEditModalOpen}
        onCloseModal={onClosePerpetualInventoryDeductionEditModal}
        editForm={formRef}
        deductionType={deductionType}
        onFinish={perpetualInventoryDeductionEdit}
      />
      <PerpetualInventoryDeductionDeleteModal
        open={perpInvDeductionDeleteModalOpen}
        onCloseModal={onClosePerpetualInventoryDeductionDeleteModal}
        deleteForm={formRef}
        onFinish={perpetualInventoryDeductionDelete}
      />
      <DeductionModal
        open={deductionModalOpen}
        onCloseModal={onCloseDeductionModal}
        deductionForm={formRef}
        isLoading={isLoading}
        perpetualInventory={selectedPerpetualInventory as TPerpetualInventory}
        handleDeductionSubmit={addPerpetualInventoryDeduction}
        carts={transferCartsData.filter(
          cD => cD.key != selectedPerpetualInventory?.cartId
        )}
        size={size}
      />
      <SignatureActionModal
        open={signatureModalOpen}
        onCloseModal={onCloseSignatureModal}
        signatureForm={signatureFormref}
        isLoading={isLoading}
        handleAdministerSubmit={addStaffSignature}
        signature={signature}
      />
      <CommentModal
        open={commentModalOpen}
        onCloseModal={onCloseCommentModal}
        perpetualInventoryDeduction={
          selectedPerpetualInventoryDeduction as TPerpetualInventoryDeduction
        }
      />
      <CSVLink
        enclosingCharacter={`"`}
        data={perpetualInventoryForCsv}
        headers={CSV_HEADERS.PERPETUAL_INVENTORY}
        filename={`Perpetual Inventory - ${cartsData.find(c => c.key === selectedCart)?.label} - ${getFormattedDateNoTimeZone({ format: DATE_FORMATS.FILE_DATE })}.csv`}
        ref={downloadCsvLink}
      />
    </div>
  );
};
