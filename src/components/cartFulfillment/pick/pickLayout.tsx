import { FC, PropsWithChildren } from 'react';
import { px2remTransformer } from '@ant-design/cssinjs';

import { TCartFullfillmentPick } from '@/types/cartFulfillmentTypes';
import { TPagination } from '@/types/commonTypes';

import { PICK_TABS } from '@/containers/carFulfillment/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { PickNavigation } from './pickNavigation';
import ProcessedTable from './processedTableLayout';
import { UnprocessedTable } from './unprocessedTableLayout';

interface Props {
  pickData: TCartFullfillmentPick[];
  setSelectedTab: (val: string) => void;
  pagination: TPagination | undefined;
  onChangePagination: (page: number, pageSize: number) => void;
  isLoading: boolean;
  selectedRowKeys: React.Key[];
  onSelectCheckbox: (
    record: any,
    selected: any,
    selectedRows: any,
    nativeEvent: any
  ) => void;
  onSelectAllCheckboxes: (
    selected: any,
    selectedRows: any,
    changeRows: any
  ) => void;
  unprocessedColumns: any[];
  processedColumns: any[];
  selectedTab: any;
  onClickClear: () => void;
  selectedUnprocessedData: TCartFullfillmentPick[];
  handleSearch: (e: any) => void;
  onClickProcess: () => Promise<void>;
  search: string;
}

export const PickLayout: FC<PropsWithChildren<Props>> = ({
  pickData,
  pagination,
  onChangePagination,
  setSelectedTab,
  isLoading,
  selectedRowKeys,
  onSelectCheckbox,
  onSelectAllCheckboxes,
  unprocessedColumns,
  processedColumns,
  selectedTab,
  onClickClear,
  selectedUnprocessedData,
  handleSearch,
  onClickProcess,
  search
}) => {
  return (
    <div>
      <PickNavigation
        setSelectedTab={setSelectedTab}
        onClickClear={onClickClear}
        unprocessedSelectedData={selectedUnprocessedData}
        handleSearch={handleSearch}
        onClickProcess={onClickProcess}
        isLoading={isLoading}
        search={search}
        selectedScreen={selectedTab}
      />
      <div style={{ marginTop: pxToRem(12) }}>
        {selectedTab === PICK_TABS[0]?.value && (
          <UnprocessedTable
            tableColumns={unprocessedColumns}
            tableData={pickData}
            pagination={pagination}
            onChangePagination={onChangePagination}
            isLoading={isLoading}
            selectedRowKeys={selectedRowKeys}
            onSelectCheckbox={onSelectCheckbox}
            onSelectAllCheckboxes={onSelectAllCheckboxes}
          />
        )}

        {selectedTab === PICK_TABS[1]?.value && (
          <ProcessedTable
            processedColumns={processedColumns}
            processedData={pickData}
            isLoading={isLoading}
            paginationData={pagination}
            onChangePagination={onChangePagination}
          />
        )}
      </div>
    </div>
  );
};
