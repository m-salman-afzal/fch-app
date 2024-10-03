import { useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
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

const MobileCartActions: React.FC<props> = ({
  cartCount,
  onSearchCart,
  onOpenModal
}) => {
  const [isSearching, setSearching] = useState<boolean>(false);
  const admin = useCookies().getDataFromCookie();
  const permission = admin.rbac.carts;
  const blurSearch = (e: any) => {
    if (e.target.value.length === 0) {
      setSearching(false);
    }
  };

  return (
    <div
      style={{
        paddingInline: pxToRem(20)
      }}
    >
      <Row>
        <Typography.Text
          style={{
            fontWeight: 600,
            fontSize: pxToRem(16),
            marginBlockEnd: pxToRem(2)
          }}
        >
          Cart Assignment
        </Typography.Text>
      </Row>
      <Row justify={'space-between'}>
        {!isSearching && (
          <div>
            <Typography.Text
              style={{
                fontWeight: 400,
                fontSize: pxToRem(14),
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
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end'
          }}
        >
          {!isSearching ? (
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
              onBlur={blurSearch}
              onChange={onSearchCart}
              autoFocus={true}
              placeholder="Search User"
              width={'100%'}
            />
          )}
          {permission === PERMISSION_TYPES_BACKEND.WRITE && (
            <VsButton
              antButtonProps={{
                type: 'primary',
                icon: <PlusOutlined />
              }}
              onClick={onOpenModal}
              style={{ marginInlineStart: pxToRem(8), width: 'fit-content' }}
              size={BUTTON_SIZES.middle}
            >
              Add Med Cart
            </VsButton>
          )}
        </div>
      </Row>
    </div>
  );
};

export default MobileCartActions;
