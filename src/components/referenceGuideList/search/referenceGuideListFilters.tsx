import { FC, useState } from 'react';
import {
  DownloadOutlined,
  DownOutlined,
  SearchOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { Col, Dropdown, FormInstance, Grid, Row, Typography } from 'antd';
import {
  DrawerFilterButton,
  FilterSearch,
  VsButton,
  VsTooltip
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import useCookies from '@/hooks/useCookies';
import { PERMISSION_TYPES_BACKEND } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { ReferenceGuideListForm } from '../forms/referenceGuideListForm';

interface Props {
  filtersFormRef: FormInstance<any>;
  handleFilterInput: (val: string) => void;
  onChangeReferenceGuide: (value: string) => void;
  filters?: any;
  onDownLoadCSV: () => void;
  onSubmitFilters: (formData: any) => void;
  onResetFilters: () => void;
  toggleReferenceGuideListUploadTypeModal: (value: boolean) => void;
  referenceGuideList?: any[];
  referenceGuideCategoryList: any[];
  referenceGuideSubCategoryList: any[];
  onChangeCategoryFilter: (value: any) => void;
}
const { useBreakpoint } = Grid;

export const ReferenceGuideListFilters: FC<Props> = ({
  filtersFormRef,
  handleFilterInput,
  onChangeReferenceGuide,
  filters,
  onDownLoadCSV,
  onSubmitFilters,
  onResetFilters,
  toggleReferenceGuideListUploadTypeModal,
  referenceGuideList = [],
  referenceGuideCategoryList = [],
  referenceGuideSubCategoryList = [],
  onChangeCategoryFilter
}) => {
  const size = useBreakpoint();
  const admin = useCookies().getDataFromCookie();
  const [isSearching, setSearching] = useState<boolean>(false);
  const [referenceGuideDropdownOpen, setReferenceGuideDropdownOpen] =
    useState(false);

  const blurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };

  return (
    <Row
      justify={'space-between'}
      style={
        size.xs
          ? {
              paddingInline: pxToRem(20),
              alignItems: `center`,
              rowGap: pxToRem(10)
            }
          : { alignItems: `center` }
      }
    >
      <Row
        justify={size.xs ? `start` : `end`}
        style={{
          columnGap: pxToRem(8),
          rowGap: pxToRem(8),
          width: '100%',
          marginTop: window?.innerWidth >= 850 ? pxToRem(-35) : pxToRem(7)
        }}
      >
        <Col>
          {window.innerWidth <= 1350 && !isSearching ? (
            <VsButton
              onClick={() => {
                setSearching(true);
              }}
              size={BUTTON_SIZES.squareIcon}
            >
              <SearchOutlined />
            </VsButton>
          ) : (
            <FilterSearch
              placeholder="Search"
              onBlur={blurSearch}
              autoFocus={window.innerWidth <= 1350 ? true : false}
              onChange={e => {
                handleFilterInput(e.target.value);
              }}
              width={window.innerWidth >= 1920 ? pxToRem(254) : pxToRem(182)}
            />
          )}
        </Col>
        <Col>
          <DrawerFilterButton
            onClickApply={onSubmitFilters}
            handleReset={onResetFilters}
            formRef={filtersFormRef}
            isIcon={window.innerWidth <= 1350}
          >
            <div
              style={{
                paddingInline: pxToRem(16)
              }}
            >
              <ReferenceGuideListForm
                onChangeCategory={onChangeCategoryFilter}
                referenceGuideCategoryOptions={referenceGuideCategoryList}
                referenceGuideSubCategoryOptions={referenceGuideSubCategoryList}
                form={filtersFormRef}
              />
            </div>
          </DrawerFilterButton>
        </Col>
        <Col>
          <Dropdown
            trigger={['click']}
            open={referenceGuideDropdownOpen}
            onOpenChange={setReferenceGuideDropdownOpen}
            menu={{
              selectable: true,
              multiple: false,
              items: referenceGuideList,
              onSelect: (value: any) => {
                onChangeReferenceGuide(value);
                setReferenceGuideDropdownOpen(!referenceGuideDropdownOpen);
              },
              selectedKeys: filters?.referenceGuideId
                ? [filters?.referenceGuideId]
                : []
            }}
          >
            <VsButton
              size={BUTTON_SIZES.middle}
              style={{ width: pxToRem(164) }}
              antButtonProps={{
                disabled: referenceGuideList?.length === 0
              }}
              onClick={() =>
                setReferenceGuideDropdownOpen(!referenceGuideDropdownOpen)
              }
            >
              <VsTooltip title={size.xs && ''} placement="bottom" arrow>
                <DownOutlined
                  style={{
                    fontSize: pxToRem(14),
                    paddingInlineEnd: pxToRem(8)
                  }}
                />
                Reference Guide
              </VsTooltip>
            </VsButton>
          </Dropdown>
        </Col>
        <Col>
          <VsButton
            onClick={onDownLoadCSV}
            size={
              window.innerWidth <= 1350
                ? BUTTON_SIZES.squareIcon
                : BUTTON_SIZES.middle
            }
          >
            <VsTooltip
              title={window.innerWidth <= 1350 && 'Download'}
              placement="bottom"
              arrow
            >
              <DownloadOutlined
                style={{
                  fontSize:
                    window.innerWidth <= 1350 ? pxToRem(16) : pxToRem(14),
                  paddingInlineEnd:
                    window.innerWidth <= 1350 ? undefined : pxToRem(8),
                  display: window.innerWidth <= 1350 ? 'flex' : undefined,
                  alignItems: window.innerWidth <= 1350 ? 'center' : undefined
                }}
              />
              {window.innerWidth > 1350 && (
                <Typography.Text>{'Download'}</Typography.Text>
              )}
            </VsTooltip>
          </VsButton>
        </Col>
        {admin?.rbac?.referenceGuide === PERMISSION_TYPES_BACKEND.WRITE && (
          <Col>
            <VsButton
              size={
                window.innerWidth <= 1000
                  ? BUTTON_SIZES.squareIcon
                  : BUTTON_SIZES.middle
              }
              onClick={() => toggleReferenceGuideListUploadTypeModal(true)}
              antButtonProps={{
                type: 'primary'
              }}
            >
              <VsTooltip
                title={window.innerWidth <= 1000 && 'Upload'}
                placement="bottom"
                arrow
              >
                <UploadOutlined
                  style={{
                    fontSize:
                      window.innerWidth <= 1000 ? pxToRem(16) : pxToRem(14),
                    paddingInlineEnd:
                      window.innerWidth <= 1000 ? undefined : pxToRem(8),
                    display: window.innerWidth <= 1000 ? 'flex' : undefined,
                    alignItems: window.innerWidth <= 1000 ? 'center' : undefined
                  }}
                />
                {window.innerWidth > 1000 && (
                  <Typography.Text style={{ color: 'white' }}>
                    {'Upload'}
                  </Typography.Text>
                )}
              </VsTooltip>
            </VsButton>
          </Col>
        )}
      </Row>
    </Row>
  );
};
