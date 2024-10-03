import { Col, Row, Typography } from 'antd';
import { FilterSearch, VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import { TCartFullfillmentPick } from '@/types/cartFulfillmentTypes';

import ReviewPickListModal from '@/components/cartFulfillment/pick/reviewPickListModal';

import useCookies from '@/hooks/useCookies';
import { PERMISSION_TYPES_BACKEND } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

interface props {
  onSearchPick: (e: any) => void;
  selectedData: TCartFullfillmentPick[];
  onClickClear: () => void;
  onProcess: () => Promise<void>;
  isLoading: boolean;
  search: string;
}

const PickActions: React.FC<props> = ({
  onSearchPick,
  selectedData,
  onClickClear,
  onProcess,
  isLoading,
  search
}) => {
  const isSmall = window.screen.width <= 576;
  const admin = useCookies().getDataFromCookie();
  const permission = admin.rbac.cartRequestDrugs;

  return (
    <Row justify={'end'} align={'middle'}>
      {selectedData.length > 0 && !isSmall && (
        <Col style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Text style={{ fontSize: pxToRem(12) }}>
            {selectedData.length}{' '}
            {`${selectedData.length > 1 ? 'items' : 'item'} selected`}
          </Typography.Text>
          <VsButton
            antButtonProps={{
              type: 'link'
            }}
            style={{
              textDecoration: 'underline',
              fontSize: pxToRem(12),
              lineHeight: 1.57
            }}
            size={BUTTON_SIZES.small}
            onClick={onClickClear}
          >
            Clear
          </VsButton>
        </Col>
      )}
      <Col
        style={{ display: 'flex', justifyContent: 'flex-end' }}
        xs={isSmall ? 24 : undefined}
      >
        {!isSmall && (
          <FilterSearch
            placeholder={'Search Drug'}
            onChange={onSearchPick}
            value={search}
          />
        )}

        {isSmall && (
          <FilterSearch
            onChange={onSearchPick}
            autoFocus={false}
            placeholder="Search Drug"
            width={'100%'}
            maxWidth={pxToRem(500)}
            value={search}
          />
        )}
        {selectedData.length > 0 &&
          permission === PERMISSION_TYPES_BACKEND.WRITE && (
            <ReviewPickListModal
              selectedData={selectedData}
              onClick={() => {}}
              onCloseModal={() => {}}
              onProcess={onProcess}
              isLoading={isLoading}
            />
          )}
      </Col>
      {selectedData.length > 0 && isSmall && (
        <Col
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBlockStart: pxToRem(10)
          }}
          xs={24}
        >
          <Typography.Text style={{ fontSize: pxToRem(12) }}>
            {selectedData.length}{' '}
            {`${selectedData.length > 1 ? 'items' : 'item'} selected`}
          </Typography.Text>
          <VsButton
            antButtonProps={{
              type: 'link'
            }}
            style={{ textDecoration: 'underline', fontSize: pxToRem(12) }}
            size={BUTTON_SIZES.small}
            onClick={onClickClear}
          >
            Clear
          </VsButton>
        </Col>
      )}
    </Row>
  );
};
export default PickActions;
