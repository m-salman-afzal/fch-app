import { FC, useEffect } from 'react';
import { CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { Col, Divider, Grid, Modal, Pagination, Row, Typography } from 'antd';
import Image from 'next/image';
import { BasicInput, VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import {
  TCartRequestDrug,
  TCartRequestLog
} from '@/types/cartFulfillmentTypes';

import ColorfulPill from '@/components/common/colorfulPill/colorfulPill';
import { usePillStyle } from '@/components/common/colorfulPill/usePillStyle';

import {
  DRUG_CLASSES,
  RESTOCKLOGS_STATUS_TYPES,
  RESTOCKLOGS_TYPES
} from '@/containers/carFulfillment/constants';
import {
  DATE_FORMATS,
  getFormattedDateInEST
} from '@/utils/dateFormatsTimezones';
import { pxToRem } from '@/utils/sharedUtils';

import { ReStockLogTable } from './reStockLogsTable/reStockLogTable';
import { useReStockLogTableStyle } from './reStockLogsTable/useReStockLogTableStyle';

const { useBreakpoint } = Grid;

interface Props {
  showModal: boolean;
  handleCancel: () => void;
  isLoading: boolean;
  cart: TCartRequestLog;
  tableData: TCartRequestDrug[];
  pagination: Record<string, any>;
  onChangePagination: (page: number, pageSize: number) => void;
  onClickDownload: (restockLogType: string, restockDrugsList: any) => void;
  getType: (val: string) => string;
}
interface CartDetailsProps {
  cart: TCartRequestLog;
  getType: (val: string) => string;
}

const CartDetails: FC<CartDetailsProps> = ({ cart, getType }) => {
  const size = useBreakpoint();
  const { greenPill, yellowPill, greyPill, redPill, bluePill } = usePillStyle();

  return (
    <Col
      style={{
        border: `${pxToRem(1)} solid #EBEBEB`,
        padding: pxToRem(16)
      }}
    >
      <Col>
        <Row justify={'space-between'}>
          <Col>
            <Typography.Title
              style={{
                marginBlock: 0,
                fontSize: pxToRem(14)
              }}
            >
              {'Date & Time'}
            </Typography.Title>
          </Col>
          <Col>
            <div>
              {getFormattedDateInEST({
                date: cart?.createdAt,
                format: DATE_FORMATS.MDY_TIME
              })}
            </div>
          </Col>
        </Row>

        <Row>
          <Divider
            style={{
              margin: `${pxToRem(11.8)} 0 ${pxToRem(11.8)} 0`
            }}
          />
        </Row>
        <Row justify={'space-between'}>
          <Col>
            <Typography.Title
              style={{
                marginBlock: 0,
                fontSize: pxToRem(14)
              }}
            >
              {'Type'}
            </Typography.Title>
          </Col>
          <Col>
            {cart.type !== 'PICK' ? (
              <ColorfulPill
                className={cart.isControlled ? yellowPill : greyPill}
                text={cart.isControlled ? 'Controlled' : 'Non-Controlled'}
                style={{ margin: 0 }}
              />
            ) : (
              <div>{'-'}</div>
            )}
          </Col>
        </Row>

        <Row>
          <Divider
            style={{
              margin: `${pxToRem(11.8)} 0 ${pxToRem(11.8)} 0`
            }}
          />
        </Row>
        <Row justify={'space-between'}>
          <Col>
            <Typography.Title
              style={{
                marginBlock: 0,
                fontSize: pxToRem(14)
              }}
            >
              {'User'}
            </Typography.Title>
          </Col>
          <Col>
            <div>{`${cart.admin.lastName}, ${cart.admin.firstName}`}</div>
          </Col>
        </Row>

        <Row>
          <Divider
            style={{
              margin: `${pxToRem(11.8)} 0 ${pxToRem(11.8)} 0`
            }}
          />
        </Row>
        <Row justify={'space-between'}>
          <Col>
            <Typography.Title
              style={{
                marginBlock: 0,
                fontSize: pxToRem(14)
              }}
            >
              {'Status'}
            </Typography.Title>
          </Col>
          <Col>
            <ColorfulPill
              className={
                cart.type === 'PICK'
                  ? bluePill
                  : cart.type === 'DELETE'
                    ? redPill
                    : greenPill
              }
              key={cart.type}
              text={getType(cart.type)}
              style={{ margin: 0 }}
            />
          </Col>
        </Row>

        <Row>
          <Divider
            style={{
              margin: `${pxToRem(11.8)} 0 ${pxToRem(11.8)} 0`
            }}
          />
        </Row>
        <Row justify={'space-between'}>
          <Col>
            <Typography.Title
              style={{
                marginBlock: 0,
                fontSize: pxToRem(14)
              }}
            >
              {'Drug Count'}
            </Typography.Title>
          </Col>
          <Col>
            <div>{cart.drugCount}</div>
          </Col>
        </Row>

        <Row>
          <Divider
            style={{
              margin: `${pxToRem(11.8)} 0 ${pxToRem(11.8)} 0`
            }}
          />
        </Row>
        <Row justify={'space-between'}>
          <Col>
            <Typography.Title
              style={{
                marginBlock: 0,
                fontSize: pxToRem(14)
              }}
            >
              {'Total Units'}
            </Typography.Title>
          </Col>
          <Col>
            <div>{cart.totalUnit}</div>
          </Col>
        </Row>
      </Col>
    </Col>
  );
};

export const ReStockLogModal: FC<Props> = ({
  showModal,
  handleCancel,
  isLoading: loading,
  cart,
  tableData,
  pagination,
  onChangePagination,
  onClickDownload,
  getType
}) => {
  const size = useBreakpoint();
  const { withoutCartContainer, withCartContainer } = useReStockLogTableStyle();

  const iswithCart = () => {
    if (cart.requestLogType === RESTOCKLOGS_TYPES.STANDARD) {
      if (cart.type === RESTOCKLOGS_STATUS_TYPES.PICKED) return false;
      if (
        (!cart.isControlled &&
          cart.type === RESTOCKLOGS_STATUS_TYPES.ALLOCATION) ||
        cart.type === RESTOCKLOGS_STATUS_TYPES.DELETED
      ) {
        return true;
      }
    }

    if (cart.requestLogType === RESTOCKLOGS_TYPES.AFTER_HOURS) {
      return false;
    }
  };

  const getTableStyle = () => {
    return iswithCart() ? withCartContainer : withoutCartContainer;
  };

  const getTableColumns = () => {
    return iswithCart() ? WithCartColumns : WithoutCartColumns;
  };

  const WithoutCartColumns: any = [
    {
      title: 'Drug',
      render: (value: TCartRequestDrug) => <div>{value.drug}</div>
    },
    {
      title: 'Unit',
      render: (value: TCartRequestDrug) => <div>{value.totalUnits}</div>
    }
  ];

  const WithCartColumns: any = [
    ...WithoutCartColumns,
    {
      title: 'Cart',
      render: (value: TCartRequestDrug) => <div>{value.cart}</div>
    }
  ];

  const isControlled =
    cart.isControlled &&
    (cart.type === RESTOCKLOGS_STATUS_TYPES.ALLOCATION ||
      cart.type === RESTOCKLOGS_STATUS_TYPES.AFTER_HOUR);

  return (
    <Modal
      open={showModal}
      destroyOnClose={true}
      footer={null}
      style={{
        maxWidth: 'none',
        margin: 0
      }}
      title={
        <Row justify={'space-between'} style={{ paddingInline: pxToRem(20) }}>
          <Col
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Typography.Title
              style={{
                marginBlock: 0,
                fontSize: pxToRem(20)
              }}
            >
              {'Restock Log'}
            </Typography.Title>
          </Col>
          <Row>
            {!isControlled && (
              <Col>
                <VsButton
                  onClick={() => {
                    onClickDownload(
                      cart.requestLogType,
                      tableData.map(td => ({ ...td, dateTime: cart.createdAt }))
                    );
                  }}
                  antButtonProps={{
                    type: 'primary',
                    htmlType: 'submit',
                    icon: <DownloadOutlined />,
                    loading: false
                  }}
                  size={BUTTON_SIZES.large}
                  style={{ height: pxToRem(32) }}
                >
                  {!size.xs ? 'Download' : ''}
                </VsButton>
              </Col>
            )}
            <Col style={{ paddingInlineStart: pxToRem(12) }}>
              <VsButton
                onClick={handleCancel}
                antButtonProps={{
                  type: 'text',
                  icon: (
                    <CloseOutlined
                      style={{ fontSize: pxToRem(26), color: '#00000073' }}
                    />
                  )
                }}
                size={BUTTON_SIZES.squareIcon}
                style={{ height: pxToRem(32) }}
              ></VsButton>
            </Col>
          </Row>
        </Row>
      }
      maskClosable={false}
      centered
      width={
        size.xl
          ? isControlled
            ? pxToRem(1116)
            : pxToRem(1052)
          : size.lg
            ? isControlled
              ? pxToRem(760)
              : pxToRem(870)
            : '100vw'
      }
      closeIcon={
        <CloseOutlined
          style={{ paddingTop: pxToRem(5), fontSize: pxToRem(26) }}
        />
      }
      onCancel={handleCancel}
      closable={false}
    >
      <div>
        <Divider
          style={{
            margin: `${pxToRem(12)} 0 ${pxToRem(20)} 0`
          }}
        />

        {!isControlled && (
          <Row
            style={{
              paddingInline: pxToRem(20),
              gap: !size.md ? pxToRem(20) : undefined
            }}
          >
            <Col
              xs={24}
              sm={24}
              md={10}
              xl={8}
              style={{
                paddingInlineEnd: !size.md ? undefined : 16
              }}
            >
              <CartDetails cart={cart} getType={getType} />
            </Col>
            <Col
              xs={24}
              sm={24}
              md={14}
              xl={16}
              style={{ width: pxToRem(664) }}
            >
              <ReStockLogTable
                tableColumns={getTableColumns()}
                tableData={tableData}
                pagination={pagination}
                onChangePagination={onChangePagination}
                isLoading={false}
                tableStyle={getTableStyle()}
                isModalTable={true}
              />
            </Col>
          </Row>
        )}

        {isControlled && (
          <Row
            style={{
              paddingInline: pxToRem(20),
              gap: !size.md ? pxToRem(20) : undefined
            }}
          >
            <Col
              xs={24}
              sm={24}
              md={12}
              xl={8}
              style={{
                paddingInlineEnd: !size.md
                  ? undefined
                  : size.xl
                    ? pxToRem(26.67)
                    : pxToRem(26)
              }}
            >
              <CartDetails cart={cart} getType={getType} />
            </Col>
            <Col xs={24} sm={24} md={12} xl={16} style={{}}>
              <Row
                style={{
                  paddingInlineStart: !size.md
                    ? undefined
                    : size.xl
                      ? pxToRem(9.33)
                      : pxToRem(6),
                  paddingInlineEnd: !size.md ? undefined : pxToRem(20),
                  gap: size.xl ? undefined : pxToRem(24)
                }}
              >
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  xl={12}
                  style={{
                    paddingInlineEnd: size.xl ? pxToRem(12) : undefined
                  }}
                >
                  <Row
                    style={{
                      paddingBlockEnd: pxToRem(16)
                    }}
                  >
                    <BasicInput
                      placeholder={'Drug'}
                      width={'100%'}
                      value={tableData[0]?.drug}
                      readOnly={true}
                      externalShowLabel={true}
                      setExternalShowLabel={() => {}}
                    />
                  </Row>
                  <Row
                    style={{
                      paddingBlockEnd: pxToRem(16)
                    }}
                  >
                    <Col
                      span={12}
                      style={{
                        paddingInlineEnd: pxToRem(8)
                      }}
                    >
                      <BasicInput
                        placeholder={'Pkg Qty'}
                        width={'100%'}
                        value={`${(cart.totalUnit / (tableData[0]?.unitsPkg ?? 1)).toFixed(2)}`}
                        readOnly={true}
                        externalShowLabel={true}
                        setExternalShowLabel={() => {}}
                      />
                    </Col>
                    <Col
                      span={12}
                      style={{
                        paddingInlineStart: pxToRem(8)
                      }}
                    >
                      <BasicInput
                        placeholder={'Units'}
                        width={'100%'}
                        value={`${cart.totalUnit}`}
                        readOnly={true}
                        externalShowLabel={true}
                        setExternalShowLabel={() => {}}
                      />
                    </Col>
                  </Row>

                  <Col
                    style={{
                      border: '1px solid #EBEBEB',
                      borderRadius: pxToRem(4),
                      padding: pxToRem(16)
                    }}
                  >
                    <Row>
                      <Typography.Title
                        style={{
                          marginBlock: 0,
                          fontSize: pxToRem(20)
                        }}
                      >
                        {'User Signature'}
                      </Typography.Title>
                    </Row>
                    <Row>
                      <Divider
                        style={{
                          margin: `${pxToRem(16)} 0 ${pxToRem(16)} 0`
                        }}
                      />
                    </Row>
                    <Row
                      style={{
                        background: '#00000005'
                      }}
                    >
                      <Image
                        className={''}
                        alt={'Receiver Signature'}
                        src={cart.receiverSignature ?? ''}
                        width={298}
                        height={206}
                        priority={true}
                      />
                    </Row>
                    <Row>
                      <Divider
                        style={{
                          margin: `${pxToRem(16)} 0 ${pxToRem(16)} 0`
                        }}
                      />
                    </Row>
                    <Row>
                      <BasicInput
                        placeholder={'User Name'}
                        width={'100%'}
                        value={cart.receiverName}
                        readOnly={true}
                        externalShowLabel={true}
                        setExternalShowLabel={() => {}}
                      />
                    </Row>
                  </Col>
                </Col>

                <Col
                  xs={24}
                  sm={24}
                  xl={12}
                  style={{
                    paddingInlineStart: size.xl ? pxToRem(12) : undefined
                  }}
                >
                  <Row
                    style={{
                      paddingBlockEnd: pxToRem(16)
                    }}
                  >
                    <BasicInput
                      placeholder={'Cart'}
                      width={'100%'}
                      value={cart.cart.cart}
                      readOnly={true}
                      externalShowLabel={true}
                      setExternalShowLabel={() => {}}
                    />
                  </Row>
                  <Row
                    style={{
                      paddingBlockEnd: pxToRem(16)
                    }}
                  >
                    <Col
                      span={
                        tableData[0]?.isControlled &&
                        tableData[0]?.drugClass !== DRUG_CLASSES.ARV
                          ? 12
                          : 24
                      }
                      style={{
                        paddingInlineEnd: pxToRem(8)
                      }}
                    >
                      <BasicInput
                        placeholder={'Controlled ID'}
                        width={'100%'}
                        value={tableData[0]?.controlledId as string}
                        readOnly={true}
                        externalShowLabel={true}
                        setExternalShowLabel={() => {}}
                      />
                    </Col>
                    {tableData[0]?.isControlled &&
                      tableData[0]?.drugClass !== DRUG_CLASSES.ARV && (
                        <Col
                          span={12}
                          style={{
                            paddingInlineStart: pxToRem(8)
                          }}
                        >
                          <BasicInput
                            placeholder={'TR'}
                            width={'100%'}
                            value={tableData[0]?.tr}
                            readOnly={true}
                            externalShowLabel={true}
                            setExternalShowLabel={() => {}}
                          />
                        </Col>
                      )}
                  </Row>

                  <Col
                    style={{
                      border: '1px solid #EBEBEB',
                      borderRadius: pxToRem(4),
                      padding: pxToRem(16)
                    }}
                  >
                    <Row>
                      <Typography.Title
                        style={{
                          marginBlock: 0,
                          fontSize: pxToRem(20)
                        }}
                      >
                        {'Witness Signature'}
                      </Typography.Title>
                    </Row>
                    <Row>
                      <Divider
                        style={{
                          margin: `${pxToRem(16)} 0 ${pxToRem(16)} 0`
                        }}
                      />
                    </Row>
                    <Row
                      style={{
                        background: '#00000005'
                      }}
                    >
                      <Image
                        className={''}
                        alt={'Witness Signature'}
                        src={cart.witnessSignature ?? ''}
                        width={298}
                        height={206}
                        priority={true}
                      />
                    </Row>
                    <Row>
                      <Divider
                        style={{
                          margin: `${pxToRem(16)} 0 ${pxToRem(16)} 0`
                        }}
                      />
                    </Row>
                    <Row>
                      <BasicInput
                        placeholder={'Witness Name'}
                        width={'100%'}
                        value={cart.witnessName}
                        readOnly={true}
                        externalShowLabel={true}
                        setExternalShowLabel={() => {}}
                      />
                    </Row>
                  </Col>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </div>
    </Modal>
  );
};
