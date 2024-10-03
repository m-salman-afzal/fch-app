import { FC, useEffect, useState } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Pagination, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { ContactsTable } from '@/components/communication/contactsTable';
import { UpdateTimeModal } from '@/components/communication/modals/updateTimeModal';
import { useReportsTableStyle } from '@/components/communication/useReportsTableStyle';

import { useFetch } from '@/hooks/useFetch';
import { CONTACT_TYPES, PERMISSION_TYPES_BACKEND } from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateNoTimeZone
} from '@/utils/dateFormatsTimezones';
import {
  pxToRem,
  TABLE_BUTTON_ICON_SIZE,
  TABLE_BUTTON_STYLE,
  toTitleCase
} from '@/utils/sharedUtils';
import { API_BASE_URL, COMMUNICATION_URL } from '@/utils/urls';

interface Props {
  searchText: string;
  permission: string;
}

export const ReportsContainer: FC<Props> = ({ searchText, permission }) => {
  const { fetchData, updateData } = useFetch();
  const [cronFormRef] = Form.useForm();
  const [filteredCrons, setFilteredCrons] = useState<any[]>([]);
  const [crons, setCrons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCronModal, setShowCronModal] = useState(false);
  const [processToEdit, setProcessToEdit] = useState<string | null>(null);

  useEffect(() => {
    getAllCrons({});
  }, []);

  useEffect(() => {
    onSubmitFilters(searchText);
  }, [searchText]);

  const onCancelCronForm = () => {
    cronFormRef.resetFields();
    setShowCronModal(false);
    setIsLoading(false);
  };

  const getAllCrons = async (filters: any) => {
    setIsLoading(true);
    const allCrons = await fetchData(
      `${API_BASE_URL}${COMMUNICATION_URL}/getProcess`,
      filters
    );

    if (allCrons?.length > 0) {
      const indexedCrons = allCrons.map((item: any) => {
        item.key = item.processId;

        return item;
      });
      setCrons(indexedCrons);
      setFilteredCrons(indexedCrons);
    } else {
      setCrons([]);
      setFilteredCrons([]);
    }

    setIsLoading(false);
  };

  const onSubmitFilters = (text: string) => {
    const filteredCrons = crons.filter((cron: any) => {
      return cron.processName.toLowerCase().indexOf(text.toLowerCase()) !== -1;
    });
    setFilteredCrons(filteredCrons);
  };

  const onSubmitCronForm = async (data: any) => {
    setIsLoading(true);
    const updatedTime = await updateData(
      `${API_BASE_URL}${COMMUNICATION_URL}/editProcess/${processToEdit}`,
      {
        time: getFormattedDateNoTimeZone({
          date: data.time,
          parseFrom: 'HH:mm:ss',
          format: DATE_FORMATS.HMS_TIME
        })
      }
    );
    if (updatedTime) {
      let newCronsArray: any = [];
      let newFilteredCronsArray: any = [];
      for (const cron of structuredClone(crons)) {
        if (cron.processId === processToEdit) {
          cron.time = getFormattedDateNoTimeZone({
            date: data.time,
            parseFrom: 'HH:mm:ss',
            format: DATE_FORMATS.HMS_TIME
          });
        }
        newCronsArray.push(cron);
      }
      for (const cron of structuredClone(filteredCrons)) {
        if (cron.processId === processToEdit) {
          cron.time = getFormattedDateNoTimeZone({
            date: data.time,
            parseFrom: 'HH:mm:ss',
            format: DATE_FORMATS.HMS_TIME
          });
        }
        newFilteredCronsArray.push(cron);
      }
      setCrons(structuredClone(newCronsArray));
      setFilteredCrons(structuredClone(newFilteredCronsArray));
      onCancelCronForm();
      // ShowToast('Cron time has been updated', 'success', 5);
    } else {
      // ShowToast('Can not update cron time. Try again', 'error', 5);
    }
    setIsLoading(false);
  };

  const onUpdateCronType = async (data: any) => {
    setIsLoading(true);
    const processToEdit = data.processId;
    setProcessToEdit(data.processId);

    cronFormRef.setFieldsValue({
      type: data?.type
    });

    const updatedType = await updateData(
      `${API_BASE_URL}${COMMUNICATION_URL}/editProcess/${processToEdit}`,
      { type: data.type }
    );
    if (updatedType) {
      let newCronsArray: any = [];
      let newFilteredCronsArray: any = [];
      for (const cron of structuredClone(crons)) {
        if (cron.processId === processToEdit) {
          cron.type = data.type;
        }
        newCronsArray.push(cron);
      }
      for (const cron of structuredClone(filteredCrons)) {
        if (cron.processId === processToEdit) {
          cron.type = data.type;
        }
        newFilteredCronsArray.push(cron);
      }
      setCrons(structuredClone(newCronsArray));
      setFilteredCrons(structuredClone(newFilteredCronsArray));
      onCancelCronForm();
      // ShowToast('Cron type has been updated', 'success', 5);
    } else {
      // ShowToast('Can not update cron type. Try again', 'error', 5);
    }
    setIsLoading(false);
  };

  const onUpdateCronTimeSelect = async (cron: any) => {
    setShowCronModal(true);
    setProcessToEdit(cron.processId);
    cronFormRef.setFieldsValue({
      time: dayjs(cron?.time, 'hh:mm:ss', true)
    });
  };

  const tableColumns: any[] = [
    {
      title: 'Report Name',
      key: 'reportName',
      dataIndex: 'processName',
      width: pxToRem(214)
    },
    {
      title: 'Method',
      key: 'method',
      dataIndex: 'method',
      width: pxToRem(214),
      render: (value: any) => {
        return (
          <Tag
            style={
              value === 'REPORT'
                ? {
                    background: '#D9F7BE80',
                    color: '#135200',
                    borderRadius: 12,
                    border: 'none'
                  }
                : {
                    borderRadius: 12,
                    border: 'none'
                  }
            }
          >
            {value?.charAt(0) + value?.slice(1)?.toLowerCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Time',
      key: 'time',
      width: pxToRem(214),
      dataIndex: 'time'
    },
    {
      title: 'Type',
      key: 'type',
      width: pxToRem(214),
      render: (value: any) => {
        return (
          <Typography.Text>
            {value.type === 'BOTH'
              ? 'Internal & External'
              : toTitleCase(value.type ?? '')}
          </Typography.Text>
        );
      }
    }
  ];
  permission === PERMISSION_TYPES_BACKEND.WRITE &&
    tableColumns.push({
      title: '',
      key: 'actions',
      width: 45,
      render: (value: any) => {
        return (
          <>
            {value.method === 'CRON' ? (
              <Dropdown
                placement={'bottomRight'}
                trigger={['click']}
                key={value}
                menu={{
                  items: [
                    {
                      key: 1,
                      label: 'Update Time',
                      onClick: () => {
                        onUpdateCronTimeSelect(value);
                      }
                    }
                  ]
                }}
              >
                <VsButton
                  antButtonProps={{
                    icon: <MoreOutlined style={TABLE_BUTTON_ICON_SIZE} />
                  }}
                  style={TABLE_BUTTON_STYLE}
                  size={BUTTON_SIZES.squareIcon}
                />
              </Dropdown>
            ) : (
              <Dropdown
                placement={'bottomRight'}
                trigger={['click']}
                key={value}
                menu={{
                  items: [
                    {
                      key: 1,
                      label: 'Set as Internal',
                      onClick: () => {
                        onUpdateCronType({
                          ...value,
                          type: CONTACT_TYPES.INTERNAL.toUpperCase()
                        });
                      }
                    },
                    {
                      key: 2,
                      label: 'Set as External',
                      onClick: () => {
                        onUpdateCronType({
                          ...value,
                          type: CONTACT_TYPES.EXTERNAL.toUpperCase()
                        });
                      }
                    },
                    {
                      key: 3,
                      label: 'Set as Internal & External',
                      onClick: () => {
                        onUpdateCronType({
                          ...value,
                          type: CONTACT_TYPES.BOTH.toUpperCase()
                        });
                      }
                    }
                  ]
                }}
              >
                <VsButton
                  antButtonProps={{
                    icon: <MoreOutlined style={TABLE_BUTTON_ICON_SIZE} />
                  }}
                  style={TABLE_BUTTON_STYLE}
                  size={BUTTON_SIZES.squareIcon}
                />
              </Dropdown>
            )}
          </>
        );
      }
    });

  return (
    <div>
      <ContactsTable
        useTableStyle={useReportsTableStyle}
        tableData={filteredCrons}
        tableColumns={tableColumns}
        pagination={undefined}
        onChangePagination={() => {}}
        isLoading={isLoading}
      />
      <UpdateTimeModal
        setModalOpen={setShowCronModal}
        modalOpen={showCronModal}
        formRef={cronFormRef}
        handleFormSubmit={onSubmitCronForm}
      />
    </div>
  );
};
