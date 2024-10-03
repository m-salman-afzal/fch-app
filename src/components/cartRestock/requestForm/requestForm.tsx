import { FC, useCallback, useEffect, useState } from 'react';
import { Col, Form, FormInstance, Grid, Radio, Row, Typography } from 'antd';
import debounce from 'lodash.debounce';
import {
  ErrorMessage,
  VsButton,
  VsFormItem,
  VsSelectFormItem
} from 'vs-design-components';
import { VsSelectMobileFormItem } from 'vs-design-components/src/Components/Select';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { SelectOption } from '@/types/commonTypes';
import { TRequestForm } from '@/types/requestFormDataTypes';

import { REQUEST_FORM_TYPE } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useCartRequestormStyle } from './useRequestFormStyle';

const { useBreakpoint } = Grid;
interface props {
  requestForm: any;
  cartData: SelectOption[];
  onRequestFormSubmit: (values: any) => void;
  onCartSearch: (value: string) => void;
  filteredCartList: SelectOption[];
  requestFormData: TRequestForm;
  isWriteAccess: boolean;
  searchText: string;
  onScrollCartList: () => void;
}
const DRUG_OPTION = [
  {
    label: 'Non-Controlled',
    value: 'non-controlled',
    key: 'non-controlled'
  },
  {
    label: 'Controlled',
    value: 'controlled',
    key: 'controlled'
  }
];
export const RequestForm: FC<props> = ({
  requestForm,
  cartData,
  requestFormData,
  isWriteAccess,
  searchText,
  onRequestFormSubmit,
  onCartSearch,
  onScrollCartList
}) => {
  const { container, formContainer, titleRow, requestFormRadioButton } =
    useCartRequestormStyle();
  const [selectedType, setSelectedType] = useState<any>();
  const initialFormValues = {
    type: requestFormData?.type || REQUEST_FORM_TYPE.STANDARD
  };
  const isSmall = window.screen.width <= 576;
  const size = useBreakpoint();

  const handleSearch = useCallback(
    debounce(e => {
      onCartSearch(e);
    }, 500),
    []
  );
  useEffect(() => {
    setSelectedType(requestFormData?.type);
    if (!requestFormData?.type) {
      setSelectedType(REQUEST_FORM_TYPE.STANDARD);
    }
  }, [requestFormData]);

  return (
    <Row justify={isSmall ? 'center' : 'start'}>
      <Col className={container} span={8} md={8} lg={8} xs={23}>
        <Row className={titleRow}>
          <Col span={24}>
            {' '}
            <Typography.Title style={{ fontSize: pxToRem(20), margin: 0 }}>
              {' '}
              Request Form
            </Typography.Title>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form
              initialValues={initialFormValues}
              className={formContainer}
              form={requestForm}
              onFinish={onRequestFormSubmit}
            >
              <Row
                justify={'center'}
                style={{
                  marginBlockEnd: pxToRem(16),
                  position: 'relative',
                  zIndex: 5
                }}
              >
                <Col span={24}>
                  <VsFormItem
                    formItemProps={{
                      required: true,
                      name: 'type',
                      style: {
                        marginBottom: pxToRem(16)
                      },
                      noStyle: true
                    }}
                  >
                    <Radio.Group
                      style={{ width: '100%' }}
                      onChange={e => setSelectedType(e.target.value)}
                      defaultValue={REQUEST_FORM_TYPE.STANDARD}
                      name="type"
                      className={requestFormRadioButton}
                    >
                      <Row gutter={11} justify={'space-evenly'}>
                        <Col span={12}>
                          <Radio value={REQUEST_FORM_TYPE.STANDARD} name="type">
                            Standard
                          </Radio>
                        </Col>
                        <Col span={12}>
                          <Radio
                            value={REQUEST_FORM_TYPE.AFTER_HOURS}
                            name="type"
                          >
                            After-hours
                          </Radio>
                        </Col>
                      </Row>
                    </Radio.Group>
                  </VsFormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ zIndex: 2 }}>
                  {size.md ? (
                    <VsSelectFormItem
                      onSearch={handleSearch}
                      optionFilterProp="children"
                      onPopupScroll={(event: any) => {
                        const dropdownElement = event.target;
                        if (
                          dropdownElement.scrollTop +
                            dropdownElement.offsetHeight ===
                          dropdownElement.scrollHeight
                        ) {
                          onScrollCartList();
                        }
                      }}
                      options={cartData}
                      showSearch={true}
                      filterOption={false}
                      placeholder="Select Cart"
                      formItemProps={{
                        name: 'cartId',
                        rules: [
                          {
                            required: true,
                            message: <ErrorMessage>Select Cart</ErrorMessage>
                          }
                        ],
                        style: {
                          marginBlockEnd: pxToRem(16)
                        }
                      }}
                    />
                  ) : (
                    <VsSelectMobileFormItem
                      onSearch={handleSearch}
                      placeholder="Cart"
                      optionFilterProp="children"
                      searchPlaceholder={'Select Cart'}
                      options={cartData}
                      scrollBottomCondition={true}
                      onScrollBottom={onScrollCartList}
                      formItemProps={{
                        name: 'cartId',
                        rules: [
                          {
                            required: true,
                            message: <ErrorMessage>Select Cart</ErrorMessage>
                          }
                        ],
                        style: {
                          marginBlockEnd: pxToRem(16)
                        }
                      }}
                      modalTitle="Select Cart"
                    />
                  )}
                </Col>
              </Row>
              {selectedType === REQUEST_FORM_TYPE.AFTER_HOURS && (
                <Row>
                  <Col span={24}>
                    {size.md ? (
                      <VsSelectFormItem
                        options={DRUG_OPTION}
                        placeholder="Select Type"
                        formItemProps={{
                          name: 'drugType',
                          rules: [
                            {
                              required: true,
                              message: <ErrorMessage>Select Type</ErrorMessage>
                            }
                          ],
                          style: {
                            marginBlockEnd: 16
                          }
                        }}
                      />
                    ) : (
                      <VsSelectMobileFormItem
                        placeholder="Type"
                        searchPlaceholder={'Search Type'}
                        options={DRUG_OPTION}
                        formItemProps={{
                          name: 'drugType',
                          rules: [
                            {
                              required: true,
                              message: <ErrorMessage>Select Type</ErrorMessage>
                            }
                          ],
                          style: {
                            marginBlockEnd: pxToRem(16)
                          }
                        }}
                        modalTitle="Select Type"
                      />
                    )}
                  </Col>
                </Row>
              )}
              <Row>
                <Col span={24}>
                  <VsButton
                    antButtonProps={{
                      disabled: !isWriteAccess,
                      type: 'primary',
                      htmlType: 'submit'
                    }}
                    size={BUTTON_SIZES.large}
                    style={{ width: '100%' }}
                  >
                    Select
                  </VsButton>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
