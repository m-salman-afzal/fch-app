import { useCallback, useEffect, useRef, useState } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Tooltip, Typography } from 'antd';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import { CSVLink } from 'react-csv';
import { useConfirm } from 'vs-design-components';

import { TReferenceGuide } from '@/types/referenceGuideTypes';

import BulkUploadReferenceGuideListModal from '@/components/referenceGuideList/modals/bulkUploadReferenceGuideListModal';
import { ReferenceGuideDrugModal } from '@/components/referenceGuideList/modals/referenceGuideDrugModal';
import { ReferenceGuideNoteModal } from '@/components/referenceGuideList/modals/referenceGuideNoteModal';
import { ReferenceGuideListLayout } from '@/components/referenceGuideList/referenceGuideListLayout';
import { useReferenceGuideListStyle } from '@/components/referenceGuideList/useReferenceGuideListStyle';

import DELETEICON from '@/assets/icons/common/deleteModal.svg';
import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import { useCommonStyles } from '@/styles/useCommonStyles';
import {
  ALL,
  DEFAULT_PAGE_SIZE,
  PERMISSION_TYPES_BACKEND,
  REFERENCE_GUIDE_DRUGS_CSV_HEADERS,
  REFERENCE_GUIDE_SAMPLE_FILE,
  TOAST_DURATION,
  TOAST_MESSAGES
} from '@/utils/constants';
import { DeleteOption } from '@/utils/constantsComponents';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { pxToRem, toBase64File } from '@/utils/sharedUtils';
import ShowToast from '@/utils/showToast';
import {
  API_BASE_URL,
  REFERENCE_GUIDE_NOTE_URL,
  REFERENCE_GUIDE_URL
} from '@/utils/urls';

export const ReferenceGuideListContainer = () => {
  const isSmall = window.screen.width <= 576;
  const {
    fetchData,
    postData,
    updateData,
    isLoading,
    setIsLoading,
    deleteData
  } = useFetch();
  const admin = useCookies().getDataFromCookie();
  const [filtersFormRef] = Form.useForm();
  const [bulkUploadFormRef] = Form.useForm();
  const [drugFormRef] = Form.useForm();
  const [noteFormRef] = Form.useForm();
  const downloadCsvLink = useRef<any>();
  const [drugs, setDrugs] = useState<any[]>([]);
  const [referenceGuideList, setReferenceGuideList] = useState<any[]>([]);
  const [drugToEdit, setDrugToEdit] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [allFormularyForCSV, setAllFormularyForCSV] = useState([]);
  const [
    combinedCategoryWithSubcategoryList,
    setCcombinedCategoryWithSubcategoryList
  ] = useState<any>({});
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [subCategoryList, setSubCategoryList] = useState<any[]>([]);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [
    showReferenceGuideListUploadTypeModal,
    setShowReferenceGuideListUploadTypeModal
  ] = useState<boolean>(false);
  const [
    selectedReferenceGuideListUploadType,
    setSelectedReferenceGuideListUploadType
  ] = useState<string>('ADD_REFERENCE');
  const [selectedReferenceGuideListTitle, setSelectedReferenceGuideListTitle] =
    useState<string>('');
  const [selectedReferenceGuide, setSelectedReferenceGuide] = useState<
    TReferenceGuide | undefined
  >(undefined);
  const [formularyFilters, setFormularyFilters] = useState<any>({
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP,
    currentPage: 1,
    category: ALL,
    subCategory: ALL,
    referenceGuideId: '',
    text: ''
  });
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const {
    deleteFamilyMemberConfirmIcon,
    deleteFamilyMemberConfirmIconContainer
  } = useCommonStyles();
  const { formularyActionItem } = useReferenceGuideListStyle();
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchReferenceGuideList(true);
  }, []);

  useEffect(() => {
    if (formularyFilters?.referenceGuideId) {
      fetchReferenceGuideDrugs({ ...formularyFilters, text: inputValue });
    }
  }, [inputValue]);

  const handleFilterInput = useCallback(
    debounce(val => {
      setInputValue(val);
    }, 500),
    []
  );

  const onCancelDrugForm = () => {
    setDrugToEdit(null);
    setShowModal(false);
    setIsLoading(false);
  };

  const fetchReferenceGuideDrugs = async (data: any) => {
    setIsLoading(true);
    let drugFilters = {
      ...data,
      category: data?.category === ALL ? '' : data?.category,
      subCategory: data?.subCategory === ALL ? '' : data?.subCategory
    };
    const { paginationInfo, rows } = await fetchData(
      `${API_BASE_URL}${REFERENCE_GUIDE_URL}/drugs`,
      drugFilters
    );
    if (rows && rows?.length > 0) {
      setDrugs(
        rows.map((drug: any) => {
          return {
            ...drug,
            key: drug?.formularyId
          };
        })
      );
      setPaginationInfo(paginationInfo);
    } else {
      setDrugs([]);
      setPaginationInfo({});
    }
    setIsLoading(false);
  };

  const fetchReferenceGuideList = async (selectFirst?: boolean) => {
    const referenceGuides = await fetchData(
      `${API_BASE_URL}${REFERENCE_GUIDE_URL}`
    );
    if (referenceGuides?.length > 0) {
      setReferenceGuideList(
        referenceGuides.map((referenceGuide: any) => {
          return {
            ...referenceGuide,
            label: referenceGuide?.name,
            value: referenceGuide?.referenceGuideId,
            key: referenceGuide?.referenceGuideId
          };
        })
      );

      if (selectFirst) {
        await onChangeReferenceGuideFromDropDown(
          {
            selectedKeys: [referenceGuides?.[0]?.referenceGuideId]
          },
          referenceGuides
        );
      }

      return;
    }
    setReferenceGuideList([]);
    setSelectedReferenceGuideListTitle('');
    setDrugs([]);
    setPaginationInfo([]);
    setCategoryList([]);
    setSubCategoryList([]);
  };

  const fetchCategoriesWithSubcategories = async (referenceGuideId: string) => {
    setIsLoading(true);
    const referenceGuideCategories = await fetchData(
      `${API_BASE_URL}${REFERENCE_GUIDE_URL}/drugs/categories`,
      {
        referenceGuideId
      }
    );
    if (referenceGuideCategories?.length > 0) {
      let combinedCategories: any = {};
      referenceGuideCategories.map((refGuideCat: any) => {
        combinedCategories[refGuideCat?.category] =
          refGuideCat?.subCategory?.map((refGuideSubCat: any) => {
            return {
              key: refGuideSubCat,
              label: refGuideSubCat,
              value: refGuideSubCat
            };
          });
      });
      setCcombinedCategoryWithSubcategoryList({
        ...combinedCategories
      });
      setCategoryList(
        referenceGuideCategories.map((refGuideCat: any) => {
          return {
            key: refGuideCat?.category,
            label: refGuideCat?.category,
            value: refGuideCat?.category
          };
        })
      );
    } else {
      setCcombinedCategoryWithSubcategoryList({});
      setCategoryList([]);
      setSubCategoryList([]);
    }
    setIsLoading(false);
  };

  const onChangeCategoryFilter = (value: any) => {
    filtersFormRef.setFieldsValue({
      subCategory: ALL
    });
    setSubCategoryList(combinedCategoryWithSubcategoryList[value]);
  };

  const onClickDownloadCSV = async () => {
    if (formularyFilters?.referenceGuideId) {
      setIsLoading(true);
      const data = await fetchData(
        `${API_BASE_URL}${REFERENCE_GUIDE_URL}/drugs/export`,
        {
          referenceGuideId: formularyFilters?.referenceGuideId
        }
      );
      if (data && data?.length > 0) {
        setAllFormularyForCSV(data);
        setTimeout(() => {
          downloadCsvLink?.current?.link?.click();
        });
      }
      setIsLoading(false);
    } else {
      ShowToast('Please select a reference guide', 'error', 5);
    }
  };

  const editDrug = async (value: any) => {
    setShowModal(true);
    setDrugToEdit(value);
    let { category, subCategory, min, max, notes } = value;
    drugFormRef.setFieldsValue({
      category,
      subCategory,
      min,
      max,
      notes
    });
  };

  const onOpenOrCloseDrugForm = (value: boolean) => {
    if (!value) {
      setDrugToEdit(null);
    }
    setShowModal(value);
  };

  const setOpenNoteForm = (value: boolean) => {
    setShowNoteModal(value);
  };

  const onChangePagination = async (pageNumber: number, pageSize: number) => {
    let filters = {
      ...formularyFilters,
      currentPage: pageNumber,
      perPage: pageSize,
      text: inputValue
    };
    setFormularyFilters(filters);
    await fetchReferenceGuideDrugs(filters);
  };

  const onDeleteReferenceGuideDrug = (drug: any) => {
    const { referenceGuideDrugId, formularyId, referenceGuideId } = drug;
    confirm({
      onOk: async () => {
        setIsLoading(true);
        const deleteFormulary = await deleteData(
          `${API_BASE_URL}${REFERENCE_GUIDE_URL}/drugs/${referenceGuideDrugId}`,
          { formularyId, referenceGuideId }
        );
        if (deleteFormulary) {
          let newDrugList = drugs.filter((stateDrug: any) => {
            return stateDrug?.referenceGuideDrugId !== referenceGuideDrugId;
          });
          setDrugs(newDrugList);
          setPaginationInfo({
            ...paginationInfo,
            totalItems: paginationInfo?.totalItems - 1
          });
        } else {
          ShowToast('Can not delete drug, try again', 'error', 5);
        }
        setIsLoading(false);
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
            Are you sure you want to delete this drug from the reference guide?
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
            {selectedReferenceGuideListTitle}
          </Typography.Text>
          <br />
          <Typography.Text
            style={{
              fontSize: pxToRem(14),
              fontWeight: 400,
              color: 'rgba(0, 0, 0, 0.65)',
              marginBlockEnd: 0,
              marginLeft: pxToRem(5),
              display: 'flow'
            }}
          >
            Drug:{' '}
            <span
              style={{
                color: 'rgba(0, 0, 0, 0.88)'
              }}
            >{`${drug?.formulary?.name}`}</span>
          </Typography.Text>
        </>
      ),
      type: 'destructive',
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

  const onChangeReferenceGuideFromDropDown = async (
    value: any,
    referenceGuides: any = false
  ) => {
    let listOfReferenceGuides = referenceGuides
      ? [...referenceGuides]
      : [...referenceGuideList];
    const { selectedKeys } = value;
    const filteredReferenceGuide = listOfReferenceGuides.find(
      (refGuide: any) => {
        return refGuide?.referenceGuideId === selectedKeys?.[0];
      }
    );
    let drugFilters = {
      ...formularyFilters,
      referenceGuideId: selectedKeys?.[0],
      text: inputValue,
      category: ALL,
      subCategory: ALL,
      perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP,
      currentPage: 1
    };
    filtersFormRef.setFieldsValue({
      category: ALL,
      subCategory: ALL
    });
    setFormularyFilters({ ...drugFilters });
    setSelectedReferenceGuideListTitle(filteredReferenceGuide?.name);
    setSelectedReferenceGuide(filteredReferenceGuide);
    await fetchCategoriesWithSubcategories(selectedKeys?.[0]);
    await fetchReferenceGuideDrugs(drugFilters);
  };

  const openBulkUploadModel = (value: boolean) => {
    setShowBulkUploadModal(value);
  };

  const onCloseBulkUploadModal = () => {
    bulkUploadFormRef.resetFields();
    setSelectedReferenceGuideListUploadType('ADD_REFERENCE');
    openBulkUploadModel(false);
  };

  const onFinishBulkUploadForm = async (data: any) => {
    if (!data?.file || (data?.file && data?.file?.fileList?.length === 0)) {
      ShowToast('Select a file to upload', 'error', 5);

      return;
    }
    setIsLoading(true);
    const {
      file: { file }
    } = data;
    const csvFile: any = await toBase64File(file);
    const fileNameArray = file.name.split('.');
    fileNameArray.pop();

    let csv = csvFile.split('base64,')[1];
    data.fileContent = csv;
    data.fileName = fileNameArray.join('.');
    data.process = 'BULK_ADD_REFERENCE_GUIDE';
    data.fileExtension = 'csv';
    data.repository = 'REFERENCE_GUIDE';
    delete data.file;
    if (selectedReferenceGuideListUploadType === 'ADD_REFERENCE') {
      await bulkAddNewReferenceGuide(data);
    } else {
      await bulkUpdateExistingReferenceGuide(data);
    }
    onCloseBulkUploadModal();
    setIsLoading(false);
  };

  const bulkAddNewReferenceGuide = async (data: any) => {
    const uploadCsv = await postData(
      `${API_BASE_URL}${REFERENCE_GUIDE_URL}`,
      data
    );
    if (uploadCsv?.status === 'error') {
      if (uploadCsv?.message === 'Already exists') {
        ShowToast(
          'This reference guide name already exists',
          'error',
          TOAST_DURATION
        );
      } else {
        ShowToast(TOAST_MESSAGES.ERROR.FILE_UPLOAD, 'error', TOAST_DURATION);
      }

      return;
    }
    setReferenceGuideList([
      ...referenceGuideList,
      {
        ...uploadCsv,
        label: uploadCsv?.name,
        value: uploadCsv?.referenceGuideId,
        key: uploadCsv?.referenceGuideId
      }
    ]);
  };

  const bulkUpdateExistingReferenceGuide = async (data: any) => {
    const uploadCsv = await updateData(
      `${API_BASE_URL}${REFERENCE_GUIDE_URL}`,
      data
    );
    if (uploadCsv.status === 'error') {
      ShowToast(TOAST_MESSAGES.ERROR.FILE_UPLOAD, 'error', TOAST_DURATION);

      return;
    }
  };

  const onFinishReferenceGuideDrugModal = async (drug: any) => {
    setIsLoading(true);
    const { referenceGuideDrugId, formularyId, referenceGuideId } = drugToEdit;
    const updatedDrug: any = await updateData(
      `${API_BASE_URL}${REFERENCE_GUIDE_URL}/drugs/${referenceGuideDrugId}`,
      {
        ...drug,
        formularyId,
        referenceGuideId,
        min: parseFloat(drug?.min),
        max: parseFloat(drug?.max),
        notes: drug?.notes ? drug?.notes : undefined,
        subCategory: drug?.subCategory ? drug?.subCategory : undefined
      }
    );
    if (updatedDrug && updatedDrug?.status === 'error') {
      ShowToast('Some fields are missing.', 'error', 5);
      setIsLoading(false);

      return;
    } else {
      setDrugs(
        drugs.map((stateDrug: any) => {
          if (stateDrug.referenceGuideDrugId === referenceGuideDrugId) {
            return {
              ...stateDrug,
              category: drug?.category,
              subCategory: drug?.subCategory,
              min: parseFloat(drug?.min),
              max: parseFloat(drug?.max),
              notes: drug?.notes
            };
          } else {
            return stateDrug;
          }
        })
      );
      onCancelDrugForm();
    }
    setIsLoading(false);
  };

  const onFinishReferenceGuideNoteModal = async (note: any) => {
    await updateData(
      `${API_BASE_URL}${REFERENCE_GUIDE_NOTE_URL}/${selectedReferenceGuide?.referenceGuideId}`,
      { ...note }
    );
    await fetchReferenceGuideList(false);
    setSelectedReferenceGuide({
      ...selectedReferenceGuide,
      ...note
    });
    noteFormRef.resetFields();
    setShowNoteModal(false);
  };

  const deleteReferenceGuide = async () => {
    confirm({
      onOk: async () => {
        await deleteData(
          `${API_BASE_URL}${REFERENCE_GUIDE_URL}/${selectedReferenceGuide?.referenceGuideId}`
        );
        await fetchReferenceGuideList(true);
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
            Are you sure you want to delete this reference guide?
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
            {selectedReferenceGuideListTitle}
          </Typography.Text>
        </>
      ),
      type: 'destructive',
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

  const deleteReferenceGuideNote = async () => {
    confirm({
      onOk: async () => {
        await deleteData(
          `${API_BASE_URL}${REFERENCE_GUIDE_NOTE_URL}/${selectedReferenceGuide?.referenceGuideId}`
        );
        setSelectedReferenceGuide({
          note: null,
          facilityId: selectedReferenceGuide?.facilityId as string,
          name: selectedReferenceGuide?.name as string,
          referenceGuideId: selectedReferenceGuide?.referenceGuideId as string
        });
        await fetchReferenceGuideList(false);
        noteFormRef.resetFields();
        setShowNoteModal(false);
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
            Are you sure you want to delete this note from the reference guide?
          </Typography.Paragraph>
        </>
      ),
      type: 'destructive',
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

  const openReferenceGuideNoteModal = (note: string | undefined) => {
    if (note) {
      noteFormRef.setFieldValue('note', selectedReferenceGuide?.note);
    }
    setShowNoteModal(true);
  };

  const onSubmitReferenceGuideListFilters = async (formData: any) => {
    const { category, subCategory } = formData;
    let referenceGuideDrugFilters = {
      ...formularyFilters,
      category,
      subCategory,
      perPage: 20,
      currentPage: 1,
      text: inputValue
    };
    setFormularyFilters({ ...referenceGuideDrugFilters });
    await fetchReferenceGuideDrugs(referenceGuideDrugFilters);
  };

  const onResetReferenceGuideListFilters = () => {
    filtersFormRef.setFieldsValue({
      category: ALL,
      subCategory: ALL
    });
  };

  const onNextAfterSelectingReferenceGuideListUploadType = () => {
    setShowReferenceGuideListUploadTypeModal(false);
    openBulkUploadModel(true);
  };

  const onUpdateReferenceGuidetitle = async (title: string) => {
    const { referenceGuideId } = formularyFilters;
    if (referenceGuideId) {
      setIsLoading(true);
      const updatedReferenceGuide: any = await updateData(
        `${API_BASE_URL}${REFERENCE_GUIDE_URL}/${referenceGuideId}`,
        {
          name: title
        }
      );
      if (updatedReferenceGuide && updatedReferenceGuide?.status === 'error') {
        ShowToast(updatedReferenceGuide?.message, 'error', 5);
        setIsLoading(false);

        return;
      } else {
        setSelectedReferenceGuideListTitle(title);
        setReferenceGuideList(
          referenceGuideList.map((stateGuide: any) => {
            if (stateGuide?.referenceGuideId === referenceGuideId) {
              return {
                ...stateGuide,
                name: title,
                label: title
              };
            } else {
              return stateGuide;
            }
          })
        );
      }
      setIsLoading(false);
    }
  };

  let referenceGuideDrugColumns: any[] = [
    {
      title: 'ID',
      key: 'id',
      align: 'left',
      ellipsis: true,
      width: isSmall ? 150 : undefined,
      render: (value: any) => (
        <Typography.Text>{value?.formulary?.id}</Typography.Text>
      )
    },
    {
      title: 'Category',
      align: 'left',
      key: 'category',
      ellipsis: true,
      width: isSmall ? 150 : undefined,
      render: (value: any) => (
        <Tooltip title={value?.category} placement={`topLeft`}>
          <Typography.Text>{value?.category}</Typography.Text>
        </Tooltip>
      )
    },
    {
      title: 'Subcategory',
      align: 'left',
      key: 'subCategory',
      ellipsis: true,
      width: isSmall ? 150 : undefined,
      render: (value: any) => (
        <Tooltip title={value?.subCategory} placement={`topLeft`}>
          <Typography.Text>
            {value?.subCategory ? value?.subCategory : `-`}
          </Typography.Text>
        </Tooltip>
      )
    },
    {
      title: 'Drug',
      align: 'left',
      key: 'drugName',
      ellipsis: true,
      width: isSmall ? 150 : undefined,
      render: (value: any) => (
        <Tooltip title={value?.formulary?.name} placement={`topLeft`}>
          <Typography.Text>{value?.formulary?.name}</Typography.Text>
        </Tooltip>
      )
    },
    {
      title: 'Min',
      key: 'min',
      align: 'left',
      width: isSmall ? 150 : undefined,
      render: (value: any) => <Typography.Text>{value?.min}</Typography.Text>
    },
    {
      title: 'Max',
      align: 'left',
      key: 'max',
      width: isSmall ? 150 : undefined,
      ellipsis: true,
      render: (value: any) => <Typography.Text>{value?.max}</Typography.Text>
    },
    {
      title: 'Notes',
      key: 'notes',
      align: 'left',
      ellipsis: true,
      width: isSmall ? 150 : undefined,
      render: (value: any) => (
        <Tooltip title={value?.notes} placement={`topLeft`}>
          <Typography.Text>{value?.notes ? value?.notes : `-`}</Typography.Text>
        </Tooltip>
      )
    }
  ];

  admin.rbac.referenceGuide === PERMISSION_TYPES_BACKEND.WRITE &&
    referenceGuideDrugColumns.push({
      title: '',
      key: 'action',
      align: 'center',
      width: pxToRem(56),
      render: (value: any) => (
        <Dropdown
          trigger={['click']}
          placement={'bottomRight'}
          key={value}
          menu={{
            items: [
              {
                key: 1,
                label: 'Edit',
                onClick: () => {
                  editDrug(value);
                }
              },
              {
                key: 2,
                label: <DeleteOption />,
                onClick: () => {
                  onDeleteReferenceGuideDrug(value);
                }
              }
            ]
          }}
        >
          <Button icon={<MoreOutlined />} size="small" />
        </Dropdown>
      )
    });

  return (
    <div>
      {admin?.rbac?.referenceGuide !== PERMISSION_TYPES_BACKEND.HIDE && (
        <ReferenceGuideListLayout
          tableColumns={referenceGuideDrugColumns}
          tableData={drugs}
          handleFilterInput={handleFilterInput}
          tableLoading={isLoading}
          onChangePagination={onChangePagination}
          onChangeReferenceGuide={onChangeReferenceGuideFromDropDown}
          filters={formularyFilters}
          referenceGuideTotalDrugs={paginationInfo?.totalItems || 0}
          onDownLoadCSV={onClickDownloadCSV}
          filtersFormRef={filtersFormRef}
          onSubmitFilters={onSubmitReferenceGuideListFilters}
          onResetFilters={onResetReferenceGuideListFilters}
          referenceGuideListUploadTypeShow={
            showReferenceGuideListUploadTypeModal
          }
          toggleReferenceGuideListUploadTypeModal={
            setShowReferenceGuideListUploadTypeModal
          }
          selectedReferenceGuideListUploadType={
            selectedReferenceGuideListUploadType
          }
          setSelectedReferenceGuideListUploadType={
            setSelectedReferenceGuideListUploadType
          }
          onNextAfterSelectingReferenceGuideListUploadType={
            onNextAfterSelectingReferenceGuideListUploadType
          }
          referenceGuideListTitle={selectedReferenceGuideListTitle}
          onSaveReferenceGuideListTitle={onUpdateReferenceGuidetitle}
          referenceGuideList={referenceGuideList}
          referenceGuideCategoryList={categoryList}
          referenceGuideSubCategoryList={subCategoryList}
          onChangeCategoryFilter={onChangeCategoryFilter}
          openReferenceGuideNoteModal={openReferenceGuideNoteModal}
          selectedReferenceGuide={selectedReferenceGuide}
          onDeleteReferenceGuide={deleteReferenceGuide}
        />
      )}
      <BulkUploadReferenceGuideListModal
        onCloseModal={onCloseBulkUploadModal}
        onFinishForm={onFinishBulkUploadForm}
        open={showBulkUploadModal}
        form={bulkUploadFormRef}
        isLoading={isLoading}
        sampleData={REFERENCE_GUIDE_SAMPLE_FILE}
        fileName={`Sample Reference Guide Upload File`}
        selectedReferenceGuideListUploadType={
          selectedReferenceGuideListUploadType
        }
        referenceGuideOptions={referenceGuideList}
      />
      <ReferenceGuideDrugModal
        handleDrugFormSubmit={onFinishReferenceGuideDrugModal}
        drugFormRef={drugFormRef}
        setOpen={onOpenOrCloseDrugForm}
        open={showModal}
      />

      <ReferenceGuideNoteModal
        noteFormRef={noteFormRef}
        handleNoteFormSubmit={onFinishReferenceGuideNoteModal}
        open={showNoteModal}
        setOpenNoteForm={setOpenNoteForm}
        selectedReferenceGuide={selectedReferenceGuide}
        deleteReferenceGuideNote={deleteReferenceGuideNote}
      />

      <CSVLink
        enclosingCharacter={`"`}
        data={allFormularyForCSV}
        headers={REFERENCE_GUIDE_DRUGS_CSV_HEADERS}
        filename={`${selectedReferenceGuideListTitle} ${getFormattedDateNoTimeZone({ format: DATE_FORMATS.FILE_DATE })}.csv`}
        ref={downloadCsvLink}
      ></CSVLink>
    </div>
  );
};
