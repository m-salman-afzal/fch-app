import { useCallback, useEffect, useRef, useState } from 'react';
import { InfoCircleFilled, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Form, Tooltip, Typography } from 'antd';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import { CSVLink } from 'react-csv';
import { useConfirm, VsButton } from 'vs-design-components/src/Components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TFormularyFilters } from '@/types/formularyTypes';

import { usePermissionManagementStyle } from '@/components/admin/permissionManagement/usePermissionManagementStyle';
import BulkUpload from '@/components/common/bulkUpload/bulkUpload';
import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';
import { FormularyFilter } from '@/components/formulary/filters/formularyFilters';
import { FormularyLayout } from '@/components/formulary/formularyLayout';
import { useFormularyStyle } from '@/components/formulary/useFormularyStyle';

import DELETEICON from '@/assets/icons/common/deleteModal.svg';
import FLAG_ICON from '@/assets/icons/formulary/flagIcon.svg';
import POWER_ICON from '@/assets/icons/formulary/powerIconinfo.svg';
import RED_FLAG from '@/assets/icons/formulary/redFlag.svg';
import WARNING_ICON from '@/assets/icons/formulary/warningIcon.svg';
import useCookies from '@/hooks/useCookies';
import { useFetch } from '@/hooks/useFetch';
import { useCommonStyles } from '@/styles/useCommonStyles';
import {
  ALL,
  DEFAULT_PAGE_SIZE,
  FOMMULARY_AUTH_ROUTES,
  FORMULARY_CSV_HEADERS,
  FORMULARY_SAMPLE_FILE,
  PERMISSIONS_TYPES,
  TOAST_DURATION,
  TOAST_MESSAGES
} from '@/utils/constants';
import { DeleteOption } from '@/utils/constantsComponents';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import { bulkUpsertFormularyUrl } from '@/utils/endpoints';
import { getFitlerValuesAndFilterAll } from '@/utils/getFiltersValuesAndFilterAll';
import {
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE,
  toBase64File
} from '@/utils/sharedUtils';
import ShowToast from '@/utils/showToast';
import { API_BASE_URL } from '@/utils/urls';

import { DRUG_CLASSES } from '../carFulfillment/constants';

export const FormularyContainer = () => {
  const isSmall = window.screen.width <= 576;
  const filtersInitialValues = {
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP,
    currentPage: 1,
    name: '',
    isActive: ALL,
    isControlled: ALL,
    isFormulary: 'true'
  };
  const {
    fetchData,
    postData,
    updateData,
    isLoading,
    setIsLoading,
    deleteData
  } = useFetch();
  const admin = useCookies().getDataFromCookie();
  const [formRef] = Form.useForm();
  const [bulkUploadFormRef] = Form.useForm();
  const downloadCsvLink = useRef<any>();
  const [drugs, setDrugs] = useState<any[]>([]);
  const [drugToEdit, setDrugToEdit] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [allFormularyForCSV, setAllFormularyForCSV] = useState([]);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const { permissionButtonBase, permissionButtonEdit } =
    usePermissionManagementStyle();
  const {
    formularyActionItem,
    controllConfirmDestructiveIcon,
    controllConfirmWarningIcon,
    tableToolTipIcon
  } = useFormularyStyle();
  const [inputValue, setInputValue] = useState<string>('');
  const [formularyFilters, setFormularyFilters] =
    useState<TFormularyFilters>(filtersInitialValues);
  const [paginationInfo, setPaginationInfo] = useState<any>({});
  const {
    deleteFamilyMemberConfirmIcon,
    deleteFamilyMemberConfirmIconContainer
  } = useCommonStyles();

  const { confirm } = useConfirm();

  useEffect(() => {
    const formFilters = {
      ...formularyFilters,
      name: inputValue,
      currentPage: 1
    };
    setFormularyFilters(formFilters);
    fetchFormulary({
      ...formFilters
    });
  }, [inputValue]);

  const handleFilterInput = useCallback(
    debounce(val => {
      setInputValue(val);
    }, 500),
    []
  );

  const [filterFormRef] = Form.useForm();
  const [filterOpen, setFilterOpen] = useState(false);
  const onClickApply = async (data: any) => {
    setFormularyFilters(filter => ({ ...filter, ...data }));

    await fetchFormulary({ ...formularyFilters, ...data });
    setFilterOpen(false);
  };

  const getFormularyUrl = () => {
    if (
      admin?.rbac.formularyControlled !== PERMISSIONS_TYPES.HIDE &&
      admin?.rbac.formularyNonControlled !== PERMISSIONS_TYPES.HIDE
    ) {
      return FOMMULARY_AUTH_ROUTES.ALL_DRUG;
    }

    if (admin?.rbac.formularyControlled !== PERMISSIONS_TYPES.HIDE) {
      return FOMMULARY_AUTH_ROUTES.CONTROLLED;
    }

    if (admin?.rbac.formularyNonControlled !== PERMISSIONS_TYPES.HIDE) {
      return FOMMULARY_AUTH_ROUTES.NON_CONTROLLED;
    }

    return '';
  };
  const onCancelDrugForm = () => {
    formRef.resetFields();
    setDrugToEdit(null);
    setShowModal(false);
    setIsLoading(false);
  };

  const addDrug = async (data: any) => {
    setIsLoading(true);
    const url = getFormularyUrl();
    const addedDrug: any = await postData(`${API_BASE_URL}${url}`, data);
    if (addedDrug) {
      addedDrug.key = addedDrug.formularyId;
      setDrugs([...[addedDrug], ...drugs]);
      setPaginationInfo({
        ...paginationInfo,
        totalItems: paginationInfo?.totalItems + 1
      });
      onCancelDrugForm();
    } else {
      ShowToast('Can not add drug, try again', 'error', 5);
    }
    setIsLoading(false);

    return true;
  };

  const fetchFormulary = async (data: any) => {
    setIsLoading(true);
    const url = getFormularyUrl();
    const { paginationInfo, rows } = await fetchData(
      `${API_BASE_URL}${url}`,
      getFitlerValuesAndFilterAll(data)
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

  const onClickDownloadCSV = async () => {
    setIsLoading(true);
    const url = getFormularyUrl();
    const data = await fetchData(`${API_BASE_URL}${url}/fetchAll`);
    if (data && data?.length > 0) {
      setAllFormularyForCSV(data);
      setTimeout(() => {
        downloadCsvLink?.current?.link?.click();
      });
    }
    setIsLoading(false);
  };

  const onSubmitDrugForm = async (data: any) => {
    data.unitsPkg = data.unitsPkg ? parseInt(data.unitsPkg) : undefined;
    data.isFormulary = !data.isFormulary;

    if (!drugToEdit) {
      return await addDrug(data);
    }

    await updateDrug(data);
    await fetchFormulary(formularyFilters);

    return true;
  };

  const updateDrug = async (drug: any) => {
    setIsLoading(true);
    const { formularyId, isActive } = drugToEdit || drug;
    drug.release = drug.release ? drug.release : undefined;
    drug.package = drug.package ? drug.package : undefined;
    drug.brandName = drug.brandName ? drug.brandName : undefined;
    drug.drugClass = drug.drugClass ? drug.drugClass : undefined;
    const url = getFormularyUrl();
    const updatedDrug: any = await updateData(
      `${API_BASE_URL}${url}/${formularyId}`,
      { ...drug, isActive: isActive ? true : false }
    );
    if (updatedDrug && updatedDrug?.status === 'error') {
      ShowToast('Some fields are missing.', 'error', 5);
      setIsLoading(false);

      return;
    } else {
      updatedDrug.key = formularyId;
      setDrugs(
        drugs.map((stateDrug: any) => {
          if (stateDrug.formularyId === formularyId) {
            return updatedDrug;
          } else {
            return stateDrug;
          }
        })
      );
      onCancelDrugForm();
    }
    setIsLoading(false);
  };

  const editDrug = async (value: any) => {
    setShowModal(true);
    setDrugToEdit(value);
    let {
      drugName,
      strengthUnit,
      formulation,
      brandName,
      genericName,
      drugClass,
      release,
      package: any,
      unitsPkg
    } = value;

    formRef.setFieldsValue({
      drugName,
      strengthUnit,
      formulation,
      brandName,
      genericName,
      drugClass,
      release,
      package: any,
      unitsPkg
    });
  };

  const onOpenOrCloseDrugForm = (value: boolean) => {
    if (!value) {
      setDrugToEdit(null);
    }
    setShowModal(value);
    if (value) {
      const drugName = 'GENERIC';
      formRef.setFieldsValue({
        drugName
      });
    }
  };

  const onChangePagination = async (pageNumber: number, pageSize: number) => {
    let filters = {
      ...formularyFilters,
      currentPage: pageNumber,
      perPage: pageSize
    };
    setFormularyFilters(filters);
    await fetchFormulary(filters);
  };

  const onDeleteFormulary = (drug: any) => {
    const { formularyId, name } = drug;
    confirm({
      onOk: async () => {
        setIsLoading(true);
        const url = getFormularyUrl();
        const deleteFormulary = await deleteData(
          `${API_BASE_URL}${url}/${formularyId}`
        );
        if (deleteFormulary) {
          let newDrugList = drugs.filter((stateDrug: any) => {
            return stateDrug.formularyId !== formularyId;
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
            {`Are you sure you want to delete this drug? `}
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

  const onChangeControlledStatus = (drug: any) => {
    const { isControlled, name } = drug;
    confirm({
      iconBgClass: !isControlled
        ? controllConfirmDestructiveIcon
        : controllConfirmWarningIcon,
      onOk: async () => {
        await updateDrug({
          ...drug,
          unitsPkg: drug?.unitsPkg ? parseInt(drug?.unitsPkg) : undefined,
          isControlled: !isControlled,
          isGeneric: drug?.isGeneric ? true : false,
          isStock: drug?.isStock ? true : false
        });
      },
      text: (
        <>
          <Typography.Paragraph
            style={{
              fontSize: pxToRem(20),
              fontWeight: 600,
              textAlign: 'center',
              marginBlockEnd: 0,
              padding: isControlled ? pxToRem(8) : 0,
              marginBottom: pxToRem(16)
            }}
          >
            {isControlled
              ? `Are you sure you want to remove this drug from the controlled substance list?`
              : `Are you sure you want to mark this drug as a controlled substance?`}
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
        </>
      ),
      type: `info`,
      okText: 'Yes',
      cancelText: 'No',
      icon: (
        <div className={deleteFamilyMemberConfirmIconContainer}>
          <Image
            alt={'MSG'}
            src={isControlled ? WARNING_ICON : FLAG_ICON}
            className={deleteFamilyMemberConfirmIcon}
            fill
          />
        </div>
      )
    });
  };

  const onChangeDrugActivationStatus = (drug: any) => {
    const { isActive } = drug;
    confirm({
      onOk: async () => {
        await updateDrug({
          ...drug,
          unitsPkg: drug?.unitsPkg ? parseInt(drug?.unitsPkg) : undefined,
          isControlled: drug?.isControlled ? true : false,
          isGeneric: drug?.isGeneric ? true : false,
          isStock: drug?.isStock ? true : false,
          isActive: !isActive
        });

        await fetchFormulary(formularyFilters);
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
            {isActive
              ? `Are you sure you want to deactivate this drug?`
              : `Are you sure you want to activate this drug?`}
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
            {`${drug.name}`}
          </Typography.Text>
        </>
      ),
      type: isActive ? `destructive` : `info`,
      okText: 'Yes',
      cancelText: 'No',
      icon: (
        <div className={deleteFamilyMemberConfirmIconContainer}>
          <Image
            alt={'MSG'}
            src={isActive ? FLAG_ICON : POWER_ICON}
            className={deleteFamilyMemberConfirmIcon}
            fill
          />
        </div>
      )
    });
  };

  const openBulkUploadModel = (value: boolean) => {
    setShowBulkUploadModal(value);
  };

  const onCloseBulkUploadModal = () => {
    bulkUploadFormRef.resetFields();
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
    data.process = 'BULK_ADD_FORMULARY';
    data.fileExtension = 'csv';
    data.repository = 'FORMULARY';
    delete data.file;

    const url = bulkUpsertFormularyUrl();
    const uploadCsv = await postData(url, data);
    if (uploadCsv.status === 'error') {
      ShowToast(TOAST_MESSAGES.ERROR.FILE_UPLOAD, 'error', TOAST_DURATION);
    }

    onCloseBulkUploadModal();
    setIsLoading(false);
  };

  const handeFormReset = async () => {
    filterFormRef.resetFields();
  };

  let formularyColumns: any[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      width: 65
    },
    {
      title: 'Drug',
      align: 'left',
      key: 'drugName',
      width: 240,
      render: (value: any) => (
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
          {value.drugClass === DRUG_CLASSES.ARV && (
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
      width: 110,
      ellipsis: true,
      render: (value: any) => (
        <Tooltip title={value?.brandName} placement={`topLeft`}>
          <Typography.Text>{value?.brandName}</Typography.Text>
        </Tooltip>
      )
    },
    {
      title: 'Generic Name',
      align: 'left',
      key: 'genericName',
      width: 150,
      ellipsis: true,
      render: (value: any) => (
        <Tooltip title={value?.genericName} placement={`topLeft`}>
          <Typography.Text>{value?.genericName}</Typography.Text>
        </Tooltip>
      )
    },
    {
      title: 'Generic',
      key: 'isGeneric',
      align: 'left',
      width: 90,
      render: (value: any) => (
        <Typography.Text>{value.isGeneric ? `Yes` : `No`}</Typography.Text>
      )
    },
    {
      title: 'Drug Class',
      align: 'left',
      key: 'drugClass',
      width: 130,
      ellipsis: true,
      render: (value: any) => (
        <Tooltip title={value?.drugClass} placement={`topLeft`}>
          <Typography.Text>{value?.drugClass}</Typography.Text>
        </Tooltip>
      )
    },
    {
      title: 'Controlled',
      key: 'isControlled',
      align: 'left',
      width: pxToRem(125),
      render: (value: any) => (
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
      key: 'isFormulary',
      align: 'left',
      width: pxToRem(125),
      render: (value: any) => (
        <Typography.Text>{value.isFormulary ? 'Yes' : 'No'}</Typography.Text>
      )
    },
    {
      title: 'Status',
      key: 'status',
      align: 'left',
      width: 92,
      render: (value: any) => (
        <ColorfulPill
          className={
            value.isActive ? permissionButtonEdit : permissionButtonBase
          }
          text={value.isActive ? `Active` : `Inactive`}
        />
      )
    },
    {
      title: '',
      key: 'action',
      width: pxToRem(30),
      render: (value: any) =>
        ((value.isControlled &&
          admin?.rbac.formularyControlled === PERMISSIONS_TYPES.WRITE) ||
          (!value.isControlled &&
            admin?.rbac.formularyNonControlled ===
              PERMISSIONS_TYPES.WRITE)) && (
          <div
            style={{
              border: '0px solid',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Dropdown
              placement={'bottomRight'}
              trigger={['click']}
              key={value}
              menu={{
                items: [
                  {
                    key: 1,
                    label: 'Edit',
                    className: formularyActionItem,
                    onClick: () => {
                      editDrug(value);
                    }
                  },

                  {
                    key: 2,
                    label: value?.isActive ? `Deactivate` : `Activate`,
                    className: formularyActionItem,
                    onClick: () => {
                      onChangeDrugActivationStatus(value);
                    }
                  },
                  {
                    key: 3,
                    label: value?.isControlled
                      ? `Remove Control`
                      : `Set Control`,
                    className: formularyActionItem,
                    onClick: () => {
                      onChangeControlledStatus(value);
                    }
                  },
                  {
                    key: 4,
                    label: <DeleteOption />,
                    className: formularyActionItem,
                    onClick: () => {
                      onDeleteFormulary(value);
                    }
                  }
                ]
              }}
            >
              <VsButton
                antButtonProps={{
                  icon: <MoreOutlined style={TABLE_BUTTON_ICON_SIZE} />
                }}
                size={BUTTON_SIZES.squareIcon}
                style={TABLE_BUTTON_STYLE}
              />
            </Dropdown>
          </div>
        )
    }
  ].filter(column => {
    if (column.key === 'isControlled') {
      return (
        admin?.rbac.formularyControlled !== PERMISSIONS_TYPES.HIDE &&
        admin?.rbac.formularyNonControlled !== PERMISSIONS_TYPES.HIDE
      );
    }

    if (
      column.key === 'action' &&
      admin?.rbac.formularyControlled !== PERMISSIONS_TYPES.WRITE &&
      admin?.rbac.formularyNonControlled !== PERMISSIONS_TYPES.WRITE
    ) {
      return false;
    }

    return true;
  });

  const showDrugTypeOption =
    admin.rbac.formularyControlled !== PERMISSIONS_TYPES.HIDE &&
    admin.rbac.formularyNonControlled !== PERMISSIONS_TYPES.HIDE;

  return (
    <div>
      {}
      {(admin.rbac.formularyControlled !== PERMISSIONS_TYPES.HIDE ||
        admin.rbac.formularyNonControlled !== PERMISSIONS_TYPES.HIDE) && (
        <>
          <FormularyLayout
            controlled={
              admin.rbac.formularyControlled === PERMISSIONS_TYPES.WRITE
            }
            showDrugTypeOption={showDrugTypeOption}
            isLoading={isLoading}
            tableColumns={formularyColumns}
            tableData={drugs}
            handleFilterInput={handleFilterInput}
            facilityFormRef={formRef}
            handleFacilityFormSubmit={onSubmitDrugForm}
            modalTitle={drugToEdit ? 'Edit Drug' : 'Add Drug'}
            addFacilityModal={showModal}
            addFacilityModalOpen={onOpenOrCloseDrugForm}
            tableLoading={isLoading}
            facilityExists={drugs}
            facilityToEdit={drugToEdit}
            paginationInfo={paginationInfo}
            onChangePagination={onChangePagination}
            openBulkUploadModel={openBulkUploadModel}
            onDownLoadCSV={onClickDownloadCSV}
            setFilterOpen={setFilterOpen}
            filterState={formularyFilters}
            filtersForm={filterFormRef}
            onApplyFilters={onClickApply}
          />

          <FormularyFilter
            showDrugTypeOption={showDrugTypeOption}
            filterOpen={filterOpen}
            setFilerOpen={() => setFilterOpen((x: any) => !x)}
            handleReset={handeFormReset}
            filterFormRef={filterFormRef}
            onClickApply={onClickApply}
          />
        </>
      )}
      <BulkUpload
        onCloseModal={onCloseBulkUploadModal}
        onFinishForm={onFinishBulkUploadForm}
        open={showBulkUploadModal}
        form={bulkUploadFormRef}
        isLoading={isLoading}
        sampleData={FORMULARY_SAMPLE_FILE}
        fileName={`Sample FCH Formulary Upload FIle`}
      />
      <CSVLink
        enclosingCharacter={`"`}
        data={allFormularyForCSV}
        headers={FORMULARY_CSV_HEADERS}
        filename={`FCH Formulary ${getFormattedDateNoTimeZone({ format: DATE_FORMATS.FILE_DATE })}.csv`}
        ref={downloadCsvLink}
      ></CSVLink>
    </div>
  );
};
