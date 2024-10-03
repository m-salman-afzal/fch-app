import { FC, useState } from 'react';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Dropdown, Grid, Row } from 'antd';
import { FilterSearch, VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TCartData } from '@/types/cartTypes';
import { SelectOption } from '@/types/commonTypes';

import useCookies from '@/hooks/useCookies';
import { PERMISSIONS_TYPES } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

const { useBreakpoint } = Grid;
interface props {
  cartData: SelectOption[];
  selectedCart: undefined | SelectOption;
  onCartChange: (cart: string) => void;
  onSubmitClick: () => void;
  onSearch: (searchText: string) => void;
}

export const InventoryActions: FC<props> = ({
  cartData,
  selectedCart,
  onCartChange,
  onSubmitClick,
  onSearch
}) => {
  const [isSearching, setSearching] = useState(false);
  const { getDataFromCookie } = useCookies();
  const size = useBreakpoint();
  const isWriteAccess =
    getDataFromCookie()?.rbac.controlLogBookAdminister ===
    PERMISSIONS_TYPES.WRITE;

  const onBlur = () => {
    if (size.xs && isSearching) {
      setSearching(false);
    }
  };

  return (
    <Row justify={size.xs ? 'start' : 'end'} gutter={8}>
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
            width={pxToRem(254)}
            onBlur={onBlur}
            placeholder={'Search'}
            onChange={e => onSearch(e.target.value)}
          />
        )}
      </Col>
      <Col>
        <Dropdown
          trigger={['click']}
          menu={{
            selectable: true,
            items: cartData,
            onClick: cart => onCartChange(cart.key),
            selectedKeys: selectedCart ? [selectedCart.key] : ['']
          }}
        >
          <VsButton size={BUTTON_SIZES.middle}>
            Select Cart <DownOutlined />
          </VsButton>
        </Dropdown>{' '}
      </Col>

      <Col>
        {isWriteAccess && (
          <VsButton
            onClick={onSubmitClick}
            antButtonProps={{ type: 'primary' }}
            size={BUTTON_SIZES.middle}
          >
            Submit
          </VsButton>
        )}
      </Col>
    </Row>
  );
};
