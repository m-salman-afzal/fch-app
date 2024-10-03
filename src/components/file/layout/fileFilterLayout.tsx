import { ChangeEvent, PropsWithChildren } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Col, FormInstance, Grid, Row } from 'antd';
import {
  DrawerFilterButton,
  FilterSearch,
  VsButton
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { pxToRem } from '@/utils/sharedUtils';

import { FileFilterForm } from '../forms/fileFilterForm';
import { useFileNavigationStyle } from '../styles/useFileNavigationStyle';

interface props {
  form: FormInstance<any>;
  onResetFilter: () => void;
  onApplyFilter: (values: any) => void;
  searchClicked: boolean;
  setSearchClicked: (value: boolean) => void;
  showFilterDrawer: boolean;
  setShowFilterDrawer: (value: boolean) => void;
  onSearchName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScreen: string;
  searchVal: string;
  setSearchVal: (val: string) => void;
}

const { useBreakpoint } = Grid;

export const FileFilterLayout: React.FC<PropsWithChildren<props>> = ({
  onResetFilter,
  onApplyFilter,
  form,
  searchClicked,
  setSearchClicked,
  onSearchName,
  onScreen,
  searchVal,
  setSearchVal
}) => {
  const size = useBreakpoint();
  const { fileHeading } = useFileNavigationStyle();

  return (
    <>
      <Row
        justify={size.xs ? 'space-between' : 'end'}
        align={'middle'}
        style={{
          display: 'flex',
          alignItems: 'centre'
        }}
      >
        {size.xs && <Col className={fileHeading}>File Manager</Col>}
        <Col>
          <Row
            style={{
              gap: pxToRem(8),
              marginBlock: size.xs ? pxToRem(8) : undefined
            }}
            align={'middle'}
          >
            <Col>
              {size.xs && !searchClicked ? (
                <VsButton
                  size={BUTTON_SIZES.squareIcon}
                  onClick={() => setSearchClicked(true)}
                >
                  <SearchOutlined />
                </VsButton>
              ) : (
                <FilterSearch
                  placeholder="Search"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    onSearchName(e);
                    setSearchVal(e.target.value);
                  }}
                  onBlur={() => setSearchClicked(false)}
                  autoFocus={searchClicked}
                  width={pxToRem(250)}
                  value={searchVal}
                />
              )}
            </Col>
            <Col>
              <DrawerFilterButton
                onClickApply={onApplyFilter}
                handleReset={onResetFilter}
                formRef={form}
                isIcon={size.xs}
              >
                <div
                  style={{
                    paddingInline: pxToRem(16)
                  }}
                >
                  <FileFilterForm form={form} onScreen={onScreen} />
                </div>
              </DrawerFilterButton>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
