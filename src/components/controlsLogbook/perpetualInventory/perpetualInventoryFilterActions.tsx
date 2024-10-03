'use client';

import React, { FC } from 'react';
import {
  DownloadOutlined,
  DownOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Col, Dropdown, Form, Grid, Row, Typography } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import {
  FilterSearch,
  VsButton,
  VsFormItem,
  VsSelectFormItem,
  VsTooltip
} from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { SelectOption } from '@/types/commonTypes';

import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;

interface Props {
  searching: boolean;
  setSearching: (val: boolean) => void;
  onSearch: (val: any) => void;
  getCartsData: () => Promise<void>;
  cartsData: any[];
  setCartsData: (val: SelectOption[]) => void;
  selectedCart: string;
  onSelectCart: (val: any) => void;
  onClickDownload: (val: any) => void;
  formref: FormInstance;
  searchVal: string;
}

export const PerpetualInventoryActions: FC<Props> = ({
  searching,
  setSearching,
  onSearch,
  onSelectCart,
  selectedCart,
  cartsData,
  onClickDownload,
  formref,
  searchVal
}) => {
  const size = useBreakpoint();
  const blurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };

  return (
    <Col span={24}>
      <Row
        gutter={8}
        justify={'end'}
        style={{ height: pxToRem(32), marginInline: 0 }}
      >
        <Col style={{ height: pxToRem(32) }}>
          {size.xs && !searching ? (
            <VsButton
              onClick={() => {
                setSearching(true);
              }}
              size={BUTTON_SIZES.squareIcon}
            >
              <SearchOutlined style={{ fontSize: pxToRem(16) }} />
            </VsButton>
          ) : (
            <FilterSearch
              onBlur={blurSearch}
              value={searchVal}
              onChange={onSearch}
              autoFocus={size.xs}
              placeholder="Search"
              width={pxToRem(250)}
            />
          )}
        </Col>

        {cartsData.length > 0 && (
          <Col style={{ height: pxToRem(32), minWidth: pxToRem(120) }}>
            {/* <VsSelectFormItem
              showSearch={true}
              options={cartsData}
              onChange={(e: any) => {
                onSelectCart(e);
              }}
              height={pxToRem(32)}
              width={'100%'}
              externalShowLabel={false}
              filterOption={(input: any, option: any) => {
                return !!(
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
              defaultValue={cartsData[0].value}
            /> */}
            <Form form={formref}>
              <VsFormItem
                formItemProps={{
                  required: true,
                  name: 'cartId',
                  style: {
                    marginBottom: pxToRem(16)
                  },
                  noStyle: true
                }}
              >
                <Dropdown
                  trigger={['click']}
                  menu={{
                    selectable: true,
                    multiple: false,
                    items: cartsData,
                    onSelect: (value: any) => {
                      onSelectCart(value.selectedKeys[0]);
                    },
                    selectedKeys:
                      selectedCart.length > 0 ? [selectedCart] : ['All']
                  }}
                >
                  <VsButton
                    size={BUTTON_SIZES.middle}
                    antButtonProps={{
                      disabled: cartsData?.length === 0
                    }}
                  >
                    <VsTooltip title={size.xs && ''} placement="bottom" arrow>
                      Select Cart
                      <DownOutlined
                        style={{
                          fontSize: pxToRem(14),
                          paddingInlineStart: pxToRem(8)
                        }}
                      />
                    </VsTooltip>
                  </VsButton>
                </Dropdown>
              </VsFormItem>
            </Form>
          </Col>
        )}

        <Col style={{ height: pxToRem(32) }}>
          <VsButton
            onClick={onClickDownload}
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
      </Row>
    </Col>
  );
};
