import React, { useEffect, useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Form, Tooltip } from 'antd';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { Pagination } from '@/types/commonTypes';
import type { TMedpassDateFilters } from '@/types/medpassTypes';

import { DowntimeMedpassLayout } from '@/components/downtimeMedpass/layout/downtimeMedpassLayout';

import { useFetch } from '@/hooks/useFetch';
import { DEFAULT_PAGINATION_VALUES } from '@/utils/constants';
import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import { getDowntimeMedpassUrl } from '@/utils/endpoints';

const defaultDateRange = {
  dateFrom: getFormattedDateInEST({
    subtract: {
      unit: 'days',
      amount: 89
    },
    format: DATE_FORMATS.YMD
  }),
  dateTo: getFormattedDateInEST({
    format: DATE_FORMATS.YMD
  })
};
export const DowntimeMedpassContainer = () => {
  const [formRef] = Form.useForm();
  const [medPassData, setMedpassData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination>(
    DEFAULT_PAGINATION_VALUES
  );
  const { fetchData, isLoading } = useFetch();
  const [dates, setToDates] = useState<TMedpassDateFilters>({
    dateFrom: undefined,
    dateTo: undefined
  });

  const onClickDownload = async (item: any) => {
    const url = `${getDowntimeMedpassUrl()}/download`;
    const downtimeMedpass = await fetchData(url, {
      medicationListId: item.medicationListId
    });
    if (downtimeMedpass) {
      const fileContent = downtimeMedpass.length
        ? downtimeMedpass
        : [{ '': '' }];
      const csvConfig = mkConfig({
        useKeysAsHeaders: true,
        fieldSeparator: ',',
        filename: `${getFormattedDateInEST({
          date: item.dateTime,
          format: DATE_FORMATS.FILE_DATE
        })} Downtime Medpass.csv`
      });
      const csv = generateCsv(csvConfig)(fileContent);
      download(csvConfig)(csv);
    }
  };

  const onFilterReset = () => {
    formRef.resetFields();
  };

  const onFilterApply = (fields: TMedpassDateFilters) => {
    let updatedDates = fields;
    if (fields.dateFrom) {
      updatedDates = {
        ...updatedDates,
        dateFrom: getFormattedDateInEST({
          date: fields.dateFrom,
          format: DATE_FORMATS.YMD
        })
      };
    }

    if (fields.dateTo) {
      updatedDates = {
        ...updatedDates,
        dateTo: getFormattedDateInEST({
          date: fields.dateTo,
          format: DATE_FORMATS.YMD
        })
      };
    }

    setToDates(updatedDates);
    const paylaod = {
      ...DEFAULT_PAGINATION_VALUES,
      ...updatedDates
    };

    getDowntimeMedpass(paylaod);
  };

  const getDowntimeMedpass = async (paylaod: any) => {
    const medPass = await fetchData(getDowntimeMedpassUrl(), {
      ...paylaod,
      dateFrom: !paylaod.dateFrom
        ? defaultDateRange.dateFrom
        : paylaod.dateFrom,
      dateTo: !paylaod.dateTo ? defaultDateRange.dateTo : paylaod.dateTo
    });
    if (medPass.status !== 'error') {
      setMedpassData(medPass.rows);

      return setPagination(preState => {
        return { ...preState, ...medPass.paginationInfo };
      });
    }

    setMedpassData([]);
    setPagination(DEFAULT_PAGINATION_VALUES);
  };

  const onPaginationChange = (pageNumber: number, perPage: number) => {
    const updatedPagination = {
      ...pagination,
      currentPage: pageNumber,
      perPage
    };
    setPagination(updatedPagination);
    getDowntimeMedpass({ ...dates, ...updatedPagination });
  };

  useEffect(() => {
    getDowntimeMedpass({ ...dates, ...pagination });
  }, []);

  const tableColumns = [
    {
      title: 'Date & Time',
      render: (item: any) => {
        return getFormattedDateInEST({
          date: item.dateTime,
          format: DATE_FORMATS.MDY_TIME
        });
      }
    },
    {
      title: '',
      width: 56,
      align: 'center',

      render: (item: any) => {
        return (
          <VsButton size={BUTTON_SIZES.squareIcon}>
            <Tooltip title={'Download'}>
              <DownloadOutlined onClick={() => onClickDownload(item)} />
            </Tooltip>
          </VsButton>
        );
      }
    }
  ];

  return (
    <>
      <DowntimeMedpassLayout
        data={medPassData}
        tableColumns={tableColumns}
        onFilterApply={onFilterApply}
        onFilterReset={onFilterReset}
        formRef={formRef}
        onClickDownload={onClickDownload}
        isLoading={isLoading}
        onPaginationChange={onPaginationChange}
        pagination={pagination}
        filterDate={dates}
      />
    </>
  );
};
