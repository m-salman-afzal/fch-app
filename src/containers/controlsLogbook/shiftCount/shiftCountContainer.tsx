import { FormInstance, Tag } from 'antd';

import { TPagination } from '@/types/commonTypes';
import {
  TShiftCountData,
  TShiftCountSubmitForm
} from '@/types/shiftCountTypes';

import { getShiftCountColumns } from '@/components/controlsLogbook/shiftCount/getShiftCountColumns';
import ShiftCountTable from '@/components/controlsLogbook/shiftCount/shiftCountTable';

import useCookies from '@/hooks/useCookies';
import { pxToRem } from '@/utils/sharedUtils';

interface props {
  form: FormInstance<TShiftCountSubmitForm>;
  isLoading: boolean;
  onChangeNumberInput: (shiftCountId: string, value?: number) => void;
  shiftCountData: TShiftCountData[];
  selectedCart: string;
  pagination: TPagination;
  onLoadMore: () => {};
  searchText: string;
  quantities: {
    countedQuantity?: number;
    perpetualInventoryId: string;
    isDiscrepancyFlag: boolean;
    isError?: boolean;
  }[];
}

const ShiftCountContainer: React.FC<props> = ({
  form,
  onChangeNumberInput,
  isLoading,
  shiftCountData = [],
  selectedCart,
  pagination,
  onLoadMore,
  searchText,
  quantities
}) => {
  const { getDataFromCookie } = useCookies();
  const admin = getDataFromCookie();
  const shiftCountColumns = getShiftCountColumns(
    admin?.rbac?.controlLogBookAdminister,
    quantities,
    false,
    onChangeNumberInput
  );

  const isSmall = window.screen.width <= 576;

  return (
    <div style={{ marginBlockStart: pxToRem(12) }}>
      <div
        style={{
          marginBlockEnd: pxToRem(4),
          paddingInline: isSmall ? 20 : undefined
        }}
      >
        Cart:
        <Tag
          style={{
            marginLeft: pxToRem(8)
          }}
          bordered={false}
          color="blue"
        >
          {selectedCart}
        </Tag>
      </div>
      <ShiftCountTable
        onLoadMore={onLoadMore}
        isLoading={isLoading}
        columns={shiftCountColumns}
        shiftCountData={shiftCountData}
        pagination={pagination}
        searchText={searchText}
      />
    </div>
  );
};

export default ShiftCountContainer;
