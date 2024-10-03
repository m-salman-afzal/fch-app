import { useCallback, useEffect, useState } from 'react';
import { Form, FormInstance, Spin, Typography } from 'antd';
import debounce from 'lodash.debounce';
import {
  BasicInputFormItem,
  ErrorMessage,
  VsButton,
  VsSelectFormItem
} from 'vs-design-components';
import { VsSelectMobileFormItem } from 'vs-design-components/src/Components/Select';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { SelectOption, TPagination } from '@/types/commonTypes';
import {
  TFacilityCheckListIndexable,
  TSelectedAdmin
} from '@/types/facilityCheckListTypes';

import useCookies from '@/hooks/useCookies';
import {
  FACILITY_CHECKLIST_EVENTS,
  FACILITY_CHECKLIST_ITEMS,
  PERMISSION_TYPES_BACKEND,
  PERMISSIONS_TYPES
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

interface props {
  selectedAdmins: TSelectedAdmin[];
  form: FormInstance<TFacilityCheckListIndexable>;
  onFinish: (values: TFacilityCheckListIndexable) => void;
  getAdminUserOptions: (pagination: TPagination, search?: string) => any;
  isLoading: boolean;
}

const EVENTNAMES = FACILITY_CHECKLIST_EVENTS;

const SafeInvestigationForm: React.FC<props> = ({
  form,
  onFinish,
  selectedAdmins,
  getAdminUserOptions,
  isLoading
}) => {
  const isSmall = window.screen.width <= 576;
  const eventTypeStyle = {
    width: isSmall ? pxToRem(111) : pxToRem(176),
    minWidth: isSmall ? pxToRem(111) : pxToRem(176),
    lineHeight: pxToRem(22),
    whiteSpace: isSmall ? undefined : 'nowrap',
    flexBasis: '40%'
  };
  const admin = useCookies().getDataFromCookie();
  const permission = admin.rbac.facilityChecklist;
  const selectorStyle = {
    maxWidth: isSmall ? pxToRem(185) : undefined,
    width: isSmall ? '100%' : pxToRem(257),
    flexBasis: '60%'
  };

  const titlesStyle = {
    marginBlockStart: 0,
    fontSize: pxToRem(16),
    fontWeight: 600,
    lineHeight: pxToRem(24)
  };
  const eventContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: pxToRem(16),
    border: `${pxToRem(1)} solid #E5E4E4`
  };

  const [adminOptions, setAdminOptions] = useState<
    (SelectOption & { roleServiceList: any[] })[]
  >([]);
  const [pagination, setPagination] = useState<TPagination>({
    currentPage: 1,
    perPage: isSmall ? 50 : 25,
    totalItems: 0
  });
  const [dropdownLoading, setDropdownLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [newSelected, setNewSelected] = useState<{
    [index: string]: TSelectedAdmin;
    MEDICATION: TSelectedAdmin;
    MENTAL_HEALTH: TSelectedAdmin;
    EQUIPMENT_MALFUNCTION: TSelectedAdmin;
    EMPLOYEE_SAFETY: TSelectedAdmin;
    ENVIRONMENTAL: TSelectedAdmin;
    ISSUE_REPORT: TSelectedAdmin;
  }>({
    MEDICATION: selectedAdmins.find(
      admin => admin.event === EVENTNAMES.MEDICATION
    ),
    MENTAL_HEALTH: selectedAdmins.find(
      admin => admin.event === EVENTNAMES.MENTAL_HEALTH
    ),
    EQUIPMENT_MALFUNCTION: selectedAdmins.find(
      admin => admin.event === EVENTNAMES.EQUIPMENT_MALFUNCTION
    ),
    EMPLOYEE_SAFETY: selectedAdmins.find(
      admin => admin.event === EVENTNAMES.EMPLOYEE_SAFETY
    ),
    ENVIRONMENTAL: selectedAdmins.find(
      admin => admin.event === EVENTNAMES.ENVIRONMENTAL
    ),
    ISSUE_REPORT: selectedAdmins.find(
      admin => admin.event === EVENTNAMES.ISSUE_REPORT
    )
  } as any);

  useEffect(() => {
    setNewSelected({
      MEDICATION: selectedAdmins.find(
        admin => admin.event === EVENTNAMES.MEDICATION
      ),
      MENTAL_HEALTH: selectedAdmins.find(
        admin => admin.event === EVENTNAMES.MENTAL_HEALTH
      ),
      EQUIPMENT_MALFUNCTION: selectedAdmins.find(
        admin => admin.event === EVENTNAMES.EQUIPMENT_MALFUNCTION
      ),
      EMPLOYEE_SAFETY: selectedAdmins.find(
        admin => admin.event === EVENTNAMES.EMPLOYEE_SAFETY
      ),
      ENVIRONMENTAL: selectedAdmins.find(
        admin => admin.event === EVENTNAMES.ENVIRONMENTAL
      ),
      ISSUE_REPORT: selectedAdmins.find(
        admin => admin.event === EVENTNAMES.ISSUE_REPORT
      )
    } as any);
  }, [selectedAdmins]);

  const [isSaveDisabled, setIsSavedDisabled] = useState<boolean>(true);
  const watch = Form.useWatch([], form);
  const onPopupScroll = async (e: any) => {
    if (dropdownLoading) {
      return;
    }
    const { target } = e;
    const currentPagination = { ...pagination };
    if (
      (target as any).scrollTop + (target as any).offsetHeight ===
      (target as any).scrollHeight
    ) {
      // if not load all;
      if (
        !!currentPagination.totalItems &&
        currentPagination.totalItems > adminOptions.length
      ) {
        setDropdownLoading(true);
        const data = await getAdminUserOptions(
          {
            ...currentPagination,
            currentPage: currentPagination.currentPage + 1
          },
          search
        );
        if (!data) {
          setDropdownLoading(false);

          return;
        }
        setPagination({ ...data.paginationInfo, perPage: 25 });
        setAdminOptions([...adminOptions, ...data.adminList]);
        setDropdownLoading(false);
      }
    }
  };

  const onScrollMobile = async () => {
    if (dropdownLoading) {
      return;
    }
    const currentPagination = { ...pagination };

    setDropdownLoading(true);
    const data = await getAdminUserOptions({
      ...currentPagination,
      currentPage: currentPagination.currentPage + 1
    });
    if (!data) {
      setDropdownLoading(false);

      return;
    }
    setPagination({ ...pagination, ...data.paginationInfo });
    setAdminOptions([...adminOptions, ...data.adminList]);
    setDropdownLoading(false);
  };

  const onDropdownVisibleChange = async (open: boolean) => {
    if ((open && adminOptions.length === 0) || search) {
      setDropdownLoading(true);
      const data = await getAdminUserOptions(pagination);
      if (!data) {
        setDropdownLoading(false);

        return;
      }
      setPagination({ ...pagination, ...data.paginationInfo });
      setAdminOptions([...adminOptions, ...data.adminList]);
      setDropdownLoading(false);
      setSearch(undefined);
    }

    if (!open && !!search) {
      setAdminOptions([]);
    }
  };

  const setOptionsList = (event: string) => {
    const selected = selectedAdmins?.find(admin => admin.event === event);

    if (!!selected) {
      const withoutSelected = adminOptions.filter(
        admin => admin.value !== selected.value
      );

      return [selected, ...withoutSelected];
    }

    return [...adminOptions];
  };

  useEffect(() => {
    const match = [];
    for (const item in watch) {
      if (
        (watch[item] as unknown as string) ===
        selectedAdmins.find(admin => admin.event === item)?.value
      ) {
        match.push(true);
      }
    }

    if (match.length === FACILITY_CHECKLIST_ITEMS.length) {
      setIsSavedDisabled(true);
    } else {
      setIsSavedDisabled(false);
    }
  }, [watch, selectedAdmins]);

  const onClickCancel = () => {
    form.resetFields();
    selectedAdmins.forEach(admin => {
      form.setFieldValue(admin.event, admin.value);
    });
    setIsSavedDisabled(true);
    setNewSelected({
      MEDICATION: selectedAdmins.find(
        admin => admin.event === EVENTNAMES.MEDICATION
      ),
      MENTAL_HEALTH: selectedAdmins.find(
        admin => admin.event === EVENTNAMES.MENTAL_HEALTH
      ),
      EQUIPMENT_MALFUNCTION: selectedAdmins.find(
        admin => admin.event === EVENTNAMES.EQUIPMENT_MALFUNCTION
      ),
      EMPLOYEE_SAFETY: selectedAdmins.find(
        admin => admin.event === EVENTNAMES.EMPLOYEE_SAFETY
      ),
      ENVIRONMENTAL: selectedAdmins.find(
        admin => admin.event === EVENTNAMES.ENVIRONMENTAL
      ),
      ISSUE_REPORT: selectedAdmins.find(
        admin => admin.event === EVENTNAMES.ISSUE_REPORT
      )
    } as any);
  };

  const handleSearch = useCallback(
    debounce(e => {
      searchDropdown(e);
    }, 500),
    []
  );

  const searchDropdown = async (search: string) => {
    setDropdownLoading(true);
    const data = await getAdminUserOptions(pagination, search);
    if (!data) {
      setAdminOptions([]);
      setDropdownLoading(false);

      return;
    }
    setPagination({ ...pagination, ...data.paginationInfo });
    setAdminOptions([...data.adminList]);
    setDropdownLoading(false);
  };

  useEffect(() => {
    handleSearch(search);
  }, [search]);

  const validatorForSelect = (_: any, value: any, event: string) => {
    if (!value) {
      return Promise.reject(
        <ErrorMessage
          customStyle={{
            marginBlockEnd: pxToRem(-10),
            width: '85%',
            display: 'flex',
            columnGap: pxToRem(5),
            lineHeight: pxToRem(20)
          }}
        >
          Select User
        </ErrorMessage>
      );
    }

    const isRole = !!newSelected[event].roleServiceList.find(
      role => role.permission === PERMISSIONS_TYPES.WRITE
    )?.permission;

    if (!isRole) {
      return Promise.reject(
        <ErrorMessage
          customStyle={{
            marginBlockEnd: pxToRem(-10),
            width: '85%',
            display: 'flex',
            columnGap: pxToRem(5),
            lineHeight: pxToRem(20)
          }}
        >
          Please contact the facility admin to grant this user SAFE Report
          Investigation privileges
        </ErrorMessage>
      );
    }

    return Promise.resolve();
  };

  const SCROLLBOTTOMCONDITION =
    pagination.totalItems !== adminOptions.length &&
    adminOptions.length !== 0 &&
    !dropdownLoading;

  return (
    <Form form={form} onFinish={onFinish}>
      <div
        style={{
          paddingInline: pxToRem(24),
          paddingBlockStart: pxToRem(24),
          paddingBlockEnd: pxToRem(21),
          borderBlockEnd: `${pxToRem(1)} solid #E5E4E4`
        }}
      >
        <Typography.Title
          style={{ ...titlesStyle, marginBlockEnd: pxToRem(16) }}
        >
          SAFE & Issue Report Investigation
        </Typography.Title>
        <div
          style={{
            backgroundColor: '#F5F5F5',
            paddingBlock: pxToRem(6.5),
            paddingInline: pxToRem(16),
            width: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography.Paragraph
            style={{
              width: isSmall ? pxToRem(111) : pxToRem(195),
              fontWeight: 600,
              lineHeight: pxToRem(22),
              marginBlockEnd: 0,
              fontSize: isSmall ? pxToRem(12) : pxToRem(14),
              flexBasis: isSmall ? '40%' : undefined
            }}
          >
            Event
          </Typography.Paragraph>
          <Typography.Paragraph
            style={{
              fontWeight: 600,
              lineHeight: pxToRem(22),
              marginBlockEnd: 0,
              fontSize: isSmall ? pxToRem(12) : pxToRem(14),
              flexBasis: isSmall ? '60%' : undefined
            }}
          >
            Assigned User
          </Typography.Paragraph>
        </div>
        <div style={eventContainerStyle}>
          <Typography.Text style={eventTypeStyle}>Medication</Typography.Text>
          <div style={selectorStyle}>
            {isSmall && permission === PERMISSION_TYPES_BACKEND.WRITE ? (
              <VsSelectMobileFormItem
                searchPlaceholder={'Search User'}
                modalTitle="Select User"
                placeholder="Select User"
                onSelect={(option, e) => {
                  const tempSelect = {
                    ...newSelected,
                    MEDICATION: option as any
                  };

                  setNewSelected(tempSelect);
                }}
                options={
                  dropdownLoading
                    ? [
                        ...(adminOptions.length === 0
                          ? []
                          : setOptionsList(EVENTNAMES.MEDICATION)),
                        {
                          key: undefined,
                          value: undefined,
                          label: (
                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center'
                              }}
                            >
                              <Spin spinning={true}></Spin>
                            </div>
                          )
                        }
                      ]
                    : setOptionsList(EVENTNAMES.MEDICATION)
                }
                formItemProps={{
                  style: {
                    marginBlockEnd: 0
                  },
                  name: EVENTNAMES.MEDICATION,
                  rules: [
                    {
                      required: true,
                      validator: (_, value) => {
                        return validatorForSelect(
                          _,
                          value,
                          EVENTNAMES.MEDICATION
                        );
                      }
                    }
                  ]
                }}
                onScrollBottom={onScrollMobile}
                onModalVisibleChange={onDropdownVisibleChange}
                scrollBottomCondition={SCROLLBOTTOMCONDITION}
                onSearch={e => setSearch(e)}
              />
            ) : (
              <VsSelectFormItem
                formItemProps={{
                  style: {
                    marginBlockEnd: 0
                  },
                  name: EVENTNAMES.MEDICATION,
                  rules: [
                    {
                      required: true,
                      validator: (_, value) => {
                        return validatorForSelect(
                          _,
                          value,
                          EVENTNAMES.MEDICATION
                        );
                      }
                    }
                  ]
                }}
                showSearch={permission === PERMISSION_TYPES_BACKEND.WRITE}
                onSearch={e => setSearch(e)}
                filterOption={(input: any, option: any) => {
                  return true;
                }}
                onSelect={(option, e) => {
                  const tempSelect = {
                    ...newSelected,
                    MEDICATION: e as any
                  };

                  setNewSelected(tempSelect);
                }}
                options={
                  dropdownLoading
                    ? [
                        ...(adminOptions.length === 0
                          ? []
                          : setOptionsList(EVENTNAMES.MEDICATION)),
                        {
                          key: undefined,
                          value: undefined,
                          label: (
                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center'
                              }}
                            >
                              <Spin spinning={true}></Spin>
                            </div>
                          )
                        }
                      ]
                    : setOptionsList(EVENTNAMES.MEDICATION)
                }
                loading={dropdownLoading}
                onPopupScroll={onPopupScroll}
                onDropdownVisibleChange={onDropdownVisibleChange}
                placeholder="Select"
                open={
                  permission !== PERMISSION_TYPES_BACKEND.WRITE
                    ? false
                    : undefined
                }
                width={'100%'}
                formNamePath={[EVENTNAMES.MEDICATION]}
                setExternalShowLabel={() => {}}
              />
            )}
          </div>
        </div>
        <div style={eventContainerStyle}>
          <Typography.Text style={eventTypeStyle}>
            Mental Health
          </Typography.Text>
          <div style={selectorStyle}>
            {isSmall && permission === PERMISSION_TYPES_BACKEND.WRITE ? (
              <VsSelectMobileFormItem
                searchPlaceholder={'Search User'}
                modalTitle="Select User"
                placeholder="Select User"
                options={
                  dropdownLoading
                    ? [
                        ...(adminOptions.length === 0
                          ? []
                          : setOptionsList(EVENTNAMES.MENTAL_HEALTH)),
                        {
                          key: undefined,
                          value: undefined,
                          label: (
                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center'
                              }}
                            >
                              <Spin spinning={true}></Spin>
                            </div>
                          )
                        }
                      ]
                    : setOptionsList(EVENTNAMES.MENTAL_HEALTH)
                }
                formItemProps={{
                  style: {
                    marginBlockEnd: 0
                  },
                  name: EVENTNAMES.MENTAL_HEALTH,
                  rules: [
                    {
                      required: true,
                      validator: (_, value) => {
                        return validatorForSelect(
                          _,
                          value,
                          EVENTNAMES.MENTAL_HEALTH
                        );
                      }
                    }
                  ]
                }}
                onScrollBottom={onScrollMobile}
                onModalVisibleChange={onDropdownVisibleChange}
                scrollBottomCondition={SCROLLBOTTOMCONDITION}
                onSelect={(option, e) => {
                  const tempSelect = {
                    ...newSelected,
                    MENTAL_HEALTH: option as any
                  };

                  setNewSelected(tempSelect);
                }}
                onSearch={e => setSearch(e)}
              />
            ) : (
              <VsSelectFormItem
                formItemProps={{
                  style: {
                    marginBlockEnd: 0
                  },
                  name: EVENTNAMES.MENTAL_HEALTH,

                  rules: [
                    {
                      required: true,
                      validator: (_, value) => {
                        return validatorForSelect(
                          _,
                          value,
                          EVENTNAMES.MENTAL_HEALTH
                        );
                      }
                    }
                  ]
                }}
                onSelect={(option, e) => {
                  const tempSelect = {
                    ...newSelected,
                    MENTAL_HEALTH: e as any
                  };

                  setNewSelected(tempSelect);
                }}
                options={setOptionsList(EVENTNAMES.MENTAL_HEALTH)}
                loading={dropdownLoading}
                placeholder="Select"
                width={'100%'}
                showSearch={permission === PERMISSION_TYPES_BACKEND.WRITE}
                onSearch={e => setSearch(e)}
                filterOption={(input: any, option: any) => {
                  return true;
                }}
                onPopupScroll={onPopupScroll}
                onDropdownVisibleChange={onDropdownVisibleChange}
                open={
                  permission !== PERMISSION_TYPES_BACKEND.WRITE
                    ? false
                    : undefined
                }
                setExternalShowLabel={() => {}}
              />
            )}
          </div>
        </div>
        <div style={eventContainerStyle}>
          <Typography.Text style={eventTypeStyle}>
            Patient or Employee Safety
          </Typography.Text>
          <div style={selectorStyle}>
            {isSmall && permission === PERMISSION_TYPES_BACKEND.WRITE ? (
              <VsSelectMobileFormItem
                searchPlaceholder={'Search User'}
                modalTitle="Select User"
                placeholder="Select User"
                options={
                  dropdownLoading
                    ? [
                        ...(adminOptions.length === 0
                          ? []
                          : setOptionsList(EVENTNAMES.EMPLOYEE_SAFETY)),
                        {
                          key: undefined,
                          value: undefined,
                          label: (
                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center'
                              }}
                            >
                              <Spin spinning={true}></Spin>
                            </div>
                          )
                        }
                      ]
                    : setOptionsList(EVENTNAMES.EMPLOYEE_SAFETY)
                }
                formItemProps={{
                  style: {
                    marginBlockEnd: 0
                  },
                  name: EVENTNAMES.EMPLOYEE_SAFETY,
                  rules: [
                    {
                      required: true,
                      validator: (_, value) => {
                        return validatorForSelect(
                          _,
                          value,
                          EVENTNAMES.EMPLOYEE_SAFETY
                        );
                      }
                    }
                  ]
                }}
                onScrollBottom={onScrollMobile}
                onModalVisibleChange={onDropdownVisibleChange}
                scrollBottomCondition={SCROLLBOTTOMCONDITION}
                onSelect={(option, e) => {
                  const tempSelect = {
                    ...newSelected,
                    EMPLOYEE_SAFETY: option as any
                  };

                  setNewSelected(tempSelect);
                }}
                onSearch={e => setSearch(e)}
              />
            ) : (
              <VsSelectFormItem
                formItemProps={{
                  style: {
                    marginBlockEnd: 0
                  },
                  name: EVENTNAMES.EMPLOYEE_SAFETY,
                  rules: [
                    {
                      required: true,
                      validator: (_, value) => {
                        return validatorForSelect(
                          _,
                          value,
                          EVENTNAMES.EMPLOYEE_SAFETY
                        );
                      }
                    }
                  ]
                }}
                onSelect={(option, e) => {
                  const tempSelect = {
                    ...newSelected,
                    EMPLOYEE_SAFETY: e as any
                  };
                  setNewSelected(tempSelect);
                }}
                options={setOptionsList(EVENTNAMES.EMPLOYEE_SAFETY)}
                loading={dropdownLoading}
                placeholder="Select"
                width={'100%'}
                showSearch={permission === PERMISSION_TYPES_BACKEND.WRITE}
                onSearch={e => setSearch(e)}
                filterOption={(input: any, option: any) => {
                  return true;
                }}
                onPopupScroll={onPopupScroll}
                onDropdownVisibleChange={onDropdownVisibleChange}
                open={
                  permission !== PERMISSION_TYPES_BACKEND.WRITE
                    ? false
                    : undefined
                }
                setExternalShowLabel={() => {}}
              />
            )}
          </div>
        </div>
        <div style={eventContainerStyle}>
          <Typography.Text style={eventTypeStyle}>
            Environmental
          </Typography.Text>
          <div style={selectorStyle}>
            {isSmall && permission === PERMISSION_TYPES_BACKEND.WRITE ? (
              <VsSelectMobileFormItem
                searchPlaceholder={'Search User'}
                modalTitle="Select User"
                placeholder="Select User"
                options={
                  dropdownLoading
                    ? [
                        ...(adminOptions.length === 0
                          ? []
                          : setOptionsList(EVENTNAMES.ENVIRONMENTAL)),
                        {
                          key: undefined,
                          value: undefined,
                          label: (
                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center'
                              }}
                            >
                              <Spin spinning={true}></Spin>
                            </div>
                          )
                        }
                      ]
                    : setOptionsList(EVENTNAMES.ENVIRONMENTAL)
                }
                formItemProps={{
                  style: {
                    marginBlockEnd: 0
                  },
                  name: EVENTNAMES.ENVIRONMENTAL,
                  rules: [
                    {
                      required: true,
                      validator: (_, value) => {
                        return validatorForSelect(
                          _,
                          value,
                          EVENTNAMES.ENVIRONMENTAL
                        );
                      }
                    }
                  ]
                }}
                onSelect={(option, e) => {
                  const tempSelect = {
                    ...newSelected,
                    ENVIRONMENTAL: option as any
                  };

                  setNewSelected(tempSelect);
                }}
                onScrollBottom={onScrollMobile}
                onModalVisibleChange={onDropdownVisibleChange}
                scrollBottomCondition={SCROLLBOTTOMCONDITION}
                onSearch={e => setSearch(e)}
              />
            ) : (
              <VsSelectFormItem
                formItemProps={{
                  style: {
                    marginBlockEnd: 0
                  },
                  name: EVENTNAMES.ENVIRONMENTAL,
                  rules: [
                    {
                      required: true,
                      validator: (_, value) => {
                        return validatorForSelect(
                          _,
                          value,
                          EVENTNAMES.ENVIRONMENTAL
                        );
                      }
                    }
                  ]
                }}
                options={setOptionsList(EVENTNAMES.ENVIRONMENTAL)}
                onSelect={(option, e) => {
                  const tempSelect = {
                    ...newSelected,
                    ENVIRONMENTAL: e as any
                  };
                  setNewSelected(tempSelect);
                }}
                loading={dropdownLoading}
                placeholder="Select"
                width={'100%'}
                showSearch={permission === PERMISSION_TYPES_BACKEND.WRITE}
                onSearch={e => setSearch(e)}
                filterOption={(input: any, option: any) => {
                  return true;
                }}
                onPopupScroll={onPopupScroll}
                onDropdownVisibleChange={onDropdownVisibleChange}
                open={
                  permission !== PERMISSION_TYPES_BACKEND.WRITE
                    ? false
                    : undefined
                }
                setExternalShowLabel={() => {}}
              />
            )}
          </div>
        </div>
        <div style={eventContainerStyle}>
          <Typography.Text style={eventTypeStyle}>
            Equipment Malfunction
          </Typography.Text>
          <div style={selectorStyle}>
            {isSmall && permission === PERMISSION_TYPES_BACKEND.WRITE ? (
              <VsSelectMobileFormItem
                searchPlaceholder={'Search User'}
                modalTitle="Select User"
                placeholder="Select User"
                options={
                  dropdownLoading
                    ? [
                        ...(adminOptions.length === 0
                          ? []
                          : setOptionsList(EVENTNAMES.EQUIPMENT_MALFUNCTION)),
                        {
                          key: undefined,
                          value: undefined,
                          label: (
                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center'
                              }}
                            >
                              <Spin spinning={true}></Spin>
                            </div>
                          )
                        }
                      ]
                    : setOptionsList(EVENTNAMES.EQUIPMENT_MALFUNCTION)
                }
                formItemProps={{
                  style: {
                    marginBlockEnd: 0
                  },
                  name: EVENTNAMES.EQUIPMENT_MALFUNCTION,
                  rules: [
                    {
                      required: true,
                      validator: (_, value) => {
                        return validatorForSelect(
                          _,
                          value,
                          EVENTNAMES.EQUIPMENT_MALFUNCTION
                        );
                      }
                    }
                  ]
                }}
                onScrollBottom={onScrollMobile}
                onModalVisibleChange={onDropdownVisibleChange}
                scrollBottomCondition={SCROLLBOTTOMCONDITION}
                onSelect={(option, e) => {
                  const tempSelect = {
                    ...newSelected,
                    EQUIPMENT_MALFUNCTION: option as any
                  };

                  setNewSelected(tempSelect);
                }}
                onSearch={e => setSearch(e)}
              />
            ) : (
              <VsSelectFormItem
                formItemProps={{
                  style: {
                    marginBlockEnd: 0
                  },
                  name: EVENTNAMES.EQUIPMENT_MALFUNCTION,
                  rules: [
                    {
                      required: true,
                      validator: (_, value) => {
                        return validatorForSelect(
                          _,
                          value,
                          EVENTNAMES.EQUIPMENT_MALFUNCTION
                        );
                      }
                    }
                  ]
                }}
                onSelect={(option, e) => {
                  const tempSelect = {
                    ...newSelected,
                    EQUIPMENT_MALFUNCTION: e as any
                  };
                  setNewSelected(tempSelect);
                }}
                options={setOptionsList(EVENTNAMES.EQUIPMENT_MALFUNCTION)}
                loading={dropdownLoading}
                placeholder="Select"
                width={'100%'}
                showSearch={permission === PERMISSION_TYPES_BACKEND.WRITE}
                onSearch={e => setSearch(e)}
                filterOption={(input: any, option: any) => {
                  return true;
                }}
                onPopupScroll={onPopupScroll}
                onDropdownVisibleChange={onDropdownVisibleChange}
                open={
                  permission !== PERMISSION_TYPES_BACKEND.WRITE
                    ? false
                    : undefined
                }
                setExternalShowLabel={() => {}}
              />
            )}
          </div>
        </div>

        <div style={eventContainerStyle}>
          <Typography.Text style={eventTypeStyle}>Issue Report</Typography.Text>
          <div style={selectorStyle}>
            {isSmall && permission === PERMISSION_TYPES_BACKEND.WRITE ? (
              <VsSelectMobileFormItem
                searchPlaceholder={'Search User'}
                modalTitle="Select User"
                placeholder="Select User"
                options={
                  dropdownLoading
                    ? [
                        ...(adminOptions.length === 0
                          ? []
                          : setOptionsList(EVENTNAMES.ISSUE_REPORT)),
                        {
                          key: undefined,
                          value: undefined,
                          label: (
                            <div
                              style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center'
                              }}
                            >
                              <Spin spinning={true}></Spin>
                            </div>
                          )
                        }
                      ]
                    : setOptionsList(EVENTNAMES.ISSUE_REPORT)
                }
                formItemProps={{
                  style: {
                    marginBlockEnd: 0
                  },
                  name: EVENTNAMES.ISSUE_REPORT,
                  rules: [
                    {
                      required: true,
                      validator: (_, value) => {
                        return validatorForSelect(
                          _,
                          value,
                          EVENTNAMES.ISSUE_REPORT
                        );
                      }
                    }
                  ]
                }}
                onScrollBottom={onScrollMobile}
                onModalVisibleChange={onDropdownVisibleChange}
                scrollBottomCondition={SCROLLBOTTOMCONDITION}
                onSelect={(option, e) => {
                  const tempSelect = {
                    ...newSelected,
                    ISSUE_REPORT: option as any
                  };

                  setNewSelected(tempSelect);
                }}
                onSearch={e => setSearch(e)}
              />
            ) : (
              <VsSelectFormItem
                formItemProps={{
                  style: {
                    marginBlockEnd: 0
                  },
                  name: EVENTNAMES.ISSUE_REPORT,
                  rules: [
                    {
                      required: true,
                      validator: (_, value) => {
                        return validatorForSelect(
                          _,
                          value,
                          EVENTNAMES.ISSUE_REPORT
                        );
                      }
                    }
                  ]
                }}
                onSelect={(option, e) => {
                  const tempSelect = {
                    ...newSelected,
                    ISSUE_REPORT: e as any
                  };
                  setNewSelected(tempSelect);
                }}
                options={setOptionsList(EVENTNAMES.ISSUE_REPORT)}
                loading={dropdownLoading}
                placeholder="Select"
                width={'100%'}
                showSearch={permission === PERMISSION_TYPES_BACKEND.WRITE}
                onSearch={e => setSearch(e)}
                filterOption={(input: any, option: any) => {
                  return true;
                }}
                onPopupScroll={onPopupScroll}
                onDropdownVisibleChange={onDropdownVisibleChange}
                open={
                  permission !== PERMISSION_TYPES_BACKEND.WRITE
                    ? false
                    : undefined
                }
                setExternalShowLabel={() => {}}
              />
            )}
          </div>
        </div>
      </div>
      {permission === PERMISSION_TYPES_BACKEND.WRITE && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            paddingBlockStart: pxToRem(21),
            paddingInline: pxToRem(24),
            justifyContent: 'end'
          }}
        >
          <VsButton
            size={BUTTON_SIZES.middle}
            onClick={onClickCancel}
            style={{
              marginInlineEnd: pxToRem(10),
              width: isSmall ? '100%' : pxToRem(139)
            }}
          >
            Cancel
          </VsButton>
          <VsButton
            antButtonProps={{
              type: 'primary',

              htmlType: 'submit',
              disabled: isSaveDisabled,
              loading: isLoading
            }}
            size={BUTTON_SIZES.middle}
            style={{
              width: isSmall ? '100%' : pxToRem(139)
            }}
          >
            Save
          </VsButton>
        </div>
      )}
    </Form>
  );
};
export default SafeInvestigationForm;
