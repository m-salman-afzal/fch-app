import { FC, useState } from 'react';
import {
  DownloadOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { Col, Grid, Row, Typography } from 'antd';
import { FilterSearch, VsButton, VsTooltip } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import useCookies from '@/hooks/useCookies';
import {
  ALL,
  PERMISSION_TYPES,
  PERMISSION_TYPES_BACKEND,
  STATUS_ACTIVE_INACTIVE
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

interface Props {
  addFacilityModalOpen: (val: boolean) => void;
  handleFilterInput: (val: string) => void;
  openBulkUploadModel: (value: boolean) => void;
  drugCount: number;
  onDownLoadCSV: () => void;
  setFilterOpen: (val: any) => void;
  showDrugTypeOption: boolean;
}
const { useBreakpoint } = Grid;

export const FormularySearch: FC<Props> = ({
  handleFilterInput,
  addFacilityModalOpen,
  openBulkUploadModel,
  drugCount,
  showDrugTypeOption,
  onDownLoadCSV,
  setFilterOpen
}) => {
  const size = useBreakpoint();
  const admin = useCookies().getDataFromCookie();
  let statusOptions = [
    { label: ALL, key: ALL, value: ALL },
    ...STATUS_ACTIVE_INACTIVE,
    ...[{ label: 'Controlled', value: 'CONTROLLED', key: 'controlled' }]
  ].filter(option => {
    if (option.label === 'Controlled') {
      return showDrugTypeOption;
    }

    return true;
  });
  const [isSearching, setSearching] = useState<boolean>(false);

  const blurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };
  const showCtas =
    admin.rbac.formularyControlled === PERMISSION_TYPES_BACKEND.WRITE ||
    admin.rbac.formularyNonControlled === PERMISSION_TYPES_BACKEND.WRITE;

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
      <Row>
        {size.xs && (
          <Typography.Text style={{ fontSize: pxToRem(16), fontWeight: 600 }}>
            Formulary
          </Typography.Text>
        )}
        {!size.xs && (
          <Typography.Text
            style={{
              fontSize: pxToRem(16),
              fontWeight: 600,
              color: 'rgba(0, 0, 0, 0.45)'
            }}
          >
            Drug Count:{' '}
            <span style={{ color: 'rgba(0, 0, 0, 0.88)' }}>{drugCount}</span>
          </Typography.Text>
        )}
      </Row>
      <Row
        justify={size.xs ? `start` : `end`}
        style={{ columnGap: pxToRem(8), rowGap: pxToRem(8) }}
      >
        <Col>
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
            <FilterSearch
              placeholder="Search"
              onBlur={blurSearch}
              autoFocus={size.xs ? true : false}
              onChange={e => {
                handleFilterInput(e.target.value);
              }}
              width={pxToRem(250)}
            />
          )}
        </Col>

        <Col>
          <VsButton
            size={BUTTON_SIZES.middle}
            onClick={() => setFilterOpen(true)}
          >
            <FilterOutlined
              style={{
                fontSize: pxToRem(14)
              }}
            />
            Filters
          </VsButton>
        </Col>

        <Col>
          <VsButton
            onClick={onDownLoadCSV}
            size={size.xs ? BUTTON_SIZES.squareIcon : BUTTON_SIZES.middle}
          >
            <VsTooltip title={size.xs && 'Download'} placement="bottom" arrow>
              <DownloadOutlined
                style={{
                  fontSize: size.xs ? pxToRem(16) : pxToRem(14),
                  paddingInlineEnd: size.xs ? undefined : pxToRem(8),
                  display: size.xs ? 'flex' : undefined,
                  alignItems: size.xs ? 'center' : undefined
                }}
              />
              {!size.xs && <Typography.Text>{'Download'}</Typography.Text>}
            </VsTooltip>
          </VsButton>
        </Col>

        {showCtas && (
          <Col>
            {
              <VsButton
                onClick={() => openBulkUploadModel(true)}
                size={size.xs ? BUTTON_SIZES.squareIcon : BUTTON_SIZES.middle}
              >
                <VsTooltip title={size.xs && 'Upload'} placement="bottom" arrow>
                  <UploadOutlined
                    style={{
                      fontSize: size.xs ? pxToRem(16) : pxToRem(14),
                      paddingInlineEnd: size.xs ? undefined : pxToRem(8),
                      display: size.xs ? 'flex' : undefined,
                      alignItems: size.xs ? 'center' : undefined
                    }}
                  />
                  {!size.xs && <Typography.Text>{'Upload'}</Typography.Text>}
                </VsTooltip>
              </VsButton>
            }
          </Col>
        )}

        {showCtas && (
          <Col>
            <VsButton
              size={BUTTON_SIZES.middle}
              antButtonProps={{ type: 'primary' }}
              onClick={() => addFacilityModalOpen(true)}
            >
              <VsTooltip title={size.xs && 'Upload'} placement="bottom" arrow>
                <PlusOutlined
                  style={{
                    fontSize: pxToRem(14),
                    paddingInlineEnd: pxToRem(8)
                  }}
                />
                Add Drug
              </VsTooltip>
            </VsButton>
          </Col>
        )}
      </Row>
    </Row>
  );
};
