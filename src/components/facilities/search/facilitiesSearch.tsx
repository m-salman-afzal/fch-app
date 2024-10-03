import { FC } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Grid, Row, Typography } from 'antd';
import { FilterSearch, VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import useCookies from '@/hooks/useCookies';
import { PERMISSION_TYPES_BACKEND } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

interface Props {
  addFacilityModalOpen: (val: boolean) => void;
  handleFilterInput: (val: string) => void;
}
const { useBreakpoint } = Grid;

export const FacilitiesSearch: FC<Props> = ({
  handleFilterInput,
  addFacilityModalOpen
}) => {
  const size = useBreakpoint();
  const admin = useCookies().getDataFromCookie();

  return (
    <Row
      justify="space-between"
      style={size.xs ? { paddingInline: pxToRem(20), gap: pxToRem(16) } : {}}
    >
      <Row>
        {size.xs && (
          <Typography.Text style={{ fontSize: pxToRem(16), fontWeight: 600 }}>
            Facilities
          </Typography.Text>
        )}
      </Row>
      <Row justify="end" gutter={[8, 8]}>
        <Col>
          <FilterSearch
            placeholder="Search"
            onChange={e => {
              handleFilterInput(e.target.value);
            }}
          />
        </Col>

        {admin.rbac.facilities === PERMISSION_TYPES_BACKEND.WRITE && (
          <Col>
            <VsButton
              antButtonProps={{
                type: 'primary',
                icon: <PlusOutlined />
              }}
              onClick={() => addFacilityModalOpen(true)}
              size={BUTTON_SIZES.middle}
            >
              Add Facility
            </VsButton>
          </Col>
        )}
      </Row>
    </Row>
  );
};
