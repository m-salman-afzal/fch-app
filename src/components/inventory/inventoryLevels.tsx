import { threadId } from 'worker_threads';
import { useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, Row, Slider, Typography } from 'antd';
import { pxToRem } from 'vs-design-components/src/utils/sharedUtils';

import InventoryLevelsProgressBar from './inventoryLevelProgressBar';
import { useInventoryLevelsStyle } from './useInventoryLevelsStyle';

interface props {
  threshold: number;
  parLevel: number;
  quantity: number;
  min: number;
  max: number;
}
function getGradientColor(percentage: number) {
  const startColor = [135, 208, 104];
  const endColor = [255, 204, 199];

  const midColor = startColor.map((start, i) => {
    const end = endColor[i];
    const delta = end - start;

    return (start + delta * percentage).toFixed(0);
  });

  return `rgb(${midColor.join(',')})`;
}
const InventoryLevels: React.FC<props> = ({
  parLevel,
  threshold,
  quantity,
  min,
  max
}) => {
  const { inventoryLevelsTitle, inventoryOnHandText, minMaxFlex, minMaxText } =
    useInventoryLevelsStyle();

  return (
    <div style={{ width: '100%' }}>
      <Row>
        <div>
          <Typography.Title className={inventoryLevelsTitle}>
            Level
          </Typography.Title>
          <Typography.Text className={inventoryOnHandText}>
            {quantity > 0 && parLevel && threshold ? (
              <>
                Inventory on hand: <strong>{quantity?.toLocaleString()}</strong>
              </>
            ) : !parLevel || !threshold ? (
              <>
                Levels not defined
                <ExclamationCircleOutlined
                  style={{ color: '#FAAD14', marginInlineStart: pxToRem(5) }}
                />
              </>
            ) : (
              <>
                No inventory on hand
                <ExclamationCircleOutlined
                  style={{ color: '#FAAD14', marginInlineStart: pxToRem(5) }}
                />
              </>
            )}
          </Typography.Text>
          <div className={minMaxFlex}>
            <Typography.Text className={minMaxText}>
              Min: <strong>{min?.toLocaleString() ?? '--'}</strong>
            </Typography.Text>
            <Typography.Text className={minMaxText}>
              Max: <strong>{max?.toLocaleString() ?? '--'}</strong>
            </Typography.Text>
          </div>
        </div>
      </Row>
      <Row>
        <Col span={24}>
          <InventoryLevelsProgressBar
            quantity={quantity}
            threshold={threshold}
            par={parLevel}
          />
        </Col>
      </Row>
    </div>
  );
};

export default InventoryLevels;
