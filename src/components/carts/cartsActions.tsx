import { PlusOutlined } from '@ant-design/icons';
import { Col, Row, Typography } from 'antd';
import { FilterSearch, VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import useCookies from '@/hooks/useCookies';
import { PERMISSION_TYPES_BACKEND } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

interface props {
  cartCount: number;
  onSearchCart: (e: any) => void;
  onOpenModal: () => void;
}

const CartsActions: React.FC<props> = ({
  cartCount,
  onSearchCart,
  onOpenModal
}) => {
  const admin = useCookies().getDataFromCookie();
  const permission = admin.rbac.carts;

  return (
    <Row justify={'space-between'}>
      <div>
        <Typography.Text
          style={{
            fontWeight: 600,
            fontSize: pxToRem(16),
            color: '#00000073'
          }}
        >
          Cart Count:{' '}
          <span
            style={{
              fontWeight: 600,
              fontSize: pxToRem(16),
              color: 'black'
            }}
          >
            {cartCount}
          </span>
        </Typography.Text>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end'
        }}
      >
        <FilterSearch placeholder={'Search Cart'} onChange={onSearchCart} />

        {permission === PERMISSION_TYPES_BACKEND.WRITE && (
          <VsButton
            antButtonProps={{
              type: 'primary',
              icon: <PlusOutlined />
            }}
            size={BUTTON_SIZES.middle}
            style={{ marginInlineStart: pxToRem(8), width: 'fit-content' }}
            onClick={onOpenModal}
          >
            Add Med Cart
          </VsButton>
        )}
      </div>
    </Row>
  );
};

export default CartsActions;
