import { useEffect, useState } from 'react';
import { FormInstance } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';

import { SelectOption, TPaginatedData, TPagination } from '@/types/commonTypes';
import {
  TShiftCountComment,
  TShiftCountFilter,
  TShiftCountLogDrugsData,
  TShiftCountLogsData
} from '@/types/shiftCountTypes';

import FilterTags from '@/components/common/filterTags/filterTags';
import { getShiftCountLogsColumns } from '@/components/controlsLogbook/shiftCount/getShiftCountLogsColumns';
import ShiftCountLogsTable from '@/components/controlsLogbook/shiftCount/shiftCountLogsTable';
import ViewCommentModal from '@/components/controlsLogbook/shiftCount/viewCommentModal';
import ViewShiftCountLogDrugsModal from '@/components/controlsLogbook/shiftCount/viewShiftCountLogDrugsModal';

import { useFetch } from '@/hooks/useFetch';
import { ALL, DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';
import { API_BASE_URL } from '@/utils/urls';

import {
  CONTROL_LOGBOOK_ADMINISTER,
  SHIFT_COUNT_LOGS,
  SHIFT_COUNT_LOGS_DRUGS
} from './urls';

interface props {
  form: FormInstance<TShiftCountFilter>;
  filterState: TShiftCountFilter;
  onChangeFilters: (values: TShiftCountFilter) => void;
  getShiftCountLogsData: (
    pagination: TPagination,
    filters: TShiftCountFilter
  ) => Promise<void>;
  onChangePagination: (page: number, pageSize: number) => Promise<void>;
  shiftCountLogsData: TShiftCountLogsData[];
  pagination: TPagination;
  cartOptions: SelectOption[];
  isLoading: boolean;
}

const filterInitialValues = {
  fromDate: undefined,
  toDate: undefined,
  cartId: ALL
};

const ShiftCountLogsContainer: React.FC<props> = ({
  form,
  filterState,
  onChangeFilters,
  getShiftCountLogsData,
  onChangePagination,
  pagination,
  shiftCountLogsData,
  cartOptions,
  isLoading
}) => {
  const isSmall = window.screen.width <= 576;
  const shiftCountLogOpenFromNotification =
    useSearchParams().get('shiftCountLogId');
  const router = useRouter();
  const fetchLogs = useFetch();

  const [openedComment, setOpenedComment] = useState<
    TShiftCountComment | undefined
  >();

  const [shiftCountLogIdOpened, setShiftCountLogIdOpened] =
    useState<string>('');

  const [scLogDrugs, setScLogDrugs] = useState<TShiftCountLogDrugsData[]>([]);

  const paginationInitialValues = {
    currentPage: 1,
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  };

  useEffect(() => {
    getShiftCountLogsData(paginationInitialValues, {});
  }, []);

  const scLogDrugspaginationInitialValues = {
    currentPage: 1,
    perPage: isSmall ? DEFAULT_PAGE_SIZE.MOBILE : DEFAULT_PAGE_SIZE.DESKTOP
  };

  const [scLogDrugPagination, setScLogDrugPagination] = useState<TPagination>(
    scLogDrugspaginationInitialValues
  );

  const getShiftCountLogDrugsData = async (
    pagination: TPagination,
    shiftCountLogId: string
  ) => {
    try {
      const url = `${API_BASE_URL}${CONTROL_LOGBOOK_ADMINISTER}/${SHIFT_COUNT_LOGS_DRUGS}`;
      const data: TPaginatedData<TShiftCountLogDrugsData> =
        await fetchLogs.fetchData(url, {
          ...pagination,
          shiftCountLogId
        });

      if (data.rows) {
        setScLogDrugs(
          data.rows.map(row => ({ ...row, key: row.shiftCountLogDrugId }))
        );

        setScLogDrugPagination(data.paginationInfo);

        return;
      }

      setScLogDrugs([]);

      setScLogDrugPagination(scLogDrugspaginationInitialValues);

      return;
    } catch (error) {}
  };

  const onClickCommentButton = (comment: TShiftCountComment) => {
    setOpenedComment(comment);
  };

  const onCloseCommentModal = () => {
    setOpenedComment(undefined);
  };

  const onCloseLogModal = () => {
    setShiftCountLogIdOpened('');
    router.push('/controlsLogbook?tab=SHIFT_COUNT&subTab=shiftCountLogs');
    setScLogDrugs([]);
  };

  const onChangeScLogsPagination = async (page: number, pageSize: number) => {
    const newPagination: TPagination = {
      ...pagination,
      perPage: pageSize,
      currentPage: page
    };
    await getShiftCountLogDrugsData(newPagination, shiftCountLogIdOpened);
    setScLogDrugPagination(newPagination);
  };

  const onClickShiftCountLogView = async (shitfCountLogId: string) => {
    setShiftCountLogIdOpened(shitfCountLogId);
    await getShiftCountLogDrugsData(
      scLogDrugspaginationInitialValues,
      shitfCountLogId
    );
  };

  useEffect(() => {
    if (shiftCountLogOpenFromNotification) {
      onClickShiftCountLogView(shiftCountLogOpenFromNotification);
    }
  }, []);

  const columns = getShiftCountLogsColumns(
    onClickCommentButton,
    onClickShiftCountLogView
  );

  return (
    <div style={{ marginBlockStart: pxToRem(12) }}>
      <FilterTags<TShiftCountFilter>
        filterForm={form}
        filterState={filterState}
        filterInitialValues={filterInitialValues}
        onChangeFilters={onChangeFilters}
        customKeys={{
          cartId: 'Cart'
        }}
        customMapForSelect={{
          cartId: cartOptions
        }}
      />
      <div style={{ marginTop: pxToRem(4) }}>
        <ShiftCountLogsTable
          columns={columns}
          shiftCountLogsData={shiftCountLogsData}
          pagination={pagination}
          onChangePagination={onChangePagination}
          isLoading={isLoading}
        />
      </div>
      <ViewCommentModal
        onCloseModal={onCloseCommentModal}
        openedComment={openedComment}
      />
      <ViewShiftCountLogDrugsModal
        open={!!shiftCountLogIdOpened}
        onCloseModal={onCloseLogModal}
        scLogDrugs={scLogDrugs}
        pagination={scLogDrugPagination}
        isLoading={fetchLogs.isLoading}
        onChangePagination={onChangeScLogsPagination}
      />
    </div>
  );
};

export default ShiftCountLogsContainer;
