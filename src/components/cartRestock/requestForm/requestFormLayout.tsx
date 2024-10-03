import { FC } from 'react';
import { Col, Row } from 'antd';

import { Pagination, SelectOption } from '@/types/commonTypes';
import { TRequestFormData } from '@/types/requestFormDataTypes';

import { REQUEST_FORM_TYPE } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { ControlledDrugModal } from './controlledDrugModal';
import { RequestForm } from './requestForm';
import { RequestFormTable } from './requestFormTable';
import { ReviewModal } from './reviewModal';

interface props {
  requestForm: any;
  selectedItems: any[];
  requestTableData: { rows: TRequestFormData[]; pagination: Pagination };
  isRequestFormSubmit: boolean;
  requestFormData: any;
  cartData: any;
  isReviewModal: boolean;
  reviewData: any[];
  onRequestFormSubmit: (values: any) => void;
  backToRequestForm: () => void;
  onRequestSelectItems: (key: any) => void;
  setReviewModal: (status: boolean) => void;
  clearSelection: () => void;
  selectAll: (status: boolean) => void;
  onPackageQtyChange: (referenceGuideDrugId: string, value: number) => void;
  requestReviewSubmit: () => void;
  onPaginationChange: (pageNumber: number, pageSize: number) => void;
  onSearch: (search: string) => void;
  onControlledRequestSubmit: (values: any) => Promise<void>;
  isLoading: boolean;
  onCartSearch: (value: string) => void;
  filteredCartList: SelectOption[];
  isWriteAccess: boolean;
  onScrollCartList: () => void;
  searchText: string;
}

export const RequestFormLayout: FC<props> = ({
  requestForm,
  selectedItems,
  requestTableData,
  isRequestFormSubmit,
  requestFormData,
  cartData,
  isReviewModal,
  reviewData,
  isLoading,
  filteredCartList,
  isWriteAccess,
  searchText,
  selectAll,
  onRequestFormSubmit,
  backToRequestForm,
  onRequestSelectItems,
  setReviewModal,
  clearSelection,
  onPackageQtyChange,
  requestReviewSubmit,
  onPaginationChange,
  onSearch,
  onControlledRequestSubmit,
  onCartSearch,
  onScrollCartList
}) => {
  return (
    <Row style={{ marginTop: pxToRem(16) }}>
      <Col span={24}>
        {!isRequestFormSubmit ? (
          <RequestForm
            searchText={searchText}
            isWriteAccess={isWriteAccess}
            requestFormData={requestFormData}
            filteredCartList={filteredCartList}
            onCartSearch={onCartSearch}
            onScrollCartList={onScrollCartList}
            cartData={cartData}
            requestForm={requestForm}
            onRequestFormSubmit={onRequestFormSubmit}
          />
        ) : (
          <RequestFormTable
            reviewData={reviewData}
            isLoading={isLoading}
            onRequestSelectItems={onRequestSelectItems}
            backToRequestForm={backToRequestForm}
            requestFormData={requestFormData}
            selectedItems={selectedItems}
            requestTableData={requestTableData}
            setReviewModal={setReviewModal}
            clearSelection={clearSelection}
            selectAll={selectAll}
            onPackageQtyChange={onPackageQtyChange}
            onPaginationChange={onPaginationChange}
            onSearch={onSearch}
          />
        )}
      </Col>
      {requestFormData?.type === REQUEST_FORM_TYPE.AFTER_HOURS &&
      requestFormData?.isControlled ? (
        <ControlledDrugModal
          isLoading={isLoading}
          isOpen={isReviewModal}
          reviewData={reviewData}
          requestFormData={requestFormData}
          onCancel={() => setReviewModal(false)}
          onSubmit={onControlledRequestSubmit}
        />
      ) : (
        <ReviewModal
          isLoading={isLoading}
          tableData={reviewData}
          onCancel={() => setReviewModal(false)}
          onSubmit={requestReviewSubmit}
          isOpen={isReviewModal}
          requestFormData={requestFormData}
        />
      )}
    </Row>
  );
};
