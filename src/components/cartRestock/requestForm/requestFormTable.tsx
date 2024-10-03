import { FC, useState } from 'react';
import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Col, Grid, Row, Spin, Tooltip, Typography } from 'antd';
import debounce from 'lodash.debounce';
import { FilterSearch, VsButton, VsTable } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TRequestForm } from '@/types/requestFormDataTypes';

import useTablePaginationPosition from '@/hooks/useTablePaginationPosition';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZEOPTIONS_FOR_SELECTABLE,
  FORMULARY_PACKAGES_LABEL,
  REQUEST_FORM_TYPE
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { Counter } from './counter';
import { useCartRequestTableStyle } from './useRequestFormTableStyle';

const { useBreakpoint } = Grid;
interface props {
  selectedItems: any[];
  requestTableData: any;
  requestFormData: TRequestForm;
  backToRequestForm: () => void;
  onRequestSelectItems: (key: any) => void;
  setReviewModal: (status: boolean) => void;
  clearSelection: () => void;
  selectAll: (status: boolean) => void;
  onPackageQtyChange: (referenceGuideDrugId: string, value: number) => void;
  onPaginationChange: (pageNumber: number, pageSize: number) => void;
  onSearch: (search: string) => void;
  isLoading: boolean;
  reviewData: any[];
}
export const RequestFormTable: FC<props> = ({
  requestFormData,
  selectedItems,
  requestTableData,
  isLoading,
  reviewData,
  backToRequestForm,
  onRequestSelectItems,
  setReviewModal,
  clearSelection,
  selectAll,
  onPackageQtyChange,
  onPaginationChange,
  onSearch
}) => {
  const [isSearching, setSearching] = useState<boolean>(false);
  const isSmall = window.screen.width <= 576;
  const { tableContainer, searchBar, heading, stickyTable, disabledIcon } =
    useCartRequestTableStyle();
  const size = useBreakpoint();

  const blurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };

  const handleSearch = debounce(e => {
    onSearch(e.target.value);
  }, 500);

  const columns = [
    {
      title: 'Drug',
      width: isSmall ? 150 : undefined,
      render: (value: any) => {
        return requestFormData.type === REQUEST_FORM_TYPE.AFTER_HOURS &&
          !value.containsActiveInventory ? (
          <>
            {value.formulary.name}{' '}
            <Tooltip title={'There is no inventory associated with this drug'}>
              <ExclamationCircleOutlined className={disabledIcon} />
            </Tooltip>
          </>
        ) : (
          value.formulary.name
        );
      }
    },
    {
      title: 'Package',
      width: isSmall ? 150 : undefined,
      render: (value: any) => {
        return <>{FORMULARY_PACKAGES_LABEL(value.formulary.package)}</>;
      }
    },
    {
      title: 'Min',
      width: isSmall ? 150 : undefined,
      render: (value: any) => {
        return value.min;
      }
    },
    {
      title: 'Max',
      width: isSmall ? 150 : undefined,
      render: (value: any) => {
        return value.max;
      }
    },
    {
      title: 'Pending Orders',
      width: isSmall ? 150 : undefined,
      render: (value: any) => {
        return value.cartRequestForm?.pendingOrderQuantity || '-';
      }
    },
    {
      title: 'Pkg Qty',
      width: isSmall ? 150 : undefined,
      render: (value: any) => {
        if (selectedItems.includes(value.key)) {
          return (
            <Counter
              plusButtonType="primary"
              initialValue={value.__temp_pkgQty}
              max={value.max}
              min={value.min}
              pendingOrders={value.cartRequestForm?.pendingOrderQuantity || 0}
              onChange={(packageQty: number) =>
                onPackageQtyChange(value.referenceGuideDrugId, packageQty)
              }
            />
          );
        }
      }
    }
  ].filter(i => {
    if (
      requestFormData?.type === REQUEST_FORM_TYPE.AFTER_HOURS &&
      requestFormData?.isControlled &&
      i.title === 'Pkg Qty'
    ) {
      return false;
    }

    return true;
  });

  const { tableHeight } = useTablePaginationPosition();

  return (
    <Spin spinning={isLoading}>
      <Row gutter={size.xs ? [0, 7] : [0, 16]}>
        <Col span={24} style={{ padding: size.xs ? `0 ${pxToRem(20)}` : '' }}>
          <Row justify={'start'} align={'middle'}>
            <Col span={12} md={12} xs={4}>
              <VsButton
                style={{
                  display: 'inline-flex',
                  marginInlineEnd: size.xs ? pxToRem(7) : pxToRem(16)
                }}
                onClick={backToRequestForm}
                size={BUTTON_SIZES.squareIcon}
                antButtonProps={{
                  icon: <ArrowLeftOutlined />
                }}
              />
              {!size.xs && (
                <>
                  <Typography.Paragraph className={heading}>
                    {requestFormData.type === REQUEST_FORM_TYPE.STANDARD
                      ? 'Standard'
                      : 'After-hours'}{' '}
                    Request: {requestFormData.label}{' '}
                    {requestFormData.isControlled && '(Controlled)'}
                  </Typography.Paragraph>

                  {requestFormData.note && (
                    <Tooltip title={requestFormData.note} placement={'bottom'}>
                      <ExclamationCircleOutlined
                        style={{
                          color: '#FAAD14',
                          fontSize: pxToRem(16),
                          marginLeft: pxToRem(6)
                        }}
                      />
                    </Tooltip>
                  )}
                </>
              )}
            </Col>
            <Col span={12} md={12} xs={20}>
              <Row justify={'end'} align={'middle'} style={{ gap: pxToRem(8) }}>
                {size.xs && !isSearching ? (
                  <VsButton
                    onClick={() => {
                      setSearching(true);
                    }}
                    size={BUTTON_SIZES.squareIcon}
                  >
                    <SearchOutlined />
                  </VsButton>
                ) : (
                  <Col className={searchBar}>
                    <FilterSearch
                      placeholder="Search Drug"
                      onChange={handleSearch}
                      onBlur={blurSearch}
                      autoFocus={size.xs}
                    />
                  </Col>
                )}

                {selectedItems.length > 0 && (
                  <Col>
                    <VsButton
                      onClick={() => setReviewModal(true)}
                      antButtonProps={{
                        disabled: !reviewData.length,
                        type: 'primary'
                      }}
                      size={BUTTON_SIZES.middle}
                    >
                      {requestFormData.type === REQUEST_FORM_TYPE.AFTER_HOURS
                        ? 'Remove from Inventory'
                        : ' Review'}
                    </VsButton>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Col>
        {selectedItems.length > 0 && (
          <Col span={24} style={{ padding: size.xs ? `0 ${pxToRem(20)}` : '' }}>
            <Row justify={'end'}>
              <Col style={{ fontSize: pxToRem(12) }}>
                {selectedItems.length}{' '}
                {`${selectedItems.length > 1 ? 'items' : 'item'} selected`}{' '}
                <a
                  onClick={() => clearSelection()}
                  style={{
                    textDecoration: 'underline',
                    marginLeft: pxToRem(3)
                  }}
                >
                  Clear
                </a>
              </Col>
            </Row>
          </Col>
        )}
        {size.xs && (
          <Col span={24} style={{ padding: size.xs ? `0 ${pxToRem(20)}` : '' }}>
            <Typography.Paragraph className={heading}>
              {requestFormData.type === REQUEST_FORM_TYPE.STANDARD
                ? 'Standard'
                : 'After-hours'}{' '}
              Request:
              {requestFormData.label}
            </Typography.Paragraph>
          </Col>
        )}

        <Col
          span={24}
          className={`${tableContainer} ${selectedItems.length && stickyTable}`}
        >
          <VsTable
            tableProps={{
              dataSource: requestTableData.rows,
              pagination: {
                onChange: onPaginationChange,
                total: requestTableData?.paginationInfo?.totalItems,
                pageSizeOptions: !size.xs
                  ? DEFAULT_PAGE_SIZEOPTIONS_FOR_SELECTABLE
                  : undefined,
                showTotal: size.sm
                  ? (total, range) => {
                      return (
                        <Typography.Text>
                          Showing {range[1]} out of <strong>{total}</strong>
                        </Typography.Text>
                      );
                    }
                  : undefined,
                showSizeChanger: !size.xs,
                size: 'small',
                defaultPageSize: DEFAULT_PAGE_SIZE.SELECTOR,
                position: ['bottomCenter']
              },
              columns,
              rowSelection: {
                onSelect: onRequestSelectItems,
                onSelectAll: selectAll,
                selectedRowKeys: selectedItems,
                type:
                  requestFormData?.type === REQUEST_FORM_TYPE.AFTER_HOURS &&
                  requestFormData?.isControlled
                    ? 'radio'
                    : 'checkbox',
                onChange: (value: any) => {},
                columnWidth: pxToRem(48)
              },
              rowClassName: record => {
                if (
                  requestFormData?.type === REQUEST_FORM_TYPE.AFTER_HOURS &&
                  !record.containsActiveInventory
                ) {
                  return 'disabled-row';
                }

                return '';
              },
              sticky: true,
              scroll: {
                x: 'max-content',
                y:
                  requestTableData?.rows.length === 0
                    ? undefined
                    : selectedItems.length > 0
                      ? tableHeight - 50
                      : tableHeight
              }
            }}
          />
        </Col>
      </Row>
    </Spin>
  );
};
