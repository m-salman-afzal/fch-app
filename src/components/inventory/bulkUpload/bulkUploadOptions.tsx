import { FC } from 'react';
import { ArrowRightOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Col, Grid, Row, Typography } from 'antd';
import Image from 'next/image';
import { VsButton } from 'vs-design-components';
import { BUTTON_SIZES } from 'vs-design-components/src/utils/constants';

import RecevieInventoryIcon from '@/assets/icons/inventory/receiveInventoryIcon.svg';
import SetLevelIcon from '@/assets/icons/inventory/setLevel.svg';
import { INVENTORY_BULK_OPTIONS } from '@/utils/constants';
import { pxToRem } from '@/utils/sharedUtils';

import { useInventoryBulkUploadStyle } from './useInventoryBulkUpload';

const { useBreakpoint } = Grid;

interface props {
  selectedOption: string;
  setSelectedOption: (options: string) => void;
  handleNext: () => void;
}

export const BulkUploadOptions: FC<props> = ({
  selectedOption,
  setSelectedOption,
  handleNext
}) => {
  const { optionTile, selectedTile } = useInventoryBulkUploadStyle();
  const size = useBreakpoint();
  const { RECEIVE_INVENTORY, SET_LEVEL } = INVENTORY_BULK_OPTIONS;

  return (
    <Row
      justify={'space-between'}
      style={{ paddingInline: pxToRem(20) }}
      gutter={[0, 24]}
    >
      <Col
        className={`${optionTile} ${selectedOption === RECEIVE_INVENTORY && selectedTile}`}
        onClick={() => setSelectedOption(RECEIVE_INVENTORY)}
      >
        <CheckCircleFilled />
        <Image
          src={RecevieInventoryIcon}
          width={42}
          height={42}
          alt="safe icon"
        />
        <div>
          <Typography.Text style={{ fontWeight: 600 }}>
            Receive Inventory
          </Typography.Text>
        </div>
      </Col>
      <Col
        className={`${optionTile} ${selectedOption === SET_LEVEL && selectedTile}`}
        onClick={() => setSelectedOption(SET_LEVEL)}
      >
        <CheckCircleFilled />
        <Image src={SetLevelIcon} width={42} height={42} alt="safe icon" />
        <div>
          <Typography.Text style={{ fontWeight: 600 }}>
            Set Levels or Central Supply
          </Typography.Text>
        </div>
      </Col>
      <Col span={24}>
        <Row justify={'end'}>
          <Col style={{ width: size.xs ? '100%' : 'auto' }}>
            <VsButton
              onClick={() => handleNext()}
              style={{ width: size.xs ? '100%' : 'auto' }}
              size={BUTTON_SIZES.large}
              antButtonProps={{
                type: 'primary'
              }}
            >
              Next <ArrowRightOutlined />
            </VsButton>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
