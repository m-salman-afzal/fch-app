'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Form } from 'antd';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';
import { CSVLink } from 'react-csv';

import { TCartData } from '@/types/cartTypes';
import { SelectOption, TPagination } from '@/types/commonTypes';
import {
  TPerpetualInventory,
  TPerpetualInventoryDeduction,
  TPerpetualInventoryFilters,
  TSignature
} from '@/types/perpetualInventoryTypes';

import { ArchiveLayout } from '@/components/controlsLogbook/archive/archiveLayout';
import { UnArchiveModal } from '@/components/controlsLogbook/archive/unArchiveModal';
import { CommentModal } from '@/components/controlsLogbook/perpetualInventory/perpetualInventoryDeductionActions/comment/commentModal';
import { SignatureActionModal } from '@/components/controlsLogbook/perpetualInventory/signatureAction/signatureModal';

import { useFetch } from '@/hooks/useFetch';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import {
  addStaffSignatureUrl,
  getAllPerpetualInventoryUrl,
  getPerpetualInventoryCartsUrl,
  getPerpetualInventorySignatureUrl,
  getPerpetualInventoryUrl
} from '@/utils/endpoints';
import { getFitlerValuesAndFilterAll } from '@/utils/getFiltersValuesAndFilterAll';

import {
  CSV_HEADERS,
  filterInitialValues,
  paginationInitialValues
} from './constants';

interface Props {}

export const ArchiveContainer: FC<Props> = ({}) => {
  const { isLoading, setIsLoading, fetchData, updateData } = useFetch();
  const downloadCsvLink = useRef<any>();

  const [commentModalOpen, setCommentModalOpen] = useState<boolean>(false);

  const [pagination, setPagination] = useState<TPagination>(
    paginationInitialValues
  );

  const [cartsData, setCartsData] = useState<SelectOption[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [selectedCart, setSelectedCart] = useState<any>('');
  const [perpetualInventories, setPerpetualInventories] = useState<any>([]);
  const [perpetualInventoryForCsv, setPerpetualInventoryForCSV] = useState([]);
  const [searchVal, setSearchVal] = useState<string>('');

  const [selectedPerpetualInventory, setSelectedPerpetualInventory] = useState<
    (TPerpetualInventory & Partial<{ deductionType: string }>) | undefined
  >(undefined);

  const [unarchiveOpen, setUnarchiveOpen] = useState(false);

  const [signature, setSignature] = useState<TSignature>({});

  const getPerpetualInventory = async (
    searchFilters: TPerpetualInventoryFilters,
    paginationInfo = pagination
  ) => {
    try {
      const url = getPerpetualInventoryUrl();
      const payload = {
        ...paginationInfo,
        ...searchFilters,
        isArchived: true,
        cartId: searchFilters.cartId ? searchFilters.cartId : selectedCart
      };

      const nfs = await fetchData(url, getFitlerValuesAndFilterAll(payload));
      if (nfs.status === 'error') {
        setPerpetualInventories([]);
        setPagination(paginationInitialValues);
      }

      if (nfs.rows) {
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
    } catch (error) {}
  };

  const handleSearch = (e: any) => {
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
    [selectedCart]
  );

  const getPerpetualInventoryInventorySignature = async (
    perpetualInventory: any,
    signatureType: string,
    isPerpetualInventorySignature: boolean
  ) => {
    try {
      const url = getPerpetualInventorySignatureUrl();
      const payload: any = { signatureType: signatureType, isArchived: true };
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
        isFirstLevel: isPerpetualInventorySignature,
        signatureType: signatureType
      });
    } catch (error) {}
  };

  const getCartsData = async () => {
    const url = getPerpetualInventoryCartsUrl();
    const payload = { isArchived: true };
    const result = await fetchData(url, payload);
    if (result.status !== 'error') {
      setSelectedCart(result[0].cartId);
      setCartsData(
        result.map((cart: TCartData) => {
          return { label: cart.cart, key: cart.cartId, value: cart.cartId };
        })
      );

      await getPerpetualInventory(
        { ...filterInitialValues, cartId: result[0].cartId, text: searchVal },
        pagination
      );
    }
  };

  const onCloseSignatureModal = () => {
    formRef.resetFields();
    setSignatureModalOpen(false);
    setSignature({});
  };

  const [
    selectedPerpetualInventoryDeduction,
    setSelectedPerpetualInventoryDeduction
  ] = useState<TPerpetualInventoryDeduction | undefined>(undefined);
  const onClickComment = async (
    perpetualInventoryDeduction: TPerpetualInventoryDeduction
  ) => {
    setSelectedPerpetualInventoryDeduction(perpetualInventoryDeduction);
    setCommentModalOpen(true);
  };

  const onSelectCart = async (val: any) => {
    setSelectedCart(val);
    setSearchVal('');
    const filters = { text: '', cartId: val };
    await getPerpetualInventory(filters, pagination);
  };

  const onChangeFilters = async (val: any) => {
    const { cartId } = val;
    setSelectedCart(cartId);
    const filters = { text: searchVal, cartId: cartId };
    await getPerpetualInventory(filters, pagination);
  };

  const onClickDownload = async () => {
    setIsLoading(true);
    const url = getAllPerpetualInventoryUrl();
    const data = await fetchData(url, {
      isArchived: true,
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

  const [signatureModalOpen, setSignatureModalOpen] = useState<boolean>(false);
  const [firstLevelEditModalOpen, setFirstLevelEditModalOpen] =
    useState<boolean>(false);

  const [filtersformRef] = Form.useForm();
  const [formRef] = Form.useForm();

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

  const onCloseCommentModal = () => {
    setCommentModalOpen(false);
    setSelectedPerpetualInventoryDeduction(undefined);
  };
  const handleUnarchive = async () => {
    if (!selectedPerpetualInventory) return;
    const res = await updateData(
      `${getPerpetualInventoryUrl()}/unarchive/${selectedPerpetualInventory?.perpetualInventoryId}`,
      {}
    );
    if (res?.status === 'error') {
      setSelectedPerpetualInventory(undefined);

      return;
    }
    await getPerpetualInventory(
      { cartId: selectedCart, text: searchVal },
      pagination
    );
    setSelectedPerpetualInventory(undefined);
    onCloseUnarchiveModal();
  };

  const handleUnarchiveOpen = (pi: TPerpetualInventory) => {
    setSelectedPerpetualInventory(pi);
    setUnarchiveOpen(true);
  };

  const onCloseUnarchiveModal = () => {
    setSelectedPerpetualInventory(undefined);
    setUnarchiveOpen(false);
  };

  useEffect(() => {
    getCartsData();
  }, []);

  return (
    <div>
      <ArchiveLayout
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
        onClickSignature={onClickSignature}
        formref={filtersformRef}
        setUnarchiveOpen={handleUnarchiveOpen}
        onClickComment={onClickComment}
        searchVal={searchVal}
      />

      <SignatureActionModal
        open={signatureModalOpen}
        onCloseModal={onCloseSignatureModal}
        signatureForm={formRef}
        isLoading={isLoading}
        signature={signature}
        handleAdministerSubmit={addStaffSignature}
      />
      <UnArchiveModal
        open={unarchiveOpen}
        onCloseModal={onCloseUnarchiveModal}
        isLoading={isLoading}
        drugName={selectedPerpetualInventory?.name ?? ''}
        controlledId={selectedPerpetualInventory?.controlledId ?? ''}
        onClickSave={handleUnarchive}
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
        filename={`Archive - ${cartsData.find(c => c.key === selectedCart)?.label} - ${getFormattedDateNoTimeZone({ format: DATE_FORMATS.FILE_DATE })}.csv`}
        ref={downloadCsvLink}
      />
    </div>
  );
};
