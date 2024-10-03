import { FC, useState } from 'react';
import {
  FilterOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Button, Col, FormInstance, Grid, Row, Typography } from 'antd';
import {
  FilterSearch,
  VsButton,
  VsSelectFormItem,
  VsTooltip
} from 'vs-design-components/src/Components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import VsSegmented from '@/components/common/segmented/VsSegmented';

import useCookies from '@/hooks/useCookies';
import {
  COMMUNICATION_SCREENS,
  COMMUNICATION_SCREENS_MOBILE,
  PERMISSION_TYPES_BACKEND
} from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

interface Props {
  setFilterOpen: (val: boolean) => void;
  contactModalOpen: (val: boolean) => void;
  handleFilterInput: (val: string) => void;
  filterFormRef: FormInstance;
  searchFilters: any;
  setSearchFilters: (val: any) => void;
  onChangeScreen: (screen: string) => void;
  selectedScreen: string;
}

export const CommunicationNavigation: FC<Props> = ({
  setFilterOpen,
  contactModalOpen,
  handleFilterInput,
  filterFormRef,
  searchFilters,
  setSearchFilters,
  onChangeScreen,
  selectedScreen
}) => {
  const admin = useCookies().getDataFromCookie();
  const [inputText, setInputText] = useState('');
  const size = useBreakpoint();

  const [isSearching, setSearching] = useState<boolean>(false);
  const permission = admin.rbac.communication;

  const onChangeScreenState = (val: any) => {
    setSearchFilters({ ...searchFilters, currentPage: 1 });
    setInputText('');
    filterFormRef.resetFields();
    onChangeScreen(val);
  };

  const blurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };

  return (
    <div style={size.xs ? { paddingInline: pxToRem(20) } : {}}>
      <Row>
        {size.xs && (
          <Typography.Text style={{ fontSize: pxToRem(16), fontWeight: 600 }}>
            Communication
          </Typography.Text>
        )}
      </Row>

      <Row
        justify="space-between"
        style={{ gap: pxToRem(16), paddingTop: size.xs ? pxToRem(7) : '' }}
      >
        {size.xs ? (
          <Col span={24} style={{ height: pxToRem(32) }}>
            <VsSelectFormItem
              options={COMMUNICATION_SCREENS_MOBILE}
              onChange={onChangeScreen}
              height={pxToRem(32)}
              width={'100%'}
              externalShowLabel={false}
              defaultValue={COMMUNICATION_SCREENS_MOBILE[0].value}
            />
          </Col>
        ) : (
          <Col>
            <VsSegmented
              segmentedProps={{
                options: COMMUNICATION_SCREENS,
                defaultValue: COMMUNICATION_SCREENS[0]?.value,
                value: selectedScreen,
                onChange: onChangeScreenState,
                block: true,
                style: { width: pxToRem(449) }
              }}
            />
          </Col>
        )}
        <Row
          style={{
            gap: pxToRem(8),
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Col>
            {size.xs && !isSearching ? (
              <VsButton
                size={BUTTON_SIZES.squareIcon}
                onClick={() => {
                  setSearching(true);
                }}
              >
                <SearchOutlined />
              </VsButton>
            ) : (
              <FilterSearch
                placeholder="Search"
                onBlur={blurSearch}
                autoFocus={size.xs}
                onChange={e => {
                  handleFilterInput(e.target.value);
                  setInputText(e.target.value);
                }}
                value={inputText}
              />
            )}
          </Col>
          {(selectedScreen === COMMUNICATION_SCREENS[0].value ||
            selectedScreen === COMMUNICATION_SCREENS[1].value) && (
            <Row gutter={[8, 8]}>
              <Col>
                <VsButton
                  size={size.xs ? BUTTON_SIZES.squareIcon : BUTTON_SIZES.middle}
                  onClick={() => setFilterOpen(true)}
                >
                  <FilterOutlined
                    style={{
                      fontSize: pxToRem(14)
                    }}
                  />
                  {!size.xs && 'Filters'}
                </VsButton>
              </Col>

              {permission === PERMISSION_TYPES_BACKEND.WRITE && (
                <Col>
                  <VsButton
                    antButtonProps={{
                      type: 'primary',
                      icon: (
                        <PlusOutlined
                          style={{
                            fontSize: pxToRem(14)
                          }}
                        />
                      )
                    }}
                    size={BUTTON_SIZES.middle}
                    onClick={() => contactModalOpen(true)}
                  >
                    <VsTooltip title={''} placement="bottom" arrow>
                      Add Contact
                    </VsTooltip>
                  </VsButton>
                </Col>
              )}
            </Row>
          )}
        </Row>
      </Row>
    </div>
  );
};
