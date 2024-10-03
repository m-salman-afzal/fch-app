import { FC, useCallback, useEffect, useState } from 'react';
import { Form, Typography } from 'antd';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useConfirm } from 'vs-design-components/src/Components';

import { TPagination } from '@/types/commonTypes';
import { TRequest } from '@/types/fetchTypes';
import { Formulary } from '@/types/formularyTypes';
import { InventoryBulkUploadTypes } from '@/types/inventoryBulkUploadTypes';
import {
  Inventory,
  TInventoryFilters,
  TInventoryGetRequest
} from '@/types/inventoryTypes';

import { usePillStyle } from '@/components/common/colorfulPill/usePillStyle';
import FilterTags from '@/components/common/filterTags/filterTags';
import { InventoryBulkUpload } from '@/components/inventory/bulkUpload/inventoryBulkUploadModal';
import { SetLevelsBulkUpload } from '@/components/inventory/bulkUpload/setlevelsBulkUploadModal';
import { ReceiveInventoryModalWithSteps } from '@/components/inventory/firstLevelOptions/dynamicInventoryModal/receiveInventoryModalWithSteps';
import { RecieveInventoryModal } from '@/components/inventory/firstLevelOptions/recieveInventoryModal';
import { SetLevelsModal } from '@/components/inventory/firstLevelOptions/setLevelsModal';
import { getInventoryColumns } from '@/components/inventory/getInventoryColums';
import nestedRowRender from '@/components/inventory/getInventoryNestedRows';
import { ANTIRETROVIRAL } from '@/components/inventory/getNdcNestedControlledIdRows';
import InventoryActions from '@/components/inventory/inventoryActions';
import InventoryTable from '@/components/inventory/inventoryTable';
import MobileInventoryActions from '@/components/inventory/mobileInventoryActions';
import { EditControlIDModal } from '@/components/inventory/secondLevelModals/editControlIdModal';
import { useInventoryLevelsStyle } from '@/components/inventory/useInventoryLevelsStyle';
import { useInventoryTableStyle } from '@/components/inventory/useInventoryTableStyle';

import DELETEICON from '@/assets/icons/common/deleteModal.svg';
import FLAG_ICON from '@/assets/icons/formulary/flagIcon.svg';
import POWER_ICON from '@/assets/icons/formulary/powerIconinfo.svg';
import useCookies from '@/hooks/useCookies';
import { useFacility } from '@/hooks/useFacility';
import { useFetch } from '@/hooks/useFetch';
import { useCommonStyles } from '@/styles/useCommonStyles';
import {
  ALL,
  ALL_OPTION,
  ANONYMOUS_TYPE_OPTIONS,
  BULK_INVENTORY_FILE_PROCESSES,
  DEFAULT_PAGE_SIZE,
  EXPIRED_NDC_CSV_COLUMS,
  FILE_EXTENSIONS,
  INVENTORY_BULK_OPTIONS,
  INVENTORY_COLUMN_HEADERS,
  NDC_STATUS,
  PERMISSIONS_TYPES,
  TOAST_DURATION,
  TOAST_GENERIC_ERROR_MESSAGE,
  TOAST_MESSAGES
} from '@/utils/constants';
import {
  DATE_FORMATS,
  getDateDiff,
  getFormattedDateNoTimeZone,
  getIsAfterDate
} from '@/utils/dateFormatsTimezones';
import {
  bulkUpsertFormularylevelsUrl,
  bulkUpsertInventoryUrl
} from '@/utils/endpoints';
import { getFitlerValuesAndFilterAll } from '@/utils/getFiltersValuesAndFilterAll';
import {
  pxToRem,
  toBase64File,
  tranformNullToString
} from '@/utils/sharedUtils';
import ShowToast from '@/utils/showToast';
import {
  API_BASE_URL,
  CARTS_URL,
  FORMULARY_URL,
  INVENTORY_URL
} from '@/utils/urls';

const filterInitalValue = {
  controlled: ALL,
  depleted: ALL,
  pending: ALL,
  status: ALL,
  isFormulary: ALL,
  isStock: ALL
} as const;
interface Props {}

const InventoryContainer: FC<Props> = ({}) => {
  const isSmall = window.screen.width <= 576;
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const [formularyId, setFormularyId] = useState<string | null>(
    params.get('formularyId')
  );

  const paginationInitialValues = {
    currentPage: 1,
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  };
  const { currentFacility } = useFacility();
  const admin = useCookies().getDataFromCookie();
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    columnHeaders: INVENTORY_COLUMN_HEADERS,
    filename: `FCH Inventory - ${currentFacility.facilityName} - ${getFormattedDateNoTimeZone({ format: DATE_FORMATS.FILE_DATE })}`
  });

  const expiredNdcCsvConfig = mkConfig({
    columnHeaders: EXPIRED_NDC_CSV_COLUMS,
    fieldSeparator: ',',
    filename: `Expired NDCs - ${currentFacility.facilityName} - ${getFormattedDateNoTimeZone({ format: DATE_FORMATS.FILE_DATE })}`
  });

  const [pagination, setPagination] = useState<TPagination>({
    currentPage: 1,
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  });
  const [formularyData, setFormularyData] = useState<Formulary[]>([]);
  const [carts, setCarts] = useState<any[]>([]);
  const [receiveInventoryForm] = Form.useForm();
  const [uploadForm] = Form.useForm();
  const [filtersFormRef] = Form.useForm<TInventoryFilters>();
  const [searchFilters, setSearchFilters] = useState<TInventoryFilters>({
    ...filterInitalValue,
    status: 'active',
    isFormulary: 'true',
    isStock: 'true',
    depleted: 'no'
  });
  const [searchName, setSearchName] = useState<string>('');
  const [showInventoryModal, setShowInventoryModal] = useState<boolean>(false);
  const [showLevelsModal, setShowLevelsModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showEditControlIdModal, setShowEditControlIdModal] =
    useState<boolean>(false);
  const [selectedFormulary, setSelectedFormulary] = useState<Formulary | null>(
    null
  );
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(
    null
  );
  const [levelsData, setLevelsData] = useState<Formulary | null>(null);
  const [editData, setEditData] = useState<
    (Inventory & { isControlled: boolean }) | null
  >(null);
  const [controlledIdEditData, setControlledIdEditData] = useState<any>(null);
  const [controlledExpandedKeys, setControlledExpandedKeys] = useState<any[]>(
    []
  );
  const [bulkUploadOption, setBulkUploadOption] =
    useState<InventoryBulkUploadTypes>({ bulkUploadType: '' });

  const {
    inventoryNestedContainer,
    controlledIdsNestedContainer,
    controlledIdsNestedContainerTr,
    rowExpandableHide
  } = useInventoryTableStyle();
  const { redPill, greenPill, greyPill } = usePillStyle();
  const { toolTipContainer } = useInventoryLevelsStyle();
  const pillClasses = {
    red: redPill,
    green: greenPill,
    grey: greyPill
  };

  const {
    fetchData,
    isLoading,
    postData,
    deleteData,
    updateData,
    setIsLoading,
    fetchMultiple
  } = useFetch();

  const [levelsForm] = Form.useForm();
  const [inventoryForm] = Form.useForm();
  const [controlIdForm] = Form.useForm();
  const { confirm } = useConfirm();

  const isControlledAvailable =
    admin?.rbac.formularyNonControlled !== PERMISSIONS_TYPES.HIDE &&
    admin?.rbac.formularyControlled !== PERMISSIONS_TYPES.HIDE;

  const onClickRecieve = (data: Formulary) => {
    setSelectedFormulary(data);
    setSteps(getSteps(!data.parLevel, !!data.isControlled));
    setShowInventoryModal(true);
  };
  const onClickSetLevels = (data: Formulary) => {
    if (data) {
      levelsForm.setFieldValue(['levels', 'parLevel'], data.parLevel);
      levelsForm.setFieldValue(['levels', 'threshold'], data.threshold);
      levelsForm.setFieldValue(['levels', 'minLevel'], data.min);
      levelsForm.setFieldValue(['levels', 'maxLevel'], data.max);
      levelsForm.setFieldValue(['levels', 'isStock'], data.isStock || false);
    }
    setLevelsData(data);
    setSelectedFormulary(data);
    setShowLevelsModal(true);
  };
  const onClickSetStock = async (data: Formulary, key?: any) => {
    if (data.isStock === null || data.isStock === undefined) {
      const res = await postData(`${API_BASE_URL}${FORMULARY_URL}/level`, {
        isStock: key === 1 ? true : false,
        formularyId: data.formularyId,
        facilityId: currentFacility.facilityId
      });
    } else {
      const res = await postData(`${API_BASE_URL}${FORMULARY_URL}/level`, {
        isStock: !data.isStock,
        formularyId: data.formularyId,
        facilityId: currentFacility.facilityId
      });
    }

    await getInventoryData(pagination, searchFilters, searchName);
  };

  const onFinishLevelsForm = async (data: any) => {
    setIsLoading(true);
    const storeData = {
      min: Number(data.levels.minLevel),
      max: Number(data.levels.maxLevel),
      parLevel: Number(data.levels.parLevel),
      threshold: Number(data.levels.threshold),
      formularyId: levelsData?.formularyId,
      isStock: data.levels?.isStock
    };
    await postData(`${API_BASE_URL}${FORMULARY_URL}/level`, {
      ...storeData,
      facilityId: currentFacility.facilityId
    });

    setIsLoading(false);
    levelsForm.resetFields();
    setShowLevelsModal(false);
    await getInventoryData(pagination, searchFilters, searchName);
  };

  const onFinishEditInventory = async (data: any) => {
    setIsLoading(true);
    const dataToSend = {
      ...data.inventory,
      quantity: data?.inventory?.quantity
        ? Number(data.inventory.quantity)
        : undefined,
      expirationDate: getFormattedDateNoTimeZone({
        date: data.inventory.expirationDate,
        format: DATE_FORMATS.YMD
      }),
      isActive: getIsAfterDate(
        getFormattedDateNoTimeZone({
          date: data.inventory.expirationDate,
          endOf: 'day'
        }),
        getFormattedDateNoTimeZone({ startOf: 'day' })
      )
        ? true
        : false
    };
    const res = await updateData(
      `${API_BASE_URL}${INVENTORY_URL}/${editData?.inventoryId}`,
      dataToSend
    );

    setShowEditModal(false);

    if (res.status === 'error') {
      ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error');

      setIsLoading(false);

      return;
    }

    setIsLoading(false);
    await getInventoryData(
      pagination,
      { ...searchFilters, formularyId: formularyId as string },
      searchName
    );
    handleCancelEdit();
  };

  const onFinishEditControlId = async (data: any) => {
    setIsLoading(true);
    const res = await updateData(
      `${API_BASE_URL}${INVENTORY_URL}/controlledDrug/${controlledIdEditData?.controlledDrugId}`,
      {
        ...data,
        controlledQuantity: Number(data?.controlledQuantity)
      }
    );

    if (res.status === 'error') {
      ShowToast(TOAST_GENERIC_ERROR_MESSAGE, 'error');
      setIsLoading(false);

      return;
    }
    setIsLoading(false);
    await getInventoryData(pagination, searchFilters, searchName);
    handleCancelControlIdEdit();
  };

  const InventoryColumns = getInventoryColumns(
    pillClasses,
    toolTipContainer,
    onClickRecieve,
    onClickSetLevels,
    onClickSetStock,
    admin?.rbac?.inventory,
    isControlledAvailable
  );

  const {
    deleteFamilyMemberConfirmIcon,
    deleteFamilyMemberConfirmIconContainer
  } = useCommonStyles();

  const onClickEdit = (data: Inventory, parent: Formulary) => {
    setEditData({ ...data, isControlled: parent.isControlled });

    inventoryForm.setFieldValue(['inventory', 'ndc'], data.ndc);
    inventoryForm.setFieldValue(
      ['inventory', 'manufacturer'],
      data.manufacturer
    );
    inventoryForm.setFieldValue(['inventory', 'lotNo'], data.lotNo);
    inventoryForm.setFieldValue(
      ['inventory', 'expirationDate'],
      new Date(
        getFormattedDateNoTimeZone({
          date: data.expirationDate,
          startOf: 'day'
        })
      )
    );
    inventoryForm.setFieldValue(['inventory', 'quantity'], data.quantity);
    inventoryForm.setFieldValue(
      ['inventory', 'controlledId'],
      data.controlledId
    );

    setShowEditModal(true);
  };

  const onClickControlledIdEdit = (data: any, parent: any) => {
    setControlledIdEditData({
      ...data,
      drugClass: parent.drugClass,
      formularyId: parent.formularyId,
      inventoryId: parent.inventoryId
    });
    controlIdForm.setFieldsValue({
      controlledId: data?.controlledId,
      controlledQuantity: data?.controlledQuantity
    });
    if (parent.drugCalss !== ANTIRETROVIRAL) {
      controlIdForm.setFieldsValue({
        tr: data?.tr
      });
    }

    setSelectedFormulary(parent);
    setShowEditControlIdModal(true);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    inventoryForm.resetFields();
    setEditData(null);
  };

  const handleCancelControlIdEdit = () => {
    setShowEditControlIdModal(false);
    controlIdForm.resetFields();
    setControlledIdEditData(null);
  };

  const onClickActivate = (data: Inventory, parentValues: Formulary) => {
    const { name } = parentValues;
    const { ndc } = data;
    confirm({
      onOk: async () => {
        const res = await updateData(
          `${API_BASE_URL}${INVENTORY_URL}/${data.inventoryId}`,
          { isActive: !data.isActive }
        );
        if (res?.status !== 'error') {
          await getInventoryData(
            pagination,
            { ...searchFilters, formularyId: formularyId as string },
            searchName
          );
        }
      },
      text: (
        <>
          <Typography.Paragraph
            style={{
              fontSize: pxToRem(20),
              fontWeight: 600,
              width: pxToRem(277),
              textAlign: 'center',
              marginBlockEnd: 0,
              marginBottom: pxToRem(16)
            }}
          >
            {data.isActive
              ? `Are you sure you want to deactivate this NDC?`
              : `Are you sure you want to activate this NDC?`}
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
            {`${name}`}
          </Typography.Text>
          <Typography.Text
            style={{
              fontSize: pxToRem(14),
              fontWeight: 400,
              color: 'rgba(0, 0, 0, 0.65)',
              marginBlockEnd: 0,
              marginLeft: pxToRem(5)
            }}
          >
            NDC:{' '}
            <span
              style={{
                color: 'rgba(0, 0, 0, 0.88)'
              }}
            >{`${ndc}`}</span>
          </Typography.Text>
        </>
      ),
      type: data.isActive ? `destructive` : `info`,
      okText: 'Yes',
      cancelText: 'No',
      icon: (
        <div className={deleteFamilyMemberConfirmIconContainer}>
          <Image
            alt={'MSG'}
            src={data.isActive ? FLAG_ICON : POWER_ICON}
            className={deleteFamilyMemberConfirmIcon}
            fill
          />
        </div>
      )
    });
  };

  const onClickDelete = (data: Inventory, parentValues: Formulary) => {
    const { name } = parentValues;
    const { ndc } = data;
    confirm({
      onOk: async () => {
        const res = await deleteData(
          `${API_BASE_URL}${INVENTORY_URL}/${data.inventoryId}`
        );

        if (res?.status !== 'error') {
          setFormularyId(null);
          setSearchName('');
          await getInventoryData(pagination, searchFilters, searchName);
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
              width: pxToRem(277),
              textAlign: 'center',
              marginBlockEnd: 0,
              marginBottom: pxToRem(16)
            }}
          >
            {`Are you sure you want to delete this NDC?`}
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
            {`${name}`}
          </Typography.Text>
          <Typography.Text
            style={{
              fontSize: pxToRem(14),
              fontWeight: 400,
              color: 'rgba(0, 0, 0, 0.65)',
              marginBlockEnd: 0,
              marginLeft: pxToRem(5)
            }}
          >
            NDC:{' '}
            <span
              style={{
                color: 'rgba(0, 0, 0, 0.88)'
              }}
            >{`${ndc}`}</span>
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

  const onClickControlledIdDelete = (data: any, parentValues: any) => {
    const { name } = parentValues;
    const { controlledDrugId, controlledId } = data;
    confirm({
      onOk: async () => {
        const res = await deleteData(
          `${API_BASE_URL}${INVENTORY_URL}/controlledDrug/${controlledDrugId}`
        );

        if (res?.status !== 'error') {
          await getInventoryData(pagination, searchFilters, searchName);
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
            {`Are you sure you want to delete this Controlled ID?`}
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
            {`${name}`}
          </Typography.Text>
          <Typography.Text
            style={{
              fontSize: pxToRem(14),
              fontWeight: 400,
              color: 'rgba(0, 0, 0, 0.65)',
              marginBlockEnd: 0,
              marginLeft: pxToRem(5)
            }}
          >
            Controlled ID:{' '}
            <span
              style={{
                color: 'rgba(0, 0, 0, 0.88)'
              }}
            >{`${controlledId}`}</span>
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

  const expandedRenderer = nestedRowRender(
    pillClasses,
    inventoryNestedContainer,
    onClickEdit,
    onClickDelete,
    onClickActivate,
    controlledExpandedKeys,
    setControlledExpandedKeys,
    { controlledIdsNestedContainer, controlledIdsNestedContainerTr },
    onClickControlledIdDelete,
    onClickControlledIdEdit,
    rowExpandableHide,
    admin?.rbac?.inventory
  );

  const bulkUploadSetLevels = async (values: any) => {
    const { file } = values;

    const fileContent = (await toBase64File(
      file.fileList[0].originFileObj
    )) as string;
    const content = fileContent.split('base64,')[1];
    const fileNameArray = file.file.name.split('.');
    fileNameArray.pop();

    const uploadCsv = await postData(bulkUpsertFormularylevelsUrl(), {
      fileContent: content,
      fileExtension: FILE_EXTENSIONS.CSV,
      fileName: fileNameArray.join('.'),
      process: 'BULK_ADD_FORMULARY_LEVELS',
      repository: 'FORMULARY_LEVELS'
    });

    if (uploadCsv.status === 'error') {
      return ShowToast(
        TOAST_MESSAGES.ERROR.FILE_UPLOAD,
        'error',
        TOAST_DURATION
      );
    }

    setBulkUploadOption({ bulkUploadType: '' });
  };

  const buildFilterValue = (
    filter: string,
    trueValue: string,
    falseValue: string
  ): string | undefined => {
    if (filter === trueValue) return 'true';
    if (filter === falseValue) return 'false';

    return filter;
  };

  const mapFormularyData = (data: Formulary[]) => {
    return data.map((data: any) => {
      const { isControlled, drugClass, name } = data.formulary;
      const formattedInventory = data.inventory.map((inv: any) => {
        return {
          ...inv,
          isControlled,
          drugClass,
          key: inv?.inventoryId,
          name,
          controlledDrug: inv?.controlledDrug?.map((contDrug: any) => {
            return {
              ...contDrug,
              key: contDrug?.controlledDrugId
            };
          }),
          quantity: isControlled
            ? inv?.controlledDrug
                ?.map((ele: any) => ele.controlledQuantity)
                ?.reduce((a: any, b: any) => a + b, 0)
            : inv?.quantity
        };
      });

      return {
        ...data.formulary,
        ...data.formularyLevel,
        key: data.formulary.formularyId,
        inventory: formattedInventory.sort((prev: any, current: any) => {
          return -getDateDiff(
            getFormattedDateNoTimeZone({
              date: current.expirationDate,
              startOf: 'day'
            }),
            getFormattedDateNoTimeZone({
              date: prev.expirationDate,
              startOf: 'day'
            })
          );
        }),
        orderedQuantity: data.orderedQuantity,
        totalQuantity: formattedInventory
          ?.map((ele: any) => ele.quantity)
          ?.reduce((a: any, b: any) => a + b, 0)
      };
    });
  };

  const getInitialData = async () => {
    const requestNames = {
      INVENTORY: 'inventory',
      CART: 'carts'
    };
    const requests: TRequest<TInventoryGetRequest>[] = [
      {
        requestName: requestNames.INVENTORY,
        url: `${API_BASE_URL}${INVENTORY_URL}`,
        payload: {
          ...pagination,
          ...getFitlerValuesAndFilterAll(
            getPayload({
              formularyId,
              ...searchFilters
            })
          )
        }
      },

      {
        url: `${API_BASE_URL}${CARTS_URL}`,
        requestName: requestNames.CART,
        payload: {
          currentPage: 1,
          perPage: 1000
        }
      }
    ];
    const responses = await fetchMultiple(requests);

    const inventoryResponseValues = responses.find(
      res => res.requestName === requestNames.INVENTORY
    )?.value;

    const cartResponseValues = responses.find(
      res => res.requestName === requestNames.CART
    )?.value;

    setPagination(paginationInitialValues);
    setCarts([]);
    setFormularyData([]);

    if (inventoryResponseValues) {
      setPagination({
        ...pagination,
        ...inventoryResponseValues.paginationInfo
      });
      const mappedFormularyData = mapFormularyData(
        inventoryResponseValues.rows
      );
      setFormularyData(mappedFormularyData);

      if (formularyId) {
        setSearchName(mappedFormularyData[0].name);
      }
    }

    if (cartResponseValues) {
      setCarts(
        cartResponseValues.rows.map((row: any) => ({
          ...row,
          key: row.cartId,
          value: row.cartId,
          label: row?.cart
        }))
      );
    }
  };

  const getPayload = (searchFilters: any, name?: string) => {
    return searchFilters.formularyId
      ? {
          formularyId: searchFilters.formularyId
        }
      : {
          name,
          isActive: buildFilterValue(
            searchFilters.status,
            'active',
            'inactive'
          ),
          isStock:
            searchFilters.isStock === 'All' ? undefined : searchFilters.isStock,
          isControlled:
            searchFilters.controlled === 'All'
              ? undefined
              : searchFilters.controlled,
          isFormulary:
            searchFilters.isFormulary === 'All'
              ? undefined
              : searchFilters.isFormulary,
          isDepleted: buildFilterValue(searchFilters.depleted, 'yes', 'no'),
          isPendingOrder: buildFilterValue(
            searchFilters.pending,
            'pending',
            'nonPending'
          )
        };
  };

  const getInventoryData = async (
    pagination: TPagination,
    searchFilters: TInventoryFilters,
    name: string
  ) => {
    try {
      setIsLoading(true);

      setPagination(paginationInitialValues);

      const response = await fetchData(`${API_BASE_URL}${INVENTORY_URL}`, {
        ...pagination,
        ...getFitlerValuesAndFilterAll(getPayload(searchFilters, name))
      });

      if (response.status === 'error') {
        setFormularyData([]);
        setPagination({
          ...pagination,
          totalItems: 0,
          totalPages: 0
        });
        setIsLoading(false);

        return;
      }

      setPagination({
        ...pagination,
        ...response.paginationInfo
      });
      setFormularyData(mapFormularyData(response.rows));

      if (searchFilters.formularyId) {
        setSearchName(response.rows[0].formulary.name);
      }

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const onSearchCarts = async (search: string) => {
    try {
      const url = `${API_BASE_URL}${CARTS_URL}`;
      const response = await fetchData(url, {
        cart: search,
        currentPage: 1,
        perPage: 1000
      });
      if (response?.rows?.length > 0) {
        setCarts(
          response.rows.map((row: any) => ({
            ...row,
            key: row.cartId,
            value: row.cartId,
            label: row?.cart
          }))
        );
      }
    } catch (error) {
      setCarts([]);
    }
  };

  const onChangePagination = (pageNumber: number, pageSize: number) => {
    const newPaginatedData = {
      ...pagination,
      currentPage: pageNumber,
      perPage: pageSize
    };
    getInventoryData(newPaginatedData, searchFilters, searchName);
    setPagination(newPaginatedData);
  };

  const onApplyFilter = (values: any, reset?: boolean) => {
    const tempFilters = {
      ...searchFilters,
      ...values,
      isFormulary:
        values.isFormulary === 'All' ? undefined : values.isFormulary,
      depleted: values.status === 'none' ? undefined : values.depleted,
      pending: values.status === 'none' ? undefined : values.pending,
      controlled: values.controlled === 'All' ? undefined : values.controlled
    };

    const name = formularyId ? '' : searchName;
    if (formularyId) {
      setFormularyId(null);
      setSearchName('');
    }
    if (reset) {
      return;
    }
    setSearchFilters(tempFilters);
    getInventoryData(
      { ...paginationInitialValues, perPage: pagination.perPage },
      tempFilters,
      name
    );
  };
  const handleSearch = (e: any) => {
    setFormularyId(null);
    setSearchName(e.target.value);
    handleSearchCallback(e);
  };

  const handleSearchCallback = useCallback(
    debounce(e => {
      getInventoryData(paginationInitialValues, searchFilters, e.target.value);
    }, 500),
    [searchFilters]
  );

  const getBulkUploadProcess = () => {
    const {
      NON_CONTROLLED_ADD,
      NON_CONTROLLED_EDIT_DELETE,
      CONTROLLED_ADD,
      CONTROLLED_ADD_EDIT_DELETE
    } = BULK_INVENTORY_FILE_PROCESSES;

    const processMapping: any = {
      add: bulkUploadOption.isControlled ? CONTROLLED_ADD : NON_CONTROLLED_ADD,
      editAndDelete: bulkUploadOption.isControlled
        ? CONTROLLED_ADD_EDIT_DELETE
        : NON_CONTROLLED_EDIT_DELETE
    };

    if (!bulkUploadOption.action) {
      return '';
    }

    return processMapping[bulkUploadOption.action];
  };
  const onFinishbulkUploadForm = async (values: any) => {
    const { file } = values;
    const {} = BULK_INVENTORY_FILE_PROCESSES;

    const fileContent = (await toBase64File(
      file.fileList[0].originFileObj
    )) as string;
    const content = fileContent.split('base64,')[1];
    const fileNameArray = file.file.name.split('.');
    fileNameArray.pop();

    const uploadCsv = await postData(bulkUpsertInventoryUrl(), {
      fileContent: content,
      fileExtension: FILE_EXTENSIONS.CSV,
      fileName: fileNameArray.join('.'),
      process: getBulkUploadProcess(),
      repository: 'INVENTORY'
    });

    if (uploadCsv.status === 'error') {
      return ShowToast(
        TOAST_MESSAGES.ERROR.FILE_UPLOAD,
        'error',
        TOAST_DURATION
      );
    }
    setBulkUploadOption({ bulkUploadType: '' });
  };

  useEffect(() => {
    if (formularyId) {
      window.history.pushState(null, '', '/inventory');
    }
    getInitialData();
  }, []);

  const getInventoryCSV = async (isExpired?: boolean) => {
    const response = await fetchData(
      `${API_BASE_URL}${INVENTORY_URL}/fetchAll`,
      {
        pastExpiry: isExpired ? isExpired : undefined
      }
    );

    if (response?.length > 0) {
      if (isExpired) {
        const csv = generateCsv(expiredNdcCsvConfig)(
          response
            .filter((res: Inventory) => !!res.ndc)
            .map((filtered: any) => ({
              ...filtered,
              expirationDate: getFormattedDateNoTimeZone({
                date: filtered.expirationDate,
                format: DATE_FORMATS.MDY
              }),
              controlledId: filtered.controlledId ?? 'N/A',
              quantity: filtered.quantity ?? undefined
            }))
        );

        download(expiredNdcCsvConfig)(csv);

        return;
      }
      const csv = generateCsv(csvConfig)(
        response
          .map((res: any) => ({
            ...res,
            expirationDate:
              getFormattedDateNoTimeZone({
                date: res.expirationDate,
                format: DATE_FORMATS.MDY
              }) === 'Invalid Date'
                ? ''
                : getFormattedDateNoTimeZone({
                    date: res.expirationDate,
                    format: DATE_FORMATS.MDY
                  })
          }))
          .map((res: any) => tranformNullToString(res))
      );

      download(csvConfig)(csv);
    } else {
      if (isExpired) {
        const csv = generateCsv(expiredNdcCsvConfig)([]);
        download(expiredNdcCsvConfig)(csv);

        return;
      }
      const csv = generateCsv(csvConfig)([]);
      download(csvConfig)(csv);
    }

    return;
  };

  const [steps, setSteps] = useState<{ title: string }[]>([]);

  const [currentInventoryFormStep, setCurrentInventoryFormStep] =
    useState<number>(0);

  const [inventoryFormData, setInventoryFormData] = useState<any>({});

  const onSubmitInventoryForm = async (data: any) => {
    const newFormData = { ...inventoryFormData, ...data };

    setInventoryFormData(newFormData);

    if (currentInventoryFormStep < steps.length - 1) {
      setCurrentInventoryFormStep(x => x + 1);

      return;
    }

    const levelsPayload = newFormData.levels
      ? {
          ...newFormData.inventory.levels,
          min: Number(newFormData.levels.minLevel),
          max: Number(newFormData.levels.maxLevel),
          parLevel: Number(newFormData.levels.parLevel),
          threshold: Number(newFormData.levels.threshold),
          isStock: newFormData.levels.isStock
        }
      : undefined;

    const inventoryPayload = newFormData.inventory
      ? {
          ...newFormData.inventory,
          quantity: Number(newFormData.inventory.quantity),
          expirationDate: getFormattedDateNoTimeZone({
            date: newFormData.inventory.expirationDate,
            format: DATE_FORMATS.YMD
          }),
          controlledType: newFormData.controlledType
        }
      : undefined;

    const signaturesPayload = newFormData.consent
      ? {
          ...newFormData.consent,
          signature: {
            witnessSignature: newFormData.consent.witnessSignature,
            receiverSignature: newFormData.consent.receiverSignature
          }
        }
      : undefined;

    const payload = {
      ...levelsPayload,
      ...inventoryPayload,
      ...signaturesPayload,
      formularyId: selectedFormulary?.formularyId
    };

    const res = await postData(`${API_BASE_URL}${INVENTORY_URL}`, payload);
    onCloseReceiveInventoryModal();
    await getInventoryData(pagination, searchFilters, searchName);
  };

  const onCloseReceiveInventoryModal = () => {
    receiveInventoryForm.resetFields();
    setInventoryFormData({});
    setCurrentInventoryFormStep(0);
    setShowInventoryModal(false);
  };

  const onClickBackButton = () => {
    setCurrentInventoryFormStep(x => x - 1);
  };

  const onChangeStepNumber = async (currentStep: number) => {
    if (currentStep < currentInventoryFormStep) {
      setCurrentInventoryFormStep(currentStep);
    }
    if (currentStep > currentInventoryFormStep) {
      try {
        await receiveInventoryForm.validateFields();
        setInventoryFormData({
          ...inventoryFormData,
          ...receiveInventoryForm.getFieldsValue()
        });
        setCurrentInventoryFormStep(currentStep);
      } catch (error) {
        return;
      }
    }
  };

  const getSteps = (setLevels: boolean, isControlled: boolean) => {
    const steps: { title: string }[] = [];
    if (setLevels) {
      steps.push({
        title: 'Set Levels'
      });
    }

    steps.push({
      title: 'Inventory Details'
    });

    if (isControlled) {
      steps.push({
        title: 'Signatures'
      });
    }

    return steps;
  };

  return (
    <>
      {isSmall ? (
        <MobileInventoryActions
          setBulkUploadOption={setBulkUploadOption}
          bulkUploadOption={bulkUploadOption.bulkUploadType}
          showControlled={isControlledAvailable}
          filtersFormRef={filtersFormRef}
          uploadForm={uploadForm}
          onApplyFilter={onApplyFilter}
          handleSearch={handleSearch}
          onFinishbulkUploadForm={onFinishbulkUploadForm}
          getInventoryCsv={getInventoryCSV}
          formularyId={formularyId as string}
          drugName={searchName}
        />
      ) : (
        <InventoryActions
          setBulkUploadOption={setBulkUploadOption}
          bulkUploadOption={bulkUploadOption.bulkUploadType}
          showControlled={isControlledAvailable}
          filtersFormRef={filtersFormRef}
          uploadForm={uploadForm}
          onApplyFilter={onApplyFilter}
          handleSearch={handleSearch}
          onFinishbulkUploadForm={onFinishbulkUploadForm}
          getInventoryCsv={getInventoryCSV}
          formularyId={formularyId as string}
          drugName={searchName}
        />
      )}

      <FilterTags<TInventoryFilters>
        filterForm={filtersFormRef}
        filterState={searchFilters}
        filterInitialValues={filterInitalValue}
        onChangeFilters={values => {
          onApplyFilter(values, false);
        }}
        customKeys={{
          status: 'NDC Status',
          pending: 'Pending Receipts',
          isFormulary: 'Formulary',
          controlled: 'Controlled',
          isStock: 'Central Supply',
          depleted: 'Depleted'
        }}
        customMapForSelect={{
          isFormulary: [ALL_OPTION, ...ANONYMOUS_TYPE_OPTIONS],
          controlled: [ALL_OPTION, ...ANONYMOUS_TYPE_OPTIONS],
          isStock: [ALL_OPTION, ...ANONYMOUS_TYPE_OPTIONS]
        }}
        excludeKeys={{
          formularyId: true
        }}
        repositoryId={formularyId}
      />
      <InventoryTable
        paginationData={pagination}
        inventoryColumns={InventoryColumns.filter((col: any) => col.key)}
        firstLevelData={formularyData}
        isLoading={isLoading}
        nestedRowRender={expandedRenderer}
        onChangePagination={onChangePagination}
        formularyId={formularyId as string}
      />

      {selectedFormulary &&
        (!!selectedFormulary.isControlled || !selectedFormulary.parLevel ? (
          steps.length > 0 && (
            <ReceiveInventoryModalWithSteps
              open={showInventoryModal}
              isLoading={isLoading}
              formRef={receiveInventoryForm}
              onCloseInventoryModal={onCloseReceiveInventoryModal}
              handleFormSubmit={onSubmitInventoryForm}
              currentInventoryFormStep={currentInventoryFormStep}
              onChangeStepNumber={onChangeStepNumber}
              onClickBackButton={onClickBackButton}
              formData={selectedFormulary}
              carts={carts}
              steps={steps}
            />
          )
        ) : (
          <RecieveInventoryModal
            showModal={showInventoryModal}
            onFinish={onSubmitInventoryForm}
            handleCancel={onCloseReceiveInventoryModal}
            form={inventoryForm}
            formData={selectedFormulary}
            isLoading={isLoading}
          />
        ))}

      {selectedFormulary && editData && (
        <RecieveInventoryModal
          showModal={showEditModal}
          onFinish={onFinishEditInventory}
          handleCancel={handleCancelEdit}
          form={inventoryForm}
          formData={editData}
          isLoading={isLoading}
          isEdit
        />
      )}
      {selectedFormulary && showEditControlIdModal && (
        <EditControlIDModal
          showModal={showEditControlIdModal}
          handleCancel={handleCancelControlIdEdit}
          form={controlIdForm}
          onFinish={onFinishEditControlId}
          isLoading={isLoading}
          drugClass={controlledIdEditData?.drugClass}
          formData={selectedFormulary}
        />
      )}
      {selectedFormulary && (
        <SetLevelsModal
          isLoading={isLoading}
          form={levelsForm}
          onFinish={onFinishLevelsForm}
          open={showLevelsModal}
          setOpen={setShowLevelsModal}
          formData={selectedFormulary}
        />
      )}

      {bulkUploadOption.bulkUploadType === INVENTORY_BULK_OPTIONS.SET_LEVEL && (
        <SetLevelsBulkUpload
          isLoading={isLoading}
          uploadForm={uploadForm}
          bulkUploadOption={bulkUploadOption}
          onSubmit={bulkUploadSetLevels}
          onClose={() => setBulkUploadOption({ bulkUploadType: '' })}
        />
      )}

      {bulkUploadOption.bulkUploadType ===
        INVENTORY_BULK_OPTIONS.RECEIVE_INVENTORY && (
        <InventoryBulkUpload
          isLoading={isLoading}
          uploadForm={uploadForm}
          bulkUploadOption={bulkUploadOption}
          onSubmit={onFinishbulkUploadForm}
          onClose={() => setBulkUploadOption({ bulkUploadType: '' })}
        />
      )}
    </>
  );
};
export default InventoryContainer;
